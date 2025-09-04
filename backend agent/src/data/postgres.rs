use crate::config::DatabaseConfig;
use crate::error::BackendAgentError;
use crate::data::models::*;
use sqlx::{postgres::PgPoolOptions, PgPool, Row};
use std::time::Duration;
use tracing::{error, info, warn};

#[derive(Debug)]
pub struct PostgresClient {
    pub pool: sqlx::PgPool,
    pub config: DatabaseConfig,
}

impl PostgresClient {
    pub async fn new(config: &DatabaseConfig) -> Result<Self, BackendAgentError> {
        info!("Initializing PostgreSQL connection pool...");

        let pool = PgPoolOptions::new()
            .max_connections(config.max_connections)
            .min_connections(config.min_connections)
            .acquire_timeout(Duration::from_secs(config.connect_timeout))
            .idle_timeout(Duration::from_secs(config.idle_timeout))
            .max_lifetime(Duration::from_secs(config.max_lifetime))
            .connect(&config.url)
            .await
            .map_err(|e| {
                error!("Failed to connect to PostgreSQL: {}", e);
                BackendAgentError::Database(e)
            })?;

        info!("PostgreSQL connection pool initialized successfully");

        // Test the connection
        let _ = sqlx::query("SELECT 1")
            .fetch_one(&pool)
            .await
            .map_err(|e| {
                error!("Failed to test PostgreSQL connection: {}", e);
                BackendAgentError::Database(e)
            })?;

        info!("PostgreSQL connection test successful");

        Ok(Self {
            pool,
            config: config.clone(),
        })
    }

    pub async fn health_check(&self) -> Result<(), BackendAgentError> {
        let _ = sqlx::query("SELECT 1")
            .fetch_one(&self.pool)
            .await
            .map_err(|e| {
                error!("PostgreSQL health check failed: {}", e);
                BackendAgentError::Database(e)
            })?;

        Ok(())
    }

    pub async fn close(&self) -> Result<(), BackendAgentError> {
        info!("Closing PostgreSQL connection pool...");
        self.pool.close().await;
        info!("PostgreSQL connection pool closed");
        Ok(())
    }

    pub fn get_pool(&self) -> &PgPool {
        &self.pool
    }

    // ============================================================================
    // Database Schema Management
    // ============================================================================

    pub async fn initialize_schema(&self) -> Result<(), BackendAgentError> {
        info!("Initializing database schema...");

        // Create agents table
        self.create_agents_table().await?;

        // Create commands table
        self.create_commands_table().await?;

        // Create telemetry table
        self.create_telemetry_table().await?;

        // Create audit_logs table
        self.create_audit_logs_table().await?;

        // Create indexes
        self.create_indexes().await?;

        info!("Database schema initialized successfully");
        Ok(())
    }

    async fn create_agents_table(&self) -> Result<(), BackendAgentError> {
        let sql = r#"
            CREATE TABLE IF NOT EXISTS agents (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                agent_id VARCHAR(255) UNIQUE NOT NULL,
                site VARCHAR(255) NOT NULL,
                status VARCHAR(50) NOT NULL DEFAULT 'offline',
                capabilities TEXT[] NOT NULL DEFAULT '{}',
                version VARCHAR(100) NOT NULL,
                os VARCHAR(100) NOT NULL,
                kernel VARCHAR(255),
                container_engine VARCHAR(100),
                last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                connection_info JSONB
            )
        "#;

        sqlx::query(sql)
            .execute(&self.pool)
            .await
            .map_err(|e| {
                error!("Failed to create agents table: {}", e);
                BackendAgentError::Database(e)
            })?;

        Ok(())
    }

