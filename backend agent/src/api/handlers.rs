use crate::agent::AgentManager;
use crate::api::auth::{
    get_claims, require_admin_role, require_operator_role, require_viewer_role,
};
use crate::command::CommandEngine;
use crate::data::models::{ActorInfo, AgentStatus, CommandRecord, CommandStatus};
use crate::telemetry::TelemetryProcessor;
use actix_web::{web, HttpRequest, HttpResponse, Result};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tracing::{debug, error, info, warn};
use uuid::Uuid;

// Request/Response DTOs
#[derive(Debug, Deserialize)]
pub struct CreateCommandRequest {
    pub verb: String,
    pub args: serde_json::Value,
    pub agent_targets: Vec<String>,
    pub timeout: Option<u64>,
    pub max_retries: Option<u32>,
}

#[derive(Debug, Serialize)]
pub struct CreateCommandResponse {
    pub correlation_id: String,
    pub status: String,
}

#[derive(Debug, Serialize)]
pub struct AgentListResponse {
    pub agents: Vec<crate::data::models::AgentInfo>,
    pub total: usize,
}

#[derive(Debug, Serialize)]
pub struct CommandListResponse {
    pub commands: Vec<crate::command::queue::QueuedCommand>,
    pub total: usize,
}

#[derive(Debug, Serialize)]
pub struct StatisticsResponse {
    pub agents: crate::agent::registry::AgentStatistics,
    pub commands: crate::command::engine::CommandEngineStats,
    pub telemetry: crate::telemetry::processor::TelemetryStats,
}

#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: String,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub version: String,
    pub uptime: u64,
}

// Agent Management Handlers
pub async fn list_agents(
    req: HttpRequest,
    agent_manager: web::Data<Arc<AgentManager>>,
) -> Result<HttpResponse> {
    // Check authentication and authorization
    let claims = get_claims(&req)
        .ok_or_else(|| actix_web::error::ErrorUnauthorized("No authentication token"))?;

    require_viewer_role(&claims).map_err(|e| actix_web::error::ErrorForbidden(e.to_string()))?;

    debug!("Listing agents for user: {}", claims.sub);

    match agent_manager.list_agents().await {
        agents => {
            let response = AgentListResponse {
                total: agents.len(),
                agents,
            };
            Ok(HttpResponse::Ok().json(response))
        }
    }
}

pub async fn get_agent(
    req: HttpRequest,
    path: web::Path<String>,
    agent_manager: web::Data<Arc<AgentManager>>,
) -> Result<HttpResponse> {
    let agent_id = path.into_inner();

    // Check authentication and authorization
    let claims = get_claims(&req)
        .ok_or_else(|| actix_web::error::ErrorUnauthorized("No authentication token"))?;

    require_viewer_role(&claims).map_err(|e| actix_web::error::ErrorForbidden(e.to_string()))?;

    debug!("Getting agent {} for user: {}", agent_id, claims.sub);

    match agent_manager.get_agent(&agent_id).await {
        Some(agent) => Ok(HttpResponse::Ok().json(agent)),
        None => Ok(HttpResponse::NotFound().json(serde_json::json!({
            "error": "Agent not found"
        }))),
    }
}

pub async fn get_agents_by_site(
    req: HttpRequest,
    path: web::Path<String>,
    agent_manager: web::Data<Arc<AgentManager>>,
) -> Result<HttpResponse> {
    let site = path.into_inner();

    // Check authentication and authorization
    let claims = get_claims(&req)
        .ok_or_else(|| actix_web::error::ErrorUnauthorized("No authentication token"))?;

    require_viewer_role(&claims).map_err(|e| actix_web::error::ErrorForbidden(e.to_string()))?;

    debug!("Getting agents for site {} for user: {}", site, claims.sub);

    let agents = agent_manager.get_agents_by_site(&site).await;
    let response = AgentListResponse {
        total: agents.len(),
        agents,
    };

    Ok(HttpResponse::Ok().json(response))
}

// Command Management Handlers
pub async fn create_command(
    req: HttpRequest,
    payload: web::Json<CreateCommandRequest>,
    command_engine: web::Data<Arc<CommandEngine>>,
) -> Result<HttpResponse> {
    // Check authentication and authorization
    let claims = get_claims(&req)
        .ok_or_else(|| actix_web::error::ErrorUnauthorized("No authentication token"))?;

    require_operator_role(&claims).map_err(|e| actix_web::error::ErrorForbidden(e.to_string()))?;

    info!(
        "Creating command '{}' for user: {}",
        payload.verb, claims.sub
    );

    // Create command record
    let correlation_id = Uuid::new_v4().to_string();
    let command = CommandRecord {
        id: Uuid::new_v4(),
        correlation_id: correlation_id.clone(),
        verb: payload.verb.clone(),
        args: payload.args.clone(),
        agent_targets: payload.agent_targets.clone(),
        status: CommandStatus::Pending,
        actor: ActorInfo {
            id: claims.sub.clone(),
            role: claims.role.clone(),
            permissions: vec!["view".to_string(), "execute".to_string()],
        },
        priority: crate::data::models::CommandPriority::Normal,
        max_retries: payload.max_retries.unwrap_or(3) as i32,
        retry_count: 0,
        result: None,
        error_message: None,
        created_at: chrono::Utc::now(),
        scheduled_at: None,
        executed_at: None,
        completed_at: None,
    };

    match command_engine.submit_command(command).await {
        Ok(correlation_id) => {
            let response = CreateCommandResponse {
                correlation_id,
                status: "submitted".to_string(),
            };
            Ok(HttpResponse::Created().json(response))
        }
        Err(e) => {
            error!("Failed to create command: {}", e);
            Ok(HttpResponse::BadRequest().json(serde_json::json!({
                "error": e.to_string()
            })))
        }
    }
}

