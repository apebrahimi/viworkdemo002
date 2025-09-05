use crate::config::Config;
use crate::monitoring::SystemMonitor;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use std::time::{SystemTime, UNIX_EPOCH};
use tracing::{error, info};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommandEnvelope {
    #[serde(rename = "type")]
    pub envelope_type: String,
    pub payload: String, // JWS-compact-or-detached
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommandPayload {
    pub corr_id: String,
    pub verb: String,
    pub args: Value,
    pub actor: ActorInfo,
    pub policy_id: String,
    pub nonce: String,
    pub iat: u64, // Issued at timestamp
    pub exp: u64, // Expiration timestamp
    pub agent_targets: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActorInfo {
    pub id: String,
    pub role: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResultEnvelope {
    #[serde(rename = "type")]
    pub envelope_type: String,
    pub payload: ResultPayload,
    pub sig: Option<String>, // Optional agent-side signature
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResultPayload {
    pub corr_id: String,
    pub agent_id: String,
    pub verb: String,
    pub status: CommandStatus,
    pub rc: i32,
    pub duration_ms: u64,
    pub stdout: String, // base64-encoded or redacted hash
    pub stderr_hash: String, // sha256-hex
    pub error_code: Option<ErrorCode>,
    pub ts: String, // ISO 8601 timestamp
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum CommandStatus {
    Success,
    Error,
    Denied,
    Timeout,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ErrorCode {
    ScriptNotFound,
    ValidationFailed,
    ExecTimeout,
    RateLimited,
    InvalidSignature,
    ExpiredToken,
    ReplayDetected,
    UnknownVerb,
    SchemaMismatch,
    None,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TelemetryFrame {
    #[serde(rename = "type")]
    pub frame_type: String,
    pub payload: TelemetryPayload,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TelemetryPayload {
    pub agent_id: String,
    pub site: Option<String>,
    pub ts: String,
    pub uptime_s: u64,
    pub cpu_pct: f64,
    pub mem: MemoryInfo,
    pub loadavg: Vec<f64>,
    pub disk: Vec<DiskInfo>,
    pub services: HashMap<String, String>,
    pub containers: ContainerInfo,
    pub version: VersionInfo,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MemoryInfo {
    pub total_mb: u64,
    pub used_mb: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiskInfo {
    pub mount: String,
    pub used_pct: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContainerInfo {
    pub running: u32,
    pub images: Vec<ImageInfo>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImageInfo {
    pub image: String,
    pub count: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VersionInfo {
    pub agent: String,
    pub engine: String,
}

impl CommandEnvelope {
    pub fn new(verb: &str, args: Value, actor: ActorInfo, policy_id: &str, agent_targets: Vec<String>) -> Self {
        let corr_id = Uuid::new_v4().to_string();
        let nonce = Uuid::new_v4().to_string();
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        let exp = now + 60; // 60 second TTL

        let payload = CommandPayload {
            corr_id,
            verb: verb.to_string(),
            args,
            actor,
            policy_id: policy_id.to_string(),
            nonce,
            iat: now,
            exp,
            agent_targets,
        };

        // For now, we'll use a simple JSON representation
        // In production, this should be JWS-signed
        let payload_json = serde_json::to_string(&payload)
            .unwrap_or_else(|_| "{}".to_string());

        Self {
            envelope_type: "COMMAND".to_string(),
            payload: payload_json,
        }
    }

    pub fn parse_payload(&self) -> Result<CommandPayload, serde_json::Error> {
        serde_json::from_str(&self.payload)
    }
}

impl ResultEnvelope {
    pub fn new(
        corr_id: &str,
        agent_id: &str,
        verb: &str,
        status: CommandStatus,
        rc: i32,
        duration_ms: u64,
        stdout: &str,
        stderr: &str,
        error_code: Option<ErrorCode>,
    ) -> Self {
        let ts = chrono::Utc::now().to_rfc3339();
        
        // Hash stderr to avoid logging sensitive information
        let stderr_hash = format!("{:x}", md5::compute(stderr));

        let payload = ResultPayload {
            corr_id: corr_id.to_string(),
            agent_id: agent_id.to_string(),
            verb: verb.to_string(),
            status,
            rc,
            duration_ms,
            stdout: stdout.to_string(),
            stderr_hash,
            error_code,
            ts,
        };

        Self {
            envelope_type: "RESULT".to_string(),
            payload,
            sig: None, // Optional signature for future use
        }
    }
}

impl TelemetryFrame {
    pub fn new_system_health(config: &Config) -> Self {
        let uptime = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();

        // Mock system health data for now
        // In production, this would come from SystemMonitor
        let payload = TelemetryPayload {
            agent_id: config.outbound.agent_id.clone(),
            site: config.outbound.site.clone(),
            ts: chrono::Utc::now().to_rfc3339(),
            uptime_s: uptime,
            cpu_pct: 0.0, // Will be populated from SystemMonitor
            mem: MemoryInfo {
                total_mb: 2048, // 2GB
                used_mb: 512,   // 512MB
            },
            loadavg: vec![0.0, 0.0, 0.0],
            disk: vec![DiskInfo {
                mount: "/".to_string(),
                used_pct: 0.0,
            }],
            services: HashMap::new(),
            containers: ContainerInfo {
                running: 0,
                images: vec![],
            },
            version: VersionInfo {
                agent: env!("CARGO_PKG_VERSION").to_string(),
                engine: "docker".to_string(),
            },
        };

        Self {
            frame_type: "TELEMETRY".to_string(),
            payload,
        }
    }

    pub fn new_container_event(
        config: &Config,
        event_type: &str,
        container_id: &str,
        username: &str,
        session_id: &str,
    ) -> Self {
        let payload = TelemetryPayload {
            agent_id: config.outbound.agent_id.clone(),
            site: config.outbound.site.clone(),
            ts: chrono::Utc::now().to_rfc3339(),
            uptime_s: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            cpu_pct: 0.0,
            mem: MemoryInfo {
                total_mb: 2048,
                used_mb: 512,
            },
            loadavg: vec![0.0, 0.0, 0.0],
            disk: vec![DiskInfo {
                mount: "/".to_string(),
                used_pct: 0.0,
            }],
            services: HashMap::new(),
            containers: ContainerInfo {
                running: 1,
                images: vec![ImageInfo {
                    image: "chrome-sandbox:latest".to_string(),
                    count: 1,
                }],
            },
            version: VersionInfo {
                agent: env!("CARGO_PKG_VERSION").to_string(),
                engine: "docker".to_string(),
            },
        };

        Self {
            frame_type: "EVENT".to_string(),
            payload,
        }
    }
}

impl CommandPayload {
    pub fn is_expired(&self) -> bool {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        
        now > self.exp
    }

    pub fn is_issued_recently(&self) -> bool {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        
        let diff = if now > self.iat {
            now - self.iat
        } else {
            self.iat - now
        };
        
        diff <= 60 // 60 second clock skew tolerance
    }
}

// Validation functions
pub fn validate_command_payload(payload: &CommandPayload, allowed_verbs: &[&str]) -> Result<(), String> {
    // Check if verb is allowed
    if !allowed_verbs.contains(&payload.verb.as_str()) {
        return Err(format!("Verb '{}' is not allowed", payload.verb));
    }

    // Check expiration
    if payload.is_expired() {
        return Err("Command has expired".to_string());
    }

    // Check issued time
    if !payload.is_issued_recently() {
        return Err("Command issued time is too old".to_string());
    }

    // Check required fields
    if payload.corr_id.is_empty() {
        return Err("Correlation ID is required".to_string());
    }

    if payload.nonce.is_empty() {
        return Err("Nonce is required".to_string());
    }

    if payload.agent_targets.is_empty() {
        return Err("Agent targets are required".to_string());
    }

    Ok(())
}
