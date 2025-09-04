use serde::{Deserialize, Serialize};
use tracing::info;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub server: ServerConfig,
    pub database: DatabaseConfig,
    pub redis: RedisConfig,
    pub security: SecurityConfig,
    pub agent_management: AgentManagementConfig,
    pub command: CommandConfig,
    pub telemetry: TelemetryConfig,
    pub logging: LoggingConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerConfig {
    pub bind_address: String,
    pub port: u16,
    pub workers: usize,
    pub max_connections: usize,
    pub request_timeout: u64,
    pub cors_origins: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseConfig {
    pub url: String,
    pub max_connections: u32,
    pub min_connections: u32,
    pub connect_timeout: u64,
    pub idle_timeout: u64,
    pub max_lifetime: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RedisConfig {
    pub url: String,
    pub pool_size: u32,
    pub connection_timeout: u64,
    pub read_timeout: u64,
    pub write_timeout: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecurityConfig {
    pub jwt_secret: String,
    pub jwt_expiration: u64,
    pub backend_private_key_path: String,
    pub backend_certificate_path: String,
    pub allowed_origins: Vec<String>,
    pub rate_limit_requests: usize,
    pub rate_limit_window: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentManagementConfig {
    pub bind_address: String,
    pub port: u16,
    pub max_agent_connections: usize,
    pub heartbeat_interval: u64,
    pub connection_timeout: u64,
    pub max_reconnect_attempts: usize,
    pub reconnect_backoff_ms: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommandConfig {
    pub max_concurrent_commands: usize,
    pub command_timeout: u64,
    pub max_command_queue_size: usize,
    pub retry_attempts: usize,
    pub retry_delay_ms: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TelemetryConfig {
    pub collection_interval: u64,
    pub retention_days: u32,
    pub batch_size: usize,
    pub flush_interval: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoggingConfig {
    pub level: String,
    pub format: String,
    pub output: String,
    pub max_file_size: u64,
    pub max_files: usize,
}

impl Config {
    pub fn load() -> Result<Self, Box<dyn std::error::Error>> {
        let config_path = std::env::var("BACKEND_AGENT_CONFIG")
            .unwrap_or_else(|_| "config/backend-agent.toml".to_string());

        info!("Loading configuration from: {}", config_path);

        let config_content = std::fs::read_to_string(&config_path)
            .map_err(|e| format!("Failed to read config file {}: {}", config_path, e))?;

        let mut config: Config = toml::from_str(&config_content)
            .map_err(|e| format!("Failed to parse config file: {}", e))?;

        // Override with environment variables
        config.override_from_env()?;

        info!("Configuration loaded successfully");
        Ok(config)
    }

    fn override_from_env(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        // Server configuration
        if let Ok(bind_addr) = std::env::var("BACKEND_AGENT_BIND_ADDRESS") {
            self.server.bind_address = bind_addr;
        }

        if let Ok(port) = std::env::var("BACKEND_AGENT_PORT") {
            self.server.port = port.parse()?;
        }

        if let Ok(workers) = std::env::var("BACKEND_AGENT_WORKERS") {
            self.server.workers = workers.parse()?;
        }

        // Database configuration
        if let Ok(db_url) = std::env::var("DATABASE_URL") {
            self.database.url = db_url;
        }

        if let Ok(max_conn) = std::env::var("DATABASE_MAX_CONNECTIONS") {
            self.database.max_connections = max_conn.parse()?;
        }

        // Redis configuration
        if let Ok(redis_url) = std::env::var("REDIS_URL") {
            self.redis.url = redis_url;
        }

        if let Ok(pool_size) = std::env::var("REDIS_POOL_SIZE") {
            self.redis.pool_size = pool_size.parse()?;
        }

        // Security configuration
        if let Ok(jwt_secret) = std::env::var("JWT_SECRET") {
            self.security.jwt_secret = jwt_secret;
        }

        if let Ok(jwt_exp) = std::env::var("JWT_EXPIRATION") {
            self.security.jwt_expiration = jwt_exp.parse()?;
        }

        if let Ok(private_key) = std::env::var("BACKEND_PRIVATE_KEY_PATH") {
            self.security.backend_private_key_path = private_key;
        }

        if let Ok(cert_path) = std::env::var("BACKEND_CERTIFICATE_PATH") {
            self.security.backend_certificate_path = cert_path;
        }

        // Agent management configuration
        if let Ok(max_agents) = std::env::var("MAX_AGENT_CONNECTIONS") {
            self.agent_management.max_agent_connections = max_agents.parse()?;
        }

        if let Ok(heartbeat) = std::env::var("AGENT_HEARTBEAT_INTERVAL") {
            self.agent_management.heartbeat_interval = heartbeat.parse()?;
        }

        // Command configuration
        if let Ok(max_cmds) = std::env::var("MAX_CONCURRENT_COMMANDS") {
            self.command.max_concurrent_commands = max_cmds.parse()?;
        }

        if let Ok(cmd_timeout) = std::env::var("COMMAND_TIMEOUT") {
            self.command.command_timeout = cmd_timeout.parse()?;
        }

        // Logging configuration
        if let Ok(log_level) = std::env::var("RUST_LOG") {
            self.logging.level = log_level;
        }

        Ok(())
    }

    pub fn validate(&self) -> Result<(), Vec<String>> {
        let mut errors = Vec::new();

        // Validate server configuration
        if self.server.port == 0 {
            errors.push("Server port cannot be 0".to_string());
        }

        if self.server.workers == 0 {
            errors.push("Server workers cannot be 0".to_string());
        }

        // Validate database configuration
        if self.database.url.is_empty() {
            errors.push("Database URL cannot be empty".to_string());
        }

        if self.database.max_connections == 0 {
            errors.push("Database max connections cannot be 0".to_string());
        }

        // Validate Redis configuration
        if self.redis.url.is_empty() {
            errors.push("Redis URL cannot be empty".to_string());
        }

        if self.redis.pool_size == 0 {
            errors.push("Redis pool size cannot be 0".to_string());
        }

        // Validate security configuration
        if self.security.jwt_secret.is_empty() {
            errors.push("JWT secret cannot be empty".to_string());
        }

        if self.security.jwt_expiration == 0 {
            errors.push("JWT expiration cannot be 0".to_string());
        }

        // Validate agent management configuration
        if self.agent_management.max_agent_connections == 0 {
            errors.push("Max agent connections cannot be 0".to_string());
        }

        if self.agent_management.heartbeat_interval == 0 {
            errors.push("Heartbeat interval cannot be 0".to_string());
        }

        // Validate command configuration
        if self.command.max_concurrent_commands == 0 {
            errors.push("Max concurrent commands cannot be 0".to_string());
        }

        if self.command.command_timeout == 0 {
            errors.push("Command timeout cannot be 0".to_string());
        }

        if errors.is_empty() {
            Ok(())
        } else {
            Err(errors)
        }
    }
}

impl Default for Config {
    fn default() -> Self {
        Self {
            server: ServerConfig::default(),
            database: DatabaseConfig::default(),
            redis: RedisConfig::default(),
            security: SecurityConfig::default(),
            agent_management: AgentManagementConfig::default(),
            command: CommandConfig::default(),
            telemetry: TelemetryConfig::default(),
            logging: LoggingConfig::default(),
        }
    }
}

impl Default for ServerConfig {
    fn default() -> Self {
        Self {
            bind_address: "0.0.0.0".to_string(),
            port: 8080,
            workers: num_cpus::get(),
            max_connections: 1000,
            request_timeout: 30,
            cors_origins: vec!["*".to_string()],
        }
    }
}

impl Default for DatabaseConfig {
    fn default() -> Self {
        Self {
            url: "postgresql://localhost/viworks".to_string(),
            max_connections: 10,
            min_connections: 2,
            connect_timeout: 10,
            idle_timeout: 300,
            max_lifetime: 3600,
        }
    }
}

impl Default for RedisConfig {
    fn default() -> Self {
        Self {
            url: "redis://localhost:6379".to_string(),
            pool_size: 10,
            connection_timeout: 5,
            read_timeout: 3,
            write_timeout: 3,
        }
    }
}

impl Default for SecurityConfig {
    fn default() -> Self {
        Self {
            jwt_secret: "change-me-in-production".to_string(),
            jwt_expiration: 3600,
            backend_private_key_path: "/etc/viworks/backend.key".to_string(),
            backend_certificate_path: "/etc/viworks/backend.crt".to_string(),
            allowed_origins: vec!["*".to_string()],
            rate_limit_requests: 100,
            rate_limit_window: 60,
        }
    }
}

impl Default for AgentManagementConfig {
    fn default() -> Self {
        Self {
            bind_address: "0.0.0.0".to_string(),
            port: 8080,
            max_agent_connections: 100,
            heartbeat_interval: 30,
            connection_timeout: 60,
            max_reconnect_attempts: 5,
            reconnect_backoff_ms: 1000,
        }
    }
}

impl Default for CommandConfig {
    fn default() -> Self {
        Self {
            max_concurrent_commands: 50,
            command_timeout: 60,
            max_command_queue_size: 1000,
            retry_attempts: 3,
            retry_delay_ms: 1000,
        }
    }
}

impl Default for TelemetryConfig {
    fn default() -> Self {
        Self {
            collection_interval: 30,
            retention_days: 30,
            batch_size: 100,
            flush_interval: 5,
        }
    }
}

impl Default for LoggingConfig {
    fn default() -> Self {
        Self {
            level: "info".to_string(),
            format: "json".to_string(),
            output: "stdout".to_string(),
            max_file_size: 100 * 1024 * 1024, // 100MB
            max_files: 10,
        }
    }
}
