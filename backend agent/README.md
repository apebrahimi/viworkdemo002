# 🚀 ViWorkS Backend Agent

**A secure, high-performance backend agent for managing multiple OS agents with command execution, telemetry collection, and real-time monitoring.**

## 📋 Overview

The ViWorkS Backend Agent is the control plane for your distributed OS agent infrastructure. It provides:

- **Multi-Agent Management**: Handle hundreds of OS agents simultaneously
- **Secure Command Execution**: Signed commands with validation and audit trails
- **Real-time Telemetry**: Collect and store system health data
- **REST API**: Programmatic access to agent management functions
- **WebSocket Server**: Accept connections from OS agents
- **Database Integration**: PostgreSQL for persistence, Redis for caching
- **Security First**: JWT authentication, mTLS, and comprehensive audit logging

## 🏗️ Architecture

```mermaid
graph TB
    A[Backend Application] -->|REST API| B[Backend Agent]
    B -->|WebSocket| C[OS Agent 1]
    B -->|WebSocket| D[OS Agent 2]
    B -->|WebSocket| E[OS Agent N]
    B -->|PostgreSQL| F[Database]
    B -->|Redis| G[Cache]
    
    C -->|Results/Telemetry| B
    D -->|Results/Telemetry| B
    E -->|Results/Telemetry| B
```

## ✨ Features

### 🔒 Security
- **JWT Authentication**: Secure API access with configurable expiration
- **mTLS Support**: Mutual TLS for agent connections
- **Command Signing**: All commands digitally signed
- **Audit Logging**: Complete audit trail of all operations
- **Rate Limiting**: Per-client request throttling

### 📊 Monitoring
- **Real-time Health**: Live agent status and health metrics
- **Telemetry Collection**: System performance data every 30 seconds
- **Historical Data**: Store and analyze trends over time
- **Alerting**: Configurable alerts for agent failures

### 🚀 Performance
- **Async Architecture**: Built with Tokio for high concurrency
- **Connection Pooling**: Efficient database and Redis connections
- **Load Balancing**: Distribute commands across available agents
- **Caching**: Redis-based caching for frequently accessed data

### 🔧 Management
- **Agent Registry**: Track all connected agents and capabilities
- **Command Queue**: Queue and execute commands with priorities
- **Retry Logic**: Automatic retry with exponential backoff
- **Health Checks**: Proactive monitoring of agent health

## 🛠️ Technology Stack

- **Language**: Rust 1.89+
- **Web Framework**: Actix-web 4.4
- **Async Runtime**: Tokio 1.0
- **Database**: PostgreSQL with SQLx
- **Cache**: Redis with connection pooling
- **WebSocket**: Tokio-tungstenite
- **Security**: Ring, JWT, mTLS
- **Logging**: Tracing with structured logging

## 📦 Installation

### Prerequisites

- **PostgreSQL 12+**: Database for persistent storage
- **Redis 6+**: Cache and session storage
- **Rust 1.89+**: For building from source
- **Linux/macOS**: Supported operating systems

### Quick Start

1. **Download Release Binary**
   ```bash
   # Download the latest release for your platform
   wget https://github.com/viworks/backend-agent/releases/latest/download/viworks-backend-agent-linux_x86_64.tar.gz
   tar -xzf viworks-backend-agent-linux_x86_64.tar.gz
   cd viworks-backend-agent-linux_x86_64
   ```

2. **Install Dependencies**
   ```bash
   # Install PostgreSQL and Redis
   sudo apt update
   sudo apt install postgresql redis-server
   
   # Create database and user
   sudo -u postgres createdb viworks
   sudo -u postgres createuser viworks
   sudo -u postgres psql -c "ALTER USER viworks WITH PASSWORD 'viworks';"
   ```

3. **Configure Environment**
   ```bash
   # Copy environment template
   cp env.example .env
   
   # Edit with your values
   nano .env
   ```

4. **Run the Agent**
   ```bash
   # Start the service
   sudo ./install.sh
   
   # Check status
   sudo systemctl status viworks-backend-agent
   ```

### Build from Source

1. **Clone Repository**
   ```bash
   git clone https://github.com/viworks/backend-agent.git
   cd backend-agent
   ```

2. **Build Release Binary**
   ```bash
   # Build for current platform
   cargo build --release
   
   # Build for multiple platforms
   chmod +x scripts/build-release.sh
   ./scripts/build-release.sh
   ```

3. **Install**
   ```bash
   # Install binary
   sudo cp target/release/viworks-backend-agent /usr/local/bin/
   sudo chmod +x /usr/local/bin/viworks-backend-agent
   ```

## ⚙️ Configuration

### Environment Variables

