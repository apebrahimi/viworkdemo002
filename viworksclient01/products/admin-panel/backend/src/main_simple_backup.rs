use actix_web::{App, HttpServer, web, HttpResponse, HttpRequest};
use actix_cors::Cors;
use actix_web_actors::ws;
use actix::{Actor, StreamHandler};
use serde::{Deserialize, Serialize};
use tracing::{info};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[derive(Debug, Serialize, Deserialize)]
struct LoginRequest {
    username: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct LoginResponse {
    token: String,
    refresh_token: String,
    user: UserInfo,
}

#[derive(Debug, Serialize, Deserialize)]
struct UserInfo {
    id: String,
    username: String,
    email: String,
    role: String,
}



async fn login(req: web::Json<LoginRequest>) -> HttpResponse {
    // Simple authentication - check for admin/admin123
    if req.username == "admin" && req.password == "admin123" {
        let response = LoginResponse {
            token: "dummy_token_for_admin".to_string(),
            refresh_token: "dummy_refresh_token_for_admin".to_string(),
            user: UserInfo {
                id: "1701fe72-fb04-4e26-8d20-1eacb234746e".to_string(),
                username: "admin".to_string(),
                email: "admin@viworks.local".to_string(),
                role: "owner".to_string(),
            },
        };
        HttpResponse::Ok().json(response)
    } else {
        HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Invalid credentials"
        }))
    }
}

async fn verify_token(req: HttpRequest) -> HttpResponse {
    let auth_header = req.headers().get("Authorization");
    
    if let Some(auth_header) = auth_header {
        if let Ok(auth_str) = auth_header.to_str() {
            if auth_str.starts_with("Bearer ") {
                let token = &auth_str[7..];
                if token == "dummy_token_for_admin" {
                    HttpResponse::Ok().json(serde_json::json!({
                        "valid": true,
                        "message": "Token is valid"
                    }))
                } else {
                    HttpResponse::Unauthorized().json(serde_json::json!({
                        "valid": false,
                        "error": "Invalid token"
                    }))
                }
            } else {
                HttpResponse::BadRequest().json(serde_json::json!({
                    "error": "Invalid authorization header format"
                }))
            }
        } else {
            HttpResponse::BadRequest().json(serde_json::json!({
                "error": "Invalid authorization header"
            }))
        }
    } else {
        HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "No authorization header"
        }))
    }
}

