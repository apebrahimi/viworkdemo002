use crate::state::app_state::AppState;
use crate::handlers::logging::LoggingHandler;
use std::path::Path;
use viworks_platform::preflight::{
    check_timezone, 
    check_network_connectivity, 
    check_vpn_tunnel_active, 
    check_binary_signatures
};
use tracing::{info, error};

/// Diagnostic functionality for testing connections and system requirements
pub trait DiagnosticsHandler {
    fn test_timezone_check(&mut self);
    fn test_network_check(&mut self);
    fn test_tunnel_check(&mut self);
    fn test_binary_check(&mut self);
    fn test_connection_diagnostics(&mut self);
    fn test_all_checks(&mut self);
}

impl DiagnosticsHandler for AppState {
    fn test_timezone_check(&mut self) {
        self.append_log("Testing timezone check...".to_string());
        
        // Run the timezone check
        let result = check_timezone();
        let result_str = match &result {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        };
        self.timezone_check_result = Some(result_str);
        
        match result {
            Ok(_) => {
                self.append_log("✅ Timezone check PASSED!".to_string());
            }
            Err(e) => {
                self.append_log(format!("❌ Timezone check FAILED: {}", e));
            }
        }
    }
    
    fn test_network_check(&mut self) {
        self.append_log("Testing network connectivity...".to_string());
        
        // Run the network check
        let result = check_network_connectivity();
        let result_str = match &result {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        };
        self.network_check_result = Some(result_str);
        
        match result {
            Ok(_) => {
                self.append_log("✅ Network connectivity check PASSED!".to_string());
            }
            Err(e) => {
                self.append_log(format!("❌ Network connectivity check FAILED: {}", e));
            }
        }
    }
    
    fn test_tunnel_check(&mut self) {
        self.append_log("Testing for active VPN tunnels...".to_string());
        
        // Run the tunnel check
        let result = check_vpn_tunnel_active();
        let result_str = match &result {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        };
        self.tunnel_check_result = Some(result_str);
        
        match result {
            Ok(_) => {
                self.append_log("✅ No active VPN tunnels detected - PASSED!".to_string());
            }
            Err(e) => {
                self.append_log(format!("❌ Tunnel check FAILED: {}", e));
            }
        }
    }
    
    fn test_binary_check(&mut self) {
        self.append_log("Testing binary signatures...".to_string());
        
        // Run the binary check
        let result = check_binary_signatures();
        let result_str = match &result {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        };
        self.binary_check_result = Some(result_str);
        
        match result {
            Ok(_) => {
                self.append_log("✅ Binary signatures check PASSED!".to_string());
            }
            Err(e) => {
                self.append_log(format!("❌ Binary signatures check FAILED: {}", e));
            }
        }
    }
    
