#!/bin/bash

# ViWorks Backend Agent - Digital Ocean Deployment Script
# This script deploys the backend agent to the remote Digital Ocean server

set -e

echo "🚀 Starting ViWorks Backend Agent Deployment to Digital Ocean..."

# Configuration
REMOTE_HOST="64.227.46.188"
REMOTE_USER="root"
REMOTE_DIR="/root/viworks-backend-agent"
CONTAINER_NAME="viworks-backend-agent"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "Cargo.toml" ]; then
    print_error "Please run this script from the backend agent directory"
    exit 1
fi

# Check if target/release/viworks-backend-agent exists
if [ ! -f "target/release/viworks-backend-agent" ]; then
    print_error "Backend agent binary not found. Please run 'cargo build --release' first."
    exit 1
fi

# Check if config/backend-agent.toml exists
if [ ! -f "config/backend-agent.toml" ]; then
    print_error "Configuration file not found: config/backend-agent.toml"
    exit 1
fi

print_step "1. Testing SSH connection to Digital Ocean server..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes ${REMOTE_USER}@${REMOTE_HOST} "echo 'SSH connection successful'" 2>/dev/null; then
    print_error "Cannot connect to ${REMOTE_HOST}. Please check your SSH connection and try again."
    exit 1
fi
print_status "SSH connection successful"

print_step "2. Creating remote directory structure..."
ssh ${REMOTE_USER}@${REMOTE_HOST} "mkdir -p ${REMOTE_DIR}/{config,logs}"

print_step "3. Stopping and removing existing container if it exists..."
ssh ${REMOTE_USER}@${REMOTE_HOST} "
    if docker ps -a | grep -q '${CONTAINER_NAME}'; then
        echo 'Stopping existing container...'
        docker stop ${CONTAINER_NAME} || true
        docker rm ${CONTAINER_NAME} || true
    fi
"

print_step "4. Copying files to remote server..."
print_status "Copying binary..."
scp target/release/viworks-backend-agent ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/

print_status "Copying configuration..."
scp config/backend-agent.toml ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/config/

print_status "Copying Dockerfile..."
scp Dockerfile ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/

print_step "5. Building and starting container on remote server..."
ssh ${REMOTE_USER}@${REMOTE_HOST} "
    cd ${REMOTE_DIR}
    
    echo 'Building Docker image...'
    docker build -t viworks-backend-agent:latest .
    
    echo 'Creating and starting container...'
    docker run -d \
        --name ${CONTAINER_NAME} \
        --restart unless-stopped \
        --network viworks-public \
        --network viworks-internal \
        -p 8080:8080 \
        -p 8081:8081 \
        -v ${REMOTE_DIR}/config:/app/config:ro \
        -v ${REMOTE_DIR}/logs:/app/logs \
        -e RUST_LOG=info \
        -e RUST_BACKTRACE=1 \
        viworks-backend-agent:latest
"

print_step "6. Waiting for container to start..."
sleep 15

print_step "7. Checking container status..."
ssh ${REMOTE_USER}@${REMOTE_HOST} "
    echo 'Container status:'
    docker ps | grep ${CONTAINER_NAME} || echo 'Container not found'
    
    echo 'Container logs:'
    docker logs ${CONTAINER_NAME} --tail 20
"

print_step "8. Testing health endpoint..."
if ssh ${REMOTE_USER}@${REMOTE_HOST} "curl -f http://localhost:8080/health > /dev/null 2>&1"; then
    print_status "✅ Backend agent is running successfully!"
    print_status "Health endpoint: http://${REMOTE_HOST}:8080/health"
    print_status "API endpoint: http://${REMOTE_HOST}:8080"
    print_status "Agent management: http://${REMOTE_HOST}:8081"
else
    print_warning "Health check failed. Checking logs..."
    ssh ${REMOTE_USER}@${REMOTE_HOST} "docker logs ${CONTAINER_NAME} --tail 30"
    print_error "Deployment may have issues. Please check the logs above."
    exit 1
fi

print_step "9. Final verification..."
ssh ${REMOTE_USER}@${REMOTE_HOST} "
    echo 'Container health:'
    docker ps --filter name=${CONTAINER_NAME} --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
    
    echo 'Network connectivity:'
    docker inspect ${CONTAINER_NAME} | grep -A 10 'Networks'
    
    echo 'Port bindings:'
    docker port ${CONTAINER_NAME}
"

print_status "🎉 Deployment completed successfully!"
print_status "Remote container: ${CONTAINER_NAME}"
print_status "Remote directory: ${REMOTE_DIR}"
print_status "Container logs: ssh ${REMOTE_USER}@${REMOTE_HOST} 'docker logs -f ${CONTAINER_NAME}'"
print_status "Application logs: ssh ${REMOTE_USER}@${REMOTE_HOST} 'tail -f ${REMOTE_DIR}/logs/app.log'"

echo ""
print_status "You can now access the backend agent at:"
echo "  - Health: http://${REMOTE_HOST}:8080/health"
echo "  - API: http://${REMOTE_HOST}:8080"
echo "  - Agent Management: http://${REMOTE_HOST}:8081"
echo ""
print_status "To monitor the deployment:"
echo "  ssh ${REMOTE_USER}@${REMOTE_HOST}"
echo "  cd ${REMOTE_DIR}"
echo "  docker logs -f ${CONTAINER_NAME}"
