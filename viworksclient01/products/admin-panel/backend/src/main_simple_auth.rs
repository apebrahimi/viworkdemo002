use actix_web::{App, HttpServer, web, HttpResponse, HttpRequest};
use actix_cors::Cors;
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
