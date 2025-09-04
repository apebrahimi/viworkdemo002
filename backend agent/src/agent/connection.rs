use crate::data::models::{AgentInfo, WebSocketMessage, HelloMessage, TelemetryMessage, ResultMessage, HeartbeatMessage};
use crate::error::BackendAgentResult;
use futures_util::{SinkExt, StreamExt};
use std::sync::Arc;
use tokio::sync::mpsc;
use tokio::sync::RwLock;
use tokio_tungstenite::{tungstenite::Message, WebSocketStream};
use tracing::{debug, error, info, warn};
use uuid::Uuid;

pub type AgentConnectionId = String;

#[derive(Debug)]
pub struct AgentConnection<S> 
where
    S: tokio::io::AsyncRead + tokio::io::AsyncWrite + Unpin + std::marker::Send,
{
    pub id: AgentConnectionId,
    pub agent_info: Arc<RwLock<Option<AgentInfo>>>,
    pub websocket: WebSocketStream<S>,
    pub sender: mpsc::UnboundedSender<WebSocketMessage>,
    pub receiver: mpsc::UnboundedReceiver<WebSocketMessage>,
    pub last_heartbeat: Arc<RwLock<chrono::DateTime<chrono::Utc>>>,
    pub is_authenticated: Arc<RwLock<bool>>,
}

