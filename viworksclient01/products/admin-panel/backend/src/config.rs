use serde::{Deserialize, Serialize};
use std::env;
use anyhow::{Result, Context};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    // Server configuration
    pub host: String,
    pub port: u16,
    
    // Database configuration
    pub database_url: String,
    
    // Redis configuration
    pub redis_url: String,
    
    // Security configuration
    pub jwt_secret: String,
    pub jwt_expiration: u64,
    pub bcrypt_cost: u32,
    
    // CORS configuration
    pub cors_origins: Vec<String>,
    
    // Logging configuration
    pub log_level: String,
    
    // Admin panel specific
    pub admin_panel_url: String,
    pub api_base_url: String,
    
    // ViWorkS integration
    pub viworks_api_url: String,
    pub viworks_api_key: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            host: "0.0.0.0".to_string(),
            port: 8081,
            database_url: "postgresql://postgres:password@localhost:5433/viworks_admin".to_string(),
            redis_url: "redis://localhost:6380".to_string(),
            jwt_secret: "your-super-secret-jwt-key-change-this-in-production".to_string(),
            jwt_expiration: 3600, // 1 hour
            bcrypt_cost: 12,
            cors_origins: vec!["http://localhost:3000".to_string()],
            log_level: "info".to_string(),
            admin_panel_url: "http://localhost:3000".to_string(),
            api_base_url: "http://localhost:8081".to_string(),
            viworks_api_url: "https://viworks.ir/api".to_string(),
            viworks_api_key: "".to_string(),
        }
    }
}

impl AppConfig {
    pub fn load() -> Result<Self> {
        // Load .env file if it exists
        dotenv::dotenv().ok();
        
        let mut config = AppConfig::default();
        
        // Override with environment variables
        if let Ok(host) = env::var("HOST") {
            config.host = host;
        }
        
        if let Ok(port) = env::var("PORT") {
            config.port = port.parse()
                .context("Invalid PORT environment variable")?;
        }
        
        if let Ok(database_url) = env::var("DATABASE_URL") {
            config.database_url = database_url;
        }
        
        if let Ok(redis_url) = env::var("REDIS_URL") {
            config.redis_url = redis_url;
        }
        
        if let Ok(jwt_secret) = env::var("JWT_SECRET") {
            config.jwt_secret = jwt_secret;
        }
        
        if let Ok(jwt_expiration) = env::var("JWT_EXPIRATION") {
            config.jwt_expiration = jwt_expiration.parse()
                .context("Invalid JWT_EXPIRATION environment variable")?;
        }
        
        if let Ok(bcrypt_cost) = env::var("BCRYPT_COST") {
            config.bcrypt_cost = bcrypt_cost.parse()
                .context("Invalid BCRYPT_COST environment variable")?;
        }
        
        if let Ok(cors_origins) = env::var("CORS_ORIGINS") {
            config.cors_origins = cors_origins
                .split(',')
                .map(|s| s.trim().to_string())
                .collect();
        }
        
        if let Ok(log_level) = env::var("LOG_LEVEL") {
            config.log_level = log_level;
        }
        
        if let Ok(admin_panel_url) = env::var("ADMIN_PANEL_URL") {
            config.admin_panel_url = admin_panel_url;
        }
        
        if let Ok(api_base_url) = env::var("API_BASE_URL") {
            config.api_base_url = api_base_url;
        }
        
        if let Ok(viworks_api_url) = env::var("VIWORKS_API_URL") {
            config.viworks_api_url = viworks_api_url;
        }
        
        if let Ok(viworks_api_key) = env::var("VIWORKS_API_KEY") {
            config.viworks_api_key = viworks_api_key;
        }
        
        // Validate configuration
        config.validate()?;
        
        Ok(config)
    }
    
    fn validate(&self) -> Result<()> {
        if self.jwt_secret.len() < 32 {
            anyhow::bail!("JWT_SECRET must be at least 32 characters long");
        }
        
        if self.bcrypt_cost < 10 || self.bcrypt_cost > 14 {
            anyhow::bail!("BCRYPT_COST must be between 10 and 14");
        }
        
        if self.port == 0 {
            anyhow::bail!("PORT cannot be 0");
        }
        
        Ok(())
    }
}
