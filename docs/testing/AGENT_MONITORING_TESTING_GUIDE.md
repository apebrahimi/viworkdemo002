# Agent Monitoring and Testing Guide

## Overview
This guide provides comprehensive testing procedures for the ViWorks agent system, including system monitoring, telemetry collection, and frontend integration.

## Current System Status

### ✅ **Backend Agent (64.227.46.188)**
- **Status**: Running and healthy
- **Endpoint**: `https://agent.neuratalent.com`
- **Health Check**: `https://agent.neuratalent.com/health` → `{"status":"healthy"}`
- **Process**: PID 3381, consuming ~6.8MB RAM
- **SSL**: Valid Let's Encrypt certificate

### ✅ **OS Agent (178.128.42.148)**
- **Status**: Active and can connect to Backend Agent
- **Connection**: Successfully tested HTTPS connectivity
- **Configuration**: `agent.toml` configured for port 8443

---

## 🧪 **Testing Procedures**

### 1. Basic Connectivity Tests

#### 1.1 Health Check
```bash
# Test Backend Agent health
curl -k https://agent.neuratalent.com/health

# Expected response:
# {"status":"healthy"}
```

#### 1.2 SSL Certificate Verification
```bash
# Check SSL certificate
openssl s_client -connect agent.neuratalent.com:443 -servername agent.neuratalent.com

# Expected: Valid certificate for agent.neuratalent.com
```

#### 1.3 Cross-Droplet Connectivity
```bash
# Test from OS Agent droplet
ssh root@178.128.42.148 "curl -k https://agent.neuratalent.com/health"

# Expected: {"status":"healthy"}
```

### 2. API Endpoint Testing

#### 2.1 Available Endpoints (Require JWT Authentication)
```bash
# Agent Management
GET /api/v1/agents                    # List all agents
GET /api/v1/agents/{id}              # Get agent details
GET /api/v1/agents/site/{site}       # Get agents by site
PUT /api/v1/agents/{id}/status/{status} # Update agent status

# Command Execution
POST /api/v1/commands                # Send command to agents
GET /api/v1/commands                 # List command history
GET /api/v1/commands/{id}            # Get command status
POST /api/v1/commands/{id}/retry     # Retry command
POST /api/v1/commands/{id}/cancel    # Cancel command

# Telemetry and Monitoring
GET /api/v1/telemetry/{agent_id}     # Get agent telemetry
GET /api/v1/telemetry/{agent_id}/history # Get telemetry history
GET /api/v1/statistics               # Get system statistics

# WebSocket
GET /ws/agent                        # WebSocket endpoint for OS agents
```

#### 2.2 Authentication Required
All API endpoints (except `/health`) require JWT authentication:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://agent.neuratalent.com/api/v1/agents
```

### 3. System Monitoring Tests

#### 3.1 Backend Agent Resource Usage
```bash
# Check container resource usage
ssh root@64.227.46.188 "docker stats viworks-backend-agent-new --no-stream"

# Check process details
ssh root@64.227.46.188 "docker exec viworks-backend-agent-new ps aux"
```

#### 3.2 OS Agent System Metrics
```bash
# Check OS Agent system resources
ssh root@178.128.42.148 "top -bn1 | head -20"
ssh root@178.128.42.148 "free -h"
ssh root@178.128.42.148 "df -h"
```

#### 3.3 Network Connectivity
```bash
# Test network latency
ssh root@178.128.42.148 "ping -c 5 64.227.46.188"

# Test port connectivity
ssh root@178.128.42.148 "telnet 64.227.46.188 443"
```

---

## 📊 **System Metrics Collection**

### 1. CPU and Memory Monitoring

#### 1.1 Backend Agent Metrics
```bash
# Real-time monitoring
ssh root@64.227.46.188 "docker stats viworks-backend-agent-new"

# Historical data (if available via API)
curl -H "Authorization: Bearer JWT_TOKEN" \
     https://agent.neuratalent.com/api/v1/statistics
```

#### 1.2 OS Agent Metrics
```bash
# CPU usage
ssh root@178.128.42.148 "cat /proc/loadavg"

# Memory usage
ssh root@178.128.42.148 "cat /proc/meminfo | grep -E 'MemTotal|MemFree|MemAvailable'"

# Disk usage
ssh root@178.128.42.148 "df -h /"

# Process monitoring
ssh root@178.128.42.148 "ps aux --sort=-%cpu | head -10"
```

### 2. Telemetry Data Collection

#### 2.1 Agent Telemetry (When OS Agent Connects)
```bash
# Get latest telemetry for specific agent
curl -H "Authorization: Bearer JWT_TOKEN" \
     https://agent.neuratalent.com/api/v1/telemetry/{agent_id}

# Get telemetry history
curl -H "Authorization: Bearer JWT_TOKEN" \
     https://agent.neuratalent.com/api/v1/telemetry/{agent_id}/history
```

#### 2.2 System Statistics
```bash
# Get overall system statistics
curl -H "Authorization: Bearer JWT_TOKEN" \
     https://agent.neuratalent.com/api/v1/statistics
