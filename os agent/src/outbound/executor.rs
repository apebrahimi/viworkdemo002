use crate::config::Config;
use crate::error::{AgentError, AgentResult};
use serde_json::Value;
use std::sync::Arc;
use tokio::sync::Semaphore;
use tokio::time::{timeout, Duration};
use tracing::{error, info};

#[derive(Debug)]
pub struct CommandExecutor {
    config: Config,
    concurrency_semaphore: Arc<Semaphore>,
}

impl CommandExecutor {
    pub fn new(config: Config) -> Self {
        let max_concurrency = config.outbound.max_concurrency;
        Self {
            config,
            concurrency_semaphore: Arc::new(Semaphore::new(max_concurrency)),
        }
    }

    pub async fn execute_command(&self, verb: &str, args: Value) -> AgentResult<Value> {
        // Acquire concurrency permit
        let _permit = self.concurrency_semaphore.acquire().await
            .map_err(|e| AgentError::InternalError(format!("Failed to acquire concurrency permit: {}", e)))?;

        // Validate verb and args schema
        self.validate_command_schema(verb, &args)?;

        // Execute command with timeout
        let timeout_duration = Duration::from_secs(self.config.outbound.cmd_timeout_secs);
        let result = timeout(timeout_duration, self.execute_command_internal(verb, args)).await;

        match result {
            Ok(result) => result,
            Err(_) => {
                error!("Command execution timed out after {} seconds", self.config.outbound.cmd_timeout_secs);
                Err(AgentError::CommandExecutionFailed("Command execution timed out".to_string()))
            }
        }
    }

    async fn execute_command_internal(&self, verb: &str, args: Value) -> AgentResult<Value> {
        match verb {
            "create_panel_user" => self.create_panel_user(&args).await,
            "create_openvpn_user" => self.create_openvpn_user(&args).await,
            "delete_user" => self.delete_user(&args).await,
            "list_users" => self.list_users(&args).await,
            "terminate_session" => self.terminate_session(&args).await,
            "get_session_status" => self.get_session_status(&args).await,
            "spawn_container" => self.spawn_container(&args).await,
            "stop_container" => self.stop_container(&args).await,
            "list_containers" => self.list_containers(&args).await,
            "get_system_health" => self.get_system_health(&args).await,
            "get_service_status" => self.get_service_status(&args).await,
            "generate_bootstrap" => self.generate_bootstrap(&args).await,
            "revoke_bootstrap" => self.revoke_bootstrap(&args).await,
            "get_monitoring_data" => self.get_monitoring_data(&args).await,
            _ => Err(AgentError::InvalidParameters(format!("Unknown verb: {}", verb))),
        }
    }

    fn validate_command_schema(&self, verb: &str, args: &Value) -> AgentResult<()> {
        match verb {
            "create_panel_user" => self.validate_create_panel_user_schema(args),
            "create_openvpn_user" => self.validate_create_openvpn_user_schema(args),
            "delete_user" => self.validate_delete_user_schema(args),
            "list_users" => self.validate_list_users_schema(args),
            "terminate_session" => self.validate_terminate_session_schema(args),
            "get_session_status" => self.validate_get_session_status_schema(args),
            "spawn_container" => self.validate_spawn_container_schema(args),
            "stop_container" => self.validate_stop_container_schema(args),
            "list_containers" => self.validate_list_containers_schema(args),
            "get_system_health" => self.validate_get_system_health_schema(args),
            "get_service_status" => self.validate_get_service_status_schema(args),
            "generate_bootstrap" => self.validate_generate_bootstrap_schema(args),
            "revoke_bootstrap" => self.validate_revoke_bootstrap_schema(args),
            "get_monitoring_data" => self.validate_get_monitoring_data_schema(args),
            _ => Err(AgentError::InvalidParameters(format!("Unknown verb: {}", verb))),
        }
    }