    async fn create_commands_table(&self) -> Result<(), BackendAgentError> {
        let sql = r#"
            CREATE TABLE IF NOT EXISTS commands (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                correlation_id VARCHAR(255) UNIQUE NOT NULL,
                verb VARCHAR(255) NOT NULL,
                args JSONB NOT NULL,
                agent_targets TEXT[] NOT NULL,
                actor JSONB NOT NULL,
                status VARCHAR(50) NOT NULL DEFAULT 'pending',
                priority VARCHAR(50) NOT NULL DEFAULT 'normal',
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                scheduled_at TIMESTAMP WITH TIME ZONE,
                executed_at TIMESTAMP WITH TIME ZONE,
                completed_at TIMESTAMP WITH TIME ZONE,
                result JSONB,
                retry_count INTEGER NOT NULL DEFAULT 0,
                max_retries INTEGER NOT NULL DEFAULT 3,
                error_message TEXT
            )
        "#;

        sqlx::query(sql)
            .execute(&self.pool)
            .await
            .map_err(|e| {
                error!("Failed to create commands table: {}", e);
                BackendAgentError::Database(e)
            })?;

        Ok(())
    }

    async fn create_telemetry_table(&self) -> Result<(), BackendAgentError> {
        let sql = r#"
            CREATE TABLE IF NOT EXISTS telemetry (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                agent_id VARCHAR(255) NOT NULL,
                timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
                cpu_usage DOUBLE PRECISION NOT NULL,
                memory_usage JSONB NOT NULL,
                disk_usage JSONB NOT NULL,
                load_average DOUBLE PRECISION[] NOT NULL,
                container_count INTEGER NOT NULL DEFAULT 0,
                service_status JSONB NOT NULL DEFAULT '{}',
                network_stats JSONB,
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
            )
        "#;

        sqlx::query(sql)
            .execute(&self.pool)
            .await
            .map_err(|e| {
                error!("Failed to create telemetry table: {}", e);
                BackendAgentError::Database(e)
            })?;

        Ok(())
    }

    async fn create_audit_logs_table(&self) -> Result<(), BackendAgentError> {
        let sql = r#"
            CREATE TABLE IF NOT EXISTS audit_logs (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                level VARCHAR(50) NOT NULL,
                category VARCHAR(255) NOT NULL,
                action VARCHAR(255) NOT NULL,
                actor VARCHAR(255),
                resource_type VARCHAR(255),
                resource_id VARCHAR(255),
                details JSONB NOT NULL DEFAULT '{}',
                ip_address INET,
                user_agent TEXT,
                correlation_id VARCHAR(255)
            )
        "#;

        sqlx::query(sql)
            .execute(&self.pool)
            .await
            .map_err(|e| {
                error!("Failed to create audit_logs table: {}", e);
                BackendAgentError::Database(e)
            })?;

        Ok(())
    }

    async fn create_indexes(&self) -> Result<(), BackendAgentError> {
        // Create indexes for better query performance
        let indexes = vec![
            "CREATE INDEX IF NOT EXISTS idx_agents_agent_id ON agents(agent_id)",
            "CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status)",
            "CREATE INDEX IF NOT EXISTS idx_agents_site ON agents(site)",
            "CREATE INDEX IF NOT EXISTS idx_agents_last_seen ON agents(last_seen)",
            "CREATE INDEX IF NOT EXISTS idx_commands_correlation_id ON commands(correlation_id)",
            "CREATE INDEX IF NOT EXISTS idx_commands_status ON commands(status)",
            "CREATE INDEX IF NOT EXISTS idx_commands_verb ON commands(verb)",
            "CREATE INDEX IF NOT EXISTS idx_commands_created_at ON commands(created_at)",
            "CREATE INDEX IF NOT EXISTS idx_telemetry_agent_id ON telemetry(agent_id)",
            "CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp ON telemetry(timestamp)",
            "CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp)",
            "CREATE INDEX IF NOT EXISTS idx_audit_logs_level ON audit_logs(level)",
            "CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON audit_logs(category)",
        ];

        for sql in indexes {
            if let Err(e) = sqlx::query(sql).execute(&self.pool).await {
                warn!("Failed to create index: {}", e);
            }
        }

        Ok(())
    }

