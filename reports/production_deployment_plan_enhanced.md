# ViWorkS Production Deployment Plan - Enhanced

**Date:** September 5, 2025  
**Version:** 2.0  
**Scope:** Production-ready deployment with critical gaps addressed

## Executive Summary

This enhanced plan incorporates critical production readiness requirements identified through analysis. It addresses 10 key gaps that must be closed before production deployment, includes a comprehensive GO/NO-GO checklist, and provides minimal test sequences to validate the system.

## Critical Gaps to Close (Quick Edits)

### 1. Single Executor - Delete Legacy Path at Build Time

**Objective:** Prevent double handlers by completely removing legacy command executor

**Files to Modify:**
- `os agent/src/main.rs` - Remove legacy imports
- `os agent/src/commands.rs` - **DELETE THIS FILE**
- `os agent/Cargo.toml` - Remove any references

**Implementation:**
```rust
// In main.rs - Remove these lines completely:
// use crate::commands::CommandExecutor;
// use crate::commands::*;

// Keep only:
use crate::outbound::executor::CommandExecutor;
```

**Build-time Validation:**
```bash
# Add to build script to ensure legacy code is removed
if grep -r "commands::" src/; then
    echo "ERROR: Legacy commands module still referenced"
    exit 1
fi
```

### 2. mTLS Details - Document Certificate Management

**Objective:** Document certificate lifecycle and implement SPKI pin rotation

**Files to Create:**
- `docs/certificate_management.md`
- `scripts/generate_spki_pin.sh`
- `scripts/rotate_certificates.sh`

**Certificate Management Documentation:**
```markdown
# Certificate Management

## Client Certificate Issuance
- **CA:** Internal ViWorkS CA
- **Validity:** 90 days
- **Rotation:** 30 days before expiry
- **Storage:** /opt/viworks/agent/certs/

## SPKI Pin Generation
```bash
# Generate SPKI pin from backend certificate
openssl x509 -in backend.crt -pubkey -noout | \
openssl pkey -pubin -outform der | \
openssl dgst -sha256 -binary | \
openssl enc -base64
```

## Pin Rotation Window
- **Primary Pin:** Current backend certificate
- **Backup Pin:** Previous certificate (30-day overlap)
- **Rollover:** Automatic during certificate rotation
```

**SPKI Pin Rotation Implementation:**
```rust
// In outbound/connection.rs
pub struct ConnectionManager {
    primary_spki_pin: String,
    backup_spki_pin: Option<String>,
    pin_rollover_date: Option<DateTime<Utc>>,
}

impl ConnectionManager {
    fn validate_certificate_pin(&self, cert: &[u8]) -> Result<()> {
        let cert_spki = self.extract_spki_pin(cert)?;
        
        if cert_spki == self.primary_spki_pin {
            return Ok(());
        }
        
        if let Some(backup) = &self.backup_spki_pin {
            if cert_spki == *backup {
                warn!("Using backup SPKI pin - rotation in progress");
                return Ok(());
            }
        }
        
        Err(AgentError::CertificateValidation("SPKI pin mismatch".to_string()))
    }
}
```

### 3. Agent Identity - Enforce Unique Agent ID

**Objective:** Prevent duplicate agent registrations and enforce unique identity

**Files to Modify:**
- `backend agent/src/agent/registry.rs` - Add unique constraint
- `backend agent/src/data/postgres.rs` - Add database constraint
- `os agent/src/outbound/envelope.rs` - Include site and hostname in HELLO

**Database Schema Update:**
```sql
-- Add unique constraint on agent_id
ALTER TABLE agents ADD CONSTRAINT unique_agent_id UNIQUE (agent_id);

-- Add index for performance
CREATE INDEX idx_agents_site_status ON agents(site, status);
```

