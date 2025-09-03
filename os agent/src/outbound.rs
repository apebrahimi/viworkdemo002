use crate::config::Config;
use crate::error::{AgentError, AgentResult};
use std::sync::Arc;
use tokio::sync::{mpsc, RwLock};
use tokio::time::{sleep, Duration};
use tracing::{error, info, warn};

pub mod connection;
pub mod envelope;
pub mod executor;

use connection::ConnectionManager;
use envelope::{CommandEnvelope, ResultEnvelope, TelemetryFrame};
use executor::CommandExecutor;

pub struct OutboundManager {
    config: Config,
    connection_manager: Arc<ConnectionManager>,
    command_executor: Arc<CommandExecutor>,
    telemetry_sender: mpsc::Sender<TelemetryFrame>,
    is_connected: Arc<RwLock<bool>>,
}

impl OutboundManager {
    pub fn new(config: Config) -> Self {
        let (telemetry_sender, telemetry_receiver) = mpsc::channel(100);
        
        let connection_manager = Arc::new(ConnectionManager::new(config.clone()));
        let command_executor = Arc::new(CommandExecutor::new(config.clone()));
        
        let manager = Self {
            config,
            connection_manager,
            command_executor,
            telemetry_sender,
            is_connected: Arc::new(RwLock::new(false)),
        };

        // Start telemetry loop
        let telemetry_receiver = telemetry_receiver;
        let config_clone = manager.config.clone();
        let is_connected_clone = manager.is_connected.clone();
        
        tokio::spawn(async move {
            Self::telemetry_loop(telemetry_receiver, config_clone, is_connected_clone).await;
        });

        manager
    }

    pub async fn start(&self) -> AgentResult<()> {
        info!("Starting outbound connection manager...");
        
        // Validate configuration
        self.validate_config()?;
        
        // Start connection loop
        let connection_manager = self.connection_manager.clone();
        let is_connected = self.is_connected.clone();
        
        tokio::spawn(async move {
            Self::connection_loop(connection_manager, is_connected).await;
        });

        Ok(())
    }

    pub async fn send_telemetry(&self, frame: TelemetryFrame) -> AgentResult<()> {
        self.telemetry_sender
            .send(frame)
            .await
            .map_err(|e| AgentError::InternalError(format!("Failed to send telemetry: {}", e)))?;
        Ok(())
    }

    pub async fn is_connected(&self) -> bool {
        *self.is_connected.read().await
    }

    fn validate_config(&self) -> AgentResult<()> {
        // Check required files exist and have proper permissions
        let cert_path = &self.config.outbound.cert_path;
        let key_path = &self.config.outbound.key_path;
        let trust_bundle = &self.config.outbound.trust_bundle;
        let scripts_root = &self.config.outbound.scripts_root;

        // Check certificate files
        if !std::path::Path::new(cert_path).exists() {
            return Err(AgentError::ConfigurationError(format!(
                "Client certificate not found: {}",
                cert_path
            )));
        }

        if !std::path::Path::new(key_path).exists() {
            return Err(AgentError::ConfigurationError(format!(
                "Client private key not found: {}",
                key_path
            )));
        }

        if !std::path::Path::new(trust_bundle).exists() {
            return Err(AgentError::ConfigurationError(format!(
                "Trust bundle not found: {}",
                trust_bundle
            )));
        }

        // Check scripts directory
        if !std::path::Path::new(scripts_root).exists() {
            return Err(AgentError::ConfigurationError(format!(
                "Scripts root directory not found: {}",
                scripts_root
            )));
        }

        // Check SPKI pin is set
        if self.config.outbound.backend_spki_pin.is_empty() {
            return Err(AgentError::ConfigurationError(
                "VIW_AGENT_BACKEND_SPKI_PIN must be set".to_string(),
            ));
        }

        info!("Outbound configuration validation passed");
        Ok(())
    }

    async fn connection_loop(
        connection_manager: Arc<ConnectionManager>,
        is_connected: Arc<RwLock<bool>>,
    ) {
        let mut backoff = Duration::from_secs(1);
        const MAX_BACKOFF: Duration = Duration::from_secs(30);

        loop {
            info!("Attempting to connect to backend...");
            
            match connection_manager.connect().await {
                Ok(()) => {
                    info!("Successfully connected to backend");
                    *is_connected.write().await = true;
                    
                    // Reset backoff on successful connection
                    backoff = Duration::from_secs(1);
                    
                    // Wait for connection to close
                    connection_manager.wait_for_disconnect().await;
                    *is_connected.write().await = false;
                    warn!("Connection to backend lost");
                }
                Err(e) => {
                    error!("Failed to connect to backend: {}", e);
                    *is_connected.write().await = false;
                }
            }

            // Exponential backoff with jitter
            let jitter = Duration::from_millis(rand::random::<u64>() % 1000);
            let delay = backoff + jitter;
            
            warn!("Reconnecting in {:?}...", delay);
            sleep(delay).await;
            
            // Increase backoff (capped at MAX_BACKOFF)
            backoff = std::cmp::min(backoff * 2, MAX_BACKOFF);
        }
    }

    async fn telemetry_loop(
        mut receiver: mpsc::Receiver<TelemetryFrame>,
        config: Config,
        is_connected: Arc<RwLock<bool>>,
    ) {
        let interval = Duration::from_secs(config.monitoring.collect_interval);
        let mut interval_timer = tokio::time::interval(interval);

        loop {
            // Wait for next telemetry interval
            interval_timer.tick().await;

            // Check if we're connected
            if !*is_connected.read().await {
                continue;
            }

            // Generate telemetry frame
            let _telemetry = TelemetryFrame::new_system_health(&config);
            
            // Send via channel (will be picked up by connection manager)
            if let Err(e) = receiver.try_recv() {
                if e != mpsc::error::TryRecvError::Empty {
                    error!("Telemetry channel error: {:?}", e);
                }
            }
        }
    }
}
