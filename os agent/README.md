# ViWorkS Gateway OS Agent

A minimal, secure Rust agent that runs on the Gateway OS to handle backend commands for the ViWorkS system.

## Overview

The Gateway OS Agent provides a secure control channel between the ViWorkS backend and the gateway infrastructure. It executes allowlisted commands to manage users, sessions, containers, and system monitoring.

## Features

### 🔒 Security First
- **No shell access** - Only allowlisted operations
- **Mutual TLS** - Encrypted communication with backend
- **Process isolation** - Runs in isolated environment
- **Comprehensive audit** - Every operation logged

### 📊 System Management
- **User Management** - Create/delete OpenVPN and panel users
- **Session Management** - Terminate sessions, monitor status
- **Container Management** - Spawn/stop user containers
- **System Monitoring** - Health checks, resource usage

### 🚀 Performance
- **< 5MB binary** - Small footprint
- **< 50MB RAM** - Low resource usage
- **< 2s startup** - Fast initialization
- **JSON-RPC protocol** - Simple, efficient communication

## Architecture

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   ViWorkS       │ ◄──────────────► │   Gateway OS    │
│   Backend       │                  │     Agent       │
└─────────────────┘                  └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   Gateway OS    │
                                    │  Infrastructure │
                                    │                 │
                                    │ • OpenVPN       │
                                    │ • SPA/Port-Knock│
                                    │ • TLS Proxy     │
                                    │ • Docker        │
                                    │ • nginx         │
                                    └─────────────────┘
```

## Installation

### Prerequisites

- **OS**: Linux (Ubuntu 20.04+ or CentOS 8+)
- **CPU**: 2+ cores
- **RAM**: 4GB+ available
- **Disk**: 20GB+ available
- **Network**: Stable internet connection
- **Dependencies**: Docker, OpenVPN, nginx

### Quick Start

1. **Clone and build**:
```bash
git clone <repository>
cd os\ agent
cargo build --release
```

2. **Install binary**:
```bash
sudo cp target/release/viworks-gateway-agent /usr/local/bin/
sudo chmod +x /usr/local/bin/viworks-gateway-agent
```

3. **Create configuration**:
```bash
sudo mkdir -p /etc/viworks
sudo cp agent.toml /etc/viworks/
```

4. **Set up certificates**:
```bash
# Generate certificates (example)
sudo openssl req -x509 -newkey rsa:4096 -keyout /etc/viworks/agent.key -out /etc/viworks/agent.crt -days 365 -nodes
```

5. **Create systemd service**:
```bash
sudo tee /etc/systemd/system/viworks-agent.service > /dev/null <<EOF
[Unit]
Description=ViWorkS Gateway Agent
After=network.target docker.service

[Service]
Type=simple
User=viworks
Group=viworks
ExecStart=/usr/local/bin/viworks-gateway-agent
Restart=always
RestartSec=10
Environment=RUST_LOG=info

[Install]
WantedBy=multi-user.target
EOF
```

6. **Start service**:
```bash
sudo systemctl daemon-reload
sudo systemctl enable viworks-agent
sudo systemctl start viworks-agent
```

## Configuration

The agent is configured via `agent.toml`:

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

## API Reference

### Command Endpoint

**POST** `/api/v1/command`

Execute a command on the gateway.

**Request**:
```json
{
  "correlation_id": "uuid-v4",
  "command": "create_openvpn_user",
  "parameters": {
    "username": "user1",
    "password": "password123",
    "email": "user1@example.com"
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "signature": "optional-hmac-signature"
}
```

**Response**:
```json
{
  "correlation_id": "uuid-v4",
  "success": true,
  "data": {
    "user_created": true,
    "config_file": "/etc/openvpn/users/user1.ovpn",
    "certificate_path": "/etc/openvpn/certs/user1.crt"
  },
  "error": null,
  "timestamp": "2024-01-01T00:00:00Z",
  "execution_time_ms": 123
}
```

### Status Endpoint

**GET** `/api/v1/status`

Get system status and health information.

**Response**:
```json
{
  "agent_id": "gateway-001",
  "timestamp": "2024-01-01T00:00:00Z",
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

### Health Check Endpoint

**GET** `/api/v1/health`

Simple health check endpoint.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "0.1.0"
}
```

## Available Commands

### User Management

- `create_openvpn_user` - Create OpenVPN user
- `create_panel_user` - Create panel user
- `delete_user` - Delete user from both systems
- `list_users` - List all users

### Session Management

- `terminate_session` - Terminate user session
- `get_session_status` - Get session status

### Container Management

- `spawn_container` - Spawn user container
- `stop_container` - Stop container
- `list_containers` - List all containers

### System Monitoring

- `get_system_health` - Get system health metrics
- `get_service_status` - Get service status

### Bootstrap Generation

- `generate_bootstrap` - Generate short-lived bootstrap credentials
- `revoke_bootstrap` - Revoke bootstrap credentials

## Security

### Authentication

The agent uses mutual TLS authentication:

1. **Client Certificate Validation** - Backend must present valid certificate
2. **Certificate Allowlisting** - Only pre-approved certificates accepted
3. **Rate Limiting** - Prevents abuse with request limits

### Authorization

- **Command Allowlisting** - Only predefined commands allowed
- **Parameter Validation** - Strict input validation
- **Process Isolation** - No shell access

### Audit Logging

Every operation generates an audit event:

```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "correlation_id": "uuid-v4",
  "agent_id": "gateway-001",
  "command": "create_openvpn_user",
  "parameters": {"username": "user1"},
  "result": "success",
  "execution_time_ms": 123,
  "source_ip": "192.168.1.100"
}
```

## Monitoring

### Health Checks

- **Process Status** - Agent process monitoring
- **Service Dependencies** - Docker, OpenVPN, nginx
- **Resource Usage** - CPU, memory, disk
- **Network Connectivity** - Backend communication

### Metrics

- **Command Execution Rates** - Commands per second
- **Response Times** - Average execution time
- **Error Rates** - Success/failure ratios
- **Resource Utilization** - System resource usage

### Logging

Logs are written to:
- **stdout/stderr** - Application logs
- **/var/log/viworks/** - Audit logs
- **systemd journal** - Service logs

## Development

### Building

```bash
# Debug build
cargo build

# Release build
cargo build --release

# Run tests
cargo test

# Check formatting
cargo fmt

# Lint code
cargo clippy
```

### Testing

```bash
# Unit tests
cargo test

# Integration tests
cargo test --test integration

# Security tests
cargo test --test security
```

### Docker Development

```bash
# Build Docker image
docker build -t viworks-agent .

# Run container
docker run -d \
  --name viworks-agent \
  -p 8443:8443 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /etc/viworks:/etc/viworks \
  viworks-agent
```

## Troubleshooting

### Common Issues

1. **Certificate Errors**
   - Verify certificate paths in configuration
   - Check certificate permissions
   - Ensure CA certificate is trusted

2. **Docker Connection Issues**
   - Verify Docker socket exists
   - Check Docker service status
   - Ensure agent has Docker permissions

3. **Script Execution Failures**
   - Verify script paths in configuration
   - Check script permissions
   - Review script output in logs

### Logs

```bash
# View service logs
sudo journalctl -u viworks-agent -f

# View application logs
sudo tail -f /var/log/viworks/agent.log

# Check service status
sudo systemctl status viworks-agent
```

### Debug Mode

Enable debug logging:

```bash
# Set environment variable
export RUST_LOG=debug

# Or modify systemd service
sudo systemctl edit viworks-agent
```

Add:
```ini
[Service]
Environment=RUST_LOG=debug
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the ViWorkS team
- Check the documentation
