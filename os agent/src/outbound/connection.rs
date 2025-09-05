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
        info!("🚀 [CONNECT] Starting connection to Backend Agent");
        info!("🚀 [CONNECT] Backend URL: {}", self.config.outbound.backend_url);
        info!("🚀 [CONNECT] Agent ID: {}", self.config.outbound.agent_id);
        info!("🚀 [CONNECT] Site: {:?}", self.config.outbound.site);
        
        let url = Url::parse(&self.config.outbound.backend_url)
            .map_err(|e| {
                error!("❌ [CONNECT] Invalid URL: {}", e);
                AgentError::ConnectionError(format!("Invalid URL: {}", e))
            })?;

        info!("🚀 [CONNECT] URL parsed successfully: {}", url);
        info!("🚀 [CONNECT] Attempting WebSocket connection...");

        // For now, we'll use a simple WebSocket connection
        // In production, this should include mTLS client certificates
        let (mut ws_stream, _) = connect_async(url)
            .await
            .map_err(|e| {
                error!("❌ [CONNECT] WebSocket connection failed: {}", e);
                AgentError::ConnectionError(format!("WebSocket connection failed: {}", e))
            })?;

        info!("✅ [CONNECT] WebSocket connection established successfully");
        info!("🚀 [CONNECT] Sending HELLO frame to Backend Agent...");
        
        // Send HELLO frame
        self.send_hello_frame(&mut ws_stream).await?;
        
        info!("🚀 [CONNECT] Starting connection handler...");
        // Start command handling loop
        self.handle_connection(ws_stream).await?;

        info!("🔚 [CONNECT] Connection ended");
        Ok(())
    }

    pub async fn wait_for_disconnect(&self) {
        // Wait for connection to close
        while *self.is_connected.read().await {
            sleep(Duration::from_millis(100)).await;
        }
    }

    async fn send_hello_frame(&self, ws_stream: &mut tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>) -> AgentResult<()> {
        info!("🔗 [HELLO] Starting HELLO frame preparation");
        
        let hello_payload = serde_json::json!({
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
            "start_time": chrono::Utc::now(),
            "feature_flags": {
                "exec_enable": self.config.outbound.feature_exec_enable,
                "inbound_http": self.config.outbound.feature_inbound_http
            }
        });

        info!("🔗 [HELLO] Payload created - Agent ID: {}, Site: {:?}, Version: {}", 
              self.config.outbound.agent_id, 
              self.config.outbound.site, 
              env!("CARGO_PKG_VERSION"));

        let hello_message = serde_json::json!({
            "type": "hello",
            "payload": hello_payload,
            "timestamp": chrono::Utc::now(),
            "correlation_id": null
        });

        info!("🔗 [HELLO] Complete message structure: {}", hello_message);
        
        // Send the HELLO message through the WebSocket
        info!("🔗 [HELLO] Serializing message to JSON...");
        let message_text = serde_json::to_string(&hello_message)
            .map_err(|e| {
                error!("❌ [HELLO] Failed to serialize HELLO message: {}", e);
                AgentError::InternalError(format!("Failed to serialize HELLO message: {}", e))
            })?;
        
        info!("🔗 [HELLO] Message serialized successfully, length: {} bytes", message_text.len());
        info!("🔗 [HELLO] Sending message through WebSocket...");
        
        ws_stream.send(Message::Text(message_text)).await
            .map_err(|e| {
                error!("❌ [HELLO] Failed to send HELLO message through WebSocket: {}", e);
                AgentError::ConnectionError(format!("Failed to send HELLO message: {}", e))
            })?;
        
        info!("✅ [HELLO] HELLO frame sent successfully to Backend Agent");
        info!("🔗 [HELLO] Waiting for Backend Agent response...");
        
        Ok(())
    }

    async fn send_telemetry_frame(&self, ws_stream: &mut tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>, telemetry: TelemetryFrame) -> AgentResult<()> {
        let telemetry_message = serde_json::json!({
            "type": "telemetry",
            "payload": telemetry.payload,
            "timestamp": chrono::Utc::now(),
            "correlation_id": null
        });

        info!("Sending telemetry frame: {}", telemetry_message);
        
        // Send the telemetry message through the WebSocket
        let message_text = serde_json::to_string(&telemetry_message)
            .map_err(|e| AgentError::InternalError(format!("Failed to serialize telemetry message: {}", e)))?;
        
        ws_stream.send(Message::Text(message_text)).await
            .map_err(|e| AgentError::ConnectionError(format!("Failed to send telemetry message: {}", e)))?;
        
        info!("Telemetry frame sent successfully");
        
        Ok(())
    }

    async fn send_telemetry_data(&self, ws_stream: &mut tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>) -> AgentResult<()> {
        info!("📊 [TELEMETRY] Starting telemetry data collection and transmission");
        
        // Create a simple telemetry payload with system information
        let telemetry_payload = serde_json::json!({
            "agent_id": self.config.outbound.agent_id,
            "site": self.config.outbound.site,
            "ts": chrono::Utc::now().to_rfc3339(),
            "uptime_s": 0, // Will be populated from system info
            "cpu_pct": 0.0, // Will be populated from system info
            "mem": {
                "total_mb": 0,
                "used_mb": 0
            },
            "loadavg": [0.0, 0.0, 0.0],
            "disk": [],
            "services": {},
            "containers": {
                "running": 0,
                "total": 0
            },
            "version": {
                "agent_version": env!("CARGO_PKG_VERSION"),
                "os": std::env::consts::OS,
                "kernel": "unknown"
            }
        });

        info!("📊 [TELEMETRY] Payload created - Agent ID: {}, Site: {:?}, Timestamp: {}", 
              self.config.outbound.agent_id, 
              self.config.outbound.site, 
              chrono::Utc::now().to_rfc3339());

        let telemetry_message = serde_json::json!({
            "type": "telemetry",
            "payload": telemetry_payload,
            "timestamp": chrono::Utc::now(),
            "correlation_id": null
        });

        info!("📊 [TELEMETRY] Complete telemetry message structure: {}", telemetry_message);
        
        // Send the telemetry message through the WebSocket
        info!("📊 [TELEMETRY] Serializing telemetry message to JSON...");
        let message_text = serde_json::to_string(&telemetry_message)
            .map_err(|e| {
                error!("❌ [TELEMETRY] Failed to serialize telemetry message: {}", e);
                AgentError::InternalError(format!("Failed to serialize telemetry message: {}", e))
            })?;
        
        info!("📊 [TELEMETRY] Message serialized successfully, length: {} bytes", message_text.len());
        info!("📊 [TELEMETRY] Sending telemetry data through WebSocket...");
        
        ws_stream.send(Message::Text(message_text)).await
            .map_err(|e| {
                error!("❌ [TELEMETRY] Failed to send telemetry message through WebSocket: {}", e);
                AgentError::ConnectionError(format!("Failed to send telemetry message: {}", e))
            })?;
        
        info!("✅ [TELEMETRY] Telemetry data sent successfully to Backend Agent");
        
        Ok(())
    }

    async fn handle_connection(
        &self,
        mut ws_stream: tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>,
    ) -> AgentResult<()> {
        info!("🔗 [CONNECTION] Starting WebSocket connection handler");
        *self.is_connected.write().await = true;
        
        let mut heartbeat_interval = tokio::time::interval(Duration::from_secs(15));
        let mut telemetry_interval = tokio::time::interval(Duration::from_secs(30));
        
        info!("🔗 [CONNECTION] Connection handler initialized - Heartbeat: 15s, Telemetry: 30s");
        info!("🔗 [CONNECTION] Starting main connection loop...");
        
        loop {
            tokio::select! {
                // Handle incoming messages
                message = ws_stream.next() => {
                    match message {
                        Some(Ok(Message::Text(text))) => {
                            info!("📨 [MESSAGE] Received text message from Backend Agent: {} bytes", text.len());
                            info!("📨 [MESSAGE] Message content: {}", text);
                            if let Err(e) = self.handle_message(&text).await {
                                error!("❌ [MESSAGE] Failed to handle message: {}", e);
                            } else {
                                info!("✅ [MESSAGE] Message handled successfully");
                            }
                        }
                        Some(Ok(Message::Binary(data))) => {
                            info!("📨 [MESSAGE] Received binary message from Backend Agent: {} bytes", data.len());
                            if let Err(e) = self.handle_binary_message(&data).await {
                                error!("❌ [MESSAGE] Failed to handle binary message: {}", e);
                            } else {
                                info!("✅ [MESSAGE] Binary message handled successfully");
                            }
                        }
                        Some(Ok(Message::Ping(data))) => {
                            info!("🏓 [PING] Received ping from Backend Agent: {} bytes", data.len());
                            if let Err(e) = ws_stream.send(Message::Pong(data)).await {
                                error!("❌ [PING] Failed to send pong: {}", e);
                                break;
                            } else {
                                info!("✅ [PING] Pong sent successfully");
                            }
                        }
                        Some(Ok(Message::Pong(_))) => {
                            info!("🏓 [PONG] Received pong from Backend Agent");
                        }
                        Some(Ok(Message::Close(_))) => {
                            info!("🔚 [CLOSE] Received close frame from Backend Agent");
                            break;
                        }
                        Some(Err(e)) => {
                            error!("❌ [ERROR] WebSocket error: {}", e);
                            break;
                        }
                        None => {
                            info!("🔚 [END] WebSocket stream ended");
                            break;
                        }
                        _ => {
                            info!("📨 [MESSAGE] Received other message type");
                        }
                    }
                }
                
                // Send heartbeat
                _ = heartbeat_interval.tick() => {
                    info!("🏓 [HEARTBEAT] Sending heartbeat to Backend Agent...");
                    if let Err(e) = ws_stream.send(Message::Ping(vec![])).await {
                        error!("❌ [HEARTBEAT] Failed to send heartbeat: {}", e);
                        break;
                    } else {
                        info!("✅ [HEARTBEAT] Heartbeat sent successfully");
                    }
                }
                
                // Send telemetry
                _ = telemetry_interval.tick() => {
                    info!("📊 [TELEMETRY] Telemetry interval triggered");
                    if let Err(e) = self.send_telemetry_data(&mut ws_stream).await {
                        error!("❌ [TELEMETRY] Failed to send telemetry: {}", e);
                        // Don't break on telemetry errors, just log them
                    } else {
                        info!("✅ [TELEMETRY] Telemetry sent successfully");
                    }
                }
            }
        }
        
        info!("🔚 [CONNECTION] Connection handler ending, marking as disconnected");
        *self.is_connected.write().await = false;
        Ok(())
    }

    async fn handle_message(&self, text: &str) -> AgentResult<()> {
        info!("📨 [HANDLER] Processing incoming message from Backend Agent");
        info!("📨 [HANDLER] Raw message: {}", text);
        
        let message: Value = serde_json::from_str(text)
            .map_err(|e| {
                error!("❌ [HANDLER] Failed to parse message JSON: {}", e);
                AgentError::InternalError(format!("Invalid JSON: {}", e))
            })?;
        
        info!("📨 [HANDLER] Message parsed successfully");
        
        match message["type"].as_str() {
            Some("hello") => {
                info!("✅ [HANDLER] Received HELLO response from Backend Agent");
                if let Some(payload) = message.get("payload") {
                    info!("📨 [HANDLER] HELLO payload: {}", payload);
                }
            }
            Some("COMMAND") => {
                info!("📨 [HANDLER] Received COMMAND from Backend Agent");
                if let Some(payload) = message.get("payload") {
                    info!("📨 [HANDLER] Command payload: {}", payload);
                }
                self.handle_command(&message).await?;
            }
            Some("PING") => {
                info!("🏓 [HANDLER] Received PING from Backend Agent (already handled in main loop)");
            }
            Some("telemetry") => {
                info!("📨 [HANDLER] Received TELEMETRY response from Backend Agent");
            }
            Some(unknown_type) => {
                warn!("⚠️ [HANDLER] Unknown message type: {}", unknown_type);
            }
            None => {
                warn!("⚠️ [HANDLER] Message missing type field");
            }
        }
        
        info!("✅ [HANDLER] Message processing completed");
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
