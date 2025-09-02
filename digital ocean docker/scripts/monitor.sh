#!/usr/bin/env bash
set -eu

# Configuration
MONITOR_INTERVAL=60  # seconds
MAX_FAILURES=3
ALERT_COOLDOWN=300   # seconds (5 minutes)
LOG_FILE="/var/log/viworks-monitor.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() { 
    local timestamp=$(date -u +"%Y-%m-%d %H:%M:%S.%3N")
    printf "%s | %s\n" "$timestamp" "$*" | tee -a "$LOG_FILE"
}

log_success() { log "${GREEN}✅ $1${NC}"; }
log_warning() { log "${YELLOW}⚠️  $1${NC}"; }
log_error() { log "${RED}❌ $1${NC}"; }
log_info() { log "${BLUE}ℹ️  $1${NC}"; }

# Alert tracking
declare -A alert_timestamps
declare -A failure_counts

# Function to send alert
send_alert() {
    local service=$1
    local message=$2
    local current_time=$(date +%s)
    local last_alert=${alert_timestamps[$service]:-0}
    
    # Check cooldown period
    if [ $((current_time - last_alert)) -gt $ALERT_COOLDOWN ]; then
        log_error "🚨 ALERT: $service - $message"
        alert_timestamps[$service]=$current_time
        
        # Here you could add actual alert mechanisms:
        # - Send email
        # - Send Slack/Discord message
        # - Create incident ticket
        # - Trigger webhook
    fi
}

# Function to check service health
check_service_health() {
    local service=$1
    local check_command=$2
    local description=$3
    
    if eval "$check_command" >/dev/null 2>&1; then
        log_success "$service: $description - HEALTHY"
        failure_counts[$service]=0
        return 0
    else
        local failures=${failure_counts[$service]:-0}
        ((failures++))
        failure_counts[$service]=$failures
        
        if [ $failures -ge $MAX_FAILURES ]; then
            send_alert "$service" "Service unhealthy after $failures consecutive failures: $description"
        fi
        
        log_error "$service: $description - UNHEALTHY (failures: $failures)"
        return 1
    fi
}

# Function to check container status
check_container_status() {
    local container_name=$1
    local service_name=$2
    
    if docker ps --format "{{.Names}}\t{{.Status}}" | grep -q "$container_name.*Up"; then
        log_success "$service_name container is running"
        failure_counts["${service_name}_container"]=0
        return 0
    else
        local failures=${failure_counts["${service_name}_container"]:-0}
        ((failures++))
        failure_counts["${service_name}_container"]=$failures
        
        if [ $failures -ge $MAX_FAILURES ]; then
            send_alert "$service_name" "Container not running after $failures consecutive checks"
        fi
        
        log_error "$service_name container is not running"
        return 1
    fi
}

# Function to check resource usage
check_resource_usage() {
    local container_name=$1
    local service_name=$2
    
    # Get container stats
    local stats=$(docker stats --no-stream --format "table {{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" "$container_name" 2>/dev/null | tail -1)
    
    if [ -n "$stats" ]; then
        local cpu=$(echo "$stats" | awk '{print $1}' | sed 's/%//')
        local mem=$(echo "$stats" | awk '{print $3}' | sed 's/%//')
        
        # Check CPU usage
        if (( $(echo "$cpu > 80" | bc -l) )); then
            log_warning "$service_name: High CPU usage: ${cpu}%"
            send_alert "$service_name" "High CPU usage: ${cpu}%"
        fi
        
        # Check memory usage
        if (( $(echo "$mem > 80" | bc -l) )); then
            log_warning "$service_name: High memory usage: ${mem}%"
            send_alert "$service_name" "High memory usage: ${mem}%"
        fi
        
        log_info "$service_name: CPU: ${cpu}%, Memory: ${mem}%"
    fi
}

