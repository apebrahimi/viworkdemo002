# ViWorkS Production Deployment Plan

**Date:** September 5, 2025  
**Version:** 1.0  
**Scope:** Complete plan to achieve stable production setup with agent communication

## Executive Summary

This plan addresses all critical issues identified in the analysis to achieve a stable production environment where the Backend Agent and Gateway Agent can communicate and transfer data reliably. The plan is structured in 4 phases with clear priorities, rollback procedures, and verification steps.

## Current State Assessment

### Critical Issues Identified
1. **P0 - Backend Agent WebSocket server not starting** (System Breaking)
2. **P0 - Nginx port configuration mismatch** (System Breaking)  
3. **P0 - Gateway Agent not deployed** (System Breaking)
4. **P1 - Dual command executor implementations** (Architecture Conflict)
5. **P1 - Missing service integration** (Architecture Conflict)
6. **P2 - Background task management issues** (Service Conflicts)

### Infrastructure Status
- **Backend Host (64.227.46.188):** ✅ Docker, Nginx, SSL certificates ready
- **Gateway Host (178.128.42.148):** ✅ Basic connectivity, configuration ready
- **Network:** ✅ DNS, SSL, basic connectivity confirmed
- **Backend Agent:** ❌ WebSocket server not running
- **Gateway Agent:** ❌ Not deployed

## Phase 1: Critical Fixes (P0) - System Breaking Issues

### 1.1 Fix Backend Agent WebSocket Server

**Objective:** Start the WebSocket server on port 8081

**Files to Modify:**
- `backend agent/src/main.rs`

**Current Issue:**
```rust
// AgentManager is created but WebSocket server never starts
let mut agent_manager = agent::AgentManager::new(config.clone(), data_layer.clone()).await?;
agent_manager.start().await?;
// MISSING: WebSocket server loop execution
```

**Fix Implementation:**
```rust
// After line 71 in main.rs, add:
let agent_manager_arc = Arc::new(agent_manager);

// Start WebSocket server loop
let agent_server_task = {
    let agent_manager = agent_manager_arc.clone();
    tokio::spawn(async move {
        if let Err(e) = agent_manager.run_server_loop().await {
            error!("Agent Manager server loop failed: {}", e);
        }
    })
};

// Start background tasks
let command_bg_task = {
    let command_engine = command_engine_arc.clone();
    tokio::spawn(async move {
        if let Err(e) = command_engine.run_background_tasks().await {
            error!("Command engine background tasks failed: {}", e);
        }
    })
};

let telemetry_bg_task = {
    let telemetry_processor = telemetry_processor_arc.clone();
    tokio::spawn(async move {
        if let Err(e) = telemetry_processor.run_background_tasks().await {
            error!("Telemetry processor background tasks failed: {}", e);
        }
    })
};
```

**Verification Steps:**
```bash
# 1. Rebuild and restart backend agent
cd "backend agent"
cargo build --release
docker-compose restart viworks-backend-agent-new

# 2. Check WebSocket server is listening
ssh root@64.227.46.188 "docker exec viworks-backend-agent-new netstat -tlnp | grep 8081"
# Expected: tcp 0.0.0.0:8081 LISTEN [PID]/viworks-backend-agent

# 3. Test WebSocket server health
ssh root@64.227.46.188 "docker exec viworks-backend-agent-new curl http://localhost:8081/health"
# Expected: {"status":"healthy"}
```

### 1.2 Fix Nginx Port Configuration

**Objective:** Update Nginx to proxy WebSocket connections to port 8081

**Files to Modify:**
- `/opt/viworks/digital ocean docker/nginx/nginx.conf`

**Current Issue:**
```nginx
# Nginx proxies to port 8080, but WebSocket server is on 8081
proxy_pass http://viworks-backend-agent-new:8080;
```

**Fix Implementation:**
```nginx
# In agent.neuratalent.com server block, change:
location / {
    proxy_pass http://viworks-backend-agent-new:8081;  # Changed from 8080
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 3600s;
}
```

**Verification Steps:**
```bash
# 1. Update nginx configuration
ssh root@64.227.46.188 "sed -i 's/:8080/:8081/g' /opt/viworks/digital\ ocean\ docker/nginx/nginx.conf"

# 2. Reload nginx
ssh root@64.227.46.188 "docker exec viworks-nginx nginx -s reload"

# 3. Test WebSocket connection through Nginx
curl -vk https://agent.neuratalent.com/ws/agent \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Version: 13" \
  -H "Sec-WebSocket-Key: test=="
# Expected: HTTP 101 Switching Protocols
```

