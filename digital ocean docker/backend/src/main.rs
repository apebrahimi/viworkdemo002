use actix_web::{App, HttpServer, web, HttpResponse, middleware::Logger};
use serde::{Deserialize, Serialize};
use std::io;
use std::env;

// Import WebSocket modules
mod websocket;
use websocket::websocket_route;

#[derive(Debug, Serialize, Deserialize)]
struct HealthResponse {
    status: String,
    timestamp: String,
    version: String,
}

async fn health_check() -> HttpResponse {
    let response = HealthResponse {
        status: "healthy".to_string(),
        timestamp: chrono::Utc::now().to_rfc3339(),
        version: env::var("CARGO_PKG_VERSION").unwrap_or_else(|_| "unknown".to_string()),
    };
    
    HttpResponse::Ok().json(response)
}

async fn health_check_simple() -> HttpResponse {
    HttpResponse::Ok().body("OK")
}

async fn readiness_check() -> HttpResponse {
    // Add basic readiness checks here
    HttpResponse::Ok().body("ready")
}

#[actix_web::main]
async fn main() -> io::Result<()> {
    // Set up logging
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    
    // Log startup information
    log::info!("🚀 Starting ViWorkS Backend Server");
    log::info!("📊 Environment: {}", env::var("RUST_ENV").unwrap_or_else(|_| "production".to_string()));
    log::info!("🌐 Host: {}", env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string()));
    log::info!("🔌 Port: {}", env::var("PORT").unwrap_or_else(|_| "8081".to_string()));
    
    let host = env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = env::var("PORT").unwrap_or_else(|_| "8081".to_string());
    let bind_addr = format!("{}:{}", host, port);
    
    log::info!("🔗 Binding to: {}", bind_addr);
    
    // Create server with comprehensive error handling
    let server = HttpServer::new(|| {
        App::new()
            // Add logging middleware
            .wrap(Logger::default())
            
            // WebSocket endpoint (simplified)
            .route("/ws", web::get().to(websocket_route))
            
            // Health check endpoints
            .route("/health", web::get().to(health_check))
            .route("/health/simple", web::get().to(health_check_simple))
            .route("/health/readiness", web::get().to(readiness_check))
            
            // Basic API endpoint for testing
            .route("/api/v1/health", web::get().to(health_check))
    })
    .bind(&bind_addr)
    .map_err(|e| {
        log::error!("❌ Failed to bind to {}: {}", bind_addr, e);
        io::Error::new(io::ErrorKind::AddrInUse, format!("Failed to bind to {}: {}", bind_addr, e))
    })?;
    
    log::info!("✅ Server bound successfully to {}", bind_addr);
    log::info!("🚀 Starting HTTP server...");
    
    // Start the server with graceful shutdown
    server
        .run()
        .await
        .map_err(|e| {
            log::error!("❌ Server failed to start: {}", e);
            io::Error::new(io::ErrorKind::Other, format!("Server failed to start: {}", e))
        })?;
    
    log::info!("✅ Server started successfully");
    Ok(())
}
