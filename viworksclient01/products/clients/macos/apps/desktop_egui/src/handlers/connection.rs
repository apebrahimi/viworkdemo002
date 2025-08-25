use crate::state::app_state::AppState;
use crate::handlers::logging::LoggingHandler;
use viworks_core::{
    ConnectionEvent, ConnectionState, ConnectionConfig, SecretString, Result, ViWorksError,
    OvpnAuth, AuthType
};
use viworks_connection_manager::{ConnectionManager, create_test_connection_config};
use viworks_auth_api::{store_tokens, clear_tokens};
use std::sync::{Arc, Mutex};
use std::time::Instant;
use tracing::{info, error, warn};
use std::process::Stdio;

/// Connection handling functionality
pub trait ConnectionHandler {
    fn connect_direct(&mut self);
    fn load_test_config(&mut self);
    fn handle_logout_sync(&mut self);
    fn disconnect(&mut self);
    fn spawn_async_task<F>(&mut self, task: F)
    where
        F: std::future::Future<Output = Result<()>> + Send + 'static;
}

impl ConnectionHandler for AppState {
    fn connect_direct(&mut self) {
        self.clear_error();
        self.append_log("🚀 Starting SPA → Stunnel → OpenVPN connection...".to_string());
        
        let server_host = self.server_host.clone();
        let server_port = self.server_port.clone();
        let fwknop_key = self.fwknop_key.clone();
        let fwknop_hmac = self.fwknop_hmac.clone();
        let ovpn_username = self.ovpn_username.clone();
        let ovpn_password = self.ovpn_password.clone();
        let stunnel_enabled = self.stunnel_enabled;
        let stunnel_accept = self.stunnel_accept.clone();
        let stunnel_connect = self.stunnel_connect.clone();
        let stunnel_cert = self.stunnel_cert.clone();
        let skip_spa = self.skip_spa;
        
        // Reset status
        self.spa_status = "⏳ Pending".to_string();
        self.stunnel_status = "⏳ Pending".to_string();
        self.vpn_status = "⏳ Pending".to_string();
        self.port_status = "⏳ Pending".to_string();
        
        self.append_log(format!("📋 Target: {}:{}", server_host, server_port));
        self.append_log(format!("🔐 Stunnel: {} -> {}", stunnel_accept, stunnel_connect));
        
        if skip_spa {
            self.append_log("⏭️ SPA SKIP MODE: Will bypass SPA and go directly to Stunnel".to_string());
            self.spa_status = "⏭️ Skipped".to_string();
        }
        
        // Step 1: Pre-connection validation
        self.append_log("🔍 Step 1: Pre-connection validation".to_string());
        
        // Validate server configuration
        if server_host.is_empty() {
            self.append_log("❌ Validation failed: Server host is empty".to_string());
            return;
        }
        self.append_log(format!("✅ Server host validation passed: {}", server_host));
        
        let port: u16 = match server_port.parse() {
            Ok(p) => {
                self.append_log(format!("✅ Port validation passed: {}", p));
                p
            },
            Err(_) => {
                self.append_log(format!("❌ Validation failed: Invalid port number: {}", server_port));
                return;
            }
        };
        
        // Validate SPA credentials (if not skipping)
        if !skip_spa {
            if fwknop_key.is_empty() || fwknop_hmac.is_empty() {
                self.append_log("❌ Validation failed: SPA key or HMAC is empty".to_string());
                return;
            }
            self.append_log("✅ SPA credentials validation passed".to_string());
        } else {
            self.append_log("⏭️ SPA validation skipped (bypass mode enabled)".to_string());
        }
        
        // Validate OpenVPN credentials
        if ovpn_username.is_empty() {
            self.append_log("❌ OpenVPN username is empty".to_string());
            self.append_log("   Please enter username: keyvan".to_string());
            return;
        }
        
        if ovpn_password.is_empty() {
            self.append_log("❌ OpenVPN password is empty".to_string());
            self.append_log("   Please enter password: 123".to_string());
            return;
        }
        
        self.append_log(format!("✅ OpenVPN credentials validated: {} / {}", ovpn_username, "***"));
        
        // Step 2: Binary validation
        self.append_log("🔍 Step 2: Binary validation".to_string());
        
        // Check for openvpn.exe
        let openvpn_paths = [
            r"C:\Program Files\OpenVPN\bin\openvpn.exe",
            r"C:\Program Files\OpenVPN Connect\OpenVPNConnect.exe",
            r"openvpn.exe",
            r".\openvpn.exe",
            r"bin\openvpn.exe",
        ];
        
        let mut openvpn_found = false;
        for path in &openvpn_paths {
            if std::path::Path::new(path).exists() {
                self.append_log(format!("✅ Found openvpn.exe at: {}", path));
                openvpn_found = true;
                break;
            }
        }
        
        if !openvpn_found {
            self.append_log("❌ openvpn.exe not found in any expected location!".to_string());
            self.append_log("   Searched locations:".to_string());
            for path in &openvpn_paths {
                self.append_log(format!("   - {}", path));
            }
            self.append_log("   Please ensure OpenVPN is installed".to_string());
            return;
        }
        
        // Check for stunnel.exe
        let stunnel_paths = [
            r"stunnel.exe",
            r".\stunnel.exe",
            r"bin\stunnel.exe",
        ];
        
        let mut stunnel_found = false;
        for path in &stunnel_paths {
            if std::path::Path::new(path).exists() {
                self.append_log(format!("✅ Found stunnel.exe at: {}", path));
                stunnel_found = true;
                break;
            }
        }
        
        if !stunnel_found {
            self.append_log("❌ stunnel.exe not found in any expected location!".to_string());
            self.append_log("   Searched locations:".to_string());
            for path in &stunnel_paths {
                self.append_log(format!("   - {}", path));
            }
            self.append_log("   Please ensure stunnel.exe is in the bin folder".to_string());
            return;
        }
        
        // Check for fwknop.exe (only if not skipping SPA)
        if !skip_spa {
            let fwknop_paths = [
                r"fwknop.exe",
                r".\fwknop.exe",
                r"bin\fwknop.exe",
            ];
            
            let mut fwknop_found = false;
            for path in &fwknop_paths {
                if std::path::Path::new(path).exists() {
                    self.append_log(format!("✅ Found fwknop.exe at: {}", path));
                    fwknop_found = true;
                    break;
                }
            }
            
            if !fwknop_found {
                self.append_log("❌ fwknop.exe not found in any expected location!".to_string());
                self.append_log("   Searched locations:".to_string());
                for path in &fwknop_paths {
                    self.append_log(format!("   - {}", path));
                }
                self.append_log("   Please ensure fwknop.exe is in the bin folder".to_string());
                return;
            }
        }
        
        // Step 3: Create connection configuration
        self.append_log("🔧 Step 3: Creating connection configuration".to_string());
        
        // Use the exact same OpenVPN config as the working viworks.ovpn file
        // Added block-outside-dns to prevent DNS leaks and ensure VPN routing
        let ovpn_config = r#"dev tun
proto tcp
remote 127.0.0.1 1300
cipher AES-128-CBC
data-ciphers AES-128-CBC
auth SHA1
resolv-retry infinite
nobind
persist-key
persist-tun
client
verb 3
auth-user-pass
# Prevent DNS leaks and ensure all traffic goes through VPN
block-outside-dns
# Let OpenVPN choose TAP adapter automatically
# dev-node OpenVPN TAP-Windows6
# Cleanup on exit
down-pre

<ca>
-----BEGIN CERTIFICATE-----
MIIDpjCCAo6gAwIBAgIBADANBgkqhkiG9w0BAQsFADBSMRUwEwYDVQQDDAxjMzVl
N2UwYzhhYjcxFTATBgNVBAoMDGMzNWU3ZTBjOGFiNzEVMBMGA1UECwwMYzM1ZTdl
MGM4YWI3MQswCQYDVQQGEwJVUzAeFw0yNTA4MTkxNDQ5NDJaFw0zNzEyMzExNDQ5
NDJaMFIxFTATBgNVBAMMDGMzNWU3ZTBjOGFiNzEVMBMGA1UECgwMYzM1ZTdlMGM4
YWI3MRUwEwYDVQQLDAxjMzVlN2UwYzhhYjcxCzAJBgNVBAYTAlVTMIIBIjANBgkq
hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAonA2g2QfpkMGABSkDzm6nyUVLFG3TlRL
Ap8wWSnyBmRVTbPrfd6hi5hUCnq5x5xtKUYDmcNiffvLyDYrJITzNxSyAioJPkud
eqoQTkjZszk4OiZUj3ee1UtDIzumaYlCDJx9l9CIWJaGWiYwGwtoYky3gT1ilGvW
JzVjlf6uaK+hE3KtvKEkGPmKnqwPllRjoJ6AcCMGoSLwvFhYR4uuXAEKxjac8l8l
FFzQ/MiAV6rF7kKD3GRLNEgZFnl5yIZg5EpiRbL2Yj/OV1xibIGeiYZrm+XCoeZn
xRmcQBskU1e/vCTu2kKjrAkCP0bRTXRICP+Q5K+qHkacXFdC1YPLcwIDAQABo4GG
MIGDMA8GA1UdEwEB/wQFMAMBAf8wCwYDVR0PBAQDAgH2MGMGA1UdJQRcMFoGCCsG
AQUFBwMBBggrBgEFBQcDAgYIKwYBBQUHAwMGCCsGAQUFBwMEBggrBgEFBQcDBQYI
KwYBBQUHAwYGCCsGAQUFBwMHBggrBgEFBQcDCAYIKwYBBQUHAwkwDQYJKoZIhvcN
AQELBQADggEBAGldFcEbc2sk8jFciTj+espW0o32Fd66HEJRQ83F0GmKQaAPE6H3
nphzSaoVD4Uan3EgTE5pnEgCs8tYeG1GgvorLRHY3h9TNP3JLyAMyJIU+mxjjQdq
hUvf40rsZy3iYdt2fbD4OP/AFmURN8JbW7BiA+xC8a1/eCk3DCR/UMmEKiHsZrEu
gFPHch4o7WrlSKSDxoYB4Ev0zSq9cHUApHyLRtCpZp6GCZLEetPYOGxkOhbCxtxE
tvfCzuHZAXmYFdn2p3WYXkHScPgqO1W3IJ9hBLtgk/Yu933E1DEy7r8uvX+c5jbt
q4lBKehVYhoVwkktqde7PzeT8i/W3X9KRUI=
-----END CERTIFICATE-----

</ca>"#.to_string();
        
        let config = ConnectionConfig {
            server_host: server_host.clone(),
            server_port: port,
            fwknop_key: SecretString::new(fwknop_key.clone()),
            fwknop_hmac: SecretString::new(fwknop_hmac.clone()),
            ovpn_config: ovpn_config,
            ovpn_auth: Some(OvpnAuth {
                username: SecretString::new(ovpn_username.clone()),
                password: SecretString::new(ovpn_password.clone()),
            }),
            stunnel_enabled,
            stunnel_accept,
            stunnel_connect,
            stunnel_cert: Some(stunnel_cert),
            skip_spa,
        };
        
        self.append_log("✅ Connection configuration created successfully".to_string());
        
        // Step 4: Execute complete connection flow
        self.append_log("🚀 Step 4: Executing SPA → Stunnel → OpenVPN flow...".to_string());
        
        self.spawn_async_task(async move {
            // Create connection manager
            let connection_manager = ConnectionManager::new(config);
            
            // Execute connection with detailed error handling and UI logging
            match connection_manager.establish_connection().await {
                Ok(_) => {
                    // Success - return Ok to trigger success logging in async task handler
                    Ok(())
                }
                Err(e) => {
                    // Error - return Err to trigger error logging in async task handler
                    Err(e)
                }
            }
        });
    }
    
