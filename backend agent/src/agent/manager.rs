use crate::agent::connection::AgentConnectionId;
use crate::agent::{AgentConnection, AgentRegistry};
use crate::config::Config;
use crate::data::models::{AgentInfo, AgentStatus, CommandMessage, WebSocketMessage};
use crate::data::DataLayer;
use crate::error::BackendAgentResult;
use actix_web::{middleware::Logger, web, App, HttpServer, HttpRequest, HttpResponse, Error};
use actix_web_actors::ws::{self, Message, ProtocolError, WebsocketContext};
use actix::{Actor, ActorContext, StreamHandler};
use dashmap::DashMap;
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::RwLock;
use tracing::{debug, error, info, warn};

type AgentConnections =
    Arc<DashMap<AgentConnectionId, Arc<RwLock<AgentConnection<tokio::net::TcpStream>>>>>;

pub struct AgentManager {
    pub registry: Arc<AgentRegistry>,
    pub connections: AgentConnections,
    pub config: Config,
    pub is_running: Arc<RwLock<bool>>,
}

impl AgentManager {
    pub async fn new(config: Config, _data_layer: DataLayer) -> BackendAgentResult<Self> {
        info!("Initializing Agent Manager...");

        let registry = Arc::new(AgentRegistry::new());
        let connections = Arc::new(DashMap::new());
        let is_running = Arc::new(RwLock::new(false));

        let manager = Self {
            config,
            registry,
            connections,
            is_running,
        };

        info!("Agent Manager initialized successfully");
        Ok(manager)
    }

    /// Start the WebSocket server for agent connections
    pub async fn start(&mut self) -> BackendAgentResult<()> {
        let bind_address = format!(
            "{}:{}",
            self.config.agent_management.bind_address, self.config.agent_management.port
        );

        info!(
            "Starting Agent Manager WebSocket server on {}",
            bind_address
        );

        info!(
            "DEBUG: Agent management config - bind_address: {}, port: {}",
            self.config.agent_management.bind_address, self.config.agent_management.port
        );

        {
            let mut running = self.is_running.write().await;
            *running = true;
        }

        info!("Agent Manager WebSocket server started successfully");
        Ok(())
    }

    /// Stop the WebSocket server
    pub async fn stop(&mut self) -> BackendAgentResult<()> {
        info!("Stopping Agent Manager...");

        {
            let mut running = self.is_running.write().await;
            *running = false;
        }

        // Close all connections
        self.close_all_connections().await?;


        info!("Agent Manager stopped successfully");
        Ok(())
    }

    /// Run the HTTP server with WebSocket support
    pub async fn run_server_loop(&self) -> BackendAgentResult<()> {
        let bind_address = format!(
            "{}:{}",
            self.config.agent_management.bind_address, self.config.agent_management.port
        );

        info!(
            "Starting HTTP server with WebSocket support on {}",
            bind_address
        );

        let registry = self.registry.clone();
        let connections = self.connections.clone();
        let config = self.config.clone();

        let server = HttpServer::new(move || {
            App::new()
                .app_data(web::Data::new(registry.clone()))
                .app_data(web::Data::new(connections.clone()))
                .app_data(web::Data::new(config.clone()))
                .route("/", web::get().to(websocket_handler))
                .wrap(Logger::default())
        })
        .bind(&bind_address)
        .map_err(|e| {
            error!("Failed to bind HTTP server: {}", e);
            crate::error::BackendAgentError::Internal(format!("Failed to bind HTTP server: {}", e))
        })?;

        info!("HTTP server started successfully on {}", bind_address);

        // Run the server
        server.run().await.map_err(|e| {
            error!("HTTP server failed: {}", e);
            crate::error::BackendAgentError::Internal(format!("HTTP server failed: {}", e))
        })?;

        info!("HTTP server stopped");
        Ok(())
    }


    /// Send a command to a specific agent
    pub async fn send_command_to_agent(
        &self,
        agent_id: &str,
        command: CommandMessage,
    ) -> BackendAgentResult<()> {
        // Get agent info
        let _agent_info =
            self.registry.get_agent(agent_id).await.ok_or_else(|| {
                crate::error::BackendAgentError::AgentNotFound(agent_id.to_string())
            })?;

        // Check if agent is online
        if !self.registry.is_agent_online(agent_id).await {
            return Err(crate::error::BackendAgentError::Connection(format!(
                "Agent {} is not online",
                agent_id
            )));
        }

        // Get connection ID
        let connection_id = self
            .registry
            .get_connection_id(agent_id)
            .await
            .ok_or_else(|| {
                crate::error::BackendAgentError::Connection(format!(
                    "No active connection for agent {}",
                    agent_id
                ))
            })?;

        // Get connection
        let connection = self.connections.get(&connection_id).ok_or_else(|| {
            crate::error::BackendAgentError::Connection(format!(
                "Connection {} not found",
                connection_id
            ))
        })?;

        // Send command
        let message = WebSocketMessage {
            message_type: "command".to_string(),
            payload: serde_json::to_value(&command).unwrap(),
            timestamp: chrono::Utc::now(),
            correlation_id: Some(command.correlation_id.clone()),
        };
        let conn = connection.read().await;
        conn.send_message(message).await?;

        info!(
            "Command sent to agent {} via connection {}",
            agent_id, connection_id
        );
        Ok(())
    }

