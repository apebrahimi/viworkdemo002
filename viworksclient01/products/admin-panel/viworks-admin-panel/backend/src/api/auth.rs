use actix_web::{web, HttpResponse, HttpRequest};
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, Row};
use uuid::Uuid;
use chrono::{Utc, Duration};
use bcrypt::verify;
use rand::Rng;
use sqlx::types::ipnetwork::IpNetwork;

use crate::utils::jwt::create_token;

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct TwoFactorRequest {
    pub username: String,
    pub code: String,
}

#[derive(Debug, Deserialize)]
pub struct RequestTwoFactorCode {
    pub username: String,
}

#[derive(Debug, Deserialize)]
pub struct ValidateCodeRequest {
    pub username: String,
    pub code: String,
}

#[derive(Debug, Deserialize)]
pub struct GetConfigsRequest {
    pub username: String,
    pub session_token: String,
}

// Device Management Models
#[derive(Debug, Deserialize)]
pub struct DeviceRegistrationRequest {
    pub user_id: String,
    pub device_id: String,
    pub fcm_token: Option<String>,
    pub device_info: DeviceInfo,
}

#[derive(Debug, Deserialize)]
pub struct DeviceInfo {
    pub model: String,
    pub os: String,
    pub app_version: String,
    pub manufacturer: Option<String>,
    pub device_name: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct DeviceVerificationRequest {
    pub request_id: String,
    pub device_id: String,
    pub location: Option<LocationInfo>,
    pub network_info: Option<NetworkInfo>,
    pub device_integrity_token: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct LocationInfo {
    pub latitude: f64,
    pub longitude: f64,
}

#[derive(Debug, Deserialize)]
pub struct NetworkInfo {
    pub ip: String,
    pub carrier: Option<String>,
    pub network_type: String,
}

#[derive(Debug, Deserialize)]
pub struct ConfirmVerificationRequest {
    pub request_id: String,
    pub approved: bool,
    pub device_id: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub token: String,
    pub refresh_token: String,
    pub user: User,
}

#[derive(Debug, Serialize)]
pub struct User {
    pub id: String,
    pub username: String,
    pub email: String,
    pub role: String,
    pub is_active: bool,
    pub last_login_at: Option<String>,
    pub failed_login_attempts: i32,
    pub locked_until: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize)]
pub struct TwoFactorResponse {
    pub success: bool,
    pub message: String,
    pub session_token: Option<String>,
    pub user_id: Option<Uuid>,
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

#[derive(Debug, Serialize)]
pub struct TwoFactorCodeResponse {
    pub success: bool,
    pub message: String,
    pub code: Option<String>,
}

// Device Management Responses
#[derive(Debug, Serialize)]
pub struct DeviceRegistrationResponse {
    pub success: bool,
    pub message: String,
    pub device_registered: bool,
    pub device_id: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct DeviceVerificationResponse {
    pub success: bool,
    pub code: Option<String>,
    pub expires_at: Option<i64>,
    pub message: String,
}

#[derive(Debug, Serialize)]
pub struct ConfirmVerificationResponse {
    pub success: bool,
    pub message: String,
}

#[derive(Debug, Serialize)]
pub struct DeviceListResponse {
    pub success: bool,
    pub devices: Vec<Device>,
}

#[derive(Debug, Serialize)]
pub struct Device {
    pub id: String,
    pub device_id: String,
    pub model: String,
    pub os: String,
    pub app_version: String,
    pub manufacturer: Option<String>,
    pub device_name: Option<String>,
    pub last_used_at: Option<String>,
    pub created_at: String,
    pub is_active: bool,
}

// Store 2FA codes temporarily (in production, use Redis)
use std::collections::HashMap;
use std::sync::Mutex;
use once_cell::sync::Lazy;

static TWO_FACTOR_CODES: Lazy<Mutex<HashMap<String, (String, chrono::DateTime<Utc>)>>> = 
    Lazy::new(|| Mutex::new(HashMap::new()));

// Store verification requests temporarily
static VERIFICATION_REQUESTS: Lazy<Mutex<HashMap<String, (String, chrono::DateTime<Utc>)>>> = 
    Lazy::new(|| Mutex::new(HashMap::new()));

// Demo-specific endpoints for the demo flow
#[derive(Debug, Deserialize)]
pub struct ChallengeInitiateRequest {
    pub session_id: String,
}

#[derive(Debug, Deserialize)]
pub struct ChallengeVerifyRequest {
    pub session_id: String,
    pub code: String,
}

#[derive(Debug, Deserialize)]
pub struct DeviceBindRequest {
    pub username: String,
    pub fingerprint: String,
}

#[derive(Debug, Deserialize)]
pub struct ClientBootstrapRequest {
    pub session_id: String,
}

#[derive(Debug, Serialize)]
pub struct ChallengeInitiateResponse {
    pub success: bool,
    pub message: String,
    pub session_id: String,
}

#[derive(Debug, Serialize)]
pub struct ChallengeVerifyResponse {
    pub success: bool,
    pub data: Option<AuthData>,
    pub message: String,
}

#[derive(Debug, Serialize)]
pub struct AuthData {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_in: i64,
}

#[derive(Debug, Serialize)]
pub struct ClientBootstrapResponse {
    pub fwknop: FwknopConfig,
    pub stunnel: StunnelConfig,
    pub openvpn: OpenVpnConfig,
    pub browser: BrowserConfig,
}

#[derive(Debug, Serialize)]
pub struct FwknopConfig {
    pub remote_ip: String,
    pub key_rijndael: String,
    pub key_hmac: String,
}

#[derive(Debug, Serialize)]
pub struct StunnelConfig {
    pub server: String,
    pub port: u16,
    pub ca_pem: String,
    pub client_cert: String,
    pub client_key: String,
}

#[derive(Debug, Serialize)]
pub struct OpenVpnConfig {
    pub base_ovpn: String,
    pub auth: OpenVpnAuth,
}

#[derive(Debug, Serialize)]
pub struct OpenVpnAuth {
    pub r#type: String,
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct BrowserConfig {
    pub policy: String,
}

pub async fn login(
    pool: web::Data<PgPool>,
    login_data: web::Json<LoginRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let username = login_data.username.clone();
    let password = login_data.password.clone();

    // Check if user exists and password is correct
    let user = sqlx::query(
        r#"
        SELECT id, username, email, password_hash, role::text, is_active, last_login_at, 
               failed_login_attempts, locked_until, created_at, updated_at
        FROM users 
        WHERE username = $1 AND is_active = true
        "#
    )
    .bind(&username)
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    match user {
        Some(row) => {
            let user_id: Uuid = row.get("id");
            let password_hash: String = row.get("password_hash");
            let role: String = row.get("role");
            let locked_until: Option<chrono::DateTime<Utc>> = row.get("locked_until");

            // Verify password
            let password_valid = verify(&password, &password_hash)
                .map_err(|_| actix_web::error::ErrorInternalServerError("Password verification failed"))?;

            if !password_valid {
                // Increment failed login attempts
                sqlx::query(
                    r#"
                    UPDATE users 
                    SET failed_login_attempts = failed_login_attempts + 1,
                        updated_at = NOW()
                    WHERE id = $1
                    "#
                )
                .bind(user_id)
                .execute(pool.get_ref())
                .await
                .map_err(|e| {
                    eprintln!("Failed to update login attempts: {}", e);
                    actix_web::error::ErrorInternalServerError("Database error")
                })?;

                return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                    "success": false,
                    "message": "Invalid username or password"
                })));
            }

