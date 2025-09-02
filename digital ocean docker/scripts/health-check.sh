#!/usr/bin/env bash
set -eu

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() { printf "%s | %s\n" "$(date -u +"%Y-%m-%d %H:%M:%S.%3N")" "$*"; }
log_success() { log "${GREEN}✅ $1${NC}"; }
log_warning() { log "${YELLOW}⚠️  $1${NC}"; }
log_error() { log "${RED}❌ $1${NC}"; }
log_info() { log "${BLUE}ℹ️  $1${NC}"; }

# Configuration
MAX_RETRIES=3
RETRY_DELAY=2

# Function to check if a service is responding
check_service() {
    local service_name=$1
    local url=$2
    local description=$3
    
    log_info "Checking $service_name: $description"
    
    for attempt in $(seq 1 $MAX_RETRIES); do
        if curl -f -s --max-time 10 "$url" >/dev/null 2>&1; then
            log_success "$service_name is healthy"
            return 0
        else
            if [ $attempt -lt $MAX_RETRIES ]; then
                log_warning "$service_name attempt $attempt failed, retrying in ${RETRY_DELAY}s..."
                sleep $RETRY_DELAY
            else
                log_error "$service_name is unhealthy after $MAX_RETRIES attempts"
                return 1
            fi
        fi
    done
}

# Function to check container status
check_container() {
    local container_name=$1
    local service_name=$2
    
    log_info "Checking container: $container_name ($service_name)"
    
    if docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Health}}" | grep -q "$container_name"; then
        local status=$(docker ps --format "table {{.Names}}\t{{.Status}}" | grep "$container_name" | awk '{print $2}')
        local health=$(docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Health}}" | grep "$container_name" | awk '{print $3}')
        
        if [[ "$status" == *"Up"* ]]; then
            if [[ "$health" == *"healthy"* ]]; then
                log_success "$service_name container is running and healthy"
                return 0
            elif [[ "$health" == *"unhealthy"* ]]; then
                log_error "$service_name container is running but unhealthy"
                return 1
            else
                log_warning "$service_name container is running but health status unknown: $health"
                return 0
            fi
        else
            log_error "$service_name container is not running properly: $status"
            return 1
        fi
    else
        log_error "$service_name container is not running"
        return 1
    fi
}

# Function to check database connectivity
check_database() {
    local service_name="PostgreSQL"
    log_info "Checking $service_name connectivity"
    
    if docker exec viworks-postgres pg_isready -U admin -d viworks >/dev/null 2>&1; then
        log_success "$service_name is accessible"
        return 0
    else
        log_error "$service_name is not accessible"
        return 1
    fi
}

# Function to check Redis connectivity
check_redis() {
    local service_name="Redis"
    log_info "Checking $service_name connectivity"
    
    if docker exec viworks-redis redis-cli ping >/dev/null 2>&1; then
        log_success "$service_name is accessible"
        return 0
    else
        log_error "$service_name is not accessible"
        return 1
    fi
}

# Function to check network connectivity
check_network() {
    local service_name="Network"
    log_info "Checking $service_name connectivity between services"
    
    # Check if containers can reach each other
    if docker exec viworks-backend ping -c 1 postgres >/dev/null 2>&1; then
        log_success "Backend can reach PostgreSQL"
    else
        log_error "Backend cannot reach PostgreSQL"
        return 1
    fi
    
    if docker exec viworks-backend ping -c 1 redis >/dev/null 2>&1; then
        log_success "Backend can reach Redis"
    else
        log_error "Backend cannot reach Redis"
        return 1
    fi
    
    return 0
}

# Function to check logs for errors
check_logs() {
    local service_name=$1
    local container_name=$2
    local max_lines=${3:-50}
    
    log_info "Checking recent logs for $service_name"
    
    # Check for error patterns in logs
    local error_count=$(docker logs --tail $max_lines "$container_name" 2>&1 | grep -i -E "(error|Error|ERROR|panic|Panic|PANIC|fatal|Fatal|FATAL|exit|Exit|EXIT)" | wc -l)
    
    if [ $error_count -eq 0 ]; then
        log_success "$service_name logs show no recent errors"
    else
        log_warning "$service_name logs show $error_count recent error(s)"
        # Show the last few errors
        docker logs --tail $max_lines "$container_name" 2>&1 | grep -i -E "(error|Error|ERROR|panic|Panic|PANIC|fatal|Fatal|FATAL|exit|Exit|EXIT)" | tail -3
    fi
}

