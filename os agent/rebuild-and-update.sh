#!/bin/bash

# ViWorkS Gateway Agent - Rebuild and Update
# This script rebuilds the agent with fixes and updates the container

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

print_header "ViWorkS Gateway Agent - Rebuild and Update"
echo "Target: $DO_HOST"
echo ""

# ============================================================================
# 1. CREATE BUILD CONTAINER
# ============================================================================
print_header "1. Creating Build Container"

print_status "Creating temporary build container..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" << 'BUILD_SETUP'
set -e

# Create a temporary build container with Rust
docker run -d --name viworks-rebuild-temp \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    rust:alpine \
    sleep infinity

echo "Build container created"
BUILD_SETUP

print_success "Build container prepared"

# ============================================================================
# 2. COPY UPDATED SOURCE CODE
# ============================================================================
print_header "2. Copying Updated Source Code"

print_status "Creating source code package with fixes..."
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

print_status "Uploading source code to build container..."
scp -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$SOURCE_DIR.tar.gz" "$DO_USER@$DO_HOST:/tmp/"

ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" "docker cp /tmp/$SOURCE_DIR.tar.gz viworks-rebuild-temp:/tmp/"

print_success "Source code uploaded to build container"

# ============================================================================
# 3. BUILD UPDATED AGENT
# ============================================================================
print_header "3. Building Updated Agent"

print_status "Building the updated agent..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" << 'BUILD_SCRIPT'
set -e

# Extract source code inside container
docker exec viworks-rebuild-temp sh -c "
set -e
cd /tmp
tar -xzf viworks-source-*.tar.gz
cd viworks-source-*

# Create src directory and move files
mkdir -p src
mv *.rs src/

# Install additional dependencies
apk add --no-cache musl-dev openssl-dev

# Build the agent
echo 'Building ViWorkS Gateway Agent...'
cargo build --release

# Check if build was successful
if [ -f 'target/release/viworks-gateway-agent' ]; then
    echo 'Build successful!'
    ls -la target/release/viworks-gateway-agent
    file target/release/viworks-gateway-agent
else
    echo 'Build failed!'
    exit 1
fi

# Copy binary out of container
cp target/release/viworks-gateway-agent /tmp/viworks-agent-updated
echo 'Binary ready at /tmp/viworks-agent-updated'
"

# Copy binary from container to host
docker cp viworks-rebuild-temp:/tmp/viworks-agent-updated /opt/viworks-agent-updated
chmod +x /opt/viworks-agent-updated

echo "Binary copied to host: /opt/viworks-agent-updated"
BUILD_SCRIPT

print_success "Build completed"

# ============================================================================
# 4. UPDATE THE CONTAINER
# ============================================================================
print_header "4. Updating Container"

print_status "Stopping the current container..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" "docker stop viworks-gateway-agent"

print_status "Updating the container with new binary..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" << 'UPDATE_CONTAINER'
set -e

# Copy new binary into the container
docker cp /opt/viworks-agent-updated viworks-gateway-agent:/usr/local/bin/viworks-gateway-agent

# Set proper permissions
docker exec viworks-gateway-agent chmod +x /usr/local/bin/viworks-gateway-agent

echo "Container updated with new binary"
UPDATE_CONTAINER

print_success "Container updated"

# ============================================================================
# 5. START THE CONTAINER
# ============================================================================
print_header "5. Starting Container"

print_status "Starting the container..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" "docker start viworks-gateway-agent"

print_status "Waiting for container to start..."
sleep 10

print_success "Container started"

# ============================================================================
# 6. TEST THE FIX
# ============================================================================
print_header "6. Testing the Fix"

print_status "Testing the status endpoint..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" << 'TEST_SCRIPT'
set -e

echo "=== Container Status ==="
docker ps | grep viworks-gateway-agent

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
    echo "Response:"
    curl -s http://localhost:8443/api/v1/status
fi

echo ""
echo "=== Recent Logs ==="
docker logs viworks-gateway-agent --tail 10
TEST_SCRIPT

# ============================================================================
# 7. CLEANUP
# ============================================================================
print_header "7. Cleanup"

print_status "Cleaning up build container..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" << 'CLEANUP'
set -e

# Stop and remove build container
docker stop viworks-rebuild-temp
docker rm viworks-rebuild-temp

# Clean up temporary files
rm -f /tmp/viworks-source-*.tar.gz

echo "Cleanup completed"
CLEANUP

print_success "Build container cleaned up"

# ============================================================================
# 8. CLEANUP LOCAL FILES
# ============================================================================
print_status "Cleaning up local files..."
rm -rf "$SOURCE_DIR" "$SOURCE_DIR.tar.gz"

# ============================================================================
# 9. FINAL SUMMARY
# ============================================================================
print_header "9. Update Summary"

print_success "🎉 ViWorkS Gateway Agent successfully updated!"
echo ""
echo "📋 Update Details:"
echo "   Host: $DO_HOST"
echo "   Container: viworks-gateway-agent"
echo "   Fix: Fixed system_status endpoint configuration"
echo "   Binary: Rebuilt with proper Actix web data types"
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
print_success "Agent is now updated and ready for testing!"
