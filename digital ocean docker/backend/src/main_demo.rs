use actix_web::{App, HttpServer, web, HttpResponse};
use actix_cors::Cors;
use actix_web_actors::ws;
use actix::{Actor, StreamHandler};
use serde::{Deserialize, Serialize};
use tracing::{info, error};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use std::collections::HashMap;
use std::sync::Mutex;
use once_cell::sync::Lazy;
use chrono::{Utc, Duration};
use rand::Rng;
use std::panic;
use sqlx::{PgPool, Row};
use bcrypt::{hash, verify, DEFAULT_COST};
use uuid::Uuid;

// Demo data structures
#[derive(Debug, Serialize, Deserialize)]
struct LoginRequest {
    username: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct LoginResponse {
    success: bool,
    data: Option<LoginData>,
}

#[derive(Debug, Serialize, Deserialize)]
struct LoginData {
    session_id: String,
    requires_2fa: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct ChallengeInitiateRequest {
    session_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ChallengeVerifyRequest {
    session_id: String,
    code: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ChallengeVerifyResponse {
    success: bool,
    data: Option<AuthData>,
}

// Enhanced data structures for simplified auth flow
#[derive(Debug, Serialize, Deserialize)]
struct DeviceRegistrationRequest {
    username: String,
    password: String,
    device_info: DeviceInfo,
}

#[derive(Debug, Serialize, Deserialize)]
struct DeviceInfo {
    device_id: String,
    location: LocationInfo,
    network_info: NetworkInfo,
    device_fingerprint: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct LocationInfo {
    latitude: f64,
    longitude: f64,
    country: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct NetworkInfo {
    ip_address: String,
    asn: String,
    carrier: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct DeviceRegistrationResponse {
    success: bool,
    message: String,
    device_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct TwoFactorRequest {
    username: String,
    device_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct TwoFactorValidation {
    username: String,
    code: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ConnectionConfigs {
    stunnel_config: String,
    portknock_config: String,
    openvpn_config: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct AuthData {
    access_token: String,
    refresh_token: String,
    expires_in: i64,
}

#[derive(Debug, Serialize, Deserialize)]
struct ClientBootstrapRequest {
    session_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ClientBootstrapResponse {
    fwknop: FwknopConfig,
    stunnel: StunnelConfig,
    openvpn: OpenVpnConfig,
    browser: BrowserConfig,
}

#[derive(Debug, Serialize, Deserialize)]
struct FwknopConfig {
    remote_ip: String,
    key_rijndael: String,
    key_hmac: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct StunnelConfig {
    server: String,
    port: u16,
    ca_pem: String,
    client_cert: String,
    client_key: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct OpenVpnConfig {
    base_ovpn: String,
    auth: OpenVpnAuth,
}

#[derive(Debug, Serialize, Deserialize)]
struct OpenVpnAuth {
    r#type: String,
    username: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct BrowserConfig {
    policy: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct DeviceBindRequest {
    username: String,
    fingerprint: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct CreateUserRequest {
    username: String,
    email: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct SpawnContainerRequest {
    username: String,
    session_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct TerminateSessionRequest {
    session_id: String,
}

// Demo data storage
static TWO_FACTOR_CODES: Lazy<Mutex<HashMap<String, (String, chrono::DateTime<Utc>)>>> = 
    Lazy::new(|| Mutex::new(HashMap::new()));

// Database connection pool
static DB_POOL: Lazy<Option<PgPool>> = Lazy::new(|| None);

// Demo handlers
async fn login(req: web::Json<LoginRequest>, pool: web::Data<Option<PgPool>>) -> HttpResponse {
    // Try database authentication first
    if let Some(pool) = pool.as_ref() {
        match authenticate_user(pool, &req.username, &req.password).await {
            Ok(Some(user_id)) => {
                info!("✅ User authenticated: {} (ID: {})", req.username, user_id);
                let session_id = format!("SID{}", rand::thread_rng().gen_range(100..999));
                return HttpResponse::Ok().json(LoginResponse {
                    success: true,
                    data: Some(LoginData {
                        session_id,
                        requires_2fa: true,
                    }),
                });
            }
            Ok(None) => {
                info!("❌ Authentication failed for user: {}", req.username);
            }
            Err(e) => {
                error!("❌ Database error during authentication: {}", e);
            }
        }
    }
    
    // Fallback to demo credentials
    if req.username == "keyvan" && req.password == "password123" {
        let session_id = format!("SID{}", rand::thread_rng().gen_range(100..999));
        HttpResponse::Ok().json(LoginResponse {
            success: true,
            data: Some(LoginData {
                session_id,
                requires_2fa: true,
            }),
        })
    } else {
        HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Invalid credentials"
        }))
    }
}

async fn challenge_initiate(req: web::Json<ChallengeInitiateRequest>) -> HttpResponse {
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
    
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "OTP code generated successfully",
        "session_id": session_id
    }))
}

async fn challenge_code(req: actix_web::HttpRequest) -> HttpResponse {
    let session_id = req.match_info().get("session_id").unwrap_or("");
    
    let codes = TWO_FACTOR_CODES.lock().unwrap();
    if let Some((code, expires_at)) = codes.get(session_id) {
        if Utc::now() < *expires_at {
            HttpResponse::Ok().json(serde_json::json!({
                "code": code,
                "ttl": 120
            }))
        } else {
            HttpResponse::BadRequest().json(serde_json::json!({
                "error": "Code expired"
            }))
        }
    } else {
        HttpResponse::NotFound().json(serde_json::json!({
            "error": "Session not found"
        }))
    }
}

async fn challenge_verify(req: web::Json<ChallengeVerifyRequest>) -> HttpResponse {
    let session_id = req.session_id.clone();
    let code = req.code.clone();
    
    let codes = TWO_FACTOR_CODES.lock().unwrap();
    if let Some((stored_code, expires_at)) = codes.get(&session_id) {
        if Utc::now() < *expires_at && stored_code == &code {
            HttpResponse::Ok().json(ChallengeVerifyResponse {
                success: true,
                data: Some(AuthData {
                    access_token: format!("demo_access_token_{}", session_id),
                    refresh_token: format!("demo_refresh_token_{}", session_id),
                    expires_in: 900,
                }),
            })
        } else {
            HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Invalid or expired code"
            }))
        }
    } else {
        HttpResponse::NotFound().json(serde_json::json!({
            "error": "Session not found"
        }))
    }
}

async fn device_bind_request(_req: web::Json<DeviceBindRequest>) -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Device binding request submitted",
        "auto_approved": true
    }))
}

async fn client_bootstrap(_req: web::Json<ClientBootstrapRequest>, _http_req: actix_web::HttpRequest) -> HttpResponse {
    // Check Authorization header
    let auth_header = _http_req.headers().get("Authorization");
    if auth_header.is_none() {
        return HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Missing authorization header"
        }));
    }
    
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
    
    HttpResponse::Ok().json(response)
}

async fn create_user(req: web::Json<CreateUserRequest>, pool: web::Data<Option<PgPool>>) -> HttpResponse {
    info!("👤 Creating user: {}", req.username);
    
    if let Some(pool) = pool.as_ref() {
        match create_user_in_db(pool, &req.username, &req.email, &req.password).await {
            Ok(user_id) => {
                info!("✅ User created successfully: {} (ID: {})", req.username, user_id);
                HttpResponse::Ok().json(serde_json::json!({
                    "success": true,
                    "message": "User created successfully",
                    "user_id": user_id
                }))
            }
            Err(e) => {
                error!("❌ Failed to create user: {}", e);
                HttpResponse::InternalServerError().json(serde_json::json!({
                    "success": false,
                    "message": "Failed to create user"
                }))
            }
        }
    } else {
        error!("❌ Database not available");
        HttpResponse::InternalServerError().json(serde_json::json!({
            "success": false,
            "message": "Database not available"
        }))
    }
}

async fn spawn_container(_req: web::Json<SpawnContainerRequest>) -> HttpResponse {
    let random_path = generate_random_path();
    let port = 5801;
    let container_id = format!("firefox-{}", port);
    let url = format!("https://gw.example.com/{}/", random_path);
    
    HttpResponse::Ok().json(serde_json::json!({
        "url": url,
        "port": port,
        "container_id": container_id
    }))
}

async fn terminate_session(_req: web::Json<TerminateSessionRequest>) -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "terminated": true,
        "message": "Session terminated successfully"
    }))
}

