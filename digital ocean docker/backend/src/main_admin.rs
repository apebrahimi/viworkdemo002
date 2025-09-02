// ViWorkS Admin Backend - With Admin Authentication Separation
use actix_web::{App, HttpServer, web, HttpResponse, middleware};
use actix_cors::Cors;
use std::env;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    message: String,
    timestamp: String,
    version: &'static str,
    admin_realm_enabled: bool,
}

#[derive(Serialize)]
struct ProcessHealthResponse {
    status: String,
    message: String,
    timestamp: String,
    process_id: u32,
}

async fn health_check() -> HttpResponse {
    let response = HealthResponse {
        status: "healthy".to_string(),
        message: "ViWorkS Backend is running!".to_string(),
        timestamp: chrono::Utc::now().to_rfc3339(),
        version: env!("CARGO_PKG_VERSION"),
        admin_realm_enabled: env::var("ADMIN_REALM_ENFORCED").unwrap_or_else(|_| "false".to_string()) == "true",
    };
    HttpResponse::Ok().json(response)
}

async fn process_health_check() -> HttpResponse {
    let response = ProcessHealthResponse {
        status: "healthy".to_string(),
        message: "Backend process is running and responding to HTTP requests".to_string(),
        timestamp: chrono::Utc::now().to_rfc3339(),
        process_id: std::process::id(),
    };
    HttpResponse::Ok().json(response)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Set up logging
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    
    println!("🚀 Starting ViWorkS Admin Backend...");
    println!("📅 Started at: {}", chrono::Utc::now().to_rfc3339());
    
    // Get configuration from environment
    let host = env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = env::var("PORT").unwrap_or_else(|_| "8081".to_string()).parse::<u16>().unwrap_or(8081);
    
    println!("🌐 Starting HTTP server on {}:{}...", host, port);
    println!("🔍 Debug: Host = '{}', Port = {}", host, port);
    
    // Start HTTP server IMMEDIATELY (no database operations)
    let server = HttpServer::new(move || {
        App::new()
            .wrap(middleware::Logger::default())
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
            )
            // Health check endpoints (no auth required) - START IMMEDIATELY
            .route("/health", web::get().to(health_check))
            .route("/health/process", web::get().to(process_health_check))
            // Placeholder for future admin routes
            .route("/admin/api/health", web::get().to(health_check))
    })
    .bind(format!("{}:{}", host, port))?
    .run();
    
    println!("✅ HTTP server started successfully on {}:{}", host, port);
    println!("🔍 Health check available at: http://{}:{}/health", host, port);
    println!("🔍 Process health check available at: http://{}:{}/health/process", host, port);
    
    // Run the server
    server.await?;
    
    Ok(())
}
