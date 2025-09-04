use crate::data::models::{AgentInfo, AgentStatus};
use crate::error::BackendAgentResult;
use dashmap::DashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use tracing::{debug, error, info, warn};
use uuid::Uuid;

#[derive(Debug, Clone)]
pub struct AgentRegistry {
    agents: Arc<DashMap<String, AgentInfo>>,
    connections: Arc<DashMap<String, String>>, // agent_id -> connection_id
    connection_agents: Arc<DashMap<String, String>>, // connection_id -> agent_id
}

impl AgentRegistry {
    pub fn new() -> Self {
        Self {
            agents: Arc::new(DashMap::new()),
            connections: Arc::new(DashMap::new()),
            connection_agents: Arc::new(DashMap::new()),
        }
    }

    /// Register a new agent connection
    pub async fn register_agent(
        &self,
        agent_info: AgentInfo,
        connection_id: String,
    ) -> BackendAgentResult<()> {
        let agent_id = agent_info.agent_id.clone();

        info!(
            "Registering agent: {} (connection: {})",
            agent_id, connection_id
        );

        // Store agent information
        self.agents.insert(agent_id.clone(), agent_info);

        // Map connection to agent
        self.connections
            .insert(agent_id.clone(), connection_id.clone());
        self.connection_agents
            .insert(connection_id, agent_id.clone());

        debug!("Agent {} registered successfully", agent_id);
        Ok(())
    }

    /// Unregister an agent connection
    pub async fn unregister_agent(
        &self,
        connection_id: &str,
    ) -> BackendAgentResult<Option<String>> {
        if let Some(agent_id) = self.connection_agents.remove(connection_id) {
            let agent_id = agent_id.1;

            info!(
                "Unregistering agent: {} (connection: {})",
                agent_id, connection_id
            );

            // Remove from all maps
            self.agents.remove(&agent_id);
            self.connections.remove(&agent_id);
            self.connection_agents.remove(connection_id);

            debug!("Agent {} unregistered successfully", agent_id);
            Ok(Some(agent_id))
        } else {
            warn!(
                "Attempted to unregister unknown connection: {}",
                connection_id
            );
            Ok(None)
        }
    }

    /// Get agent information by ID
    pub async fn get_agent(&self, agent_id: &str) -> Option<AgentInfo> {
        self.agents.get(agent_id).map(|entry| entry.clone())
    }

    /// Get agent information by connection ID
    pub async fn get_agent_by_connection(&self, connection_id: &str) -> Option<AgentInfo> {
        if let Some(agent_id) = self.connection_agents.get(connection_id) {
            self.agents
                .get(&agent_id.value().clone())
                .map(|entry| entry.clone())
        } else {
            None
        }
    }

    /// List all registered agents
    pub async fn list_agents(&self) -> Vec<AgentInfo> {
        self.agents.iter().map(|entry| entry.clone()).collect()
    }

    /// Get agents by site
    pub async fn get_agents_by_site(&self, site: &str) -> Vec<AgentInfo> {
        self.agents
            .iter()
            .filter(|entry| entry.site == site)
            .map(|entry| entry.clone())
            .collect()
    }

    /// Get agents by status
    pub async fn get_agents_by_status(&self, status: &AgentStatus) -> Vec<AgentInfo> {
        self.agents
            .iter()
            .filter(|entry| entry.status == *status)
            .map(|entry| entry.clone())
            .collect()
    }

    /// Update agent status
    pub async fn update_agent_status(
        &self,
        agent_id: &str,
        status: AgentStatus,
    ) -> BackendAgentResult<()> {
        if let Some(mut agent) = self.agents.get_mut(agent_id) {
            agent.status = status.clone();
            debug!("Updated agent {} status to {:?}", agent_id, status);
            Ok(())
        } else {
            Err(crate::error::BackendAgentError::AgentNotFound(
                agent_id.to_string(),
            ))
        }
    }

    /// Update agent last seen timestamp
    pub async fn update_agent_last_seen(&self, agent_id: &str) -> BackendAgentResult<()> {
        if let Some(mut agent) = self.agents.get_mut(agent_id) {
            agent.last_seen = chrono::Utc::now();
            debug!("Updated agent {} last seen timestamp", agent_id);
            Ok(())
        } else {
            Err(crate::error::BackendAgentError::AgentNotFound(
                agent_id.to_string(),
            ))
        }
    }