# Main health check function
main() {
    log_info "🚀 Starting comprehensive health check for ViWorks platform"
    log_info "Timestamp: $(date -u)"
    
    local overall_health=0
    local service_checks=0
    local failed_checks=0
    
    echo "=========================================="
    echo "🔍 CONTAINER STATUS CHECKS"
    echo "=========================================="
    
    # Check container statuses
    check_container "viworks-postgres" "PostgreSQL" || ((failed_checks++))
    ((service_checks++))
    
    check_container "viworks-redis" "Redis" || ((failed_checks++))
    ((service_checks++))
    
    check_container "viworks-backend" "Backend" || ((failed_checks++))
    ((service_checks++))
    
    check_container "viworks-frontend" "Frontend" || ((failed_checks++))
    ((service_checks++))
    
    check_container "viworks-website" "Website" || ((failed_checks++))
    ((service_checks++))
    
    check_container "viworks-agent" "Agent" || ((failed_checks++))
    ((service_checks++))
    
    check_container "viworks-nginx" "Nginx" || ((failed_checks++))
    ((service_checks++))
    
    echo ""
    echo "=========================================="
    echo "🌐 SERVICE CONNECTIVITY CHECKS"
    echo "=========================================="
    
    # Check service connectivity
    check_database || ((failed_checks++))
    ((service_checks++))
    
    check_redis || ((failed_checks++))
    ((service_checks++))
    
    check_network || ((failed_checks++))
    ((service_checks++))
    
    echo ""
    echo "=========================================="
    echo "🔗 ENDPOINT HEALTH CHECKS"
    echo "=========================================="
    
    # Check endpoint health
    check_service "Backend Health" "http://localhost:8081/health" "Backend health endpoint" || ((failed_checks++))
    ((service_checks++))
    
    check_service "Frontend" "http://localhost:3000" "Frontend application" || ((failed_checks++))
    ((service_checks++))
    
    check_service "Website" "http://localhost:3000" "Website application" || ((failed_checks++))
    ((service_checks++))
    
    check_service "Nginx" "http://localhost/health" "Nginx health endpoint" || ((failed_checks++))
    ((service_checks++))
    
    echo ""
    echo "=========================================="
    echo "📋 LOG ANALYSIS"
    echo "=========================================="
    
    # Check logs for critical services
    check_logs "Backend" "viworks-backend" 100
    check_logs "Nginx" "viworks-nginx" 50
    check_logs "PostgreSQL" "viworks-postgres" 30
    
    echo ""
    echo "=========================================="
    echo "📊 HEALTH CHECK SUMMARY"
    echo "=========================================="
    
    local success_rate=$(( (service_checks - failed_checks) * 100 / service_checks ))
    
    if [ $failed_checks -eq 0 ]; then
        log_success "All $service_checks service checks passed! 🎉"
        overall_health=0
    else
        log_error "$failed_checks out of $service_checks service checks failed"
        log_warning "Success rate: ${success_rate}%"
        overall_health=1
    fi
    
    echo ""
    echo "=========================================="
    echo "💡 RECOMMENDATIONS"
    echo "=========================================="
    
    if [ $overall_health -eq 0 ]; then
        log_success "Platform is healthy! No immediate action required."
    else
        log_error "Platform has issues that need attention:"
        echo "1. Check failed service logs for detailed error information"
        echo "2. Verify network connectivity between containers"
        echo "3. Check resource usage (CPU, memory, disk)"
        echo "4. Review recent deployment changes"
        echo "5. Consider restarting problematic services"
    fi
    
    echo ""
    log_info "Health check completed at: $(date -u)"
    
    exit $overall_health
}

# Run main function
main "$@"
