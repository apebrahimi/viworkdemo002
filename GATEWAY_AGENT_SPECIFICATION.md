# ViWorkS Gateway OS Agent Specification

## Overview
The Gateway OS Agent is a minimal, secure Rust application that runs on the Gateway OS (Linux host) and provides a secure control channel between the ViWorkS backend and the gateway infrastructure. The agent executes allowlisted commands to manage users, sessions, containers, and system monitoring.

## Architecture Principles

### Security First
- **No shell access**: Agent never executes shell commands
- **Allowlisted operations**: Only predefined, safe operations are permitted
- **Process isolation**: Agent runs in isolated environment
- **Minimal privileges**: Agent has only necessary permissions
- **Audit everything**: All operations are logged with correlation IDs

### Minimal Footprint
- **Small binary**: < 5MB compiled size
- **Low resource usage**: < 50MB RAM, < 1% CPU
- **Fast startup**: < 2 seconds to ready state
- **Efficient communication**: Minimal network overhead

### High Reliability
- **Health monitoring**: Continuous self-monitoring
- **Graceful degradation**: Handle failures without crashing
- **Automatic recovery**: Restart on critical failures
- **Resource limits**: Prevent resource exhaustion

## Communication Protocol

### Backend → Agent (HTTP/HTTPS)
**Base URL**: `https://gateway-agent:8443/api/v1`

**Authentication**: Mutual TLS with client certificates
- Backend presents certificate signed by trusted CA
- Agent validates certificate and extracts client identity
- All requests include correlation ID for audit trail

**Request Format**:
```json
{
  "correlation_id": "uuid-v4",
  "command": "command_name",
  "parameters": {
    // Command-specific parameters
  },
  "timestamp": "ISO-8601",
  "signature": "HMAC-SHA256"
}
```

**Response Format**:
```json
{
  "correlation_id": "uuid-v4",
  "success": true,
  "data": {
    // Command-specific response data
  },
  "error": null,
  "timestamp": "ISO-8601",
  "execution_time_ms": 123
}
```

### Agent → Backend (Status Reporting)
**Endpoint**: `POST /api/v1/status`
**Frequency**: Every 30 seconds
**Format**:
```json
{
  "agent_id": "gateway-001",
  "timestamp": "ISO-8601",
  "health": {
    "status": "healthy",
    "uptime_seconds": 3600,
    "memory_usage_mb": 25,
    "cpu_usage_percent": 0.5
  },
  "system": {
    "cpu_percent": 15.2,
    "memory_percent": 45.8,
    "disk_usage_percent": 23.1,
    "load_average": [1.2, 1.1, 0.9]
  },
  "services": {
    "spa": "running",
    "tls_proxy": "running", 
    "openvpn": "running",
    "nginx": "running"
  },
  "containers": {
    "total": 5,
    "running": 4,
    "stopped": 1
  },
  "sessions": {
    "active": 3,
    "total_today": 12
  }
}
```

## Command Specifications

### 1. User Management Commands

#### 1.1 Create OpenVPN User
**Command**: `create_openvpn_user`
**Parameters**:
```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "user_created": true,
    "config_file": "/etc/openvpn/users/username.ovpn",
    "certificate_path": "/etc/openvpn/certs/username.crt"
  }
}
```
**Implementation**: Execute OpenVPN user creation script with parameters

#### 1.2 Create Panel User
**Command**: `create_panel_user`
**Parameters**:
```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "user_created": true,
    "panel_url": "https://panel.example.com/username",
    "container_name": "chrome-username"
  }
}
```
**Implementation**: Execute panel user creation script with parameters

#### 1.3 Delete User
**Command**: `delete_user`
**Parameters**:
```json
{
  "username": "string"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "openvpn_deleted": true,
    "panel_deleted": true,
    "containers_stopped": 1
  }
}
```
**Implementation**: Remove user from both OpenVPN and panel systems

#### 1.4 List Users
**Command**: `list_users`
**Parameters**: None
**Response**:
```json
{
  "success": true,
  "data": {
    "openvpn_users": ["user1", "user2"],
    "panel_users": ["user1", "user2"],
    "active_sessions": ["user1"]
  }
}
```

### 2. Session Management Commands

#### 2.1 Terminate Session
**Command**: `terminate_session`
**Parameters**:
```json
{
  "username": "string",
  "session_id": "string"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "session_terminated": true,
    "openvpn_disconnected": true,
    "container_stopped": true,
    "routes_cleared": true
  }
}
```