```

---

## 🔌 **WebSocket Connection Testing**

### 1. WebSocket Endpoint Test
```bash
# Test WebSocket endpoint (requires WebSocket client)
wscat -c wss://agent.neuratalent.com/ws/agent
```

### 2. OS Agent Connection Test
```bash
# Check if OS Agent can establish WebSocket connection
# This requires the OS Agent to be configured and running
ssh root@178.128.42.148 "systemctl status viworks-gateway-agent"
```

---

## 🎯 **Frontend Integration Testing**

### 1. API Integration Points

#### 1.1 Agent Dashboard
- **Endpoint**: `GET /api/v1/agents`
- **Purpose**: Display list of connected agents
- **Data**: Agent ID, status, last seen, site information

#### 1.2 System Monitoring Dashboard
- **Endpoint**: `GET /api/v1/statistics`
- **Purpose**: Display system-wide metrics
- **Data**: Agent count, command statistics, telemetry stats

#### 1.3 Real-time Telemetry
- **Endpoint**: `GET /api/v1/telemetry/{agent_id}`
- **Purpose**: Display real-time system metrics
- **Data**: CPU, memory, disk usage, network stats

### 2. Frontend Implementation Example

#### 2.1 Agent List Component
```javascript
// Fetch agent list
const fetchAgents = async () => {
  const response = await fetch('https://agent.neuratalent.com/api/v1/agents', {
    headers: {
      'Authorization': `Bearer ${jwtToken}`
    }
  });
  return response.json();
};
```

#### 2.2 System Metrics Component
```javascript
// Fetch system statistics
const fetchSystemStats = async () => {
  const response = await fetch('https://agent.neuratalent.com/api/v1/statistics', {
    headers: {
      'Authorization': `Bearer ${jwtToken}`
    }
  });
  return response.json();
};
```

#### 2.3 Real-time Telemetry Component
```javascript
// Fetch agent telemetry
const fetchAgentTelemetry = async (agentId) => {
  const response = await fetch(`https://agent.neuratalent.com/api/v1/telemetry/${agentId}`, {
    headers: {
      'Authorization': `Bearer ${jwtToken}`
    }
  });
  return response.json();
};
```

---

## 🚨 **Alerting and Monitoring**

### 1. Health Check Monitoring
```bash
# Automated health check script
#!/bin/bash
HEALTH_URL="https://agent.neuratalent.com/health"
RESPONSE=$(curl -s -k $HEALTH_URL)
if [[ $RESPONSE == *"healthy"* ]]; then
    echo "✅ Backend Agent is healthy"
else
    echo "❌ Backend Agent health check failed"
    # Send alert notification
fi
```

### 2. Resource Usage Alerts
```bash
# CPU usage alert
CPU_USAGE=$(ssh root@178.128.42.148 "top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | cut -d'%' -f1")
if (( $(echo "$CPU_USAGE > 80" | bc -l) )); then
    echo "⚠️ High CPU usage: ${CPU_USAGE}%"
fi

# Memory usage alert
MEM_USAGE=$(ssh root@178.128.42.148 "free | grep Mem | awk '{printf \"%.2f\", $3/$2 * 100.0}'")
if (( $(echo "$MEM_USAGE > 85" | bc -l) )); then
    echo "⚠️ High memory usage: ${MEM_USAGE}%"
fi
```

---

## 📋 **Testing Checklist**

### ✅ **Basic Connectivity**
- [ ] Backend Agent health check passes
- [ ] SSL certificate is valid
- [ ] OS Agent can connect to Backend Agent
- [ ] Nginx routing is working correctly

### ✅ **API Endpoints**
- [ ] Health endpoint responds correctly
- [ ] API endpoints require authentication
- [ ] WebSocket endpoint is accessible
- [ ] Error handling works properly

### ✅ **System Monitoring**
- [ ] Backend Agent resource usage is normal
- [ ] OS Agent system metrics are accessible
- [ ] Network connectivity is stable
- [ ] Logs are being generated correctly

### ✅ **Frontend Integration**
- [ ] API endpoints return expected data format
- [ ] Authentication headers are properly handled
- [ ] Real-time updates work (when implemented)
- [ ] Error states are handled gracefully

---

## 🔧 **Troubleshooting**

### Common Issues

#### 1. 404 Errors on API Endpoints
**Cause**: JWT authentication required
**Solution**: Include proper Authorization header

#### 2. WebSocket Connection Fails
**Cause**: OS Agent not properly configured
**Solution**: Check OS Agent configuration and network connectivity

#### 3. High Resource Usage
**Cause**: Agent processing too many commands
**Solution**: Check command queue and processing efficiency

#### 4. SSL Certificate Issues
**Cause**: Certificate expired or misconfigured
**Solution**: Renew certificate using certbot

---

## 📈 **Performance Metrics**

### Target Performance
- **Response Time**: < 100ms for health checks
- **CPU Usage**: < 10% under normal load
- **Memory Usage**: < 100MB for Backend Agent
- **Network Latency**: < 50ms between droplets
- **Uptime**: > 99.9%

### Monitoring Tools
- **Health Checks**: Automated curl scripts
- **Resource Monitoring**: Docker stats, system tools
- **Log Analysis**: Structured JSON logging
- **Alerting**: Custom scripts with notifications

This guide provides a comprehensive framework for testing and monitoring the ViWorks agent system.
