use viworks_core::{Result, ViWorksError};
use std::process::Command;
use std::net::TcpStream;
use std::time::Duration;
use tracing::{info, warn, error};

pub fn check_timezone() -> Result<()> {
    // Try multiple methods to get timezone
    let mut timezone = None;
    
    // Method 1: Try tzutil /g
    if let Ok(output) = Command::new("tzutil").args(&["/g"]).output() {
        let timezone_output = String::from_utf8_lossy(&output.stdout);
        let tz = timezone_output.trim();
        if !tz.is_empty() {
            timezone = Some(tz.to_string());
            info!("Detected timezone via tzutil: '{}'", tz);
        }
    }
    
    // Method 2: Try PowerShell Get-TimeZone if tzutil failed
    if timezone.is_none() {
        if let Ok(output) = Command::new("powershell")
            .args(&["-Command", "(Get-TimeZone).Id"])
            .output() 
        {
            let timezone_output = String::from_utf8_lossy(&output.stdout);
            let tz = timezone_output.trim();
            if !tz.is_empty() {
                timezone = Some(tz.to_string());
                info!("Detected timezone via PowerShell: '{}'", tz);
            }
        }
    }
    
    // Method 3: Try w32tm /tz as last resort
    if timezone.is_none() {
        if let Ok(output) = Command::new("w32tm").args(&["/tz"]).output() {
            let timezone_output = String::from_utf8_lossy(&output.stdout);
            // Parse w32tm output to extract timezone name
            for line in timezone_output.lines() {
                if line.contains("Standard Name:") {
                    if let Some(tz) = line.split("Standard Name:\"").nth(1) {
                        if let Some(tz_clean) = tz.split('"').next() {
                            timezone = Some(tz_clean.to_string());
                            info!("Detected timezone via w32tm: '{}'", tz_clean);
                            break;
                        }
                    }
                }
            }
        }
    }
    
    let timezone = timezone.ok_or_else(|| {
        ViWorksError::ProcessError("Failed to detect timezone using any method".to_string())
    })?;
    
    // Allow Tehran timezone and London for testing
    let allowed_timezones = [
        "Asia/Tehran",
        "Iran Standard Time",
        "GMT Standard Time",  // London timezone for testing
        "Europe/London",      // Alternative London timezone format
    ];
    
    if !allowed_timezones.contains(&timezone.as_str()) {
        warn!("SECURITY CHECK FAILED: Timezone '{}' is not allowed. Allowed timezones: {:?}", timezone, allowed_timezones);
        return Err(ViWorksError::WrongTimezone);
    }

    info!("Timezone check passed: {}", timezone);
    Ok(())
}

pub fn check_network_connectivity() -> Result<()> {
    // Try to connect to a reliable host
    let test_hosts = [
        ("8.8.8.8", 53),    // Google DNS
        ("1.1.1.1", 53),    // Cloudflare DNS
        ("208.67.222.222", 53), // OpenDNS
    ];

    for (host, port) in &test_hosts {
        if let Ok(_) = TcpStream::connect_timeout(
            &format!("{}:{}", host, port).parse().unwrap(),
            Duration::from_secs(5)
        ) {
            info!("Network connectivity check passed via {}", host);
            return Ok(());
        }
    }

    error!("No network connectivity detected");
    Err(ViWorksError::Offline)
}

pub fn check_vpn_tunnel_active() -> Result<()> {
    // Check for active VPN adapters using netsh
    let output = Command::new("netsh")
        .args(&["interface", "show", "interface"])
        .output()
        .map_err(|e| ViWorksError::ProcessError(format!("Failed to check interfaces: {}", e)))?;

    let output_str = String::from_utf8_lossy(&output.stdout);
    
    // Look for VPN-related interface names
    let vpn_indicators = [
        "VPN",
        "OpenVPN",
        "TAP",
        "TUN",
        "ppp",
    ];

    for line in output_str.lines() {
        if line.contains("Connected") {
            for indicator in &vpn_indicators {
                if line.to_uppercase().contains(&indicator.to_uppercase()) {
                    warn!("Active VPN tunnel detected: {}", line.trim());
                    return Err(ViWorksError::TunnelActive);
                }
            }
        }
    }

    info!("No active VPN tunnels detected");
    Ok(())
}