#### 2.2 Get Session Status
**Command**: `get_session_status`
**Parameters**:
```json
{
  "username": "string"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "active": true,
    "session_id": "uuid",
    "start_time": "ISO-8601",
    "ip_address": "10.0.0.100",
    "container_id": "abc123",
    "last_activity": "ISO-8601"
  }
}
```

### 3. Container Management Commands

#### 3.1 Spawn Container
**Command**: `spawn_container`
**Parameters**:
```json
{
  "username": "string",
  "session_id": "string",
  "container_type": "chrome|firefox|desktop"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "container_id": "abc123",
    "container_name": "chrome-username-session",
    "port": 8080,
    "url": "https://gateway:8080/username"
  }
}
```

#### 3.2 Stop Container
**Command**: `stop_container`
**Parameters**:
```json
{
  "container_id": "string"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "container_stopped": true,
    "resources_freed": true
  }
}
```

#### 3.3 List Containers
**Command**: `list_containers`
**Parameters**: None
**Response**:
```json
{
  "success": true,
  "data": {
    "containers": [
      {
        "id": "abc123",
        "name": "chrome-user1",
        "status": "running",
        "username": "user1",
        "session_id": "uuid",
        "created": "ISO-8601",
        "memory_usage_mb": 150,
        "cpu_usage_percent": 2.5
      }
    ]
  }
}
```

### 4. System Monitoring Commands

#### 4.1 Get System Health
**Command**: `get_system_health`
**Parameters**: None
**Response**:
```json
{
  "success": true,
  "data": {
    "cpu": {
      "usage_percent": 15.2,
      "load_average": [1.2, 1.1, 0.9],
      "cores": 4
    },
    "memory": {
      "total_mb": 8192,
      "used_mb": 3750,
      "available_mb": 4442,
      "usage_percent": 45.8
    },
    "disk": {
      "total_gb": 100,
      "used_gb": 23.1,
      "available_gb": 76.9,
      "usage_percent": 23.1
    },
    "network": {
      "interfaces": ["eth0", "tun0"],
      "bytes_sent": 1024000,
      "bytes_received": 2048000
    }
  }
}
```

#### 4.2 Get Service Status
**Command**: `get_service_status`
**Parameters**: None
**Response**:
```json
{
  "success": true,
  "data": {
    "spa": {
      "status": "running",
      "pid": 1234,
      "uptime_seconds": 3600,
      "port": 62201
    },
    "tls_proxy": {
      "status": "running",
      "pid": 1235,
      "uptime_seconds": 3600,
      "port": 443
    },
    "openvpn": {
      "status": "running",
      "pid": 1236,
      "uptime_seconds": 3600,
      "port": 1194,
      "active_connections": 3
    },
    "nginx": {
      "status": "running",
      "pid": 1237,
      "uptime_seconds": 3600,
      "port": 80
    }
  }
}
```

### 5. Bootstrap Generation Commands

#### 5.1 Generate Bootstrap
**Command**: `generate_bootstrap`
**Parameters**:
```json
{
  "username": "string",
  "session_id": "string",
  "ttl_seconds": 300
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "bootstrap_id": "uuid",
    "spa_config": {
      "remote_ip": "gateway.example.com",
      "key_rijndael": "base64-encoded-key",
      "port": 62201
    },
    "tls_config": {
      "proxy_host": "gateway.example.com",
      "proxy_port": 443,
      "certificate": "base64-encoded-cert"
    },
    "openvpn_config": {
      "config_file": "base64-encoded-config",
      "username": "username",
      "password": "temporary-password"
    },
    "expires_at": "ISO-8601"
  }
}
```

#### 5.2 Revoke Bootstrap
**Command**: `revoke_bootstrap`
**Parameters**:
```json
{
  "bootstrap_id": "string"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "bootstrap_revoked": true
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "correlation_id": "uuid-v4",
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      // Additional error context
    }
  },
  "timestamp": "ISO-8601"
}
```

### Error Codes
- `INVALID_PARAMETERS`: Missing or invalid parameters
- `USER_NOT_FOUND`: User doesn't exist
- `USER_ALREADY_EXISTS`: User already exists
- `SESSION_NOT_FOUND`: Session doesn't exist
- `CONTAINER_NOT_FOUND`: Container doesn't exist
- `SERVICE_NOT_RUNNING`: Required service is down
- `INSUFFICIENT_RESOURCES`: Not enough system resources
- `PERMISSION_DENIED`: Operation not permitted
- `TIMEOUT`: Operation timed out
- `INTERNAL_ERROR`: Unexpected internal error