    fn load_test_config(&mut self) {
        self.append_log("📋 Loading test configuration...".to_string());
        
        // Set the exact configuration that works
        self.server_host = "viworks.ir".to_string();
        self.server_port = "8445".to_string();
        self.fwknop_key = "test_fwknop_key_12345".to_string();
        self.fwknop_hmac = "test_fwknop_hmac_12345".to_string();
        
        // Set Stunnel config
        self.stunnel_enabled = true;
        self.stunnel_accept = "127.0.0.1:1300".to_string();
        self.stunnel_connect = "viworks.ir:8445".to_string();
        self.stunnel_cert = "stunnel.pem".to_string();
        
        // Set OpenVPN credentials
        self.ovpn_username = "keyvan".to_string();
        self.ovpn_password = "123".to_string();
        
        self.append_log("✅ Test configuration loaded successfully".to_string());
        self.append_log("   OpenVPN credentials: keyvan / 123".to_string());
        self.append_log("   Stunnel endpoint: 127.0.0.1:1300".to_string());
        self.append_log("   SPA credentials: test_fwknop_key_12345 / test_fwknop_hmac_12345".to_string());
    }
    
    fn handle_logout_sync(&mut self) {
        self.append_log("Logging out...".to_string());
        {
            let mut fsm = self.fsm.lock().unwrap();
            fsm.clear_auth_tokens();
            let _ = fsm.handle_event(ConnectionEvent::Logout);
        }
        self.clear_error();
        self.username.clear();
        self.password.clear();
        self.server_host.clear();
        self.fwknop_key.clear();
        self.fwknop_hmac.clear();
        self.ovpn_path = None;
        self.append_log("Logout successful".to_string());
    }
    