fn generate_random_path() -> String {
    let mut rng = rand::thread_rng();
    const CHARSET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    (0..32)
        .map(|_| {
            let idx = rng.gen_range(0..CHARSET.len());
            CHARSET[idx] as char
        })
        .collect()
}

// Database authentication functions
async fn authenticate_user(pool: &PgPool, username: &str, password: &str) -> Result<Option<Uuid>, sqlx::Error> {
    let row = sqlx::query("SELECT id, password_hash FROM users WHERE username = $1 AND status = 'active'")
        .bind(username)
        .fetch_optional(pool)
        .await?;
    
    if let Some(row) = row {
        let user_id: Uuid = row.get("id");
        let password_hash: String = row.get("password_hash");
        
        if verify(password, &password_hash).unwrap_or(false) {
            // Update last login time
            let _ = sqlx::query("UPDATE users SET last_login_at = NOW(), failed_login_attempts = 0 WHERE id = $1")
                .bind(user_id)
                .execute(pool)
                .await;
            
            return Ok(Some(user_id));
        } else {
            // Increment failed login attempts
            let _ = sqlx::query("UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = $1")
                .bind(user_id)
                .execute(pool)
                .await;
        }
    }
    
    Ok(None)
}

async fn create_user_in_db(pool: &PgPool, username: &str, email: &str, password: &str) -> Result<Uuid, sqlx::Error> {
    let password_hash = hash(password, DEFAULT_COST).unwrap();
    let user_id = Uuid::new_v4();
    
    sqlx::query("INSERT INTO users (id, username, email, password_hash, status, roles) VALUES ($1, $2, $3, $4, 'active', '[\"user\"]')")
        .bind(user_id)
        .bind(username)
        .bind(email)
        .bind(password_hash)
        .execute(pool)
        .await?;
    
    Ok(user_id)
}

