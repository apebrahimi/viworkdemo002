use crate::config::Config;
use crate::error::{AgentError, AgentResult};
use crate::outbound::envelope::{CommandEnvelope, ResultEnvelope, TelemetryFrame};
use crate::outbound::executor::CommandExecutor;
use serde_json::Value;
use std::sync::Arc;
use tokio::sync::{mpsc, RwLock};
use tokio::time::{sleep, Duration};
use tokio_tungstenite::{connect_async, tungstenite::Message};
use tracing::{error, info, warn};
use url::Url;
use futures_util::{SinkExt, StreamExt};

#[derive(Debug)]
pub struct ConnectionManager {
    config: Config,
    command_executor: Arc<CommandExecutor>,
    telemetry_receiver: Option<mpsc::Receiver<TelemetryFrame>>,
    is_connected: Arc<RwLock<bool>>,
    nonce_cache: Arc<RwLock<std::collections::HashMap<String, u64>>>,
}

impl ConnectionManager {
    pub fn new(config: Config) -> Self {
        let command_executor = Arc::new(CommandExecutor::new(config.clone()));
        
        Self {
            config,
            command_executor,
            telemetry_receiver: None,
            is_connected: Arc::new(RwLock::new(false)),
            nonce_cache: Arc::new(RwLock::new(std::collections::HashMap::new())),
        }
    }

    pub async fn connect(&self) -> AgentResult<()> {
        info!("Connecting to backend at {}", self.config.outbound.backend_url);
        
        let url = Url::parse(&self.config.outbound.backend_url)
            .map_err(|e| AgentError::ConnectionError(format!("Invalid URL: {}", e)))?;

        // For now, we'll use a simple WebSocket connection
        // In production, this should include mTLS client certificates
        let (ws_stream, _) = connect_async(url)
            .await
            .map_err(|e| AgentError::ConnectionError(format!("WebSocket connection failed: {}", e)))?;

        info!("WebSocket connection established");
        
        // Send HELLO frame
        self.send_hello_frame(&ws_stream).await?;
        
        // Start command handling loop
        self.handle_connection(ws_stream).await?;

        Ok(())
    }

    pub async fn wait_for_disconnect(&self) {
        // Wait for connection to close
        while *self.is_connected.read().await {
            sleep(Duration::from_millis(100)).await;
        }
    }

    async fn send_hello_frame(&self, _ws_stream: &tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>) -> AgentResult<()> {
        let hello_frame = serde_json::json!({
            "type": "HELLO",
            "payload": {
                "agent_id": self.config.outbound.agent_id,
                "site": self.config.outbound.site,
                "agent_version": env!("CARGO_PKG_VERSION"),
                "os": std::env::consts::OS,
                "kernel": "unknown", // Will be populated from system info
                "container_engine": self.config.outbound.container_engine,
                "supported_verbs": [
                    "create_panel_user",
                    "create_openvpn_user", 
                    "delete_user",
                    "list_users",
                    "terminate_session",
                    "get_session_status",
                    "spawn_container",
                    "stop_container",
                    "list_containers",
                    "get_system_health",
                    "get_service_status",
                    "generate_bootstrap",
                    "revoke_bootstrap",
                    "get_monitoring_data"
                ],
                "start_time": chrono::Utc::now().to_rfc3339(),
                "feature_flags": {
                    "exec_enable": self.config.outbound.feature_exec_enable,
                    "inbound_http": self.config.outbound.feature_inbound_http
                }
            }
        });

        info!("Sending HELLO frame: {}", hello_frame);
        
        // In a real implementation, we would send this via the WebSocket
        // For now, we'll just log it
        
        Ok(())
    }

    async fn handle_connection(
        &self,
        mut ws_stream: tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>,
    ) -> AgentResult<()> {
        *self.is_connected.write().await = true;
        
        let mut heartbeat_interval = tokio::time::interval(Duration::from_secs(15));
        
        loop {
            tokio::select! {
                // Handle incoming messages
                message = ws_stream.next() => {
                    match message {
                        Some(Ok(Message::Text(text))) => {
                            if let Err(e) = self.handle_message(&text).await {
                                error!("Failed to handle message: {}", e);
                            }
                        }
                        Some(Ok(Message::Binary(data))) => {
                            if let Err(e) = self.handle_binary_message(&data).await {
                                error!("Failed to handle binary message: {}", e);
                            }
                        }
                        Some(Ok(Message::Ping(data))) => {
                            if let Err(e) = ws_stream.send(Message::Pong(data)).await {
                                error!("Failed to send pong: {}", e);
                                break;
                            }
                        }
                        Some(Ok(Message::Close(_))) => {
                            info!("Received close frame from backend");
                            break;
                        }
                        Some(Err(e)) => {
                            error!("WebSocket error: {}", e);
                            break;
                        }
                        None => {
                            info!("WebSocket stream ended");
                            break;
                        }
                        _ => {}
                    }
                }
                
                // Send heartbeat
                _ = heartbeat_interval.tick() => {
                    if let Err(e) = ws_stream.send(Message::Ping(vec![])).await {
                        error!("Failed to send heartbeat: {}", e);
                        break;
                    }
                }
            }
        }
        
        *self.is_connected.write().await = false;
        Ok(())
    }