    // Schema validation functions
    fn validate_create_panel_user_schema(&self, args: &Value) -> AgentResult<()> {
        let username = args.get("username")
            .and_then(|v| v.as_str())
            .ok_or_else(|| AgentError::InvalidParameters("username is required".to_string()))?;
        
        let password = args.get("password")
            .and_then(|v| v.as_str())
            .ok_or_else(|| AgentError::InvalidParameters("password is required".to_string()))?;

        // Validate username format (3-64 chars, alphanumeric + underscore + hyphen)
        if username.len() < 3 || username.len() > 64 {
            return Err(AgentError::InvalidParameters("username must be 3-64 characters".to_string()));
        }

        if !username.chars().all(|c| c.is_alphanumeric() || c == '_' || c == '-') {
            return Err(AgentError::InvalidParameters("username contains invalid characters".to_string()));
        }

        // Validate password length (8-128 chars)
        if password.len() < 8 || password.len() > 128 {
            return Err(AgentError::InvalidParameters("password must be 8-128 characters".to_string()));
        }

        // Check for extra keys
        let allowed_keys = ["username", "password"];
        for key in args.as_object().unwrap().keys() {
            if !allowed_keys.contains(&key.as_str()) {
                return Err(AgentError::InvalidParameters(format!("Unexpected key: {}", key)));
            }
        }

        Ok(())
    }

    fn validate_create_openvpn_user_schema(&self, args: &Value) -> AgentResult<()> {
        let required_fields = ["username", "userpass", "source_ip", "key", "hmac_key", "timeout"];
        
        for field in &required_fields {
            if !args.get(field).is_some() {
                return Err(AgentError::InvalidParameters(format!("{} is required", field)));
            }
        }

        let timeout = args.get("timeout")
            .and_then(|v| v.as_u64())
            .ok_or_else(|| AgentError::InvalidParameters("timeout must be a number".to_string()))?;

        if timeout < 60 || timeout > 86400 {
            return Err(AgentError::InvalidParameters("timeout must be between 60 and 86400 seconds".to_string()));
        }

        // Check for extra keys
        for key in args.as_object().unwrap().keys() {
            if !required_fields.contains(&key.as_str()) {
                return Err(AgentError::InvalidParameters(format!("Unexpected key: {}", key)));
            }
        }

        Ok(())
    }

    fn validate_delete_user_schema(&self, args: &Value) -> AgentResult<()> {
        if !args.get("username").is_some() {
            return Err(AgentError::InvalidParameters("username is required".to_string()));
        }

        // Check for extra keys
        let allowed_keys = ["username"];
        for key in args.as_object().unwrap().keys() {
            if !allowed_keys.contains(&key.as_str()) {
                return Err(AgentError::InvalidParameters(format!("Unexpected key: {}", key)));
            }
        }

        Ok(())
    }

    fn validate_list_users_schema(&self, args: &Value) -> AgentResult<()> {
        // No arguments required
        if !args.as_object().unwrap().is_empty() {
            return Err(AgentError::InvalidParameters("list_users takes no arguments".to_string()));
        }
        Ok(())
    }

    fn validate_terminate_session_schema(&self, args: &Value) -> AgentResult<()> {
        if !args.get("session_id").is_some() {
            return Err(AgentError::InvalidParameters("session_id is required".to_string()));
        }

        // Check for extra keys
        let allowed_keys = ["session_id"];
        for key in args.as_object().unwrap().keys() {
            if !allowed_keys.contains(&key.as_str()) {
                return Err(AgentError::InvalidParameters(format!("Unexpected key: {}", key)));
            }
        }

        Ok(())
    }

    fn validate_get_session_status_schema(&self, args: &Value) -> AgentResult<()> {
        if !args.get("username").is_some() {
            return Err(AgentError::InvalidParameters("username is required".to_string()));
        }

        // Check for extra keys
        let allowed_keys = ["username"];
        for key in args.as_object().unwrap().keys() {
            if !allowed_keys.contains(&key.as_str()) {
                return Err(AgentError::InvalidParameters(format!("Unexpected key: {}", key)));
            }
        }

        Ok(())
    }

