use viworks_core::{Result, ViWorksError, ConnectionConfig};
use std::process::{Command, Stdio};
use std::time::Duration;
use tokio::time::timeout;
use tokio::net::TcpStream;
use tracing::{info, warn, error};

pub async fn send_spa(config: &ConnectionConfig) -> Result<()> {
    info!("🔑 SPA: Starting Single Packet Authorization");
    info!("   Target: {}:{}", config.server_host, config.server_port);
    info!("   Protocol: TCP/{}", config.server_port);
    
    // Validate fwknop binary exists - try multiple locations
    info!("🔍 SPA: Searching for fwknop.exe binary");
    let fwknop_paths = [
        r"C:\Program Files\ViWorkS\bin\fwknop.exe",
        r"fwknop.exe",  // Current directory
        r".\fwknop.exe", // Current directory with path
        r"bin\fwknop.exe", // bin subdirectory
    ];
    
    let mut fwknop_path = None;
    for (i, path) in fwknop_paths.iter().enumerate() {
        info!("   Checking location {}: {}", i + 1, path);
        if std::path::Path::new(path).exists() {
            fwknop_path = Some(*path);
            info!("✅ SPA: Found fwknop.exe at: {}", path);
            break;
        } else {
            info!("   ❌ Not found at: {}", path);
        }
    }
    
    let fwknop_path = fwknop_path.ok_or_else(|| {
        error!("💥 SPA: fwknop.exe not found in any expected location!");
        error!("   Searched locations:");
        for path in &fwknop_paths {
            error!("   - {}", path);
        }
        error!("   Please ensure fwknop.exe is installed and accessible");
        ViWorksError::FwknopNotFound
    })?;

    // Log the key and HMAC for debugging (truncated for security)
    info!("🔑 SPA: Using fwknop key: {}...", &config.fwknop_key.as_str()[..std::cmp::min(4, config.fwknop_key.as_str().len())]);
    info!("🔑 SPA: Using fwknop HMAC: {}...", &config.fwknop_hmac.as_str()[..std::cmp::min(4, config.fwknop_hmac.as_str().len())]);
    
    // Build fwknop command - use EXACTLY the same format that works for the client
    info!("🔧 SPA: Building fwknop command");
    let mut cmd = Command::new(fwknop_path);
    let port_arg = format!("tcp/{}", config.server_port);
    let args = vec![
        "-A", &port_arg,                              // Access request for the specified port
        "-s",                                         // Source NAT
        "-D", &config.server_host,                    // Destination host
        "--key-rijndael", config.fwknop_key.as_str(), // Rijndael key (instead of -k)
        "--key-hmac", config.fwknop_hmac.as_str(),    // HMAC key (instead of -H)
        "--use-hmac"                                  // Use HMAC
    ];
    cmd.args(&args);
    
    info!("🔧 SPA: Command details:");
    info!("   Executable: {}", fwknop_path);
    info!("   Arguments: {:?}", args);
    info!("   Full command: {} -A tcp/{} -s -D {} --key-rijndael [REDACTED] --key-hmac [REDACTED] --use-hmac", 
          fwknop_path, config.server_port, config.server_host);

    // Execute fwknop with timeout
    info!("🚀 SPA: Executing fwknop command (timeout: 10 seconds)");
    let output_result = timeout(
        Duration::from_secs(10),
        tokio::task::spawn_blocking(move || {
            info!("🔧 SPA: Spawning fwknop process");
            cmd.stdout(Stdio::piped())
               .stderr(Stdio::piped())
               .output()
        })
    ).await
    .map_err(|_| {
        error!("⏰ SPA: Command execution timed out after 10 seconds");
        ViWorksError::SpaTimeout
    })?
    .map_err(|e| {
        error!("💥 SPA: Failed to spawn fwknop process: {}", e);
        ViWorksError::ProcessError(format!("Failed to execute fwknop: {}", e))
    })?;

    let output = output_result
        .map_err(|e| {
            error!("💥 SPA: Failed to execute fwknop: {}", e);
            ViWorksError::ProcessError(format!("Failed to execute fwknop: {}", e))
        })?;

    // Check exit status
    info!("🔍 SPA: Checking command execution result");
    info!("   Exit code: {}", output.status);
    info!("   Success: {}", output.status.success());
    
    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        let stdout = String::from_utf8_lossy(&output.stdout);
        error!("💥 SPA: fwknop command failed!");
        error!("   Exit code: {}", output.status);
        error!("   Stdout: {}", stdout.trim());
        error!("   Stderr: {}", stderr.trim());
        error!("   This usually means:");
        error!("   - Invalid SPA credentials");
        error!("   - Server not responding");
        error!("   - Network connectivity issues");
        return Err(ViWorksError::SpaDenied);
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);
    info!("✅ SPA: Command executed successfully!");
    info!("   Stdout: {}", stdout.trim());
    if !stderr.trim().is_empty() {
        info!("   Stderr: {}", stderr.trim());
    }
    info!("✅ SPA: Single Packet Authorization completed successfully");
    Ok(())
}

