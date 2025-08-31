#!/bin/bash

# ViWorkS Gateway Agent - Digital Ocean Alpine Deployment Script
# This script deploys the agent to the Digital Ocean Docker machine

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${PURPLE}========================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}========================================${NC}"
}

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

# Digital Ocean machine details
DO_HOST="64.227.46.188"
DO_USER="root"
SSH_KEY_PATH="$HOME/.ssh/id_rsa"

print_header "ViWorkS Gateway Agent - Digital Ocean Alpine Deployment"
echo "Target: $DO_HOST"
echo ""

# ============================================================================
# 1. VERIFY LOCAL BUILD
# ============================================================================
print_header "1. Verifying Local Build"

if [ ! -f "viworks-gateway-agent-production" ]; then
    print_error "Production binary not found. Please run the build first."
    exit 1
fi

BINARY_SIZE=$(du -h viworks-gateway-agent-production | cut -f1)
print_success "Production binary found: $BINARY_SIZE"

# ============================================================================
# 2. TEST SSH CONNECTION
# ============================================================================
print_header "2. Testing SSH Connection"

print_status "Testing connection to $DO_HOST..."
if ssh -i "$SSH_KEY_PATH" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" "echo 'SSH connection successful'" 2>/dev/null; then
    print_success "SSH connection established"
else
    print_error "Failed to connect to $DO_HOST"
    print_status "Please ensure:"
    echo "  1. SSH key is available at $SSH_KEY_PATH"
    echo "  2. Digital Ocean machine is running"
    echo "  3. SSH key is added to the machine"
    exit 1
fi

# ============================================================================
# 3. PREPARE DEPLOYMENT PACKAGE
# ============================================================================
print_header "3. Preparing Deployment Package"

print_status "Creating deployment package..."
DEPLOY_DIR="viworks-deployment-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# Copy necessary files
cp viworks-gateway-agent-production "$DEPLOY_DIR/viworks-gateway-agent"
cp agent.toml "$DEPLOY_DIR/"
cp .env.example "$DEPLOY_DIR/"
cp deploy-secure.sh "$DEPLOY_DIR/"
cp security-monitor.sh "$DEPLOY_DIR/"
cp install-alpine.sh "$DEPLOY_DIR/"

# Create deployment script for Alpine
cat > "$DEPLOY_DIR/deploy-alpine.sh" << 'EOF'
#!/bin/bash

# ViWorkS Gateway Agent - Alpine Linux Deployment Script
# This script deploys the agent on Alpine Linux

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

print_status "Deploying ViWorkS Gateway Agent on Alpine Linux..."

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
    print_error "This script must be run as root"
    exit 1
fi

# Update system
print_status "Updating Alpine system..."
apk update && apk upgrade

# Install required packages
print_status "Installing required packages..."
apk add --no-cache \
    ca-certificates \
    libssl3 \
    docker \
    docker-compose \
    bash \
    curl \
    wget \
    jq

# Start Docker service
print_status "Starting Docker service..."
rc-update add docker default
rc-service docker start

# Create viworks user
print_status "Creating viworks user..."
if ! id "viworks" &>/dev/null; then
    addgroup -g 1000 viworks
    adduser -D -s /bin/bash -u 1000 -G viworks viworks
fi

# Create directories
print_status "Creating directories..."
mkdir -p /etc/viworks /var/log/viworks /opt/Viworks/scripts_viworks

# Set permissions
chmod 750 /etc/viworks /var/log/viworks /opt/Viworks
chown -R viworks:viworks /etc/viworks /var/log/viworks /opt/Viworks

# Install binary
print_status "Installing binary..."
cp viworks-gateway-agent /usr/local/bin/
chmod 755 /usr/local/bin/viworks-gateway-agent
chown root:root /usr/local/bin/viworks-gateway-agent

# Copy configuration
print_status "Installing configuration..."
cp agent.toml /etc/viworks/
chmod 644 /etc/viworks/agent.toml
chown viworks:viworks /etc/viworks/agent.toml

# Create OpenRC service
print_status "Creating OpenRC service..."
cat > /etc/init.d/viworks-agent << 'SERVICE_EOF'
#!/sbin/openrc-run

name="ViWorkS Gateway Agent"
description="ViWorkS Gateway Agent Service"
command="/usr/local/bin/viworks-gateway-agent"
command_background=true
pidfile="/var/run/viworks-agent.pid"
user="viworks"
group="viworks"

depend() {
    need net
    after firewall
}

start_pre() {
    checkpath -d -m 755 -o viworks:viworks /var/log/viworks
}
SERVICE_EOF

chmod +x /etc/init.d/viworks-agent

# Enable service
print_status "Enabling service..."
rc-update add viworks-agent default

# Create Docker Compose file
print_status "Creating Docker Compose configuration..."
cat > docker-compose.yml << 'COMPOSE_EOF'
version: '3.8'
services:
  viworks-agent:
    image: alpine:latest
    container_name: viworks-gateway-agent
    restart: unless-stopped
    ports:
      - "8443:8443"
    volumes:
      - /usr/local/bin/viworks-gateway-agent:/usr/local/bin/viworks-gateway-agent:ro
      - /etc/viworks:/etc/viworks:ro
      - /var/log/viworks:/var/log/viworks
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      - RUST_LOG=info
    command: ["/usr/local/bin/viworks-gateway-agent"]
    user: "1000:1000"
    networks:
      - viworks-network

networks:
  viworks-network:
    driver: bridge
COMPOSE_EOF