pub async fn get_command(
    req: HttpRequest,
    path: web::Path<String>,
    command_engine: web::Data<Arc<CommandEngine>>,
) -> Result<HttpResponse> {
    let correlation_id = path.into_inner();

    // Check authentication and authorization
    let claims = get_claims(&req)
        .ok_or_else(|| actix_web::error::ErrorUnauthorized("No authentication token"))?;

    require_viewer_role(&claims).map_err(|e| actix_web::error::ErrorForbidden(e.to_string()))?;

    debug!(
        "Getting command {} for user: {}",
        correlation_id, claims.sub
    );

    match command_engine.get_command(&correlation_id).await {
        Some(command) => Ok(HttpResponse::Ok().json(command)),
        None => Ok(HttpResponse::NotFound().json(serde_json::json!({
            "error": "Command not found"
        }))),
    }
}

pub async fn list_commands(
    req: HttpRequest,
    query: web::Query<CommandListQuery>,
    command_engine: web::Data<Arc<CommandEngine>>,
) -> Result<HttpResponse> {
    // Check authentication and authorization
    let claims = get_claims(&req)
        .ok_or_else(|| actix_web::error::ErrorUnauthorized("No authentication token"))?;

    require_viewer_role(&claims).map_err(|e| actix_web::error::ErrorForbidden(e.to_string()))?;

    debug!("Listing commands for user: {}", claims.sub);

    let commands = if let Some(ref status) = query.status {
        match status.parse::<CommandStatus>() {
            Ok(status) => command_engine.get_commands_by_status(&status).await,
            Err(_) => {
                return Ok(HttpResponse::BadRequest().json(serde_json::json!({
                    "error": "Invalid status parameter"
                })));
            }
        }
    } else {
        // Get all commands (this could be expensive - in production, we'd paginate)
        let mut all_commands = Vec::new();
        all_commands.extend(command_engine.get_pending_commands().await);
        all_commands.extend(command_engine.get_executing_commands().await);
        all_commands.extend(command_engine.get_completed_commands().await);
        all_commands.extend(command_engine.get_failed_commands().await);
        all_commands
    };

    let response = CommandListResponse {
        total: commands.len(),
        commands,
    };

    Ok(HttpResponse::Ok().json(response))
}

pub async fn retry_command(
    req: HttpRequest,
    path: web::Path<String>,
    command_engine: web::Data<Arc<CommandEngine>>,
) -> Result<HttpResponse> {
    let correlation_id = path.into_inner();

    // Check authentication and authorization
    let claims = get_claims(&req)
        .ok_or_else(|| actix_web::error::ErrorUnauthorized("No authentication token"))?;

    require_operator_role(&claims).map_err(|e| actix_web::error::ErrorForbidden(e.to_string()))?;

    info!(
        "Retrying command {} for user: {}",
        correlation_id, claims.sub
    );

    match command_engine.retry_command(&correlation_id).await {
        Ok(_) => Ok(HttpResponse::Ok().json(serde_json::json!({
            "status": "retry_initiated"
        }))),
        Err(e) => {
            error!("Failed to retry command {}: {}", correlation_id, e);
            Ok(HttpResponse::BadRequest().json(serde_json::json!({
                "error": e.to_string()
            })))
        }
    }
}

pub async fn cancel_command(
    req: HttpRequest,
    path: web::Path<String>,
    command_engine: web::Data<Arc<CommandEngine>>,
) -> Result<HttpResponse> {
    let correlation_id = path.into_inner();

    // Check authentication and authorization
    let claims = get_claims(&req)
        .ok_or_else(|| actix_web::error::ErrorUnauthorized("No authentication token"))?;

    require_operator_role(&claims).map_err(|e| actix_web::error::ErrorForbidden(e.to_string()))?;

    info!(
        "Cancelling command {} for user: {}",
        correlation_id, claims.sub
    );

    match command_engine.cancel_command(&correlation_id).await {
        Ok(_) => Ok(HttpResponse::Ok().json(serde_json::json!({
            "status": "cancelled"
        }))),
        Err(e) => {
            error!("Failed to cancel command {}: {}", correlation_id, e);
            Ok(HttpResponse::BadRequest().json(serde_json::json!({
                "error": e.to_string()
            })))
        }
    }
}

