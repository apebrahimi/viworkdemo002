use crate::agent::AgentManager;
use crate::command::{CommandQueue, CommandExecutor, queue::QueuedCommand};
use crate::config::Config;
use crate::data::DataLayer;
use crate::data::models::{CommandRecord, CommandResult, CommandStatus, CommandMessage, WebSocketMessage};
use crate::error::BackendAgentResult;
use dashmap::DashMap;
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::{RwLock, Semaphore};
use tokio::time::timeout;
use tracing::{debug, error, info, warn};
use uuid::Uuid;

pub struct CommandEngine {
    config: Config,
    data_layer: DataLayer,
    agent_manager: Arc<AgentManager>,
    queue: Arc<CommandQueue>,
    executor: Arc<CommandExecutor>,
    active_commands: Arc<DashMap<String, QueuedCommand>>, // correlation_id -> command
    command_semaphore: Arc<Semaphore>,
    is_running: Arc<RwLock<bool>>,
}

impl CommandEngine {
    pub async fn new(config: Config, data_layer: DataLayer, agent_manager: Arc<AgentManager>) -> BackendAgentResult<Self> {
        info!("Initializing Command Engine...");

        let queue = Arc::new(CommandQueue::new(config.command.max_command_queue_size));
        let executor = Arc::new(CommandExecutor::new(
            config.command.max_concurrent_commands,
            config.command.command_timeout,
        ));
        let command_semaphore = Arc::new(Semaphore::new(config.command.max_concurrent_commands));
        let is_running = Arc::new(RwLock::new(false));

        let engine = Self {
            config,
            data_layer,
            agent_manager,
            queue,
            executor,
            active_commands: Arc::new(DashMap::new()),
            command_semaphore,
            is_running,
        };

        info!("Command Engine initialized successfully");
        Ok(engine)
    }

    /// Start the command engine
    pub async fn start(&self) -> BackendAgentResult<()> {
        info!("Starting Command Engine...");

        {
            let mut running = self.is_running.write().await;
            *running = true;
        }

        info!("Command Engine started successfully");
        Ok(())
    }

    /// Stop the command engine
    pub async fn stop(&self) -> BackendAgentResult<()> {
        info!("Stopping Command Engine...");

        {
            let mut running = self.is_running.write().await;
            *running = false;
        }

        // Wait for active commands to complete
        self.wait_for_active_commands().await;

        info!("Command Engine stopped successfully");
        Ok(())
    }

    /// Submit a command for execution
    pub async fn submit_command(&self, command: CommandRecord) -> BackendAgentResult<String> {
        let correlation_id = command.correlation_id.clone();
        
        info!("Submitting command: {} ({})", correlation_id, command.verb);

        // Validate command
        self.executor.validate_command(&command).await?;

        // Store command in database
        self.data_layer.postgres.create_command(&command).await?;

        // Enqueue command
        self.queue.enqueue(command).await?;

        info!("Command {} submitted successfully", correlation_id);
        Ok(correlation_id)
    }

    /// Execute a command on target agents
    pub async fn execute_command(&self, command: &CommandRecord) -> BackendAgentResult<Vec<String>> {
        let correlation_id = command.correlation_id.clone();
        info!("Executing command: {} on {} agents", correlation_id, command.agent_targets.len());

        let mut successful_agents = Vec::new();
        let mut failed_agents = Vec::new();

        // Create command message for WebSocket
        let command_message = CommandMessage {
            correlation_id: correlation_id.clone(),
            verb: command.verb.clone(),
            args: command.args.clone(),
            actor: command.actor.clone(),
            policy_id: "default".to_string(), // TODO: Get from config
            nonce: Uuid::new_v4().to_string(),
            issued_at: chrono::Utc::now().timestamp() as u64,
            expires_at: (chrono::Utc::now().timestamp() + self.config.command.command_timeout as i64) as u64,
            agent_targets: command.agent_targets.clone(),
        };

        let ws_message = WebSocketMessage {
            message_type: "command".to_string(),
            payload: serde_json::to_value(&command_message).unwrap(),
            timestamp: chrono::Utc::now(),
            correlation_id: Some(correlation_id.clone()),
        };

        // Send command to each target agent
        for agent_id in &command.agent_targets {
            match self.agent_manager.send_command_to_agent(agent_id, command_message.clone()).await {
                Ok(_) => {
                    successful_agents.push(agent_id.clone());
                    debug!("Command sent to agent {} successfully", agent_id);
                }
                Err(e) => {
                    error!("Failed to send command to agent {}: {}", agent_id, e);
                    failed_agents.push(agent_id.clone());
                }
            }
        }

        if !failed_agents.is_empty() {
            warn!("Failed to send command to {} agents: {:?}", failed_agents.len(), failed_agents);
        }

        info!("Command {} executed on {} agents successfully, {} failed", 
            correlation_id, successful_agents.len(), failed_agents.len());

        Ok(successful_agents)
    }