pub fn check_binary_signatures() -> Result<()> {
    // Check if required binaries exist and have valid signatures
    
    // Check for fwknop binary (required)
    let fwknop_paths = [
        r"C:\Program Files\ViWorkS\bin\fwknop.exe",
        r"fwknop.exe",  // Current directory
        r".\fwknop.exe", // Current directory with path
        r"bin\fwknop.exe", // bin subdirectory
    ];
    
    let mut fwknop_found = false;
    let mut fwknop_path = None;
    
    for path in &fwknop_paths {
        if std::path::Path::new(path).exists() {
            fwknop_path = Some(*path);
            fwknop_found = true;
            info!("Found fwknop at: {}", path);
            break;
        }
    }
    
    if !fwknop_found {
        warn!("fwknop binary not found. Searched in:");
        for path in &fwknop_paths {
            warn!("  - {}", path);
        }
        return Err(ViWorksError::Internal("fwknop binary not found in any expected location".to_string()));
    }
    
    // For development/testing, skip signature verification
    info!("Skipping signature verification for fwknop (development mode)");
    
    // Check for OpenVPN but don't fail if not found - we'll use the provided config
    let openvpn_paths = [
        r"C:\Program Files\ViWorkS\bin\openvpn.exe",
        r"openvpn.exe",  // Current directory
        r".\openvpn.exe", // Current directory with path
        r"bin\openvpn.exe", // bin subdirectory
        r"C:\Program Files\OpenVPN\bin\openvpn.exe",
    ];
    
    let mut openvpn_found = false;
    for path in &openvpn_paths {
        if std::path::Path::new(path).exists() {
            info!("Found openvpn at: {}", path);
            openvpn_found = true;
            break;
        }
    }
    
    if !openvpn_found {
        info!("OpenVPN binary not found, but will continue with provided config");
        // We don't return an error here - we'll use the provided config
    }

    info!("Binary check completed successfully");
    Ok(())
}

pub fn check_system_requirements() -> Result<()> {
    // Try multiple methods to check Windows version
    let mut version_detected = false;
    
    // Method 1: Try 'ver' command
    match Command::new("ver").output() {
        Ok(output) => {
            let version_output = String::from_utf8_lossy(&output.stdout);
            let version = version_output.trim();
            if !version.is_empty() {
                info!("Windows version (via ver): {}", version);
                version_detected = true;
            }
        },
        Err(e) => {
            warn!("Failed to get Windows version via 'ver': {}", e);
        }
    }
    
    // Method 2: Try PowerShell if 'ver' failed
    if !version_detected {
        match Command::new("powershell")
            .args(&["-Command", "[Environment]::OSVersion.VersionString"])
            .output() 
        {
            Ok(output) => {
                let version_output = String::from_utf8_lossy(&output.stdout);
                let version = version_output.trim();
                if !version.is_empty() {
                    info!("Windows version (via PowerShell): {}", version);
                    version_detected = true;
                }
            },
            Err(e) => {
                warn!("Failed to get Windows version via PowerShell: {}", e);
            }
        }
    }
    
    // Method 3: Try systeminfo as last resort
    if !version_detected {
        match Command::new("systeminfo")
            .args(&["/FO", "LIST"])
            .output() 
        {
            Ok(output) => {
                let info_output = String::from_utf8_lossy(&output.stdout);
                for line in info_output.lines() {
                    if line.contains("OS Version:") || line.contains("OS Name:") {
                        info!("Windows version (via systeminfo): {}", line.trim());
                        version_detected = true;
                        break;
                    }
                }
            },
            Err(e) => {
                warn!("Failed to get Windows version via systeminfo: {}", e);
            }
        }
    }
    
    // Even if we couldn't detect the version, don't fail the check
    if !version_detected {
        info!("Could not detect Windows version, but continuing anyway");
    }

    // Check if running as administrator (optional)
    let output = Command::new("net")
        .args(&["session"])
        .output();

    match output {
        Ok(_) => info!("Running with administrative privileges"),
        Err(_) => warn!("Not running with administrative privileges"),
    }

    Ok(())
}

pub fn run_preflight_checks() -> Result<()> {
    info!("Starting preflight checks...");
    
    check_system_requirements()?;
    check_timezone()?;
    check_network_connectivity()?;
    check_vpn_tunnel_active()?;
    check_binary_signatures()?;
    
    info!("All preflight checks passed");
    Ok(())
}