            // Check if account is locked
            if let Some(locked_until) = locked_until {
                if locked_until > Utc::now() {
                    return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                        "success": false,
                        "message": "Account is locked. Please try again later."
                    })));
                }
            }

            // Reset failed login attempts on successful login
            sqlx::query(
                r#"
                UPDATE users 
                SET failed_login_attempts = 0,
                    last_login_at = NOW(),
                    updated_at = NOW()
                WHERE id = $1
                "#
            )
            .bind(user_id)
            .execute(pool.get_ref())
            .await
            .map_err(|e| {
                eprintln!("Failed to update login info: {}", e);
                actix_web::error::ErrorInternalServerError("Database error")
            })?;

            // Generate JWT token
            let token = create_token(&user_id.to_string(), &role)
                .map_err(|e| {
                    eprintln!("Failed to create token: {}", e);
                    actix_web::error::ErrorInternalServerError("Token creation failed")
                })?;

            // Generate refresh token (for now, just a random string)
            let refresh_token = rand::thread_rng()
                .sample_iter(&rand::distributions::Alphanumeric)
                .take(32)
                .map(char::from)
                .collect::<String>();

            // Create user object
            let user = User {
                id: user_id.to_string(),
                username: row.get("username"),
                email: row.get("email"),
                role,
                is_active: row.get("is_active"),
                last_login_at: row.get::<Option<chrono::DateTime<Utc>>, _>("last_login_at")
                    .map(|dt| dt.to_rfc3339()),
                failed_login_attempts: row.get("failed_login_attempts"),
                locked_until: row.get::<Option<chrono::DateTime<Utc>>, _>("locked_until")
                    .map(|dt| dt.to_rfc3339()),
                created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
                updated_at: row.get::<chrono::DateTime<Utc>, _>("updated_at").to_rfc3339(),
            };

            Ok(HttpResponse::Ok().json(LoginResponse {
                token,
                refresh_token,
                user,
            }))
        }
        None => {
            Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                "success": false,
                "message": "Invalid username or password"
            })))
        }
    }
}

