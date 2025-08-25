use actix_web::{App, HttpServer, web, HttpResponse};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct LoginRequest {
    username: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct LoginResponse {
    success: bool,
    message: String,
    session_id: String,
}

async fn health_check() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "message": "ViWorkS Demo Backend is running!"
    }))
}

async fn login(req: web::Json<LoginRequest>) -> Result<HttpResponse, actix_web::Error> {
    let username = req.username.clone();
    let _password = req.password.clone();
    
    // For demo purposes, accept any login
    let session_id = format!("demo_session_{}", username);
    
    Ok(HttpResponse::Ok().json(LoginResponse {
        success: true,
        message: "Login successful, 2FA required".to_string(),
        session_id,
    }))
}

async fn challenge_initiate(req: web::Json<serde_json::Value>) -> Result<HttpResponse, actix_web::Error> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "2FA challenge initiated",
        "session_id": req.get("session_id").unwrap_or(&serde_json::Value::String("demo".to_string()))
    })))
}

async fn challenge_verify(req: web::Json<serde_json::Value>) -> Result<HttpResponse, actix_web::Error> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "2FA verification successful",
        "access_token": "demo_token_123",
        "refresh_token": "demo_refresh_456"
    })))
}

async fn device_bind(req: web::Json<serde_json::Value>) -> Result<HttpResponse, actix_web::Error> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Device bound successfully"
    })))
}

async fn client_bootstrap(req: web::Json<serde_json::Value>) -> Result<HttpResponse, actix_web::Error> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "fwknop": {
            "remote_ip": "185.231.180.118",
            "key_rijndael": "demo_key_32_chars_long",
            "key_hmac": "demo_hmac_key_32_chars"
        },
        "stunnel": {
            "server": "gw.example.com",
            "port": 8443,
            "ca_pem": "-----BEGIN CERTIFICATE-----\nDEMO_CA_CERT\n-----END CERTIFICATE-----"
        },
        "openvpn": {
            "base_ovpn": "client\ndev tun\nproto tcp\nremote 127.0.0.1 9443",
            "auth": {
                "type": "user-pass",
                "username": "demo_user",
                "password": "demo_password"
            }
        },
        "browser": {
            "policy": "per-session"
        }
    })))
}

async fn create_user(req: web::Json<serde_json::Value>) -> Result<HttpResponse, actix_web::Error> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "ok": true,
        "message": "VPN user created successfully"
    })))
}

async fn spawn_container(req: web::Json<serde_json::Value>) -> Result<HttpResponse, actix_web::Error> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "url": "https://gw.example.com/demo123/",
        "port": 5801,
        "container_id": "firefox-demo-123"
    })))
}

async fn terminate_session(req: web::Json<serde_json::Value>) -> Result<HttpResponse, actix_web::Error> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "terminated": true,
        "message": "Session terminated successfully"
    })))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("🚀 Starting ViWorkS Demo Backend (Minimal)...");
    
    HttpServer::new(|| {
        App::new()
            .route("/health", web::get().to(health_check))
            .route("/", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "message": "ViWorkS Demo Backend is running!"
                }))
            }))
            .service(
                web::scope("/api/v1")
                    .route("/auth/login", web::post().to(login))
                    .route("/auth/challenge/initiate", web::post().to(challenge_initiate))
                    .route("/auth/challenge/verify", web::post().to(challenge_verify))
                    .route("/auth/device/bind", web::post().to(device_bind))
                    .route("/auth/client/bootstrap", web::post().to(client_bootstrap))
                    .route("/agent/user/create", web::post().to(create_user))
                    .route("/agent/container/spawn", web::post().to(spawn_container))
                    .route("/agent/session/terminate", web::post().to(terminate_session))
            )
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
