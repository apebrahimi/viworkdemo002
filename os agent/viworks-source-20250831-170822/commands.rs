use crate::config::Config;
use crate::docker::DockerManager;
use crate::error::{AgentError, AgentResult};
use crate::monitoring::SystemMonitor;
use serde_json::Value;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use tracing::{error, info, warn};

pub type CommandResult = Result<Value, AgentError>;

pub struct CommandExecutor {
    config: Config,
    docker: Arc<DockerManager>,
    monitoring: Arc<SystemMonitor>,
    handlers: HashMap<String, Box<dyn CommandHandler + Send + Sync>>,
}

impl CommandExecutor {
    pub fn new(config: Config, docker: Arc<DockerManager>, monitoring: Arc<SystemMonitor>) -> Self {
        let mut executor = Self {
            config,
            docker,
            monitoring,
            handlers: HashMap::new(),
        };

        // Register command handlers
        executor.register_handler("create_panel_user", Box::new(CreatePanelUserHandler));
        executor.register_handler("create_openvpn_user", Box::new(CreateOpenVpnUserHandler));
        executor.register_handler("delete_user", Box::new(DeleteUserHandler));
        executor.register_handler("list_users", Box::new(ListUsersHandler));
        executor.register_handler("terminate_session", Box::new(TerminateSessionHandler));
        executor.register_handler("get_session_status", Box::new(GetSessionStatusHandler));
        executor.register_handler("spawn_container", Box::new(SpawnContainerHandler));
        executor.register_handler("stop_container", Box::new(StopContainerHandler));
        executor.register_handler("list_containers", Box::new(ListContainersHandler));
        executor.register_handler("get_system_health", Box::new(GetSystemHealthHandler));
        executor.register_handler("get_service_status", Box::new(GetServiceStatusHandler));
        executor.register_handler("generate_bootstrap", Box::new(GenerateBootstrapHandler));
        executor.register_handler("revoke_bootstrap", Box::new(RevokeBootstrapHandler));
        executor.register_handler("get_monitoring_data", Box::new(GetMonitoringDataHandler));

        executor
    }

    fn register_handler(&mut self, command: &str, handler: Box<dyn CommandHandler + Send + Sync>) {
        self.handlers.insert(command.to_string(), handler);
    }

    pub async fn execute_command(&self, command: &str, params: Value) -> CommandResult {
        let handler = self.handlers.get(command).ok_or_else(|| {
            AgentError::InvalidParameters(format!("Unknown command: {}", command))
        })?;

        info!("Executing command: {} with params: {:?}", command, params);
        handler.execute(&params, self).await
    }
}

#[async_trait::async_trait]
pub trait CommandHandler {
    async fn execute(&self, params: &Value, executor: &CommandExecutor) -> CommandResult;
}

pub struct CreatePanelUserHandler;

#[async_trait::async_trait]
impl CommandHandler for CreatePanelUserHandler {
    async fn execute(&self, params: &Value, _executor: &CommandExecutor) -> CommandResult {
        let username = params["username"]
            .as_str()
            .ok_or_else(|| AgentError::InvalidParameters("username is required".to_string()))?;
        let password = params["password"]
            .as_str()
            .ok_or_else(|| AgentError::InvalidParameters("password is required".to_string()))?;

        info!("Creating panel user: {}", username);

        // Execute the script
        let output = tokio::process::Command::new("bash")
            .arg(&_executor.config.scripts.panel_create)
            .arg(username)
            .arg(password)
            .output()
            .await
            .map_err(|e| {
                AgentError::CommandExecutionFailed(format!(
                    "Failed to execute panel user creation script: {}",
                    e
                ))
            })?;

        if !output.status.success() {
            let error_msg = String::from_utf8_lossy(&output.stderr);
            return Err(AgentError::CommandExecutionFailed(format!(
                "Panel user creation failed: {}",
                error_msg
            )));
        }

        let success_msg = String::from_utf8_lossy(&output.stdout);
        info!("Panel user created successfully: {}", success_msg);

        Ok(serde_json::json!({
            "status": "success",
            "message": "Panel user created successfully",
            "username": username,
            "output": success_msg
        }))
    }
}

pub struct CreateOpenVpnUserHandler;

