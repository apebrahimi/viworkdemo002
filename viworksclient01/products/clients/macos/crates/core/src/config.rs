use crate::{Result, ViWorksError};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use dirs;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub cert_server_url: String,
    pub spki_pins: SpkiPins,
    pub auto_logout_timeout: u64,
    pub remember_me: bool,
    pub log_level: String,
    pub binary_paths: BinaryPaths,
    pub binary_hashes: BinaryHashes,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpkiPins {
    pub primary: String,
    pub backup: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BinaryPaths {
    pub fwknop: PathBuf,
    pub openvpn: PathBuf,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BinaryHashes {
    pub fwknop_sha256: String,
    pub openvpn_sha256: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            cert_server_url: "http://localhost:8081".to_string(),
            spki_pins: SpkiPins {
                primary: "".to_string(), // TODO: Set actual SPKI pins
                backup: "".to_string(),
            },
            auto_logout_timeout: 900, // 15 minutes
            remember_me: false,
            log_level: "info".to_string(),
            binary_paths: BinaryPaths {
                fwknop: PathBuf::from("/usr/local/bin/fwknop"),
                openvpn: PathBuf::from("/usr/local/bin/openvpn"),
            },
            binary_hashes: BinaryHashes {
                fwknop_sha256: "".to_string(), // TODO: Set actual hashes
                openvpn_sha256: "".to_string(),
            },
        }
    }
}

impl AppConfig {
    pub fn load() -> Result<Self> {
        let config_path = Self::get_config_path()?;
        
        if config_path.exists() {
            let content = std::fs::read_to_string(&config_path)
                .map_err(|e| ViWorksError::FileSystemError(format!("Failed to read config: {}", e)))?;
            
            let config: AppConfig = serde_json::from_str(&content)
                .map_err(|e| ViWorksError::Serialization(e))?;
            
            Ok(config)
        } else {
            let config = AppConfig::default();
            config.save()?;
            Ok(config)
        }
    }

    pub fn save(&self) -> Result<()> {
        let config_path = Self::get_config_path()?;
        
        // Ensure directory exists
        if let Some(parent) = config_path.parent() {
            std::fs::create_dir_all(parent)
                .map_err(|e| ViWorksError::FileSystemError(format!("Failed to create config directory: {}", e)))?;
        }
        
        let content = serde_json::to_string_pretty(self)
            .map_err(|e| ViWorksError::Serialization(e))?;
        
        std::fs::write(&config_path, content)
            .map_err(|e| ViWorksError::FileSystemError(format!("Failed to write config: {}", e)))?;
        
        Ok(())
    }

    pub fn get_config_path() -> Result<PathBuf> {
        let app_data = dirs::config_local_dir()
            .ok_or_else(|| ViWorksError::FileSystemError("Could not determine config directory".to_string()))?;
        
        Ok(app_data.join("ViWorkS").join("config.json"))
    }

    pub fn get_data_dir() -> Result<PathBuf> {
        let app_data = dirs::data_local_dir()
            .ok_or_else(|| ViWorksError::FileSystemError("Could not determine data directory".to_string()))?;
        
        Ok(app_data.join("ViWorkS"))
    }

    pub fn get_log_dir() -> Result<PathBuf> {
        let log_dir = Self::get_data_dir()?.join("logs");
        std::fs::create_dir_all(&log_dir)
            .map_err(|e| ViWorksError::FileSystemError(format!("Failed to create log directory: {}", e)))?;
        Ok(log_dir)
    }

    pub fn get_temp_dir() -> Result<PathBuf> {
        let temp_dir = Self::get_data_dir()?.join("temp");
        std::fs::create_dir_all(&temp_dir)
            .map_err(|e| ViWorksError::FileSystemError(format!("Failed to create temp directory: {}", e)))?;
        Ok(temp_dir)
    }

    pub fn validate(&self) -> Result<()> {
        // Validate URLs
        if self.cert_server_url.is_empty() {
            return Err(ViWorksError::Internal("Certificate server URL cannot be empty".to_string()));
        }

        // Validate timeouts
        if self.auto_logout_timeout == 0 {
            return Err(ViWorksError::Internal("Auto logout timeout cannot be zero".to_string()));
        }

        // Validate log level
        let valid_levels = ["trace", "debug", "info", "warn", "error"];
        if !valid_levels.contains(&self.log_level.as_str()) {
            return Err(ViWorksError::Internal("Invalid log level".to_string()));
        }

        Ok(())
    }

    pub fn update_remember_me(&mut self, remember: bool) -> Result<()> {
        self.remember_me = remember;
        self.save()
    }

    pub fn update_log_level(&mut self, level: String) -> Result<()> {
        self.log_level = level;
        self.save()
    }
}
