# ViWorkS Backend Integration Guide

This document explains how to integrate the ViWorkS backend with the Gateway OS Agent for complete user provisioning and system monitoring.

## Overview

The Gateway OS Agent provides a secure API for:
1. **User Provisioning** - Create users in both VPN and panel systems
2. **System Monitoring** - Real-time health and status monitoring
3. **Session Management** - Terminate user sessions
4. **Container Management** - Spawn/stop user containers
5. **Bootstrap Generation** - Create short-lived connection credentials

## API Communication

### Base URL
```
http://gateway-agent:8443/api/v1
```

### Authentication
- **Header**: `X-Client-Cert: <certificate-hash>`
- **Method**: Mutual TLS (in production)
- **Rate Limiting**: 100 requests per minute per client

### Request Format
```json
{
  "correlation_id": "uuid-v4",
  "command": "command_name",
  "parameters": {
    // Command-specific parameters
  },
  "timestamp": "ISO-8601",
  "signature": "optional-hmac-signature"
}
```

### Response Format
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

## User Provisioning Flow

### Step 1: Create Panel User
**Command**: `create_panel_user`

**Parameters**:
```json
{
  "username": "user123",
  "password": "SecurePass@123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user_created": true,
    "username": "user123",
    "password": "SecurePass@123",
    "panel_url": "https://panel.example.com/user123",
    "app_file": "/opt/ViWorks/app.py"
  }
}
```

**Backend Implementation**:
```rust
// Generate secure password
let password = generate_secure_password();

// Call agent to create panel user
let response = agent_client.create_panel_user(&username, &password).await?;

// Store user credentials in database
store_user_credentials(&username, &password, &response.data).await?;
```

### Step 2: Create VPN User
**Command**: `create_openvpn_user`

**Parameters**:
```json
{
  "username": "user123",
  "userpass": "VpnPass@456",
  "source_ip": "10.20.30.11",
  "key": "Keys2338388373737",
  "hmac_key": "Hmac38737383838",
  "timeout": 3600
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user_created": true,
    "username": "user123",
    "userpass": "VpnPass@456",
    "source_ip": "10.20.30.11",
    "key": "Keys2338388373737",
    "hmac_key": "Hmac38737383838",
    "timeout": 3600,
    "vpn_server": "127.0.0.1:443",
    "vpn_hub": "VPN"
  }
}
```

**Backend Implementation**:
```rust
// Generate VPN credentials
let vpn_pass = generate_secure_password();
let source_ip = generate_source_ip();
let key = generate_random_key();
let hmac_key = generate_hmac_key();

// Call agent to create VPN user
let response = agent_client.create_vpn_user(
    &username,
    &vpn_pass,
    &source_ip,
    &key,
    &hmac_key,
    3600
).await?;

// Store VPN credentials for bootstrap generation
store_vpn_credentials(&username, &response.data).await?;
```

### Step 3: Complete User Provisioning
After both users are created successfully:

```rust
// Update user status in database
update_user_provisioning_status(&username, "completed").await?;

// Log audit event
log_audit_event("user.provisioned", &username, &response).await?;

// Send notification to admin panel
notify_admin_panel("user_provisioned", &username).await?;
```

## System Monitoring

### Get Comprehensive Monitoring Data
**Command**: `get_monitoring_data`

**Parameters**: `{}`

**Response**:
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-01-01T00:00:00Z",
    "agent_status": {
      "agent_id": "gateway-001",
      "uptime_seconds": 3600,
      "version": "0.1.0",
      "status": "healthy"
    },
    "system_health": {
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
    },
    "service_status": {
      "spa": "running",
      "tls_proxy": "running",
      "openvpn": "running",
      "nginx": "running"
    },
    "containers": [
      {
        "id": "abc123",
        "name": "chrome-user1",
        "status": "running",
        "username": "user1",
        "session_id": "uuid",
        "created": "2024-01-01T00:00:00Z",
        "memory_usage_mb": 150,
        "cpu_usage_percent": 2.5
      }
    ],
    "gateway_info": {
      "hostname": "gateway-001",
      "os": "linux",
      "arch": "x86_64"
    }
  }
}
```

**Backend Implementation**:
```rust
// Get monitoring data from agent
let monitoring_data = agent_client.get_monitoring_data().await?;

// Store in database for historical tracking
store_monitoring_data(&monitoring_data).await?;

// Check for alerts
check_system_alerts(&monitoring_data).await?;