#[async_trait::async_trait]
impl CommandHandler for CreateOpenVpnUserHandler {
    async fn execute(&self, params: &Value, _executor: &CommandExecutor) -> CommandResult {
        let username = params["username"]
            .as_str()
            .ok_or_else(|| AgentError::InvalidParameters("username is required".to_string()))?;
        let userpass = params["userpass"]
            .as_str()
            .ok_or_else(|| AgentError::InvalidParameters("userpass is required".to_string()))?;
        let source_ip = params["source_ip"]
            .as_str()
            .ok_or_else(|| AgentError::InvalidParameters("source_ip is required".to_string()))?;
        let key = params["key"]
            .as_str()
            .ok_or_else(|| AgentError::InvalidParameters("key is required".to_string()))?;
        let hmac_key = params["hmac_key"]
            .as_str()
            .ok_or_else(|| AgentError::InvalidParameters("hmac_key is required".to_string()))?;
        let timeout = params["timeout"]
            .as_u64()
            .ok_or_else(|| AgentError::InvalidParameters("timeout is required".to_string()))?;

        info!("Creating OpenVPN user: {}", username);

        // Execute the script
        let output = tokio::process::Command::new("bash")
            .arg(&_executor.config.scripts.openvpn_create)
            .arg(username)
            .arg(userpass)
            .arg(source_ip)
            .arg(key)
            .arg(hmac_key)
            .arg(timeout.to_string())
            .output()
            .await
            .map_err(|e| {
                AgentError::CommandExecutionFailed(format!(
                    "Failed to execute OpenVPN user creation script: {}",
                    e
                ))
            })?;

        if !output.status.success() {
            let error_msg = String::from_utf8_lossy(&output.stderr);
            return Err(AgentError::CommandExecutionFailed(format!(
                "OpenVPN user creation failed: {}",
                error_msg
            )));
        }

        let success_msg = String::from_utf8_lossy(&output.stdout);
        info!("OpenVPN user created successfully: {}", success_msg);

        Ok(serde_json::json!({
            "status": "success",
            "message": "OpenVPN user created successfully",
            "username": username,
            "output": success_msg
        }))
    }
}

pub struct DeleteUserHandler;

#[async_trait::async_trait]
impl CommandHandler for DeleteUserHandler {
    async fn execute(&self, params: &Value, _executor: &CommandExecutor) -> CommandResult {
        let username = params["username"]
            .as_str()
            .ok_or_else(|| AgentError::InvalidParameters("username is required".to_string()))?;

        info!("Deleting user: {}", username);

        // Delete panel user
        let panel_output = tokio::process::Command::new("bash")
            .arg(&_executor.config.scripts.panel_delete)
            .arg(username)
            .output()
            .await
            .map_err(|e| {
                AgentError::CommandExecutionFailed(format!(
                    "Failed to execute panel user deletion script: {}",
                    e
                ))
            })?;

        // Delete VPN user
        let vpn_output = tokio::process::Command::new("bash")
            .arg(&_executor.config.scripts.openvpn_delete)
            .arg(username)
            .output()
            .await
            .map_err(|e| {
                AgentError::CommandExecutionFailed(format!(
                    "Failed to execute VPN user deletion script: {}",
                    e
                ))
            })?;

        let panel_msg = String::from_utf8_lossy(&panel_output.stdout);
        let vpn_msg = String::from_utf8_lossy(&vpn_output.stdout);
        info!(
            "User deleted successfully - Panel: {}, VPN: {}",
            panel_msg, vpn_msg
        );

        Ok(serde_json::json!({
            "status": "success",
            "message": "User deleted successfully",
            "username": username,
            "panel_output": panel_msg,
            "vpn_output": vpn_msg
        }))
    }
}

pub struct ListUsersHandler;

#[async_trait::async_trait]
impl CommandHandler for ListUsersHandler {
    async fn execute(&self, _params: &Value, _executor: &CommandExecutor) -> CommandResult {
        // Mock implementation - in real scenario, you'd query the actual user database
        let users = vec![
            serde_json::json!({
                "username": "admin",
                "type": "panel",
                "created_at": "2024-01-01T00:00:00Z"
            }),
            serde_json::json!({
                "username": "user1",
                "type": "vpn",
                "created_at": "2024-01-02T00:00:00Z"
            }),
        ];

        Ok(serde_json::json!({
            "status": "success",
            "users": users
        }))
    }
}

pub struct TerminateSessionHandler;

#[async_trait::async_trait]
impl CommandHandler for TerminateSessionHandler {
    async fn execute(&self, params: &Value, executor: &CommandExecutor) -> CommandResult {
        let session_id = params["session_id"]
            .as_str()
            .ok_or_else(|| AgentError::InvalidParameters("session_id is required".to_string()))?;

        info!("Terminating session: {}", session_id);

        // Stop associated container
        executor.docker.stop_container(session_id).await?;

        Ok(serde_json::json!({
            "status": "success",
            "message": "Session terminated successfully",
            "session_id": session_id
        }))
    }
}

pub struct GetSessionStatusHandler;

#[async_trait::async_trait]
impl CommandHandler for GetSessionStatusHandler {
    async fn execute(&self, params: &Value, executor: &CommandExecutor) -> CommandResult {
        let _username = params["username"]
            .as_str()
            .ok_or_else(|| AgentError::InvalidParameters("username is required".to_string()))?;

        // Mock implementation
        Ok(serde_json::json!({
            "status": "success",
            "session_status": "active",
            "container_id": "mock-container-id",
            "uptime": 3600
        }))
    }
}

pub struct SpawnContainerHandler;

#[async_trait::async_trait]
impl CommandHandler for SpawnContainerHandler {
    async fn execute(&self, params: &Value, executor: &CommandExecutor) -> CommandResult {
        let username = params["username"]
            .as_str()
            .ok_or_else(|| AgentError::InvalidParameters("username is required".to_string()))?;
        let session_id = params["session_id"]
            .as_str()
            .ok_or_else(|| AgentError::InvalidParameters("session_id is required".to_string()))?;

        info!(
            "Spawning container for user: {} session: {}",
            username, session_id
        );

        let container_id = executor
            .docker
            .spawn_container(username, session_id)
            .await?;

        Ok(serde_json::json!({
            "status": "success",
            "message": "Container spawned successfully",
            "container_id": container_id,
            "session_id": session_id
        }))
    }
}

