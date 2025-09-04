use crate::data::models::TelemetryRecord;
use crate::data::DataLayer;
use crate::error::BackendAgentResult;
use std::sync::Arc;
use tracing::{debug, error, info, warn};

pub struct TelemetryStorage {
    data_layer: DataLayer,
}

impl TelemetryStorage {
    pub fn new(data_layer: DataLayer) -> Self {
        Self { data_layer }
    }

    /// Store telemetry data
    pub async fn store_telemetry(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
        debug!("Storing telemetry for agent: {}", telemetry.agent_id);

        self.data_layer.postgres.store_telemetry(telemetry).await?;

        // Also cache latest telemetry in Redis
        let cache_key = format!("telemetry:latest:{}", telemetry.agent_id);
        let telemetry_json = serde_json::to_string(telemetry)
            .map_err(|e| crate::error::BackendAgentError::Serialization(e))?;

        self.data_layer
            .redis
            .set(
                &cache_key,
                &telemetry_json,
                Some(std::time::Duration::from_secs(3600)),
            )
            .await?;

        debug!(
            "Telemetry stored successfully for agent: {}",
            telemetry.agent_id
        );
        Ok(())
    }

    /// Get latest telemetry for an agent
    pub async fn get_latest_telemetry(
        &self,
        agent_id: &str,
    ) -> BackendAgentResult<Option<TelemetryRecord>> {
        debug!("Getting latest telemetry for agent: {}", agent_id);

        // Try Redis cache first
        let cache_key = format!("telemetry:latest:{}", agent_id);
        if let Ok(Some(cached_data)) = self.data_layer.redis.get(&cache_key).await {
            if let Ok(telemetry) = serde_json::from_str::<TelemetryRecord>(&cached_data) {
                debug!("Found cached telemetry for agent: {}", agent_id);
                return Ok(Some(telemetry));
            }
        }

        // Fall back to database
        let telemetry = self
            .data_layer
            .postgres
            .get_latest_telemetry(agent_id)
            .await?;

        // Cache the result
        if let Some(ref telemetry_data) = telemetry {
            let telemetry_json = serde_json::to_string(telemetry_data)
                .map_err(|e| crate::error::BackendAgentError::Serialization(e))?;

            if let Err(e) = self
                .data_layer
                .redis
                .set(
                    &cache_key,
                    &telemetry_json,
                    Some(std::time::Duration::from_secs(3600)),
                )
                .await
            {
                warn!("Failed to cache telemetry for agent {}: {}", agent_id, e);
            }
        }

        debug!("Retrieved telemetry for agent: {}", agent_id);
        Ok(telemetry)
    }

    /// Get telemetry history for an agent
    pub async fn get_telemetry_history(
        &self,
        agent_id: &str,
        limit: Option<usize>,
    ) -> BackendAgentResult<Vec<TelemetryRecord>> {
        debug!(
            "Getting telemetry history for agent: {} (limit: {:?})",
            agent_id, limit
        );

        // For now, we'll use the database directly
        // In the future, we could implement pagination and caching
        let mut telemetry_records = Vec::new();

        // This is a simplified implementation - in a real system, we'd have proper pagination
        match self
            .data_layer
            .postgres
            .get_latest_telemetry(agent_id)
            .await?
        {
            Some(latest) => {
                telemetry_records.push(latest);

                // Apply limit
                if let Some(limit) = limit {
                    telemetry_records.truncate(limit);
                }
            }
            None => {
                debug!("No telemetry found for agent: {}", agent_id);
            }
        }

        debug!(
            "Retrieved {} telemetry records for agent: {}",
            telemetry_records.len(),
            agent_id
        );
        Ok(telemetry_records)
    }

