// ViWorkS Admin Backend - With Admin Authentication Separation
use actix_web::{App, HttpServer, web, HttpResponse, middleware};
use actix_cors::Cors;
use sqlx::postgres::PgPoolOptions;
use std::env;
use serde::{Deserialize, Serialize};

// Import modules
mod config;
mod models;
mod admin;
mod api;
mod utils;
mod auth;

use config::AppConfig;

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
        "message": "ViWorkS Backend is running!",
        "timestamp": chrono::Utc::now().to_rfc3339(),
        "version": env!("CARGO_PKG_VERSION"),
        "admin_realm_enabled": env::var("ADMIN_REALM_ENFORCED").unwrap_or_else(|_| "false".to_string()) == "true"
    }))
}

async fn readiness_check(pool: web::Data<sqlx::PgPool>) -> HttpResponse {
    // Check database connection
    let db_healthy = sqlx::query("SELECT 1")
        .fetch_one(pool.get_ref())
        .await
        .is_ok();

    if db_healthy {
        HttpResponse::Ok().json(serde_json::json!({
            "status": "ready",
            "message": "Backend is ready to serve requests",
            "database": "connected",
            "timestamp": chrono::Utc::now().to_rfc3339()
        }))
    } else {
        HttpResponse::ServiceUnavailable().json(serde_json::json!({
            "status": "not_ready",
            "message": "Database connection failed",
            "database": "disconnected",
            "timestamp": chrono::Utc::now().to_rfc3339()
        }))
    }
}

// Legacy login endpoint (will be used when ADMIN_REALM_ENFORCED=false)
async fn legacy_login(req: web::Json<LoginRequest>) -> Result<HttpResponse, actix_web::Error> {
    let username = req.username.clone();
    let _password = req.password.clone();
    
    // For demo purposes, accept any login
    let session_id = format!("demo_session_{}", username);
    
    Ok(HttpResponse::Ok().json(LoginResponse {
        success: true,
        message: "Login successful (legacy auth)".to_string(),
        session_id,
    }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize logging
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    
    println!("🚀 Starting ViWorkS Admin Backend with Auth Separation...");
    
    // Load configuration
    let config = AppConfig::load()
        .expect("Failed to load configuration");
    
    println!("🔧 Configuration:");
    println!("  Host: {}", config.host);
    println!("  Port: {}", config.port);
    println!("  Admin Realm: {}", env::var("ADMIN_REALM_ENFORCED").unwrap_or_else(|_| "false".to_string()));
    println!("  Database: {}", if config.database_url.contains("@") {
        let parts: Vec<&str> = config.database_url.split('@').collect();
        if parts.len() > 1 {
            format!("***@{}", parts[1])
        } else {
            "***".to_string()
        }
    } else {
        config.database_url.clone()
    });
    
    // Create database pool
    println!("📦 Connecting to database...");
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&config.database_url)
        .await
        .expect("Failed to connect to database");
    
    println!("✅ Database connected");
    
    // Run migrations
    println!("🔄 Running database migrations...");
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run migrations");
    println!("✅ Migrations completed");
    
    // Check and initialize feature flags (handle case where table doesn't exist yet)
    let admin_realm_enabled = match sqlx::query_scalar::<_, bool>(
        "SELECT enabled FROM feature_flags WHERE name = 'ADMIN_REALM_ENFORCED'"
    )
    .fetch_optional(&pool)
    .await {
        Ok(Some(enabled)) => enabled,
        Ok(None) => {
            // Table exists but no flag set, create it
            println!("📋 Creating admin realm feature flag...");
            let _ = sqlx::query(
                "INSERT INTO feature_flags (name, enabled, description) VALUES ('ADMIN_REALM_ENFORCED', false, 'Enable separated admin authentication realm') ON CONFLICT (name) DO NOTHING"
            )
            .execute(&pool)
            .await;
            false
        },
        Err(_) => {
            // Table doesn't exist yet, use environment variable
            println!("⚠️  Feature flags table not found, using environment variable");
            false
        }
    };
    
    // Override with environment variable if set
    let admin_realm_enforced = env::var("ADMIN_REALM_ENFORCED")
        .unwrap_or_else(|_| admin_realm_enabled.to_string()) == "true";
    
    if admin_realm_enforced {
        println!("🔐 Admin realm separation is ENABLED");
    } else {
        println!("⚠️  Admin realm separation is DISABLED (using legacy auth)");
    }
    
    // Get IP allowlist from environment
    let admin_ip_allowlist: Vec<String> = env::var("ADMIN_IP_ALLOWLIST")
        .unwrap_or_else(|_| "10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,127.0.0.1/32".to_string())
        .split(',')
        .map(|s| s.trim().to_string())
        .collect();
    
    println!("🌐 Admin IP allowlist: {:?}", admin_ip_allowlist);
    
    let host = config.host.clone();
    let port = config.port;
    
    // Create HTTP server
    println!("🌐 Starting HTTP server on {}:{}...", host, port);
    
    let server = HttpServer::new(move || {
        // Configure CORS
        let cors = Cors::default()
            .allowed_origin_fn(|origin, _req_head| {
                // Allow configured origins
                true // For development - in production, check against config.cors_origins
            })
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"])
            .allowed_headers(vec![
                actix_web::http::header::AUTHORIZATION,
                actix_web::http::header::ACCEPT,
                actix_web::http::header::CONTENT_TYPE,
            ])
            .supports_credentials()
            .max_age(3600);
        
        let mut app = App::new()
            .app_data(web::Data::new(pool.clone()))
            .app_data(web::Data::new(config.clone()))
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .wrap(middleware::NormalizePath::trim())
            
            // Health check endpoints (no auth required)
            .route("/health", web::get().to(health_check))
            .route("/health/readiness", web::get().to(readiness_check));
        
        // Configure admin routes if admin realm is enforced
        if admin_realm_enforced {
            app = app.configure(admin::configure_admin_routes);
        }
        
        // Legacy API v1 routes (existing user auth)
        app = app.service(
            web::scope("/api/v1")
                // Legacy auth endpoints
                .route("/auth/login", web::post().to(legacy_login))
                // Add other existing API routes here
                .configure(api::auth::configure_routes)
        );
        
        app
    })
    .shutdown_timeout(30)
    .bind((host.as_str(), port))?;
    
    println!("✅ HTTP server bound successfully");
    println!("🚀 Server is now running at http://{}:{}", config.host, port);
    println!("📊 Admin panel: http://{}:{}/admin", config.host, port);
    println!("🔒 Admin API: http://{}:{}/admin/api", config.host, port);
    
    // Run server
    match server.run().await {
        Ok(_) => {
            println!("✅ Server shutdown gracefully");
            Ok(())
        }
        Err(e) => {
            eprintln!("❌ Server error: {}", e);
            Err(std::io::Error::new(std::io::ErrorKind::Other, e))
        }
    }
}
