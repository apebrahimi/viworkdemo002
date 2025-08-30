use actix_web::{web, App, HttpResponse, HttpServer, middleware};
use actix_cors::Cors;
use serde::{Deserialize, Serialize};
use std::env;
use std::collections::HashMap;
use std::sync::Mutex;
use chrono::{Utc, Duration};
use rand::Rng;
use uuid::Uuid;
use once_cell::sync::Lazy;

// Add panic hook for debugging
use std::panic;

// Set up panic hook to capture panics
fn setup_panic_hook() {
    panic::set_hook(Box::new(|panic_info| {
        eprintln!("🚨 PANIC: {}", panic_info);
        if let Some(location) = panic_info.location() {
            eprintln!("   Location: {}:{}:{}", location.file(), location.line(), location.column());
        }
        if let Some(s) = panic_info.payload().downcast_ref::<&str>() {
            eprintln!("   Message: {}", s);
        }
        if let Some(s) = panic_info.payload().downcast_ref::<String>() {
            eprintln!("   Message: {}", s);
        }
    }));
}

// Enhanced logging initialization
fn init_logging() {
    if env::var("RUST_LOG").is_err() {
        env::set_var("RUST_LOG", "info,sqlx=warn,actix_web=info");
    }
    let _ = env_logger::builder().is_test(false).try_init();
}

// Import our modules
mod database;
mod models;

use database::Database;
use models::*;

// Global state for demo data (fallback when database is not available)
static SESSIONS: Lazy<Mutex<HashMap<String, SessionData>>> = Lazy::new(|| Mutex::new(HashMap::new()));
static USERS: Lazy<Mutex<HashMap<String, UserData>>> = Lazy::new(|| Mutex::new(HashMap::new()));
static DEVICE_REQUESTS: Lazy<Mutex<HashMap<String, DeviceRequest>>> = Lazy::new(|| Mutex::new(HashMap::new()));
static USER_DEVICES: Lazy<Mutex<HashMap<String, UserDevice>>> = Lazy::new(|| Mutex::new(HashMap::new()));
static VERIFICATION_REQUESTS: Lazy<Mutex<HashMap<String, VerificationRequest>>> = Lazy::new(|| Mutex::new(HashMap::new()));