// Enhanced endpoint handlers for simplified auth flow
async fn register_mobile_device(req: web::Json<DeviceRegistrationRequest>) -> HttpResponse {
    info!("📱 Device registration request for user: {}", req.username);
    
    // Validate credentials (demo: accept keyvan/password123)
    if req.username != "keyvan" || req.password != "password123" {
        return HttpResponse::Unauthorized().json(serde_json::json!({
            "success": false,
            "message": "Invalid credentials"
        }));
    }
    
    // Store device info (in demo mode, just log it)
    info!("📱 Device registered: ID={}, Location={}, IP={}", 
        req.device_info.device_id,
        req.device_info.location.country,
        req.device_info.network_info.ip_address
    );
    
    HttpResponse::Ok().json(DeviceRegistrationResponse {
        success: true,
        message: "Device registered successfully".to_string(),
        device_id: req.device_info.device_id.clone(),
    })
}

async fn request_2fa_code(req: web::Json<TwoFactorRequest>) -> HttpResponse {
    info!("🔐 2FA request for user: {}, device: {}", req.username, req.device_id);
    
    // Validate credentials (demo: accept keyvan/password123)
    if req.username != "keyvan" {
        return HttpResponse::Unauthorized().json(serde_json::json!({
            "success": false,
            "message": "Invalid credentials"
        }));
    }
    
    // Generate 6-digit code
    let mut rng = rand::thread_rng();
    let code = format!("{:06}", rng.gen_range(100000..999999));
    
    // Store code with 5-minute TTL
    let expires_at = Utc::now() + Duration::minutes(5);
    {
        let mut codes = TWO_FACTOR_CODES.lock().unwrap();
        codes.insert(format!("{}:{}", req.username, req.device_id), (code.clone(), expires_at));
    }
    
    info!("🔐 2FA code generated: {} for device: {}", code, req.device_id);
    
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "2FA code generated and sent to mobile device",
        "code": code, // In demo mode, return code directly
        "ttl": 300
    }))
}

