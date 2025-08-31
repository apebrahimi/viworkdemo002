use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub agent: AgentConfig,
    pub security: SecurityConfig,
    pub scripts: ScriptsConfig,
    pub monitoring: MonitoringConfig,
    pub containers: ContainerConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentConfig {
    pub bind_address: String,
    pub log_level: String,
    pub max_connections: usize,
    pub request_timeout: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecurityConfig {
    pub allowed_ips: Vec<String>,
    pub rate_limit_requests: usize,
    pub rate_limit_window: u64,
    pub require_client_cert: bool,
    pub cert_authority_path: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScriptsConfig {
    pub openvpn_create: String,
    pub openvpn_delete: String,
    pub panel_create: String,
    pub panel_delete: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MonitoringConfig {
    pub collect_interval: u64,
    pub retention_days: u32,
    pub metrics_enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContainerConfig {
    pub base_image: String,
    pub memory_limit: String,
    pub cpu_limit: String,
    pub network_mode: String,
    pub port_range_start: u16,
    pub port_range_end: u16,
}

impl Config {
    pub fn load() -> Result<Self> {
        let config_path =
            std::env::var("AGENT_CONFIG").unwrap_or_else(|_| "agent.toml".to_string());

        let config_content = std::fs::read_to_string(&config_path)
            .map_err(|e| anyhow::anyhow!("Failed to read config file {}: {}", config_path, e))?;

        let mut config: Config = toml::from_str(&config_content)
            .map_err(|e| anyhow::anyhow!("Failed to parse config file: {}", e))?;

        // Override with environment variables
        if let Ok(bind_addr) = std::env::var("AGENT_BIND_ADDRESS") {
            config.agent.bind_address = bind_addr;
        }

        if let Ok(log_level) = std::env::var("RUST_LOG") {
            config.agent.log_level = log_level;
        }

        Ok(config)
    }

    pub fn default() -> Self {
        Config {
            agent: AgentConfig {
                bind_address: "127.0.0.1:8443".to_string(),
                log_level: "info".to_string(),
                max_connections: 1000,
                request_timeout: 30,
            },
            security: SecurityConfig {
                allowed_ips: vec!["127.0.0.1".to_string(), "::1".to_string()],
                rate_limit_requests: 100,
                rate_limit_window: 60,
                require_client_cert: false,
                cert_authority_path: None,
            },
            scripts: ScriptsConfig {
                openvpn_create: "/opt/Viworks/scripts_viworks/add_vpn_user.sh".to_string(),
                openvpn_delete: "/opt/Viworks/scripts_viworks/delete_vpn_user.sh".to_string(),
                panel_create: "/opt/Viworks/scripts_viworks/add_user.sh".to_string(),
                panel_delete: "/opt/Viworks/scripts_viworks/delete_user.sh".to_string(),
            },
            monitoring: MonitoringConfig {
                collect_interval: 30,
                retention_days: 7,
                metrics_enabled: true,
            },
            containers: ContainerConfig {
                base_image: "alpine:latest".to_string(),
                memory_limit: "512m".to_string(),
                cpu_limit: "0.5".to_string(),
                network_mode: "bridge".to_string(),
                port_range_start: 8080,
                port_range_end: 8090,
            },
        }
    }
}