// Legacy data structures for backward compatibility
#[derive(Debug, Serialize, Deserialize)]
struct HealthResponse {
    status: String,
    timestamp: String,
    version: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct SessionData {
    session_id: String,
    username: String,
    created_at: String,
    otp_code: Option<String>,
    otp_expires: Option<String>,
    access_token: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct UserData {
    username: String,
    email: String,
    mobile: String,
    status: String,
    device_bound: bool,
    created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct DeviceRequest {
    username: String,
    fingerprint: String,
    status: String,
    created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct UserDevice {
    id: String,
    user_id: String,
    device_id: String,
    fcm_token: Option<String>,
    device_model: String,
    device_os: String,
    app_version: String,
    last_used_at: String,
    created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct VerificationRequest {
    id: String,
    user_id: String,
    device_id: String,
    code: String,
    expires_at: String,
    approved: Option<bool>,
    completed: bool,
    ip_address: Option<String>,
    location_lat: Option<f64>,
    location_lng: Option<f64>,
    created_at: String,
}

// Helper functions
fn generate_otp() -> String {
    let mut rng = rand::thread_rng();
    format!("{:06}", rng.gen_range(100000..999999))
}

fn generate_token() -> String {
    Uuid::new_v4().to_string()
}

fn log_event(event: &str, details: &str) {
    println!("[AUDIT] {} - {}", event, details);
}

// Initialize demo data
fn init_demo_data() {
    let mut users = USERS.lock().unwrap();
    users.insert("admin".to_string(), UserData {
        username: "admin".to_string(),
        email: "admin@viworks.com".to_string(),
        mobile: "09123456789".to_string(),
        status: "active".to_string(),
        device_bound: true,
        created_at: Utc::now().to_rfc3339(),
    });
    users.insert("keyvan".to_string(), UserData {
        username: "keyvan".to_string(),
        email: "keyvan@company.tld".to_string(),
        mobile: "09987654321".to_string(),
        status: "pending".to_string(),
        device_bound: false,
        created_at: Utc::now().to_rfc3339(),
    });
}

// API endpoints
async fn health() -> HttpResponse {
    println!("Health check endpoint called");
    HttpResponse::Ok().json(HealthResponse {
        status: "healthy".to_string(),
        timestamp: Utc::now().to_rfc3339(),
        version: "1.0.0".to_string(),
    })
}

async fn login(req: web::Json<LoginRequest>) -> HttpResponse {
    let username = req.username.clone();
    let password = req.password.clone();
    
    println!("Login attempt for user: {}", username);
    log_event("LOGIN_ATTEMPT", &format!("User: {}", username));
    
    // Demo authentication
    let valid_credentials = match username.as_str() {
        "admin" => password == "admin123",
        "keyvan" => password == "demo123",
        _ => false,
    };
    
    if valid_credentials {
        let session_id = format!("session_{}_{}", username, Uuid::new_v4().to_string().split('-').next().unwrap());
        
        let mut sessions = SESSIONS.lock().unwrap();
        sessions.insert(session_id.clone(), SessionData {
            session_id: session_id.clone(),
            username: username.clone(),
            created_at: Utc::now().to_rfc3339(),
            otp_code: None,
            otp_expires: None,
            access_token: None,
        });
        
        log_event("LOGIN_SUCCESS", &format!("User: {}, Session: {}", username, session_id));
        
        HttpResponse::Ok().json(LoginResponse {
            success: true,
            message: "Login successful".to_string(),
            data: Some(LoginData {
            session_id,
                requires_2fa: false,
            }),
        })
    } else {
        log_event("LOGIN_FAILED", &format!("User: {}", username));
        HttpResponse::Unauthorized().json(LoginResponse {
            success: false,
            message: "Invalid credentials".to_string(),
            data: None,
        })
    }
}

async fn challenge_initiate(req: web::Json<models::OtpVerifyRequest>) -> HttpResponse {
    let session_id = req.session_id.clone();
    
    println!("2FA challenge initiated for session: {}", session_id);
    log_event("2FA_INITIATED", &format!("Session: {}", session_id));
    
    let otp_code = generate_otp();
    let expires_at = Utc::now() + Duration::seconds(120);
    
    let mut sessions = SESSIONS.lock().unwrap();
    if let Some(session) = sessions.get_mut(&session_id) {
        session.otp_code = Some(otp_code.clone());
        session.otp_expires = Some(expires_at.to_rfc3339());
        
        HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "2FA challenge initiated",
            "session_id": session_id,
            "otp_code": otp_code, // In real app, this would be sent via SMS/push
            "expires_in": 120
        }))
    } else {
        HttpResponse::BadRequest().json(serde_json::json!({
            "success": false,
            "message": "Invalid session"
        }))
    }
}

async fn challenge_verify(req: web::Json<models::OtpVerifyRequest>) -> HttpResponse {
    let session_id = req.session_id.clone();
    let code = req.code.clone();
    
    println!("2FA verification attempt for session: {}", session_id);
    
    let mut sessions = SESSIONS.lock().unwrap();
    if let Some(session) = sessions.get_mut(&session_id) {
        if let Some(stored_otp) = &session.otp_code {
            if code == *stored_otp {
                let access_token = generate_token();
                let refresh_token = generate_token();
                
                session.access_token = Some(access_token.clone());
                session.otp_code = None; // Clear OTP after use
                
                log_event("2FA_VERIFIED", &format!("Session: {}", session_id));
                
                HttpResponse::Ok().json(models::OtpVerifyResponse {
                    success: true,
            message: "2FA verification successful".to_string(),
                    data: Some(models::AuthData {
                        access_token,
                        refresh_token,
                        expires_in: 900, // 15 minutes
                    }),
                })
            } else {
                log_event("2FA_FAILED", &format!("Session: {}, Invalid code", session_id));
                HttpResponse::Unauthorized().json(models::OtpVerifyResponse {
                    success: false,
                    message: "Invalid OTP code".to_string(),
                    data: None,
                })
            }
        } else {
            HttpResponse::BadRequest().json(models::OtpVerifyResponse {
                success: false,
                message: "No OTP challenge found".to_string(),
                data: None,
            })
        }
    } else {
        HttpResponse::BadRequest().json(models::OtpVerifyResponse {
            success: false,
            message: "Invalid session".to_string(),
            data: None,
        })
    }
}

async fn device_bind_request(req: web::Json<models::DeviceBindRequest>) -> HttpResponse {
    let username = req.username.clone();
    let fingerprint = req.fingerprint.clone();
    
    println!("Device bind request for user: {}", username);
    log_event("DEVICE_BIND_REQUEST", &format!("User: {}, Fingerprint: {}", username, fingerprint));
    
    let request_id = Uuid::new_v4().to_string();
    let mut requests = DEVICE_REQUESTS.lock().unwrap();
    requests.insert(request_id.clone(), DeviceRequest {
        username: username.clone(),
        fingerprint: fingerprint.clone(),
        status: "pending".to_string(),
        created_at: Utc::now().to_rfc3339(),
    });
    
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Device binding request submitted",
        "request_id": request_id
    }))
}