## Security Implementation

### Authentication & Authorization
1. **Mutual TLS**: All communication encrypted with mutual TLS
2. **Certificate Validation**: Strict certificate validation
3. **Command Allowlisting**: Only predefined commands allowed
4. **Parameter Validation**: Strict input validation
5. **Rate Limiting**: Prevent abuse with rate limits

### Audit Logging
Every operation generates an audit event:
```json
{
  "timestamp": "ISO-8601",
  "correlation_id": "uuid-v4",
  "agent_id": "gateway-001",
  "command": "create_openvpn_user",
  "parameters": {
    "username": "user1"
  },
  "result": "success|failure",
  "execution_time_ms": 123,
  "error": null,
  "source_ip": "192.168.1.100"
}
```

### Process Security
1. **Privilege Dropping**: Run with minimal privileges
2. **File System Isolation**: Access only necessary directories
3. **Network Isolation**: Bind to specific interfaces
4. **Resource Limits**: Prevent resource exhaustion
5. **Process Monitoring**: Monitor for anomalies

## Deployment & Configuration

### Configuration File
```toml
[agent]
id = "gateway-001"
host = "0.0.0.0"
port = 8443
log_level = "info"
max_connections = 100

[security]
cert_file = "/etc/viworks/agent.crt"
key_file = "/etc/viworks/agent.key"
ca_file = "/etc/viworks/ca.crt"
allowed_clients = ["backend.example.com"]

[scripts]
openvpn_create = "/usr/local/bin/create_openvpn_user.sh"
openvpn_delete = "/usr/local/bin/delete_openvpn_user.sh"
panel_create = "/usr/local/bin/create_panel_user.sh"
panel_delete = "/usr/local/bin/delete_panel_user.sh"

[monitoring]
status_interval_seconds = 30
health_check_interval_seconds = 60
max_log_size_mb = 100
log_retention_days = 30

[containers]
docker_socket = "/var/run/docker.sock"
base_image = "viworks/chrome:latest"
max_containers = 50
container_timeout_seconds = 3600
```

### System Requirements
- **OS**: Linux (Ubuntu 20.04+ or CentOS 8+)
- **CPU**: 2+ cores
- **RAM**: 4GB+ available
- **Disk**: 20GB+ available
- **Network**: Stable internet connection
- **Dependencies**: Docker, OpenVPN, nginx

### Installation
1. **Binary Installation**: Download and install agent binary
2. **Configuration**: Set up configuration file
3. **Certificates**: Install TLS certificates
4. **Scripts**: Deploy provisioning scripts
5. **Systemd Service**: Create systemd service for auto-start
6. **Firewall**: Configure firewall rules
7. **Monitoring**: Set up monitoring and alerting

## Testing & Validation

### Unit Tests
- Command parameter validation
- Error handling scenarios
- Security checks
- Audit logging

### Integration Tests
- End-to-end command execution
- Backend communication
- Script execution
- Container management

### Security Tests
- Authentication bypass attempts
- Command injection attempts
- Privilege escalation attempts
- Resource exhaustion tests

### Performance Tests
- Concurrent command execution
- High-load scenarios
- Resource usage monitoring
- Response time validation

## Monitoring & Alerting

### Health Checks
- Agent process status
- Service dependencies
- Resource usage
- Network connectivity

### Metrics Collection
- Command execution rates
- Response times
- Error rates
- Resource utilization

### Alerting
- Agent down
- High resource usage
- High error rates
- Security events

## Future Enhancements

### Planned Features
1. **Plugin System**: Extensible command system
2. **Configuration Management**: Dynamic configuration updates
3. **Backup & Recovery**: Automated backup procedures
4. **Load Balancing**: Multiple agent support
5. **Advanced Monitoring**: Detailed performance metrics

### Security Enhancements
1. **Hardware Security Modules**: HSM integration
2. **Zero Trust**: Enhanced authentication
3. **Behavioral Analysis**: Anomaly detection
4. **Encrypted Storage**: Secure credential storage

This specification provides a comprehensive foundation for building a secure, reliable, and efficient Gateway OS Agent that will enable the complete ViWorkS system to function as designed.