impl<S> AgentConnection<S>
where
    S: tokio::io::AsyncRead + tokio::io::AsyncWrite + Unpin + std::marker::Send,
{
    pub fn new(
        websocket: WebSocketStream<S>,
    ) -> Self {
        let id = Uuid::new_v4().to_string();
        let (sender, receiver) = mpsc::unbounded_channel();
        let now = chrono::Utc::now();

        Self {
            id,
            agent_info: Arc::new(RwLock::new(None)),
            websocket,
            sender,
            receiver,
            last_heartbeat: Arc::new(RwLock::new(now)),
            is_authenticated: Arc::new(RwLock::new(false)),
        }
    }

    /// Handle the WebSocket connection lifecycle
    pub async fn handle_connection(&mut self) -> BackendAgentResult<()> {
        info!("Starting agent connection handler for connection: {}", self.id);

        // Instead of trying to split and move the websocket, we'll handle it differently
        // We'll process messages in a loop without spawning tasks that require ownership
        
        let mut interval = tokio::time::interval(tokio::time::Duration::from_millis(100));
        
        loop {
            tokio::select! {
                // Check for incoming WebSocket messages
                message = self.websocket.next() => {
                    match message {
                        Some(Ok(Message::Text(text))) => {
                            debug!("Received text message: {}", text);
                            // TODO: Process incoming messages
                        }
                        Some(Ok(Message::Binary(data))) => {
                            debug!("Received binary message of {} bytes", data.len());
                        }
                        Some(Ok(Message::Close(_))) => {
                            info!("Agent connection closed by client");
                            break;
                        }
                        Some(Ok(Message::Ping(data))) => {
                            if let Err(e) = self.websocket.send(Message::Pong(data)).await {
                                error!("Failed to send pong: {}", e);
                                break;
                            }
                        }
                        Some(Ok(Message::Pong(_))) => {
                            debug!("Received pong");
                        }
                        Some(Ok(Message::Frame(_))) => {
                            // Ignore raw frames
                        }
                        Some(Err(e)) => {
                            error!("WebSocket error: {}", e);
                            break;
                        }
                        None => {
                            info!("WebSocket stream ended");
                            break;
                        }
                    }
                }
                
                // Check for outgoing messages from our channel
                message = self.receiver.recv() => {
                    match message {
                        Some(ws_message) => {
                            let message = match serde_json::to_string(&ws_message) {
                                Ok(json) => Message::Text(json),
                                Err(e) => {
                                    error!("Failed to serialize message: {}", e);
                                    continue;
                                }
                            };

                            if let Err(e) = self.websocket.send(message).await {
                                error!("Failed to send WebSocket message: {}", e);
                                break;
                            }
                        }
                        None => {
                            info!("Receiver channel closed");
                            break;
                        }
                    }
                }
                
                // Periodic heartbeat check
                _ = interval.tick() => {
                    // Check if connection is stale
                    if self.is_stale(30).await {
                        warn!("Connection {} is stale, closing", self.id);
                        break;
                    }
                }
            }
        }

        info!("Agent connection {} handler completed", self.id);
        Ok(())
    }

    /// Handle incoming text messages
    async fn handle_text_message(&mut self, text: &str) -> BackendAgentResult<()> {
        debug!("Received text message from connection {}: {}", self.id, text);

        let message: WebSocketMessage = serde_json::from_str(text)
            .map_err(|e| crate::error::BackendAgentError::Serialization(e))?;

        match message.message_type.as_str() {
            "hello" => {
                let hello_msg: HelloMessage = serde_json::from_value(message.payload.clone())
                    .map_err(|e| crate::error::BackendAgentError::Serialization(e))?;
                self.handle_hello_message(hello_msg).await?;
            }
            "telemetry" => {
                let telemetry_msg: TelemetryMessage = serde_json::from_value(message.payload.clone())
                    .map_err(|e| crate::error::BackendAgentError::Serialization(e))?;
                self.handle_telemetry_message(telemetry_msg).await?;
            }
            "result" => {
                let result_msg: ResultMessage = serde_json::from_value(message.payload.clone())
                    .map_err(|e| crate::error::BackendAgentError::Serialization(e))?;
                self.handle_result_message(result_msg).await?;
            }
            "heartbeat" => {
                let heartbeat_msg: HeartbeatMessage = serde_json::from_value(message.payload.clone())
                    .map_err(|e| crate::error::BackendAgentError::Serialization(e))?;
                self.handle_heartbeat_message(heartbeat_msg).await?;
            }
            _ => {
                warn!("Unknown message type received from connection {}: {}", self.id, message.message_type);
            }
        }

        Ok(())
    }

    /// Handle incoming binary messages
    async fn handle_binary_message(&mut self, data: &[u8]) -> BackendAgentResult<()> {
        debug!("Received binary message from connection {}: {} bytes", self.id, data.len());
        
        // For now, we'll just log binary messages
        // In the future, this could handle file uploads or other binary data
        warn!("Binary messages not yet implemented for connection {}", self.id);
        
        Ok(())
    }

    /// Handle hello message (agent authentication)
    async fn handle_hello_message(&mut self, hello_msg: HelloMessage) -> BackendAgentResult<()> {
        info!("Processing hello message from connection {}: agent_id={}", self.id, hello_msg.agent_id);

        // Validate the hello message
        if hello_msg.agent_id.is_empty() {
            return Err(crate::error::BackendAgentError::Validation(
                "Agent ID cannot be empty".to_string(),
            ));
        }

        // Create agent info from hello message
        let agent_info = AgentInfo {
            id: Uuid::new_v4(),
            agent_id: hello_msg.agent_id.clone(),
            site: hello_msg.site.clone(),
            status: crate::data::models::AgentStatus::Online,
            capabilities: hello_msg.supported_verbs.clone(),
            version: hello_msg.agent_version.clone(),
            os: hello_msg.os.clone(),
            kernel: hello_msg.kernel.clone(),
            container_engine: hello_msg.container_engine.clone(),
            last_seen: chrono::Utc::now(),
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
            connection_info: None, // Will be set when connection is established
        };

        // Store agent info
        {
            let mut info = self.agent_info.write().await;
            *info = Some(agent_info.clone());
        }

        // Mark as authenticated
        {
            let mut auth = self.is_authenticated.write().await;
            *auth = true;
        }

        info!("Agent {} authenticated successfully on connection {}", hello_msg.agent_id, self.id);

        // Send welcome message back
        let welcome_msg = WebSocketMessage {
            message_type: "hello".to_string(),
            payload: serde_json::to_value(HelloMessage {
                agent_id: hello_msg.agent_id.clone(),
                site: hello_msg.site.clone(),
                agent_version: hello_msg.agent_version.clone(),
                os: hello_msg.os.clone(),
                kernel: hello_msg.kernel.clone(),
                container_engine: hello_msg.container_engine.clone(),
                supported_verbs: hello_msg.supported_verbs.clone(),
                start_time: hello_msg.start_time,
                feature_flags: hello_msg.feature_flags.clone(),
            }).unwrap(),
            timestamp: chrono::Utc::now(),
            correlation_id: None,
        };

        if let Err(e) = self.sender.send(welcome_msg) {
            error!("Failed to send welcome message: {}", e);
        }

        Ok(())
    }

    /// Handle telemetry message
    async fn handle_telemetry_message(&mut self, telemetry_msg: TelemetryMessage) -> BackendAgentResult<()> {
        if !*self.is_authenticated.read().await {
            return Err(crate::error::BackendAgentError::Authentication(
                "Agent not authenticated".to_string(),
            ));
        }

        debug!("Processing telemetry from connection {}: agent_id={}", self.id, telemetry_msg.agent_id);

        // Update last heartbeat
        {
            let mut heartbeat = self.last_heartbeat.write().await;
            *heartbeat = chrono::Utc::now();
        }

        // TODO: Process telemetry data and store in database
        // This will be implemented when we integrate with the telemetry processor

        Ok(())
    }

    /// Handle result message
    async fn handle_result_message(&mut self, result_msg: ResultMessage) -> BackendAgentResult<()> {
        if !*self.is_authenticated.read().await {
            return Err(crate::error::BackendAgentError::Authentication(
                "Agent not authenticated".to_string(),
            ));
        }

        debug!("Processing result from connection {}: correlation_id={}", self.id, result_msg.correlation_id);

        // Update last heartbeat
        {
            let mut heartbeat = self.last_heartbeat.write().await;
            *heartbeat = chrono::Utc::now();
        }

        // TODO: Process command result and store in database
        // This will be implemented when we integrate with the command engine

        Ok(())
    }

    /// Handle heartbeat message
    async fn handle_heartbeat_message(&mut self, _heartbeat_msg: HeartbeatMessage) -> BackendAgentResult<()> {
        if !*self.is_authenticated.read().await {
            return Err(crate::error::BackendAgentError::Authentication(
                "Agent not authenticated".to_string(),
            ));
        }

        debug!("Processing heartbeat from connection {}", self.id);

        // Update last heartbeat
        {
            let mut heartbeat = self.last_heartbeat.write().await;
            *heartbeat = chrono::Utc::now();
        }

        Ok(())
    }

    /// Send a message to the agent
    pub async fn send_message(&self, message: WebSocketMessage) -> BackendAgentResult<()> {
        if let Err(e) = self.sender.send(message) {
            return Err(crate::error::BackendAgentError::WebSocket(
                format!("Failed to send message: {}", e),
            ));
        }
        Ok(())
    }

    /// Get the agent information
    pub async fn get_agent_info(&self) -> Option<AgentInfo> {
        let info = self.agent_info.read().await;
        info.clone()
    }

    /// Check if the connection is authenticated
    pub async fn is_authenticated(&self) -> bool {
        *self.is_authenticated.read().await
    }

    /// Get the last heartbeat time
    pub async fn get_last_heartbeat(&self) -> chrono::DateTime<chrono::Utc> {
        *self.last_heartbeat.read().await
    }

    /// Check if the connection is stale (no heartbeat for threshold)
    pub async fn is_stale(&self, threshold_seconds: i64) -> bool {
        let last_heartbeat = *self.last_heartbeat.read().await;
        let threshold = chrono::Utc::now() - chrono::Duration::seconds(threshold_seconds);
        last_heartbeat < threshold
    }

    /// Close the connection
    pub async fn close(&mut self) -> BackendAgentResult<()> {
        info!("Closing agent connection {}", self.id);
        
        // Close the sender to stop the write task
        drop(self.sender.clone());
        
        // Close the WebSocket
        if let Err(e) = self.websocket.close(None).await {
            error!("Failed to close WebSocket: {}", e);
        }
        
        Ok(())
    }
}
