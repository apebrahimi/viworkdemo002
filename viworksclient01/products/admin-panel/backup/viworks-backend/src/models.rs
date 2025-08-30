// Database models and data structures
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub password_hash: String,
    pub mobile: Option<String>,
    pub status: UserStatus,
    pub roles: serde_json::Value,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub last_login_at: Option<DateTime<Utc>>,
    pub failed_login_attempts: i32,
    pub locked_until: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "user_status", rename_all = "lowercase")]
pub enum UserStatus {
    Active,
    Inactive,
    Pending,
    Suspended,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Session {
    pub id: Uuid,
    pub user_id: Uuid,
    pub device_id: Option<Uuid>,
    pub access_token: String,
    pub refresh_token: Option<String>,
    pub status: SessionStatus,
    pub started_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub last_activity_at: DateTime<Utc>,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub policy_snapshot: Option<serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "session_status", rename_all = "lowercase")]
pub enum SessionStatus {
    Active,
    Expired,
    Terminated,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct DesktopDevice {
    pub id: Uuid,
    pub user_id: Uuid,
    pub device_pubkey: String,
    pub platform: String,
    pub fingerprint: String,
    pub enrolled_at: DateTime<Utc>,
    pub last_used_at: DateTime<Utc>,
    pub status: DeviceStatus,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct MobileDevice {
    pub id: Uuid,
    pub user_id: Uuid,
    pub device_id: String,
    pub fcm_token: Option<String>,
    pub device_model: Option<String>,
    pub device_os: Option<String>,
    pub app_version: Option<String>,
    pub bound_at: DateTime<Utc>,
    pub last_used_at: DateTime<Utc>,
    pub status: DeviceStatus,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "device_status", rename_all = "lowercase")]
pub enum DeviceStatus {
    Pending,
    Approved,
    Rejected,
    Revoked,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct OtpChallenge {
    pub id: Uuid,
    pub user_id: Uuid,
    pub code_hash: String,
    pub expires_at: DateTime<Utc>,
    pub attempts: i32,
    pub max_attempts: i32,
    pub created_at: DateTime<Utc>,
    pub used_at: Option<DateTime<Utc>>,
    pub ip_address: Option<String>,
    pub device_info: Option<serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Policy {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub rbac_roles: serde_json::Value,
    pub abac_rules: serde_json::Value,
    pub version: i32,
    pub is_active: bool,
    pub created_by: Option<Uuid>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct AuditEvent {
    pub id: Uuid,
    pub event_type: AuditEventType,
    pub user_id: Option<Uuid>,
    pub session_id: Option<Uuid>,
    pub target_user_id: Option<Uuid>,
    pub details: serde_json::Value,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "audit_event_type", rename_all = "lowercase")]
pub enum AuditEventType {
    LoginSuccess,
    LoginFailed,
    Logout,
    UserCreated,
    UserUpdated,
    UserDeleted,
    DeviceBound,
    DeviceUnbound,
    SessionStarted,
    SessionTerminated,
    PolicyUpdated,
    AdminAction,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct DeviceBindingRequest {
    pub id: Uuid,
    pub user_id: Uuid,
    pub device_type: String,
    pub fingerprint: String,
    pub device_info: serde_json::Value,
    pub status: DeviceStatus,
    pub requested_at: DateTime<Utc>,
    pub approved_at: Option<DateTime<Utc>>,
    pub approved_by: Option<Uuid>,
    pub expires_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct VerificationRequest {
    pub id: Uuid,
    pub user_id: Uuid,
    pub device_id: String,
    pub code: String,
    pub expires_at: DateTime<Utc>,
    pub approved: Option<bool>,
    pub completed: bool,
    pub ip_address: Option<String>,
    pub location_lat: Option<f64>,
    pub location_lng: Option<f64>,
    pub network_info: Option<serde_json::Value>,
    pub created_at: DateTime<Utc>,
}

// Request/Response DTOs
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateUserRequest {
    pub username: String,
    pub email: String,
    pub password: String,
    pub mobile: Option<String>,
    pub roles: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginResponse {
    pub success: bool,
    pub message: String,
    pub data: Option<LoginData>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginData {
    pub session_id: String,
    pub requires_2fa: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OtpVerifyRequest {
    pub session_id: String,
    pub code: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OtpVerifyResponse {
    pub success: bool,
    pub message: String,
    pub data: Option<AuthData>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthData {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_in: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeviceBindRequest {
    pub username: String,
    pub fingerprint: String,
    pub device_type: String,
    pub device_info: serde_json::Value,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClientBootstrapRequest {
    pub session_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClientBootstrapResponse {
    pub fwknop: FwknopConfig,
    pub stunnel: StunnelConfig,
    pub openvpn: OpenVpnConfig,
    pub browser: BrowserConfig,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FwknopConfig {
    pub remote_ip: String,
    pub key_rijndael: String,
    pub key_hmac: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StunnelConfig {
    pub server: String,
    pub port: u16,
    pub ca_pem: String,
    pub client_cert: String,
    pub client_key: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OpenVpnConfig {
    pub base_ovpn: String,
    pub auth: OpenVpnAuth,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OpenVpnAuth {
    pub r#type: String,
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BrowserConfig {
    pub policy: String,
}