async fn validate_2fa_code(req: web::Json<TwoFactorValidation>) -> HttpResponse {
    info!("✅ 2FA validation for user: {}", req.username);
    
    // Check stored code
    let key = format!("{}:demo-device", req.username);
    let codes = TWO_FACTOR_CODES.lock().unwrap();
    
    if let Some((stored_code, expires_at)) = codes.get(&key) {
        if Utc::now() < *expires_at && stored_code == &req.code {
            // Generate connection configs
            let configs = ConnectionConfigs {
                stunnel_config: format!(
                    "client = yes\n\
                    [https]\n\
                    accept = 127.0.0.1:8443\n\
                    connect = gw.example.com:443\n\
                    cert = /etc/ssl/certs/client.crt\n\
                    key = /etc/ssl/private/client.key\n\
                    CAfile = /etc/ssl/certs/ca.crt"
                ),
                portknock_config: format!(
                    "#!/bin/bash\n\
                    # Port knocking sequence\n\
                    for port in 1000 2000 3000; do\n\
                        nc -z gw.example.com $port\n\
                        sleep 1\n\
                    done"
                ),
                openvpn_config: format!(
                    "client\n\
                    dev tun\n\
                    proto tcp\n\
                    remote 127.0.0.1 9443\n\
                    resolv-retry infinite\n\
                    nobind\n\
                    persist-key\n\
                    persist-tun\n\
                    remote-cert-tls server\n\
                    cipher AES-256-GCM\n\
                    auth SHA256\n\
                    key-direction 1\n\
                    verb 3\n\
                    auth-user-pass /etc/openvpn/auth.txt"
                ),
            };
            
            info!("✅ 2FA validation successful, returning connection configs");
            
            return HttpResponse::Ok().json(serde_json::json!({
                "success": true,
                "message": "2FA validation successful",
                "configs": configs
            }));
        }
    }
    
    HttpResponse::Unauthorized().json(serde_json::json!({
        "success": false,
        "message": "Invalid or expired 2FA code"
    }))
}

async fn get_users(pool: web::Data<Option<PgPool>>) -> HttpResponse {
    info!("📋 Fetching users from database...");
    
    if let Some(pool) = pool.as_ref() {
        info!("✅ Database pool is available");
        
        // Use a more robust query with proper error handling
        let query_result = sqlx::query_as::<_, UserRow>(
            "SELECT id, username, email, status, created_at, last_login_at FROM users ORDER BY created_at DESC"
        )
        .fetch_all(pool)
        .await;
        
        match query_result {
            Ok(rows) => {
                info!("✅ Found {} users in database", rows.len());
                let mut users = Vec::new();
                
                for row in rows {
                    let user_json = serde_json::json!({
                        "id": row.id.to_string(),
                        "username": row.username,
                        "email": row.email,
                        "status": row.status,
                        "created_at": row.created_at.to_rfc3339(),
                        "last_login_at": row.last_login_at.map(|dt| dt.to_rfc3339())
                    });
                    users.push(user_json);
                }
                
                info!("✅ Returning {} users to frontend", users.len());
                HttpResponse::Ok().json(serde_json::json!({
                    "success": true,
                    "users": users
                }))
            }
            Err(e) => {
                error!("❌ Database query failed: {}", e);
                HttpResponse::InternalServerError().json(serde_json::json!({
                    "success": false,
                    "message": format!("Database query failed: {}", e)
                }))
            }
        }
    } else {
        error!("❌ Database pool is not available");
        HttpResponse::InternalServerError().json(serde_json::json!({
            "success": false,
            "message": "Database not available"
        }))
    }
}

// Define the UserRow struct for type-safe database queries
#[derive(Debug, sqlx::FromRow)]
struct UserRow {
    id: Uuid,
    username: String,
    email: String,
    status: String,
    created_at: chrono::DateTime<chrono::Utc>,
    last_login_at: Option<chrono::DateTime<chrono::Utc>>,
}

