use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::types::Uuid;
use std::str::FromStr;

// ============================================================================
// Agent Management Models
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, sqlx::FromRow)]
pub struct AgentInfo {
    pub id: Uuid,
    pub agent_id: String,
    pub site: String,
    pub status: AgentStatus,
    pub capabilities: Vec<String>,
    pub version: String,
    pub os: String,
    pub kernel: Option<String>,
    pub container_engine: Option<String>,
    pub last_seen: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub connection_info: Option<ConnectionInfo>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum AgentStatus {
    Online,
    Offline,
    Degraded,
    Maintenance,
}

impl sqlx::Type<sqlx::Postgres> for AgentStatus {
    fn type_info() -> sqlx::postgres::PgTypeInfo {
        sqlx::postgres::PgTypeInfo::with_name("VARCHAR")
    }
}

impl sqlx::Encode<'_, sqlx::Postgres> for AgentStatus {
    fn encode_by_ref(&self, buf: &mut sqlx::postgres::PgArgumentBuffer) -> sqlx::encode::IsNull {
        let s = match self {
            AgentStatus::Online => "online",
            AgentStatus::Offline => "offline",
            AgentStatus::Degraded => "degraded",
            AgentStatus::Maintenance => "maintenance",
        };
        buf.extend_from_slice(s.as_bytes());
        sqlx::encode::IsNull::No
    }
}

impl sqlx::Decode<'_, sqlx::Postgres> for AgentStatus {
    fn decode(
        value: sqlx::postgres::PgValueRef<'_>,
    ) -> Result<Self, Box<dyn std::error::Error + Send + Sync>> {
        let s = <&str as sqlx::Decode<sqlx::Postgres>>::decode(value)?;
        match s {
            "online" => Ok(AgentStatus::Online),
            "offline" => Ok(AgentStatus::Offline),
            "degraded" => Ok(AgentStatus::Degraded),
            "maintenance" => Ok(AgentStatus::Maintenance),
            _ => Err(format!("Unknown agent status: {}", s).into()),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ConnectionInfo {
    pub remote_addr: String,
    pub user_agent: Option<String>,
    pub protocol: String,
    pub connected_at: DateTime<Utc>,
    pub last_heartbeat: DateTime<Utc>,
}

// ============================================================================
// Command Models
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, sqlx::FromRow)]
pub struct CommandRecord {
    pub id: Uuid,
    pub correlation_id: String,
    pub verb: String,
    pub args: Value,
    pub agent_targets: Vec<String>,
    pub actor: ActorInfo,
    pub status: CommandStatus,
    pub priority: CommandPriority,
    pub created_at: DateTime<Utc>,
    pub scheduled_at: Option<DateTime<Utc>>,
    pub executed_at: Option<DateTime<Utc>>,
    pub completed_at: Option<DateTime<Utc>>,
    pub result: Option<CommandResult>,
    pub retry_count: i32,
    pub max_retries: i32,
    pub error_message: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum CommandStatus {
    Pending,
    Queued,
    Executing,
    Completed,
    Failed,
    Cancelled,
    Timeout,
}

impl sqlx::Type<sqlx::Postgres> for CommandStatus {
    fn type_info() -> sqlx::postgres::PgTypeInfo {
        sqlx::postgres::PgTypeInfo::with_name("VARCHAR")
    }
}

impl sqlx::Encode<'_, sqlx::Postgres> for CommandStatus {
    fn encode_by_ref(&self, buf: &mut sqlx::postgres::PgArgumentBuffer) -> sqlx::encode::IsNull {
        let s = match self {
            CommandStatus::Pending => "pending",
            CommandStatus::Queued => "queued",
            CommandStatus::Executing => "executing",
            CommandStatus::Completed => "completed",
            CommandStatus::Failed => "failed",
            CommandStatus::Cancelled => "cancelled",
            CommandStatus::Timeout => "timeout",
        };
        buf.extend_from_slice(s.as_bytes());
        sqlx::encode::IsNull::No
    }
}

