// Authentication and authorization module
// This will be implemented in Phase 3

pub mod jwt;
pub mod password;
pub mod middleware;

use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use sqlx::{PgPool, Row};
use anyhow::Result;
use crate::auth::{jwt::{JwtService, TokenResponse}, password::PasswordService};
use crate::config::AppConfig;
use crate::models::UserStatus;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub role: UserRole,
    pub is_active: bool,
    pub last_login_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum UserRole {
    Owner,
    OrgAdmin,
    SecurityAdmin,
    SecurityAnalyst,
    Helpdesk,
    Auditor,
    ApiService,
}

impl From<&str> for UserRole {
    fn from(s: &str) -> Self {
        match s {
            "owner" => UserRole::Owner,
            "org_admin" => UserRole::OrgAdmin,
            "security_admin" => UserRole::SecurityAdmin,
            "security_analyst" => UserRole::SecurityAnalyst,
            "helpdesk" => UserRole::Helpdesk,
            "auditor" => UserRole::Auditor,
            "api_service" => UserRole::ApiService,
            _ => UserRole::Auditor,
        }
    }
}

impl ToString for UserRole {
    fn to_string(&self) -> String {
        match self {
            UserRole::Owner => "owner".to_string(),
            UserRole::OrgAdmin => "org_admin".to_string(),
            UserRole::SecurityAdmin => "security_admin".to_string(),
            UserRole::SecurityAnalyst => "security_analyst".to_string(),
            UserRole::Helpdesk => "helpdesk".to_string(),
            UserRole::Auditor => "auditor".to_string(),
            UserRole::ApiService => "api_service".to_string(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub user: User,
    pub token: TokenResponse,
}

pub struct AuthService {
    pub jwt_service: JwtService,
    password_service: PasswordService,
    db_pool: PgPool,
}

impl AuthService {
    pub fn new(config: &AppConfig, db_pool: PgPool) -> Self {
        Self {
            jwt_service: JwtService::new(config),
            password_service: PasswordService::new(config.bcrypt_cost),
            db_pool,
        }
    }
    
    pub async fn authenticate_user(&self, username: &str, password: &str) -> Result<Option<User>> {
        // Get user from database using runtime query
        let row = sqlx::query(
            r#"
            SELECT 
                id, username, email, role::text, 
                status::text, last_login::timestamptz, created_at::timestamptz, updated_at::timestamptz
            FROM users 
            WHERE username = $1 AND status = 'active'
            "#
        )
        .bind(username)
        .fetch_optional(&self.db_pool)
        .await?;
        
        let user = if let Some(row) = row {
            let status: String = row.get("status");
            let user_status = UserStatus::from(status.clone());
            Some(User {
                id: row.get("id"),
                username: row.get("username"),
                email: row.get("email"),
                role: UserRole::from(row.get::<String, _>("role").as_str()),
                is_active: status == "active",
                last_login_at: row.get("last_login"),
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            })
        } else {
            None
        };
        
        if let Some(user) = user {
            // Get password hash using runtime query
            let row = sqlx::query("SELECT password_hash FROM users WHERE id = $1")
                .bind(user.id)
                .fetch_one(&self.db_pool)
                .await?;
            let password_hash: String = row.get("password_hash");
            
            // Verify password
            if self.password_service.verify_password(password, &password_hash)? {
                // Update last login using runtime query
                sqlx::query("UPDATE users SET last_login = NOW() WHERE id = $1")
                    .bind(user.id)
                    .execute(&self.db_pool)
                    .await?;
                
                Ok(Some(user))
            } else {
                Ok(None)
            }
        } else {
            Ok(None)
        }
    }
    
    pub fn hash_password(&self, password: &str) -> Result<String, bcrypt::BcryptError> {
        self.password_service.hash_password(password)
    }
    
    pub async fn login(&self, login_req: &LoginRequest) -> Result<Option<LoginResponse>> {
        if let Some(user) = self.authenticate_user(&login_req.username, &login_req.password).await? {
            let token = self.jwt_service.create_token_response(
                user.id,
                &user.username,
                &user.role.to_string()
            )?;
            
            Ok(Some(LoginResponse { user, token }))
        } else {
            Ok(None)
        }
    }
    
    pub async fn get_user_by_id(&self, user_id: Uuid) -> Result<Option<User>> {
        let row = sqlx::query(
            r#"
            SELECT 
                id, username, email, role::text, 
                status::text, last_login::timestamptz, created_at::timestamptz, updated_at::timestamptz
            FROM users 
            WHERE id = $1 AND status = 'active'
            "#
        )
        .bind(user_id)
        .fetch_optional(&self.db_pool)
        .await?;
        
        let user = if let Some(row) = row {
            let status: String = row.get("status");
            let user_status = UserStatus::from(status.clone());
            Some(User {
                id: row.get("id"),
                username: row.get("username"),
                email: row.get("email"),
                role: UserRole::from(row.get::<String, _>("role").as_str()),
                is_active: status == "active",
                last_login_at: row.get("last_login"),
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            })
        } else {
            None
        };
        
        Ok(user)
    }
    
    pub async fn create_user(
        &self,
        username: &str,
        email: &str,
        password: &str,
        role: UserRole,
    ) -> Result<User> {
        // Validate password strength
        self.password_service.validate_password_strength(password)?;
        
        // Hash password
        let password_hash = self.password_service.hash_password(password)?;
        
        // Insert user using runtime query
        let row = sqlx::query(
            r#"
            INSERT INTO users (username, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            RETURNING 
                id, username, email, role, 
                is_active, last_login_at, created_at, updated_at
            "#
        )
        .bind(username)
        .bind(email)
        .bind(password_hash)
        .bind(role.to_string())
        .fetch_one(&self.db_pool)
        .await?;
        
        let user = User {
            id: row.get("id"),
            username: row.get("username"),
            email: row.get("email"),
            role: UserRole::from(row.get::<String, _>("role").as_str()),
            is_active: row.get("is_active"),
            last_login_at: row.get("last_login_at"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        };
        
        Ok(user)
    }
    
    pub fn validate_token(&self, token: &str) -> Result<jwt::Claims> {
        Ok(self.jwt_service.validate_token(token)?)
    }
}

// Re-export for convenience
pub use jwt::Claims;
pub use middleware::{AuthMiddleware, RoleMiddleware, get_claims_from_request};
