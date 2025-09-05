use crate::config::Config;
use crate::error::{AgentError, AgentResult};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::VecDeque;
use std::sync::Arc;
use tokio::sync::RwLock;
use tracing::{error, info, warn};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditEvent {
    pub timestamp: DateTime<Utc>,
    pub correlation_id: String,
    pub command: String,
    pub username: Option<String>,
    pub source_ip: String,
    pub success: bool,
    pub execution_time_ms: u64,
    pub error_message: Option<String>,
    pub parameters: serde_json::Value,
}

#[derive(Debug, Clone)]
pub struct AuditLogger {
    config: Config,
    events: Arc<RwLock<VecDeque<AuditEvent>>>,
    max_events: usize,
}

impl AuditLogger {
    pub fn new(config: Config) -> Self {
        Self {
            config,
            events: Arc::new(RwLock::new(VecDeque::new())),
            max_events: 10000, // Keep last 10k events in memory
        }
    }

    pub async fn log_command_execution(
        &self,
        correlation_id: &str,
        command: &str,
        username: Option<&str>,
        source_ip: &str,
        success: bool,
        execution_time_ms: u64,
        error_message: Option<&str>,
        parameters: &serde_json::Value,
    ) -> AgentResult<()> {
        let event = AuditEvent {
            timestamp: Utc::now(),
            correlation_id: correlation_id.to_string(),
            command: command.to_string(),
            username: username.map(|s| s.to_string()),
            source_ip: source_ip.to_string(),
            success,
            execution_time_ms,
            error_message: error_message.map(|s| s.to_string()),
            parameters: parameters.clone(),
        };

        // Add to in-memory queue
        {
            let mut events = self.events.write().await;
            events.push_back(event.clone());

            // Maintain max size
            while events.len() > self.max_events {
                events.pop_front();
            }
        }

        // Log to tracing
        if success {
            info!(
                correlation_id = correlation_id,
                command = command,
                username = username,
                source_ip = source_ip,
                execution_time_ms = execution_time_ms,
                "Command executed successfully"
            );
        } else {
            error!(
                correlation_id = correlation_id,
                command = command,
                username = username,
                source_ip = source_ip,
                execution_time_ms = execution_time_ms,
                error = error_message,
                "Command execution failed"
            );
        }

        Ok(())
    }

    pub async fn get_recent_events(&self, limit: usize) -> Vec<AuditEvent> {
        let events = self.events.read().await;
        events.iter().rev().take(limit).cloned().collect()
    }

    pub async fn get_events_by_user(&self, username: &str) -> Vec<AuditEvent> {
        let events = self.events.read().await;
        events
            .iter()
            .filter(|event| event.username.as_ref() == Some(&username.to_string()))
            .cloned()
            .collect()
    }

    pub async fn get_events_by_command(&self, command: &str) -> Vec<AuditEvent> {
        let events = self.events.read().await;
        events
            .iter()
            .filter(|event| event.command == command)
            .cloned()
            .collect()
    }

    pub async fn get_failed_events(&self, limit: usize) -> Vec<AuditEvent> {
        let events = self.events.read().await;
        events
            .iter()
            .filter(|event| !event.success)
            .rev()
            .take(limit)
            .cloned()
            .collect()
    }

    pub async fn get_statistics(&self) -> serde_json::Value {
        let events = self.events.read().await;

        let total_events = events.len();
        let successful_events = events.iter().filter(|e| e.success).count();
        let failed_events = total_events - successful_events;

        let avg_execution_time = if total_events > 0 {
            let total_time: u64 = events.iter().map(|e| e.execution_time_ms).sum();
            total_time as f64 / total_events as f64
        } else {
            0.0
        };

        // Get most common commands
        let mut command_counts: std::collections::HashMap<String, usize> =
            std::collections::HashMap::new();
        for event in events.iter() {
            *command_counts.entry(event.command.clone()).or_insert(0) += 1;
        }

        let top_commands: Vec<_> = command_counts
            .into_iter()
            .map(|(cmd, count)| serde_json::json!({ "command": cmd, "count": count }))
            .collect();

        serde_json::json!({
            "total_events": total_events,
            "successful_events": successful_events,
            "failed_events": failed_events,
            "success_rate": if total_events > 0 { (successful_events as f64 / total_events as f64) * 100.0 } else { 0.0 },
            "average_execution_time_ms": avg_execution_time,
            "top_commands": top_commands,
            "retention_days": self.config.monitoring.retention_days
        })
    }

    pub async fn cleanup_old_events(&self) -> AgentResult<usize> {
        let retention_days = self.config.monitoring.retention_days;
        let cutoff_time = Utc::now() - chrono::Duration::days(retention_days as i64);

        let mut events = self.events.write().await;
        let initial_count = events.len();

        events.retain(|event| event.timestamp >= cutoff_time);

        let removed_count = initial_count - events.len();
        info!("Cleaned up {} old audit events", removed_count);

        Ok(removed_count)
    }

    pub fn init(_config: &Config) -> AgentResult<()> {
        info!("Audit logger initialized");
        Ok(())
    }
}
