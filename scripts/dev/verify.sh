#!/usr/bin/env bash
set -euo pipefail

echo "🔍 ViWorkS No-Restart-Guard Verification Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a service is healthy
check_service_health() {
    local service_name=$1
    local health_url=$2
    local max_attempts=${3:-30}
    local delay=${4:-2}
    
    log_info "Checking $service_name health at $health_url..."
    
    for i in $(seq 1 $max_attempts); do
        if curl -sf "$health_url" >/dev/null 2>&1; then
            log_info "✅ $service_name is healthy"
            return 0
        fi
        log_warn "⏳ Waiting for $service_name... ($i/$max_attempts)"
        sleep $delay
    done
    
    log_error "❌ $service_name failed to become healthy after $max_attempts attempts"
    return 1
}

# Function to check container status
check_container_status() {
    local container_name=$1
    local status=$(docker ps --filter "name=$container_name" --format "{{.Status}}" 2>/dev/null || echo "not found")
    
    if [[ "$status" == "not found" ]]; then
        log_error "❌ Container $container_name not found"
        return 1
    elif [[ "$status" == *"Up"* ]]; then
        log_info "✅ Container $container_name is running: $status"
        return 0
    else
        log_error "❌ Container $container_name is not running: $status"
        return 1
    fi
}

# Function to check container logs for startup messages
check_startup_logs() {
    local container_name=$1
    local expected_message=$2
    
    log_info "Checking startup logs for $container_name..."
    
    if docker logs "$container_name" 2>&1 | grep -q "$expected_message"; then
        log_info "✅ $container_name shows proper startup message"
        return 0
    else
        log_warn "⚠️  $container_name startup message not found"
        return 1
    fi
}

# Main verification process
main() {
    log_info "Starting verification process..."
    
    # Check if we're in the right directory
    if [[ ! -f "docker-compose.yml" ]]; then
        log_error "docker-compose.yml not found. Please run this script from the project root."
        exit 1
    fi
    
    # Start services
    log_info "Starting services with docker-compose..."
    docker-compose up -d --build
    
    # Wait for services to start
    log_info "Waiting 10 seconds for services to initialize..."
    sleep 10
    
    # Check container status
    log_info "Checking container status..."
    check_container_status "viworks-postgres" || exit 1
    check_container_status "viworks-redis" || exit 1
    check_container_status "viworks-backend" || exit 1
    check_container_status "viworks-frontend" || exit 1
    check_container_status "viworks-nginx" || exit 1
    
    # Check startup logs
    log_info "Checking startup logs..."
    check_startup_logs "viworks-backend" "ViWorkS Backend is now running"
    check_startup_logs "viworks-frontend" "ready"
    check_startup_logs "viworks-nginx" "start worker processes"
    
    # Check health endpoints
    log_info "Checking health endpoints..."
    check_service_health "backend" "http://localhost:8081/_healthz" || exit 1
    check_service_health "frontend" "http://localhost:3000/_healthz" || exit 1
    check_service_health "nginx" "http://localhost/_health" || exit 1
    
    # Show recent logs
    log_info "Showing recent logs from all services..."
    echo "=== Backend Logs (last 20 lines) ==="
    docker logs viworks-backend --tail=20
    echo ""
    echo "=== Frontend Logs (last 20 lines) ==="
    docker logs viworks-frontend --tail=20
    echo ""
    echo "=== Nginx Logs (last 20 lines) ==="
    docker logs viworks-nginx --tail=20
    
    # Final status check
    log_info "Final container status:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    log_info "🎉 Verification completed successfully!"
    log_info "All services are running and healthy."
}

# Run main function
main "$@"
