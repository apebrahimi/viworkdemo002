# 🚀 ViWorks OS Agent - Monitoring & Backend Integration Specification

## **📋 Overview**

This document outlines the complete monitoring capabilities of the ViWorks OS Agent deployed on the Debian droplet (`agent-viworks.neuratalent.com`). It provides detailed specifications for backend integration, data collection, and system monitoring.

## **🌐 Agent Access Information**

- **Domain**: `https://agent-viworks.neuratalent.com`
- **IP Address**: `178.128.42.148` (hidden behind domain)
- **SSL**: Let's Encrypt certificate (auto-renewing)
- **Status**: ✅ **Production Ready**

## **📊 Available Monitoring Data**

### **1. System Health Metrics** (`/api/v1/status`)

#### **Real-time Performance Data**
```json
{
  "cpu_usage_percent": 0.061,           // Real-time CPU utilization
  "memory_usage_percent": 17.98,        // RAM usage percentage
  "disk_usage_percent": 0.0,            // Disk usage (placeholder)
  "load_average": {
    "one_minute": 0.0,                  // 1-minute system load
    "five_minutes": 0.02,               // 5-minute system load
    "fifteen_minutes": 0.13             // 15-minute system load
  },
  "uptime_seconds": 4111,               // System uptime in seconds
  "temperature": null                    // CPU temperature (if available)
}
```

#### **Data Collection Frequency**
- **Collection Interval**: Every 30 seconds (configurable)
- **Data Freshness**: Real-time with <1 second latency
- **Historical Retention**: 30 days (configurable)

### **2. Service Status Monitoring** (`/api/v1/status`)

#### **Critical Services Tracked**
```json
{
  "services": [
    {
      "name": "docker",      "status": "stopped",    "pid": null,
      "name": "sshd",        "status": "running",    "pid": null,
      "name": "nginx",       "status": "running",    "pid": null,
      "name": "postgres",    "status": "stopped",    "pid": null,
      "name": "redis",       "status": "stopped",    "pid": null,
      "name": "openvpn",     "status": "stopped",    "pid": null
    }
  ],
  "timestamp": "2025-09-03T09:06:55.757303636+00:00"
}
```

#### **Service Monitoring Features**
- **Status Detection**: Running/Stopped/Error states
- **Process Tracking**: PID monitoring (when available)
- **Resource Usage**: CPU/Memory per service (future enhancement)
- **Auto-discovery**: Automatically detects common services

### **3. Container Management** (`/api/v1/status`)

#### **Docker Container Information**
```json
{
  "containers": []  // Currently empty, ready for user sessions
}
```

#### **Container Capabilities**
- **User Session Management**: Spawn containers for user access
- **Resource Allocation**: Memory limits, CPU shares, port mapping
- **Lifecycle Control**: Start, stop, cleanup operations
- **Session Tracking**: Username, session ID, port allocation

### **4. System Information** (Available in code)

#### **Hardware & OS Details**
```json
{
  "cpu": {
    "cores": 2,                          // CPU core count
    "usage_percent": 0.061,              // Current usage
    "frequency": 2400,                   // CPU frequency (MHz)
    "brand": "Intel(R) Xeon(R) CPU"      // CPU model
  },
  "memory": {
    "total_gb": 2,                       // Total RAM
    "used_gb": 0.36,                     // Used RAM
    "available_gb": 1.64,                // Available RAM
    "usage_percent": 17.98               // Usage percentage
  },
  "network": {
    "interfaces": ["eth0", "lo"],        // Network interfaces
    "bytes_sent": 1024000,               // Bytes transmitted
    "bytes_received": 2048000            // Bytes received
  },
  "system": {
    "hostname": "debian-s-2vcpu-2gb",   // Server hostname
    "os_name": "Debian GNU/Linux",       // Operating system
    "os_version": "12 (bookworm)",       // OS version
    "kernel_version": "6.1.0-13"         // Kernel version
  }
}
```

## **🔌 API Endpoints Reference**

### **1. Health Check**
- **Endpoint**: `GET /api/v1/health`
- **Purpose**: Basic agent health verification
- **Response**: `{"status":"healthy","timestamp":"...","version":"0.1.0","uptime":4111}`
- **Use Case**: Load balancer health checks, basic monitoring

### **2. System Status**
- **Endpoint**: `GET /api/v1/status`
- **Purpose**: Complete system monitoring data
- **Response**: Full system health, services, and containers
- **Use Case**: Dashboard data, comprehensive monitoring

### **3. Simple Status**
- **Endpoint**: `GET /api/v1/status-simple`
- **Purpose**: Lightweight status check
- **Response**: Basic health indicators
- **Use Case**: Quick status checks, reduced bandwidth

### **4. Command Execution**
- **Endpoint**: `POST /api/v1/command`
- **Purpose**: Execute system commands
- **Request**: JSON with command, parameters, authentication
- **Response**: Command results and execution status
- **Use Case**: Remote administration, automation

## **📈 Backend Integration Patterns**