# Function to check disk space
check_disk_space() {
    local usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [ "$usage" -gt 80 ]; then
        log_warning "Disk usage is high: ${usage}%"
        send_alert "System" "Disk usage is high: ${usage}%"
    elif [ "$usage" -gt 90 ]; then
        log_error "Disk usage is critical: ${usage}%"
        send_alert "System" "Critical disk usage: ${usage}%"
    fi
}

# Function to check network connectivity
check_network_connectivity() {
    local services=("postgres" "redis" "frontend" "website")
    local failed=0
    
    for service in "${services[@]}"; do
        if ! docker exec viworks-backend ping -c 1 "$service" >/dev/null 2>&1; then
            log_error "Backend cannot reach $service"
            ((failed++))
        fi
    done
    
    if [ $failed -gt 0 ]; then
        send_alert "Network" "$failed service(s) unreachable from backend"
        return 1
    fi
    
    return 0
}

# Function to check for error patterns in logs
check_log_errors() {
    local container_name=$1
    local service_name=$2
    local max_lines=100
    
    local error_count=$(docker logs --tail $max_lines "$container_name" 2>&1 | grep -i -E "(error|Error|ERROR|panic|Panic|PANIC|fatal|Fatal|FATAL|exit|Exit|EXIT)" | wc -l)
    
    if [ $error_count -gt 0 ]; then
        log_warning "$service_name: $error_count error(s) in recent logs"
        if [ $error_count -gt 10 ]; then
            send_alert "$service_name" "High error rate: $error_count errors in recent logs"
        fi
    fi
}

# Main monitoring loop
main() {
    log_info "🚀 Starting ViWorks platform monitoring"
    log_info "Monitoring interval: ${MONITOR_INTERVAL}s"
    log_info "Max failures before alert: $MAX_FAILURES"
    log_info "Alert cooldown: ${ALERT_COOLDOWN}s"
    log_info "Log file: $LOG_FILE"
    
    # Create log file if it doesn't exist
    touch "$LOG_FILE"
    
    while true; do
        local timestamp=$(date -u +"%Y-%m-%d %H:%M:%S.%3N")
        log_info "=== Monitoring cycle started at $timestamp ==="
        
        # Check container statuses
        check_container_status "viworks-postgres" "PostgreSQL"
        check_container_status "viworks-redis" "Redis"
        check_container_status "viworks-backend" "Backend"
        check_container_status "viworks-frontend" "Frontend"
        check_container_status "viworks-website" "Website"
        check_container_status "viworks-agent" "Agent"
        check_container_status "viworks-nginx" "Nginx"
        
        # Check service health endpoints
        check_service_health "Backend Health" "curl -f -s --max-time 10 http://localhost:8081/health" "Health endpoint"
        check_service_health "Frontend" "curl -f -s --max-time 10 http://localhost:3000" "Application endpoint"
        check_service_health "Website" "curl -f -s --max-time 10 http://localhost:3000" "Website endpoint"
        check_service_health "Nginx" "curl -f -s --max-time 10 http://localhost/health" "Nginx health"
        
        # Check database connectivity
        check_service_health "PostgreSQL" "docker exec viworks-postgres pg_isready -U admin -d viworks" "Database connectivity"
        check_service_health "Redis" "docker exec viworks-redis redis-cli ping" "Redis connectivity"
        
        # Check network connectivity
        check_network_connectivity
        
        # Check resource usage for critical services
        check_resource_usage "viworks-backend" "Backend"
        check_resource_usage "viworks-postgres" "PostgreSQL"
        check_resource_usage "viworks-redis" "Redis"
        
        # Check disk space
        check_disk_space
        
        # Check logs for errors
        check_log_errors "viworks-backend" "Backend"
        check_log_errors "viworks-nginx" "Nginx"
        check_log_errors "viworks-postgres" "PostgreSQL"
        
        log_info "=== Monitoring cycle completed ==="
        log_info "Sleeping for ${MONITOR_INTERVAL}s..."
        echo ""
        
        sleep $MONITOR_INTERVAL
    done
}

# Signal handling
trap 'log_info "Monitoring stopped by user"; exit 0' INT TERM

# Run main function
main "$@"
