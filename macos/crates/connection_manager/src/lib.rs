use viworks_core::{Result, ViWorksError, ConnectionConfig};
use viworks_spa_fwknop as spa;
use viworks_stunnel as stunnel;
use viworks_vpn_openvpn as vpn;
use tracing::{info, warn, error};

pub struct ConnectionManager {
    config: ConnectionConfig,
}

impl ConnectionManager {
    pub fn new(config: ConnectionConfig) -> Self {
        Self {
            config,
        }
    }

    pub async fn establish_connection(&self) -> Result<()> {
        info!("🚀 Starting SPA → Stunnel → OpenVPN connection flow");
        info!("📋 Configuration:");
        info!("   Server: {}:{}", self.config.server_host, self.config.server_port);
        info!("   Stunnel Enabled: {}", self.config.stunnel_enabled);
        if self.config.stunnel_enabled {
            info!("   Stunnel: {} -> {}", self.config.stunnel_accept, self.config.stunnel_connect);
        }
        
        // Step 1: Send SPA to open the firewall (or skip if configured)
        if self.config.skip_spa {
            info!("⏭️ Step 1: SKIPPING SPA (bypass mode enabled)");
            info!("   Proceeding directly to Stunnel without firewall authorization");
        } else {
            info!("🔑 Step 1: Sending SPA to open firewall");
            info!("   Target: {}:{}", self.config.server_host, self.config.server_port);
            
            match spa::verify_spa_success(&self.config).await {
                Ok(_) => {
                    info!("✅ SPA successful - firewall opened");
                }
                Err(e) => {
                    error!("❌ SPA failed: {:?}", e);
                    error!("   This could be due to:");
                    error!("   - Invalid SPA key or HMAC");
                    error!("   - Server not accepting SPA packets");
                    error!("   - Network connectivity issues");
                    error!("   - Firewall blocking SPA packets");
                    error!("   - fwknop.exe not found or not working");
                    return Err(e);
                }
            }
        }
        
        // Step 2: Start Stunnel if configured
        if self.config.stunnel_enabled {
            info!("🔐 Step 2: Starting Stunnel tunnel");
            let stunnel_cfg = stunnel::StunnelConfig {
                client: true,
                accept: self.config.stunnel_accept.clone(),
                connect: self.config.stunnel_connect.clone(),
                cert: None, // Don't use certificate for now
                key: None,
                cafile: None,
                verify: Some(0), // Disable certificate verification
                debug: Some(6), // Higher debug level
            };
            info!("   Stunnel Config: {:?}", stunnel_cfg);
            
            match stunnel::start_stunnel(&stunnel_cfg).await {
                Ok(_) => {
                    info!("✅ Stunnel started successfully");
                }
                Err(e) => {
                    error!("❌ Stunnel failed to start: {:?}", e);
                    error!("   This could be due to:");
                    error!("   - Invalid certificate file");
                    error!("   - Port already in use");
                    error!("   - stunnel.exe not found or not working");
                    error!("   - Network connectivity issues");
                    return Err(e);
                }
            }
            
            // Verify stunnel is working
            let accept_addr = &self.config.stunnel_accept;
            info!("   Verifying Stunnel connection on {}", accept_addr);
            
            match stunnel::verify_stunnel_connection(accept_addr).await {
                Ok(_) => {
                    info!("✅ Stunnel tunnel established and verified");
                }
                Err(e) => {
                    error!("❌ Stunnel verification failed: {:?}", e);
                    error!("   This could be due to:");
                    error!("   - Stunnel not listening on expected port");
                    error!("   - Network connectivity issues");
                    error!("   - Firewall blocking local connections");
                    return Err(e);
                }
            }
        } else {
            info!("⚠️ No Stunnel configuration - proceeding with direct connection");
        }
        
        // Step 3: Start OpenVPN connection
        info!("🔒 Step 3: Starting OpenVPN connection");
        info!("   Config length: {} bytes", self.config.ovpn_config.len());
        
        match vpn::start_vpn(&self.config).await {
            Ok(_) => {
                info!("✅ OpenVPN connection established");
            }
            Err(e) => {
                error!("❌ OpenVPN failed to start: {:?}", e);
                error!("   This could be due to:");
                error!("   - Invalid OpenVPN configuration");
                error!("   - Missing certificate files");
                error!("   - openvpn.exe not found or not working");
                error!("   - Network connectivity issues");
                error!("   - Server not accepting connections");
                error!("   - Authentication issues");
                return Err(e);
            }
        }
        
        info!("🎉 Complete connection flow established successfully!");
        Ok(())
    }

    pub async fn disconnect(&self) -> Result<()> {
        info!("Disconnecting all services");
        
        // Stop OpenVPN first
        if let Err(e) = vpn::stop_vpn().await {
            warn!("Error stopping OpenVPN: {}", e);
        }
        
        // Stop Stunnel if running
        if self.config.stunnel_enabled {
            if let Err(e) = stunnel::stop_stunnel().await {
                warn!("Error stopping Stunnel: {}", e);
            }
        }
        
        info!("✅ All services disconnected");
        Ok(())
    }

    pub async fn get_connection_status(&self) -> Result<ConnectionStatus> {
        let vpn_status = vpn::check_vpn_status().await.unwrap_or(false);
        let stunnel_status = if self.config.stunnel_enabled {
            stunnel::check_stunnel_status().await.unwrap_or(false)
        } else {
            true // No stunnel means it's not needed
        };
        
        Ok(ConnectionStatus {
            vpn_connected: vpn_status,
            stunnel_running: stunnel_status,
        })
    }
}

#[derive(Debug, Clone)]
pub struct ConnectionStatus {
    pub vpn_connected: bool,
    pub stunnel_running: bool,
}

pub fn create_test_connection_config() -> ConnectionConfig {
    ConnectionConfig {
        server_host: "viworks.ir".to_string(),
        server_port: 8445,
        fwknop_key: viworks_core::SecretString::new("test_fwknop_key_12345".to_string()),
        fwknop_hmac: viworks_core::SecretString::new("test_fwknop_hmac_12345".to_string()),
        ovpn_config: "dev tun\nproto tcp\nremote 127.0.0.1 1300\nclient".to_string(),
        ovpn_auth: None,
        stunnel_enabled: true,
        stunnel_accept: "127.0.0.1:1300".to_string(),
        stunnel_connect: "viworks.ir:8445".to_string(),
        stunnel_cert: Some("stunnel.pem".to_string()),
        skip_spa: false,
    }
}