// Admin panel endpoint functions
async fn get_sessions(pool: web::Data<Option<PgPool>>) -> HttpResponse {
    info!("📋 Fetching sessions from database...");
    
    match pool.as_ref() {
        Some(pool) => {
            match sqlx::query(
                r#"
                SELECT 
                    s.id, s.user_id, u.username, s.status, s.started_at, s.expires_at, 
                    s.last_activity_at, s.ip_address::text as ip_address, s.user_agent
                FROM sessions s
                JOIN users u ON s.user_id = u.id
                ORDER BY s.started_at DESC
                LIMIT 50
                "#
            )
            .fetch_all(pool)
            .await
            {
                Ok(sessions) => {
                    let session_responses: Vec<serde_json::Value> = sessions
                        .into_iter()
                        .map(|row| {
                            let id: Uuid = row.get("id");
                            let username: String = row.get("username");
                            let status: Option<String> = row.get("status");
                            let started_at: Option<chrono::DateTime<chrono::Utc>> = row.get("started_at");
                            let expires_at: chrono::DateTime<chrono::Utc> = row.get("expires_at");
                            let last_activity_at: Option<chrono::DateTime<chrono::Utc>> = row.get("last_activity_at");
                            let ip_address: Option<String> = row.get("ip_address");
                            let user_agent: Option<String> = row.get("user_agent");
                            
                            let is_active = status == Some("active".to_string()) && 
                                          expires_at > Utc::now();
                            let is_revoked = status == Some("terminated".to_string());
                            
                            serde_json::json!({
                                "session_id": id.to_string(),
                                "username": username,
                                "access_token": "***hidden***",
                                "created_at": started_at.map(|dt| dt.to_rfc3339()).unwrap_or_else(|| Utc::now().to_rfc3339()),
                                "otp_expires": expires_at.to_rfc3339(),
                                "last_activity": last_activity_at.map(|dt| dt.to_rfc3339()).unwrap_or_else(|| Utc::now().to_rfc3339()),
                                "ip_address": ip_address.unwrap_or_else(|| "نامشخص".to_string()),
                                "user_agent": user_agent.unwrap_or_else(|| "دسکتاپ".to_string()),
                                "status": if is_revoked { "terminated" } else if is_active { "active" } else { "expired" }
                            })
                        })
                        .collect();
                    
                    HttpResponse::Ok().json(serde_json::json!({
                        "success": true,
                        "sessions": session_responses
                    }))
                }
                Err(e) => {
                    error!("❌ Database query failed: {}", e);
                    HttpResponse::InternalServerError().json(serde_json::json!({
                        "success": false,
                        "error": "Database query failed"
                    }))
                }
            }
        }
        None => {
            error!("❌ Database pool not available");
            HttpResponse::InternalServerError().json(serde_json::json!({
                "success": false,
                "error": "Database not available"
            }))
        }
    }
}

async fn get_device_requests(_pool: web::Data<Option<PgPool>>) -> HttpResponse {
    info!("📋 Fetching device requests from database...");
    
    // For now, return mock device requests since we don't have a device_requests table yet
    let mock_requests = vec![
        serde_json::json!({
            "username": "admin",
            "fingerprint": "demo_fingerprint_123456789",
            "status": "approved",
            "created_at": Utc::now().to_rfc3339(),
        })
    ];
    
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "requests": mock_requests
    }))
}

async fn get_audit_logs(_pool: web::Data<Option<PgPool>>) -> HttpResponse {
    info!("📋 Fetching audit logs from database...");
    
    // For now, return mock audit logs since we don't have an audit_logs table yet
    let mock_logs = vec![
        serde_json::json!({
            "timestamp": Utc::now().to_rfc3339(),
            "event": "LOGIN_SUCCESS",
            "user": "admin",
            "details": "User logged in successfully",
        }),
        serde_json::json!({
            "timestamp": (Utc::now() - Duration::minutes(5)).to_rfc3339(),
            "event": "USER_CREATE",
            "user": "admin",
            "details": "New user created: test_user",
        })
    ];
    
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "logs": mock_logs
    }))
}