### 1.3 Deploy Gateway Agent

**Objective:** Deploy and configure Gateway Agent on target host

**Prerequisites:**
- Client certificates for mutual TLS
- Environment configuration
- Required scripts and directories

**Deployment Steps:**

#### Step 1: Prepare Gateway Agent Binary
```bash
# 1. Build Gateway Agent
cd "os agent"
cargo build --release

# 2. Create deployment package
tar -czf viworks-gateway-agent.tar.gz \
  target/release/viworks-gateway-agent \
  agent-outbound.toml \
  scripts/

# 3. Transfer to gateway host
scp viworks-gateway-agent.tar.gz root@178.128.42.148:/opt/viworks/
```

#### Step 2: Install on Gateway Host
```bash
# 1. Extract and install
ssh root@178.128.42.148 "cd /opt/viworks && tar -xzf viworks-gateway-agent.tar.gz"

# 2. Create directories
ssh root@178.128.42.148 "mkdir -p /opt/viworks/agent/{certs,scripts,logs}"

# 3. Set permissions
ssh root@178.128.42.148 "chmod +x /opt/viworks/viworks-gateway-agent"
```

#### Step 3: Configure Environment
```bash
# 1. Create environment file
ssh root@178.128.42.148 "cat > /opt/viworks/agent/.env << 'EOF'
VIW_AGENT_BACKEND_URL=wss://agent.neuratalent.com/ws/agent
VIW_AGENT_ID=os-agent-178-128-42-148
VIW_AGENT_CERT_PATH=/opt/viworks/agent/certs/client.crt
VIW_AGENT_KEY_PATH=/opt/viworks/agent/certs/client.key
VIW_AGENT_TRUST_BUNDLE=/opt/viworks/agent/certs/ca.crt
VIW_AGENT_BACKEND_SPKI_PIN=<SPKI_PIN_FROM_BACKEND>
VIW_AGENT_SITE=production
VIW_AGENT_CONTAINER_ENGINE=docker
VIW_AGENT_SCRIPTS_ROOT=/opt/viworks/agent/scripts
VIW_AGENT_MAX_CONCURRENCY=4
VIW_AGENT_CMD_TIMEOUT_SECS=45
RUST_LOG=info
EOF"

# 2. Install client certificates (requires secure transfer)
# Note: Certificates must be securely transferred from certificate authority
```

#### Step 4: Create Systemd Service
```bash
# 1. Create service file
ssh root@178.128.42.148 "cat > /etc/systemd/system/viworks-gateway-agent.service << 'EOF'
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

[Install]
WantedBy=multi-user.target
EOF"

# 2. Enable and start service
ssh root@178.128.42.148 "systemctl daemon-reload"
ssh root@178.128.42.148 "systemctl enable viworks-gateway-agent"
ssh root@178.128.42.148 "systemctl start viworks-gateway-agent"
```

**Verification Steps:**
```bash
# 1. Check service status
ssh root@178.128.42.148 "systemctl status viworks-gateway-agent"
# Expected: active (running)

# 2. Check logs for connection
ssh root@178.128.42.148 "journalctl -u viworks-gateway-agent -f"
# Expected: "Successfully connected to backend"

# 3. Verify agent registration
curl -H "Authorization: Bearer <token>" https://agent.neuratalent.com/agents
# Expected: Agent listed with status "online"
```

## Phase 2: Architecture Fixes (P1) - High Priority

### 2.1 Resolve Command Executor Conflicts

**Objective:** Choose and implement single command executor

**Decision:** Use the newer implementation in `src/outbound/executor.rs` as it's simpler and more focused.

**Files to Modify:**
- `os agent/src/main.rs` - Update imports and initialization
- `os agent/src/outbound.rs` - Ensure proper integration

**Implementation:**
```rust
// In main.rs, remove legacy command executor
// Remove: use crate::commands::CommandExecutor;

// Use outbound executor instead
use crate::outbound::executor::CommandExecutor;

// Update initialization
let command_executor = Arc::new(CommandExecutor::new(config.clone()));
```

**Files to Remove:**
- `os agent/src/commands.rs` (legacy implementation)

**Verification:**
```bash
# 1. Build should succeed without conflicts
cd "os agent"
cargo build --release

# 2. Test command execution
# Deploy and test a simple command through the system
```