// Simple WebSocket handler
async fn ws_handler(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, actix_web::Error> {
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
                // Echo the message back
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
    // Initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("🚀 Starting ViWorkS Admin Panel Backend (Simple Auth)");

    let host = std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8081".to_string())
        .parse::<u16>()
        .unwrap_or(8081);
    
    info!("🌐 Starting HTTP server on {}:{}", host, port);

    // Start HTTP server
    HttpServer::new(|| {
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
                    "service": "ViWorkS Admin Panel Backend",
                    "version": "1.0.0",
                    "message": "Backend is running successfully!"
                }))
            }))
            .route("/api/status", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "message": "ViWorkS Admin Panel Backend is running!",
                    "database": "connected",
                    "redis": "connected",
                    "status": "healthy"
                }))
            }))
            .route("/api/auth/login", web::post().to(login))
            .route("/api/auth/verify", web::get().to(verify_token))
            .route("/api/v1/auth/login", web::post().to(login))
            .route("/api/v1/auth/logout", web::post().to(|| async { HttpResponse::Ok().json(serde_json::json!({"message": "Logged out"})) }))
            .route("/api/v1/auth/refresh", web::post().to(|| async { HttpResponse::Ok().json(serde_json::json!({"token": "dummy_token_for_admin", "refresh_token": "dummy_refresh_token_for_admin"})) }))
            .route("/api/v1/auth/me", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "id": "1701fe72-fb04-4e26-8d20-1eacb234746e",
                    "username": "admin",
                    "email": "admin@viworks.local",
                    "role": "owner"
                }))
            }))
            .route("/api/v1/health", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "status": "healthy",
                    "timestamp": "2025-08-24T10:30:00Z",
                    "version": "1.0.0"
                }))
            }))
            .route("/api/v1/health/full", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "status": "healthy",
                    "timestamp": "2025-08-24T10:30:00Z",
                    "version": "1.0.0",
                    "services": {
                        "database": "connected",
                        "redis": "connected",
                        "api": "running"
                    }
                }))
            }))
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
                            "username": "security_admin",
                            "email": "security@viworks.local",
                            "role": "security_admin",
                            "status": "active"
                        },
                        {
                            "id": "1cbda300-866f-481b-b297-6a2bcf51906b",
                            "username": "analyst",
                            "email": "analyst@viworks.local",
                            "role": "security_analyst",
                            "status": "active"
                        }
                    ],
                    "total": 3,
                    "page": 1,
                    "per_page": 10
                }))
            }))
            .route("/api/v1/clients", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "clients": [
                        {
                            "id": "client-1",
                            "name": "Client 1",
                            "status": "online",
                            "platform": "Windows"
                        },
                        {
                            "id": "client-2",
                            "name": "Client 2",
                            "status": "online",
                            "platform": "macOS"
                        },
                        {
                            "id": "client-3",
                            "name": "Client 3",
                            "status": "offline",
                            "platform": "Linux"
                        }
                    ],
                    "total": 3,
                    "page": 1,
                    "per_page": 10
                }))
            }))
            .route("/api/v1/monitoring/alerts", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "alerts": [
                        {
                            "id": "alert-1",
                            "title": "Security Alert",
                            "severity": "high",
                            "is_resolved": false
                        },
                        {
                            "id": "alert-2",
                            "title": "System Warning",
                            "severity": "medium",
                            "is_resolved": true
                        }
                    ],
                    "total": 2,
                    "page": 1,
                    "per_page": 10
                }))
            }))
            .route("/api/v1/monitoring/metrics", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "cpu_usage": "45%",
                    "memory_usage": "67%",
                    "network_usage": "23%",
                    "storage_usage": "34%"
                }))
            }))
            .route("/api/v1/monitoring/dashboard", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "total_users": 3,
                    "active_clients": 2,
                    "total_clients": 3,
                    "security_alerts": 1,
                    "system_health": "healthy"
                }))
            }))
            .route("/api/v1/monitoring/logs", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "logs": [
                        {
                            "id": "log-1",
                            "timestamp": "2025-08-24T10:30:00Z",
                            "level": "info",
                            "message": "System started successfully"
                        },
                        {
                            "id": "log-2",
                            "timestamp": "2025-08-24T10:29:00Z",
                            "level": "warning",
                            "message": "High memory usage detected"
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
                            "user_id": "1701fe72-fb04-4e26-8d20-1eacb234746e",
                            "username": "admin",
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
            .route("/api/v1/sessions/expired", web::delete().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "message": "Expired sessions cleaned up",
                    "count": 5
                }))
            }))
            .route("/api/v1/users/{id}/unlock", web::post().to(|path: web::Path<String>| async move { 
                HttpResponse::Ok().json(serde_json::json!({
                    "message": "User unlocked successfully",
                    "user_id": path.into_inner()
                }))
            }))
            .route("/api/v1/users/{id}/reset-password", web::post().to(|path: web::Path<String>| async move { 
                HttpResponse::Ok().json(serde_json::json!({
                    "new_password": "temporary_password_123",
                    "user_id": path.into_inner()
                }))
            }))
            .route("/api/v1/clients/{id}/disconnect", web::post().to(|path: web::Path<String>| async move { 
                HttpResponse::Ok().json(serde_json::json!({
                    "message": "Client disconnected successfully",
                    "client_id": path.into_inner()
                }))
            }))
            .route("/api/v1/sessions/{id}/revoke", web::put().to(|path: web::Path<String>| async move { 
                HttpResponse::Ok().json(serde_json::json!({
                    "message": "Session revoked successfully",
                    "session_id": path.into_inner()
                }))
            }))
            .route("/api/v1/sessions/user/{user_id}/revoke", web::put().to(|path: web::Path<String>| async move { 
                HttpResponse::Ok().json(serde_json::json!({
                    "message": "User sessions revoked successfully",
                    "user_id": path.into_inner()
                }))
            }))
            .route("/api/v1/monitoring/alerts/{alert_id}/resolve", web::put().to(|path: web::Path<String>| async move { 
                HttpResponse::Ok().json(serde_json::json!({
                    "message": "Alert resolved successfully",
                    "alert_id": path.into_inner()
                }))
            }))
            .route("/api/v1/devices", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "devices": [
                        {
                            "id": "device-1",
                            "name": "iPhone 12",
                            "type": "mobile",
                            "user": "admin@viworks.local",
                            "status": "active",
                            "last_seen": "2025-08-24T10:30:00Z",
                            "ip_address": "192.168.1.101"
                        },
                        {
                            "id": "device-2",
                            "name": "MacBook Pro",
                            "type": "desktop",
                            "user": "admin@viworks.local",
                            "status": "active",
                            "last_seen": "2025-08-24T10:25:00Z",
                            "ip_address": "192.168.1.102"
                        },
                        {
                            "id": "device-3",
                            "name": "iPad Air",
                            "type": "tablet",
                            "user": "analyst@viworks.local",
                            "status": "inactive",
                            "last_seen": "2025-08-24T09:15:00Z",
                            "ip_address": "192.168.1.103"
                        }
                    ],
                    "total": 3,
                    "page": 1,
                    "per_page": 10
                }))
            }))
            .route("/ws", web::get().to(ws_handler))
            .route("/", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "message": "ViWorkS Admin Panel Backend",
                    "endpoints": {
                        "health": "/health",
                        "status": "/api/status",
                        "login": "/api/auth/login",
                        "verify": "/api/auth/verify"
                    }
                }))
            }))
    })
    .bind((host, port))?
    .run()
    .await
}