// Update admin panel dashboard
update_dashboard(&monitoring_data).await?;
```

## Bootstrap Generation

### Generate Bootstrap Credentials
**Command**: `generate_bootstrap`

**Parameters**:
```json
{
  "username": "user123",
  "session_id": "uuid-session-123",
  "ttl_seconds": 300
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "bootstrap_id": "uuid-bootstrap-123",
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
      "username": "user123",
      "password": "temporary-password"
    },
    "expires_at": "2024-01-01T00:05:00Z"
  }
}
```

**Backend Implementation**:
```rust
// Generate bootstrap after successful 2FA
let bootstrap = agent_client.generate_bootstrap(
    &username,
    &session_id,
    300 // 5 minutes TTL
).await?;

// Send bootstrap to macOS client
send_bootstrap_to_client(&session_id, &bootstrap).await?;

// Store bootstrap reference for cleanup
store_bootstrap_reference(&bootstrap.bootstrap_id, &session_id).await?;
```

## Session Management

### Terminate User Session
**Command**: `terminate_session`

**Parameters**:
```json
{
  "username": "user123",
  "session_id": "uuid-session-123"
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

**Backend Implementation**:
```rust
// Terminate session (manual or policy-based)
let result = agent_client.terminate_session(&username, &session_id).await?;

// Update session status in database
update_session_status(&session_id, "terminated").await?;

// Notify macOS client
notify_client_session_terminated(&session_id).await?;

// Log audit event
log_audit_event("session.terminated", &username, &result).await?;
```

## Backend Client Implementation

### Rust Client Example
```rust
use reqwest::Client;
use serde_json::{json, Value};
use uuid::Uuid;
use chrono::Utc;

pub struct AgentClient {
    client: Client,
    base_url: String,
    cert_hash: String,
}

impl AgentClient {
    pub fn new(base_url: String, cert_hash: String) -> Self {
        Self {
            client: Client::new(),
            base_url,
            cert_hash,
        }
    }

    pub async fn execute_command(
        &self,
        command: &str,
        parameters: Value,
    ) -> Result<Value, Box<dyn std::error::Error>> {
        let correlation_id = Uuid::new_v4().to_string();
        
        let request_data = json!({
            "correlation_id": correlation_id,
            "command": command,
            "parameters": parameters,
            "timestamp": Utc::now().to_rfc3339(),
            "signature": "optional-signature"
        });

        let response = self.client
            .post(&format!("{}/api/v1/command", self.base_url))
            .header("Content-Type", "application/json")
            .header("X-Client-Cert", &self.cert_hash)
            .json(&request_data)
            .send()
            .await?;

        let response_data: Value = response.json().await?;
        
        if response_data["success"].as_bool().unwrap_or(false) {
            Ok(response_data["data"].clone())
        } else {
            Err(format!("Command failed: {:?}", response_data["error"]).into())
        }
    }

    pub async fn create_panel_user(
        &self,
        username: &str,
        password: &str,
    ) -> Result<Value, Box<dyn std::error::Error>> {
        let parameters = json!({
            "username": username,
            "password": password
        });

        self.execute_command("create_panel_user", parameters).await
    }

    pub async fn create_vpn_user(
        &self,
        username: &str,
        userpass: &str,
        source_ip: &str,
        key: &str,
        hmac_key: &str,
        timeout: u64,
    ) -> Result<Value, Box<dyn std::error::Error>> {
        let parameters = json!({
            "username": username,
            "userpass": userpass,
            "source_ip": source_ip,
            "key": key,
            "hmac_key": hmac_key,
            "timeout": timeout
        });

        self.execute_command("create_openvpn_user", parameters).await
    }

    pub async fn get_monitoring_data(&self) -> Result<Value, Box<dyn std::error::Error>> {
        self.execute_command("get_monitoring_data", json!({})).await
    }

    pub async fn generate_bootstrap(
        &self,
        username: &str,
        session_id: &str,
        ttl_seconds: u64,
    ) -> Result<Value, Box<dyn std::error::Error>> {
        let parameters = json!({
            "username": username,
            "session_id": session_id,
            "ttl_seconds": ttl_seconds
        });

        self.execute_command("generate_bootstrap", parameters).await
    }

    pub async fn terminate_session(
        &self,
        username: &str,
        session_id: &str,
    ) -> Result<Value, Box<dyn std::error::Error>> {
        let parameters = json!({
            "username": username,
            "session_id": session_id
        });

        self.execute_command("terminate_session", parameters).await
    }
}
```

## Error Handling

### Common Error Codes
- `INVALID_PARAMETERS` - Missing or invalid parameters
- `USER_NOT_FOUND` - User doesn't exist
- `USER_ALREADY_EXISTS` - User already exists
- `SESSION_NOT_FOUND` - Session doesn't exist
- `SERVICE_NOT_RUNNING` - Required service is down
- `INSUFFICIENT_RESOURCES` - Not enough system resources
- `PERMISSION_DENIED` - Operation not permitted
- `TIMEOUT` - Operation timed out

### Error Handling Example
```rust
match agent_client.create_panel_user(&username, &password).await {
    Ok(data) => {
        info!("Panel user created successfully: {:?}", data);
        Ok(data)
    }
    Err(e) => {
        error!("Failed to create panel user: {}", e);
        
        // Check if user already exists
        if e.to_string().contains("USER_ALREADY_EXISTS") {
            warn!("User {} already exists in panel", username);
            Ok(json!({"user_created": false, "reason": "already_exists"}))
        } else {
            Err(e)
        }
    }
}
```

## Security Considerations

### 1. Credential Management
- **Generate secure passwords** for both panel and VPN users
- **Store credentials securely** in database with encryption
- **Use short TTL** for bootstrap credentials
- **Rotate keys regularly** for SPA/Port-Knocking

### 2. Communication Security
- **Use mutual TLS** in production
- **Validate certificates** strictly
- **Rate limit requests** to prevent abuse
- **Log all operations** for audit trail

### 3. Access Control
- **Validate user permissions** before operations
- **Check session ownership** before termination
- **Limit agent access** to necessary operations only

## Monitoring and Alerting

### 1. System Health Monitoring
```rust
// Check system health every 30 seconds
tokio::spawn(async move {
    let mut interval = tokio::time::interval(Duration::from_secs(30));
    
    loop {
        interval.tick().await;
        
        match agent_client.get_monitoring_data().await {
            Ok(data) => {
                // Check for alerts
                check_system_alerts(&data).await?;
                
                // Update dashboard
                update_dashboard(&data).await?;
            }
            Err(e) => {
                error!("Failed to get monitoring data: {}", e);
                // Send alert about agent connectivity
                send_alert("agent_connectivity_failed", &e.to_string()).await?;
            }
        }
    }
});
```

### 2. Alert Conditions
- **High CPU usage** (>80% for 5 minutes)
- **High memory usage** (>90% for 5 minutes)
- **Low disk space** (<10% available)
- **Service down** (SPA, TLS proxy, OpenVPN, nginx)
- **Agent connectivity lost** (>2 minutes)
- **High error rate** (>10% for 5 minutes)

## Testing

### 1. Unit Tests
```rust
#[tokio::test]
async fn test_create_panel_user() {
    let client = AgentClient::new(
        "http://localhost:8443".to_string(),
        "mock-cert".to_string(),
    );

    let result = client
        .create_panel_user("testuser", "TestPass@123")
        .await;

    assert!(result.is_ok());
    
    let data = result.unwrap();
    assert_eq!(data["user_created"], true);
    assert_eq!(data["username"], "testuser");
}
```

### 2. Integration Tests
```rust
#[tokio::test]
async fn test_full_user_provisioning() {
    let client = AgentClient::new(
        "http://localhost:8443".to_string(),
        "mock-cert".to_string(),
    );

    let username = "integration_test_user";
    let panel_pass = "PanelPass@123";
    let vpn_pass = "VpnPass@456";

    // Create panel user
    let panel_result = client
        .create_panel_user(username, panel_pass)
        .await;
    assert!(panel_result.is_ok());

    // Create VPN user
    let vpn_result = client
        .create_vpn_user(
            username,
            vpn_pass,
            "10.20.30.11",
            "Keys2338388373737",
            "Hmac38737383838",
            3600,
        )
        .await;
    assert!(vpn_result.is_ok());

    // Clean up
    let _ = client.delete_user(username).await;
}
```

## Deployment Checklist

### 1. Agent Setup
- [ ] Agent installed and running on Gateway OS
- [ ] Scripts deployed to `/opt/Viworks/scripts_viworks/`
- [ ] Certificates configured for mutual TLS
- [ ] Agent accessible from backend network

### 2. Backend Integration
- [ ] Agent client implemented in backend
- [ ] Error handling and retry logic implemented
- [ ] Monitoring and alerting configured
- [ ] Audit logging integrated

### 3. Testing
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Load testing completed
- [ ] Security testing completed

### 4. Production
- [ ] Mutual TLS certificates deployed
- [ ] Rate limiting configured
- [ ] Monitoring dashboards active
- [ ] Backup and recovery procedures tested

This integration guide provides everything needed to connect your backend with the Gateway OS Agent for complete ViWorkS functionality.
