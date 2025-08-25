use actix_web::{web, App, HttpServer, middleware::Logger, Result, HttpResponse};
use actix_cors::Cors;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{Utc, Duration};
use std::collections::HashMap;
use std::sync::Mutex;
use tracing::{info, warn, error};

mod auth;
mod models;

use auth::*;
use models::*;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize tracing
    tracing_subscriber::fmt::init();

    info!("🚀 Starting ViWorkS Windows Client Backend");
    info!("🌐 Server will be available at: http://localhost:8080");

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
                    .max_age(3600)
            )
            .service(
                web::scope("/api/v1")
                    .service(
                        web::scope("/auth")
                            .route("/login", web::post().to(login))
                            .route("/2fa/request", web::post().to(request_2fa_code))
                            .route("/2fa/validate", web::post().to(validate_2fa_code))
                            .route("/configs", web::post().to(get_connection_configs))
                            .route("/logout", web::post().to(logout))
                    )
                    .service(
                        web::scope("/clients")
                            .route("/connect", web::post().to(connect_client))
                            .route("/disconnect", web::post().to(disconnect_client))
                            .route("/log", web::post().to(submit_client_log))
                    )
                    .route("/health", web::get().to(health_check))
            )
            .route("/", web::get().to(root))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}

async fn root() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": "ViWorkS Windows Client Backend API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "auth": "/api/v1/auth",
            "clients": "/api/v1/clients",
            "health": "/api/v1/health"
        }
    })))
}

async fn health_check() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "timestamp": Utc::now().to_rfc3339()
    })))
}

// Client management endpoints
async fn connect_client(request: web::Json<ClientConnectRequest>) -> Result<HttpResponse> {
    info!("Client connect request from user: {}", request.username);
    
    // Validate session token (simplified)
    if request.session_token.is_empty() {
        return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
            "success": false,
            "message": "Invalid session token"
        })));
    }

    let client_id = Uuid::new_v4();
    
    info!("Client connected: {} ({})", request.client_name, request.ip_address);
    
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Client connected successfully",
        "client_id": client_id
    })))
}

async fn disconnect_client(request: web::Json<ClientDisconnectRequest>) -> Result<HttpResponse> {
    info!("Client disconnect request from user: {}", request.username);
    
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Client disconnected successfully"
    })))
}

async fn submit_client_log(request: web::Json<ClientLogRequest>) -> Result<HttpResponse> {
    info!("Log from client {}: [{}] {}", request.client_id, request.log_level, request.message);
    
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Log submitted successfully"
    })))
}
