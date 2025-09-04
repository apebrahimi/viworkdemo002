#!/bin/bash

# Backend Agent Deployment Script
# This script handles the deployment of the Backend Agent to the production server

set -e  # Exit on any error

# Configuration
DEPLOYMENT_DIR="/opt/viworks/deployments/backend-agent"
CONTAINER_NAME="viworks-backend-agent-new"
BINARY_NAME="viworks-backend-agent"
HEALTH_URL="https://agent.neuratalent.com/health"
BACKUP_RETENTION_DAYS=7

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

# Function to check if service is healthy
check_health() {
    local url=$1
    local max_attempts=${2:-30}
    local delay=${3:-10}
    
    log_info "Checking health at $url..."
    
    for i in $(seq 1 $max_attempts); do
        if curl -k -s -f "$url" > /dev/null 2>&1; then
            log_success "Service is healthy"
            return 0
        fi
        log_info "Waiting for service... ($i/$max_attempts)"
        sleep $delay
    done
    
    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Function to backup current binary
backup_current_binary() {
    if [ -f "$DEPLOYMENT_DIR/$BINARY_NAME" ]; then
        local backup_name="${BINARY_NAME}.backup.$(date +%Y%m%d_%H%M%S)"
        log_info "Backing up current binary to $backup_name"
        cp "$DEPLOYMENT_DIR/$BINARY_NAME" "$DEPLOYMENT_DIR/$backup_name"
        log_success "Backup created: $backup_name"
    else
        log_warning "No existing binary found to backup"
    fi
}

# Function to clean old backups
cleanup_old_backups() {
    log_info "Cleaning up old backups (older than $BACKUP_RETENTION_DAYS days)..."
    find "$DEPLOYMENT_DIR" -name "${BINARY_NAME}.backup.*" -type f -mtime +$BACKUP_RETENTION_DAYS -delete
    log_success "Old backups cleaned up"
}

# Function to stop current service
stop_service() {
    log_info "Stopping current service..."
    
    # Kill the process inside the container
    if docker exec "$CONTAINER_NAME" pkill -f "$BINARY_NAME" 2>/dev/null; then
        log_info "Service process stopped"
    else
        log_warning "No running service process found"
    fi
    
    # Wait for graceful shutdown
    sleep 5
    log_success "Service stopped"
}

# Function to start service
start_service() {
    log_info "Starting service..."
    
    # Make binary executable
    chmod +x "$DEPLOYMENT_DIR/$BINARY_NAME"
    
    # Start the service in the container
    docker exec "$CONTAINER_NAME" bash -c "cd /app && nohup ./$BINARY_NAME > /dev/null 2>&1 &"
    
    # Wait for startup
    sleep 10
    log_success "Service started"
}

# Function to rollback
rollback() {
    log_error "Deployment failed, initiating rollback..."
    
    # Find the most recent backup
    local latest_backup=$(ls -t "$DEPLOYMENT_DIR/${BINARY_NAME}.backup."* 2>/dev/null | head -1)
    
    if [ -n "$latest_backup" ]; then
        log_info "Rolling back to: $latest_backup"
        cp "$latest_backup" "$DEPLOYMENT_DIR/$BINARY_NAME"
        start_service
        
        if check_health "$HEALTH_URL" 10 5; then
            log_success "Rollback successful"
            return 0
        else
            log_error "Rollback failed"
            return 1
        fi
    else
        log_error "No backup found for rollback"
        return 1
    fi
}

# Function to verify deployment
verify_deployment() {
    log_info "Verifying deployment..."
    
    # Check if binary exists and is executable
    if [ ! -f "$DEPLOYMENT_DIR/$BINARY_NAME" ]; then
        log_error "Binary not found at $DEPLOYMENT_DIR/$BINARY_NAME"
        return 1
    fi
    
    if [ ! -x "$DEPLOYMENT_DIR/$BINARY_NAME" ]; then
        log_error "Binary is not executable"
        return 1
    fi
    
    # Check container status
    if ! docker ps | grep -q "$CONTAINER_NAME"; then
        log_error "Container $CONTAINER_NAME is not running"
        return 1
    fi
    
    # Check health endpoint
    if ! check_health "$HEALTH_URL" 30 10; then
        log_error "Health check failed"
        return 1
    fi
    
    # Check SSL certificate
    log_info "Checking SSL certificate..."
    if echo | openssl s_client -connect agent.neuratalent.com:443 -servername agent.neuratalent.com 2>/dev/null | openssl x509 -noout -dates; then
        log_success "SSL certificate is valid"
    else
        log_warning "SSL certificate check failed"
    fi
    
    # Check response time
    local response_time=$(curl -o /dev/null -s -w '%{time_total}' -k "$HEALTH_URL")
    log_info "Response time: ${response_time}s"
    
    log_success "Deployment verification completed"
    return 0
}

# Function to show deployment status
show_status() {
    log_info "Deployment Status:"
    echo "=================="
    
    # Container status
    if docker ps | grep -q "$CONTAINER_NAME"; then
        echo -e "Container: ${GREEN}Running${NC}"
    else
        echo -e "Container: ${RED}Not Running${NC}"
    fi
    
    # Service process
    if docker exec "$CONTAINER_NAME" pgrep -f "$BINARY_NAME" > /dev/null 2>&1; then
        echo -e "Service: ${GREEN}Running${NC}"
    else
        echo -e "Service: ${RED}Not Running${NC}"
    fi
    
    # Health check
    if curl -k -s -f "$HEALTH_URL" > /dev/null 2>&1; then
        echo -e "Health: ${GREEN}Healthy${NC}"
    else
        echo -e "Health: ${RED}Unhealthy${NC}"
    fi
    
    # Binary info
    if [ -f "$DEPLOYMENT_DIR/$BINARY_NAME" ]; then
        local binary_size=$(du -h "$DEPLOYMENT_DIR/$BINARY_NAME" | cut -f1)
        local binary_date=$(stat -c %y "$DEPLOYMENT_DIR/$BINARY_NAME" | cut -d' ' -f1)
        echo "Binary: $binary_size (modified: $binary_date)"
    else
        echo -e "Binary: ${RED}Not Found${NC}"
    fi
    
    # Available backups
    local backup_count=$(ls -1 "$DEPLOYMENT_DIR/${BINARY_NAME}.backup."* 2>/dev/null | wc -l)
    echo "Backups: $backup_count available"
}

# Main deployment function
deploy() {
    log_info "Starting Backend Agent deployment..."
    
    # Create deployment directory if it doesn't exist
    mkdir -p "$DEPLOYMENT_DIR"
    
    # Backup current binary
    backup_current_binary
    
    # Stop current service
    stop_service
    
    # Start service with new binary
    start_service
    
    # Verify deployment
    if verify_deployment; then
        log_success "Deployment completed successfully!"
        cleanup_old_backups
        return 0
    else
        log_error "Deployment verification failed"
        rollback
        return 1
    fi
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "rollback")
        rollback
        ;;
    "status")
        show_status
        ;;
    "health")
        check_health "$HEALTH_URL"
        ;;
    "stop")
        stop_service
        ;;
    "start")
        start_service
        ;;
    "restart")
        stop_service
        start_service
        check_health "$HEALTH_URL"
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|status|health|stop|start|restart}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Deploy new binary (default)"
        echo "  rollback - Rollback to previous version"
        echo "  status   - Show deployment status"
        echo "  health   - Check service health"
        echo "  stop     - Stop the service"
        echo "  start    - Start the service"
        echo "  restart  - Restart the service"
        exit 1
        ;;
esac