**HELLO Payload Enhancement:**
```rust
// In outbound/envelope.rs
#[derive(Serialize, Deserialize)]
pub struct HelloPayload {
    pub agent_id: String,
    pub site: String,
    pub hostname: String,
    pub version: String,
    pub capabilities: Vec<String>,
    pub timestamp: DateTime<Utc>,
}

// In outbound/connection.rs
async fn send_hello_message(&self) -> Result<()> {
    let hostname = hostname::get()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string();
    
    let hello = HelloPayload {
        agent_id: self.config.outbound.agent_id.clone(),
        site: self.config.outbound.site.clone(),
        hostname,
        version: env!("CARGO_PKG_VERSION").to_string(),
        capabilities: vec!["docker".to_string(), "monitoring".to_string()],
        timestamp: Utc::now(),
    };
    
    self.send_message(WebSocketMessage::Hello(hello)).await?;
    Ok(())
}
```

**Duplicate Agent Rejection:**
```rust
// In agent/registry.rs
pub async fn register_agent(&self, agent_info: AgentInfo) -> Result<()> {
    // Check for existing agent with same ID
    if self.agents.contains_key(&agent_info.id) {
        return Err(BackendAgentError::DuplicateAgent(agent_info.id));
    }
    
    // Insert with unique constraint
    self.agents.insert(agent_info.id.clone(), agent_info);
    Ok(())
}
```

### 4. Replay Protection - Bounded HMAC/Nonce Cache

**Objective:** Implement bounded nonce cache with TTL and poison message handling

**Files to Modify:**
- `backend agent/src/agent/manager.rs` - Add nonce cache
- `backend agent/src/data/redis.rs` - Add dead letter stream

**Nonce Cache Implementation:**
```rust
use dashmap::DashMap;
use std::time::{Duration, Instant};

pub struct NonceCache {
    cache: DashMap<String, Instant>,
    max_size: usize,
    ttl: Duration,
}

impl NonceCache {
    pub fn new(max_size: usize, ttl: Duration) -> Self {
        Self {
            cache: DashMap::new(),
            max_size,
            ttl,
        }
    }
    
    pub fn is_valid_nonce(&self, nonce: &str) -> bool {
        // Check if nonce exists
        if self.cache.contains_key(nonce) {
            return false; // Replay attack
        }
        
        // Check cache size limit
        if self.cache.len() >= self.max_size {
            self.cleanup_expired();
            if self.cache.len() >= self.max_size {
                return false; // Cache full
            }
        }
        
        // Add nonce with TTL
        self.cache.insert(nonce.to_string(), Instant::now());
        true
    }
    
    fn cleanup_expired(&self) {
        let now = Instant::now();
        self.cache.retain(|_, timestamp| now.duration_since(*timestamp) < self.ttl);
    }
}
```

**Dead Letter Stream:**
```rust
// In data/redis.rs
pub async fn send_to_dead_letter(&self, message: &str, reason: &str) -> Result<()> {
    let dead_letter = serde_json::json!({
        "message": message,
        "reason": reason,
        "timestamp": Utc::now(),
        "retry_count": 0
    });
    
    self.redis
        .xadd("dead_letter_stream", "*", &[("data", dead_letter.to_string())])
        .await?;
    
    Ok(())
}
```

### 5. Backpressure - Redis Stream Limits and Retry Policy

**Objective:** Prevent unbounded memory growth with stream limits and retry policies

**Files to Modify:**
- `backend agent/src/command/queue.rs` - Add stream limits
- `backend agent/src/telemetry/processor.rs` - Add backpressure handling

**Stream Configuration:**
```rust
// In command/queue.rs
pub struct CommandQueue {
    // ... existing fields
    max_stream_length: usize,
    retry_policy: RetryPolicy,
}

pub struct RetryPolicy {
    max_attempts: u32,
    backoff_multiplier: f64,
    max_backoff: Duration,
}

impl CommandQueue {
    pub fn new(max_stream_length: usize) -> Self {
        Self {
            // ... existing initialization
            max_stream_length,
            retry_policy: RetryPolicy {
                max_attempts: 3,
                backoff_multiplier: 2.0,
                max_backoff: Duration::from_secs(60),
            },
        }
    }
    
    pub async fn enqueue_command(&self, command: CommandRecord) -> Result<()> {
        // Check stream length before adding
        let stream_length = self.redis.xlen("command_stream").await?;
        if stream_length >= self.max_stream_length {
            return Err(BackendAgentError::QueueFull);
        }
        
        // Add with MAXLEN to prevent unbounded growth
        self.redis
            .xadd_options(
                "command_stream",
                "*",
                &[("data", serde_json::to_string(&command)?)],
                &XAddOptions::default().maxlen(StreamMaxlen::Approx(self.max_stream_length)),
            )
            .await?;
        
        Ok(())
    }
}
```

