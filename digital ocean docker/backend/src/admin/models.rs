// Admin models - Data structures for admin authentication realm
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};
use uuid::Uuid;

// ============================================================================
// DATABASE MODELS
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct AdminUser {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub role: String, // ADMIN, OPERATOR, AUDITOR
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub last_login_at: Option<DateTime<Utc>>,
    pub failed_login_attempts: i32,
    pub locked_until: Option<DateTime<Utc>>,
    pub ip_allowlist: Option<Vec<String>>,
    pub session_timeout_minutes: i32,
    pub require_ip_allowlist: bool,
    pub mfa_enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct AdminSession {
    pub id: Uuid,
    pub admin_user_id: Uuid,
    pub token_hash: String,
    pub refresh_token_hash: Option<String>,
    pub expires_at: DateTime<Utc>,
    pub idle_expires_at: DateTime<Utc>,
    pub ip_address: String,
    pub user_agent: Option<String>,
    pub created_at: DateTime<Utc>,
    pub last_activity_at: DateTime<Utc>,
    pub is_revoked: bool,
    pub revoked_at: Option<DateTime<Utc>>,
    pub revoked_reason: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct AdminAuditLog {
    pub id: Uuid,
    pub admin_user_id: Option<Uuid>,
    pub action: String,
    pub target_type: Option<String>,
    pub target_id: Option<String>,
    pub details: serde_json::Value,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub success: bool,
    pub error_message: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct AdminRolePermission {
    pub id: Uuid,
    pub role: String,
    pub resource: String,
    pub action: String,
    pub created_at: DateTime<Utc>,
}

// ============================================================================
// REQUEST/RESPONSE DTOs
// ============================================================================

#[derive(Debug, Deserialize)]
pub struct AdminLoginRequest {
    pub username: String,
    pub password: String,
    pub otp_code: Option<String>, // For future MFA
}

#[derive(Debug, Serialize)]
pub struct AdminLoginResponse {
    pub success: bool,
    pub message: String,
    pub admin: Option<AdminUserInfo>,
    pub session: Option<AdminSessionInfo>,
    pub requires_mfa: bool,
}

#[derive(Debug, Serialize)]
pub struct AdminUserInfo {
    pub id: String,
    pub username: String,
    pub email: String,
    pub role: String,
    pub is_active: bool,
    pub last_login_at: Option<String>,
    pub session_timeout_minutes: i32,
}

#[derive(Debug, Serialize)]
pub struct AdminSessionInfo {
    pub token: String,
    pub refresh_token: String,
    pub expires_at: String,
    pub idle_timeout_seconds: i32,
}

#[derive(Debug, Deserialize)]
pub struct AdminRefreshRequest {
    pub refresh_token: String,
}

#[derive(Debug, Serialize)]
pub struct AdminRefreshResponse {
    pub success: bool,
    pub message: String,
    pub token: Option<String>,
    pub refresh_token: Option<String>,
    pub expires_at: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateAdminUserRequest {
    pub username: String,
    pub email: String,
    pub password: String,
    pub role: String,
    pub ip_allowlist: Option<Vec<String>>,
    pub session_timeout_minutes: Option<i32>,
    pub require_ip_allowlist: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateAdminUserRequest {
    pub email: Option<String>,
    pub role: Option<String>,
    pub is_active: Option<bool>,
    pub ip_allowlist: Option<Vec<String>>,
    pub session_timeout_minutes: Option<i32>,
    pub require_ip_allowlist: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct AdminChangePasswordRequest {
    pub current_password: String,
    pub new_password: String,
}

#[derive(Debug, Serialize)]
pub struct AdminAuditLogEntry {
    pub id: String,
    pub admin_username: Option<String>,
    pub action: String,
    pub target_type: Option<String>,
    pub target_id: Option<String>,
    pub details: serde_json::Value,
    pub ip_address: Option<String>,
    pub success: bool,
    pub error_message: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct AdminAuditLogFilter {
    pub admin_user_id: Option<Uuid>,
    pub action: Option<String>,
    pub target_type: Option<String>,
    pub success: Option<bool>,
    pub from_date: Option<DateTime<Utc>>,
    pub to_date: Option<DateTime<Utc>>,
    pub page: Option<i64>,
    pub per_page: Option<i64>,
}

// ============================================================================
// JWT CLAIMS
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct AdminClaims {
    pub sub: String, // admin user id
    pub username: String,
    pub role: String,
    pub session_id: String,
    pub iss: String, // issuer - "viworks-admin"
    pub aud: String, // audience - "admin-panel"
    pub exp: i64,    // expiration
    pub iat: i64,    // issued at
    pub nbf: i64,    // not before
}

// ============================================================================
// ENUMS
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum AdminRole {
    Admin,
    Operator,
    Auditor,
}

impl AdminRole {
    pub fn from_str(s: &str) -> Option<Self> {
        match s.to_uppercase().as_str() {
            "ADMIN" => Some(AdminRole::Admin),
            "OPERATOR" => Some(AdminRole::Operator),
            "AUDITOR" => Some(AdminRole::Auditor),
            _ => None,
        }
    }

    pub fn to_string(&self) -> String {
        match self {
            AdminRole::Admin => "ADMIN".to_string(),
            AdminRole::Operator => "OPERATOR".to_string(),
            AdminRole::Auditor => "AUDITOR".to_string(),
        }
    }

    pub fn has_permission(&self, resource: &str, action: &str) -> bool {
        match self {
            AdminRole::Admin => true, // Admin has all permissions
            AdminRole::Operator => {
                matches!(
                    (resource, action),
                    ("users", "create") | 
                    ("users", "read") | 
                    ("users", "update") |
                    ("sessions", "read") |
                    ("sessions", "terminate") |
                    ("policies", "read") |
                    ("audit", "read")
                )
            }
            AdminRole::Auditor => {
                matches!(
                    (resource, action),
                    ("users", "read") |
                    ("sessions", "read") |
                    ("policies", "read") |
                    ("audit", "read") |
                    ("admin_users", "read")
                )
            }
        }
    }
}

// ============================================================================
// VALIDATION
// ============================================================================

impl AdminLoginRequest {
    pub fn validate(&self) -> Result<(), String> {
        if self.username.is_empty() {
            return Err("Username is required".to_string());
        }
        if self.password.is_empty() {
            return Err("Password is required".to_string());
        }
        if self.username.len() < 3 || self.username.len() > 50 {
            return Err("Username must be between 3 and 50 characters".to_string());
        }
        Ok(())
    }
}

impl CreateAdminUserRequest {
    pub fn validate(&self) -> Result<(), String> {
        if self.username.len() < 3 || self.username.len() > 50 {
            return Err("Username must be between 3 and 50 characters".to_string());
        }
        if !self.email.contains('@') {
            return Err("Invalid email address".to_string());
        }
        if self.password.len() < 12 {
            return Err("Password must be at least 12 characters".to_string());
        }
        if AdminRole::from_str(&self.role).is_none() {
            return Err("Invalid role. Must be ADMIN, OPERATOR, or AUDITOR".to_string());
        }
        Ok(())
    }
}
