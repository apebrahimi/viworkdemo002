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
    pub outbound: OutboundConfig,
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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OutboundConfig {
    pub backend_url: String,
    pub agent_id: String,
    pub cert_path: String,
    pub key_path: String,
    pub trust_bundle: String,
    pub backend_spki_pin: String,
    pub feature_inbound_http: bool,
    pub feature_exec_enable: bool,
    pub scripts_root: String,
    pub max_concurrency: usize,
    pub cmd_timeout_secs: u64,
    pub site: Option<String>,
    pub container_engine: String,
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

        // Override outbound config with environment variables
        if let Ok(backend_url) = std::env::var("VIW_AGENT_BACKEND_URL") {
            config.outbound.backend_url = backend_url;
        }

        if let Ok(agent_id) = std::env::var("VIW_AGENT_ID") {
            config.outbound.agent_id = agent_id;
        }

        if let Ok(cert_path) = std::env::var("VIW_AGENT_CERT_PATH") {
            config.outbound.cert_path = cert_path;
        }

        if let Ok(key_path) = std::env::var("VIW_AGENT_KEY_PATH") {
            config.outbound.key_path = key_path;
        }

        if let Ok(trust_bundle) = std::env::var("VIW_AGENT_TRUST_BUNDLE") {
            config.outbound.trust_bundle = trust_bundle;
        }

        if let Ok(spki_pin) = std::env::var("VIW_AGENT_BACKEND_SPKI_PIN") {
            config.outbound.backend_spki_pin = spki_pin;
        }

        if let Ok(feature_inbound_http) = std::env::var("VIW_AGENT_FEATURE_INBOUND_HTTP") {
            config.outbound.feature_inbound_http = feature_inbound_http.parse().unwrap_or(false);
        }

        if let Ok(feature_exec_enable) = std::env::var("VIW_AGENT_FEATURE_EXEC_ENABLE") {
            config.outbound.feature_exec_enable = feature_exec_enable.parse().unwrap_or(true);
        }

        if let Ok(scripts_root) = std::env::var("VIW_AGENT_SCRIPTS_ROOT") {
            config.outbound.scripts_root = scripts_root;
        }

        if let Ok(max_concurrency) = std::env::var("VIW_AGENT_MAX_CONCURRENCY") {
            config.outbound.max_concurrency = max_concurrency.parse().unwrap_or(4);
        }

        if let Ok(cmd_timeout_secs) = std::env::var("VIW_AGENT_CMD_TIMEOUT_SECS") {
            config.outbound.cmd_timeout_secs = cmd_timeout_secs.parse().unwrap_or(45);
        }

        if let Ok(site) = std::env::var("VIW_AGENT_SITE") {
            config.outbound.site = Some(site);
        }

        if let Ok(container_engine) = std::env::var("VIW_AGENT_CONTAINER_ENGINE") {
            config.outbound.container_engine = container_engine;
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
                retention_days: 30,
                metrics_enabled: true,
            },
            containers: ContainerConfig {
                base_image: "viworks/chrome:latest".to_string(),
                memory_limit: "512m".to_string(),
                cpu_limit: "0.5".to_string(),
                network_mode: "bridge".to_string(),
                port_range_start: 8000,
                port_range_end: 9000,
            },
            outbound: OutboundConfig {
                backend_url: "wss://backend.example.com/agent".to_string(),
                agent_id: hostname::get()
                    .map(|h| h.to_string_lossy().to_string())
                    .unwrap_or_else(|_| "unknown".to_string()),
                cert_path: "/etc/viworks-agent/client.crt".to_string(),
                key_path: "/etc/viworks-agent/client.key".to_string(),
                trust_bundle: "/etc/viworks-agent/ca.crt".to_string(),
                backend_spki_pin: "".to_string(), // Must be set via env
                feature_inbound_http: false, // Default to secure outbound-only
                feature_exec_enable: true,
                scripts_root: "/opt/Viworks/scripts_viworks".to_string(),
                max_concurrency: 4,
                cmd_timeout_secs: 45,
                site: None,
                container_engine: "docker".to_string(),
            },
        }
    }
}