    /// Get telemetry for multiple agents
    pub async fn get_telemetry_for_agents(
        &self,
        agent_ids: &[String],
    ) -> BackendAgentResult<Vec<TelemetryRecord>> {
        debug!("Getting telemetry for {} agents", agent_ids.len());

        let mut all_telemetry = Vec::new();

        for agent_id in agent_ids {
            if let Some(telemetry) = self.get_latest_telemetry(agent_id).await? {
                all_telemetry.push(telemetry);
            }
        }

        debug!(
            "Retrieved telemetry for {} out of {} agents",
            all_telemetry.len(),
            agent_ids.len()
        );
        Ok(all_telemetry)
    }

    /// Clean up old telemetry data
    pub async fn cleanup_old_telemetry(&self, threshold_hours: i64) -> BackendAgentResult<usize> {
        info!(
            "Cleaning up telemetry data older than {} hours",
            threshold_hours
        );

        // This is a placeholder - in a real system, we'd implement proper cleanup
        // For now, we'll just log the action
        warn!("Telemetry cleanup not yet implemented in database layer");

        Ok(0)
    }

    /// Get storage statistics
    pub async fn get_statistics(&self) -> StorageStats {
        // This is a placeholder - in a real system, we'd get actual statistics
        StorageStats {
            total_records: 0,
            records_today: 0,
            average_size_mb: 0.0,
            oldest_record: None,
            newest_record: None,
        }
    }

    /// Batch store telemetry data
    pub async fn batch_store_telemetry(
        &self,
        telemetry_batch: Vec<TelemetryRecord>,
    ) -> BackendAgentResult<usize> {
        info!("Batch storing {} telemetry records", telemetry_batch.len());

        let mut successful_count = 0;

        for telemetry in telemetry_batch {
            if let Err(e) = self.store_telemetry(&telemetry).await {
                error!(
                    "Failed to store telemetry for agent {}: {}",
                    telemetry.agent_id, e
                );
            } else {
                successful_count += 1;
            }
        }

        info!("Successfully stored {} telemetry records", successful_count);
        Ok(successful_count)
    }

    /// Get telemetry summary for an agent
    pub async fn get_telemetry_summary(
        &self,
        agent_id: &str,
    ) -> BackendAgentResult<Option<TelemetrySummary>> {
        debug!("Getting telemetry summary for agent: {}", agent_id);

        if let Some(latest) = self.get_latest_telemetry(agent_id).await? {
            let summary = TelemetrySummary {
                agent_id: agent_id.to_string(),
                last_update: latest.timestamp,
                cpu_usage: latest.cpu_usage,
                memory_usage: latest.memory_usage.used_mb as f64
                    / latest.memory_usage.total_mb as f64
                    * 100.0,
                disk_usage: latest
                    .disk_usage
                    .iter()
                    .map(|d| d.usage_percent)
                    .fold(0.0, |acc, x| acc + x)
                    / latest.disk_usage.len() as f64,
                network_bytes: latest
                    .network_stats
                    .as_ref()
                    .map(|n| n.bytes_received)
                    .unwrap_or(0),
                network_packets: latest
                    .network_stats
                    .as_ref()
                    .map(|n| n.bytes_sent)
                    .unwrap_or(0),
                container_count: latest.container_count.try_into().unwrap(),
                uptime_seconds: 0, // Not available in current model
            };

            debug!("Generated telemetry summary for agent: {}", agent_id);
            Ok(Some(summary))
        } else {
            debug!("No telemetry data found for agent: {}", agent_id);
            Ok(None)
        }
    }
}

#[derive(Debug, Clone, serde::Serialize)]
pub struct StorageStats {
    pub total_records: usize,
    pub records_today: usize,
    pub average_size_mb: f64,
    pub oldest_record: Option<chrono::DateTime<chrono::Utc>>,
    pub newest_record: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Clone, serde::Serialize)]
pub struct TelemetrySummary {
    pub agent_id: String,
    pub last_update: chrono::DateTime<chrono::Utc>,
    pub cpu_usage: f64,
    pub memory_usage: f64,
    pub disk_usage: f64,
    pub network_bytes: u64,
    pub network_packets: u64,
    pub container_count: usize,
    pub uptime_seconds: u64,
}
