use actix_web::{App, HttpServer, middleware::Logger, web, HttpResponse};
use actix_cors::Cors;
use tracing::{info, error, warn};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use std::time::Duration;
use tokio::time::sleep;

mod config;
mod database;
mod auth;
mod api;
mod models;
mod services;
mod middleware;
mod utils;

use config::AppConfig;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("🚀 Starting ViWorkS Admin Panel Backend");

    // Load configuration
    let config = match AppConfig::load() {
        Ok(config) => {
            info!("✅ Configuration loaded successfully");
            config
        }
        Err(e) => {
            error!("❌ Failed to load configuration: {}", e);
            std::process::exit(1);
        }
    };

    // Initialize database connection with retry logic
    let db_pool = loop {
        match database::init_database(&config.database_url).await {
            Ok(pool) => {
                info!("✅ Database connection established");
                break pool;
            }
            Err(e) => {
                warn!("⚠️ Failed to connect to database: {}. Retrying in 5 seconds...", e);
                sleep(Duration::from_secs(5)).await;
            }
        }
    };

    // Initialize Redis connection with retry logic
    let redis_pool = loop {
        match database::init_redis(&config.redis_url).await {
            Ok(pool) => {
                info!("✅ Redis connection established");
                break pool;
            }
            Err(e) => {
                warn!("⚠️ Failed to connect to Redis: {}. Retrying in 5 seconds...", e);
                sleep(Duration::from_secs(5)).await;
            }
        }
    };

    let host = config.host.clone();
    let port = config.port;
    
    info!("🌐 Starting HTTP server on {}:{}", host, port);

    // Start HTTP server
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(db_pool.clone()))
            .app_data(web::Data::new(redis_pool.clone()))
            .app_data(web::Data::new(config.clone()))
            .wrap(Logger::default())
            .wrap(Cors::default()
                .allow_any_origin()
                .allow_any_method()
                .allow_any_header()
                .max_age(3600))
            .service(
                web::scope("/api")
                    .configure(api::configure_routes)
            )
            .service(
                web::scope("/health")
                    .route("", web::get().to(|| async { HttpResponse::Ok().json(serde_json::json!({
                        "status": "ok",
                        "service": "ViWorkS Admin Panel Backend"
                    })) }))
            )
    })
    .bind((host, port))?
    .run()
    .await
}