### 2.2 Fix Service Integration

**Objective:** Implement proper service initialization and dependency management

**Files to Modify:**
- `os agent/src/main.rs`

**Implementation:**
```rust
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize logging
    tracing_subscriber::fmt::init();
    
    // Load configuration
    let config = Config::load()?;
    info!("Configuration loaded successfully");
    
    // Initialize services in dependency order
    let docker_manager = Arc::new(DockerManager::new(config.clone()).await?);
    let system_monitor = Arc::new(SystemMonitor::new(config.clone()));
    let security_context = Arc::new(SecurityContext::new(config.clone()));
    let audit_logger = Arc::new(AuditLogger::new(config.clone()));
    
    // Initialize outbound manager with dependencies
    let outbound_manager = OutboundManager::new(config.clone());
    
    // Start outbound manager
    outbound_manager.start().await?;
    info!("Outbound manager started successfully");
    
    // Start background tasks
    let monitoring_task = {
        let system_monitor = system_monitor.clone();
        tokio::spawn(async move {
            let mut interval = tokio::time::interval(Duration::from_secs(30));
            loop {
                interval.tick().await;
                if let Err(e) = system_monitor.get_system_health().await {
                    error!("System health check failed: {}", e);
                }
            }
        })
    };
    
    let cleanup_task = {
        let docker_manager = docker_manager.clone();
        tokio::spawn(async move {
            let mut interval = tokio::time::interval(Duration::from_secs(3600));
            loop {
                interval.tick().await;
                if let Err(e) = docker_manager.cleanup_stopped_containers().await {
                    error!("Container cleanup failed: {}", e);
                }
            }
        })
    };
    
    info!("All services started successfully");
    
    // Wait for shutdown signal
    tokio::signal::ctrl_c().await?;
    info!("Shutdown signal received");
    
    // Graceful shutdown
    monitoring_task.abort();
    cleanup_task.abort();
    
    info!("Gateway agent shutdown complete");
    Ok(())
}
```

### 2.3 Improve Configuration Validation

**Objective:** Add comprehensive configuration validation

**Files to Modify:**
- `os agent/src/outbound.rs` - Enhance validation in `validate_config()`

**Implementation:**
```rust
fn validate_config(&self) -> AgentResult<()> {
    // Check required files exist and have proper permissions
    let cert_path = &self.config.outbound.cert_path;
    let key_path = &self.config.outbound.key_path;
    let trust_bundle = &self.config.outbound.trust_bundle;
    let scripts_root = &self.config.outbound.scripts_root;

    // Validate certificate files
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

    // Check scripts directory and required scripts
    if !std::path::Path::new(scripts_root).exists() {
        return Err(AgentError::ConfigurationError(format!(
            "Scripts root directory not found: {}",
            scripts_root
        )));
    }

    // Check required scripts exist
    let required_scripts = [
        "add_user.sh",
        "delete_user.sh", 
        "add_vpn_user.sh",
        "delete_vpn_user.sh"
    ];

    for script in &required_scripts {
        let script_path = format!("{}/{}", scripts_root, script);
        if !std::path::Path::new(&script_path).exists() {
            return Err(AgentError::ConfigurationError(format!(
                "Required script not found: {}",
                script_path
            )));
        }
    }

    // Check SPKI pin is set
    if self.config.outbound.backend_spki_pin.is_empty() {
        return Err(AgentError::ConfigurationError(
            "VIW_AGENT_BACKEND_SPKI_PIN must be set".to_string(),
        ));
    }

    // Validate backend URL format
    if !self.config.outbound.backend_url.starts_with("wss://") {
        return Err(AgentError::ConfigurationError(
            "Backend URL must use WSS protocol".to_string(),
        ));
    }

    // Validate agent ID format
    if self.config.outbound.agent_id.is_empty() {
        return Err(AgentError::ConfigurationError(
            "Agent ID cannot be empty".to_string(),
        ));
    }

    info!("Outbound configuration validation passed");
    Ok(())
}
```

## Phase 3: Service Improvements (P2) - Medium Priority

### 3.1 Implement Background Task Management

**Objective:** Add proper background task lifecycle management to Backend Agent

**Files to Modify:**
- `backend agent/src/main.rs`