pub struct StopContainerHandler;

#[async_trait::async_trait]
impl CommandHandler for StopContainerHandler {
    async fn execute(&self, params: &Value, executor: &CommandExecutor) -> CommandResult {
        let container_id = params["container_id"]
            .as_str()
            .ok_or_else(|| AgentError::InvalidParameters("container_id is required".to_string()))?;

        info!("Stopping container: {}", container_id);

        executor.docker.stop_container(container_id).await?;

        Ok(serde_json::json!({
            "status": "success",
            "message": "Container stopped successfully",
            "container_id": container_id
        }))
    }
}

pub struct ListContainersHandler;

#[async_trait::async_trait]
impl CommandHandler for ListContainersHandler {
    async fn execute(&self, _params: &Value, executor: &CommandExecutor) -> CommandResult {
        let containers = executor.docker.list_containers().await?;

        Ok(serde_json::json!({
            "status": "success",
            "containers": containers
        }))
    }
}

pub struct GetSystemHealthHandler;

#[async_trait::async_trait]
impl CommandHandler for GetSystemHealthHandler {
    async fn execute(&self, _params: &Value, executor: &CommandExecutor) -> CommandResult {
        let health = executor.monitoring.get_system_health().await?;

        Ok(serde_json::json!({
            "status": "success",
            "health": health
        }))
    }
}

pub struct GetServiceStatusHandler;

#[async_trait::async_trait]
impl CommandHandler for GetServiceStatusHandler {
    async fn execute(&self, _params: &Value, executor: &CommandExecutor) -> CommandResult {
        let services = executor.monitoring.get_service_status().await?;

        Ok(serde_json::json!({
            "status": "success",
            "services": services
        }))
    }
}

pub struct GenerateBootstrapHandler;

#[async_trait::async_trait]
impl CommandHandler for GenerateBootstrapHandler {
    async fn execute(&self, params: &Value, _executor: &CommandExecutor) -> CommandResult {
        let username = params["username"]
            .as_str()
            .ok_or_else(|| AgentError::InvalidParameters("username is required".to_string()))?;
        let _session_id = params["session_id"]
            .as_str()
            .ok_or_else(|| AgentError::InvalidParameters("session_id is required".to_string()))?;
        let ttl_seconds = params["ttl_seconds"]
            .as_u64()
            .ok_or_else(|| AgentError::InvalidParameters("ttl_seconds is required".to_string()))?;

        // Generate bootstrap credentials
        let bootstrap_token = uuid::Uuid::new_v4().to_string();
        let expires_at = chrono::Utc::now() + chrono::Duration::seconds(ttl_seconds as i64);

        Ok(serde_json::json!({
            "status": "success",
            "bootstrap_token": bootstrap_token,
            "username": username,
            "expires_at": expires_at.to_rfc3339(),
            "ttl_seconds": ttl_seconds
        }))
    }
}

pub struct RevokeBootstrapHandler;

#[async_trait::async_trait]
impl CommandHandler for RevokeBootstrapHandler {
    async fn execute(&self, params: &Value, _executor: &CommandExecutor) -> CommandResult {
        let bootstrap_token = params["bootstrap_token"].as_str().ok_or_else(|| {
            AgentError::InvalidParameters("bootstrap_token is required".to_string())
        })?;

        info!("Revoking bootstrap token: {}", bootstrap_token);

        // In a real implementation, you'd invalidate the token in your storage
        Ok(serde_json::json!({
            "status": "success",
            "message": "Bootstrap token revoked successfully",
            "bootstrap_token": bootstrap_token
        }))
    }
}

pub struct GetMonitoringDataHandler;

#[async_trait::async_trait]
impl CommandHandler for GetMonitoringDataHandler {
    async fn execute(&self, _params: &Value, executor: &CommandExecutor) -> CommandResult {
        let system_health = executor.monitoring.get_system_health().await?;
        let service_status = executor.monitoring.get_service_status().await?;
        let containers = executor.docker.list_containers().await?;

        let agent_status = serde_json::json!({
            "version": env!("CARGO_PKG_VERSION"),
            "uptime": 3600, // Mock uptime
            "status": "healthy"
        });

        let gateway_info = serde_json::json!({
            "hostname": hostname::get()
                .map(|h| h.to_string_lossy().to_string())
                .unwrap_or_else(|_| "unknown".to_string()),
            "ip_address": "127.0.0.1", // Mock IP
            "os": "Linux",
            "kernel": "5.15.0"
        });

        Ok(serde_json::json!({
            "timestamp": chrono::Utc::now().to_rfc3339(),
            "agent_status": agent_status,
            "system_health": system_health,
            "service_status": service_status,
            "containers": containers,
            "gateway_info": gateway_info
        }))
    }
}
