use crate::config::Config;
use crate::data::models::{AgentInfo, NetworkStats, TelemetryMessage, TelemetryRecord};
use crate::data::DataLayer;
use crate::error::BackendAgentResult;
use crate::telemetry::{TelemetryAnalytics, TelemetryStorage};
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::{mpsc, RwLock};
use tracing::{debug, error, info, warn};
use uuid::Uuid;

pub struct TelemetryProcessor {
    config: Config,
    data_layer: DataLayer,
    storage: Arc<TelemetryStorage>,
    analytics: Arc<TelemetryAnalytics>,
    telemetry_queue: Arc<mpsc::UnboundedSender<TelemetryMessage>>,
    telemetry_receiver: Arc<RwLock<Option<mpsc::UnboundedReceiver<TelemetryMessage>>>>,
    is_running: Arc<RwLock<bool>>,
}

impl TelemetryProcessor {
    pub async fn new(config: Config, data_layer: DataLayer) -> BackendAgentResult<Self> {
        info!("Initializing Telemetry Processor...");

        let storage = Arc::new(TelemetryStorage::new(data_layer.clone()));
        let analytics = Arc::new(TelemetryAnalytics::new(data_layer.clone()));

        let (sender, receiver) = mpsc::unbounded_channel();
        let telemetry_queue = Arc::new(sender);
        let telemetry_receiver = Arc::new(RwLock::new(Some(receiver)));
        let is_running = Arc::new(RwLock::new(false));

        let processor = Self {
            config,
            data_layer,
            storage,
            analytics,
            telemetry_queue,
            telemetry_receiver,
            is_running,
        };

        info!("Telemetry Processor initialized successfully");
        Ok(processor)
    }

    /// Start the telemetry processor
    pub async fn start(&self) -> BackendAgentResult<()> {
        info!("Starting Telemetry Processor...");

        {
            let mut running = self.is_running.write().await;
            *running = true;
        }

        info!("Telemetry Processor started successfully");
        Ok(())
    }

    /// Stop the telemetry processor
    pub async fn stop(&self) -> BackendAgentResult<()> {
        info!("Stopping Telemetry Processor...");

        {
            let mut running = self.is_running.write().await;
            *running = false;
        }

        info!("Telemetry Processor stopped successfully");
        Ok(())
    }

    /// Process a telemetry message
    pub async fn process_telemetry(
        &self,
        telemetry_msg: TelemetryMessage,
    ) -> BackendAgentResult<()> {
        info!(
            "Processing telemetry from agent: {}",
            telemetry_msg.agent_id
        );

        // Convert telemetry message to record
        let telemetry_record = TelemetryRecord {
            id: Uuid::new_v4(),
            agent_id: telemetry_msg.agent_id.clone(),
            timestamp: telemetry_msg.timestamp,
            cpu_usage: telemetry_msg.cpu_percent,
            memory_usage: telemetry_msg.memory.clone(),
            disk_usage: telemetry_msg.disk.clone(),
            load_average: telemetry_msg.load_average.clone(),
            container_count: telemetry_msg
                .containers
                .as_object()
                .map(|o| o.len() as i32)
                .unwrap_or(0),
            service_status: telemetry_msg.services.clone(),
            network_stats: telemetry_msg
                .version
                .as_object()
                .and_then(|v| v.get("network").cloned())
                .map(|n| {
                    // Convert the network info to NetworkStats if possible
                    serde_json::from_value(n).unwrap_or_else(|_| NetworkStats {
                        bytes_sent: 0,
                        bytes_received: 0,
                        packets_sent: 0,
                        packets_received: 0,
                        connections_active: 0,
                    })
                }),
            created_at: chrono::Utc::now(),
        };

        // Store telemetry data
        self.storage.store_telemetry(&telemetry_record).await?;

        // Process analytics
        self.analytics.process_telemetry(&telemetry_record).await?;

        info!(
            "Telemetry from agent {} processed successfully",
            telemetry_msg.agent_id
        );
        Ok(())
    }

    /// Queue telemetry for processing
    pub async fn queue_telemetry(&self, telemetry_msg: TelemetryMessage) -> BackendAgentResult<()> {
        if let Err(e) = self.telemetry_queue.send(telemetry_msg) {
            return Err(crate::error::BackendAgentError::Internal(format!(
                "Failed to queue telemetry: {}",
                e
            )));
        }
        Ok(())
    }

    /// Run the telemetry processing loop
    pub async fn run_processing_loop(&self) -> BackendAgentResult<()> {
        info!("Starting telemetry processing loop...");

        let mut receiver = {
            let mut receiver_guard = self.telemetry_receiver.write().await;
            receiver_guard.take().ok_or_else(|| {
                crate::error::BackendAgentError::Internal(
                    "Telemetry receiver already taken".to_string(),
                )
            })?
        };

        while *self.is_running.read().await {
            match receiver.recv().await {
                Some(telemetry_msg) => {
                    if let Err(e) = self.process_telemetry(telemetry_msg).await {
                        error!("Failed to process telemetry: {}", e);
                    }
                }
                None => {
                    info!("Telemetry queue closed");
                    break;
                }
            }
        }

        info!("Telemetry processing loop stopped");
        Ok(())
    }

    /// Get telemetry statistics
    pub async fn get_statistics(&self) -> TelemetryStats {
        let storage_stats = self.storage.get_statistics().await;
        let analytics_stats = self.analytics.get_statistics().await;

        TelemetryStats {
            storage: storage_stats,
            analytics: analytics_stats,
        }
    }

    /// Get latest telemetry for an agent
    pub async fn get_latest_telemetry(
        &self,
        agent_id: &str,
    ) -> BackendAgentResult<Option<TelemetryRecord>> {
        self.storage.get_latest_telemetry(agent_id).await
    }

    /// Get telemetry history for an agent
    pub async fn get_telemetry_history(
        &self,
        agent_id: &str,
        limit: Option<usize>,
    ) -> BackendAgentResult<Vec<TelemetryRecord>> {
        self.storage.get_telemetry_history(agent_id, limit).await
    }

    /// Run background tasks
    pub async fn run_background_tasks(&self) -> BackendAgentResult<()> {
        info!("Starting Telemetry Processor background tasks...");

        let storage = self.storage.clone();
        let analytics = self.analytics.clone();

        // Cleanup task
        let cleanup_task = {
            let storage = storage.clone();
            tokio::spawn(async move {
                let mut interval = tokio::time::interval(Duration::from_secs(3600)); // Every hour

                loop {
                    interval.tick().await;

                    if let Err(e) = storage.cleanup_old_telemetry(7 * 24).await {
                        // 7 days
                        error!("Telemetry cleanup failed: {}", e);
                    }
                }
            })
        };

        // Analytics task
        let analytics_task = {
            tokio::spawn(async move {
                let mut interval = tokio::time::interval(Duration::from_secs(300)); // Every 5 minutes

                loop {
                    interval.tick().await;

                    if let Err(e) = analytics.run_analytics().await {
                        error!("Analytics processing failed: {}", e);
                    }
                }
            })
        };

        // Wait for tasks
        tokio::select! {
            _ = cleanup_task => {
                error!("Cleanup task stopped unexpectedly");
            }
            _ = analytics_task => {
                error!("Analytics task stopped unexpectedly");
            }
        }

        Ok(())
    }
}

#[derive(Debug, Clone, serde::Serialize)]
pub struct TelemetryStats {
    pub storage: crate::telemetry::storage::StorageStats,
    pub analytics: crate::telemetry::analytics::AnalyticsStats,
}