// Telemetry Handlers
pub async fn get_agent_telemetry(
    req: HttpRequest,
    path: web::Path<String>,
    telemetry_processor: web::Data<Arc<TelemetryProcessor>>,
) -> Result<HttpResponse> {
    let agent_id = path.into_inner();

    // Check authentication and authorization
    let claims = get_claims(&req)
        .ok_or_else(|| actix_web::error::ErrorUnauthorized("No authentication token"))?;

    require_viewer_role(&claims).map_err(|e| actix_web::error::ErrorForbidden(e.to_string()))?;

    debug!(
        "Getting telemetry for agent {} for user: {}",
        agent_id, claims.sub
    );

    match telemetry_processor.get_latest_telemetry(&agent_id).await {
        Ok(Some(telemetry)) => Ok(HttpResponse::Ok().json(telemetry)),
        Ok(None) => Ok(HttpResponse::NotFound().json(serde_json::json!({
            "error": "No telemetry data found"
        }))),
        Err(e) => {
            error!("Failed to get telemetry for agent {}: {}", agent_id, e);
            Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Internal server error"
            })))
        }
    }
}

pub async fn get_agent_telemetry_history(
    req: HttpRequest,
    path: web::Path<String>,
    query: web::Query<TelemetryHistoryQuery>,
    telemetry_processor: web::Data<Arc<TelemetryProcessor>>,
) -> Result<HttpResponse> {
    let agent_id = path.into_inner();

    // Check authentication and authorization
    let claims = get_claims(&req)
        .ok_or_else(|| actix_web::error::ErrorUnauthorized("No authentication token"))?;

    require_viewer_role(&claims).map_err(|e| actix_web::error::ErrorForbidden(e.to_string()))?;

    debug!(
        "Getting telemetry history for agent {} for user: {}",
        agent_id, claims.sub
    );

    match telemetry_processor
        .get_telemetry_history(&agent_id, query.limit)
        .await
    {
        Ok(telemetry_records) => Ok(HttpResponse::Ok().json(telemetry_records)),
        Err(e) => {
            error!(
                "Failed to get telemetry history for agent {}: {}",
                agent_id, e
            );
            Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Internal server error"
            })))
        }
    }
}

// Statistics Handlers
pub async fn get_statistics(
    req: HttpRequest,
    agent_manager: web::Data<Arc<AgentManager>>,
    command_engine: web::Data<Arc<CommandEngine>>,
    telemetry_processor: web::Data<Arc<TelemetryProcessor>>,
) -> Result<HttpResponse> {
    // Check authentication and authorization
    let claims = get_claims(&req)
        .ok_or_else(|| actix_web::error::ErrorUnauthorized("No authentication token"))?;

    require_viewer_role(&claims).map_err(|e| actix_web::error::ErrorForbidden(e.to_string()))?;

    debug!("Getting statistics for user: {}", claims.sub);

    let agent_stats = agent_manager.get_statistics().await;
    let command_stats = command_engine.get_statistics().await;
    let telemetry_stats = telemetry_processor.get_statistics().await;

    let response = StatisticsResponse {
        agents: agent_stats,
        commands: command_stats,
        telemetry: telemetry_stats,
    };

    Ok(HttpResponse::Ok().json(response))
}

// Health Check Handler
pub async fn health_check() -> Result<HttpResponse> {
    let response = HealthResponse {
        status: "healthy".to_string(),
        timestamp: chrono::Utc::now(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        uptime: 0, // TODO: Calculate actual uptime
    };

    Ok(HttpResponse::Ok().json(response))
}

// Admin Handlers
pub async fn update_agent_status(
    req: HttpRequest,
    path: web::Path<(String, String)>,
    agent_manager: web::Data<Arc<AgentManager>>,
) -> Result<HttpResponse> {
    let (agent_id, status_str) = path.into_inner();

    // Check authentication and authorization
    let claims = get_claims(&req)
        .ok_or_else(|| actix_web::error::ErrorUnauthorized("No authentication token"))?;

    require_admin_role(&claims).map_err(|e| actix_web::error::ErrorForbidden(e.to_string()))?;

    info!(
        "Updating agent {} status to {} for user: {}",
        agent_id, status_str, claims.sub
    );

    let status = match status_str.as_str() {
        "online" => AgentStatus::Online,
        "offline" => AgentStatus::Offline,
        _ => {
            return Ok(HttpResponse::BadRequest().json(serde_json::json!({
                "error": "Invalid status. Must be 'online' or 'offline'"
            })));
        }
    };

    match agent_manager.update_agent_status(&agent_id, status).await {
        Ok(_) => Ok(HttpResponse::Ok().json(serde_json::json!({
            "status": "updated"
        }))),
        Err(e) => {
            error!("Failed to update agent status: {}", e);
            Ok(HttpResponse::BadRequest().json(serde_json::json!({
                "error": e.to_string()
            })))
        }
    }
}

// Query parameters
#[derive(Debug, Deserialize)]
pub struct CommandListQuery {
    pub status: Option<String>,
    pub agent_id: Option<String>,
    pub verb: Option<String>,
    pub limit: Option<usize>,
}

#[derive(Debug, Deserialize)]
pub struct TelemetryHistoryQuery {
    pub limit: Option<usize>,
    pub hours: Option<u32>,
}