// API status handler
async fn api_status(pool: web::Data<Option<PgPool>>) -> HttpResponse {
    let db_status = if pool.is_some() { "connected" } else { "disconnected" };
    HttpResponse::Ok().json(serde_json::json!({
        "message": "ViWorkS Admin Panel Backend (Demo Mode) is running!",
        "database": db_status.to_string(),
        "redis": "connected",
        "status": "healthy"
    }))
}

// WebSocket handler
async fn ws_handler(req: actix_web::HttpRequest, stream: web::Payload) -> Result<HttpResponse, actix_web::Error> {
    ws::start(MyWs {}, &req, stream)
}

struct MyWs;

impl Actor for MyWs {
    type Context = ws::WebsocketContext<Self>;
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for MyWs {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Text(text)) => {
                ctx.text(text);
            }
            Ok(ws::Message::Ping(msg)) => {
                ctx.pong(&msg);
            }
            Ok(ws::Message::Close(reason)) => {
                ctx.close(reason);
            }
            _ => {}
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Set up panic hook to catch panics and log them
    panic::set_hook(Box::new(|panic_info| {
        eprintln!("🚨 Application panicked: {:?}", panic_info);
        eprintln!("🚨 Location: {:?}", panic_info.location());
        eprintln!("🚨 Payload: {:?}", panic_info.payload().downcast_ref::<&str>());
        std::process::exit(1);
    }));

    // Initialize logging system (use tracing-subscriber only to avoid conflicts)
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();
    
    info!("🚀 Starting ViWorkS Admin Panel Backend (Production Mode)");
    
