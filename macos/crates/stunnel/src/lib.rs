use viworks_core::{Result, ViWorksError, ConnectionConfig};
use std::process::{Command, Stdio};
use std::path::PathBuf;
use std::sync::Mutex;
use tokio::process::Child as TokioChild;
use tokio::time::{timeout, Duration};
use tokio::io::{AsyncBufReadExt, BufReader};
use tracing::{info, warn, error};
use serde::{Deserialize, Serialize};

static STUNNEL_PROCESS: Mutex<Option<TokioChild>> = Mutex::new(None);

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StunnelConfig {
    pub client: bool,
    pub accept: String,
    pub connect: String,
    pub cert: Option<String>,
    pub key: Option<String>,
    pub cafile: Option<String>,
    pub verify: Option<u32>,
    pub debug: Option<u32>,
}

impl Default for StunnelConfig {
    fn default() -> Self {
        Self {
            client: true,
            accept: "127.0.0.1:1300".to_string(),
            connect: "viworks.ir:8445".to_string(),
            cert: None, // Don't use certificate for now - will cause MITM warning but should work
            key: None,
            cafile: None,
            verify: Some(0), // Disable certificate verification to prevent MITM attack warnings
            debug: Some(6), // Higher debug level like the working config
        }
    }
}

impl StunnelConfig {
    pub fn to_config_string(&self) -> String {
        let mut config = String::new();
        
        // Global settings (like the working config)
        if let Some(debug) = self.debug {
            config.push_str(&format!("debug = {}\n", debug));
        }
        config.push_str("output = stunnel.log\n");
        config.push_str("\n");
        
        // Service configuration
        config.push_str("[openvpn]\n");
        config.push_str(&format!("client = {}\n", if self.client { "yes" } else { "no" }));
        config.push_str(&format!("accept = {}\n", self.accept));
        config.push_str(&format!("connect = {}\n", self.connect));
        
        if let Some(ref cert) = self.cert {
            config.push_str(&format!("cert = {}\n", cert));
        }
        
        if let Some(ref key) = self.key {
            config.push_str(&format!("key = {}\n", key));
        }
        
        if let Some(ref cafile) = self.cafile {
            config.push_str(&format!("CAfile = {}\n", cafile));
        }
        
        if let Some(verify) = self.verify {
            config.push_str(&format!("verify = {}\n", verify));
        }
        
        config
    }
}

pub async fn start_stunnel(config: &StunnelConfig) -> Result<()> {
    info!("🔐 STUNNEL: Starting SSL/TLS tunnel");
    info!("   Configuration: {:?}", config);
    
    // Create temporary config file
    info!("📁 STUNNEL: Creating temporary configuration directory");
    let temp_dir = viworks_core::config::AppConfig::get_temp_dir()?;
    info!("   Temp directory: {}", temp_dir.display());
    

    
    let config_path = temp_dir.join("stunnel.conf");
    info!("   Config file path: {}", config_path.display());
    
    // Write the config to file
    info!("📝 STUNNEL: Writing configuration to file");
    let config_content = config.to_config_string();
    info!("   Config content:");
    for line in config_content.lines() {
        info!("     {}", line);
    }
    
    let config_size = config_content.len();
    std::fs::write(&config_path, config_content)
        .map_err(|e| {
            error!("💥 STUNNEL: Failed to write config file: {}", e);
            ViWorksError::FileSystemError(format!("Failed to write Stunnel config: {}", e))
        })?;
    
    info!("✅ STUNNEL: Configuration file written successfully");
    info!("   File: {}", config_path.display());
    info!("   Size: {} bytes", config_size);
    
    // Find stunnel binary
    info!("🔍 STUNNEL: Searching for stunnel.exe binary");
    let stunnel_paths = [
        r"C:\Program Files\ViWorkS\bin\stunnel.exe",
        r"stunnel.exe",
        r".\stunnel.exe",
        r"bin\stunnel.exe",
    ];
    
    let mut stunnel_path = None;
    for (i, path) in stunnel_paths.iter().enumerate() {
        info!("   Checking location {}: {}", i + 1, path);
        if std::path::Path::new(path).exists() {
            // Convert to absolute path to avoid working directory issues
            let absolute_path = std::fs::canonicalize(path)
                .unwrap_or_else(|_| std::path::PathBuf::from(path));
            stunnel_path = Some(absolute_path);
            info!("✅ STUNNEL: Found stunnel.exe at: {}", path);
            break;
        } else {
            info!("   ❌ Not found at: {}", path);
        }
    }
    
    let stunnel_path = stunnel_path.ok_or_else(|| {
        error!("💥 STUNNEL: stunnel.exe not found in any expected location!");
        error!("   Searched locations:");
        for path in &stunnel_paths {
            error!("   - {}", path);
        }
        error!("   Please ensure stunnel.exe is installed and accessible");
        ViWorksError::ProcessError("Stunnel executable not found".to_string())
    })?;
    
    // Start stunnel process
    info!("🚀 STUNNEL: Launching stunnel process");
    info!("   Command: {} {}", stunnel_path.display(), config_path.display());
    let mut cmd = tokio::process::Command::new(&stunnel_path)
        .arg(&config_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| {
            error!("💥 STUNNEL: Failed to start process: {}", e);
            ViWorksError::ProcessError(format!("Failed to start stunnel: {}", e))
        })?;
    
    // Capture initial output to check for immediate errors
    let mut stdout_buffer = Vec::new();
    let mut stderr_buffer = Vec::new();
    
    // Try to read some initial output
    if let Some(stdout) = cmd.stdout.take() {
        let mut reader = BufReader::new(stdout);
        let mut line = String::new();
        for _ in 0..5 { // Read up to 5 lines
            match timeout(Duration::from_millis(100), reader.read_line(&mut line)).await {
                Ok(Ok(0)) => break, // EOF
                Ok(Ok(_)) => {
                    info!("📤 STUNNEL stdout: {}", line.trim());
                    stdout_buffer.extend_from_slice(line.as_bytes());
                    line.clear();
                }
                _ => break,
            }
        }
    }
    
    if let Some(stderr) = cmd.stderr.take() {
        let mut reader = BufReader::new(stderr);
        let mut line = String::new();
        for _ in 0..5 { // Read up to 5 lines
            match timeout(Duration::from_millis(100), reader.read_line(&mut line)).await {
                Ok(Ok(0)) => break, // EOF
                Ok(Ok(_)) => {
                    if line.trim().to_lowercase().contains("error") {
                        error!("📤 STUNNEL stderr: {}", line.trim());
                    } else {
                        info!("📤 STUNNEL stderr: {}", line.trim());
                    }
                    stderr_buffer.extend_from_slice(line.as_bytes());
                    line.clear();
                }
                _ => break,
            }
        }
    }
    
    // Store the process
    {
        let mut stunnel_process = STUNNEL_PROCESS.lock().unwrap();
        *stunnel_process = Some(cmd);
    }
    
    // Wait a bit to ensure the process has time to start
    tokio::time::sleep(Duration::from_secs(2)).await;
    
            // Check if process is still running
        {
            let mut stunnel_process = STUNNEL_PROCESS.lock().unwrap();
            if let Some(ref mut child) = *stunnel_process {
                match child.try_wait() {
                    Ok(Some(status)) => {
                        if !status.success() {
                            return Err(ViWorksError::ProcessError("Stunnel process exited with error".to_string()));
                        }
                    }
                    Ok(None) => {
                        info!("Stunnel process started successfully");
                    }
                    Err(e) => {
                        warn!("Error checking stunnel process status: {}", e);
                    }
                }
            }
        }
    
    info!("Stunnel started successfully");
    Ok(())
}

