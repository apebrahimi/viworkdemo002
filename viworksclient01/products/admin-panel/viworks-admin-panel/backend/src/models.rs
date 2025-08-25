// Database models and data structures
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc, NaiveDateTime};
use sqlx::types::ipnetwork::IpNetwork;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub password_hash: String,
    pub role: String, // user_role enum as text
    pub is_active: bool,
    pub last_login_at: Option<DateTime<Utc>>,
    pub failed_login_attempts: i32,
    pub locked_until: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserRestriction {
    pub id: Uuid,
    pub user_id: Uuid,
    pub allowed_days: serde_json::Value,
    pub allowed_hours_start: String,
    pub allowed_hours_end: String,
    pub max_sessions: i32,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    pub id: Uuid,
    pub user_id: Uuid,
    pub token_hash: String,
    pub expires_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Client {
    pub id: Uuid,
    pub name: String,
    pub platform: String,
    pub version: String,
    pub status: String, // client_status enum
    pub ip_address: Option<IpNetwork>,
    pub mac_address: Option<String>, // Changed from MacAddress to String
    pub last_seen: Option<DateTime<Utc>>,
    pub connection_count: i32,
    pub total_connection_time: Option<String>, // INTERVAL type
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthLog {
    pub id: Uuid,
    pub user_id: Uuid,
    pub action: String,
    pub ip_address: Option<IpNetwork>,
    pub user_agent: Option<String>,
    pub details: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerConfig {
    pub id: Uuid,
    pub server_ip: IpNetwork,
    pub stunnel_port: i32,
    pub openvpn_port: i32,
    pub spa_port: i32,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemLog {
    pub id: Uuid,
    pub source: String,
    pub level: String, // log_level enum
    pub message: String,
    pub details: Option<serde_json::Value>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditLog {
    pub id: Uuid,
    pub user_id: Option<Uuid>,
    pub action: String,
    pub resource_type: Option<String>,
    pub resource_id: Option<Uuid>,
    pub details: Option<serde_json::Value>,
    pub ip_address: Option<IpNetwork>,
    pub user_agent: Option<String>,
    pub created_at: DateTime<Utc>,
}

// Legacy models for backward compatibility
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AdminUser {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub password_hash: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub role: UserRole,
    pub status: UserStatus,
    pub last_login: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum UserRole {
    Admin,
    User,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum UserStatus {
    #[serde(rename = "active")]
    Active,
    #[serde(rename = "inactive")]
    Inactive,
    #[serde(rename = "suspended")]
    Suspended,
}

impl From<String> for UserStatus {
    fn from(s: String) -> Self {
        match s.as_str() {
            "active" => UserStatus::Active,
            "inactive" => UserStatus::Inactive,
            "suspended" => UserStatus::Suspended,
            _ => UserStatus::Inactive, // default
        }
    }
}

impl From<UserStatus> for String {
    fn from(status: UserStatus) -> Self {
        match status {
            UserStatus::Active => "active".to_string(),
            UserStatus::Inactive => "inactive".to_string(),
            UserStatus::Suspended => "suspended".to_string(),
        }
    }
}

impl std::fmt::Display for UserRole {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            UserRole::Admin => write!(f, "admin"),
            UserRole::User => write!(f, "user"),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ViWorkSClient {
    pub id: Uuid,
    pub name: String,
    pub ip_address: Option<String>,
    pub mac_address: Option<String>,
    pub status: ClientStatus,
    pub last_seen: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ClientStatus {
    #[serde(rename = "online")]
    Online,
    #[serde(rename = "offline")]
    Offline,
    #[serde(rename = "connecting")]
    Connecting,
    #[serde(rename = "error")]
    Error,
}

impl From<String> for ClientStatus {
    fn from(s: String) -> Self {
        match s.as_str() {
            "online" => ClientStatus::Online,
            "offline" => ClientStatus::Offline,
            "connecting" => ClientStatus::Connecting,
            "error" => ClientStatus::Error,
            _ => ClientStatus::Offline, // default
        }
    }
}

impl From<ClientStatus> for String {
    fn from(status: ClientStatus) -> Self {
        match status {
            ClientStatus::Online => "online".to_string(),
            ClientStatus::Offline => "offline".to_string(),
            ClientStatus::Connecting => "connecting".to_string(),
            ClientStatus::Error => "error".to_string(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConnectionLog {
    pub id: Uuid,
    pub client_id: Uuid,
    pub event_type: String,
    pub details: serde_json::Value,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecurityAlert {
    pub id: Uuid,
    pub severity: AlertSeverity,
    pub title: String,
    pub description: String,
    pub is_resolved: bool,
    pub created_at: DateTime<Utc>,
    pub resolved_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AlertSeverity {
    Low,
    Medium,
    High,
    Critical,
}
