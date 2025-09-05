# ViWorkS Production Connectivity Test Plan

**Date:** September 5, 2025  
**Objective:** Verify that the core connectivity fixes enable successful agent communication and data transfer

## Test Overview

This test plan validates the critical fixes implemented:
1. ✅ **Gap 1: Single Executor** - No more double handlers
2. ✅ **WebSocket Server Fix** - Backend Agent WebSocket server running
3. ✅ **Nginx Port Fix** - Correct port routing (8081 for WebSocket)
4. ✅ **Gateway Agent Service** - Systemd service ready

## Test Environment

- **Backend Agent**: 64.227.46.188 (Digital Ocean)
- **Gateway Agent**: 178.128.42.148 (Digital Ocean)
- **Domain**: agent.neuratalent.com

## Test Sequence

### Phase 1: Backend Agent Validation

#### 1.1 Backend Agent Process Check
```bash
# Check if Backend Agent is running
ssh root@64.227.46.188 "docker ps | grep viworks-backend-agent"
ssh root@64.227.46.188 "docker logs viworks-backend-agent-new --tail 50"
```

#### 1.2 WebSocket Server Port Check
```bash
# Verify WebSocket server is listening on port 8081
ssh root@64.227.46.188 "netstat -tlnp | grep 8081"
ssh root@64.227.46.188 "ss -tlnp | grep 8081"
```

#### 1.3 HTTP Server Port Check
```bash
# Verify HTTP server is listening on port 8080
ssh root@64.227.46.188 "netstat -tlnp | grep 8080"
ssh root@64.227.46.188 "ss -tlnp | grep 8080"
```

### Phase 2: Nginx Configuration Validation

#### 2.1 Nginx Process Check
```bash
# Check Nginx is running
ssh root@64.227.46.188 "systemctl status nginx"
ssh root@64.227.46.188 "nginx -t"
```

#### 2.2 Nginx Configuration Reload
```bash
# Reload Nginx with new configuration
ssh root@64.227.46.188 "systemctl reload nginx"
```

### Phase 3: WebSocket Connection Test

#### 3.1 WebSocket Upgrade Test
```bash
# Test WebSocket upgrade through Nginx
curl -v -H "Connection: Upgrade" -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  https://agent.neuratalent.com/ws/agent
```

#### 3.2 Direct WebSocket Test
```bash
# Test direct WebSocket connection (if accessible)
wscat -c wss://agent.neuratalent.com/ws/agent
```

### Phase 4: Gateway Agent Validation

#### 4.1 Gateway Agent Service Check
```bash
# Check if Gateway Agent service is installed
ssh root@178.128.42.148 "systemctl status viworks-gateway-agent"
```

#### 4.2 Gateway Agent Process Check
```bash
# Check if Gateway Agent process is running
ssh root@178.128.42.148 "ps aux | grep viworks-gateway-agent"
```

#### 4.3 Gateway Agent Configuration Check
```bash
# Check Gateway Agent configuration
ssh root@178.128.42.148 "ls -la /opt/viworks/agent/"
ssh root@178.128.42.148 "cat /opt/viworks/agent/config/agent-outbound.toml"
```

### Phase 5: End-to-End Connection Test

#### 5.1 Gateway Agent Connection Attempt
```bash
# Start Gateway Agent and monitor connection
ssh root@178.128.42.148 "systemctl start viworks-gateway-agent"
ssh root@178.128.42.148 "journalctl -u viworks-gateway-agent -f"
```

#### 5.2 Backend Agent Logs
```bash
# Monitor Backend Agent logs for incoming connections
ssh root@64.227.46.188 "docker logs viworks-backend-agent-new -f"
```

#### 5.3 Agent Registration Check
```bash
# Check if agent appears in Backend Agent registry
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://agent.neuratalent.com/agents
```

### Phase 6: Data Transfer Test

#### 6.1 Command Execution Test
```bash
# Execute a simple command to test data transfer
curl -X POST https://agent.neuratalent.com/commands \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "verb": "get_system_health",
    "args": {},
    "agent_targets": ["os-agent-178-128-42-148"]
  }'
```

#### 6.2 Telemetry Data Test
```bash
# Check if telemetry data is being received
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://agent.neuratalent.com/telemetry/os-agent-178-128-42-148
```

## Expected Results

### ✅ Success Criteria

1. **Backend Agent**: WebSocket server listening on port 8081
2. **Nginx**: WebSocket upgrade returns HTTP 101
3. **Gateway Agent**: Successfully connects to Backend Agent
4. **Agent Registration**: Agent appears in Backend Agent registry
5. **Command Execution**: Commands can be sent and executed
6. **Data Transfer**: Telemetry data flows from Gateway to Backend

### ❌ Failure Indicators

1. **Port Issues**: WebSocket server not listening on 8081
2. **Nginx Issues**: WebSocket upgrade fails or returns 404
3. **Connection Issues**: Gateway Agent cannot connect
4. **Authentication Issues**: Agent registration fails
5. **Command Issues**: Commands fail to execute
6. **Data Issues**: No telemetry data received

## Troubleshooting Guide

### Common Issues and Solutions

#### Issue 1: WebSocket Server Not Listening
```bash
# Check Backend Agent logs
ssh root@64.227.46.188 "docker logs viworks-backend-agent-new --tail 100"

# Restart Backend Agent
ssh root@64.227.46.188 "docker restart viworks-backend-agent-new"
```

#### Issue 2: Nginx WebSocket Upgrade Fails
```bash
# Check Nginx configuration
ssh root@64.227.46.188 "nginx -t"

# Check Nginx logs
ssh root@64.227.46.188 "tail -f /var/log/nginx/backend-agent.access.log"
```

#### Issue 3: Gateway Agent Connection Fails
```bash
# Check Gateway Agent logs
ssh root@178.128.42.148 "journalctl -u viworks-gateway-agent --tail 100"

# Check network connectivity
ssh root@178.128.42.148 "ping -c 3 agent.neuratalent.com"
```

## Test Results Log

### Test Execution Log
- [ ] Phase 1: Backend Agent Validation
- [ ] Phase 2: Nginx Configuration Validation  
- [ ] Phase 3: WebSocket Connection Test
- [ ] Phase 4: Gateway Agent Validation
- [ ] Phase 5: End-to-End Connection Test
- [ ] Phase 6: Data Transfer Test

### Issues Found
- [ ] Issue 1: [Description]
- [ ] Issue 2: [Description]
- [ ] Issue 3: [Description]

### Resolution Status
- [ ] All tests passed - Ready for production
- [ ] Issues found - Need fixes before production
- [ ] Critical issues - Need immediate attention

## Next Steps

Based on test results:
1. **All Pass**: Proceed with remaining production hardening gaps
2. **Some Issues**: Fix identified issues and retest
3. **Critical Issues**: Address immediately before proceeding
