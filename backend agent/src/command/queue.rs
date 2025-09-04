use crate::data::models::{CommandRecord, CommandStatus, CommandPriority};
use crate::error::BackendAgentResult;
use dashmap::DashMap;
use std::collections::BinaryHeap;
use std::sync::Arc;
use tokio::sync::RwLock;
use tracing::{debug, error, info, warn};
use uuid::Uuid;

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize)]
pub struct QueuedCommand {
    pub command: CommandRecord,
    pub priority: CommandPriority,
    pub queued_at: chrono::DateTime<chrono::Utc>,
    pub retry_count: u32,
}

impl QueuedCommand {
    pub fn new(command: CommandRecord) -> Self {
        Self {
            command,
            priority: CommandPriority::Normal,
            queued_at: chrono::Utc::now(),
            retry_count: 0,
        }
    }

    pub fn with_priority(mut self, priority: CommandPriority) -> Self {
        self.priority = priority;
        self
    }

    pub fn increment_retry(&mut self) {
        self.retry_count += 1;
    }

    pub fn can_retry(&self) -> bool {
        self.retry_count < self.command.max_retries as u32
    }
}

// Implement ordering for priority queue (higher priority first)
impl PartialOrd for QueuedCommand {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for QueuedCommand {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        // Higher priority first, then by queued time (FIFO for same priority)
        match self.priority.cmp(&other.priority) {
            std::cmp::Ordering::Equal => self.queued_at.cmp(&other.queued_at),
            other => other,
        }
    }
}

#[derive(Debug)]
pub struct CommandQueue {
    pending: Arc<DashMap<String, QueuedCommand>>, // correlation_id -> command
    executing: Arc<DashMap<String, QueuedCommand>>, // correlation_id -> command
    completed: Arc<DashMap<String, QueuedCommand>>, // correlation_id -> command
    failed: Arc<DashMap<String, QueuedCommand>>, // correlation_id -> command
    priority_queue: Arc<RwLock<BinaryHeap<QueuedCommand>>>,
    max_queue_size: usize,
}

impl CommandQueue {
    pub fn new(max_queue_size: usize) -> Self {
        Self {
            pending: Arc::new(DashMap::new()),
            executing: Arc::new(DashMap::new()),
            completed: Arc::new(DashMap::new()),
            failed: Arc::new(DashMap::new()),
            priority_queue: Arc::new(RwLock::new(BinaryHeap::new())),
            max_queue_size,
        }
    }

    /// Add a command to the queue
    pub async fn enqueue(&self, command: CommandRecord) -> BackendAgentResult<()> {
        if self.pending.len() >= self.max_queue_size {
            return Err(crate::error::BackendAgentError::RateLimit(
                "Command queue is full".to_string(),
            ));
        }

        let queued_command = QueuedCommand::new(command.clone());
        let correlation_id = command.correlation_id.clone();

        info!("Enqueuing command: {} (priority: {:?})", correlation_id, queued_command.priority);

        // Add to pending map
        self.pending.insert(correlation_id.clone(), queued_command.clone());

        // Add to priority queue
        {
            let mut queue = self.priority_queue.write().await;
            queue.push(queued_command);
        }

        debug!("Command {} enqueued successfully", correlation_id);
        Ok(())
    }

    /// Get the next command to execute (highest priority)
    pub async fn dequeue(&self) -> Option<QueuedCommand> {
        let mut queue = self.priority_queue.write().await;
        
        while let Some(command) = queue.pop() {
            let correlation_id = command.command.correlation_id.clone();
            
            // Check if command is still pending
            if self.pending.contains_key(&correlation_id) {
                // Remove from pending
                self.pending.remove(&correlation_id);
                
                // Add to executing
                self.executing.insert(correlation_id.clone(), command.clone());
                
                debug!("Dequeued command: {} for execution", correlation_id);
                return Some(command);
            }
        }

        None
    }