impl sqlx::Decode<'_, sqlx::Postgres> for CommandStatus {
    fn decode(
        value: sqlx::postgres::PgValueRef<'_>,
    ) -> Result<Self, Box<dyn std::error::Error + Send + Sync>> {
        let s = <&str as sqlx::Decode<sqlx::Postgres>>::decode(value)?;
        match s {
            "pending" => Ok(CommandStatus::Pending),
            "queued" => Ok(CommandStatus::Queued),
            "executing" => Ok(CommandStatus::Executing),
            "completed" => Ok(CommandStatus::Completed),
            "failed" => Ok(CommandStatus::Failed),
            "cancelled" => Ok(CommandStatus::Cancelled),
            "timeout" => Ok(CommandStatus::Timeout),
            _ => Err(format!("Unknown command status: {}", s).into()),
        }
    }
}

impl FromStr for CommandStatus {
    type Err = Box<dyn std::error::Error + Send + Sync>;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "pending" => Ok(CommandStatus::Pending),
            "queued" => Ok(CommandStatus::Queued),
            "executing" => Ok(CommandStatus::Executing),
            "completed" => Ok(CommandStatus::Completed),
            "failed" => Ok(CommandStatus::Failed),
            "cancelled" => Ok(CommandStatus::Cancelled),
            "timeout" => Ok(CommandStatus::Timeout),
            _ => Err(format!("Unknown command status: {}", s).into()),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord)]
pub enum CommandPriority {
    Low,
    Normal,
    High,
    Critical,
}

impl sqlx::Type<sqlx::Postgres> for CommandPriority {
    fn type_info() -> sqlx::postgres::PgTypeInfo {
        sqlx::postgres::PgTypeInfo::with_name("VARCHAR")
    }
}

impl sqlx::Encode<'_, sqlx::Postgres> for CommandPriority {
    fn encode_by_ref(&self, buf: &mut sqlx::postgres::PgArgumentBuffer) -> sqlx::encode::IsNull {
        let s = match self {
            CommandPriority::Low => "low",
            CommandPriority::Normal => "normal",
            CommandPriority::High => "high",
            CommandPriority::Critical => "critical",
        };
        buf.extend_from_slice(s.as_bytes());
        sqlx::encode::IsNull::No
    }
}