```bash
# Server Configuration
BACKEND_AGENT_BIND_ADDRESS=0.0.0.0
BACKEND_AGENT_PORT=8080
BACKEND_AGENT_WORKERS=4

# Database Configuration
DATABASE_URL=postgresql://viworks:viworks@localhost/viworks
DATABASE_MAX_CONNECTIONS=10

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_POOL_SIZE=10

# Security Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=3600
BACKEND_PRIVATE_KEY_PATH=/etc/viworks/backend.key
BACKEND_CERTIFICATE_PATH=/etc/viworks/backend.crt

# Agent Management
MAX_AGENT_CONNECTIONS=100
AGENT_HEARTBEAT_INTERVAL=30

# Command Configuration
MAX_CONCURRENT_COMMANDS=50
COMMAND_TIMEOUT=60

# Logging
RUST_LOG=info
```

### Configuration File

```toml
[server]
bind_address = "0.0.0.0"
port = 8080
workers = 4
max_connections = 1000
request_timeout = 30
cors_origins = ["*"]

[database]
url = "postgresql://viworks:viworks@localhost/viworks"
max_connections = 10
min_connections = 2
connect_timeout = 10
idle_timeout = 300
max_lifetime = 3600

[redis]
url = "redis://localhost:6379"
pool_size = 10
connection_timeout = 5
read_timeout = 3
write_timeout = 3

[security]
jwt_secret = "change-me-in-production"
jwt_expiration = 3600
backend_private_key_path = "/etc/viworks/backend.key"
backend_certificate_path = "/etc/viworks/backend.crt"
allowed_origins = ["*"]
rate_limit_requests = 100
rate_limit_window = 60

[agent_management]
max_agent_connections = 100
heartbeat_interval = 30
connection_timeout = 60
max_reconnect_attempts = 5
reconnect_backoff_ms = 1000

[command]
max_concurrent_commands = 50
command_timeout = 60
max_command_queue_size = 1000
retry_attempts = 3
retry_delay_ms = 1000

[telemetry]
collection_interval = 30
retention_days = 30
batch_size = 100
flush_interval = 5

[logging]
level = "info"
format = "json"
output = "stdout"
max_file_size = 104857600
max_files = 10
```

## 📡 API Reference

### Authentication

All API endpoints require JWT authentication:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8080/api/v1/agents
```

### Endpoints

#### Agent Management

- `GET /api/v1/agents` - List all agents
- `GET /api/v1/agents/{id}` - Get agent details
- `GET /api/v1/agents/{id}/health` - Get agent health status
- `GET /api/v1/agents/{id}/telemetry` - Get agent telemetry data

#### Command Execution

- `POST /api/v1/commands` - Send command to agents
- `GET /api/v1/commands/{id}` - Get command status
- `GET /api/v1/commands` - List command history
- `DELETE /api/v1/commands/{id}` - Cancel command

#### System Status

- `GET /api/v1/health` - System health check
- `GET /api/v1/metrics` - System metrics
- `GET /api/v1/status` - Overall system status

### Example Usage

```bash
# Send command to create a user
curl -X POST http://localhost:8080/api/v1/commands \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "verb": "create_panel_user",
    "args": {
      "username": "testuser",
      "password": "securepass123"
    },
    "agent_targets": ["gateway-001"],
    "priority": "normal"
  }'

# Check command status
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8080/api/v1/commands/COMMAND_ID

# Get agent list
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8080/api/v1/agents
```

## 🔌 OS Agent Integration

### WebSocket Connection

OS agents connect to the backend agent via WebSocket:

```rust
// Connect to backend agent
let url = "ws://localhost:8080/ws/agent";
let (ws_stream, _) = connect_async(url).await?;

// Send HELLO frame
let hello = serde_json::json!({
    "type": "HELLO",
    "payload": {
        "agent_id": "gateway-001",
        "site": "production",
        "version": "1.0.0",
        "capabilities": ["create_user", "delete_user"]
    }
});

ws_stream.send(Message::Text(hello.to_string())).await?;
```

### Message Types

- **HELLO**: Agent registration and capability announcement
- **HEARTBEAT**: Periodic health status updates
- **TELEMETRY**: System performance data
- **COMMAND_RESULT**: Command execution results

## 🚨 Security Considerations

### Production Deployment

1. **Change Default Secrets**
   ```bash
   # Generate strong JWT secret
   openssl rand -base64 32
   
   # Update .env file
   JWT_SECRET=your-generated-secret-here
   ```

2. **TLS/SSL Configuration**
   ```bash
   # Generate certificates
   openssl req -x509 -newkey rsa:4096 -keyout backend.key -out backend.crt -days 365
   
   # Update configuration
   BACKEND_PRIVATE_KEY_PATH=/path/to/backend.key
   BACKEND_CERTIFICATE_PATH=/path/to/backend.crt
   ```

3. **Network Security**
   ```bash
   # Configure firewall
   sudo ufw allow 8080/tcp
   sudo ufw allow from 10.0.0.0/8 to any port 8080
   ```

4. **Database Security**
   ```bash
   # Use strong passwords
   # Enable SSL connections
   # Restrict network access
   ```

## 📊 Monitoring & Observability

### Logging

The agent uses structured JSON logging:

```json
{
  "timestamp": "2025-01-01T00:00:00Z",
  "level": "info",
  "target": "viworks_backend_agent",
  "message": "Agent connected",
  "agent_id": "gateway-001",
  "remote_addr": "192.168.1.100"
}
```

### Metrics

Key metrics to monitor:

- **Agent Connections**: Number of active OS agents
- **Command Throughput**: Commands per second
- **Response Times**: Command execution latency
- **Error Rates**: Failed commands and connections
- **Resource Usage**: CPU, memory, and database connections

### Health Checks

```bash
# Check system health
curl http://localhost:8080/api/v1/health