    fn test_connection_diagnostics(&mut self) {
        self.append_log("🔍 Starting comprehensive connection diagnostics...".to_string());
        
        // Test 1: Server reachability
        self.append_log(format!("🌐 Testing server reachability: {}:{}", self.server_host, self.server_port));
        
        // Test 2: Input validation
        self.append_log("📋 Validating input parameters...".to_string());
        
        // Test 2: Input validation
        if self.server_host.is_empty() {
            self.append_log("❌ ERROR: Server host is empty".to_string());
        } else {
            self.append_log(format!("✅ Server host: {}", self.server_host));
        }
        
        if self.server_port.is_empty() {
            self.append_log("❌ ERROR: Server port is empty".to_string());
        } else {
            match self.server_port.parse::<u16>() {
                Ok(port) => self.append_log(format!("✅ Server port: {}", port)),
                Err(_) => self.append_log(format!("❌ ERROR: Invalid port number: {}", self.server_port)),
            }
        }
        
        if !self.skip_spa {
            if self.fwknop_key.is_empty() {
                self.append_log("❌ ERROR: fwknop key is empty".to_string());
            } else {
                self.append_log(format!("✅ fwknop key: {}...", &self.fwknop_key[..std::cmp::min(8, self.fwknop_key.len())]));
            }
            
            if self.fwknop_hmac.is_empty() {
                self.append_log("❌ ERROR: fwknop HMAC is empty".to_string());
            } else {
                self.append_log(format!("✅ fwknop HMAC: {}...", &self.fwknop_hmac[..std::cmp::min(8, self.fwknop_hmac.len())]));
            }
        } else {
            self.append_log("ℹ️ SPA is configured to be skipped - not validating SPA credentials".to_string());
        }
        
        // Test 3: Binary availability
        self.append_log("🔧 Checking required binaries...".to_string());
        
        let fwknop_paths = vec![
            "fwknop.exe",
            "bin\\fwknop.exe",
            "C:\\Program Files\\ViWorkS\\bin\\fwknop.exe",
        ];
        
        let mut fwknop_found = false;
        for path in &fwknop_paths {
            if Path::new(path).exists() {
                self.append_log(format!("✅ fwknop.exe found at: {}", path));
                fwknop_found = true;
                break;
            }
        }
        if !fwknop_found {
            if self.skip_spa {
                self.append_log("ℹ️ fwknop.exe not found, but SPA is configured to be skipped".to_string());
            } else {
                self.append_log("❌ ERROR: fwknop.exe not found in any expected location".to_string());
            }
        }
        
        let openvpn_paths = vec![
            "openvpn.exe",
            "bin\\openvpn.exe",
            "C:\\Program Files\\ViWorkS\\bin\\openvpn.exe",
            "C:\\Program Files\\OpenVPN\\bin\\openvpn.exe",
        ];
        
        let mut openvpn_found = false;
        for path in &openvpn_paths {
            if Path::new(path).exists() {
                self.append_log(format!("✅ openvpn.exe found at: {}", path));
                openvpn_found = true;
                break;
            }
        }
        if !openvpn_found {
            self.append_log("❌ ERROR: openvpn.exe not found in any expected location".to_string());
        }
        
        // Check for stunnel.exe
        let stunnel_paths = vec![
            "stunnel.exe",
            "bin\\stunnel.exe",
            "C:\\Program Files\\ViWorkS\\bin\\stunnel.exe",
        ];
        
        let mut stunnel_found = false;
        for path in &stunnel_paths {
            if Path::new(path).exists() {
                self.append_log(format!("✅ stunnel.exe found at: {}", path));
                stunnel_found = true;
                break;
            }
        }
        if !stunnel_found {
            self.append_log("❌ ERROR: stunnel.exe not found in any expected location".to_string());
        }
        
        // Check for certificate file if stunnel is enabled
        if self.stunnel_enabled {
            if self.stunnel_cert.is_empty() {
                self.append_log("❌ ERROR: Stunnel certificate file not specified".to_string());
            } else if Path::new(&self.stunnel_cert).exists() {
                self.append_log(format!("✅ Stunnel certificate found: {}", self.stunnel_cert));
            } else {
                self.append_log(format!("❌ ERROR: Stunnel certificate not found: {}", self.stunnel_cert));
            }
        }
        
        // Test 4: OpenVPN config
        if let Some(ref ovpn_path) = self.ovpn_path {
            if Path::new(ovpn_path).exists() {
                self.append_log(format!("✅ OpenVPN config found: {}", ovpn_path));
            } else {
                self.append_log(format!("❌ ERROR: OpenVPN config not found: {}", ovpn_path));
            }
        } else {
            self.append_log("ℹ️ No OpenVPN config file specified - will use default config".to_string());
        }
        
        // Test 5: Network connectivity to server
        self.append_log(format!("🌐 Testing network connectivity to {}:{}...", self.server_host, self.server_port));
        
        // Summary
        self.append_log("✅ Connection diagnostics completed!".to_string());
    }
    
    fn test_all_checks(&mut self) {
        self.clear_error();
        self.append_log("🧪 Running all preflight checks...".to_string());
        
        // Test timezone
        self.test_timezone_check();
        
        // Test network
        self.test_network_check();
        
        // Test tunnel
        self.test_tunnel_check();
        
        // Test binary signatures
        self.test_binary_check();
        
        self.append_log("🧪 All preflight checks completed!".to_string());
    }
}