    // ============================================================================
    // Agent Management Queries
    // ============================================================================

    pub async fn upsert_agent(&self, agent: &AgentInfo) -> Result<(), BackendAgentError> {
        let sql = r#"
            INSERT INTO agents (
                agent_id, site, status, capabilities, version, os, kernel, 
                container_engine, last_seen, connection_info
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (agent_id) DO UPDATE SET
                status = EXCLUDED.status,
                capabilities = EXCLUDED.capabilities,
                version = EXCLUDED.version,
                os = EXCLUDED.os,
                kernel = EXCLUDED.kernel,
                container_engine = EXCLUDED.container_engine,
                last_seen = EXCLUDED.last_seen,
                connection_info = EXCLUDED.connection_info,
                updated_at = NOW()
        "#;

        let connection_info = serde_json::to_value(&agent.connection_info)
            .map_err(|e| BackendAgentError::Serialization(e))?;

        sqlx::query(sql)
            .bind(&agent.agent_id)
            .bind(&agent.site)
            .bind(&agent.status)
            .bind(&agent.capabilities)
            .bind(&agent.version)
            .bind(&agent.os)
            .bind(&agent.kernel)
            .bind(&agent.container_engine)
            .bind(&agent.last_seen)
            .bind(&connection_info)
            .execute(&self.pool)
            .await
            .map_err(|e| {
                error!("Failed to upsert agent: {}", e);
                BackendAgentError::Database(e)
            })?;

        Ok(())
    }

    pub async fn get_agent(&self, agent_id: &str) -> Result<Option<AgentInfo>, BackendAgentError> {
        let sql = "SELECT * FROM agents WHERE agent_id = $1";

        let row = sqlx::query(sql)
            .bind(agent_id)
            .fetch_optional(&self.pool)
            .await
            .map_err(|e| {
                error!("Failed to get agent: {}", e);
                BackendAgentError::Database(e)
            })?;

        match row {
            Some(row) => {
                let connection_info_json: Option<serde_json::Value> = row.get("connection_info");
                let connection_info = connection_info_json
                    .and_then(|json| serde_json::from_value::<ConnectionInfo>(json).ok());

                let agent = AgentInfo {
                    id: row.get("id"),
                    agent_id: row.get("agent_id"),
                    site: row.get("site"),
                    status: row.get("status"),
                    capabilities: row.get("capabilities"),
                    version: row.get("version"),
                    os: row.get("os"),
                    kernel: row.get("kernel"),
                    container_engine: row.get("container_engine"),
                    last_seen: row.get("last_seen"),
                    created_at: row.get("created_at"),
                    updated_at: row.get("updated_at"),
                    connection_info,
                };
                Ok(Some(agent))
            }
            None => Ok(None),
        }
    }

    pub async fn list_agents(&self) -> Result<Vec<AgentInfo>, BackendAgentError> {
        let sql = "SELECT * FROM agents ORDER BY last_seen DESC";

        let rows = sqlx::query(sql)
            .fetch_all(&self.pool)
            .await
            .map_err(|e| {
                error!("Failed to list agents: {}", e);
                BackendAgentError::Database(e)
            })?;

        let mut agents = Vec::new();
        for row in rows {
            let connection_info_json: Option<serde_json::Value> = row.get("connection_info");
            let connection_info = connection_info_json
                .and_then(|json| serde_json::from_value::<ConnectionInfo>(json).ok());

            let agent = AgentInfo {
                id: row.get("id"),
                agent_id: row.get("agent_id"),
                site: row.get("site"),
                status: row.get("status"),
                capabilities: row.get("capabilities"),
                version: row.get("version"),
                os: row.get("os"),
                kernel: row.get("kernel"),
                container_engine: row.get("container_engine"),
                last_seen: row.get("last_seen"),
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
                connection_info,
            };
            agents.push(agent);
        }

        Ok(agents)
    }

    pub async fn update_agent_status(
        &self,
        agent_id: &str,
        status: &AgentStatus,
    ) -> Result<(), BackendAgentError> {
        let sql = "UPDATE agents SET status = $1, last_seen = NOW(), updated_at = NOW() WHERE agent_id = $2";

        sqlx::query(sql)
            .bind(status)
            .bind(agent_id)
            .execute(&self.pool)
            .await
            .map_err(|e| {
                error!("Failed to update agent status: {}", e);
                BackendAgentError::Database(e)
            })?;

        Ok(())
    }

    // ============================================================================
    // Command Management Queries
    // ============================================================================

    pub async fn create_command(&self, command: &CommandRecord) -> Result<(), BackendAgentError> {
        let sql = r#"
            INSERT INTO commands (
                correlation_id, verb, args, agent_targets, actor, status, priority,
                scheduled_at, max_retries
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        "#;

        let actor = serde_json::to_value(&command.actor)
            .map_err(|e| BackendAgentError::Serialization(e))?;

        sqlx::query(sql)
            .bind(&command.correlation_id)
            .bind(&command.verb)
            .bind(&command.args)
            .bind(&command.agent_targets)
            .bind(&actor)
            .bind(&command.status)
            .bind(&command.priority)
            .bind(&command.scheduled_at)
            .bind(&command.max_retries)
            .execute(&self.pool)
            .await
            .map_err(|e| {
                error!("Failed to create command: {}", e);
                BackendAgentError::Database(e)
            })?;

        Ok(())
    }

    pub async fn get_command(&self, correlation_id: &str) -> Result<Option<CommandRecord>, BackendAgentError> {
        let sql = "SELECT * FROM commands WHERE correlation_id = $1";

        let row = sqlx::query(sql)
            .bind(correlation_id)
            .fetch_optional(&self.pool)
            .await
            .map_err(|e| {
                error!("Failed to get command: {}", e);
                BackendAgentError::Database(e)
            })?;

        match row {
            Some(row) => {
                let actor_json: serde_json::Value = row.get("actor");
                let actor = serde_json::from_value::<ActorInfo>(actor_json)
                    .map_err(|e| BackendAgentError::Serialization(e))?;

                let result_json: Option<serde_json::Value> = row.get("result");
                let result = result_json
                    .and_then(|json| serde_json::from_value::<CommandResult>(json).ok());

                let command = CommandRecord {
                    id: row.get("id"),
                    correlation_id: row.get("correlation_id"),
                    verb: row.get("verb"),
                    args: row.get("args"),
                    agent_targets: row.get("agent_targets"),
                    actor,
                    status: row.get("status"),
                    priority: row.get("priority"),
                    created_at: row.get("created_at"),
                    scheduled_at: row.get("scheduled_at"),
                    executed_at: row.get("executed_at"),
                    completed_at: row.get("completed_at"),
                    result,
                    retry_count: row.get("retry_count"),
                    max_retries: row.get("max_retries"),
                    error_message: row.get("error_message"),
                };
                Ok(Some(command))
            }
            None => Ok(None),
        }
    }

    pub async fn update_command_status(
        &self,
        correlation_id: &str,
        status: &CommandStatus,
    ) -> Result<(), BackendAgentError> {
        let sql = "UPDATE commands SET status = $1, updated_at = NOW() WHERE correlation_id = $2";

        sqlx::query(sql)
            .bind(status)
            .bind(correlation_id)
            .execute(&self.pool)
            .await
            .map_err(|e| {
                error!("Failed to update command status: {}", e);
                BackendAgentError::Database(e)
            })?;

        Ok(())
    }

    // ============================================================================
    // Telemetry Queries
    // ============================================================================

    pub async fn store_telemetry(&self, telemetry: &TelemetryRecord) -> Result<(), BackendAgentError> {
        let sql = r#"
            INSERT INTO telemetry (
                agent_id, timestamp, cpu_usage, memory_usage, disk_usage,
                load_average, container_count, service_status, network_stats
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        "#;

        let memory_usage = serde_json::to_value(&telemetry.memory_usage)
            .map_err(|e| BackendAgentError::Serialization(e))?;
        let disk_usage = serde_json::to_value(&telemetry.disk_usage)
            .map_err(|e| BackendAgentError::Serialization(e))?;
        let network_stats = telemetry
            .network_stats
            .as_ref()
            .map(|ns| serde_json::to_value(ns).unwrap_or_default());

        sqlx::query(sql)
            .bind(&telemetry.agent_id)
            .bind(&telemetry.timestamp)
            .bind(&telemetry.cpu_usage)
            .bind(&memory_usage)
            .bind(&disk_usage)
            .bind(&telemetry.load_average)
            .bind(&telemetry.container_count)
            .bind(&telemetry.service_status)
            .bind(&network_stats)
            .execute(&self.pool)
            .await
            .map_err(|e| {
                error!("Failed to store telemetry: {}", e);
                BackendAgentError::Database(e)
            })?;

        Ok(())
    }

    pub async fn get_latest_telemetry(&self, agent_id: &str) -> Result<Option<TelemetryRecord>, BackendAgentError> {
        let sql = "SELECT * FROM telemetry WHERE agent_id = $1 ORDER BY timestamp DESC LIMIT 1";

        let row = sqlx::query(sql)
            .bind(agent_id)
            .fetch_optional(&self.pool)
            .await
            .map_err(|e| {
                error!("Failed to get latest telemetry: {}", e);
                BackendAgentError::Database(e)
            })?;

        match row {
            Some(row) => {
                let memory_usage_json: serde_json::Value = row.get("memory_usage");
                let memory_usage = serde_json::from_value::<MemoryInfo>(memory_usage_json)
                    .map_err(|e| BackendAgentError::Serialization(e))?;

                let disk_usage_json: serde_json::Value = row.get("disk_usage");
                let disk_usage = serde_json::from_value::<Vec<DiskInfo>>(disk_usage_json)
                    .map_err(|e| BackendAgentError::Serialization(e))?;

                let network_stats_json: Option<serde_json::Value> = row.get("network_stats");
                let network_stats = network_stats_json
                    .and_then(|json| serde_json::from_value::<NetworkStats>(json).ok());

                let telemetry = TelemetryRecord {
                    id: row.get("id"),
                    agent_id: row.get("agent_id"),
                    timestamp: row.get("timestamp"),
                    cpu_usage: row.get("cpu_usage"),
                    memory_usage,
                    disk_usage,
                    load_average: row.get("load_average"),
                    container_count: row.get("container_count"),
                    service_status: row.get("service_status"),
                    network_stats,
                    created_at: row.get("created_at"),
                };
                Ok(Some(telemetry))
            }
            None => Ok(None),
        }
    }

    // ============================================================================
    // Audit Logging
    // ============================================================================

    pub async fn log_audit_event(&self, audit_log: &AuditLog) -> Result<(), BackendAgentError> {
        let sql = r#"
            INSERT INTO audit_logs (
                level, category, action, actor, resource_type, resource_id,
                details, ip_address, user_agent, correlation_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        "#;

        sqlx::query(sql)
            .bind(&audit_log.level)
            .bind(&audit_log.category)
            .bind(&audit_log.action)
            .bind(&audit_log.actor)
            .bind(&audit_log.resource_type)
            .bind(&audit_log.resource_id)
            .bind(&audit_log.details)
            .bind(&audit_log.ip_address)
            .bind(&audit_log.user_agent)
            .bind(&audit_log.correlation_id)
            .execute(&self.pool)
            .await
            .map_err(|e| {
                error!("Failed to log audit event: {}", e);
                BackendAgentError::Database(e)
            })?;

        Ok(())
    }
}