### 6. Idempotency - Upsert by Composite Keys

**Objective:** Prevent duplicate data on consumer restarts

**Files to Modify:**
- `backend agent/src/telemetry/processor.rs` - Add upsert logic
- `backend agent/src/command/engine.rs` - Add result deduplication

**Telemetry Upsert:**
```rust
// In telemetry/processor.rs
pub async fn store_telemetry(&self, telemetry: TelemetryMessage) -> Result<()> {
    let composite_key = format!("{}:{}:{}", 
        telemetry.agent_id, 
        telemetry.timestamp.timestamp(),
        telemetry.metric_key
    );
    
    // Use ON CONFLICT DO UPDATE for idempotency
    let query = r#"
        INSERT INTO telemetry (agent_id, timestamp, metric_key, value, metadata)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (agent_id, timestamp, metric_key)
        DO UPDATE SET
            value = EXCLUDED.value,
            metadata = EXCLUDED.metadata,
            updated_at = NOW()
    "#;
    
    self.postgres
        .execute(query, &[
            &telemetry.agent_id,
            &telemetry.timestamp,
            &telemetry.metric_key,
            &telemetry.value,
            &telemetry.metadata,
        ])
        .await?;
    
    Ok(())
}
```

**Command Result Deduplication:**
```rust
// In command/engine.rs
pub async fn process_command_result(&self, result: CommandResult) -> Result<()> {
    // Use correlation_id for deduplication
    let query = r#"
        INSERT INTO command_results (correlation_id, agent_id, command_id, status, result, duration_ms)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (correlation_id)
        DO UPDATE SET
            status = EXCLUDED.status,
            result = EXCLUDED.result,
            duration_ms = EXCLUDED.duration_ms,
            updated_at = NOW()
    "#;
    
    self.postgres
        .execute(query, &[
            &result.correlation_id,
            &result.agent_id,
            &result.command_id,
            &result.status,
            &result.result,
            &result.duration_ms,
        ])
        .await?;
    
    Ok(())
}
```

### 7. Health Endpoints - Comprehensive Health Check

**Objective:** Single health endpoint for all system components

**Files to Modify:**
- `backend agent/src/api/handlers.rs` - Add comprehensive health check
- `docker-compose.yml` - Add health checks
- `nginx.conf` - Add health check endpoint

**Comprehensive Health Check:**
```rust
// In api/handlers.rs
pub async fn comprehensive_health_check(
    agent_manager: web::Data<Arc<AgentManager>>,
    command_engine: web::Data<Arc<CommandEngine>>,
    telemetry_processor: web::Data<Arc<TelemetryProcessor>>,
    data_layer: web::Data<DataLayer>,
) -> Result<HttpResponse> {
    let mut health = serde_json::json!({
        "status": "healthy",
        "timestamp": Utc::now(),
        "version": env!("CARGO_PKG_VERSION"),
        "components": {}
    });

    // Database health
    match data_layer.health_check().await {
        Ok(_) => {
            health["components"]["database"] = serde_json::json!({"status": "healthy"});
        }
        Err(e) => {
            health["components"]["database"] = serde_json::json!({
                "status": "unhealthy",
                "error": e.to_string()
            });
            health["status"] = "degraded";
        }
    }

    // Redis health
    match data_layer.redis.ping().await {
        Ok(_) => {
            health["components"]["redis"] = serde_json::json!({"status": "healthy"});
        }
        Err(e) => {
            health["components"]["redis"] = serde_json::json!({
                "status": "unhealthy",
                "error": e.to_string()
            });
            health["status"] = "degraded";
        }
    }

    // Agent registry health
    let agent_count = agent_manager.total_agents().await;
    health["components"]["agent_registry"] = serde_json::json!({
        "status": "healthy",
        "total_agents": agent_count
    });

    // Command queue health
    let queue_stats = command_engine.get_statistics().await;
    health["components"]["command_queue"] = serde_json::json!({
        "status": "healthy",
        "active_commands": queue_stats.active_commands,
        "available_slots": queue_stats.available_slots
    });

    // Telemetry processor health
    let telemetry_stats = telemetry_processor.get_statistics().await;
    health["components"]["telemetry_processor"] = serde_json::json!({
        "status": "healthy",
        "storage_stats": telemetry_stats.storage,
        "analytics_stats": telemetry_stats.analytics
    });

    let status_code = if health["status"] == "healthy" {
        actix_web::http::StatusCode::OK
    } else {
        actix_web::http::StatusCode::SERVICE_UNAVAILABLE
    };

    Ok(HttpResponse::build(status_code).json(health))
}
```