**Implementation:**
```rust
// Add proper background task management
let command_bg_task = {
    let command_engine = command_engine_arc.clone();
    tokio::spawn(async move {
        if let Err(e) = command_engine.run_background_tasks().await {
            error!("Command engine background tasks failed: {}", e);
        }
    })
};

let telemetry_bg_task = {
    let telemetry_processor = telemetry_processor_arc.clone();
    tokio::spawn(async move {
        if let Err(e) = telemetry_processor.run_background_tasks().await {
            error!("Telemetry processor background tasks failed: {}", e);
        }
    })
};

let agent_cleanup_task = {
    let agent_registry = agent_registry_arc.clone();
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(Duration::from_secs(300)); // 5 minutes
        loop {
            interval.tick().await;
            if let Err(e) = agent_registry.cleanup_stale_agents(30).await { // 30 minutes
                error!("Agent cleanup failed: {}", e);
            }
        }
    })
};
```

### 3.2 Add Service Health Checks

**Objective:** Implement comprehensive health check endpoints

**Files to Modify:**
- `backend agent/src/api/handlers.rs` - Add health check endpoint
- `os agent/src/api.rs` - Add health check endpoint

**Backend Agent Health Check:**
```rust
pub async fn comprehensive_health_check(
    agent_manager: web::Data<Arc<AgentManager>>,
    command_engine: web::Data<Arc<CommandEngine>>,
    telemetry_processor: web::Data<Arc<TelemetryProcessor>>,
    data_layer: web::Data<DataLayer>,
) -> Result<HttpResponse> {
    let mut health_status = serde_json::json!({
        "status": "healthy",
        "timestamp": chrono::Utc::now(),
        "version": env!("CARGO_PKG_VERSION"),
        "services": {}
    });

    // Check database connectivity
    match data_layer.health_check().await {
        Ok(_) => {
            health_status["services"]["database"] = serde_json::json!({"status": "healthy"});
        }
        Err(e) => {
            health_status["services"]["database"] = serde_json::json!({
                "status": "unhealthy",
                "error": e.to_string()
            });
            health_status["status"] = "degraded";
        }
    }

    // Check agent registry
    let agent_count = agent_manager.total_agents().await;
    health_status["services"]["agent_registry"] = serde_json::json!({
        "status": "healthy",
        "total_agents": agent_count
    });

    // Check command engine
    let command_stats = command_engine.get_statistics().await;
    health_status["services"]["command_engine"] = serde_json::json!({
        "status": "healthy",
        "active_commands": command_stats.active_commands,
        "available_slots": command_stats.available_slots
    });

    // Check telemetry processor
    let telemetry_stats = telemetry_processor.get_statistics().await;
    health_status["services"]["telemetry_processor"] = serde_json::json!({
        "status": "healthy",
        "storage_stats": telemetry_stats.storage,
        "analytics_stats": telemetry_stats.analytics
    });

    let status_code = if health_status["status"] == "healthy" {
        actix_web::http::StatusCode::OK
    } else {
        actix_web::http::StatusCode::SERVICE_UNAVAILABLE
    };

    Ok(HttpResponse::build(status_code).json(health_status))
}
```

### 3.3 Standardize Error Handling

**Objective:** Create consistent error handling across both agents

**Files to Create:**
- `backend agent/src/error.rs` - Enhanced error types
- `os agent/src/error.rs` - Enhanced error types

**Implementation:**
```rust
// Common error types for both agents
#[derive(Debug, thiserror::Error)]
pub enum ViWorksError {
    #[error("Configuration error: {0}")]
    Configuration(String),
    
    #[error("Network error: {0}")]
    Network(String),
    
    #[error("Authentication error: {0}")]
    Authentication(String),
    
    #[error("Command execution error: {0}")]
    CommandExecution(String),
    
    #[error("Database error: {0}")]
    Database(String),
    
    #[error("Internal error: {0}")]
    Internal(String),
}

pub type ViWorksResult<T> = Result<T, ViWorksError>;
```

## Phase 4: Production Hardening (P3) - Low Priority

### 4.1 Security Enhancements

**Objective:** Implement additional security measures

**Tasks:**
1. **Certificate Rotation:** Implement automatic certificate rotation
2. **Rate Limiting:** Enhanced rate limiting with Redis backend
3. **Audit Logging:** Comprehensive audit trail
4. **Input Validation:** Enhanced input sanitization

### 4.2 Monitoring and Observability

**Objective:** Implement comprehensive monitoring

**Tasks:**
1. **Prometheus Metrics:** Add Prometheus metrics endpoints
2. **Grafana Dashboards:** Create monitoring dashboards
3. **Alerting:** Set up alerting for critical issues
4. **Log Aggregation:** Centralized logging with ELK stack