impl sqlx::Decode<'_, sqlx::Postgres> for CommandPriority {
    fn decode(
        value: sqlx::postgres::PgValueRef<'_>,
    ) -> Result<Self, Box<dyn std::error::Error + Send + Sync>> {
        let s = <&str as sqlx::Decode<sqlx::Postgres>>::decode(value)?;
        match s {
            "low" => Ok(CommandPriority::Low),
            "normal" => Ok(CommandPriority::Normal),
            "high" => Ok(CommandPriority::High),
            "critical" => Ok(CommandPriority::Critical),
            _ => Err(format!("Unknown command priority: {}", s).into()),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ActorInfo {
    pub id: String,
    pub role: String,
    pub permissions: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct CommandResult {
    pub agent_id: String,
    pub status: CommandExecutionStatus,
    pub return_code: i32,
    pub duration_ms: u64,
    pub stdout: String,
    pub stderr_hash: String,
    pub error_code: Option<String>,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum CommandExecutionStatus {
    Success,
    Error,
    Denied,
    Timeout,
}

// ============================================================================
// Telemetry Models
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, sqlx::FromRow)]
pub struct TelemetryRecord {
    pub id: Uuid,
    pub agent_id: String,
    pub timestamp: DateTime<Utc>,
    pub cpu_usage: f64,
    pub memory_usage: MemoryInfo,
    pub disk_usage: Vec<DiskInfo>,
    pub load_average: Vec<f64>,
    pub container_count: i32,
    pub service_status: Value,
    pub network_stats: Option<NetworkStats>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct MemoryInfo {
    pub total_mb: u64,
    pub used_mb: u64,
    pub available_mb: u64,
    pub swap_total_mb: u64,
    pub swap_used_mb: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct DiskInfo {
    pub mount_point: String,
    pub filesystem: String,
    pub total_gb: f64,
    pub used_gb: f64,
    pub available_gb: f64,
    pub usage_percent: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct NetworkStats {
    pub bytes_sent: u64,
    pub bytes_received: u64,
    pub packets_sent: u64,
    pub packets_received: u64,
    pub connections_active: u32,
}

// ============================================================================
// Audit Models
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, sqlx::FromRow)]
pub struct AuditLog {
    pub id: Uuid,
    pub timestamp: DateTime<Utc>,
    pub level: AuditLevel,
    pub category: String,
    pub action: String,
    pub actor: Option<String>,
    pub resource_type: Option<String>,
    pub resource_id: Option<String>,
    pub details: Value,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub correlation_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum AuditLevel {
    Info,
    Warning,
    Error,
    Security,
}

impl sqlx::Type<sqlx::Postgres> for AuditLevel {
    fn type_info() -> sqlx::postgres::PgTypeInfo {
        sqlx::postgres::PgTypeInfo::with_name("VARCHAR")
    }
}

impl sqlx::Encode<'_, sqlx::Postgres> for AuditLevel {
    fn encode_by_ref(&self, buf: &mut sqlx::postgres::PgArgumentBuffer) -> sqlx::encode::IsNull {
        let s = match self {
            AuditLevel::Info => "info",
            AuditLevel::Warning => "warning",
            AuditLevel::Error => "error",
            AuditLevel::Security => "security",
        };
        buf.extend_from_slice(s.as_bytes());
        sqlx::encode::IsNull::No
    }
}

impl sqlx::Decode<'_, sqlx::Postgres> for AuditLevel {
    fn decode(
        value: sqlx::postgres::PgValueRef<'_>,
    ) -> Result<Self, Box<dyn std::error::Error + Send + Sync>> {
        let s = <&str as sqlx::Decode<sqlx::Postgres>>::decode(value)?;
        match s {
            "info" => Ok(AuditLevel::Info),
            "warning" => Ok(AuditLevel::Warning),
            "error" => Ok(AuditLevel::Error),
            "security" => Ok(AuditLevel::Security),
            _ => Err(format!("Unknown audit level: {}", s).into()),
        }
    }
}

// ============================================================================
// API Request/Response Models
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct CreateCommandRequest {
    pub verb: String,
    pub args: Value,
    pub agent_targets: Vec<String>,
    pub priority: Option<CommandPriority>,
    pub scheduled_at: Option<DateTime<Utc>>,
    pub timeout: Option<u64>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct CommandResponse {
    pub command_id: Uuid,
    pub correlation_id: String,
    pub status: CommandStatus,
    pub message: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct AgentListResponse {
    pub agents: Vec<AgentInfo>,
    pub total_count: usize,
    pub online_count: usize,
    pub offline_count: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct TelemetryResponse {
    pub agent_id: String,
    pub latest: Option<TelemetryRecord>,
    pub history: Vec<TelemetryRecord>,
    pub summary: TelemetrySummary,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct TelemetrySummary {
    pub avg_cpu_usage: f64,
    pub avg_memory_usage: f64,
    pub total_disk_usage: f64,
    pub container_count: i32,
    pub service_health: Value,
}

// ============================================================================
// WebSocket Message Models
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct WebSocketMessage {
    #[serde(rename = "type")]
    pub message_type: String,
    pub payload: Value,
    pub timestamp: DateTime<Utc>,
    pub correlation_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct HelloMessage {
    pub agent_id: String,
    pub site: String,
    pub agent_version: String,
    pub os: String,
    pub kernel: Option<String>,
    pub container_engine: Option<String>,
    pub supported_verbs: Vec<String>,
    pub start_time: DateTime<Utc>,
    pub feature_flags: Value,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct CommandMessage {
    pub correlation_id: String,
    pub verb: String,
    pub args: Value,
    pub actor: ActorInfo,
    pub policy_id: String,
    pub nonce: String,
    pub issued_at: u64,
    pub expires_at: u64,
    pub agent_targets: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ResultMessage {
    pub correlation_id: String,
    pub agent_id: String,
    pub verb: String,
    pub status: CommandExecutionStatus,
    pub return_code: i32,
    pub duration_ms: u64,
    pub stdout: String,
    pub stderr_hash: String,
    pub error_code: Option<String>,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct TelemetryMessage {
    pub agent_id: String,
    pub site: Option<String>,
    pub timestamp: DateTime<Utc>,
    pub uptime_seconds: u64,
    pub cpu_percent: f64,
    pub memory: MemoryInfo,
    pub load_average: Vec<f64>,
    pub disk: Vec<DiskInfo>,
    pub services: Value,
    pub containers: Value,
    pub version: Value,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct HeartbeatMessage {
    pub agent_id: String,
    pub timestamp: DateTime<Utc>,
    pub status: AgentStatus,
}