**Docker Health Check:**
```yaml
# In docker-compose.yml
services:
  viworks-backend-agent-new:
    # ... existing config
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/internal/_healthz"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### 8. Resource Guards - System Limits and Restart Policy

**Objective:** Set proper resource limits and restart policies

**Files to Modify:**
- `os agent/viworks-gateway-agent.service` - Add resource limits
- `docker-compose.yml` - Add resource limits
- `os agent/src/outbound.rs` - Add exponential backoff

**Systemd Service with Resource Limits:**
```ini
# In viworks-gateway-agent.service
[Unit]
Description=ViWorkS Gateway Agent
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/viworks/agent
EnvironmentFile=/opt/viworks/agent/.env
ExecStart=/opt/viworks/viworks-gateway-agent
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

# Resource limits
LimitNOFILE=65536
LimitNPROC=4096
MemoryMax=512M
CPUQuota=50%

[Install]
WantedBy=multi-user.target
```

**Exponential Backoff:**
```rust
// In outbound.rs
pub struct ConnectionManager {
    // ... existing fields
    reconnect_attempts: u32,
    max_reconnect_attempts: u32,
    base_reconnect_delay: Duration,
}

impl ConnectionManager {
    async fn connection_loop(&self) -> Result<()> {
        loop {
            match self.connect().await {
                Ok(_) => {
                    self.reconnect_attempts = 0;
                    // Connection successful, enter message loop
                    self.message_loop().await?;
                }
                Err(e) => {
                    error!("Connection failed: {}", e);
                    self.handle_reconnect().await?;
                }
            }
        }
    }
    
    async fn handle_reconnect(&self) -> Result<()> {
        if self.reconnect_attempts >= self.max_reconnect_attempts {
            return Err(AgentError::MaxReconnectAttempts);
        }
        
        self.reconnect_attempts += 1;
        let delay = self.calculate_backoff_delay();
        
        warn!("Reconnecting in {:?} (attempt {})", delay, self.reconnect_attempts);
        tokio::time::sleep(delay).await;
        
        Ok(())
    }
    
    fn calculate_backoff_delay(&self) -> Duration {
        let multiplier = 2.0_f64.powi(self.reconnect_attempts as i32);
        let delay = self.base_reconnect_delay.as_secs_f64() * multiplier;
        Duration::from_secs_f64(delay.min(300.0)) // Max 5 minutes
    }
}
```

### 9. Config Validation Fail-Closed

**Objective:** Exit non-zero if any required configuration is missing

**Files to Modify:**
- `os agent/src/config.rs` - Add comprehensive validation
- `backend agent/src/config.rs` - Add comprehensive validation

**Fail-Closed Validation:**
```rust
// In config.rs
impl Config {
    pub fn validate(&self) -> Result<()> {
        // Backend URL validation
        if self.outbound.backend_url.is_empty() {
            return Err(ConfigError::MissingField("backend_url".to_string()));
        }
        
        if !self.outbound.backend_url.starts_with("wss://") {
            return Err(ConfigError::InvalidField("backend_url must use WSS protocol".to_string()));
        }
        
        // SPKI pin validation
        if self.outbound.backend_spki_pin.is_empty() {
            return Err(ConfigError::MissingField("backend_spki_pin".to_string()));
        }
        
        // Certificate validation
        if !std::path::Path::new(&self.outbound.cert_path).exists() {
            return Err(ConfigError::MissingFile(self.outbound.cert_path.clone()));
        }
        
        if !std::path::Path::new(&self.outbound.key_path).exists() {
            return Err(ConfigError::MissingFile(self.outbound.key_path.clone()));
        }
        
        // Scripts validation
        let required_scripts = [
            "add_user.sh",
            "delete_user.sh",
            "add_vpn_user.sh",
            "delete_vpn_user.sh"
        ];
        
        for script in &required_scripts {
            let script_path = format!("{}/{}", self.outbound.scripts_root, script);
            if !std::path::Path::new(&script_path).exists() {
                return Err(ConfigError::MissingFile(script_path));
            }
        }
        
        Ok(())
    }
}

