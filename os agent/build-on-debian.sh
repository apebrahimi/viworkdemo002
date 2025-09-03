#!/bin/bash

# 🚀 ViWorks OS Agent - Debian Build Script
# This script builds and deploys the agent on a Debian droplet

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
CONFIG_DIR="/opt/viworks/agent-config"
LOG_DIR="/var/log/viworks"

print_status "Starting ViWorks OS Agent build on Debian..."

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
    docker.io \
    docker-compose

# Start and enable Docker
print_status "Starting Docker service..."
systemctl start docker
systemctl enable docker

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

# Clone or copy the agent source
if [ -d "/tmp/os-agent-source" ]; then
    print_status "Using existing source from /tmp/os-agent-source"
    cp -r /tmp/os-agent-source/* .
else
    print_status "Please copy the OS agent source to /tmp/os-agent-source"
    print_status "Then run this script again"
    exit 1
fi

# Fix the Dockerfile issues
print_status "Fixing Dockerfile issues..."

# Create improved Dockerfile
cat > Dockerfile.debian-production << 'EOF'
# Multi-stage build for Debian production
FROM rust:1.89.0-slim-bullseye as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Cargo files
COPY Cargo.toml Cargo.lock ./

# Create dummy main.rs to build dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs

# Build dependencies
RUN cargo build --release

# Remove dummy main.rs and copy actual source
RUN rm src/main.rs
COPY src/ ./src/

# Build the application
RUN cargo build --release

# Strip debug symbols
RUN strip target/release/viworks-gateway-agent

# Production stage
FROM debian:bullseye-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create viworks user
RUN groupadd -g 1000 viworks && \
    useradd -m -s /bin/bash -u 1000 -g viworks viworks

# Create necessary directories
RUN mkdir -p /etc/viworks /var/log/viworks /usr/local/bin /tmp/viworks

# Copy binary from builder
COPY --from=builder /app/target/release/viworks-gateway-agent /usr/local/bin/

# Copy configuration template
COPY agent.toml /etc/viworks/

# Set permissions
RUN chown -R viworks:viworks /etc/viworks /var/log/viworks /tmp/viworks
RUN chmod +x /usr/local/bin/viworks-gateway-agent
RUN chmod 644 /etc/viworks/agent.toml
RUN chmod 755 /tmp/viworks

# Switch to viworks user
USER viworks

# Set working directory
WORKDIR /tmp/viworks

# Expose port
EXPOSE 8443

# Health check with proper timeout and retries
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f --max-time 5 http://localhost:8443/api/v1/health || exit 1

# Set resource limits and security options
ENV RUST_LOG=info
ENV RUST_BACKTRACE=0

# Run the agent with proper signal handling
CMD ["/usr/local/bin/viworks-gateway-agent"]
EOF

# Fix the agent.toml configuration
print_status "Fixing agent configuration..."

# Create improved agent.toml
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

# Build Docker image
print_status "Building Docker image..."
docker build -f Dockerfile.debian-production -t "$AGENT_NAME:latest" .

if [ $? -eq 0 ]; then
    print_success "Docker image built successfully"
else
    print_error "Docker build failed"
    exit 1
fi

# Create configuration directory
print_status "Setting up configuration..."
mkdir -p "$CONFIG_DIR"
cp agent.toml "$CONFIG_DIR/"
chmod 644 "$CONFIG_DIR/agent.toml"

# Create log directory
mkdir -p "$LOG_DIR"
chmod 755 "$LOG_DIR"

# Stop any existing container
print_status "Stopping existing container..."
docker stop "$AGENT_NAME" 2>/dev/null || true
docker rm "$AGENT_NAME" 2>/dev/null || true

# Create networks if they don't exist
print_status "Setting up networks..."
docker network create viworks-internal 2>/dev/null || print_status "Network viworks-internal already exists"
docker network create viworks-public 2>/dev/null || print_status "Network viworks-public already exists"

# Run the agent container
print_status "Starting agent container..."
docker run -d \
    --name "$AGENT_NAME" \
    --restart unless-stopped \
    --network viworks-internal \
    --network viworks-public \
    --publish "$AGENT_PORT:$AGENT_PORT" \
    --volume /var/run/docker.sock:/var/run/docker.sock:ro \
    --volume "$CONFIG_DIR:/etc/viworks:ro" \
    --volume "$LOG_DIR:/var/log/viworks" \
    --env AGENT_ID=gateway-001 \
    --env LOG_LEVEL=info \
    --env RUST_LOG=info \
    --env BACKEND_INTERNAL_URL=http://viworks-backend:8081 \
    --env BACKEND_EXTERNAL_URL=https://api-viworks.neuratalent.com \
    --user 1000:1000 \
    --cap-drop=ALL \
    --security-opt=no-new-privileges \
    --memory=512m \
    --cpus=0.5 \
    --ulimit nofile=1024:1024 \
    "$AGENT_NAME:latest"

# Wait for agent to start
print_status "Waiting for agent to start..."
sleep 10

# Check container status
print_status "Container status:"
docker ps | grep "$AGENT_NAME"

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

# Show logs
print_status "Recent agent logs:"
docker logs --tail=20 "$AGENT_NAME"

print_success "Agent deployment completed successfully!"
print_status "Agent is now running on port $AGENT_PORT"
print_status "Configuration: $CONFIG_DIR"
print_status "Logs: $LOG_DIR"

print_status ""
print_status "Test commands:"
print_status "  Health: curl http://localhost:$AGENT_PORT/api/v1/health"
print_status "  Status: curl http://localhost:$AGENT_PORT/api/v1/status"
print_status "  Logs: docker logs -f $AGENT_NAME"
print_status "  Stop: docker stop $AGENT_NAME"
print_status "  Remove: docker rm -f $AGENT_NAME"