async fn client_bootstrap(req: web::Json<models::ClientBootstrapRequest>) -> HttpResponse {
    let session_id = req.session_id.clone();
    
    println!("Client bootstrap request for session: {}", session_id);
    log_event("CLIENT_BOOTSTRAP", &format!("Session: {}", session_id));
    
    // Mock configuration data
    let config = models::ClientBootstrapResponse {
        fwknop: models::FwknopConfig {
            remote_ip: "185.231.180.118".to_string(),
            key_rijndael: "demo_rijndael_key_123456789".to_string(),
            key_hmac: "demo_hmac_key_987654321".to_string(),
        },
        stunnel: models::StunnelConfig {
            server: "gw.viworks.com".to_string(),
            port: 8443,
            ca_pem: "-----BEGIN CERTIFICATE-----\nDEMO_CA_CERT\n-----END CERTIFICATE-----".to_string(),
            client_cert: "-----BEGIN CERTIFICATE-----\nDEMO_CLIENT_CERT\n-----END CERTIFICATE-----".to_string(),
            client_key: "-----BEGIN PRIVATE KEY-----\nDEMO_CLIENT_KEY\n-----END PRIVATE KEY-----".to_string(),
        },
        openvpn: models::OpenVpnConfig {
            base_ovpn: "client\ndev tun\nproto tcp\nremote 127.0.0.1 9443\nresolv-retry infinite\nnobind\npersist-key\npersist-tun\nca ca.crt\ncert client.crt\nkey client.key\nremote-cert-tls server\ncipher AES-256-GCM\nauth SHA256\nkey-direction 1\nverb 3".to_string(),
            auth: models::OpenVpnAuth {
                r#type: "user-pass".to_string(),
                username: "keyvan".to_string(),
                password: "demo_vpn_password".to_string(),
            },
        },
        browser: models::BrowserConfig {
            policy: "per-session".to_string(),
        },
    };
    
    HttpResponse::Ok().json(config)
}

async fn create_user(req: web::Json<models::CreateUserRequest>) -> HttpResponse {
    let username = req.username.clone();
    let email = req.email.clone();
    let mobile = req.mobile.clone();
    
    println!("Create user request: {}", username);
    log_event("USER_CREATE", &format!("Username: {}, Email: {}", username, email));
    
    let mut users = USERS.lock().unwrap();
    users.insert(username.clone(), UserData {
        username: username.clone(),
        email: email.clone(),
        mobile: mobile.clone().unwrap_or_default(),
        status: "pending".to_string(),
        device_bound: false,
        created_at: Utc::now().to_rfc3339(),
    });
    
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "User created successfully",
        "user": {
            "username": username,
            "email": email,
            "status": "pending"
        }
    }))
}

async fn activate_user(req: web::Json<serde_json::Value>) -> HttpResponse {
    let username = req.get("username").and_then(|v| v.as_str()).unwrap_or("");
    
    println!("Activate user request: {}", username);
    log_event("USER_ACTIVATE", &format!("Username: {}", username));
    
    let mut users = USERS.lock().unwrap();
    if let Some(user) = users.get_mut(username) {
        user.status = "active".to_string();
        
        HttpResponse::Ok().json(serde_json::json!({
            "success": true,
            "message": "User activated successfully",
            "user": {
                "username": username,
                "status": "active"
            }
        }))
    } else {
        HttpResponse::NotFound().json(serde_json::json!({
            "success": false,
            "message": "User not found"
        }))
    }
}

async fn get_users(req: actix_web::HttpRequest) -> HttpResponse {
    // Check authorization
    if !check_auth_token(&req) {
        return HttpResponse::Unauthorized().json(serde_json::json!({
            "success": false,
            "message": "Authorization required"
        }));
    }
    
    let users = USERS.lock().unwrap();
    let user_list: Vec<&UserData> = users.values().collect();
    
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "users": user_list
    }))
}

async fn get_device_requests() -> HttpResponse {
    let requests = DEVICE_REQUESTS.lock().unwrap();
    let request_list: Vec<&DeviceRequest> = requests.values().collect();
    
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "requests": request_list
    }))
}