    fn validate_spawn_container_schema(&self, args: &Value) -> AgentResult<()> {
        let required_fields = ["username", "session_id"];
        
        for field in &required_fields {
            if !args.get(field).is_some() {
                return Err(AgentError::InvalidParameters(format!("{} is required", field)));
            }
        }

        // Check for extra keys
        for key in args.as_object().unwrap().keys() {
            if !required_fields.contains(&key.as_str()) {
                return Err(AgentError::InvalidParameters(format!("Unexpected key: {}", key)));
            }
        }

        Ok(())
    }

    fn validate_stop_container_schema(&self, args: &Value) -> AgentResult<()> {
        if !args.get("container_id").is_some() {
            return Err(AgentError::InvalidParameters("container_id is required".to_string()));
        }

        // Check for extra keys
        let allowed_keys = ["container_id"];
        for key in args.as_object().unwrap().keys() {
            if !allowed_keys.contains(&key.as_str()) {
                return Err(AgentError::InvalidParameters(format!("Unexpected key: {}", key)));
            }
        }

        Ok(())
    }

    fn validate_list_containers_schema(&self, args: &Value) -> AgentResult<()> {
        // No arguments required
        if !args.as_object().unwrap().is_empty() {
            return Err(AgentError::InvalidParameters("list_containers takes no arguments".to_string()));
        }
        Ok(())
    }

    fn validate_get_system_health_schema(&self, args: &Value) -> AgentResult<()> {
        // No arguments required
        if !args.as_object().unwrap().is_empty() {
            return Err(AgentError::InvalidParameters("get_system_health takes no arguments".to_string()));
        }
        Ok(())
    }

    fn validate_get_service_status_schema(&self, args: &Value) -> AgentResult<()> {
        // No arguments required
        if !args.as_object().unwrap().is_empty() {
            return Err(AgentError::InvalidParameters("get_service_status takes no arguments".to_string()));
        }
        Ok(())
    }

    fn validate_generate_bootstrap_schema(&self, args: &Value) -> AgentResult<()> {
        let required_fields = ["username", "session_id", "ttl_seconds"];
        
        for field in &required_fields {
            if !args.get(field).is_some() {
                return Err(AgentError::InvalidParameters(format!("{} is required", field)));
            }
        }

        let ttl_seconds = args.get("ttl_seconds")
            .and_then(|v| v.as_u64())
            .ok_or_else(|| AgentError::InvalidParameters("ttl_seconds must be a number".to_string()))?;

        if ttl_seconds == 0 {
            return Err(AgentError::InvalidParameters("ttl_seconds must be greater than 0".to_string()));
        }

        // Check for extra keys
        for key in args.as_object().unwrap().keys() {
            if !required_fields.contains(&key.as_str()) {
                return Err(AgentError::InvalidParameters(format!("Unexpected key: {}", key)));
            }
        }

        Ok(())
    }

    fn validate_revoke_bootstrap_schema(&self, args: &Value) -> AgentResult<()> {
        if !args.get("bootstrap_token").is_some() {
            return Err(AgentError::InvalidParameters("bootstrap_token is required".to_string()));
        }

        // Check for extra keys
        let allowed_keys = ["bootstrap_token"];
        for key in args.as_object().unwrap().keys() {
            if !allowed_keys.contains(&key.as_str()) {
                return Err(AgentError::InvalidParameters(format!("Unexpected key: {}", key)));
            }
        }

        Ok(())
    }

    fn validate_get_monitoring_data_schema(&self, args: &Value) -> AgentResult<()> {
        // No arguments required
        if !args.as_object().unwrap().is_empty() {
            return Err(AgentError::InvalidParameters("get_monitoring_data takes no arguments".to_string()));
        }
        Ok(())
    }

