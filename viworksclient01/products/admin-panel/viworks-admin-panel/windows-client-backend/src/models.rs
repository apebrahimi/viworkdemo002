use serde::{Deserialize, Serialize};
use uuid::Uuid;

// Request/Response models for Windows Client integration

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
    pub device_id: String,
    pub client_version: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub success: bool,
    pub message: String,
    pub requires_2fa: bool,
    pub user_id: Option<Uuid>,
}

#[derive(Debug, Deserialize)]
pub struct TwoFactorRequest {
    pub username: String,
}

#[derive(Debug, Serialize)]
pub struct TwoFactorCodeResponse {
    pub success: bool,
    pub message: String,
    pub code: Option<String>, // For testing - in production don't return this
}

#[derive(Debug, Deserialize)]
pub struct ValidateCodeRequest {
    pub username: String,
    pub code: String,
}

#[derive(Debug, Serialize)]
pub struct TwoFactorResponse {
    pub success: bool,
    pub message: String,
    pub session_token: Option<String>,
    pub user_id: Option<Uuid>,
}

#[derive(Debug, Deserialize)]
pub struct GetConfigsRequest {
    pub username: String,
    pub session_token: String,
}

#[derive(Debug, Serialize)]
pub struct ConfigsResponse {
    pub success: bool,
    pub message: String,
    pub stunnel_config: Option<String>,
    pub openvpn_config: Option<String>,
    pub spa_config: Option<String>,
    pub server_ip: Option<String>,
    pub server_port: Option<u16>,
}

// Windows Client API endpoints
#[derive(Debug, Serialize)]
pub struct WindowsLoginResponse {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_in: u64,
}

#[derive(Debug, Serialize)]
pub struct BootstrapResponse {
    pub server_host: String,
    pub server_port: u16,
    pub fwknop_key: String,
    pub fwknop_hmac: String,
    pub ovpn_base: String,
    pub ovpn_auth: Option<OvpnAuth>,
}

#[derive(Debug, Serialize)]
pub struct OvpnAuth {
    pub username: String,
    pub password: String,
}

// Client management models
#[derive(Debug, Deserialize)]
pub struct ClientConnectRequest {
    pub username: String,
    pub session_token: String,
    pub client_name: String,
    pub ip_address: String,
    pub mac_address: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ClientDisconnectRequest {
    pub username: String,
    pub session_token: String,
    pub client_id: Uuid,
}

#[derive(Debug, Deserialize)]
pub struct ClientLogRequest {
    pub username: String,
    pub session_token: String,
    pub client_id: Uuid,
    pub log_level: String,
    pub message: String,
    pub details: Option<serde_json::Value>,
}

// User model
#[derive(Debug, Clone)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub password_hash: String,
    pub role: String,
    pub status: String,
}