async fn approve_device(req: web::Json<serde_json::Value>) -> HttpResponse {
    let request_id = req.get("request_id").and_then(|v| v.as_str()).unwrap_or("");
    
    println!("Approve device request: {}", request_id);
    log_event("DEVICE_APPROVED", &format!("Request: {}", request_id));
    
    let mut requests = DEVICE_REQUESTS.lock().unwrap();
    if let Some(device_request) = requests.get_mut(request_id) {
        device_request.status = "approved".to_string();
        
        // Update user device binding status
        let mut users = USERS.lock().unwrap();
        if let Some(user) = users.get_mut(&device_request.username) {
            user.device_bound = true;
        }
        
        HttpResponse::Ok().json(serde_json::json!({
            "success": true,
            "message": "Device binding approved"
        }))
    } else {
        HttpResponse::NotFound().json(serde_json::json!({
            "success": false,
            "message": "Request not found"
        }))
    }
}

async fn spawn_container(req: web::Json<serde_json::Value>) -> HttpResponse {
    let username = req.get("username").and_then(|v| v.as_str()).unwrap_or("");
    let session_id = req.get("session_id").and_then(|v| v.as_str()).unwrap_or("");
    
    println!("Spawn container request for user: {}", username);
    log_event("CONTAINER_SPAWN", &format!("User: {}, Session: {}", username, session_id));
    
    // Mock container spawning
    let uuid_string = Uuid::new_v4().to_string();
    let random_path = uuid_string.split('-').next().unwrap();
    let container_url = format!("https://gw.viworks.com/{}/", random_path);
    
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Container spawned successfully",
        "url": container_url,
        "container_id": format!("firefox-{}", random_path),
        "port": 5801
    }))
}

async fn terminate_session(req: web::Json<serde_json::Value>) -> HttpResponse {
    let session_id = req.get("session_id").and_then(|v| v.as_str()).unwrap_or("");
    
    println!("Terminate session request: {}", session_id);
    log_event("SESSION_TERMINATE", &format!("Session: {}", session_id));
    
    let mut sessions = SESSIONS.lock().unwrap();
    sessions.remove(session_id);
    
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Session terminated successfully"
    }))
}

async fn get_sessions() -> HttpResponse {
    let sessions = SESSIONS.lock().unwrap();
    let session_list: Vec<&SessionData> = sessions.values().collect();
    
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "sessions": session_list
    }))
}

async fn get_audit_logs() -> HttpResponse {
    // Mock audit logs
    let logs = vec![
        serde_json::json!({
            "timestamp": Utc::now().to_rfc3339(),
            "event": "LOGIN_SUCCESS",
            "user": "admin",
            "details": "User logged in successfully"
        }),
        serde_json::json!({
            "timestamp": (Utc::now() - Duration::minutes(5)).to_rfc3339(),
            "event": "USER_CREATE",
            "user": "admin",
            "details": "Created user: keyvan"
        }),
        serde_json::json!({
            "timestamp": (Utc::now() - Duration::minutes(10)).to_rfc3339(),
            "event": "DEVICE_BIND_REQUEST",
            "user": "keyvan",
            "details": "Device binding request submitted"
        })
    ];
    
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "logs": logs
    }))
}

// Android-specific endpoints
async fn register_device(req: web::Json<models::DeviceBindRequest>) -> HttpResponse {
    let username = req.username.clone();
    let device_id = req.fingerprint.clone();
    
    println!("Device registration request for user: {}, device: {}", username, device_id);
    log_event("DEVICE_REGISTRATION", &format!("User: {}, Device: {}", username, device_id));
    
    // Check if user exists
    let users = USERS.lock().unwrap();
    if !users.contains_key(&username) {
        return HttpResponse::NotFound().json(serde_json::json!({
            "success": false,
            "message": "User not found"
        }));
    }
    
    // Register device
    let device = UserDevice {
        id: Uuid::new_v4().to_string(),
        user_id: username.clone(),
        device_id: device_id.clone(),
        fcm_token: None,
        device_model: "Android Device".to_string(),
        device_os: "Android".to_string(),
        app_version: "1.0.0".to_string(),
        last_used_at: Utc::now().to_rfc3339(),
        created_at: Utc::now().to_rfc3339(),
    };
    
    let mut user_devices = USER_DEVICES.lock().unwrap();
    user_devices.insert(format!("{}_{}", username, device_id), device);
    
    log_event("DEVICE_REGISTERED", &format!("User: {}, Device: {}", username, device_id));
    
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "deviceRegistered": true,
        "message": "Device registered successfully"
    }))
}