# Check database connectivity
curl http://localhost:8080/api/v1/health/database

# Check Redis connectivity
curl http://localhost:8080/api/v1/health/redis
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Connection Refused
```bash
# Check if service is running
sudo systemctl status viworks-backend-agent

# Check logs
sudo journalctl -u viworks-backend-agent -f

# Check port binding
sudo netstat -tlnp | grep 8080
```

#### 2. Database Connection Failed
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U viworks -d viworks

# Check configuration
sudo -u postgres psql -c "SHOW listen_addresses;"
```

#### 3. Redis Connection Failed
```bash
# Check Redis status
sudo systemctl status redis-server

# Test connection
redis-cli ping

# Check configuration
sudo cat /etc/redis/redis.conf | grep bind
```

### Debug Mode

Enable debug logging:

```bash
# Set environment variable
export RUST_LOG=debug

# Restart service
sudo systemctl restart viworks-backend-agent

# Check logs
sudo journalctl -u viworks-backend-agent -f
```

## 🚀 Performance Tuning

### Database Optimization

```sql
-- Create additional indexes
CREATE INDEX CONCURRENTLY idx_commands_created_at_status ON commands(created_at, status);
CREATE INDEX CONCURRENTLY idx_telemetry_agent_timestamp ON telemetry(agent_id, timestamp);

-- Analyze tables
ANALYZE agents;
ANALYZE commands;
ANALYZE telemetry;
```

### Redis Optimization

```bash
# Configure Redis for performance
echo "maxmemory 256mb" >> /etc/redis/redis.conf
echo "maxmemory-policy allkeys-lru" >> /etc/redis/redis.conf

# Restart Redis
sudo systemctl restart redis-server
```

### System Tuning

```bash
# Increase file descriptor limits
echo "viworks soft nofile 65536" >> /etc/security/limits.conf
echo "viworks hard nofile 65536" >> /etc/security/limits.conf

# Tune TCP parameters
echo "net.core.somaxconn = 65535" >> /etc/sysctl.conf
echo "net.ipv4.tcp_max_syn_backlog = 65535" >> /etc/sysctl.conf
sudo sysctl -p
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/backend-agent.git
   cd backend-agent
   ```

2. **Install Dependencies**
   ```bash
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # Install PostgreSQL and Redis
   sudo apt install postgresql redis-server
   ```

3. **Setup Development Environment**
   ```bash
   # Create development database
   createdb viworks_dev
   
   # Copy environment
   cp env.example .env
   
   # Update .env with development values
   ```

4. **Run Tests**
   ```bash
   # Run all tests
   cargo test
   
   # Run with coverage
   cargo tarpaulin
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- **Documentation**: [docs.viworks.com](https://docs.viworks.com)
- **Issues**: [GitHub Issues](https://github.com/viworks/backend-agent/issues)
- **Discussions**: [GitHub Discussions](https://github.com/viworks/backend-agent/discussions)
- **Email**: support@viworks.com

### Community

- **Discord**: [ViWorkS Community](https://discord.gg/viworks)
- **Twitter**: [@ViWorkS](https://twitter.com/ViWorkS)
- **Blog**: [blog.viworks.com](https://blog.viworks.com)

## 🗺️ Roadmap

### v1.1.0 (Q1 2025)
- [ ] Advanced monitoring dashboards
- [ ] Automated agent discovery
- [ ] Command templates and scheduling
- [ ] Enhanced security features

### v1.2.0 (Q2 2025)
- [ ] Multi-region support
- [ ] Advanced analytics
- [ ] Plugin system
- [ ] Kubernetes operator

### v2.0.0 (Q3 2025)
- [ ] GraphQL API
- [ ] Real-time collaboration
- [ ] Advanced workflow engine
- [ ] Machine learning integration

---

**Built with ❤️ by the ViWorkS Team**

For more information, visit [viworks.com](https://viworks.com)
