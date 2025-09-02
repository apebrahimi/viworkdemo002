use actix_web::{App, HttpServer, web, HttpResponse};
use serde::{Deserialize, Serialize};
use std::io;

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
        "message": "ViWorkS Demo Backend is running!",
        "timestamp": chrono::Utc::now().to_rfc3339(),
        "version": env!("CARGO_PKG_VERSION")
    }))
}

async fn health_check_simple() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "ok",
        "message": "Minimal app running"
    }))
}

async fn readiness_check() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "ready",
        "message": "Backend is ready to serve requests",
        "timestamp": chrono::Utc::now().to_rfc3339()
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

async fn challenge_initiate(_req: web::Json<serde_json::Value>) -> Result<HttpResponse, actix_web::Error> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "2FA challenge initiated",
        "session_id": _req.get("session_id").unwrap_or(&serde_json::Value::String("demo".to_string()))
    })))
}

async fn challenge_verify(_req: web::Json<serde_json::Value>) -> Result<HttpResponse, actix_web::Error> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "2FA verification successful",
        "access_token": "demo_token_123",
        "refresh_token": "demo_refresh_456"
    })))
}

async fn device_bind(_req: web::Json<serde_json::Value>) -> Result<HttpResponse, actix_web::Error> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Device bound successfully"
    })))
}

async fn client_bootstrap(_req: web::Json<serde_json::Value>) -> Result<HttpResponse, actix_web::Error> {
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

async fn create_user(_req: web::Json<serde_json::Value>) -> Result<HttpResponse, actix_web::Error> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "ok": true,
        "message": "VPN user created successfully"
    })))
}

async fn spawn_container(_req: web::Json<serde_json::Value>) -> Result<HttpResponse, actix_web::Error> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "url": "https://gw.example.com/demo123/",
        "port": 5801,
        "container_id": "firefox-demo-123"
    })))
}

async fn terminate_session(_req: web::Json<serde_json::Value>) -> Result<HttpResponse, actix_web::Error> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "terminated": true,
        "message": "Session terminated successfully"
    })))
}

// Admin endpoints for frontend
async fn get_admin_users() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "users": [
            {
                "id": "user-1",
                "username": "demo_user",
                "email": "demo@example.com",
                "status": "active",
                "created_at": "2025-08-24T10:00:00Z"
            }
        ],
        "total": 1,
        "page": 1,
        "per_page": 10
    }))
}

async fn create_admin_user(_req: web::Json<serde_json::Value>) -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Admin user created successfully"
    }))
}

async fn activate_admin_user(_req: web::Json<serde_json::Value>) -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Admin user activated successfully"
    }))
}

async fn get_admin_sessions() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "sessions": [
            {
                "id": "session-1",
                "user_id": "user-1",
                "status": "active",
                "created_at": "2025-08-24T10:00:00Z"
            }
        ],
        "total": 1,
        "page": 1,
        "per_page": 10
    }))
}

async fn get_device_requests() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "requests": [
            {
                "id": "device-req-1",
                "username": "demo_user",
                "device_name": "MacBook Pro",
                "device_fingerprint": "abc123def456",
                "status": "pending",
                "created_at": "2025-08-24T10:00:00Z"
            }
        ],
        "total": 1
    }))
}

async fn approve_device(_req: web::Json<serde_json::Value>) -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Device approved successfully"
    }))
}

#[actix_web::main]
async fn main() -> io::Result<()> {
    // Initialize basic logging immediately
    env_logger::init();
    println!("🚀 Starting ViWorkS Admin Backend (Minimal)...");
    
    // Log environment variables for debugging
    println!("🔧 Environment Configuration:");
    println!("  HOST: {}", std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string()));
    println!("  PORT: {}", std::env::var("PORT").unwrap_or_else(|_| "8081".to_string()));
    println!("  RUST_LOG: {}", std::env::var("RUST_LOG").unwrap_or_else(|_| "info".to_string()));
    println!("  DATABASE_URL: {}", std::env::var("DATABASE_URL").unwrap_or_else(|_| "not set".to_string()));
    println!("  REDIS_URL: {}", std::env::var("REDIS_URL").unwrap_or_else(|_| "not set".to_string()));
    
    // Parse port with error handling
    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8081".to_string())
        .parse::<u16>()
        .map_err(|e| {
            eprintln!("❌ Invalid PORT environment variable: {}", e);
            io::Error::new(io::ErrorKind::InvalidInput, format!("Invalid PORT: {}", e))
        })?;
    
    let host = std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let bind_addr = format!("{}:{}", host, port);
    
    println!("🌐 Starting HTTP server on {}...", bind_addr);
    
    // Create server with graceful shutdown and better error handling
    let server = HttpServer::new(|| {
        App::new()
            // Health check endpoints
            .route("/health", web::get().to(health_check))
            .route("/health/simple", web::get().to(health_check_simple))
            .route("/health/readiness", web::get().to(readiness_check))
            
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
                    
                    // Admin endpoints for frontend
                    .route("/admin/users", web::get().to(get_admin_users))
                    .route("/admin/users/create", web::post().to(create_admin_user))
                    .route("/admin/users/activate", web::post().to(activate_admin_user))
                    .route("/admin/sessions", web::get().to(get_admin_sessions))
                    .route("/admin/device/requests", web::get().to(get_device_requests))
                    .route("/admin/device/approve", web::post().to(approve_device))
            )
    })
    .shutdown_timeout(30) // Graceful shutdown timeout
    .bind(&bind_addr)
    .map_err(|e| {
        eprintln!("❌ Failed to bind server to {}: {}", bind_addr, e);
        io::Error::new(io::ErrorKind::AddrNotAvailable, format!("Bind failed: {}", e))
    })?;
    
    println!("✅ HTTP server bound successfully to {}", bind_addr);
    println!("🚀 Server is now running and accepting connections");
    println!("🔍 Health check available at: http://{}/health", bind_addr);
    
    // Run server with comprehensive error handling
    match server.run().await {
        Ok(_) => {
            println!("✅ Server shutdown gracefully");
            Ok(())
        }
        Err(e) => {
            eprintln!("❌ Server error: {}", e);
            Err(io::Error::new(io::ErrorKind::Other, e))
        }
    }
}