pub async fn request_2fa_code(
    pool: web::Data<PgPool>,
    request_data: web::Json<RequestTwoFactorCode>,
) -> Result<HttpResponse, actix_web::Error> {
    let username = request_data.username.clone();

    // Check if user exists
    let user = sqlx::query(
        r#"
        SELECT id, username, email, password_hash, role::text, is_active, last_login_at, 
               failed_login_attempts, locked_until, created_at, updated_at
        FROM users 
        WHERE username = $1 AND is_active = true
        "#
    )
    .bind(&username)
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    match user {
        Some(_row) => {
            // Generate 6-digit code
            let mut rng = rand::thread_rng();
            let code: String = (0..6)
                .map(|_| rng.gen_range(0..10).to_string())
                .collect();
            
            // Store code with expiration (5 minutes)
            let expires_at = Utc::now() + Duration::minutes(5);
            {
                let mut codes = TWO_FACTOR_CODES.lock().unwrap();
                codes.insert(username.clone(), (code.clone(), expires_at));
            }

            // In production, send code via email/SMS
            // For development, return the code
            Ok(HttpResponse::Ok().json(TwoFactorCodeResponse {
                success: true,
                message: "2FA code sent successfully".to_string(),
                code: Some(code), // Remove this in production
            }))
        }
        None => {
            Ok(HttpResponse::NotFound().json(serde_json::json!({
                "success": false,
                "message": "User not found"
            })))
        }
    }
}

pub async fn validate_2fa_code(
    pool: web::Data<PgPool>,
    request_data: web::Json<ValidateCodeRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let username = request_data.username.clone();
    let code = request_data.code.clone();

    // Check if user exists
    let user = sqlx::query(
        r#"
        SELECT id, username, email, password_hash, role::text, is_active, last_login_at, 
               failed_login_attempts, locked_until, created_at, updated_at
        FROM users 
        WHERE username = $1 AND is_active = true
        "#
    )
    .bind(&username)
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    match user {
        Some(row) => {
            let user_id: Uuid = row.get("id");
            let role: String = row.get("role");

            // Check if code is valid
            let code_valid = {
                let codes = TWO_FACTOR_CODES.lock().unwrap();
                if let Some((stored_code, expires_at)) = codes.get(&username) {
                    stored_code == &code && expires_at > &Utc::now()
                } else {
                    false
                }
            };

            if !code_valid {
                return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                    "success": false,
                    "message": "Invalid or expired 2FA code"
                })));
            }

            // Remove used code
            {
                let mut codes = TWO_FACTOR_CODES.lock().unwrap();
                codes.remove(&username);
            }

            // Generate session token
            let session_token = create_token(&user_id.to_string(), &role)
                .map_err(|_| actix_web::error::ErrorInternalServerError("Token generation failed"))?;

            // Store session in database
            let expires_at = Utc::now() + Duration::hours(24);
            sqlx::query(
                r#"
                INSERT INTO user_sessions (user_id, token_hash, expires_at, ip_address, user_agent)
                VALUES ($1, $2, $3, $4, $5)
                "#
            )
            .bind(user_id)
            .bind(&session_token)
            .bind(expires_at)
            .bind(None::<IpNetwork>) // IP address - will be NULL in database  
            .bind(None::<String>) // User agent - will be NULL in database
            .execute(pool.get_ref())
            .await
            .map_err(|e| {
                eprintln!("Failed to store session: {}", e);
                actix_web::error::ErrorInternalServerError("Database error")
            })?;

            Ok(HttpResponse::Ok().json(TwoFactorResponse {
                success: true,
                message: "2FA validation successful".to_string(),
                session_token: Some(session_token),
                user_id: Some(user_id),
            }))
        }
        None => {
            Ok(HttpResponse::NotFound().json(serde_json::json!({
                "success": false,
                "message": "User not found"
            })))
        }
    }
}