    /// Send a command to multiple agents
    pub async fn send_command_to_agents(
        &self,
        agent_ids: &[String],
        command: CommandMessage,
    ) -> BackendAgentResult<Vec<String>> {
        let mut successful_agents = Vec::new();
        let mut failed_agents = Vec::new();

        for agent_id in agent_ids {
            match self.send_command_to_agent(agent_id, command.clone()).await {
                Ok(_) => successful_agents.push(agent_id.clone()),
                Err(e) => {
                    error!("Failed to send command to agent {}: {}", agent_id, e);
                    failed_agents.push(agent_id.clone());
                }
            }
        }

        if !failed_agents.is_empty() {
            warn!(
                "Failed to send command to {} agents: {:?}",
                failed_agents.len(),
                failed_agents
            );
        }

        info!(
            "Command sent to {} agents successfully, {} failed",
            successful_agents.len(),
            failed_agents.len()
        );
        Ok(successful_agents)
    }

    /// Send a command to all agents
    pub async fn send_command_to_all_agents(
        &self,
        command: CommandMessage,
    ) -> BackendAgentResult<Vec<String>> {
        let all_agents = self.registry.list_agents().await;
        let agent_ids: Vec<String> = all_agents.iter().map(|a| a.agent_id.clone()).collect();

        self.send_command_to_agents(&agent_ids, command).await
    }

    /// Send a command to agents by site
    pub async fn send_command_to_site(
        &self,
        site: &str,
        command: CommandMessage,
    ) -> BackendAgentResult<Vec<String>> {
        let site_agents = self.registry.get_agents_by_site(site).await;
        let agent_ids: Vec<String> = site_agents.iter().map(|a| a.agent_id.clone()).collect();

        self.send_command_to_agents(&agent_ids, command).await
    }

    /// Send a command to agents with specific capability
    pub async fn send_command_to_capability(
        &self,
        capability: &str,
        command: CommandMessage,
    ) -> BackendAgentResult<Vec<String>> {
        let capable_agents = self.registry.get_agents_with_capability(capability).await;
        let agent_ids: Vec<String> = capable_agents.iter().map(|a| a.agent_id.clone()).collect();

        self.send_command_to_agents(&agent_ids, command).await
    }

    /// Get agent information
    pub async fn get_agent(&self, agent_id: &str) -> Option<AgentInfo> {
        self.registry.get_agent(agent_id).await
    }

    /// List all agents
    pub async fn list_agents(&self) -> Vec<AgentInfo> {
        self.registry.list_agents().await
    }

    /// Get agents by status
    pub async fn get_agents_by_status(&self, status: &AgentStatus) -> Vec<AgentInfo> {
        self.registry.get_agents_by_status(status).await
    }

    /// Get agents by site
    pub async fn get_agents_by_site(&self, site: &str) -> Vec<AgentInfo> {
        self.registry.get_agents_by_site(site).await
    }

    /// Get agents with capability
    pub async fn get_agents_with_capability(&self, capability: &str) -> Vec<AgentInfo> {
        self.registry.get_agents_with_capability(capability).await
    }

    /// Update agent status
    pub async fn update_agent_status(
        &self,
        agent_id: &str,
        status: AgentStatus,
    ) -> BackendAgentResult<()> {
        self.registry.update_agent_status(agent_id, status).await
    }

    /// Get agent statistics
    pub async fn get_statistics(&self) -> crate::agent::registry::AgentStatistics {
        self.registry.get_statistics().await
    }

    /// Check if agent is online
    pub async fn is_agent_online(&self, agent_id: &str) -> bool {
        self.registry.is_agent_online(agent_id).await
    }

    /// Get total agent count
    pub async fn total_agents(&self) -> usize {
        self.registry.total_agents().await
    }

    /// Get online agent count
    pub async fn online_agents(&self) -> usize {
        self.registry.online_agents().await
    }

    /// Get offline agent count
    pub async fn offline_agents(&self) -> usize {
        self.registry.offline_agents().await
    }

    /// Close a specific connection
    pub async fn close_connection(&self, connection_id: &str) -> BackendAgentResult<()> {
        if let Some(connection) = self.connections.get(connection_id) {
            let mut conn = connection.write().await;
            conn.close().await?;

            // Remove from connections map
            self.connections.remove(connection_id);

            info!("Connection {} closed", connection_id);
        }

        Ok(())
    }

