# ViWorkS Gateway Agent - Complete Architecture Documentation

**Date:** September 5, 2025  
**Version:** 1.0  
**Scope:** Complete analysis of Gateway Agent architecture, services, and components

## Executive Summary

The ViWorkS Gateway Agent is a comprehensive Rust-based service that operates on remote hosts to provide secure, outbound-only connectivity to the Backend Agent. It manages user sessions, container orchestration, system monitoring, and executes administrative commands while maintaining strict security boundaries.

## Architecture Overview

The Gateway Agent follows a modular, service-oriented architecture with multiple specialized components:

```
┌─────────────────────────────────────────────────────────────┐
│                    Gateway Agent                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Outbound   │  │   Command   │  │  Monitoring │        │
│  │  Manager    │  │  Executor   │  │   System    │        │
│  │             │  │             │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Docker    │  │   Security  │  │     API     │        │
│  │   Manager   │  │   Context   │  │   Server    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  WebSocket  │  │   Scripts   │  │   Audit     │        │
│  │  Connection │  │  Execution  │  │   Logger    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## Core Services and Components

### 1. Outbound Manager (`src/outbound.rs`)

**Purpose:** Central coordinator for outbound connectivity to the Backend Agent.

**Key Responsibilities:**
- WebSocket connection management to Backend Agent
- Connection lifecycle (connect/disconnect/reconnect)
- Telemetry data transmission
- Command reception and routing
- Connection health monitoring

**Architecture:**
- **ConnectionManager:** Handles WebSocket connections
- **CommandExecutor:** Processes incoming commands
- **TelemetrySender:** Sends system health data
- **Connection Loop:** Maintains persistent connection with exponential backoff

**Critical Features:**
- **Outbound-Only:** No inbound HTTP server (security by design)
- **TLS Client Authentication:** Mutual TLS with client certificates
- **SPKI Pinning:** Certificate pinning for additional security
- **Automatic Reconnection:** Exponential backoff with jitter

### 2. Connection Manager (`src/outbound/connection.rs`)

**Purpose:** Manages the WebSocket connection to the Backend Agent.

**Key Features:**
- **Secure WebSocket (WSS):** TLS-encrypted connections
- **Client Certificate Authentication:** Mutual TLS
- **Connection Validation:** Certificate and SPKI pinning
- **Message Handling:** Command reception and result transmission
- **Error Recovery:** Automatic reconnection on failures

**Connection Flow:**
1. Load client certificates and trust bundle
2. Establish TLS connection to Backend Agent
3. Perform WebSocket handshake
4. Send agent registration message
5. Enter message processing loop
6. Handle reconnection on disconnection

### 3. Command Executor (`src/outbound/executor.rs`)

**Purpose:** Executes commands received from the Backend Agent.

**Supported Commands:**
- **User Management:**
  - `create_panel_user` - Create panel user account
  - `create_openvpn_user` - Create OpenVPN user
  - `delete_user` - Delete user (panel + VPN)
  - `list_users` - List all users

- **Session Management:**
  - `terminate_session` - Terminate user session
  - `get_session_status` - Get session status
  - `spawn_container` - Spawn user container
  - `stop_container` - Stop user container
  - `list_containers` - List all containers

- **System Operations:**
  - `get_system_health` - Get system health metrics
  - `get_service_status` - Get service status
  - `get_monitoring_data` - Get comprehensive monitoring data

- **Bootstrap Management:**
  - `generate_bootstrap` - Generate bootstrap credentials
  - `revoke_bootstrap` - Revoke bootstrap token

**Command Execution Features:**
- **Schema Validation:** Strict parameter validation
- **Timeout Protection:** Configurable command timeouts
- **Concurrency Control:** Semaphore-based execution limiting
- **Sandboxed Execution:** Isolated script execution environment
- **Result Reporting:** Structured success/error responses

### 4. Command Executor (Legacy) (`src/commands.rs`)

**Purpose:** Alternative command execution system with handler-based architecture.

**Architecture:**
- **CommandHandler Trait:** Pluggable command handlers
- **Handler Registration:** Dynamic command handler registration
- **Docker Integration:** Container management operations
- **Monitoring Integration:** System health and service status

**Handler Types:**
- `CreatePanelUserHandler` - Panel user creation
- `CreateOpenVpnUserHandler` - OpenVPN user creation
- `DeleteUserHandler` - User deletion
- `SpawnContainerHandler` - Container spawning
- `StopContainerHandler` - Container stopping
- `GetSystemHealthHandler` - System health monitoring
- `GetServiceStatusHandler` - Service status monitoring

**Note:** This appears to be a legacy implementation that may conflict with the newer executor in `src/outbound/executor.rs`.

### 5. Docker Manager (`src/docker.rs`)

**Purpose:** Manages Docker container lifecycle for user sessions.

**Key Features:**
- **Container Spawning:** Create and start user containers
- **Port Management:** Dynamic port allocation
- **Resource Limits:** Memory and CPU constraints
- **Container Tracking:** In-memory container registry
- **Cleanup Operations:** Automatic cleanup of stopped containers

**Container Configuration:**
- **Base Image:** Configurable base image (default: `viworks/chrome:latest`)
- **Memory Limit:** 512MB per container
- **CPU Shares:** 512 CPU shares
- **Network Mode:** Bridge networking
- **Port Range:** Configurable port allocation (default: 8000-9000)

**Container Lifecycle:**
1. **Create:** Generate container configuration
2. **Start:** Launch container with resource limits
3. **Track:** Monitor container status
4. **Stop:** Graceful shutdown with timeout
5. **Cleanup:** Remove stopped containers

### 6. System Monitor (`src/monitoring.rs`)

**Purpose:** Monitors system health and service status.

**Key Features:**
- **System Health:** CPU, memory, disk, load average
- **Service Status:** Process monitoring for key services
- **Detailed System Info:** Comprehensive system information
- **Real-time Metrics:** Live system performance data

**Monitored Metrics:**
- **CPU Usage:** Global CPU utilization percentage
- **Memory Usage:** Total and available memory
- **Load Average:** 1, 5, and 15-minute load averages
- **System Uptime:** System uptime in seconds
- **Service Status:** Docker, SSH, Nginx, PostgreSQL, Redis, OpenVPN

**Data Collection:**
- **sysinfo Library:** Cross-platform system information
- **Process Monitoring:** Service process detection
- **Performance Metrics:** Real-time system performance

### 7. Security Context (`src/security.rs`)

**Purpose:** Provides security and authentication services.

**Key Features:**
- **Client Certificate Validation:** TLS client authentication
- **Rate Limiting:** Request rate limiting per client
- **IP Allowlisting:** Source IP validation
- **Request Authentication:** Request signature validation
- **Security Logging:** Security event logging

**Security Measures:**
- **Certificate-based Authentication:** Mutual TLS
- **Rate Limiting:** Configurable request limits
- **IP Restrictions:** Allowed IP address validation
- **Request Validation:** Signature and timestamp validation

### 8. API Server (`src/api.rs`)

**Purpose:** Provides HTTP API endpoints for local operations.

**Key Endpoints:**
- `POST /execute` - Execute commands locally
- `GET /health` - Health check endpoint
- `GET /status` - System status endpoint
- `GET /simple-status` - Simplified status endpoint

**Features:**
- **Command Execution:** Local command execution
- **Health Monitoring:** System health checks
- **Status Reporting:** Comprehensive system status
- **Audit Logging:** Command execution logging

**Note:** This appears to be for local operations only, not exposed externally.

### 9. Audit Logger (`src/audit.rs`)

**Purpose:** Logs security and operational events.

**Key Features:**
- **Command Logging:** All command executions
- **Security Events:** Authentication and authorization events
- **Performance Metrics:** Execution time tracking
- **Error Logging:** Failed operations and errors

## Configuration

### Main Configuration (`src/config.rs`)

**Configuration Sections:**

#### Agent Configuration
- `bind_address` - Local bind address (default: 127.0.0.1:8443)
- `log_level` - Logging verbosity
- `max_connections` - Maximum concurrent connections
- `request_timeout` - Request timeout in seconds

#### Security Configuration
- `allowed_ips` - Allowed source IP addresses
- `rate_limit_requests` - Rate limit per window
- `rate_limit_window` - Rate limit window in seconds
- `require_client_cert` - Require client certificates
- `cert_authority_path` - Certificate authority path

#### Scripts Configuration
- `openvpn_create` - OpenVPN user creation script
- `openvpn_delete` - OpenVPN user deletion script
- `panel_create` - Panel user creation script
- `panel_delete` - Panel user deletion script

#### Monitoring Configuration
- `collect_interval` - Telemetry collection interval
- `retention_days` - Data retention period
- `metrics_enabled` - Enable metrics collection

#### Container Configuration
- `base_image` - Default container image
- `memory_limit` - Container memory limit
- `cpu_limit` - Container CPU limit
- `network_mode` - Container network mode
- `port_range_start` - Port allocation start
- `port_range_end` - Port allocation end

#### Outbound Configuration
- `backend_url` - Backend Agent WebSocket URL
- `agent_id` - Unique agent identifier
- `cert_path` - Client certificate path
- `key_path` - Client private key path
- `trust_bundle` - Certificate authority bundle
- `backend_spki_pin` - Backend certificate SPKI pin
- `feature_inbound_http` - Enable inbound HTTP (default: false)
- `feature_exec_enable` - Enable command execution
- `scripts_root` - Scripts directory path
- `max_concurrency` - Maximum concurrent commands
- `cmd_timeout_secs` - Command timeout in seconds
- `site` - Site identifier
- `container_engine` - Container engine type

### Environment Variables
- `AGENT_CONFIG` - Configuration file path
- `AGENT_BIND_ADDRESS` - Override bind address
- `RUST_LOG` - Override log level
- `VIW_AGENT_BACKEND_URL` - Backend WebSocket URL
- `VIW_AGENT_ID` - Agent identifier
- `VIW_AGENT_CERT_PATH` - Client certificate path
- `VIW_AGENT_KEY_PATH` - Client private key path
- `VIW_AGENT_TRUST_BUNDLE` - Trust bundle path
- `VIW_AGENT_BACKEND_SPKI_PIN` - Backend SPKI pin
- `VIW_AGENT_FEATURE_INBOUND_HTTP` - Enable inbound HTTP
- `VIW_AGENT_FEATURE_EXEC_ENABLE` - Enable execution
- `VIW_AGENT_SCRIPTS_ROOT` - Scripts directory
- `VIW_AGENT_MAX_CONCURRENCY` - Max concurrent commands
- `VIW_AGENT_CMD_TIMEOUT_SECS` - Command timeout
- `VIW_AGENT_SITE` - Site identifier
- `VIW_AGENT_CONTAINER_ENGINE` - Container engine

## Critical Issues and Conflicts

### 1. **P0 - Dual Command Executor Conflict**
**Issue:** Two different command executor implementations exist:
- `src/outbound/executor.rs` - Newer, simpler implementation
- `src/commands.rs` - Legacy, handler-based implementation

**Impact:** Potential conflicts and confusion about which executor is used.
**Resolution:** Determine which implementation to use and remove the other.

### 2. **P1 - Missing Main Function Integration**
**Issue:** The main function in `src/main.rs` may not properly integrate all services.
**Impact:** Services may not start correctly or may conflict.
**Resolution:** Review and fix main function service initialization.

### 3. **P2 - Configuration Validation**
**Issue:** Configuration validation may not be comprehensive.
**Impact:** Runtime failures due to invalid configuration.
**Resolution:** Add comprehensive configuration validation.

### 4. **P3 - Service Dependencies**
**Issue:** Service dependencies may not be properly managed.
**Impact:** Services may start in wrong order or fail to start.
**Resolution:** Implement proper service dependency management.

## Service Dependencies

### Internal Dependencies
```
main.rs
├── OutboundManager
│   ├── ConnectionManager (depends on Config, TLS)
│   ├── CommandExecutor (depends on Config, Scripts)
│   └── TelemetrySender (depends on SystemMonitor)
├── DockerManager (depends on Config, Docker daemon)
├── SystemMonitor (depends on sysinfo)
├── SecurityContext (depends on Config)
└── AuditLogger (depends on Config)
```

### External Dependencies
- **Docker Daemon:** Container management
- **System Scripts:** User and VPN management
- **TLS Certificates:** Client authentication
- **Backend Agent:** WebSocket connection target

## Security Architecture

### Security Model
- **Outbound-Only:** No inbound connections (except local API)
- **Mutual TLS:** Client certificate authentication
- **Certificate Pinning:** SPKI pinning for additional security
- **Sandboxed Execution:** Isolated script execution
- **Rate Limiting:** Request rate limiting
- **Audit Logging:** Comprehensive security logging

### Attack Surface
- **WebSocket Connection:** Primary attack vector
- **Script Execution:** Command injection risks
- **Container Management:** Container escape risks
- **Local API:** Local privilege escalation risks

### Mitigation Strategies
- **Input Validation:** Strict parameter validation
- **Sandboxing:** Isolated execution environments
- **Resource Limits:** Container resource constraints
- **Audit Trails:** Comprehensive logging
- **Certificate Validation:** Strong authentication

## Performance Characteristics

### Concurrency
- **Command Execution:** Semaphore-limited concurrent execution
- **Container Management:** Async container operations
- **System Monitoring:** Non-blocking system information collection
- **WebSocket Communication:** Async message handling

### Resource Usage
- **Memory:** Moderate memory usage for service management
- **CPU:** Low CPU usage for monitoring and communication
- **Network:** Minimal network usage (outbound only)
- **Storage:** Minimal storage requirements

### Scalability
- **Horizontal:** Multiple Gateway Agents per site
- **Vertical:** Limited by host resources
- **Container Density:** Limited by available ports and resources

## Deployment Architecture

### Container Configuration
- **Base Image:** Rust Alpine Linux
- **Ports:** Local API only (not exposed externally)
- **Volumes:** Scripts directory, certificates, logs
- **Environment:** Configuration via environment variables

### Host Requirements
- **Docker:** Container runtime
- **Scripts:** User and VPN management scripts
- **Certificates:** Client certificates and trust bundle
- **Network:** Outbound internet access

### Security Requirements
- **Client Certificates:** Valid TLS client certificates
- **Trust Bundle:** Certificate authority bundle
- **SPKI Pin:** Backend certificate pin
- **Script Permissions:** Proper script file permissions

## Troubleshooting Guide

### Common Issues

#### 1. **Connection Failures**
```bash
# Check certificate files
ls -la /etc/viworks-agent/
# Check network connectivity
curl -I https://agent.neuratalent.com
# Check WebSocket connection
wscat -c wss://agent.neuratalent.com/ws/agent
```

#### 2. **Command Execution Failures**
```bash
# Check script permissions
ls -la /opt/Viworks/scripts_viworks/
# Test script execution
bash /opt/Viworks/scripts_viworks/add_user.sh testuser testpass
# Check Docker daemon
docker ps
```

#### 3. **Container Management Issues**
```bash
# Check Docker daemon status
systemctl status docker
# Check container logs
docker logs <container_id>
# Check port availability
netstat -tlnp | grep :800
```

### Debug Commands
```bash
# Check agent status
curl http://localhost:8443/health
# Check system status
curl http://localhost:8443/status
# Check logs
journalctl -u viworks-gateway-agent -f
```

## Monitoring and Observability

### Metrics
- **Connection Status:** WebSocket connection health
- **Command Execution:** Command success/failure rates
- **Container Status:** Container health and resource usage
- **System Health:** CPU, memory, disk usage

### Logging
- **Structured Logging:** JSON-formatted logs
- **Security Events:** Authentication and authorization
- **Command Execution:** All command executions
- **System Events:** Container and service events

### Health Checks
- **WebSocket Connection:** Connection status
- **Docker Daemon:** Container runtime health
- **System Resources:** CPU, memory, disk
- **Script Availability:** Required scripts accessible

## Future Enhancements

### Planned Features
- **High Availability:** Multi-instance deployment
- **Advanced Monitoring:** Prometheus metrics
- **Plugin System:** Extensible command handlers
- **Configuration Management:** Dynamic configuration updates

### Performance Optimizations
- **Connection Pooling:** Enhanced WebSocket management
- **Caching:** Local command result caching
- **Resource Optimization:** Better resource utilization
- **Async Processing:** Improved concurrency

---

**Note:** This documentation reveals several architectural conflicts that need to be resolved for proper operation. The dual command executor implementations and service integration issues should be addressed before deployment.
