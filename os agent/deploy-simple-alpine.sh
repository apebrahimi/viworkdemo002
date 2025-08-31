#!/bin/bash

# ViWorkS Gateway Agent - Simple Alpine Container Deployment
# This script copies the binary to DO and runs it in an Alpine container

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
SSH_KEY_PATH="$HOME/.ssh/id_ed25519"

print_header "ViWorkS Gateway Agent - Simple Alpine Container Deployment"
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
# 3. PREPARE REMOTE ENVIRONMENT
# ============================================================================
print_header "3. Preparing Remote Environment"

print_status "Setting up Docker and Alpine on $DO_HOST..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" << 'REMOTE_SETUP'
set -e

# Update system
echo "Updating system..."
apk update && apk upgrade

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    apk add --no-cache docker docker-compose
    rc-update add docker default
    rc-service docker start
fi

# Create directory for the agent
mkdir -p /opt/viworks-agent
cd /opt/viworks-agent

# Stop any existing container
docker stop viworks-gateway-agent 2>/dev/null || true
docker rm viworks-gateway-agent 2>/dev/null || true

echo "Remote environment prepared successfully!"
REMOTE_SETUP

print_success "Remote environment prepared"

# ============================================================================
# 4. COPY BINARY TO DIGITAL OCEAN
# ============================================================================
print_header "4. Copying Binary to Digital Ocean"

print_status "Copying production binary to $DO_HOST..."
scp -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no viworks-gateway-agent-production "$DO_USER@$DO_HOST:/opt/viworks-agent/"

print_success "Binary copied successfully"

# ============================================================================
# 5. CREATE AND RUN ALPINE CONTAINER
# ============================================================================
print_header "5. Creating and Running Alpine Container"

print_status "Creating Alpine container with the agent..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" << 'CONTAINER_SETUP'
set -e

cd /opt/viworks-agent

# Make binary executable
chmod +x viworks-gateway-agent-production

# Create Dockerfile for Alpine container
cat > Dockerfile << 'EOF'
FROM alpine:latest

# Install runtime dependencies
RUN apk update && apk add --no-cache \
    ca-certificates \
    libssl3 \
    && rm -rf /var/cache/apk/*

# Create viworks user
RUN addgroup -g 1000 viworks && \
    adduser -D -s /bin/bash -u 1000 -G viworks viworks

# Create directories
RUN mkdir -p /etc/viworks /var/log/viworks /usr/local/bin

# Copy binary
COPY viworks-gateway-agent-production /usr/local/bin/viworks-gateway-agent

# Set permissions
RUN chmod +x /usr/local/bin/viworks-gateway-agent
RUN chown -R viworks:viworks /etc/viworks /var/log/viworks

# Switch to viworks user
USER viworks

# Expose port
EXPOSE 8443

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8443/api/v1/health || exit 1

# Run the agent
CMD ["/usr/local/bin/viworks-gateway-agent"]
EOF

# Build Docker image
echo "Building Alpine container image..."
docker build -t viworks-gateway-agent:alpine .

# Run the container
echo "Starting Alpine container..."
docker run -d \
    --name viworks-gateway-agent \
    --restart unless-stopped \
    -p 8443:8443 \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    viworks-gateway-agent:alpine

echo "Container started successfully!"
CONTAINER_SETUP

print_success "Alpine container created and started"

# ============================================================================
# 6. TEST THE DEPLOYMENT
# ============================================================================
print_header "6. Testing the Deployment"

print_status "Waiting for container to start..."
sleep 5

print_status "Testing the agent..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" << 'TEST_SCRIPT'
set -e

echo "=== Container Status ==="
docker ps | grep viworks-gateway-agent

echo ""
echo "=== Container Logs ==="
docker logs viworks-gateway-agent --tail 10

echo ""
echo "=== Health Check ==="
if curl -f http://localhost:8443/api/v1/health >/dev/null 2>&1; then
    echo "✅ Health endpoint is working!"
    curl -s http://localhost:8443/api/v1/health | jq . 2>/dev/null || curl -s http://localhost:8443/api/v1/health
else
    echo "❌ Health endpoint failed!"
fi

echo ""
echo "=== Status Check ==="
if curl -f http://localhost:8443/api/v1/status >/dev/null 2>&1; then
    echo "✅ Status endpoint is working!"
    curl -s http://localhost:8443/api/v1/status | jq . 2>/dev/null || curl -s http://localhost:8443/api/v1/status
else
    echo "❌ Status endpoint failed!"
fi

echo ""
echo "=== Port Status ==="
netstat -tlnp | grep 8443 || echo "Port 8443 not found in netstat"
TEST_SCRIPT

# ============================================================================
# 7. FINAL SUMMARY
# ============================================================================
print_header "7. Deployment Summary"

print_success "🎉 ViWorkS Gateway Agent successfully deployed in Alpine container!"
echo ""
echo "📋 Deployment Details:"
echo "   Host: $DO_HOST"
echo "   Container: viworks-gateway-agent"
echo "   Port: 8443"
echo "   Image: viworks-gateway-agent:alpine"
echo ""
echo "🚀 Management Commands:"
echo "   Start: ssh $DO_USER@$DO_HOST 'docker start viworks-gateway-agent'"
echo "   Stop: ssh $DO_USER@$DO_HOST 'docker stop viworks-gateway-agent'"
echo "   Restart: ssh $DO_USER@$DO_HOST 'docker restart viworks-gateway-agent'"
echo "   Status: ssh $DO_USER@$DO_HOST 'docker ps | grep viworks-gateway-agent'"
echo "   Logs: ssh $DO_USER@$DO_HOST 'docker logs -f viworks-gateway-agent'"
echo ""
echo "🔍 Testing Commands:"
echo "   Health: curl http://$DO_HOST:8443/api/v1/health"
echo "   Status: curl http://$DO_HOST:8443/api/v1/status"
echo ""
echo "📊 Monitoring:"
echo "   Container stats: ssh $DO_USER@$DO_HOST 'docker stats viworks-gateway-agent'"
echo "   System resources: ssh $DO_USER@$DO_HOST 'top'"
echo ""
print_success "Agent is now running in Alpine container and ready for testing!"
