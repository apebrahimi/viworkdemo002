use crate::commands::{CommandExecutor, CommandResult};
use crate::error::{AgentError, AgentResult};
use actix_web::{web, HttpRequest, HttpResponse};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use tracing::{error, info, warn};

#[derive(Debug, Deserialize)]
pub struct CommandRequest {
    pub correlation_id: String,
    pub command: String,
    pub parameters: serde_json::Value,
    pub timestamp: DateTime<Utc>,
    pub signature: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct CommandResponse {
    pub correlation_id: String,
    pub status: String,
    pub data: Option<serde_json::Value>,
    pub error: Option<String>,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: String,
    pub timestamp: DateTime<Utc>,
    pub version: String,
    pub uptime: u64,
}

#[derive(Debug, Serialize)]
pub struct StatusResponse {
    pub status: String,
    pub timestamp: DateTime<Utc>,
    pub system_health: serde_json::Value,
    pub services: serde_json::Value,
    pub containers: serde_json::Value,
}

pub async fn execute_command(
    req: HttpRequest,
    payload: web::Json<CommandRequest>,
    executor: web::Data<CommandExecutor>,
    security: web::Data<crate::security::SecurityContext>,
    audit: web::Data<crate::audit::AuditLogger>,
) -> AgentResult<HttpResponse> {
    let start_time = std::time::Instant::now();
    let correlation_id = payload.correlation_id.clone();
    let command = payload.command.clone();

    info!(
        "Executing command: {} (correlation_id: {})",
        command, correlation_id
    );

    // Authenticate request
    security.authenticate_request(&req).await?;

    // Execute command
    let result = executor
        .execute_command(&payload.command, payload.parameters.clone())
        .await;

    // Calculate execution time
    let execution_time = start_time.elapsed().as_millis() as u64;

    // Extract source IP
    let source_ip = req
        .connection_info()
        .peer_addr()
        .unwrap_or("unknown")
        .to_string();

    // Extract username from parameters if available
    let username = payload.parameters.get("username").and_then(|v| v.as_str());

    // Log command execution
    match &result {
        Ok(_) => {
            audit
                .log_command_execution(
                    &correlation_id,
                    &command,
                    username,
                    &source_ip,
                    true,
                    execution_time,
                    None,
                    &payload.parameters,
                )
                .await?;
        }
        Err(e) => {
            audit
                .log_command_execution(
                    &correlation_id,
                    &command,
                    username,
                    &source_ip,
                    false,
                    execution_time,
                    Some(&e.to_string()),
                    &payload.parameters,
                )
                .await?;
        }
    }

    // Build response
    let response = match result {
        Ok(data) => CommandResponse {
            correlation_id: payload.correlation_id.clone(),
            status: "success".to_string(),
            data: Some(data),
            error: None,
            timestamp: Utc::now(),
        },
        Err(e) => CommandResponse {
            correlation_id: payload.correlation_id.clone(),
            status: "error".to_string(),
            data: None,
            error: Some(e.to_string()),
            timestamp: Utc::now(),
        },
    };

    info!(
        "Command execution completed: {} (correlation_id: {}, execution_time: {}ms)",
        command, correlation_id, execution_time
    );

    Ok(HttpResponse::Ok().json(response))
}

pub async fn health_check() -> AgentResult<HttpResponse> {
    let response = HealthResponse {
        status: "healthy".to_string(),
        timestamp: Utc::now(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        uptime: std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs(),
    };

    Ok(HttpResponse::Ok().json(response))
}

pub async fn system_status(
    monitoring: web::Data<crate::monitoring::SystemMonitor>,
) -> AgentResult<HttpResponse> {
    info!("system_status: Starting status request");
    
    info!("system_status: Getting system health...");
    let system_health = match monitoring.get_system_health().await {
        Ok(health) => {
            info!("system_status: System health retrieved successfully");
            health
        }
        Err(e) => {
            error!("system_status: Failed to get system health: {}", e);
            return Err(e);
        }
    };
    
    info!("system_status: Getting service status...");
    let service_status = match monitoring.get_service_status().await {
        Ok(status) => {
            info!("system_status: Service status retrieved successfully");
            status
        }
        Err(e) => {
            error!("system_status: Failed to get service status: {}", e);
            return Err(e);
        }
    };

    info!("system_status: Converting system_health to JSON...");
    let system_health_json = match serde_json::to_value(system_health) {
        Ok(json) => {
            info!("system_status: System health JSON conversion successful");
            json
        }
        Err(e) => {
            error!("system_status: Failed to convert system health to JSON: {}", e);
            return Err(AgentError::InternalError(format!("JSON serialization error: {}", e)));
        }
    };

    info!("system_status: Converting service_status to JSON...");
    let service_status_json = match serde_json::to_value(service_status) {
        Ok(json) => {
            info!("system_status: Service status JSON conversion successful");
            json
        }
        Err(e) => {
            error!("system_status: Failed to convert service status to JSON: {}", e);
            return Err(AgentError::InternalError(format!("JSON serialization error: {}", e)));
        }
    };

    info!("system_status: Creating response object...");
    let response = StatusResponse {
        status: "ok".to_string(),
        timestamp: Utc::now(),
        system_health: system_health_json,
        services: service_status_json,
        containers: serde_json::json!([]), // Empty for now
    };

    info!("system_status: Converting response to JSON...");
    let response_json = match serde_json::to_value(response) {
        Ok(json) => {
            info!("system_status: Response JSON conversion successful");
            json
        }
        Err(e) => {
            error!("system_status: Failed to convert response to JSON: {}", e);
            return Err(AgentError::InternalError(format!("JSON serialization error: {}", e)));
        }
    };

    info!("system_status: Returning successful response");
    Ok(HttpResponse::Ok().json(response_json))
}

pub async fn simple_status() -> AgentResult<HttpResponse> {
    info!("simple_status: Starting simple status request");
    
    let response = StatusResponse {
        status: "ok".to_string(),
        timestamp: Utc::now(),
        system_health: serde_json::json!({
            "cpu_usage_percent": 0.0,
            "memory_usage_percent": 0.0,
            "disk_usage_percent": 0.0,
            "load_average": {
                "one_minute": 0.0,
                "five_minutes": 0.0,
                "fifteen_minutes": 0.0
            },
            "uptime_seconds": std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap_or_default()
                .as_secs(),
            "temperature": null
        }),
        services: serde_json::json!({
            "services": [
                {
                    "name": "viworks-gateway-agent",
                    "status": "running",
                    "pid": null,
                    "memory_usage": null,
                    "cpu_usage": null
                }
            ],
            "timestamp": chrono::Utc::now().to_rfc3339()
        }),
        containers: serde_json::json!([]),
    };

    info!("simple_status: Simple status response created successfully");
    Ok(HttpResponse::Ok().json(response))
}