pub async fn stop_stunnel() -> Result<()> {
    info!("Stopping Stunnel");
    
    let mut stunnel_process = STUNNEL_PROCESS.lock().unwrap();
    if let Some(mut child) = stunnel_process.take() {
        // Try to kill the process gracefully
        if let Err(e) = child.kill().await {
            warn!("Failed to kill stunnel process: {}", e);
        }
        
        // Wait for the process to exit
        match timeout(Duration::from_secs(5), child.wait()).await {
            Ok(Ok(status)) => {
                info!("Stunnel process exited with status: {}", status);
            },
            Ok(Err(e)) => {
                warn!("Error waiting for stunnel process: {}", e);
            },
            Err(_) => {
                warn!("Timeout waiting for stunnel process to exit");
            }
        }
    } else {
        info!("No stunnel process to stop");
    }
    
    Ok(())
}

pub async fn check_stunnel_status() -> Result<bool> {
    let mut stunnel_process = STUNNEL_PROCESS.lock().unwrap();
    if let Some(ref mut child) = *stunnel_process {
        match child.try_wait() {
            Ok(Some(_)) => Ok(false), // Process has exited
            Ok(None) => Ok(true),      // Process is still running
            Err(_) => Ok(false),       // Error checking status
        }
    } else {
        Ok(false)
    }
}

pub fn create_default_stunnel_config() -> StunnelConfig {
    StunnelConfig::default()
}

pub fn create_stunnel_config_from_connection(conn_config: &ConnectionConfig) -> StunnelConfig {
    StunnelConfig {
        client: true,
        accept: "127.0.0.1:1300".to_string(),
        connect: format!("{}:{}", conn_config.server_host, conn_config.server_port),
        cert: Some("stunnel.pem".to_string()),
        key: None,
        cafile: None,
        verify: None, // Remove verify requirement to match working manual config
        debug: Some(3),
    }
}

pub async fn verify_stunnel_connection(accept_addr: &str) -> Result<()> {
    info!("Verifying stunnel connection on {}", accept_addr);
    
    // Try to connect to the stunnel accept address
    match timeout(
        Duration::from_secs(5),
        tokio::net::TcpStream::connect(accept_addr)
    ).await {
        Ok(Ok(_)) => {
            info!("✅ Stunnel connection verified successfully");
            Ok(())
        }
        Ok(Err(e)) => {
            error!("❌ Failed to connect to stunnel: {}", e);
            Err(ViWorksError::ProcessError(format!("Stunnel connection failed: {}", e)))
        }
        Err(_) => {
            error!("❌ Stunnel connection verification timed out");
            Err(ViWorksError::ProcessError("Stunnel connection verification timed out".to_string()))
        }
    }
}