pub async fn probe_port(host: &str, port: u16) -> Result<()> {
    info!("Probing port {} on {}", port, host);
    
    // Try to connect to the port with timeout
    let addr = format!("{}:{}", host, port);
    
    // Try multiple times with increasing timeouts
    for attempt in 1..=3 {
        info!("Port probe attempt {} of 3", attempt);
        
        let timeout_secs = attempt * 5; // 5, 10, 15 seconds
        
        match timeout(
            Duration::from_secs(timeout_secs),
            TcpStream::connect(&addr)
        ).await {
            Ok(Ok(_)) => {
                info!("✅ Port {} is open on {} (attempt {})", port, host, attempt);
                return Ok(());
            }
            Ok(Err(e)) => {
                warn!("❌ Port {} is closed on {} (attempt {}): {}", port, host, attempt, e);
                // Try again on next iteration
            }
            Err(_) => {
                warn!("❌ Port probe timed out after {} seconds for {}:{} (attempt {})", 
                      timeout_secs, host, port, attempt);
                // Try again on next iteration
            }
        }
        
        // Wait before next attempt
        tokio::time::sleep(Duration::from_millis(500)).await;
    }
    
    error!("All port probe attempts failed for {}:{}", host, port);
    Err(ViWorksError::PortProbeTimedOut)
}

pub async fn verify_spa_success(config: &ConnectionConfig) -> Result<()> {
    // First check if the port is already open (which would indicate SPA isn't needed)
    info!("Checking if port is already open before sending SPA...");
    match timeout(
        Duration::from_secs(2),
        probe_port(&config.server_host, config.server_port)
    ).await {
        Ok(Ok(_)) => {
            info!("⚠️ Port is already open before sending SPA! This may indicate a misconfiguration.");
            return Ok(());
        }
        _ => {
            info!("Port is closed as expected before SPA. Proceeding with SPA.");
        }
    }
    
    // Send SPA
    send_spa(config).await?;
    
    // Wait for the firewall to open - try with increasing delays
    for wait_time in [500, 1000, 2000] {
        info!("Waiting {}ms for firewall to open...", wait_time);
        tokio::time::sleep(Duration::from_millis(wait_time)).await;
        
        // Probe the port
        match probe_port(&config.server_host, config.server_port).await {
            Ok(_) => {
                info!("✅ SPA verification successful! Port is now open.");
                return Ok(());
            }
            Err(e) => {
                warn!("Port still closed after waiting {}ms: {:?}", wait_time, e);
                // Continue to next wait interval
            }
        }
    }
    
    // If we get here, all attempts failed
    error!("❌ SPA verification failed! Port never opened after multiple attempts.");
    Err(ViWorksError::PortProbeTimedOut)
}

pub fn get_fwknop_version() -> Result<String> {
    // Try multiple locations for fwknop binary
    let fwknop_paths = [
        r"C:\Program Files\ViWorkS\bin\fwknop.exe",
        r"fwknop.exe",  // Current directory
        r".\fwknop.exe", // Current directory with path
    ];
    
    let mut fwknop_path = None;
    for path in &fwknop_paths {
        if std::path::Path::new(path).exists() {
            fwknop_path = Some(*path);
            break;
        }
    }
    
    let fwknop_path = fwknop_path.ok_or(ViWorksError::FwknopNotFound)?;

    let output = Command::new(fwknop_path)
        .arg("--version")
        .output()
        .map_err(|e| ViWorksError::ProcessError(format!("Failed to get fwknop version: {}", e)))?;

    if output.status.success() {
        let version = String::from_utf8_lossy(&output.stdout).trim().to_string();
        Ok(version)
    } else {
        Err(ViWorksError::ProcessError("Failed to get fwknop version".to_string()))
    }
}

pub fn validate_fwknop_config(config: &ConnectionConfig) -> Result<()> {
    // Validate hostname
    if config.server_host.is_empty() {
        return Err(ViWorksError::InvalidHostname("Server host cannot be empty".to_string()));
    }

    // Validate port
    if config.server_port == 0 {
        return Err(ViWorksError::InvalidPort(config.server_port));
    }

    // Validate SPA key
    if config.fwknop_key.as_str().trim().is_empty() {
        return Err(ViWorksError::EmptyKey);
    }

    // Validate HMAC key
    if config.fwknop_hmac.as_str().trim().is_empty() {
        return Err(ViWorksError::EmptyKey);
    }

    Ok(())
}