async fn get_verification_code(req: web::Json<serde_json::Value>) -> HttpResponse {
    let request_id = req.get("request_id").and_then(|v| v.as_str()).unwrap_or("");
    let device_id = req.get("device_id").and_then(|v| v.as_str()).unwrap_or("");
    
    println!("Verification code request for device: {}", device_id);
    log_event("VERIFICATION_CODE_REQUEST", &format!("Device: {}", device_id));
    
    // Generate 6-digit verification code
    let code = generate_otp();
    let expires_at = Utc::now() + Duration::minutes(2);
    
    // Create verification request
    let verification_request = VerificationRequest {
        id: request_id.to_string(),
        user_id: "admin".to_string(), // For demo, assume admin user
        device_id: device_id.to_string(),
        code: code.clone(),
        expires_at: expires_at.to_rfc3339(),
        approved: None,
        completed: false,
        ip_address: None,
        location_lat: None,
        location_lng: None,
        created_at: Utc::now().to_rfc3339(),
    };
    
    let mut verification_requests = VERIFICATION_REQUESTS.lock().unwrap();
    verification_requests.insert(request_id.to_string(), verification_request);
    
    log_event("VERIFICATION_CODE_GENERATED", &format!("Device: {}, Code: {}", device_id, code));
    
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "code": code,
        "expiresAt": expires_at.timestamp_millis(),
        "message": "Verification code generated successfully"
    }))
}

async fn confirm_verification(req: web::Json<serde_json::Value>) -> HttpResponse {
    let request_id = req.get("request_id").and_then(|v| v.as_str()).unwrap_or("");
    let approved = req.get("approved").and_then(|v| v.as_bool()).unwrap_or(false);
    let device_id = req.get("device_id").and_then(|v| v.as_str()).unwrap_or("");
    
    println!("Verification confirmation for device: {}, approved: {}", device_id, approved);
    log_event("VERIFICATION_CONFIRMATION", &format!("Device: {}, Approved: {}", device_id, approved));
    
    // Update verification request
    let mut verification_requests = VERIFICATION_REQUESTS.lock().unwrap();
    if let Some(request) = verification_requests.get_mut(request_id) {
        request.approved = Some(approved);
        request.completed = true;
        
        log_event("VERIFICATION_COMPLETED", &format!("Device: {}, Approved: {}", device_id, approved));
        
        HttpResponse::Ok().json(serde_json::json!({
            "success": true,
            "message": "Verification confirmed successfully"
        }))
    } else {
        HttpResponse::NotFound().json(serde_json::json!({
            "success": false,
            "message": "Verification request not found"
        }))
    }
}

async fn get_user_devices() -> HttpResponse {
    let user_devices = USER_DEVICES.lock().unwrap();
    let devices: Vec<&UserDevice> = user_devices.values().collect();
    
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "devices": devices
    }))
}

async fn get_verification_requests() -> HttpResponse {
    let verification_requests = VERIFICATION_REQUESTS.lock().unwrap();
    let requests: Vec<&VerificationRequest> = verification_requests.values().collect();
    
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "requests": requests
    }))
}

