#!/bin/bash

# ViWorkS Gateway Agent - Alpine OS Docker Setup Script
# This script creates an Alpine OS container and installs the agent for testing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
CONTAINER_NAME="viworks-agent-test"
IMAGE_NAME="alpine:latest"
AGENT_PORT="8443"
DOCKER_SOCKET="/var/run/docker.sock"

print_status "Setting up ViWorkS Gateway Agent on Alpine OS..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Stop and remove existing container if it exists
if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    print_status "Removing existing container: $CONTAINER_NAME"
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
fi

# Create Dockerfile for Alpine with all dependencies
print_status "Creating Dockerfile for Alpine OS..."
cat > Dockerfile.alpine << 'EOF'
FROM alpine:latest

# Install system dependencies
RUN apk update && apk add --no-cache \
    bash \
    curl \
    wget \
    git \
    build-base \
    pkgconfig \
    openssl-dev \
    musl-dev \
    ca-certificates \
    python3 \
    py3-pip \
    docker-cli \
    && rm -rf /var/cache/apk/*

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Create viworks user
RUN addgroup -g 1000 viworks && \
    adduser -D -s /bin/bash -u 1000 -G viworks viworks

# Create necessary directories
RUN mkdir -p /opt/Viworks/scripts_viworks \
    /etc/viworks \
    /var/log/viworks \
    /usr/local/bin

# Set permissions
RUN chown -R viworks:viworks /opt/Viworks /etc/viworks /var/log/viworks

# Switch to viworks user
USER viworks

# Set working directory
WORKDIR /home/viworks

# Copy agent source code
COPY --chown=viworks:viworks . /home/viworks/agent/

# Build the agent
WORKDIR /home/viworks/agent
RUN cargo build --release

# Install the agent
USER root
RUN cp target/release/viworks-gateway-agent /usr/local/bin/ && \
    chmod +x /usr/local/bin/viworks-gateway-agent && \
    chown viworks:viworks /usr/local/bin/viworks-gateway-agent

# Create mock scripts for testing
RUN cat > /opt/Viworks/scripts_viworks/add_user.sh << 'SCRIPT_EOF'
#!/bin/bash
echo "✅ Mock: User '$1' added to panel with password '$2'"
echo "✅ User '$1' added successfully to VALID_USERS in app.py"
exit 0
SCRIPT_EOF

RUN cat > /opt/Viworks/scripts_viworks/add_vpn_user.sh << 'SCRIPT_EOF'
#!/bin/bash
echo "✅ Mock: VPN user '$1' created with password '$2'"
echo "✅ Mock: Source IP: $3, Key: $4, HMAC: $5, Timeout: $6"
echo ">>> Creating VPN user: $1"
echo ">>> User $1 created and fwknop rule added with comment."
exit 0
SCRIPT_EOF

RUN cat > /opt/Viworks/scripts_viworks/delete_user.sh << 'SCRIPT_EOF'
#!/bin/bash
echo "✅ Mock: User '$1' deleted from panel"
exit 0
SCRIPT_EOF

RUN cat > /opt/Viworks/scripts_viworks/delete_vpn_user.sh << 'SCRIPT_EOF'
#!/bin/bash
echo "✅ Mock: VPN user '$1' deleted"
exit 0
SCRIPT_EOF

RUN chmod +x /opt/Viworks/scripts_viworks/*.sh

# Switch back to viworks user
USER viworks

# Expose port
EXPOSE 8443

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8443/api/v1/health || exit 1

# Start the agent
CMD ["/usr/local/bin/viworks-gateway-agent"]
EOF

# Build the Alpine image with agent
print_status "Building Alpine image with agent..."
docker build -f Dockerfile.alpine -t viworks-agent-alpine .

# Create and start the container
print_status "Creating and starting container: $CONTAINER_NAME"
docker run -d \
    --name $CONTAINER_NAME \
    --hostname viworks-gateway \
    -p $AGENT_PORT:8443 \
    -v $DOCKER_SOCKET:/var/run/docker.sock \
    --restart unless-stopped \
    viworks-agent-alpine

# Wait for container to start
print_status "Waiting for container to start..."
sleep 10

# Check if container is running
if docker ps --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    print_success "Container started successfully!"
else
    print_error "Failed to start container"
    docker logs $CONTAINER_NAME
    exit 1
fi

# Wait for agent to be ready
print_status "Waiting for agent to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:$AGENT_PORT/api/v1/health >/dev/null 2>&1; then
        print_success "Agent is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Agent failed to start within 30 seconds"
        docker logs $CONTAINER_NAME
        exit 1
    fi
    sleep 1
done

# Test the agent
print_status "Testing agent endpoints..."

# Health check
print_status "Testing health check..."
health_response=$(curl -s http://localhost:$AGENT_PORT/api/v1/health)
echo "Health check response: $health_response"

# System status
print_status "Testing system status..."
status_response=$(curl -s http://localhost:$AGENT_PORT/api/v1/status)
echo "System status response: $status_response"

# Test panel user creation
print_status "Testing panel user creation..."
panel_data=$(cat <<EOF
{
    "correlation_id": "$(uuidgen)",
    "command": "create_panel_user",
    "parameters": {
        "username": "testuser1",
        "password": "Test@123"
    },
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "signature": "test-signature"
}
EOF
)
panel_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "X-Client-Cert: mock-client-certificate" \
    -d "$panel_data" \
    http://localhost:$AGENT_PORT/api/v1/command)
echo "Panel user creation response: $panel_response"

# Test VPN user creation
print_status "Testing VPN user creation..."
vpn_data=$(cat <<EOF
{
    "correlation_id": "$(uuidgen)",
    "command": "create_openvpn_user",
    "parameters": {
        "username": "testuser1",
        "userpass": "Pass@123",
        "source_ip": "10.20.30.11",
        "key": "Keys2338388373737",
        "hmac_key": "Hmac38737383838",
        "timeout": 3600
    },
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "signature": "test-signature"
}
EOF
)
vpn_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "X-Client-Cert: mock-client-certificate" \
    -d "$vpn_data" \
    http://localhost:$AGENT_PORT/api/v1/command)
echo "VPN user creation response: $vpn_response"

# Test monitoring data
print_status "Testing monitoring data..."
monitoring_data=$(cat <<EOF
{
    "correlation_id": "$(uuidgen)",
    "command": "get_monitoring_data",
    "parameters": {},
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "signature": "test-signature"
}
EOF
)
monitoring_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "X-Client-Cert: mock-client-certificate" \
    -d "$monitoring_data" \
    http://localhost:$AGENT_PORT/api/v1/command)
echo "Monitoring data response: $monitoring_response"

print_success "Alpine OS container setup completed!"
print_status "Container name: $CONTAINER_NAME"
print_status "Agent URL: http://localhost:$AGENT_PORT"
print_status "Container logs: docker logs $CONTAINER_NAME"
print_status "Stop container: docker stop $CONTAINER_NAME"
print_status "Remove container: docker rm $CONTAINER_NAME"

# Create convenience scripts
cat > start-agent.sh << EOF
#!/bin/bash
docker start $CONTAINER_NAME
echo "Agent started at http://localhost:$AGENT_PORT"
EOF

cat > stop-agent.sh << EOF
#!/bin/bash
docker stop $CONTAINER_NAME
echo "Agent stopped"
EOF

cat > logs-agent.sh << EOF
#!/bin/bash
docker logs -f $CONTAINER_NAME
EOF

cat > shell-agent.sh << EOF
#!/bin/bash
docker exec -it $CONTAINER_NAME /bin/bash
EOF

chmod +x start-agent.sh stop-agent.sh logs-agent.sh shell-agent.sh

print_success "Convenience scripts created:"
print_status "  ./start-agent.sh  - Start the agent"
print_status "  ./stop-agent.sh   - Stop the agent"
print_status "  ./logs-agent.sh   - View agent logs"
print_status "  ./shell-agent.sh  - Access container shell"