pub async fn get_connection_configs(
    pool: web::Data<PgPool>,
    request_data: web::Json<GetConfigsRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let username = request_data.username.clone();
    let session_token = request_data.session_token.clone();

    // Validate session
    let session = sqlx::query(
        r#"
        SELECT s.id, s.user_id, s.token_hash, s.expires_at, s.created_at
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE u.username = $1 AND s.token_hash = $2 AND s.expires_at > NOW() AND s.is_revoked = false
        "#
    )
    .bind(&username)
    .bind(&session_token)
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    match session {
        Some(_session) => {
            // For now, return placeholder configs
            // In production, generate actual configuration files
            Ok(HttpResponse::Ok().json(ConfigsResponse {
                success: true,
                message: "Configuration retrieved successfully".to_string(),
                stunnel_config: Some("placeholder_stunnel_config".to_string()),
                openvpn_config: Some("placeholder_openvpn_config".to_string()),
                spa_config: Some("placeholder_spa_config".to_string()),
                server_ip: Some("192.168.1.100".to_string()),
                server_port: Some(1194),
            }))
        }
        None => {
            Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                "success": false,
                "message": "Invalid session"
            })))
        }
    }
}

pub async fn logout(
    pool: web::Data<PgPool>,
    request: HttpRequest,
) -> Result<HttpResponse, actix_web::Error> {
    // Extract token from Authorization header
    let auth_header = request.headers().get("Authorization");
    let token = if let Some(header) = auth_header {
        if let Ok(header_str) = header.to_str() {
            if header_str.starts_with("Bearer ") {
                Some(header_str[7..].to_string())
            } else {
                None
            }
        } else {
            None
        }
    } else {
        None
    };

    if let Some(token) = token {
        // Revoke session
        sqlx::query(
            r#"
            UPDATE user_sessions 
            SET is_revoked = true
            WHERE token_hash = $1
            "#
        )
        .bind(&token)
        .execute(pool.get_ref())
        .await
        .map_err(|e| {
            eprintln!("Failed to revoke session: {}", e);
            actix_web::error::ErrorInternalServerError("Database error")
        })?;
    }

    Ok(HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Logged out successfully"
    })))
}