    fn disconnect(&mut self) {
        self.append_log("🔌 Disconnecting all services...".to_string());
        
        // Kill any running processes
        self.spawn_async_task(async move {
            // Try to kill OpenVPN processes
            let _ = tokio::process::Command::new("taskkill")
                .args(&["/f", "/im", "openvpn.exe"])
                .output()
                .await;
            
            let _ = tokio::process::Command::new("taskkill")
                .args(&["/f", "/im", "OpenVPNConnect.exe"])
                .output()
                .await;
            
            // Try to kill stunnel processes
            let _ = tokio::process::Command::new("taskkill")
                .args(&["/f", "/im", "stunnel.exe"])
                .output()
                .await;
            
            // Try to kill fwknop processes
            let _ = tokio::process::Command::new("taskkill")
                .args(&["/f", "/im", "fwknop.exe"])
                .output()
                .await;
            
            // Clean up TAP adapters
            let _ = tokio::process::Command::new("netsh")
                .args(&["interface", "set", "interface", "name=*OpenVPN*", "admin=disable"])
                .output()
                .await;
            
            // Wait a moment for cleanup
            tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
            
            info!("All VPN-related processes terminated and TAP adapters cleaned up");
            Ok(())
        });
    }
    
    fn spawn_async_task<F>(&mut self, task: F)
    where
        F: std::future::Future<Output = Result<()>> + Send + 'static,
    {
        let fsm = Arc::clone(&self.fsm);
        let handle = self.runtime.spawn(async move {
            match task.await {
                Ok(_) => {
                    info!("🎉 SUCCESS: Complete connection flow established!");
                    info!("   All services are now running:");
                    info!("   - SPA: Firewall opened (or skipped)");
                    info!("   - Stunnel: SSL/TLS tunnel active");
                    info!("   - OpenVPN: VPN connection established");
                    
                    let mut fsm = fsm.lock().unwrap();
                    fsm.handle_event(ConnectionEvent::VpnConnected).ok();
                }
                Err(e) => {
                    error!("💥 FAILURE: Connection flow failed!");
                    error!("   Error details: {:?}", e);
                    error!("   This could be due to:");
                    error!("   - Network connectivity issues");
                    error!("   - Missing binary files (fwknop.exe, stunnel.exe, openvpn.exe)");
                    error!("   - Server not responding");
                    error!("   - Firewall blocking connection");
                    error!("   - OpenVPN configuration issues");
                    error!("   - Stunnel configuration problems");
                    
                    let mut fsm = fsm.lock().unwrap();
                    fsm.handle_event(ConnectionEvent::VpnFailed(e)).ok();
                }
            }
        });
        self.pending_tasks.push(handle);
        self.is_busy = true;
        self.append_log("Starting connection flow...".to_string());
    }
}