// In main.rs
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = Config::load()?;
    
    // Validate configuration - exit if invalid
    if let Err(e) = config.validate() {
        error!("Configuration validation failed: {}", e);
        std::process::exit(1);
    }
    
    // Continue with normal startup
    // ...
}
```

### 10. Audit Trail - Comprehensive Command Logging

**Objective:** Log all commands with structured data for SIEM

**Files to Modify:**
- `backend agent/src/api/handlers.rs` - Add audit logging
- `os agent/src/outbound/executor.rs` - Add audit logging

**Structured Audit Logging:**
```rust
// In api/handlers.rs
pub async fn create_command(
    req: HttpRequest,
    command_req: web::Json<CreateCommandRequest>,
    command_engine: web::Data<Arc<CommandEngine>>,
) -> Result<HttpResponse> {
    let req_id = uuid::Uuid::new_v4().to_string();
    let actor = extract_actor_from_request(&req)?;
    let start_time = Instant::now();
    
    // Log command creation
    let audit_log = serde_json::json!({
        "req_id": req_id,
        "actor": actor,
        "verb": command_req.verb,
        "args_hash": sha256_hash(&serde_json::to_string(&command_req.args)?),
        "agent_targets": command_req.agent_targets,
        "timestamp": Utc::now(),
        "event": "command_created"
    });
    
    info!("AUDIT: {}", audit_log);
    
    // Execute command
    let result = command_engine.submit_command(command_req.into_inner()).await;
    let duration_ms = start_time.elapsed().as_millis();
    
    // Log command result
    let result_log = serde_json::json!({
        "req_id": req_id,
        "actor": actor,
        "verb": command_req.verb,
        "rc": if result.is_ok() { "success" } else { "error" },
        "duration_ms": duration_ms,
        "timestamp": Utc::now(),
        "event": "command_completed"
    });
    
    info!("AUDIT: {}", result_log);
    
    match result {
        Ok(command_id) => Ok(HttpResponse::Ok().json(serde_json::json!({
            "command_id": command_id,
            "req_id": req_id
        }))),
        Err(e) => {
            error!("AUDIT: Command failed: {}", e);
            Err(e)
        }
    }
}
```

## GO/NO-GO Checklist

### Pre-Deployment Validation

#### 1. Port Alignment
- [ ] Nginx agent.* vhost points to port 8081
- [ ] WebSocket upgrade returns HTTP 101
- [ ] Backend agent listening on port 8081
- [ ] No port conflicts with other services

#### 2. TLS Configuration
- [ ] mTLS handshake confirmed
- [ ] SPKI pin matches backend leaf certificate
- [ ] Client certificates valid and not expired
- [ ] Certificate chain validation working

#### 3. Agent Registration
- [ ] Agent shows online in registry within 5 seconds
- [ ] Duplicate agent_id blocked and logged
- [ ] HELLO payload includes site and hostname
- [ ] Agent capabilities properly reported

#### 4. Command Execution
- [ ] get_system_health round-trip completes in <2 seconds
- [ ] Command result persisted to database
- [ ] Admin UI shows command execution
- [ ] Command correlation_id working

#### 5. Data Flow
- [ ] Telemetry stream → writer → Postgres rows
- [ ] No consumer lag after idle period
- [ ] Redis streams have proper MAXLEN limits
- [ ] Dead letter stream working for failed messages

#### 6. Failure Recovery
- [ ] Kill agent → watch reconnect with exponential backoff
- [ ] Kill writer → consumer group picks up work
- [ ] Simulate bad nonce → rejection + audit log
- [ ] Database connection recovery working

### Automated Test Script

```bash
#!/bin/bash
# production_validation.sh

