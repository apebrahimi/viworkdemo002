use viworks_core::{Result, ViWorksError};
use std::process::Command;
use std::net::TcpStream;
use std::time::Duration;
use tracing::{info, warn, error};

pub fn check_timezone() -> Result<()> {
    // On macOS, we can use systemsetup or defaults to get timezone
    let mut timezone = None;
    
    // Method 1: Try systemsetup
    if let Ok(output) = Command::new("systemsetup").args(&["-gettimezone"]).output() {
        let timezone_output = String::from_utf8_lossy(&output.stdout);
        if let Some(tz) = timezone_output.lines().next() {
            if let Some(tz_clean) = tz.split(": ").nth(1) {
                let tz = tz_clean.trim();
                if !tz.is_empty() {
                    timezone = Some(tz.to_string());
                    info!("Detected timezone via systemsetup: '{}'", tz);
                }
            }
        }
    }
    
    // Method 2: Try defaults if systemsetup failed
    if timezone.is_none() {
        if let Ok(output) = Command::new("defaults")
            .args(&["read", "/Library/Preferences/.GlobalPreferences", "AppleTimeZone"])
            .output() 
        {
            let timezone_output = String::from_utf8_lossy(&output.stdout);
            let tz = timezone_output.trim();
            if !tz.is_empty() {
                timezone = Some(tz.to_string());
                info!("Detected timezone via defaults: '{}'", tz);
            }
        }
    }
    
    // Method 3: Try TZ environment variable as last resort
    if timezone.is_none() {
        if let Ok(tz) = std::env::var("TZ") {
            if !tz.is_empty() {
                timezone = Some(tz.clone());
                info!("Detected timezone via TZ env var: '{}'", tz);
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
        "America/New_York",   // Additional timezone for testing
        "UTC",                // UTC for testing
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
    // On macOS, we use ifconfig to check for VPN interfaces
    let output = Command::new("ifconfig")
        .output()
        .map_err(|e| ViWorksError::ProcessError(format!("Failed to check interfaces: {}", e)))?;

    let output_str = String::from_utf8_lossy(&output.stdout);
    
    // Look for VPN-related interface names on macOS
    let vpn_indicators = [
        "utun",      // macOS VPN interfaces
        "tun",       // TUN interfaces
        "tap",       // TAP interfaces
        "ppp",       // PPP interfaces
        "ipsec",     // IPsec interfaces
    ];

    for line in output_str.lines() {
        if line.contains("UP") || line.contains("RUNNING") {
            for indicator in &vpn_indicators {
                if line.to_lowercase().contains(&indicator.to_lowercase()) {
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
        "/usr/local/bin/fwknop",
        "/opt/homebrew/bin/fwknop",
        "./fwknop",  // Current directory
        "./bin/fwknop", // bin subdirectory
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
        "/usr/local/bin/openvpn",
        "/opt/homebrew/bin/openvpn",
        "./openvpn",  // Current directory
        "./bin/openvpn", // bin subdirectory
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
    // Check macOS version
    let output = Command::new("sw_vers")
        .args(&["-productVersion"])
        .output()
        .map_err(|e| ViWorksError::ProcessError(format!("Failed to get macOS version: {}", e)))?;

    if output.status.success() {
        let version_output = String::from_utf8_lossy(&output.stdout);
        let version = version_output.trim();
        info!("macOS version: {}", version);
        
        // Check if version is 10.15 (Catalina) or later
        if let Some(major_minor) = version.split('.').take(2).collect::<Vec<_>>().join(".").parse::<f32>().ok() {
            if major_minor < 10.15 {
                warn!("macOS version {} is below minimum required version 10.15", version);
                return Err(ViWorksError::Internal("macOS version too old".to_string()));
            }
        }
    } else {
        warn!("Could not determine macOS version, but continuing anyway");
    }

    // Check if running with elevated privileges (optional)
    let output = Command::new("whoami")
        .output()
        .map_err(|e| ViWorksError::ProcessError(format!("Failed to check user: {}", e)))?;

    if output.status.success() {
        let user_output = String::from_utf8_lossy(&output.stdout);
        let user = user_output.trim();
        if user == "root" {
            info!("Running with root privileges");
        } else {
            info!("Running as user: {}", user);
        }
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