// Simple authorization check function
fn check_auth_token(req: &actix_web::HttpRequest) -> bool {
    req.headers()
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .and_then(|h| h.strip_prefix("Bearer "))
        .map(|token| token.len() > 20 || token == "valid_admin_token")
        .unwrap_or(false)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Set up panic hook for debugging
    setup_panic_hook();
    
    // Early logging
    eprintln!("🚀 Starting ViWorkS Admin Backend (Enhanced Demo Version)");
    eprintln!("Initializing application...");
    
    // Initialize demo data
    eprintln!("Initializing demo data...");
    init_demo_data();
    eprintln!("Demo data initialized successfully");
    
    // Initialize logger
    eprintln!("Initializing logger...");
    init_logging();
    eprintln!("Logger initialized successfully");
    
    // Try to initialize database (optional for now) - with timeout
    let database = tokio::time::timeout(
        std::time::Duration::from_secs(10),
        async {
            match Database::new().await {
                Ok(db) => {
                    eprintln!("✅ Database connected successfully");
                    // Run migrations in background to avoid blocking startup
                    let db_clone = db.clone();
                    tokio::spawn(async move {
                        if let Err(e) = db_clone.run_migrations().await {
                            eprintln!("⚠️  Database migration failed: {}", e);
                        } else {
                            eprintln!("✅ Database migrations completed successfully");
                        }
                    });
                    Some(db)
                }
                Err(e) => {
                    eprintln!("⚠️  Database connection failed: {}", e);
                    eprintln!("   Continuing with in-memory data...");
                    None
                }
            }
        }
    ).await.unwrap_or_else(|_| {
        eprintln!("⚠️  Database connection timed out, continuing with in-memory data...");
        None
    });
    
    println!("🚀 Starting ViWorkS Admin Backend (Enhanced Demo Version)");
    println!("Server will listen on 0.0.0.0:8081");
    
    let port = env::var("PORT").unwrap_or_else(|_| "8081".to_string());
    let bind_address = format!("0.0.0.0:{}", port);
    
    eprintln!("Binding to: {}", bind_address);
    println!("Binding to: {}", bind_address);
    
    // Ensure the server stays running
    let server = HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);
        
        App::new()
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .app_data(web::Data::new(database.clone()))
            .route("/health", web::get().to(health))
            .route("/api/v1/auth/login", web::post().to(login))
            .route("/api/v1/auth/challenge/initiate", web::post().to(challenge_initiate))
            .route("/api/v1/auth/challenge/verify", web::post().to(challenge_verify))
            .route("/api/v1/device/bind-request", web::post().to(device_bind_request))
            .route("/api/v1/client/bootstrap", web::post().to(client_bootstrap))
            .route("/api/v1/admin/users/create", web::post().to(create_user))
            .route("/api/v1/admin/users/activate", web::post().to(activate_user))
            .route("/api/v1/admin/users", web::get().to(get_users))
            .route("/api/v1/admin/device/requests", web::get().to(get_device_requests))
            .route("/api/v1/admin/device/approve", web::post().to(approve_device))
            .route("/api/v1/agent/user/create", web::post().to(create_user))
            .route("/api/v1/agent/container/spawn", web::post().to(spawn_container))
            .route("/api/v1/agent/session/terminate", web::post().to(terminate_session))
            .route("/api/v1/admin/sessions", web::get().to(get_sessions))
            .route("/api/v1/admin/audit-logs", web::get().to(get_audit_logs))
            .route("/api/v1/auth/register-device", web::post().to(register_device))
            .route("/api/v1/auth/verification-code", web::post().to(get_verification_code))
            .route("/api/v1/auth/confirm-verification", web::post().to(confirm_verification))
            .route("/api/v1/admin/user-devices", web::get().to(get_user_devices))
            .route("/api/v1/admin/verification-requests", web::get().to(get_verification_requests))
            .default_service(web::route().to(|| async {
                HttpResponse::NotFound().json(serde_json::json!({
                    "message": "Endpoint not found",
                    "available_endpoints": {
                        "health": "/health",
                        "auth": {
                            "login": "POST /api/v1/auth/login",
                            "challenge_initiate": "POST /api/v1/auth/challenge/initiate",
                            "challenge_verify": "POST /api/v1/auth/challenge/verify",
                            "register_device": "POST /api/v1/auth/register-device",
                            "verification_code": "POST /api/v1/auth/verification-code",
                            "confirm_verification": "POST /api/v1/auth/confirm-verification"
                        },
                        "admin": {
                            "users": "GET /api/v1/admin/users",
                            "create_user": "POST /api/v1/admin/users/create",
                            "activate_user": "POST /api/v1/admin/users/activate",
                            "device_requests": "GET /api/v1/admin/device/requests",
                            "approve_device": "POST /api/v1/admin/device/approve",
                            "sessions": "GET /api/v1/admin/sessions",
                            "audit_logs": "GET /api/v1/admin/audit-logs",
                            "user_devices": "GET /api/v1/admin/user-devices",
                            "verification_requests": "GET /api/v1/admin/verification-requests"
                        },
                        "agent": {
                            "create_user": "POST /api/v1/agent/user/create",
                            "spawn_container": "POST /api/v1/agent/container/spawn",
                            "terminate_session": "POST /api/v1/agent/session/terminate"
                        }
                    }
                }))
            }))
    })
    .bind(&bind_address)?
    .shutdown_timeout(5)
    .run();
    
    eprintln!("✅ HTTP server started successfully on {}", bind_address);
    println!("✅ HTTP server started successfully on {}", bind_address);
    
    // This will block until the server is shut down
    server.await
}