### **Data Collection Strategy**

#### **High-Frequency Monitoring (30s)**
```json
{
  "endpoint": "/api/v1/status",
  "frequency": "30 seconds",
  "data": ["cpu_usage", "memory_usage", "load_average"],
  "use_case": "Real-time performance monitoring"
}
```

#### **Medium-Frequency Monitoring (5m)**
```json
{
  "endpoint": "/api/v1/status",
  "frequency": "5 minutes",
  "data": ["service_status", "container_count"],
  "use_case": "Service health monitoring"
}
```

#### **Low-Frequency Monitoring (1h)**
```json
{
  "endpoint": "/api/v1/status",
  "frequency": "1 hour",
  "data": ["system_info", "disk_usage", "network_stats"],
  "use_case": "System inventory and trends"
}
```

### **Data Storage Recommendations**

#### **Time-Series Database Schema**
```sql
-- Performance metrics
CREATE TABLE agent_metrics (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(50),
    timestamp TIMESTAMP,
    cpu_usage DECIMAL(5,2),
    memory_usage DECIMAL(5,2),
    load_average_1m DECIMAL(5,2),
    load_average_5m DECIMAL(5,2),
    load_average_15m DECIMAL(5,2),
    uptime_seconds BIGINT
);

-- Service status
CREATE TABLE service_status (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(50),
    timestamp TIMESTAMP,
    service_name VARCHAR(100),
    status VARCHAR(20),
    pid INTEGER
);

-- Container sessions
CREATE TABLE container_sessions (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(50),
    container_id VARCHAR(100),
    username VARCHAR(100),
    session_id VARCHAR(100),
    port INTEGER,
    status VARCHAR(20),
    created_at TIMESTAMP,
    stopped_at TIMESTAMP
);
```

### **Alerting & Thresholds**

#### **Performance Alerts**
```json
{
  "cpu_usage": {
    "warning": 80.0,        // Alert at 80% CPU
    "critical": 95.0        // Critical at 95% CPU
  },
  "memory_usage": {
    "warning": 85.0,        // Alert at 85% memory
    "critical": 95.0        // Critical at 95% memory
  },
  "load_average": {
    "warning": 2.0,         // Alert at 2.0 load
    "critical": 5.0         // Critical at 5.0 load
  }
}
```

#### **Service Alerts**
```json
{
  "critical_services": ["nginx", "sshd", "viworks-gateway-agent"],
  "monitoring_services": ["docker", "postgres", "redis", "openvpn"],
  "alert_on": ["stopped", "error", "unresponsive"]
}
```

## **🔒 Security & Authentication**

### **Current Security Features**
- **SSL/TLS**: All communications encrypted
- **IP Filtering**: Configurable allowed IP ranges
- **Rate Limiting**: 100 requests per minute window
- **Audit Logging**: Complete command execution history

### **Recommended Enhancements**
- **API Key Authentication**: Secure backend communication
- **JWT Tokens**: Session-based authentication
- **Role-Based Access**: Different permission levels
- **Encrypted Storage**: Sensitive data encryption

## **📊 Monitoring Dashboard Components**

### **Real-time Metrics**
1. **Performance Graph**: CPU, Memory, Load trends
2. **Service Status**: Visual service health indicators
3. **Resource Usage**: Current utilization percentages
4. **System Uptime**: Reliability tracking

### **Historical Analysis**
1. **Trend Analysis**: Performance over time
2. **Capacity Planning**: Resource usage patterns
3. **Incident History**: Service outages and recovery
4. **Performance Reports**: Daily/weekly/monthly summaries

### **Operational Tools**
1. **Container Management**: Start/stop user sessions
2. **Service Control**: Restart failed services
3. **System Commands**: Remote administration
4. **Log Access**: Real-time log viewing

## **🚀 Implementation Roadmap**

### **Phase 1: Basic Integration (Week 1)**
- [ ] Set up data collection endpoints
- [ ] Implement basic alerting
- [ ] Create simple dashboard

### **Phase 2: Enhanced Monitoring (Week 2-3)**
- [ ] Add historical data storage
- [ ] Implement advanced alerting
- [ ] Create performance reports

### **Phase 3: Advanced Features (Week 4+)**
- [ ] Add container management UI
- [ ] Implement automated responses
- [ ] Create comprehensive dashboards

## **📞 Support & Maintenance**

### **Agent Health Monitoring**
- **Self-Monitoring**: Agent monitors its own health
- **Auto-Recovery**: Automatic service restart on failure
- **Log Rotation**: Automatic log management
- **Certificate Renewal**: Automatic SSL renewal

### **Troubleshooting**
- **Health Endpoints**: Quick status verification
- **Log Access**: Detailed error information
- **Service Status**: Individual service monitoring
- **Resource Usage**: Performance bottleneck identification

---

**Document Version**: 1.0  
**Last Updated**: 2025-09-03  
**Maintainer**: ViWorks Development Team  
**Status**: ✅ **Production Ready**
