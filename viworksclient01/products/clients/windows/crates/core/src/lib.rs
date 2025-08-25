pub mod errors;
pub mod fsm;
pub mod validation;
pub mod config;
pub mod logging;
pub mod security;  // New security module
pub mod security_dashboard;  // Security monitoring dashboard
pub mod admin_panel;  // Admin panel management

pub use errors::*;
pub use fsm::*;
pub use validation::*;
pub use config::*;
pub use logging::*;
// Export security utilities (selective to avoid conflicts)
pub use security::{SecureAllocator, SecureBox, SecureBytes, RateLimiter, SecureSession, SecureRandom, InputSanitizer, SecurityAudit};
// Export security dashboard
pub use security_dashboard::*;

use serde::{Deserialize, Serialize};
use std::time::Duration;
use zeroize::Zeroize;

// Timeout constants
pub const SPA_TIMEOUT: Duration = Duration::from_secs(30);
pub const VPN_TIMEOUT: Duration = Duration::from_secs(60);
pub const SESSION_TIMEOUT: Duration = Duration::from_secs(3600); // 1 hour
pub const AUTO_LOGOUT_TIMEOUT: Duration = Duration::from_secs(900); // 15 minutes

// Size limits
pub const MAX_OVPN_SIZE: usize = 1024 * 1024; // 1MB limit

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConnectionConfig {
    pub server_host: String,
    pub server_port: u16,
    pub fwknop_key: SecretString,
    pub fwknop_hmac: SecretString,
    pub ovpn_config: String,
    pub ovpn_auth: Option<OvpnAuth>,
    pub stunnel_enabled: bool,
    pub stunnel_accept: String,
    pub stunnel_connect: String,
    pub stunnel_cert: Option<String>,
    pub skip_spa: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OvpnAuth {
    pub username: SecretString,
    pub password: SecretString,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AuthType {
    UserPass,
    Static,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthTokens {
    pub access_token: SecretString,
    pub refresh_token: SecretString,
    pub expires_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BootstrapData {
    pub server_host: String,
    pub server_port: u16,
    pub fwknop_key: SecretString,
    pub fwknop_hmac: SecretString,
    pub ovpn_base: String,
    pub ovpn_auth: Option<OvpnAuth>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: SecretString,
    pub device_id: String,
    pub client_version: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoginResponse {
    pub access_token: SecretString,
    pub refresh_token: SecretString,
    pub expires_in: u64,
}

/// Secure string that zeroizes on drop
#[derive(Debug, Clone)]
pub struct SecretString {
    inner: String,
}

impl SecretString {
    pub fn new(s: String) -> Self {
        Self { inner: s }
    }

    pub fn as_str(&self) -> &str {
        &self.inner
    }

    pub fn into_inner(mut self) -> String {
        // Create a temporary copy to avoid moving out of Drop
        let data = std::mem::replace(&mut self.inner, String::new());
        std::mem::forget(self); // Prevent Drop from being called
        data
    }
}

impl Zeroize for SecretString {
    fn zeroize(&mut self) {
        self.inner.zeroize();
    }
}

impl Drop for SecretString {
    fn drop(&mut self) {
        self.zeroize();
    }
}

// Custom serde implementation for SecretString
impl serde::Serialize for SecretString {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        if cfg!(debug_assertions) {
            serializer.serialize_str(&self.inner)
        } else {
            serializer.serialize_str("[REDACTED]")
        }
    }
}

impl<'de> serde::Deserialize<'de> for SecretString {
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        Ok(SecretString::new(s))
    }
}

impl From<String> for SecretString {
    fn from(s: String) -> Self {
        Self::new(s)
    }
}

impl From<&str> for SecretString {
    fn from(s: &str) -> Self {
        Self::new(s.to_string())
    }
}
