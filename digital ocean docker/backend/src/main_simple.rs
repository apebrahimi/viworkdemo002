use actix_web::{App, HttpServer, web, HttpResponse};
use actix_cors::Cors;
use serde::{Deserialize, Serialize};
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use chrono::Utc;
use rand::Rng;
use uuid::Uuid;
use std::collections::HashMap;
use std::sync::Mutex;
use once_cell::sync::Lazy;

// Global state for demo purposes
static TWO_FACTOR_CODES: Lazy<Mutex<HashMap<String, (String, chrono::DateTime<Utc>)>>> = 
    Lazy::new(|| Mutex::new(HashMap::new()));

// Data structures
#[derive(Debug, Serialize, Deserialize)]
struct LoginRequest {
    username: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct LoginResponse {
    success: bool,
    data: Option<LoginData>,
    message: String,
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
struct ChallengeInitiateResponse {
    success: bool,
    message: String,
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
    message: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct AuthData {
    access_token: String,
    refresh_token: String,
    expires_in: i64,
}

#[derive(Debug, Serialize, Deserialize)]
struct DeviceBindRequest {
    username: String,
    fingerprint: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct DeviceBindResponse {
    success: bool,
    message: String,
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

// Gateway Agent endpoints
#[derive(Debug, Serialize, Deserialize)]
struct CreateUserRequest {
    username: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct CreateUserResponse {
    ok: bool,
    message: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct SpawnContainerRequest {
    username: String,
    session_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct SpawnContainerResponse {
    url: String,
    port: u16,
    container_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct TerminateSessionRequest {
    session_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct TerminateSessionResponse {
    terminated: bool,
    message: String,
}

// API Handlers
async fn health_check() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "timestamp": Utc::now().to_rfc3339(),
        "version": "1.0.0"
    }))
}

async fn login(req: web::Json<LoginRequest>) -> Result<HttpResponse, actix_web::Error> {
    let _username = req.username.clone();
    let _password = req.password.clone();
    
    // For demo purposes, accept any login
    let session_id = Uuid::new_v4().to_string();
    
    Ok(HttpResponse::Ok().json(LoginResponse {
        success: true,
        data: Some(LoginData {
            session_id: session_id.clone(),
            requires_2fa: true,
        }),
        message: "Login successful, 2FA required".to_string(),
    }))
}

async fn challenge_initiate(req: web::Json<ChallengeInitiateRequest>) -> Result<HttpResponse, actix_web::Error> {
    let session_id = req.session_id.clone();
    
    // Generate a 6-digit OTP code
    let mut rng = rand::thread_rng();
    let code = format!("{:06}", rng.gen_range(100000..999999));
    
    // Store the code with 120-second TTL
    let expires_at = Utc::now() + chrono::Duration::seconds(120);
    
    {
        let mut codes = TWO_FACTOR_CODES.lock().unwrap();
        codes.insert(session_id.clone(), (code.clone(), expires_at));
    }
    
    Ok(HttpResponse::Ok().json(ChallengeInitiateResponse {
        success: true,
        message: "OTP code generated successfully".to_string(),
        session_id: session_id.clone(),
    }))
}

async fn challenge_verify(req: web::Json<ChallengeVerifyRequest>) -> Result<HttpResponse, actix_web::Error> {
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

async fn device_bind(req: web::Json<DeviceBindRequest>) -> Result<HttpResponse, actix_web::Error> {
    let _username = req.username.clone();
    let _fingerprint = req.fingerprint.clone();
    
    Ok(HttpResponse::Ok().json(DeviceBindResponse {
        success: true,
        message: "Device bound successfully".to_string(),
    }))
}

async fn client_bootstrap(req: web::Json<ClientBootstrapRequest>) -> Result<HttpResponse, actix_web::Error> {
    let _session_id = req.session_id.clone();
    
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

async fn create_user(req: web::Json<CreateUserRequest>) -> Result<HttpResponse, actix_web::Error> {
    let _username = req.username.clone();
    let _password = req.password.clone();
    
    Ok(HttpResponse::Ok().json(CreateUserResponse {
        ok: true,
        message: "VPN user created successfully".to_string(),
    }))
}

async fn spawn_container(req: web::Json<SpawnContainerRequest>) -> Result<HttpResponse, actix_web::Error> {
    let _username = req.username.clone();
    let _session_id = req.session_id.clone();
    
    // Generate random path and port for demo
    let random_path = generate_random_path();
    let port = 5801;
    let container_id = format!("firefox-{}", port);
    
    let url = format!("https://gw.example.com/{}/", random_path);
    
    Ok(HttpResponse::Ok().json(SpawnContainerResponse {
        url,
        port,
        container_id,
    }))
}

async fn terminate_session(req: web::Json<TerminateSessionRequest>) -> Result<HttpResponse, actix_web::Error> {
    let _session_id = req.session_id.clone();
    
    Ok(HttpResponse::Ok().json(TerminateSessionResponse {
        terminated: true,
        message: "Session terminated successfully".to_string(),
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

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize logging first (following troubleshooting guide)
    env_logger::init();
    log::info!("🚀 Starting ViWorkS Admin Backend (Simple Demo)...");
    
    // Set up panic hook to catch panics
    std::panic::set_hook(Box::new(|panic_info| {
        eprintln!("Application panicked: {:?}", panic_info);
        std::process::exit(1);
    }));
    
    // Initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();
    
    info!("🌐 Starting HTTP server on 0.0.0.0:8080...");
    
    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);
        
        App::new()
            .wrap(cors)
            
            // Health check
            .route("/health", web::get().to(health_check))
            
            // API v1 routes
            .service(
                web::scope("/api/v1")
                    // Authentication endpoints
                    .route("/auth/login", web::post().to(login))
                    .route("/auth/challenge/initiate", web::post().to(challenge_initiate))
                    .route("/auth/challenge/verify", web::post().to(challenge_verify))
                    .route("/auth/device/bind", web::post().to(device_bind))
                    .route("/auth/client/bootstrap", web::post().to(client_bootstrap))
                    
                    // Gateway Agent endpoints
                    .route("/agent/user/create", web::post().to(create_user))
                    .route("/agent/container/spawn", web::post().to(spawn_container))
                    .route("/agent/session/terminate", web::post().to(terminate_session))
            )
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