    async fn handle_message(&self, text: &str) -> AgentResult<()> {
        info!("Received message: {}", text);
        
        let message: Value = serde_json::from_str(text)
            .map_err(|e| AgentError::InternalError(format!("Invalid JSON: {}", e)))?;
        
        match message["type"].as_str() {
            Some("COMMAND") => {
                self.handle_command(&message).await?;
            }
            Some("PING") => {
                // Handle ping (already handled in main loop)
            }
            Some(unknown_type) => {
                warn!("Unknown message type: {}", unknown_type);
            }
            None => {
                warn!("Message missing type field");
            }
        }
        
        Ok(())
    }

    async fn handle_binary_message(&self, _data: &[u8]) -> AgentResult<()> {
        // Handle binary messages if needed
        Ok(())
    }

    async fn handle_command(&self, message: &Value) -> AgentResult<()> {
        let command_envelope: CommandEnvelope = serde_json::from_value(message.clone())
            .map_err(|e| AgentError::InternalError(format!("Invalid command envelope: {}", e)))?;
        
        let command_payload = command_envelope.parse_payload()
            .map_err(|e| AgentError::InternalError(format!("Failed to parse command payload: {}", e)))?;
        
        // Validate command
        if let Err(e) = self.validate_command(&command_payload).await {
            let _result = ResultEnvelope::new(
                &command_payload.corr_id,
                &self.config.outbound.agent_id,
                &command_payload.verb,
                crate::outbound::envelope::CommandStatus::Denied,
                -1,
                0,
                "",
                &e,
                Some(crate::outbound::envelope::ErrorCode::ValidationFailed),
            );
            
            // Send result back (in real implementation)
            info!("Command validation failed: {}", e);
            return Ok(());
        }
        
        // Check nonce replay
        if !self.check_nonce(&command_payload.nonce).await {
            let _result = ResultEnvelope::new(
                &command_payload.corr_id,
                &self.config.outbound.agent_id,
                &command_payload.verb,
                crate::outbound::envelope::CommandStatus::Denied,
                -1,
                0,
                "",
                "Nonce replay detected",
                Some(crate::outbound::envelope::ErrorCode::ReplayDetected),
            );
            
            info!("Nonce replay detected for command: {}", command_payload.corr_id);
            return Ok(());
        }
        
        // Execute command
        let start_time = std::time::Instant::now();
        let result = self.command_executor.execute_command(&command_payload.verb, command_payload.args.clone()).await;
        let duration_ms = start_time.elapsed().as_millis() as u64;
        
        // Create result envelope
        let _result_envelope = match result {
            Ok(data) => {
                let stdout = serde_json::to_string(&data).unwrap_or_else(|_| "{}".to_string());
                ResultEnvelope::new(
                    &command_payload.corr_id,
                    &self.config.outbound.agent_id,
                    &command_payload.verb,
                    crate::outbound::envelope::CommandStatus::Success,
                    0,
                    duration_ms,
                    &stdout,
                    "",
                    None,
                )
            }
            Err(e) => {
                let error_msg = format!("Command execution failed: {}", e);
                ResultEnvelope::new(
                    &command_payload.corr_id,
                    &self.config.outbound.agent_id,
                    &command_payload.verb,
                    crate::outbound::envelope::CommandStatus::Error,
                    -1,
                    duration_ms,
                    "",
                    &error_msg,
                    Some(crate::outbound::envelope::ErrorCode::ValidationFailed),
                )
            }
        };
        
        // Store nonce to prevent replay
        self.store_nonce(&command_payload.nonce).await;
        
        // Send result back (in real implementation)
        info!("Command executed successfully: {} in {}ms", command_payload.verb, duration_ms);
        
        Ok(())
    }

    async fn validate_command(&self, payload: &crate::outbound::envelope::CommandPayload) -> Result<(), String> {
        // Check if execution is enabled
        if !self.config.outbound.feature_exec_enable {
            return Err("Command execution is disabled".to_string());
        }
        
        // Check if this agent is targeted
        if !payload.agent_targets.contains(&self.config.outbound.agent_id) {
            return Err("Command not targeted for this agent".to_string());
        }
        
        // Validate using the envelope validation function
        let allowed_verbs = vec![
            "create_panel_user",
            "create_openvpn_user", 
            "delete_user",
            "list_users",
            "terminate_session",
            "get_session_status",
            "spawn_container",
            "stop_container",
            "list_containers",
            "get_system_health",
            "get_service_status",
            "generate_bootstrap",
            "revoke_bootstrap",
            "get_monitoring_data"
        ];
        
        crate::outbound::envelope::validate_command_payload(payload, &allowed_verbs)
    }

    async fn check_nonce(&self, nonce: &str) -> bool {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs();
        
        // Clean expired nonces and check if nonce exists
        let mut cache = self.nonce_cache.write().await;
        cache.retain(|_, timestamp| now - *timestamp < 120); // 2 minute window
        
        // Check if nonce exists
        !cache.contains_key(nonce)
    }

    async fn store_nonce(&self, nonce: &str) {
        let mut cache = self.nonce_cache.write().await;
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs();
        
        cache.insert(nonce.to_string(), now);
        
        // Limit cache size
        if cache.len() > 10000 {
            // Collect entries to remove
            let mut entries: Vec<_> = cache.iter().collect();
            entries.sort_by_key(|(_, timestamp)| *timestamp);
            
            let to_remove: Vec<String> = entries.iter()
                .take(entries.len() - 10000)
                .map(|(key, _)| (*key).clone())
                .collect();
            
            // Remove entries
            for key in to_remove {
                cache.remove(&key);
            }
        }
    }
}
