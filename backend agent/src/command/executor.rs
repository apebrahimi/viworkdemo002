use crate::data::models::{CommandPriority, CommandRecord, CommandResult, CommandStatus};
use crate::error::BackendAgentResult;
use serde_json::Value;
use std::collections::HashMap;
use tracing::{debug, error, info, warn};

#[derive(Debug)]
pub struct CommandExecutor {
    max_concurrent_commands: usize,
    command_timeout: u64,
}

impl CommandExecutor {
    pub fn new(max_concurrent_commands: usize, command_timeout: u64) -> Self {
        Self {
            max_concurrent_commands,
            command_timeout,
        }
    }

    /// Validate a command before execution
    pub async fn validate_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
        info!(
            "Validating command: {} ({})",
            command.correlation_id, command.verb
        );

        // Basic validation
        if command.verb.is_empty() {
            return Err(crate::error::BackendAgentError::Validation(
                "Command verb cannot be empty".to_string(),
            ));
        }

        if command.agent_targets.is_empty() {
            return Err(crate::error::BackendAgentError::Validation(
                "Command must target at least one agent".to_string(),
            ));
        }

        // Validate command schema based on verb
        self.validate_command_schema(command).await?;

        // Validate actor information
        if command.actor.id.is_empty() {
            return Err(crate::error::BackendAgentError::Validation(
                "Actor ID cannot be empty".to_string(),
            ));
        }