### 4.3 Performance Optimization

**Objective:** Optimize system performance

**Tasks:**
1. **Connection Pooling:** Optimize database connections
2. **Caching Strategy:** Implement Redis caching
3. **Load Balancing:** Multiple Backend Agent instances
4. **Resource Optimization:** Memory and CPU optimization

## Deployment Timeline

### Phase 1: Critical Fixes (Day 1)
- **Morning:** Fix Backend Agent WebSocket server
- **Afternoon:** Fix Nginx configuration
- **Evening:** Deploy Gateway Agent

### Phase 2: Architecture Fixes (Day 2)
- **Morning:** Resolve command executor conflicts
- **Afternoon:** Fix service integration
- **Evening:** Improve configuration validation

### Phase 3: Service Improvements (Day 3)
- **Morning:** Implement background task management
- **Afternoon:** Add health checks
- **Evening:** Standardize error handling

### Phase 4: Production Hardening (Week 2)
- **Week 2:** Security, monitoring, and performance enhancements

## Rollback Procedures

### Phase 1 Rollback
```bash
# Backend Agent rollback
ssh root@64.227.46.188 "docker-compose restart viworks-backend-agent-new"

# Nginx rollback
ssh root@64.227.46.188 "sed -i 's/:8081/:8080/g' /opt/viworks/digital\ ocean\ docker/nginx/nginx.conf"
ssh root@64.227.46.188 "docker exec viworks-nginx nginx -s reload"

# Gateway Agent rollback
ssh root@178.128.42.148 "systemctl stop viworks-gateway-agent"
```

### Phase 2 Rollback
```bash
# Restore legacy command executor
# Revert main.rs changes
# Restart services
```

## Verification and Testing

### Automated Tests
```bash
# 1. Connection test
curl -vk https://agent.neuratalent.com/ws/agent \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Version: 13"

# 2. Health check test
curl https://agent.neuratalent.com/health

# 3. Agent registration test
curl -H "Authorization: Bearer <token>" https://agent.neuratalent.com/agents

# 4. Command execution test
curl -X POST https://agent.neuratalent.com/commands \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"verb":"get_system_health","args":{},"agent_targets":["os-agent-178-128-42-148"]}'
```

### Manual Tests
1. **End-to-End Command Flow:** Execute commands from backend to gateway
2. **Telemetry Flow:** Verify telemetry data transmission
3. **Connection Recovery:** Test reconnection after network interruption
4. **Load Testing:** Test with multiple concurrent connections

## Success Criteria

### Phase 1 Success Criteria
- ✅ WebSocket server listening on port 8081
- ✅ Nginx proxying WebSocket connections successfully
- ✅ Gateway Agent connected and registered
- ✅ Basic command execution working

### Phase 2 Success Criteria
- ✅ Single command executor implementation
- ✅ All services starting correctly
- ✅ Configuration validation working
- ✅ No service conflicts

### Phase 3 Success Criteria
- ✅ Background tasks running properly
- ✅ Health checks responding correctly
- ✅ Consistent error handling
- ✅ Service monitoring working

### Phase 4 Success Criteria
- ✅ Security measures implemented
- ✅ Monitoring and alerting active
- ✅ Performance optimized
- ✅ Production-ready deployment

## Risk Assessment

### High Risk
- **Certificate Management:** Mutual TLS certificates must be properly configured
- **Service Dependencies:** Services must start in correct order
- **Network Connectivity:** WebSocket connections must be stable

### Medium Risk
- **Configuration Changes:** Nginx and agent configurations must be synchronized
- **Data Migration:** Existing data must be preserved during updates
- **Performance Impact:** Changes must not degrade system performance

### Low Risk
- **Code Changes:** Most changes are additive and non-breaking
- **Rollback Procedures:** Well-defined rollback procedures available
- **Testing:** Comprehensive testing procedures in place

## Conclusion

This plan provides a structured approach to achieving a stable production setup for the ViWorkS agent system. The phased approach ensures that critical issues are addressed first, followed by architectural improvements and production hardening.

**Estimated Total Time:** 3-5 days for core functionality, 2 weeks for full production readiness  
**Risk Level:** Medium (well-defined rollback procedures)  
**Success Probability:** High (based on detailed analysis and testing)

The plan addresses all identified issues and provides a clear path to a stable, production-ready system with proper agent communication and data transfer capabilities.
