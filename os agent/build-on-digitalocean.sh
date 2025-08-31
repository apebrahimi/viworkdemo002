#!/bin/bash

# ViWorkS Gateway Agent - Build on Digital Ocean
# This script builds the agent directly on the Digital Ocean machine

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

print_header "ViWorkS Gateway Agent - Build on Digital Ocean"
echo "Target: $DO_HOST"
echo ""

# ============================================================================
# 1. TEST SSH CONNECTION
# ============================================================================
print_header "1. Testing SSH Connection"

print_status "Testing connection to $DO_HOST..."
if ssh -i "$SSH_KEY_PATH" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" "echo 'SSH connection successful'" 2>/dev/null; then
    print_success "SSH connection established"
else
    print_error "Failed to connect to $DO_HOST"
    exit 1
fi

# ============================================================================
# 2. PREPARE BUILD ENVIRONMENT ON DIGITAL OCEAN
# ============================================================================
print_header "2. Preparing Build Environment"

print_status "Setting up Rust and build tools on $DO_HOST..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" << 'BUILD_SETUP'
set -e

# Update system
echo "Updating system..."
apt update && apt upgrade -y

# Install build dependencies
echo "Installing build dependencies..."
apt install -y \
    curl \
    build-essential \
    pkg-config \
    libssl-dev \
    ca-certificates \
    git

# Install Rust
echo "Installing Rust..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source ~/.cargo/env

# Create build directory
mkdir -p /opt/viworks-build
cd /opt/viworks-build

echo "Build environment prepared successfully!"
BUILD_SETUP

print_success "Build environment prepared"

# ============================================================================
# 3. COPY SOURCE CODE TO DIGITAL OCEAN
# ============================================================================
print_header "3. Copying Source Code"

print_status "Creating source code package..."
SOURCE_DIR="viworks-source-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$SOURCE_DIR"

# Copy source files with proper structure
cp -r src/ "$SOURCE_DIR/"
cp Cargo.toml "$SOURCE_DIR/"
cp Cargo.lock "$SOURCE_DIR/"
cp agent.toml "$SOURCE_DIR/"

# Create package
tar -czf "$SOURCE_DIR.tar.gz" "$SOURCE_DIR"
PACKAGE_SIZE=$(du -h "$SOURCE_DIR.tar.gz" | cut -f1)
print_success "Source package created: $SOURCE_DIR.tar.gz ($PACKAGE_SIZE)"

print_status "Uploading source code to $DO_HOST..."
scp -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$SOURCE_DIR.tar.gz" "$DO_USER@$DO_HOST:/opt/viworks-build/"

print_success "Source code uploaded"

# ============================================================================
# 4. BUILD ON DIGITAL OCEAN
# ============================================================================
print_header "4. Building on Digital Ocean"

print_status "Building the agent on $DO_HOST..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" << 'BUILD_SCRIPT'
set -e

cd /opt/viworks-build

# Extract source code
tar -xzf viworks-source-*.tar.gz
cd viworks-source-*

# Source Rust environment
source ~/.cargo/env

# Build the agent
echo "Building ViWorkS Gateway Agent..."
cargo build --release

# Check if build was successful
if [ -f "target/release/viworks-gateway-agent" ]; then
    echo "Build successful!"
    ls -la target/release/viworks-gateway-agent
    file target/release/viworks-gateway-agent
else
    echo "Build failed!"
    exit 1
fi

# Copy binary to a convenient location
cp target/release/viworks-gateway-agent /opt/viworks-agent
chmod +x /opt/viworks-agent

echo "Binary ready at /opt/viworks-agent"
BUILD_SCRIPT

print_success "Build completed on Digital Ocean"

# ============================================================================
# 5. CREATE AND RUN ALPINE CONTAINER
# ============================================================================
print_header "5. Creating Alpine Container"

print_status "Creating Alpine container with the built agent..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" << 'CONTAINER_SETUP'
set -e

cd /opt/viworks-build

# Stop any existing container
docker stop viworks-gateway-agent 2>/dev/null || true
docker rm viworks-gateway-agent 2>/dev/null || true

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
COPY viworks-agent /usr/local/bin/viworks-gateway-agent

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

# Copy the built binary
cp /opt/viworks-agent viworks-agent

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
ss -tlnp | grep 8443 || echo "Port 8443 not found"
TEST_SCRIPT

# ============================================================================
# 7. CLEANUP
# ============================================================================
print_header "7. Cleanup"

print_status "Cleaning up local files..."
rm -rf "$SOURCE_DIR" "$SOURCE_DIR.tar.gz"

# ============================================================================
# 8. FINAL SUMMARY
# ============================================================================
print_header "8. Deployment Summary"

print_success "🎉 ViWorkS Gateway Agent successfully built and deployed on Digital Ocean!"
echo ""
echo "📋 Deployment Details:"
echo "   Host: $DO_HOST"
echo "   Container: viworks-gateway-agent"
echo "   Port: 8443"
echo "   Image: viworks-gateway-agent:alpine"
echo "   Binary: Built natively on Linux x86_64"
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
