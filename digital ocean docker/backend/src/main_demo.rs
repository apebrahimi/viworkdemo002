use actix_web::{App, HttpServer, web, HttpResponse};
use actix_cors::Cors;
use actix_web_actors::ws;
use actix::{Actor, StreamHandler};
use serde::{Deserialize, Serialize};
use tracing::{info};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use std::collections::HashMap;
use std::sync::Mutex;
use once_cell::sync::Lazy;
use chrono::{Utc, Duration};
use rand::Rng;
use std::panic;

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

// Demo handlers
async fn login(req: web::Json<LoginRequest>) -> HttpResponse {
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

async fn create_user(_req: web::Json<CreateUserRequest>) -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "ok": true,
        "message": "VPN user created successfully"
    }))
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

    // Initialize basic logging immediately (before any complex operations)
    env_logger::init();
    log::info!("🚀 Starting ViWorkS Admin Panel Backend (Demo Mode)");
    log::info!("🔧 Environment: HOST={}, PORT={}", 
        std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string()),
        std::env::var("PORT").unwrap_or_else(|_| "8081".to_string())
    );

    // Then initialize more complex logging
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("🚀 Starting ViWorkS Admin Panel Backend (Demo Mode)");

    let host = std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8081".to_string())
        .parse::<u16>()
        .unwrap_or(8081);
    
    log::info!("🌐 Starting HTTP server on {}:{}", host, port);
    info!("🌐 Starting HTTP server on {}:{}", host, port);

    // Start HTTP server with error handling
    log::info!("🔧 Creating HTTP server...");
    let server = HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .expose_headers(vec!["Access-Control-Allow-Origin", "Access-Control-Allow-Methods", "Access-Control-Allow-Headers"])
            .max_age(3600);

        App::new()
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
            .route("/api/status", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "message": "ViWorkS Admin Panel Backend (Demo Mode) is running!",
                    "database": "demo_mode",
                    "redis": "demo_mode",
                    "status": "healthy"
                }))
            }))
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
            // Mock endpoints for admin panel
            .route("/api/v1/users", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "users": [
                        {
                            "id": "1701fe72-fb04-4e26-8d20-1eacb234746e",
                            "username": "admin",
                            "email": "admin@viworks.local",
                            "role": "owner",
                            "status": "active"
                        },
                        {
                            "id": "ec3ce0b2-78b5-4812-b82f-cea8730136ac",
                            "username": "keyvan",
                            "email": "keyvan@viworks.local",
                            "role": "user",
                            "status": "active"
                        }
                    ],
                    "total": 2,
                    "page": 1,
                    "per_page": 10
                }))
            }))
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
                        "agent_user_create": "/api/v1/agent/user/create",
                        "agent_container_spawn": "/api/v1/agent/container/spawn",
                        "agent_session_terminate": "/api/v1/agent/session/terminate"
                    }
                }))
            }))
    })
    .bind((host.clone(), port))?;

    log::info!("🚀 Server configured, starting...");
    info!("🚀 Server configured, starting...");
    
    // Start the server and await it (this keeps the process running)
    log::info!("✅ ViWorkS Backend is now running on {}:{}", host, port);
    info!("✅ ViWorkS Backend is now running on {}:{}", host, port);
    
    server.run().await
}
