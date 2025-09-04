#!/bin/bash
# Backend Agent Restore Script
# This script restores the Backend Agent from backup

set -e

# Configuration
BACKUP_DATE="20250904_205315"  # Update this with the actual backup date
BACKUP_DIR="/opt/viworks/backups/backend-agent/$BACKUP_DATE"
RESTORE_NAME="viworks-backend-agent-restored"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if backup exists
if [ ! -d "$BACKUP_DIR" ]; then
    log_error "Backup directory not found: $BACKUP_DIR"
    log_info "Available backups:"
    ls -la /opt/viworks/backups/backend-agent/ 2>/dev/null || echo "No backups found"
    exit 1
fi

log_info "Starting Backend Agent restore from backup..."
log_info "Backup directory: $BACKUP_DIR"

# Stop current container if running
log_info "Stopping current container..."
if docker stop viworks-backend-agent-new 2>/dev/null; then
    log_success "Current container stopped"
else
    log_warning "No current container to stop"
fi

# Remove existing restored container if it exists
if docker ps -a | grep -q "$RESTORE_NAME"; then
    log_info "Removing existing restored container..."
    docker rm -f "$RESTORE_NAME"
fi

# Import the container
log_info "Importing container from backup..."
if docker import "$BACKUP_DIR/viworks-backend-agent-container.tar" "$RESTORE_NAME:latest"; then
    log_success "Container imported successfully"
else
    log_error "Failed to import container"
    exit 1
fi

# Create new container
log_info "Creating new container..."
if docker run -d --name "$RESTORE_NAME" \
  --network viworks-internal \
  -p 8080-8081:8080-8081 \
  "$RESTORE_NAME:latest" \
  tail -f /dev/null; then
    log_success "Container created successfully"
else
    log_error "Failed to create container"
    exit 1
fi

# Copy binary
log_info "Copying binary to container..."
if docker cp "$BACKUP_DIR/viworks-backend-agent" "$RESTORE_NAME:/app/"; then
    log_success "Binary copied successfully"
else
    log_error "Failed to copy binary"
    exit 1
fi

# Start service
log_info "Starting Backend Agent service..."
if docker exec "$RESTORE_NAME" bash -c "cd /app && chmod +x viworks-backend-agent && nohup ./viworks-backend-agent > /dev/null 2>&1 &"; then
    log_success "Service started successfully"
else
    log_error "Failed to start service"
    exit 1
fi

# Wait for startup
log_info "Waiting for service to start..."
sleep 15

# Verify health
log_info "Verifying health..."
for i in {1..30}; do
    if curl -k -s -f https://agent.neuratalent.com/health > /dev/null 2>&1; then
        log_success "✅ Restore successful! Service is healthy."
        log_info "Container name: $RESTORE_NAME"
        log_info "Health check: https://agent.neuratalent.com/health"
        log_info "Container status:"
        docker ps | grep "$RESTORE_NAME"
        exit 0
    fi
    log_info "Waiting for service... ($i/30)"
    sleep 10
done

log_error "❌ Restore failed. Service is not healthy after 5 minutes."
log_info "Container logs:"
docker logs "$RESTORE_NAME" --tail 20
exit 1