    /// Mark a command as completed
    pub async fn mark_completed(&self, correlation_id: &str, result: crate::data::models::CommandResult) -> BackendAgentResult<()> {
        if let Some(command) = self.executing.remove(correlation_id) {
            let mut completed_command = command.1;
            completed_command.command.status = CommandStatus::Completed;
            completed_command.command.result = Some(result);
            completed_command.command.completed_at = Some(chrono::Utc::now());

            self.completed.insert(correlation_id.to_string(), completed_command);
            
            info!("Command {} marked as completed", correlation_id);
        } else {
            warn!("Attempted to mark unknown command as completed: {}", correlation_id);
        }

        Ok(())
    }

    /// Mark a command as failed
    pub async fn mark_failed(&self, correlation_id: &str, error_message: String) -> BackendAgentResult<()> {
        if let Some(command) = self.executing.remove(correlation_id) {
            let mut failed_command = command.1;
            failed_command.command.status = CommandStatus::Failed;
            failed_command.command.error_message = Some(error_message);
            failed_command.command.completed_at = Some(chrono::Utc::now());

            self.failed.insert(correlation_id.to_string(), failed_command);
            
            info!("Command {} marked as failed", correlation_id);
        } else {
            warn!("Attempted to mark unknown command as failed: {}", correlation_id);
        }

        Ok(())
    }

    /// Retry a failed command
    pub async fn retry_command(&self, correlation_id: &str) -> BackendAgentResult<()> {
        if let Some(command) = self.failed.remove(correlation_id) {
            let mut retry_command = command.1;
            
            if retry_command.can_retry() {
                retry_command.increment_retry();
                retry_command.command.status = CommandStatus::Pending;
                retry_command.command.error_message = None;
                retry_command.command.completed_at = None;
                retry_command.queued_at = chrono::Utc::now();

                // Add back to pending
                self.pending.insert(correlation_id.to_string(), retry_command.clone());

                // Add back to priority queue
                {
                    let mut queue = self.priority_queue.write().await;
                    queue.push(retry_command.clone());
                }

                info!("Command {} retried (attempt {})", correlation_id, retry_command.retry_count);
            } else {
                warn!("Command {} cannot be retried (max attempts reached)", correlation_id);
            }
        } else {
            warn!("Attempted to retry unknown command: {}", correlation_id);
        }

        Ok(())
    }

    /// Get command by correlation ID
    pub async fn get_command(&self, correlation_id: &str) -> Option<QueuedCommand> {
        // Check all queues
        if let Some(command) = self.pending.get(correlation_id) {
            return Some(command.clone());
        }
        if let Some(command) = self.executing.get(correlation_id) {
            return Some(command.clone());
        }
        if let Some(command) = self.completed.get(correlation_id) {
            return Some(command.clone());
        }
        if let Some(command) = self.failed.get(correlation_id) {
            return Some(command.clone());
        }
        None
    }

    /// Get all pending commands
    pub async fn get_pending_commands(&self) -> Vec<QueuedCommand> {
        self.pending.iter().map(|entry| entry.clone()).collect()
    }

    /// Get all executing commands
    pub async fn get_executing_commands(&self) -> Vec<QueuedCommand> {
        self.executing.iter().map(|entry| entry.clone()).collect()
    }

    /// Get all completed commands
    pub async fn get_completed_commands(&self) -> Vec<QueuedCommand> {
        self.completed.iter().map(|entry| entry.clone()).collect()
    }

    /// Get all failed commands
    pub async fn get_failed_commands(&self) -> Vec<QueuedCommand> {
        self.failed.iter().map(|entry| entry.clone()).collect()
    }

    /// Get queue statistics
    pub async fn get_statistics(&self) -> QueueStatistics {
        QueueStatistics {
            pending: self.pending.len(),
            executing: self.executing.len(),
            completed: self.completed.len(),
            failed: self.failed.len(),
            total: self.pending.len() + self.executing.len() + self.completed.len() + self.failed.len(),
        }
    }