    /// Close all connections
    async fn close_all_connections(&self) -> BackendAgentResult<()> {
        info!("Closing all agent connections...");

        let connection_ids: Vec<String> = self
            .connections
            .iter()
            .map(|entry| entry.key().clone())
            .collect();

        for connection_id in connection_ids {
            if let Err(e) = self.close_connection(&connection_id).await {
                error!("Failed to close connection {}: {}", connection_id, e);
            }
        }

        info!("All agent connections closed");
        Ok(())
    }

    /// Run background tasks (health checks, cleanup, etc.)
    pub async fn run_background_tasks(&self) -> BackendAgentResult<()> {
        info!("Starting Agent Manager background tasks...");

        let registry = self.registry.clone();
        let connections = self.connections.clone();
        let config = self.config.clone();

        // Health check task
        let health_check_task = {
            let registry = registry.clone();
            let connections = connections.clone();
            let config = config.clone();

            tokio::spawn(async move {
                let mut interval = tokio::time::interval(Duration::from_secs(
                    config.agent_management.heartbeat_interval,
                ));

                loop {
                    interval.tick().await;

                    if let Err(e) = Self::run_health_check(&registry, &connections, &config).await {
                        error!("Health check failed: {}", e);
                    }
                }
            })
        };

        // Cleanup task
        let cleanup_task = {
            let registry = registry.clone();
            let _config = config.clone();

            tokio::spawn(async move {
                let mut interval = tokio::time::interval(Duration::from_secs(300)); // Every 5 minutes

                loop {
                    interval.tick().await;

                    if let Err(e) = registry.cleanup_stale_agents(30).await {
                        // 30 minutes threshold
                        error!("Cleanup failed: {}", e);
                    }
                }
            })
        };

        // Wait for tasks
        tokio::select! {
            _ = health_check_task => {
                error!("Health check task stopped unexpectedly");
            }
            _ = cleanup_task => {
                error!("Cleanup task stopped unexpectedly");
            }
        }

        Ok(())
    }

    /// Run health check on all connections
    async fn run_health_check(
        registry: &AgentRegistry,
        connections: &Arc<
            DashMap<AgentConnectionId, Arc<RwLock<AgentConnection<tokio::net::TcpStream>>>>,
        >,
        config: &Config,
    ) -> BackendAgentResult<()> {
        let threshold = config.agent_management.connection_timeout;
        let mut to_remove = Vec::new();

        for entry in connections.iter() {
            let connection_id = entry.key();
            let connection = entry.value();

            let conn = connection.read().await;

            // Check if connection is stale
            if conn.is_stale(threshold.try_into().unwrap()).await {
                warn!("Connection {} is stale, marking for removal", connection_id);
                to_remove.push(connection_id.clone());

                // Update agent status to offline
                if let Some(agent_info) = conn.get_agent_info().await {
                    if let Err(e) = registry
                        .update_agent_status(&agent_info.agent_id, AgentStatus::Offline)
                        .await
                    {
                        error!(
                            "Failed to update agent {} status: {}",
                            agent_info.agent_id, e
                        );
                    }
                }
            }
        }

        // Remove stale connections
        for connection_id in to_remove {
            connections.remove(&connection_id);
            debug!("Removed stale connection {}", connection_id);
        }

        Ok(())
    }
}

/// WebSocket handler for agent connections
async fn websocket_handler(
    req: HttpRequest,
    stream: web::Payload,
    registry: web::Data<Arc<AgentRegistry>>,
    connections: web::Data<AgentConnections>,
    config: web::Data<Config>,
) -> Result<HttpResponse, Error> {
    info!(
        "WebSocket connection request from {}",
        req.peer_addr()
            .unwrap_or_else(|| "unknown".parse().unwrap())
    );

    let resp = ws::start(
        AgentWebSocketActor {
            registry: registry.get_ref().clone(),
            connections: connections.get_ref().clone(),
            config: config.get_ref().clone(),
        },
        &req,
        stream,
    )?;

    Ok(resp)
}

/// WebSocket actor for handling agent connections
pub struct AgentWebSocketActor {
    registry: Arc<AgentRegistry>,
    connections: AgentConnections,
    config: Config,
}

impl Actor for AgentWebSocketActor {
    type Context = WebsocketContext<Self>;
}

impl StreamHandler<Result<Message, ProtocolError>> for AgentWebSocketActor {
    fn handle(&mut self, msg: Result<Message, ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(Message::Text(text)) => {
                info!("Received text message: {}", text);
                // TODO: Handle the message
            }
            Ok(Message::Binary(bin)) => {
                info!("Received binary message of {} bytes", bin.len());
            }
            Ok(Message::Close(reason)) => {
                info!("WebSocket connection closed: {:?}", reason);
                ctx.stop();
            }
            Ok(Message::Ping(msg)) => {
                ctx.pong(&msg);
            }
            Ok(Message::Pong(_)) => {
                // Handle pong
            }
            Ok(Message::Continuation(_)) => {
                // Handle continuation frames
            }
            Ok(Message::Nop) => {
                // Handle no-op messages
            }
            Err(e) => {
                error!("WebSocket error: {}", e);
                ctx.stop();
            }
        }
    }
}