print_success "Alpine deployment completed!"
print_status "To start the service: rc-service viworks-agent start"
print_status "To check status: rc-service viworks-agent status"
print_status "To view logs: tail -f /var/log/viworks/agent.log"
print_status "To test: curl http://localhost:8443/api/v1/health"
EOF

chmod +x "$DEPLOY_DIR/deploy-alpine.sh"

# Create test script
cat > "$DEPLOY_DIR/test-agent.sh" << 'EOF'
#!/bin/bash

# Test script for ViWorkS Gateway Agent

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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Testing ViWorkS Gateway Agent..."

# Wait for service to start
sleep 5

# Test health endpoint
print_status "Testing health endpoint..."
if curl -f http://localhost:8443/api/v1/health >/dev/null 2>&1; then
    print_success "Health endpoint is working!"
else
    print_error "Health endpoint failed!"
    exit 1
fi

# Test status endpoint
print_status "Testing status endpoint..."
if curl -f http://localhost:8443/api/v1/status >/dev/null 2>&1; then
    print_success "Status endpoint is working!"
else
    print_error "Status endpoint failed!"
    exit 1
fi

# Check service status
print_status "Checking service status..."
if rc-service viworks-agent status >/dev/null 2>&1; then
    print_success "Service is running!"
else
    print_error "Service is not running!"
    exit 1
fi

print_success "All tests passed! Agent is working correctly."
EOF

chmod +x "$DEPLOY_DIR/test-agent.sh"

# Create package
tar -czf "$DEPLOY_DIR.tar.gz" "$DEPLOY_DIR"
PACKAGE_SIZE=$(du -h "$DEPLOY_DIR.tar.gz" | cut -f1)
print_success "Deployment package created: $DEPLOY_DIR.tar.gz ($PACKAGE_SIZE)"

# ============================================================================
# 4. UPLOAD TO DIGITAL OCEAN
# ============================================================================
print_header "4. Uploading to Digital Ocean"

print_status "Uploading deployment package to $DO_HOST..."
scp -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DEPLOY_DIR.tar.gz" "$DO_USER@$DO_HOST:/tmp/"

print_success "Package uploaded successfully"

# ============================================================================
# 5. DEPLOY ON DIGITAL OCEAN
# ============================================================================
print_header "5. Deploying on Digital Ocean"

print_status "Extracting and deploying on $DO_HOST..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" << 'REMOTE_SCRIPT'
set -e

# Extract package
cd /tmp
tar -xzf viworks-deployment-*.tar.gz
cd viworks-deployment-*

# Run Alpine deployment
chmod +x deploy-alpine.sh
./deploy-alpine.sh

# Start the service
rc-service viworks-agent start

# Wait a moment for service to start
sleep 3

# Run tests
chmod +x test-agent.sh
./test-agent.sh

echo "Deployment completed successfully!"
REMOTE_SCRIPT

print_success "Deployment completed on Digital Ocean!"

# ============================================================================
# 6. VERIFY DEPLOYMENT
# ============================================================================
print_header "6. Verifying Deployment"

print_status "Verifying service status..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" << 'VERIFY_SCRIPT'
echo "=== Service Status ==="
rc-service viworks-agent status

echo ""
echo "=== Process Status ==="
ps aux | grep viworks-gateway-agent | grep -v grep

echo ""
echo "=== Port Status ==="
netstat -tlnp | grep 8443

echo ""
echo "=== Health Check ==="
curl -s http://localhost:8443/api/v1/health | jq . 2>/dev/null || curl -s http://localhost:8443/api/v1/health

echo ""
echo "=== Status Check ==="
curl -s http://localhost:8443/api/v1/status | jq . 2>/dev/null || curl -s http://localhost:8443/api/v1/status
VERIFY_SCRIPT

# ============================================================================
# 7. CLEANUP
# ============================================================================
print_header "7. Cleanup"

print_status "Cleaning up local files..."
rm -rf "$DEPLOY_DIR" "$DEPLOY_DIR.tar.gz"

print_status "Cleaning up remote files..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" "rm -f /tmp/viworks-deployment-*.tar.gz"

# ============================================================================
# 8. FINAL SUMMARY
# ============================================================================
print_header "8. Deployment Summary"

print_success "🎉 ViWorkS Gateway Agent successfully deployed to Digital Ocean!"
echo ""
echo "📋 Deployment Details:"
echo "   Host: $DO_HOST"
echo "   Service: viworks-agent"
echo "   Port: 8443"
echo "   User: viworks"
echo ""
echo "🚀 Management Commands:"
echo "   Start: ssh $DO_USER@$DO_HOST 'rc-service viworks-agent start'"
echo "   Stop: ssh $DO_USER@$DO_HOST 'rc-service viworks-agent stop'"
echo "   Status: ssh $DO_USER@$DO_HOST 'rc-service viworks-agent status'"
echo "   Logs: ssh $DO_USER@$DO_HOST 'tail -f /var/log/viworks/agent.log'"
echo ""
echo "🔍 Testing Commands:"
echo "   Health: curl http://$DO_HOST:8443/api/v1/health"
echo "   Status: curl http://$DO_HOST:8443/api/v1/status"
echo ""
echo "📊 Monitoring:"
echo "   Security: ssh $DO_USER@$DO_HOST 'cd /tmp/viworks-deployment-* && ./security-monitor.sh'"
echo "   System: ssh $DO_USER@$DO_HOST 'top'"
echo ""
print_success "Agent is now running and ready for production use!"
