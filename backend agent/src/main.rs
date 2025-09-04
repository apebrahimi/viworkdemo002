use actix_web::{App, HttpServer, middleware::Logger, web, HttpResponse};
use actix_cors::Cors;
use clap::Parser;
use tokio::signal;
use tracing::{error, info};

mod config;
mod error;
mod data;
mod agent;
mod command;
mod api;
mod telemetry;

use config::Config;
use data::DataLayer;
use error::BackendAgentResult;
use std::sync::Arc;

#[derive(Parser)]
#[command(name = "viworks-backend-agent")]
#[command(about = "Backend Agent for managing multiple OS agents")]
#[command(version)]
struct Cli {
    /// Configuration file path
    #[arg(short, long, default_value = "config/backend-agent.toml")]
    config: String,

    /// Log level
    #[arg(short, long, default_value = "info")]
    log_level: String,
}

#[actix_web::main]
async fn main() -> BackendAgentResult<()> {
    // Parse command line arguments
    let cli = Cli::parse();

    // Set up logging
    setup_logging(&cli.log_level)?;

    info!("Starting ViWorkS Backend Agent...");
    info!("Version: {}", env!("CARGO_PKG_VERSION"));

    // Load configuration
    let config = load_config(&cli.config)?;
    info!("Configuration loaded successfully");

    // Validate configuration
    if let Err(errors) = config.validate() {
        error!("Configuration validation failed:");
        for error in errors {
            error!("  - {}", error);
        }
        return Err(error::BackendAgentError::Configuration(
            "Configuration validation failed".to_string(),
        ));
    }

    // Initialize data layer
    let data_layer = DataLayer::new(&config).await?;
    info!("Data layer initialized successfully");

    // Initialize database schema
    data_layer.postgres.initialize_schema().await?;
    info!("Database schema initialized successfully");

    // Initialize components
    let agent_manager = agent::AgentManager::new(config.clone(), data_layer.clone()).await?;
    let agent_manager_arc = Arc::new(agent_manager);
    
    let command_engine = command::CommandEngine::new(config.clone(), data_layer.clone(), agent_manager_arc.clone()).await?;
    let command_engine_arc = Arc::new(command_engine);
    
    let telemetry_processor = telemetry::TelemetryProcessor::new(config.clone(), data_layer.clone()).await?;
    let telemetry_processor_arc = Arc::new(telemetry_processor);

    // Start background tasks
    info!("Starting background tasks...");
    
    let agent_bg_task = {
        let agent_manager = agent_manager_arc.clone();
        tokio::spawn(async move {
            if let Err(e) = agent_manager.run_background_tasks().await {
                error!("Agent manager background tasks failed: {}", e);
            }
        })
    };

    let command_bg_task = {
        let command_engine = command_engine_arc.clone();
        tokio::spawn(async move {
            if let Err(e) = command_engine.run_background_tasks().await {
                error!("Command engine background tasks failed: {}", e);
            }
        })
    };

    let telemetry_bg_task = {
        let telemetry_processor = telemetry_processor_arc.clone();
        tokio::spawn(async move {
            if let Err(e) = telemetry_processor.run_background_tasks().await {
                error!("Telemetry processor background tasks failed: {}", e);
            }
        })
    };

    // Clone data layer for the server
    let data_layer_for_server = data_layer.clone();

    // Start HTTP server
    let bind_address = format!("{}:{}", config.server.bind_address, config.server.port);
    info!("Starting HTTP server on {}", bind_address);
    info!("Server config: workers={}, max_connections={}, request_timeout={}", 
          config.server.workers, config.server.max_connections, config.server.request_timeout);

    let server_config = config.server.clone();
    info!("Creating HttpServer with config: {:?}", server_config);
    
    // Create minimal test server first
    info!("Creating minimal test server...");
    let test_server = HttpServer::new(|| {
        info!("Creating minimal App instance");
        App::new()
            .wrap(Logger::default())
            .route("/health", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({"status": "healthy"}))
            }))
    })
    .workers(1)
    .max_connections(100)
    .client_request_timeout(std::time::Duration::from_secs(30))
    .keep_alive(std::time::Duration::from_secs(30))
    .shutdown_timeout(30)
    .disable_signals();
    
    info!("Test server created, attempting to bind to {}", bind_address);
    
    let test_server = test_server.bind(&bind_address)
        .map_err(|e| {
            error!("Failed to bind test server to {}: {}", bind_address, e);
            error::BackendAgentError::Internal(format!("Failed to bind test server: {}", e))
        })?;

    info!("Test server bound successfully to {}", bind_address);
    info!("Test server started successfully");

    // Start the test server with panic handling
    info!("Calling test_server.run()...");
    
    // Set up panic hook to catch any panics
    std::panic::set_hook(Box::new(|panic_info| {
        error!("Test server panic: {:?}", panic_info);
    }));
    
    let test_server_handle = test_server.run();
    info!("Test server handle created, waiting for events...");

    // Wait for shutdown signal or server error
    info!("Starting server and waiting for shutdown signal...");
    
    // Run the server until shutdown signal is received
    let shutdown_future = shutdown_signal();
    
    tokio::select! {
        result = test_server_handle => {
            match result {
                Ok(_) => info!("Server completed successfully"),
                Err(e) => error!("Server error: {}", e),
            }
        }
        _ = shutdown_future => {
            info!("Shutdown signal received");
        }
    }

    info!("Server stopped, starting graceful shutdown...");

    // Graceful shutdown
    info!("Starting graceful shutdown...");

    // Stop background tasks
    agent_bg_task.abort();
    command_bg_task.abort();
    telemetry_bg_task.abort();
    info!("Background tasks stopped");

    // Close data layer
    data_layer.close().await?;
    info!("Data layer closed");

    info!("ViWorkS Backend Agent stopped successfully");
    Ok(())
}

fn setup_logging(log_level: &str) -> BackendAgentResult<()> {
    let env_filter = tracing_subscriber::EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new(format!("viworks_backend_agent={}", log_level)));

    let subscriber = tracing_subscriber::FmtSubscriber::builder()
        .with_env_filter(env_filter)
        .with_file(true)
        .with_line_number(true)
        .with_thread_ids(true)
        .with_thread_names(true)
        .with_target(false)
        .with_ansi(false)
        .json()
        .finish();

    tracing::subscriber::set_global_default(subscriber)
        .map_err(|e| {
            error!("Failed to set global default subscriber: {}", e);
            error::BackendAgentError::Internal(format!("Failed to setup logging: {}", e))
        })?;

    info!("Logging initialized with level: {}", log_level);
    Ok(())
}

fn load_config(config_path: &str) -> BackendAgentResult<Config> {
    std::env::set_var("BACKEND_AGENT_CONFIG", config_path);
    
    Config::load()
        .map_err(|e| {
            error!("Failed to load configuration: {}", e);
            error::BackendAgentError::Configuration(format!("Failed to load config: {}", e))
        })
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("Failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("Failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {
            info!("Ctrl+C received");
        }
        _ = terminate => {
            info!("SIGTERM received");
        }
    }
}
