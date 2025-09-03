#!/bin/bash

# 🚀 ViWorks OS Agent - Native Debian Build Script
# This script builds and runs the agent directly on Debian OS (no Docker)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
AGENT_NAME="viworks-gateway-agent"
AGENT_PORT=8443
INSTALL_DIR="/opt/viworks/agent"
CONFIG_DIR="/etc/viworks"
LOG_DIR="/var/log/viworks"
SERVICE_NAME="viworks-gateway-agent"

print_status "Starting ViWorks OS Agent native build on Debian..."

# Check if we're on Debian
if ! grep -q "Debian" /etc/os-release; then
    print_warning "This script is designed for Debian. Current OS: $(cat /etc/os-release | grep PRETTY_NAME)"
fi

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install required packages
print_status "Installing required packages..."
apt install -y \
    curl \
    wget \
    git \
    build-essential \
    pkg-config \
    libssl-dev \
    ca-certificates \
    supervisor \
    nginx \
    ufw

# Install Rust
print_status "Installing Rust toolchain..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source ~/.cargo/env

# Verify Rust installation
RUST_VERSION=$(cargo --version)
print_success "Rust installed: $RUST_VERSION"

# Create working directory
WORK_DIR="/opt/viworks/agent-build"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

# Check if source is available
if [ -d "/tmp/os-agent-source" ]; then
    print_status "Using existing source from /tmp/os-agent-source"
    cp -r /tmp/os-agent-source/* .
else
    print_status "Please copy the OS agent source to /tmp/os-agent-source"
    print_status "Then run this script again"
    exit 1
fi

# Fix the agent.toml configuration for native deployment
print_status "Creating native configuration..."

cat > agent.toml << 'EOF'
[agent]
id = "${AGENT_ID:-gateway-001}"
host = "0.0.0.0"
port = 8443
log_level = "${LOG_LEVEL:-info}"
max_connections = 100
bind_address = "0.0.0.0:8443"

[security]
cert_file = "/etc/viworks/agent.crt"
key_file = "/etc/viworks/agent.key"
ca_file = "/etc/viworks/ca.crt"
allowed_clients = ["backend.example.com", "api-viworks.neuratalent.com"]
tls_enabled = false

[scripts]
openvpn_create = "/opt/Viworks/scripts_viworks/add_vpn_user.sh"
openvpn_delete = "/opt/Viworks/scripts_viworks/delete_vpn_user.sh"
panel_create = "/opt/Viworks/scripts_viworks/add_user.sh"
panel_delete = "/opt/Viworks/scripts_viworks/delete_user.sh"

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

[network]
bind_address = "0.0.0.0:8443"
cors_origins = ["*"]
rate_limit_requests = 100
rate_limit_window = 60

[logging]
log_file = "/var/log/viworks/agent.log"
log_format = "json"
log_level = "info"
EOF

# Test the Rust application
print_status "Testing Rust application..."
cargo check
print_success "Rust application compiles successfully"

# Run tests
print_status "Running tests..."
cargo test
print_success "All tests passed"

# Build release binary
print_status "Building release binary..."
cargo build --release
print_success "Release binary built successfully"

# Check binary
BINARY_SIZE=$(ls -lh target/release/viworks-gateway-agent | awk '{print $5}')
print_status "Binary size: $BINARY_SIZE"

# Create installation directories
print_status "Setting up installation directories..."
mkdir -p "$INSTALL_DIR" "$CONFIG_DIR" "$LOG_DIR"

# Copy binary and configuration
cp target/release/viworks-gateway-agent "$INSTALL_DIR/"
cp agent.toml "$CONFIG_DIR/"
chmod +x "$INSTALL_DIR/viworks-gateway-agent"
chmod 644 "$CONFIG_DIR/agent.toml"

# Create systemd service file
print_status "Creating systemd service..."
cat > /etc/systemd/system/$SERVICE_NAME.service << EOF
[Unit]
Description=ViWorks Gateway Agent
After=network.target
Wants=network.target

[Service]
Type=simple
User=viworks
Group=viworks
WorkingDirectory=$INSTALL_DIR
ExecStart=$INSTALL_DIR/viworks-gateway-agent
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=$SERVICE_NAME

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$LOG_DIR

# Resource limits
LimitNOFILE=65536
MemoryMax=512M
CPUQuota=50%

# Environment variables
Environment=RUST_LOG=info
Environment=AGENT_ID=gateway-001
Environment=LOG_LEVEL=info

[Install]
WantedBy=multi-user.target
EOF

# Create viworks user if it doesn't exist
if ! id "viworks" &>/dev/null; then
    print_status "Creating viworks user..."
    useradd -r -s /bin/false -d "$INSTALL_DIR" viworks
fi

# Set proper ownership
chown -R viworks:viworks "$INSTALL_DIR" "$CONFIG_DIR" "$LOG_DIR"

# Create log rotation
print_status "Setting up log rotation..."
cat > /etc/logrotate.d/$SERVICE_NAME << EOF
$LOG_DIR/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 viworks viworks
    postrotate
        systemctl reload $SERVICE_NAME
    endscript
}
EOF

# Configure firewall
print_status "Configuring firewall..."
ufw allow 8443/tcp
ufw allow 22/tcp
ufw --force enable

# Create nginx configuration for reverse proxy (optional)
print_status "Creating nginx configuration..."
cat > /etc/nginx/sites-available/$SERVICE_NAME << EOF
server {
    listen 80;
    server_name 178.128.42.148;

    location / {
        proxy_pass http://127.0.0.1:$AGENT_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
}
EOF

# Enable nginx site
ln -sf /etc/nginx/sites-available/$SERVICE_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t && systemctl reload nginx

# Reload systemd and enable service
print_status "Enabling systemd service..."
systemctl daemon-reload
systemctl enable $SERVICE_NAME

# Start the service
print_status "Starting agent service..."
systemctl start $SERVICE_NAME

# Wait for service to start
print_status "Waiting for service to start..."
sleep 10

# Check service status
print_status "Service status:"
systemctl status $SERVICE_NAME --no-pager -l

# Test endpoints
print_status "Testing agent endpoints..."
for endpoint in "http://localhost:$AGENT_PORT/api/v1/health" "http://localhost:$AGENT_PORT/api/v1/status"; do
    print_status "Testing $endpoint..."
    for i in {1..10}; do
        if curl -f -s "$endpoint" > /dev/null; then
            print_success "$endpoint is responding"
            break
        else
            print_status "$endpoint not ready yet... ($i/10)"
            sleep 5
        fi
    done
done

# Test external access
print_status "Testing external access..."
if curl -f -s "http://178.128.42.148:$AGENT_PORT/api/v1/health" > /dev/null; then
    print_success "External access working"
else
    print_warning "External access not working yet (check firewall)"
fi

# Show logs
print_status "Recent service logs:"
journalctl -u $SERVICE_NAME --no-pager -n 20

print_success "Agent deployment completed successfully!"
print_status "Agent is now running as a systemd service"
print_status "Binary: $INSTALL_DIR/viworks-gateway-agent"
print_status "Config: $CONFIG_DIR/agent.toml"
print_status "Logs: $LOG_DIR/"

print_status ""
print_status "Service Management:"
print_status "  Start: systemctl start $SERVICE_NAME"
print_status "  Stop: systemctl stop $SERVICE_NAME"
print_status "  Restart: systemctl restart $SERVICE_NAME"
print_status "  Status: systemctl status $SERVICE_NAME"
print_status "  Logs: journalctl -u $SERVICE_NAME -f"

print_status ""
print_status "Test Commands:"
print_status "  Local: curl http://localhost:$AGENT_PORT/api/v1/health"
print_status "  External: curl http://178.128.42.148:$AGENT_PORT/api/v1/health"
print_status "  Nginx: curl http://178.128.42.148/api/v1/health"