// Device Management Endpoints
pub async fn register_device(
    pool: web::Data<PgPool>,
    request_data: web::Json<DeviceRegistrationRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let user_id = Uuid::parse_str(&request_data.user_id)
        .map_err(|_| actix_web::error::ErrorBadRequest("Invalid user ID"))?;
    
    let device_id = request_data.device_id.clone();
    let fcm_token = request_data.fcm_token.clone();
    let device_info = &request_data.device_info;

    // Check if device already exists
    let existing_device = sqlx::query(
        r#"
        SELECT id FROM user_devices 
        WHERE user_id = $1 AND device_id = $2
        "#
    )
    .bind(user_id)
    .bind(&device_id)
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    if existing_device.is_some() {
        return Ok(HttpResponse::Ok().json(DeviceRegistrationResponse {
            success: true,
            message: "Device already registered".to_string(),
            device_registered: true,
            device_id: Some(device_id),
        }));
    }

    // Register new device
    let device_uuid = Uuid::new_v4();
    sqlx::query(
        r#"
        INSERT INTO user_devices (
            id, user_id, device_id, fcm_token, device_model, device_os, 
            app_version, manufacturer, device_name, last_used_at, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        "#
    )
    .bind(device_uuid)
    .bind(user_id)
    .bind(&device_id)
    .bind(&fcm_token)
    .bind(&device_info.model)
    .bind(&device_info.os)
    .bind(&device_info.app_version)
    .bind(&device_info.manufacturer)
    .bind(&device_info.device_name)
    .bind(Utc::now())
    .bind(Utc::now())
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Failed to register device: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    Ok(HttpResponse::Ok().json(DeviceRegistrationResponse {
        success: true,
        message: "Device registered successfully".to_string(),
        device_registered: true,
        device_id: Some(device_id),
    }))
}

pub async fn request_verification_code(
    pool: web::Data<PgPool>,
    request_data: web::Json<DeviceVerificationRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let request_id = request_data.request_id.clone();
    let device_id = request_data.device_id.clone();

    // Verify device exists and is active
    let device = sqlx::query(
        r#"
        SELECT ud.id, ud.user_id, ud.device_id, ud.fcm_token, ud.device_model
        FROM user_devices ud
        WHERE ud.device_id = $1 AND ud.is_active = true
        "#
    )
    .bind(&device_id)
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    if device.is_none() {
        return Ok(HttpResponse::NotFound().json(serde_json::json!({
            "success": false,
            "message": "Device not found or inactive"
        })));
    }

    // Generate 6-digit verification code
    let mut rng = rand::thread_rng();
    let code: String = (0..6)
        .map(|_| rng.gen_range(0..10).to_string())
        .collect();
    
    let expires_at = Utc::now() + Duration::minutes(5);
    
    // Store verification request
    {
        let mut requests = VERIFICATION_REQUESTS.lock().unwrap();
        requests.insert(request_id.clone(), (code.clone(), expires_at));
    }

    // Store verification request in database
    let verification_uuid = Uuid::new_v4();
    sqlx::query(
        r#"
        INSERT INTO verification_requests (
            id, user_id, device_id, code, expires_at, ip_address, 
            location_lat, location_lng, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        "#
    )
    .bind(verification_uuid)
    .bind(device.as_ref().unwrap().get::<Uuid, _>("user_id"))
    .bind(&device_id)
    .bind(&code)
    .bind(expires_at)
    .bind(request_data.network_info.as_ref().map(|n| n.ip.clone()))
    .bind(request_data.location.as_ref().map(|l| l.latitude))
    .bind(request_data.location.as_ref().map(|l| l.longitude))
    .bind(Utc::now())
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Failed to store verification request: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    Ok(HttpResponse::Ok().json(DeviceVerificationResponse {
        success: true,
        code: Some(code), // In production, send via push notification
        expires_at: Some(expires_at.timestamp()),
        message: "Verification code generated successfully".to_string(),
    }))
}

pub async fn confirm_verification(
    pool: web::Data<PgPool>,
    request_data: web::Json<ConfirmVerificationRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let request_id = request_data.request_id.clone();
    let device_id = request_data.device_id.clone();
    let approved = request_data.approved;

    // Update verification request in database
    sqlx::query(
        r#"
        UPDATE verification_requests 
        SET approved = $1, completed = true, updated_at = $2
        WHERE id = $3
        "#
    )
    .bind(approved)
    .bind(Utc::now())
    .bind(Uuid::parse_str(&request_id).unwrap_or_default())
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Failed to update verification request: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    // Remove from memory storage
    {
        let mut requests = VERIFICATION_REQUESTS.lock().unwrap();
        requests.remove(&request_id);
    }

    Ok(HttpResponse::Ok().json(ConfirmVerificationResponse {
        success: true,
        message: if approved { 
            "Verification approved".to_string() 
        } else { 
            "Verification denied".to_string() 
        },
    }))
}

pub async fn list_user_devices(
    pool: web::Data<PgPool>,
    request: HttpRequest,
) -> Result<HttpResponse, actix_web::Error> {
    // Extract user ID from token (simplified for demo)
    let user_id = if let Some(auth_header) = request.headers().get("Authorization") {
        if let Ok(header_str) = auth_header.to_str() {
            if header_str.starts_with("Bearer ") {
                // In production, validate JWT and extract user_id
                // For demo, we'll use a default user
                Uuid::new_v4() // This should be extracted from JWT
            } else {
                return Err(actix_web::error::ErrorUnauthorized("Invalid authorization header"));
            }
        } else {
            return Err(actix_web::error::ErrorUnauthorized("Invalid authorization header"));
        }
    } else {
        return Err(actix_web::error::ErrorUnauthorized("Missing authorization header"));
    };

    // Fetch user devices
    let devices = sqlx::query(
        r#"
        SELECT id, device_id, device_model, device_os, app_version, 
               manufacturer, device_name, last_used_at, created_at, is_active
        FROM user_devices 
        WHERE user_id = $1
        ORDER BY created_at DESC
        "#
    )
    .bind(user_id)
    .fetch_all(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    let device_list: Vec<Device> = devices
        .into_iter()
        .map(|row| Device {
            id: row.get::<Uuid, _>("id").to_string(),
            device_id: row.get::<String, _>("device_id"),
            model: row.get::<String, _>("device_model"),
            os: row.get::<String, _>("device_os"),
            app_version: row.get::<String, _>("app_version"),
            manufacturer: row.get::<Option<String>, _>("manufacturer"),
            device_name: row.get::<Option<String>, _>("device_name"),
            last_used_at: row.get::<Option<chrono::DateTime<Utc>>, _>("last_used_at")
                .map(|dt| dt.to_rfc3339()),
            created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
            is_active: row.get::<bool, _>("is_active"),
        })
        .collect();

    Ok(HttpResponse::Ok().json(DeviceListResponse {
        success: true,
        devices: device_list,
    }))
}

// Demo-specific handlers
pub async fn challenge_initiate(
    pool: web::Data<PgPool>,
    req: web::Json<ChallengeInitiateRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let session_id = req.session_id.clone();
    
    // Generate a 6-digit OTP code
    let mut rng = rand::thread_rng();
    let code = format!("{:06}", rng.gen_range(100000..999999));
    
    // Store the code with 120-second TTL
    let expires_at = Utc::now() + Duration::seconds(120);
    
    {
        let mut codes = TWO_FACTOR_CODES.lock().unwrap();
        codes.insert(session_id.clone(), (code.clone(), expires_at));
    }
    
    // In a real implementation, this would be sent via push notification
    // For demo purposes, we'll return it in the response
    Ok(HttpResponse::Ok().json(ChallengeInitiateResponse {
        success: true,
        message: "OTP code generated successfully".to_string(),
        session_id: session_id.clone(),
    }))
}

pub async fn challenge_code(
    req: HttpRequest,
) -> Result<HttpResponse, actix_web::Error> {
    let session_id = req.match_info().get("session_id").unwrap_or("");
    
    let codes = TWO_FACTOR_CODES.lock().unwrap();
    if let Some((code, expires_at)) = codes.get(session_id) {
        if Utc::now() < *expires_at {
            Ok(HttpResponse::Ok().json(serde_json::json!({
                "code": code,
                "ttl": 120
            })))
        } else {
            Ok(HttpResponse::BadRequest().json(serde_json::json!({
                "error": "Code expired"
            })))
        }
    } else {
        Ok(HttpResponse::NotFound().json(serde_json::json!({
            "error": "Session not found"
        })))
    }
}

pub async fn challenge_verify(
    pool: web::Data<PgPool>,
    req: web::Json<ChallengeVerifyRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let session_id = req.session_id.clone();
    let code = req.code.clone();
    
    let codes = TWO_FACTOR_CODES.lock().unwrap();
    if let Some((stored_code, expires_at)) = codes.get(&session_id) {
        if Utc::now() < *expires_at && stored_code == &code {
            // Generate JWT tokens - using demo tokens for now
            let access_token = "demo_access_token_".to_string() + &session_id;
            let refresh_token = "demo_refresh_token_".to_string() + &session_id;
            
            Ok(HttpResponse::Ok().json(ChallengeVerifyResponse {
                success: true,
                data: Some(AuthData {
                    access_token,
                    refresh_token,
                    expires_in: 900,
                }),
                message: "2FA verification successful".to_string(),
            }))
        } else {
            Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Invalid or expired code"
            })))
        }
    } else {
        Ok(HttpResponse::NotFound().json(serde_json::json!({
            "error": "Session not found"
        })))
    }
}

