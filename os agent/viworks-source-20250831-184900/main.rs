use actix_cors::Cors;
use actix_web::{middleware::Logger, web, App, HttpServer};
use std::sync::Arc;
use tracing::{error, info};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod api;
mod audit;
mod commands;
mod config;
mod docker;
mod error;
mod monitoring;
mod security;

use api::{execute_command, health_check, system_status, simple_status};
use audit::AuditLogger;
use commands::CommandExecutor;
use config::Config;
use docker::DockerManager;
use monitoring::SystemMonitor;
use security::SecurityContext;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("Starting ViWorkS Gateway Agent...");

    // Load configuration
    let config = match Config::load() {
        Ok(config) => {
            info!("Configuration loaded successfully");
            config
        }
        Err(e) => {
            error!("Failed to load configuration: {}", e);
            return Err(std::io::Error::other(e));
        }
    };

    // Initialize components
    info!("main: Initializing security context...");
    let security_context = Arc::new(SecurityContext::new(config.clone()));
    info!("main: Security context initialized");

    info!("main: Initializing system monitor...");
    let system_monitor = SystemMonitor::new(config.clone());
    info!("main: System monitor initialized");

    info!("main: Initializing Docker manager...");
    let docker_manager = Arc::new(
        DockerManager::new(config.clone())
            .await
            .unwrap_or_else(|e| {
                error!("Failed to initialize Docker manager: {}", e);
                std::process::exit(1);
            }),
    );
    info!("main: Docker manager initialized");

    info!("main: Initializing audit logger...");
    let audit_logger = Arc::new(AuditLogger::new(config.clone()));
    info!("main: Audit logger initialized");

    info!("main: Initializing command executor...");
    let command_executor = Arc::new(CommandExecutor::new(
        config.clone(),
        docker_manager.clone(),
        Arc::new(system_monitor.clone()),
    ));
    info!("main: Command executor initialized");

    info!("main: Starting HTTP server on {}", config.agent.bind_address);

    // Start HTTP server
    HttpServer::new(move || {
        info!("main: Creating new App instance");
        
        // Configure CORS inside the closure
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        info!("main: Setting up application data...");
        let app = App::new()
            .wrap(Logger::default())
            .wrap(cors)
            .app_data(web::Data::new(command_executor.clone()))
            .app_data(web::Data::new(audit_logger.clone()))
            .app_data(web::Data::new(system_monitor.clone()))
            .app_data(web::Data::new(security_context.clone()));
        
        info!("main: Setting up routes...");
        let app = app
            .route("/api/v1/health", web::get().to(health_check))
            .route("/api/v1/status", web::get().to(system_status))
            .route("/api/v1/status-simple", web::get().to(simple_status))
            .route("/api/v1/command", web::post().to(execute_command));
        
        info!("main: App instance created successfully");
        app
    })
    .bind(&config.agent.bind_address)?
    .run()
    .await
}