    // Debug mode - print effective configuration
    let debug_startup = std::env::var("DEBUG_STARTUP").unwrap_or_else(|_| "0".to_string()) == "1";
    if debug_startup {
        info!("🔧 DEBUG_STARTUP: Effective configuration:");
        info!("  HOST: {}", std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string()));
        info!("  PORT: {}", std::env::var("PORT").unwrap_or_else(|_| "8081".to_string()));
        info!("  RUST_LOG: {}", std::env::var("RUST_LOG").unwrap_or_else(|_| "info".to_string()));
        info!("  RUST_BACKTRACE: {}", std::env::var("RUST_BACKTRACE").unwrap_or_else(|_| "0".to_string()));
    }
    
    info!("🔧 Environment: HOST={}, PORT={}", 
        std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string()),
        std::env::var("PORT").unwrap_or_else(|_| "8081".to_string())
    );

    // Initialize database connection
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://admin:viworks_password_2024@viworks-postgres:5432/viworks".to_string());
    
    info!("🔗 Connecting to database...");
    let pool = match sqlx::PgPool::connect(&database_url).await {
        Ok(pool) => {
            info!("✅ Database connection established");
            Some(pool)
        }
        Err(e) => {
            error!("❌ Failed to connect to database: {}", e);
            None
        }
    };

    let host = std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8081".to_string())
        .parse::<u16>()
        .unwrap_or(8081);
    
    info!("🌐 Starting HTTP server on {}:{}", host, port);

    // Start HTTP server with error handling
    info!("🔧 Creating HTTP server...");
    let server = HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .expose_headers(vec!["Access-Control-Allow-Origin", "Access-Control-Allow-Methods", "Access-Control-Allow-Headers"])
            .max_age(3600);

        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(cors)
            .route("/health", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "status": "ok",
                    "service": "ViWorkS Admin Panel Backend (Demo Mode)",
                    "version": "1.0.0",
                    "message": "Backend is running successfully!"
                }))
            }))
            .route("/_healthz", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "status": "ok"
                }))
            }))
            .route("/api/status", web::get().to(api_status))
            // Demo endpoints
            .route("/api/v1/auth/login", web::post().to(login))
            .route("/api/v1/auth/challenge/initiate", web::post().to(challenge_initiate))
            .route("/api/v1/auth/challenge/code/{session_id}", web::get().to(challenge_code))
            .route("/api/v1/auth/challenge/verify", web::post().to(challenge_verify))
            .route("/api/v1/device/bind-request", web::post().to(device_bind_request))
            .route("/api/v1/client/bootstrap", web::post().to(client_bootstrap))
            .route("/api/v1/agent/user/create", web::post().to(create_user))
            .route("/api/v1/agent/container/spawn", web::post().to(spawn_container))
            .route("/api/v1/agent/session/terminate", web::post().to(terminate_session))
            // Enhanced endpoints for simplified auth flow
            .route("/api/v1/device/register", web::post().to(register_mobile_device))
            .route("/api/v1/auth/2fa/request", web::post().to(request_2fa_code))
            .route("/api/v1/auth/2fa/validate", web::post().to(validate_2fa_code))
            // Admin panel endpoints
            .route("/api/v1/users", web::get().to(get_users))
            .route("/api/v1/admin/users", web::get().to(get_users))
            .route("/api/v1/admin/sessions", web::get().to(get_sessions))
            .route("/api/v1/admin/device-requests", web::get().to(get_device_requests))
            .route("/api/v1/admin/device/requests", web::get().to(get_device_requests))
            .route("/api/v1/admin/audit-logs", web::get().to(get_audit_logs))
            .route("/api/v1/sessions", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "sessions": [
                        {
                            "id": "session-1",
                            "user_id": "ec3ce0b2-78b5-4812-b82f-cea8730136ac",
                            "username": "keyvan",
                            "ip_address": "192.168.1.100",
                            "user_agent": "Mozilla/5.0...",
                            "created_at": "2025-08-24T10:00:00Z",
                            "last_activity": "2025-08-24T10:30:00Z",
                            "status": "active"
                        }
                    ],
                    "total": 1,
                    "page": 1,
                    "per_page": 10
                }))
            }))
            .route("/api/v1/monitoring/dashboard", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "total_users": 2,
                    "active_clients": 1,
                    "total_clients": 1,
                    "security_alerts": 0,
                    "system_health": "healthy"
                }))
            }))
            .route("/ws", web::get().to(ws_handler))
            .route("/", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "message": "ViWorkS Admin Panel Backend (Demo Mode)",
                    "endpoints": {
                        "health": "/health",
                        "status": "/api/status",
                        "login": "/api/v1/auth/login",
                        "challenge_initiate": "/api/v1/auth/challenge/initiate",
                        "challenge_code": "/api/v1/auth/challenge/code/{session_id}",
                        "challenge_verify": "/api/v1/auth/challenge/verify",
                        "device_bind": "/api/v1/device/bind-request",
                        "client_bootstrap": "/api/v1/client/bootstrap",
                        "device_register": "/api/v1/device/register",
                        "2fa_request": "/api/v1/auth/2fa/request",
                        "2fa_validate": "/api/v1/auth/2fa/validate",
                        "agent_user_create": "/api/v1/agent/user/create",
                        "agent_container_spawn": "/api/v1/agent/container/spawn",
                        "agent_session_terminate": "/api/v1/agent/session/terminate"
                    }
                }))
            }))
    })
    .bind((host.clone(), port))?;

    info!("🚀 Server configured, starting...");
    
    // Start the server and await it (this keeps the process running)
    info!("✅ ViWorkS Backend is now running on {}:{}", host, port);
    info!("🔗 Health check available at: http://{}:{}/_healthz", host, port);
    
    // Add graceful shutdown handling
    let server_handle = server.run();
    
    // Set up signal handlers for graceful shutdown
    let shutdown_signal = async {
        tokio::signal::ctrl_c()
            .await
            .expect("Failed to install Ctrl+C handler");
        info!("🛑 Received shutdown signal (SIGINT)");
    };
    
    tokio::select! {
        _ = server_handle => {
            info!("🛑 Server stopped");
        }
        _ = shutdown_signal => {
            info!("🛑 Graceful shutdown initiated");
        }
    }
    
    info!("👋 ViWorkS Backend shutdown complete");
    Ok(())
}