        info!("Command {} validation successful", command.correlation_id);
        Ok(())
    }

    /// Validate command schema based on verb
    async fn validate_command_schema(&self, command: &CommandRecord) -> BackendAgentResult<()> {
        match command.verb.as_str() {
            "exec" => self.validate_exec_command(command).await,
            "docker_ps" => self.validate_docker_ps_command(command).await,
            "docker_inspect" => self.validate_docker_inspect_command(command).await,
            "docker_logs" => self.validate_docker_logs_command(command).await,
            "docker_stats" => self.validate_docker_stats_command(command).await,
            "docker_top" => self.validate_docker_top_command(command).await,
            "docker_exec" => self.validate_docker_exec_command(command).await,
            "docker_run" => self.validate_docker_run_command(command).await,
            "docker_stop" => self.validate_docker_stop_command(command).await,
            "docker_rm" => self.validate_docker_rm_command(command).await,
            "docker_pull" => self.validate_docker_pull_command(command).await,
            "docker_build" => self.validate_docker_build_command(command).await,
            "docker_compose_up" => self.validate_docker_compose_up_command(command).await,
            "docker_compose_down" => self.validate_docker_compose_down_command(command).await,
            "docker_compose_ps" => self.validate_docker_compose_ps_command(command).await,
            "docker_compose_logs" => self.validate_docker_compose_logs_command(command).await,
            _ => Err(crate::error::BackendAgentError::Validation(format!(
                "Unknown command verb: {}",
                command.verb
            ))),
        }
    }

    /// Validate exec command
    async fn validate_exec_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
        let args = &command.args;

        if let Some(cmd) = args.get("command") {
            if !cmd.is_string() || cmd.as_str().unwrap().is_empty() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Exec command must have a non-empty 'command' string".to_string(),
                ));
            }
        } else {
            return Err(crate::error::BackendAgentError::Validation(
                "Exec command must have a 'command' argument".to_string(),
            ));
        }

        Ok(())
    }

    /// Validate docker_ps command
    async fn validate_docker_ps_command(&self, _command: &CommandRecord) -> BackendAgentResult<()> {
        // docker_ps doesn't require additional arguments
        Ok(())
    }

    /// Validate docker_inspect command
    async fn validate_docker_inspect_command(
        &self,
        command: &CommandRecord,
    ) -> BackendAgentResult<()> {
        let args = &command.args;

        if let Some(container_id) = args.get("container_id") {
            if !container_id.is_string() || container_id.as_str().unwrap().is_empty() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker inspect command must have a non-empty 'container_id' string"
                        .to_string(),
                ));
            }
        } else {
            return Err(crate::error::BackendAgentError::Validation(
                "Docker inspect command must have a 'container_id' argument".to_string(),
            ));
        }

        Ok(())
    }

    /// Validate docker_logs command
    async fn validate_docker_logs_command(
        &self,
        command: &CommandRecord,
    ) -> BackendAgentResult<()> {
        let args = &command.args;

        if let Some(container_id) = args.get("container_id") {
            if !container_id.is_string() || container_id.as_str().unwrap().is_empty() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker logs command must have a non-empty 'container_id' string".to_string(),
                ));
            }
        } else {
            return Err(crate::error::BackendAgentError::Validation(
                "Docker logs command must have a 'container_id' argument".to_string(),
            ));
        }

        // Optional tail parameter
        if let Some(tail) = args.get("tail") {
            if !tail.is_number() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker logs 'tail' argument must be a number".to_string(),
                ));
            }
        }

        Ok(())
    }

    /// Validate docker_stats command
    async fn validate_docker_stats_command(
        &self,
        command: &CommandRecord,
    ) -> BackendAgentResult<()> {
        let args = &command.args;

        // Optional container_id parameter
        if let Some(container_id) = args.get("container_id") {
            if !container_id.is_string() || container_id.as_str().unwrap().is_empty() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker stats 'container_id' argument must be a non-empty string".to_string(),
                ));
            }
        }

        Ok(())
    }

    /// Validate docker_top command
    async fn validate_docker_top_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
        let args = &command.args;

        if let Some(container_id) = args.get("container_id") {
            if !container_id.is_string() || container_id.as_str().unwrap().is_empty() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker top command must have a non-empty 'container_id' string".to_string(),
                ));
            }
        } else {
            return Err(crate::error::BackendAgentError::Validation(
                "Docker top command must have a 'container_id' argument".to_string(),
            ));
        }

        Ok(())
    }

    /// Validate docker_exec command
    async fn validate_docker_exec_command(
        &self,
        command: &CommandRecord,
    ) -> BackendAgentResult<()> {
        let args = &command.args;

        if let Some(container_id) = args.get("container_id") {
            if !container_id.is_string() || container_id.as_str().unwrap().is_empty() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker exec command must have a non-empty 'container_id' string".to_string(),
                ));
            }
        } else {
            return Err(crate::error::BackendAgentError::Validation(
                "Docker exec command must have a 'container_id' argument".to_string(),
            ));
        }

        if let Some(cmd) = args.get("command") {
            if !cmd.is_string() || cmd.as_str().unwrap().is_empty() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker exec command must have a non-empty 'command' string".to_string(),
                ));
            }
        } else {
            return Err(crate::error::BackendAgentError::Validation(
                "Docker exec command must have a 'command' argument".to_string(),
            ));
        }

        Ok(())
    }

    /// Validate docker_run command
    async fn validate_docker_run_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
        let args = &command.args;

        if let Some(image) = args.get("image") {
            if !image.is_string() || image.as_str().unwrap().is_empty() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker run command must have a non-empty 'image' string".to_string(),
                ));
            }
        } else {
            return Err(crate::error::BackendAgentError::Validation(
                "Docker run command must have an 'image' argument".to_string(),
            ));
        }

        // Optional name parameter
        if let Some(name) = args.get("name") {
            if !name.is_string() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker run 'name' argument must be a string".to_string(),
                ));
            }
        }

        Ok(())
    }

    /// Validate docker_stop command
    async fn validate_docker_stop_command(
        &self,
        command: &CommandRecord,
    ) -> BackendAgentResult<()> {
        let args = &command.args;

        if let Some(container_id) = args.get("container_id") {
            if !container_id.is_string() || container_id.as_str().unwrap().is_empty() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker stop command must have a non-empty 'container_id' string".to_string(),
                ));
            }
        } else {
            return Err(crate::error::BackendAgentError::Validation(
                "Docker stop command must have a 'container_id' argument".to_string(),
            ));
        }

        Ok(())
    }

    /// Validate docker_rm command
    async fn validate_docker_rm_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
        let args = &command.args;

        if let Some(container_id) = args.get("container_id") {
            if !container_id.is_string() || container_id.as_str().unwrap().is_empty() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker rm command must have a non-empty 'container_id' string".to_string(),
                ));
            }
        } else {
            return Err(crate::error::BackendAgentError::Validation(
                "Docker rm command must have a 'container_id' argument".to_string(),
            ));
        }

        Ok(())
    }

    /// Validate docker_pull command
    async fn validate_docker_pull_command(
        &self,
        command: &CommandRecord,
    ) -> BackendAgentResult<()> {
        let args = &command.args;

        if let Some(image) = args.get("image") {
            if !image.is_string() || image.as_str().unwrap().is_empty() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker pull command must have a non-empty 'image' string".to_string(),
                ));
            }
        } else {
            return Err(crate::error::BackendAgentError::Validation(
                "Docker pull command must have an 'image' argument".to_string(),
            ));
        }

        Ok(())
    }

    /// Validate docker_build command
    async fn validate_docker_build_command(
        &self,
        command: &CommandRecord,
    ) -> BackendAgentResult<()> {
        let args = &command.args;

        if let Some(context) = args.get("context") {
            if !context.is_string() || context.as_str().unwrap().is_empty() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker build command must have a non-empty 'context' string".to_string(),
                ));
            }
        } else {
            return Err(crate::error::BackendAgentError::Validation(
                "Docker build command must have a 'context' argument".to_string(),
            ));
        }

        // Optional dockerfile parameter
        if let Some(dockerfile) = args.get("dockerfile") {
            if !dockerfile.is_string() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker build 'dockerfile' argument must be a string".to_string(),
                ));
            }
        }

        Ok(())
    }

    /// Validate docker_compose_up command
    async fn validate_docker_compose_up_command(
        &self,
        command: &CommandRecord,
    ) -> BackendAgentResult<()> {
        let args = &command.args;

        if let Some(compose_file) = args.get("compose_file") {
            if !compose_file.is_string() || compose_file.as_str().unwrap().is_empty() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker compose up command must have a non-empty 'compose_file' string"
                        .to_string(),
                ));
            }
        } else {
            return Err(crate::error::BackendAgentError::Validation(
                "Docker compose up command must have a 'compose_file' argument".to_string(),
            ));
        }

        Ok(())
    }

    /// Validate docker_compose_down command
    async fn validate_docker_compose_down_command(
        &self,
        command: &CommandRecord,
    ) -> BackendAgentResult<()> {
        let args = &command.args;

        if let Some(compose_file) = args.get("compose_file") {
            if !compose_file.is_string() || compose_file.as_str().unwrap().is_empty() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker compose down command must have a non-empty 'compose_file' string"
                        .to_string(),
                ));
            }
        } else {
            return Err(crate::error::BackendAgentError::Validation(
                "Docker compose down command must have a 'compose_file' argument".to_string(),
            ));
        }

        Ok(())
    }

    /// Validate docker_compose_ps command
    async fn validate_docker_compose_ps_command(
        &self,
        command: &CommandRecord,
    ) -> BackendAgentResult<()> {
        let args = &command.args;

        if let Some(compose_file) = args.get("compose_file") {
            if !compose_file.is_string() || compose_file.as_str().unwrap().is_empty() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker compose ps command must have a non-empty 'compose_file' string"
                        .to_string(),
                ));
            }
        } else {
            return Err(crate::error::BackendAgentError::Validation(
                "Docker compose ps command must have a 'compose_file' argument".to_string(),
            ));
        }

        Ok(())
    }

    /// Validate docker_compose_logs command
    async fn validate_docker_compose_logs_command(
        &self,
        command: &CommandRecord,
    ) -> BackendAgentResult<()> {
        let args = &command.args;

        if let Some(compose_file) = args.get("compose_file") {
            if !compose_file.is_string() || compose_file.as_str().unwrap().is_empty() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker compose logs command must have a non-empty 'compose_file' string"
                        .to_string(),
                ));
            }
        } else {
            return Err(crate::error::BackendAgentError::Validation(
                "Docker compose logs command must have a 'compose_file' argument".to_string(),
            ));
        }

        // Optional service parameter
        if let Some(service) = args.get("service") {
            if !service.is_string() {
                return Err(crate::error::BackendAgentError::Validation(
                    "Docker compose logs 'service' argument must be a string".to_string(),
                ));
            }
        }

        Ok(())
    }

    /// Execute a command (this is a placeholder - actual execution happens on OS agents)
    pub async fn execute_command(
        &self,
        command: &CommandRecord,
    ) -> BackendAgentResult<CommandResult> {
        info!(
            "Executing command: {} ({})",
            command.correlation_id, command.verb
        );

        // Validate command first
        self.validate_command(command).await?;

        // This is a placeholder - in the real system, commands are sent to OS agents
        // The actual execution happens on the agent side
        warn!("Command execution is a placeholder - commands are sent to OS agents");

        // Create a mock result for now
        let result = CommandResult {
            agent_id: command.agent_targets[0].clone(), // Use first target for now
            status: crate::data::models::CommandExecutionStatus::Success,
            return_code: 0,
            duration_ms: 0,
            stdout: format!(
                "Command '{}' would be executed on {} agent(s)",
                command.verb,
                command.agent_targets.len()
            ),
            stderr_hash: "".to_string(),
            error_code: None,
            timestamp: chrono::Utc::now(),
        };

        info!(
            "Command {} execution completed successfully",
            command.correlation_id
        );
        Ok(result)
    }

    /// Get command execution statistics
    pub async fn get_execution_stats(&self) -> ExecutionStats {
        ExecutionStats {
            max_concurrent_commands: self.max_concurrent_commands,
            command_timeout: self.command_timeout,
        }
    }
}

#[derive(Debug, Clone, serde::Serialize)]
pub struct ExecutionStats {
    pub max_concurrent_commands: usize,
    pub command_timeout: u64,
}

impl Default for CommandExecutor {
    fn default() -> Self {
        Self::new(50, 60)
    }
}