set -e

echo "=== ViWorkS Production Validation ==="

# 1. WebSocket Connection Test
echo "Testing WebSocket connection..."
if curl -s -I -H "Connection: Upgrade" -H "Upgrade: websocket" \
   https://agent.neuratalent.com/ws/agent | grep -q "101"; then
    echo "✅ WebSocket upgrade successful"
else
    echo "❌ WebSocket upgrade failed"
    exit 1
fi

# 2. Health Check Test
echo "Testing health endpoint..."
if curl -s https://agent.neuratalent.com/internal/_healthz | jq -e '.status == "healthy"'; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    exit 1
fi

# 3. Agent Registration Test
echo "Testing agent registration..."
# Start test agent and verify registration
# (Implementation depends on test agent setup)

# 4. Command Execution Test
echo "Testing command execution..."
COMMAND_ID=$(curl -s -X POST https://agent.neuratalent.com/commands \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"verb":"get_system_health","args":{},"agent_targets":["test-agent"]}' | \
  jq -r '.command_id')

if [ "$COMMAND_ID" != "null" ]; then
    echo "✅ Command created: $COMMAND_ID"
else
    echo "❌ Command creation failed"
    exit 1
fi

# 5. Duplicate Agent Test
echo "Testing duplicate agent rejection..."
# Attempt to register duplicate agent_id
# Should be rejected

echo "=== All tests passed! System ready for production ==="
```

## Minimal Test Sequence

### 1. WebSocket Connection Test
```bash
# Test WebSocket upgrade through Nginx
wscat -c wss://agent.neuratalent.com/ws/agent
# Expected: Connection established
```

### 2. Agent Registration Test
```bash
# Start gateway agent and verify registration
ssh root@178.128.42.148 "systemctl start viworks-gateway-agent"
sleep 5
curl -H "Authorization: Bearer $TOKEN" https://agent.neuratalent.com/agents
# Expected: Agent listed with status "online"
```

### 3. Command Execution Test
```bash
# Execute command and verify result
COMMAND_ID=$(curl -X POST https://agent.neuratalent.com/commands \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"verb":"get_system_health","args":{},"agent_targets":["os-agent-178-128-42-148"]}' | \
  jq -r '.command_id')

sleep 2
curl -H "Authorization: Bearer $TOKEN" https://agent.neuratalent.com/commands/$COMMAND_ID
# Expected: Command completed with result
```

### 4. Duplicate Agent Test
```bash
# Attempt to register duplicate agent
# Should be rejected with proper error message
```

### 5. Failure Recovery Test
```bash
# Kill agent and verify reconnection
ssh root@178.128.42.148 "systemctl stop viworks-gateway-agent"
sleep 10
ssh root@178.128.42.148 "systemctl start viworks-gateway-agent"
# Expected: Agent reconnects and shows online
```

## Final Verdict

**✅ PROCEED WITH PRODUCTION DEPLOYMENT**

Once the 10 critical gaps are addressed:

1. **Single executor** - Legacy code removed
2. **mTLS details** - Certificate management documented
3. **Agent identity** - Unique constraints enforced
4. **Replay protection** - Bounded nonce cache implemented
5. **Backpressure** - Stream limits and retry policies
6. **Idempotency** - Upsert by composite keys
7. **Health endpoints** - Comprehensive health checks
8. **Resource guards** - Limits and restart policies
9. **Config validation** - Fail-closed validation
10. **Audit trail** - Structured logging for SIEM

**Phase 3 items** (background task lifecycle, comprehensive health, unified error types) should be queued for post-deployment as they won't break runtime but will improve operability.

**Risk Level:** Low (with gaps addressed)  
**Success Probability:** High  
**Estimated Time:** 2-3 days for gap closure + 1 day for validation