    /// Process command results from agents
    pub async fn process_command_result(&self, correlation_id: &str, result: CommandResult) -> BackendAgentResult<()> {
        info!("Processing result for command: {}", correlation_id);

        // Update command status in database
        self.data_layer.postgres.update_command_status(correlation_id, &CommandStatus::Completed).await?;

        // Mark command as completed in queue
        self.queue.mark_completed(correlation_id, result.clone()).await?;

        // Remove from active commands
        self.active_commands.remove(correlation_id);

        // Release semaphore permit
        self.command_semaphore.add_permits(1);

        info!("Command {} result processed successfully", correlation_id);
        Ok(())
    }

    /// Process command failure
    pub async fn process_command_failure(&self, correlation_id: &str, error_message: String) -> BackendAgentResult<()> {
        info!("Processing failure for command: {}", correlation_id);

        // Update command status in database
        self.data_layer.postgres.update_command_status(correlation_id, &CommandStatus::Failed).await?;

        // Mark command as failed in queue
        self.queue.mark_failed(correlation_id, error_message.clone()).await?;

        // Remove from active commands
        self.active_commands.remove(correlation_id);

        // Release semaphore permit
        self.command_semaphore.add_permits(1);

        info!("Command {} failure processed successfully", correlation_id);
        Ok(())
    }

    /// Get command by correlation ID
    pub async fn get_command(&self, correlation_id: &str) -> Option<QueuedCommand> {
        self.queue.get_command(correlation_id).await
    }

    /// Get all pending commands
    pub async fn get_pending_commands(&self) -> Vec<QueuedCommand> {
        self.queue.get_pending_commands().await
    }

    /// Get all executing commands
    pub async fn get_executing_commands(&self) -> Vec<QueuedCommand> {
        self.queue.get_executing_commands().await
    }

    /// Get all completed commands
    pub async fn get_completed_commands(&self) -> Vec<QueuedCommand> {
        self.queue.get_completed_commands().await
    }

    /// Get all failed commands
    pub async fn get_failed_commands(&self) -> Vec<QueuedCommand> {
        self.queue.get_failed_commands().await
    }

    /// Get commands by status
    pub async fn get_commands_by_status(&self, status: &CommandStatus) -> Vec<QueuedCommand> {
        self.queue.get_commands_by_status(status).await
    }

    /// Get commands for a specific agent
    pub async fn get_commands_for_agent(&self, agent_id: &str) -> Vec<QueuedCommand> {
        self.queue.get_commands_for_agent(agent_id).await
    }

    /// Get commands by verb
    pub async fn get_commands_by_verb(&self, verb: &str) -> Vec<QueuedCommand> {
        self.queue.get_commands_by_verb(verb).await
    }

    /// Retry a failed command
    pub async fn retry_command(&self, correlation_id: &str) -> BackendAgentResult<()> {
        info!("Retrying command: {}", correlation_id);

        // Update command status in database
        self.data_layer.postgres.update_command_status(correlation_id, &CommandStatus::Pending).await?;

        // Retry command in queue
        self.queue.retry_command(correlation_id).await?;

        info!("Command {} retry initiated successfully", correlation_id);
        Ok(())
    }

    /// Get command engine statistics
    pub async fn get_statistics(&self) -> CommandEngineStats {
        let queue_stats = self.queue.get_statistics().await;
        let execution_stats = self.executor.get_execution_stats().await;

        CommandEngineStats {
            queue: queue_stats,
            execution: execution_stats,
            active_commands: self.active_commands.len(),
            available_slots: self.command_semaphore.available_permits(),
        }
    }

