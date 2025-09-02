use actix_web::{App, HttpServer, web, HttpResponse};
use std::io;

async fn health_check() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "message": "ViWorkS Test Backend is running!",
        "timestamp": "2025-09-02T19:00:00Z"
    }))
}

async fn health_check_simple() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "ok",
        "message": "Simple test app running"
    }))
}

#[actix_web::main]
async fn main() -> io::Result<()> {
    println!("🧪 Starting ViWorkS Test Backend...");
    
    // Log environment variables for debugging
    println!("🔧 Environment Configuration:");
    println!("  HOST: {}", std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string()));
    println!("  PORT: {}", std::env::var("PORT").unwrap_or_else(|_| "8081".to_string()));
    println!("  RUST_LOG: {}", std::env::var("RUST_LOG").unwrap_or_else(|_| "info".to_string()));
    
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
    
    // Create minimal server for testing
    let server = HttpServer::new(|| {
        App::new()
            .route("/health", web::get().to(health_check))
            .route("/health/simple", web::get().to(health_check_simple))
    })
    .shutdown_timeout(30)
    .bind(&bind_addr)
    .map_err(|e| {
        eprintln!("❌ Failed to bind server to {}: {}", bind_addr, e);
        io::Error::new(io::ErrorKind::AddrNotAvailable, format!("Bind failed: {}", e))
    })?;
    
    println!("✅ HTTP server bound successfully to {}", bind_addr);
    println!("🚀 Test server is now running and accepting connections");
    println!("🔍 Health check available at: http://{}/health", bind_addr);
    
    // Run server
    match server.run().await {
        Ok(_) => {
            println!("✅ Test server shutdown gracefully");
            Ok(())
        }
        Err(e) => {
            eprintln!("❌ Test server error: {}", e);
            Err(io::Error::new(io::ErrorKind::Other, e))
        }
    }
}