pub async fn device_bind_request(
    pool: web::Data<PgPool>,
    req: web::Json<DeviceBindRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let username = req.username.clone();
    let fingerprint = req.fingerprint.clone();
    
    // For demo purposes, auto-approve device binding
    // In production, this would create a pending request for admin approval
    
    // Store device binding in database
    let result = sqlx::query!(
        r#"
        INSERT INTO device_bindings (user_id, device_fingerprint, is_approved, created_at)
        SELECT id, $1, true, NOW()
        FROM users WHERE username = $2
        ON CONFLICT (user_id, device_fingerprint) DO UPDATE SET
        is_approved = true, updated_at = NOW()
        "#,
        fingerprint,
        username
    )
    .execute(pool.get_ref())
    .await;
    
    match result {
        Ok(_) => Ok(HttpResponse::Ok().json(serde_json::json!({
            "success": true,
            "message": "Device binding request submitted",
            "auto_approved": true
        }))),
        Err(_) => Ok(HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Failed to process device binding request"
        })))
    }
}

pub async fn client_bootstrap(
    _pool: web::Data<PgPool>,
    _req: web::Json<ClientBootstrapRequest>,
    http_req: HttpRequest,
) -> Result<HttpResponse, actix_web::Error> {
    // Extract token from Authorization header
    let auth_header = http_req.headers().get("Authorization");
    let _token = if let Some(header) = auth_header {
        if let Ok(header_str) = header.to_str() {
            if header_str.starts_with("Bearer ") {
                &header_str[7..]
            } else {
                return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                    "error": "Invalid authorization header"
                })));
            }
        } else {
            return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Invalid authorization header"
            })));
        }
    } else {
        return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Missing authorization header"
        })));
    };
    
    // For demo purposes, return mock configuration
    // In production, this would fetch from database based on user/session
    let response = ClientBootstrapResponse {
        fwknop: FwknopConfig {
            remote_ip: "185.231.180.118".to_string(),
            key_rijndael: "demo_rijndael_key_32_chars_long".to_string(),
            key_hmac: "demo_hmac_key_32_chars_long".to_string(),
        },
        stunnel: StunnelConfig {
            server: "gw.example.com".to_string(),
            port: 8443,
            ca_pem: "-----BEGIN CERTIFICATE-----\nDEMO_CA_CERT_CONTENT\n-----END CERTIFICATE-----".to_string(),
            client_cert: "-----BEGIN CERTIFICATE-----\nDEMO_CLIENT_CERT\n-----END CERTIFICATE-----".to_string(),
            client_key: "-----BEGIN PRIVATE KEY-----\nDEMO_CLIENT_KEY\n-----END PRIVATE KEY-----".to_string(),
        },
        openvpn: OpenVpnConfig {
            base_ovpn: "client\ndev tun\nproto tcp\nremote 127.0.0.1 9443\nresolv-retry infinite\nnobind\npersist-key\npersist-tun\nremote-cert-tls server\ncipher AES-256-GCM\nauth SHA256\nkey-direction 1\nverb 3".to_string(),
            auth: OpenVpnAuth {
                r#type: "user-pass".to_string(),
                username: "demo_user".to_string(),
                password: "demo_password".to_string(),
            },
        },
        browser: BrowserConfig {
            policy: "per-session".to_string(),
        },
    };
    
    Ok(HttpResponse::Ok().json(response))
}

pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/auth")
            .route("/login", web::post().to(login))
            .route("/logout", web::post().to(logout))
            .route("/request-2fa", web::post().to(request_2fa_code))
            .route("/validate-2fa", web::post().to(validate_2fa_code))
            .route("/connection-configs", web::get().to(get_connection_configs))
            .route("/register-device", web::post().to(register_device))
            .route("/verification-code", web::post().to(request_verification_code))
            .route("/confirm-verification", web::post().to(confirm_verification))
            .route("/devices", web::get().to(list_user_devices))
            .route("/challenge-initiate", web::post().to(challenge_initiate))
            .route("/challenge-code/{session_id}", web::get().to(challenge_code))
            .route("/challenge-verify", web::post().to(challenge_verify))
            .route("/device-bind", web::post().to(device_bind_request))
            .route("/client-bootstrap", web::post().to(client_bootstrap))
    );
}