    /// Run the main command processing loop
    pub async fn run_command_loop(&self) -> BackendAgentResult<()> {
        info!("Starting command processing loop...");

        while *self.is_running.read().await {
            // Try to acquire semaphore permit
            let permit = match timeout(
                Duration::from_secs(1),
                self.command_semaphore.acquire()
            ).await {
                Ok(Ok(permit)) => permit,
                Ok(Err(_)) => {
                    error!("Failed to acquire semaphore permit");
                    continue;
                }
                Err(_) => {
                    // Timeout - check if we should continue
                    continue;
                }
            };

            // Dequeue next command
            if let Some(queued_command) = self.queue.dequeue().await {
                let correlation_id = queued_command.command.correlation_id.clone();
                
                info!("Processing command: {} ({})", correlation_id, queued_command.command.verb);

                // Add to active commands
                self.active_commands.insert(correlation_id.clone(), queued_command.clone());

                // Execute command
                match self.execute_command(&queued_command.command).await {
                    Ok(successful_agents) => {
                        if successful_agents.is_empty() {
                            // All agents failed
                            self.process_command_failure(&correlation_id, 
                                "Failed to send command to any target agents".to_string()).await?;
                        } else {
                            // Command sent successfully, wait for results
                            debug!("Command {} sent to {} agents, waiting for results", 
                                correlation_id, successful_agents.len());
                        }
                    }
                    Err(e) => {
                        error!("Failed to execute command {}: {}", correlation_id, e);
                        self.process_command_failure(&correlation_id, e.to_string()).await?;
                    }
                }
            } else {
                // No commands in queue, release permit
                drop(permit);
            }
        }

        info!("Command processing loop stopped");
        Ok(())
    }

    /// Wait for active commands to complete
    async fn wait_for_active_commands(&self) {
        info!("Waiting for {} active commands to complete...", self.active_commands.len());

        let mut attempts = 0;
        const MAX_ATTEMPTS: u32 = 30; // 30 seconds

        while !self.active_commands.is_empty() && attempts < MAX_ATTEMPTS {
            tokio::time::sleep(Duration::from_secs(1)).await;
            attempts += 1;
        }

        if !self.active_commands.is_empty() {
            warn!("{} commands still active after timeout", self.active_commands.len());
        } else {
            info!("All active commands completed");
        }
    }

    /// Run background tasks
    pub async fn run_background_tasks(&self) -> BackendAgentResult<()> {
        info!("Starting Command Engine background tasks...");

        let queue = self.queue.clone();
        let config = self.config.clone();

        // Cleanup task
        let cleanup_task = tokio::spawn(async move {
            let mut interval = tokio::time::interval(Duration::from_secs(3600)); // Every hour
            
            loop {
                interval.tick().await;
                
                if let Err(e) = queue.cleanup_old_commands(24).await { // 24 hours threshold
                    error!("Command cleanup failed: {}", e);
                }
            }
        });

        // Wait for task
        tokio::select! {
            _ = cleanup_task => {
                error!("Cleanup task stopped unexpectedly");
            }
        }

        Ok(())
    }

    /// Cancel a command
    pub async fn cancel_command(&self, correlation_id: &str) -> BackendAgentResult<()> {
        info!("Cancelling command: {}", correlation_id);

        // Check if command is in active commands
        if let Some(command) = self.active_commands.remove(correlation_id) {
            // Update command status in database
            self.data_layer.postgres.update_command_status(correlation_id, &CommandStatus::Cancelled).await?;

            // Release semaphore permit
            self.command_semaphore.add_permits(1);

            info!("Command {} cancelled successfully", correlation_id);
        } else {
            warn!("Command {} not found in active commands", correlation_id);
        }

        Ok(())
    }

    /// Get command execution history
    pub async fn get_command_history(&self, limit: Option<usize>) -> Vec<QueuedCommand> {
        let mut all_commands = Vec::new();
        
        // Get completed commands
        all_commands.extend(self.queue.get_completed_commands().await);
        
        // Get failed commands
        all_commands.extend(self.queue.get_failed_commands().await);
        
        // Sort by completion time (most recent first)
        all_commands.sort_by(|a, b| {
            let a_time = a.command.completed_at.unwrap_or(a.command.created_at);
            let b_time = b.command.completed_at.unwrap_or(b.command.created_at);
            b_time.cmp(&a_time)
        });
        
        // Apply limit if specified
        if let Some(limit) = limit {
            all_commands.truncate(limit);
        }
        
        all_commands
    }
}

#[derive(Debug, Clone, serde::Serialize)]
pub struct CommandEngineStats {
    pub queue: crate::command::queue::QueueStatistics,
    pub execution: crate::command::executor::ExecutionStats,
    pub active_commands: usize,
    pub available_slots: usize,
}

impl Drop for CommandEngine {
    fn drop(&mut self) {
        // Ensure we stop the engine when dropped
        // Note: We can't await in Drop, so this is just cleanup
        debug!("CommandEngine being dropped");
    }
}