    /// Check if agent is online
    pub async fn is_agent_online(&self, agent_id: &str) -> bool {
        if let Some(agent) = self.agents.get(agent_id) {
            agent.status == AgentStatus::Online
        } else {
            false
        }
    }

    /// Get connection ID for an agent
    pub async fn get_connection_id(&self, agent_id: &str) -> Option<String> {
        self.connections
            .get(agent_id)
            .map(|entry| entry.value().clone())
    }

    /// Get total agent count
    pub async fn total_agents(&self) -> usize {
        self.agents.len()
    }

    /// Get online agent count
    pub async fn online_agents(&self) -> usize {
        self.agents
            .iter()
            .filter(|entry| entry.status == AgentStatus::Online)
            .count()
    }

    /// Get offline agent count
    pub async fn offline_agents(&self) -> usize {
        self.agents
            .iter()
            .filter(|entry| entry.status == AgentStatus::Offline)
            .count()
    }

    /// Get agents with specific capability
    pub async fn get_agents_with_capability(&self, capability: &str) -> Vec<AgentInfo> {
        self.agents
            .iter()
            .filter(|entry| entry.capabilities.contains(&capability.to_string()))
            .map(|entry| entry.clone())
            .collect()
    }

    /// Get agents by OS type
    pub async fn get_agents_by_os(&self, os: &str) -> Vec<AgentInfo> {
        self.agents
            .iter()
            .filter(|entry| entry.os == os)
            .map(|entry| entry.clone())
            .collect()
    }

    /// Get agents by container engine
    pub async fn get_agents_by_container_engine(&self, engine: &str) -> Vec<AgentInfo> {
        self.agents
            .iter()
            .filter(|entry| entry.container_engine.as_ref() == Some(&engine.to_string()))
            .map(|entry| entry.clone())
            .collect()
    }

    /// Clean up stale agents (offline for more than threshold)
    pub async fn cleanup_stale_agents(&self, threshold_minutes: i64) -> BackendAgentResult<usize> {
        let threshold = chrono::Utc::now() - chrono::Duration::minutes(threshold_minutes);
        let mut to_remove = Vec::new();

        for entry in self.agents.iter() {
            if entry.status == AgentStatus::Offline && entry.last_seen < threshold {
                to_remove.push(entry.agent_id.clone());
            }
        }

        let removed_count = to_remove.len();
        for agent_id in to_remove {
            if let Some(connection_id) = self.connections.remove(&agent_id) {
                self.connection_agents.remove(&connection_id.1);
            }
            self.agents.remove(&agent_id);
        }

        if removed_count > 0 {
            info!("Cleaned up {} stale agents", removed_count);
        }

        Ok(removed_count)
    }

    /// Get agent statistics
    pub async fn get_statistics(&self) -> AgentStatistics {
        let total = self.agents.len();
        let online = self
            .agents
            .iter()
            .filter(|entry| entry.status == AgentStatus::Online)
            .count();
        let offline = total - online;

        let os_distribution = self.get_os_distribution().await;
        let site_distribution = self.get_site_distribution().await;
        let capability_distribution = self.get_capability_distribution().await;

        AgentStatistics {
            total,
            online,
            offline,
            os_distribution,
            site_distribution,
            capability_distribution,
        }
    }

    async fn get_os_distribution(&self) -> std::collections::HashMap<String, usize> {
        let mut distribution = std::collections::HashMap::new();

        for entry in self.agents.iter() {
            *distribution.entry(entry.os.clone()).or_insert(0) += 1;
        }

        distribution
    }

    async fn get_site_distribution(&self) -> std::collections::HashMap<String, usize> {
        let mut distribution = std::collections::HashMap::new();

        for entry in self.agents.iter() {
            *distribution.entry(entry.site.clone()).or_insert(0) += 1;
        }

        distribution
    }

    async fn get_capability_distribution(&self) -> std::collections::HashMap<String, usize> {
        let mut distribution = std::collections::HashMap::new();

        for entry in self.agents.iter() {
            for capability in &entry.capabilities {
                *distribution.entry(capability.clone()).or_insert(0) += 1;
            }
        }

        distribution
    }
}

#[derive(Debug, Clone, serde::Serialize)]
pub struct AgentStatistics {
    pub total: usize,
    pub online: usize,
    pub offline: usize,
    pub os_distribution: std::collections::HashMap<String, usize>,
    pub site_distribution: std::collections::HashMap<String, usize>,
    pub capability_distribution: std::collections::HashMap<String, usize>,
}

impl Default for AgentRegistry {
    fn default() -> Self {
        Self::new()
    }
}