    // Command execution functions (stub implementations for now)
    async fn create_panel_user(&self, args: &Value) -> AgentResult<Value> {
        let username = args["username"].as_str().unwrap();
        let password = args["password"].as_str().unwrap();

        info!("Creating panel user: {}", username);

        // Execute the script with sandboxed environment
        let script_path = format!("{}/add_user.sh", self.config.outbound.scripts_root);
        
        let output = tokio::process::Command::new("bash")
            .arg(&script_path)
            .arg(username)
            .arg(password)
            .env_clear()
            .env("PATH", "/usr/bin:/bin")
            .env("LC_ALL", "C")
            .output()
            .await
            .map_err(|e| AgentError::CommandExecutionFailed(format!("Failed to execute script: {}", e)))?;

        if !output.status.success() {
            let error_msg = String::from_utf8_lossy(&output.stderr);
            return Err(AgentError::CommandExecutionFailed(format!("Script failed: {}", error_msg)));
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

    async fn create_openvpn_user(&self, args: &Value) -> AgentResult<Value> {
        let username = args["username"].as_str().unwrap();
        let userpass = args["userpass"].as_str().unwrap();
        let source_ip = args["source_ip"].as_str().unwrap();
        let key = args["key"].as_str().unwrap();
        let hmac_key = args["hmac_key"].as_str().unwrap();
        let timeout = args["timeout"].as_u64().unwrap();

        info!("Creating OpenVPN user: {}", username);

        let script_path = format!("{}/add_vpn_user.sh", self.config.outbound.scripts_root);
        
        let output = tokio::process::Command::new("bash")
            .arg(&script_path)
            .arg(username)
            .arg(userpass)
            .arg(source_ip)
            .arg(key)
            .arg(hmac_key)
            .arg(timeout.to_string())
            .env_clear()
            .env("PATH", "/usr/bin:/bin")
            .env("LC_ALL", "C")
            .output()
            .await
            .map_err(|e| AgentError::CommandExecutionFailed(format!("Failed to execute script: {}", e)))?;

        if !output.status.success() {
            let error_msg = String::from_utf8_lossy(&output.stderr);
            return Err(AgentError::CommandExecutionFailed(format!("Script failed: {}", error_msg)));
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

    async fn delete_user(&self, args: &Value) -> AgentResult<Value> {
        let username = args["username"].as_str().unwrap();
        info!("Deleting user: {}", username);

        // Delete panel user
        let panel_script = format!("{}/delete_user.sh", self.config.outbound.scripts_root);
        let panel_output = tokio::process::Command::new("bash")
            .arg(&panel_script)
            .arg(username)
            .env_clear()
            .env("PATH", "/usr/bin:/bin")
            .env("LC_ALL", "C")
            .output()
            .await
            .map_err(|e| AgentError::CommandExecutionFailed(format!("Failed to execute panel deletion script: {}", e)))?;

        // Delete VPN user
        let vpn_script = format!("{}/delete_vpn_user.sh", self.config.outbound.scripts_root);
        let vpn_output = tokio::process::Command::new("bash")
            .arg(&vpn_script)
            .arg(username)
            .env_clear()
            .env("PATH", "/usr/bin:/bin")
            .env("LC_ALL", "C")
            .output()
            .await
            .map_err(|e| AgentError::CommandExecutionFailed(format!("Failed to execute VPN deletion script: {}", e)))?;

        let panel_msg = String::from_utf8_lossy(&panel_output.stdout);
        let vpn_msg = String::from_utf8_lossy(&vpn_output.stdout);
        
        info!("User deleted successfully - Panel: {}, VPN: {}", panel_msg, vpn_msg);

        Ok(serde_json::json!({
            "status": "success",
            "message": "User deleted successfully",
            "username": username,
            "panel_output": panel_msg,
            "vpn_output": vpn_msg
        }))
    }

    async fn list_users(&self, _args: &Value) -> AgentResult<Value> {
        // Mock implementation for now
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

    async fn terminate_session(&self, args: &Value) -> AgentResult<Value> {
        let session_id = args["session_id"].as_str().unwrap();
        info!("Terminating session: {}", session_id);

        // Mock implementation - in real scenario, this would stop containers
        Ok(serde_json::json!({
            "status": "success",
            "message": "Session terminated successfully",
            "session_id": session_id
        }))
    }

    async fn get_session_status(&self, args: &Value) -> AgentResult<Value> {
        let _username = args["username"].as_str().unwrap();
        
        // Mock implementation
        Ok(serde_json::json!({
            "status": "success",
            "session_status": "active",
            "container_id": "mock-container-id",
            "uptime": 3600
        }))
    }

    async fn spawn_container(&self, args: &Value) -> AgentResult<Value> {
        let username = args["username"].as_str().unwrap();
        let session_id = args["session_id"].as_str().unwrap();

        info!("Spawning container for user: {} session: {}", username, session_id);

        // Mock implementation - in real scenario, this would spawn Docker containers
        let container_id = format!("container-{}-{}", username, session_id);

        Ok(serde_json::json!({
            "status": "success",
            "message": "Container spawned successfully",
            "container_id": container_id,
            "session_id": session_id
        }))
    }

    async fn stop_container(&self, args: &Value) -> AgentResult<Value> {
        let container_id = args["container_id"].as_str().unwrap();
        info!("Stopping container: {}", container_id);

        // Mock implementation - in real scenario, this would stop Docker containers
        Ok(serde_json::json!({
            "status": "success",
            "message": "Container stopped successfully",
            "container_id": container_id
        }))
    }

    async fn list_containers(&self, _args: &Value) -> AgentResult<Value> {
        // Mock implementation - in real scenario, this would list Docker containers
        let containers = vec![
            serde_json::json!({
                "id": "container-1",
                "name": "viworks-user1-session1",
                "status": "running",
                "username": "user1",
                "session_id": "session1",
                "port": 8001,
                "created_at": "2024-01-01T00:00:00Z"
            })
        ];

        Ok(serde_json::json!({
            "status": "success",
            "containers": containers
        }))
    }

    async fn get_system_health(&self, _args: &Value) -> AgentResult<Value> {
        // Mock implementation - in real scenario, this would get from SystemMonitor
        Ok(serde_json::json!({
            "status": "success",
            "health": {
                "cpu_usage_percent": 0.0,
                "memory_usage_percent": 0.0,
                "disk_usage_percent": 0.0,
                "load_average": {
                    "one_minute": 0.0,
                    "five_minutes": 0.0,
                    "fifteen_minutes": 0.0
                },
                "uptime_seconds": 0,
                "temperature": null
            }
        }))
    }

    async fn get_service_status(&self, _args: &Value) -> AgentResult<Value> {
        // Mock implementation - in real scenario, this would get from SystemMonitor
        Ok(serde_json::json!({
            "status": "success",
            "services": {
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
            }
        }))
    }

    async fn generate_bootstrap(&self, args: &Value) -> AgentResult<Value> {
        let username = args["username"].as_str().unwrap();
        let _session_id = args["session_id"].as_str().unwrap();
        let ttl_seconds = args["ttl_seconds"].as_u64().unwrap();

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

    async fn revoke_bootstrap(&self, args: &Value) -> AgentResult<Value> {
        let bootstrap_token = args["bootstrap_token"].as_str().unwrap();
        info!("Revoking bootstrap token: {}", bootstrap_token);

        // Mock implementation - in real scenario, this would invalidate the token
        Ok(serde_json::json!({
            "status": "success",
            "message": "Bootstrap token revoked successfully",
            "bootstrap_token": bootstrap_token
        }))
    }

    async fn get_monitoring_data(&self, _args: &Value) -> AgentResult<Value> {
        // Mock implementation - in real scenario, this would get comprehensive monitoring data
        let agent_status = serde_json::json!({
            "version": env!("CARGO_PKG_VERSION"),
            "uptime": 3600,
            "status": "healthy"
        });

        let gateway_info = serde_json::json!({
            "hostname": hostname::get()
                .map(|h| h.to_string_lossy().to_string())
                .unwrap_or_else(|_| "unknown".to_string()),
            "ip_address": "127.0.0.1",
            "os": "Linux",
            "kernel": "5.15.0"
        });

        Ok(serde_json::json!({
            "timestamp": chrono::Utc::now().to_rfc3339(),
            "agent_status": agent_status,
            "system_health": {
                "cpu_usage_percent": 0.0,
                "memory_usage_percent": 0.0,
                "disk_usage_percent": 0.0,
                "load_average": {
                    "one_minute": 0.0,
                    "five_minutes": 0.0,
                    "fifteen_minutes": 0.0
                },
                "uptime_seconds": 0,
                "temperature": null
            },
            "service_status": {
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
            },
            "containers": [],
            "gateway_info": gateway_info
        }))
    }
}