    /// Clear completed commands older than threshold
    pub async fn cleanup_old_commands(&self, threshold_hours: i64) -> BackendAgentResult<usize> {
        let threshold = chrono::Utc::now() - chrono::Duration::hours(threshold_hours);
        let mut removed_count = 0;

        // Clean up completed commands
        let to_remove: Vec<String> = self.completed
            .iter()
            .filter(|entry| {
                if let Some(completed_at) = entry.command.completed_at {
                    completed_at < threshold
                } else {
                    false
                }
            })
            .map(|entry| entry.key().clone())
            .collect();

        for correlation_id in to_remove {
            self.completed.remove(&correlation_id);
            removed_count += 1;
        }

        // Clean up failed commands
        let to_remove: Vec<String> = self.failed
            .iter()
            .filter(|entry| {
                if let Some(completed_at) = entry.command.completed_at {
                    completed_at < threshold
                } else {
                    false
                }
            })
            .map(|entry| entry.key().clone())
            .collect();

        for correlation_id in to_remove {
            self.failed.remove(&correlation_id);
            removed_count += 1;
        }

        if removed_count > 0 {
            info!("Cleaned up {} old commands", removed_count);
        }

        Ok(removed_count)
    }

    /// Get commands by status
    pub async fn get_commands_by_status(&self, status: &CommandStatus) -> Vec<QueuedCommand> {
        match status {
            CommandStatus::Pending => self.get_pending_commands().await,
            CommandStatus::Executing => self.get_executing_commands().await,
            CommandStatus::Completed => self.get_completed_commands().await,
            CommandStatus::Failed => self.get_failed_commands().await,
            _ => Vec::new(),
        }
    }

    /// Get commands by priority
    pub async fn get_commands_by_priority(&self, priority: &CommandPriority) -> Vec<QueuedCommand> {
        let mut commands = Vec::new();
        
        for entry in self.pending.iter() {
            if entry.priority == *priority {
                commands.push(entry.clone());
            }
        }
        
        for entry in self.executing.iter() {
            if entry.priority == *priority {
                commands.push(entry.clone());
            }
        }
        
        commands
    }

    /// Get commands for a specific agent
    pub async fn get_commands_for_agent(&self, agent_id: &str) -> Vec<QueuedCommand> {
        let mut commands = Vec::new();
        
        for entry in self.pending.iter() {
            if entry.command.agent_targets.contains(&agent_id.to_string()) {
                commands.push(entry.clone());
            }
        }
        
        for entry in self.executing.iter() {
            if entry.command.agent_targets.contains(&agent_id.to_string()) {
                commands.push(entry.clone());
            }
        }
        
        for entry in self.completed.iter() {
            if entry.command.agent_targets.contains(&agent_id.to_string()) {
                commands.push(entry.clone());
            }
        }
        
        for entry in self.failed.iter() {
            if entry.command.agent_targets.contains(&agent_id.to_string()) {
                commands.push(entry.clone());
            }
        }
        
        commands
    }

    /// Get commands by verb (command type)
    pub async fn get_commands_by_verb(&self, verb: &str) -> Vec<QueuedCommand> {
        let mut commands = Vec::new();
        
        for entry in self.pending.iter() {
            if entry.command.verb == verb {
                commands.push(entry.clone());
            }
        }
        
        for entry in self.executing.iter() {
            if entry.command.verb == verb {
                commands.push(entry.clone());
            }
        }
        
        for entry in self.completed.iter() {
            if entry.command.verb == verb {
                commands.push(entry.clone());
            }
        }
        
        for entry in self.failed.iter() {
            if entry.command.verb == verb {
                commands.push(entry.clone());
            }
        }
        
        commands
    }
}

#[derive(Debug, Clone, serde::Serialize)]
pub struct QueueStatistics {
    pub pending: usize,
    pub executing: usize,
    pub completed: usize,
    pub failed: usize,
    pub total: usize,
}

impl Default for CommandQueue {
    fn default() -> Self {
        Self::new(1000)
    }
}
