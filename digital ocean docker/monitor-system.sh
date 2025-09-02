#!/bin/bash

echo "🔍 SYSTEM MONITORING SCRIPT"
echo "============================"
echo "This script will continuously monitor your ViWorks system"
echo "Press Ctrl+C to stop monitoring"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS") echo -e "${GREEN}✅ $message${NC}" ;;
        "ERROR") echo -e "${RED}❌ $message${NC}" ;;
        "WARNING") echo -e "${YELLOW}⚠️  $message${NC}" ;;
        "INFO") echo -e "${BLUE}ℹ️  $message${NC}" ;;
    esac
}

# Function to check system health
check_system_health() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo ""
    echo "🕐 [$timestamp] System Health Check"
    echo "=================================="
    
    # Check container statuses
    echo "📊 Container Status:"
    docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" | grep -v "NAME"
    
    # Check backend health
    echo ""
    echo "🔍 Backend Health:"
    if curl -f http://localhost:8081/health >/dev/null 2>&1; then
        print_status "SUCCESS" "Backend responding"
    else
        print_status "ERROR" "Backend not responding"
    fi
    
    # Check frontend health
    echo "🔍 Frontend Health:"
    if curl -f http://localhost:3000/ >/dev/null 2>&1; then
        print_status "SUCCESS" "Frontend responding"
    else
        print_status "ERROR" "Frontend not responding"
    fi
    
    # Check for container restarts
    echo ""
    echo "🔄 Container Restart Check:"
    restart_count=$(docker-compose ps | grep -c "Restarting\|restart")
    if [ "$restart_count" -gt 0 ]; then
        print_status "WARNING" "Found $restart_count container(s) restarting"
    else
        print_status "SUCCESS" "No containers restarting"
    fi
    
    # Check resource usage
    echo ""
    echo "📊 Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
    
    # Check for errors in logs
    echo ""
    echo "🔍 Recent Errors:"
    error_count=$(docker-compose logs --tail=50 2>&1 | grep -i "error\|crash\|panic\|fatal" | wc -l)
    if [ "$error_count" -gt 0 ]; then
        print_status "WARNING" "Found $error_count errors in recent logs"
        docker-compose logs --tail=50 2>&1 | grep -i "error\|crash\|panic\|fatal" | tail -3
    else
        print_status "SUCCESS" "No recent errors found"
    fi
    
    echo ""
    echo "----------------------------------------"
}

# Function to test admin panel functionality
test_admin_panel() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo ""
    echo "🧪 [$timestamp] Admin Panel Test"
    echo "================================"
    
    # Test nginx proxy
    echo "🔍 Testing nginx proxy..."
    if curl -f "http://localhost/" >/dev/null 2>&1; then
        print_status "SUCCESS" "Nginx proxy working"
        
        # Test admin login page
        if curl -f "http://localhost/login" >/dev/null 2>&1; then
            print_status "SUCCESS" "Admin login page accessible"
        else
            print_status "ERROR" "Admin login page not accessible"
        fi
        
        # Test main admin page
        if curl -f "http://localhost/" >/dev/null 2>&1; then
            print_status "SUCCESS" "Main admin page accessible"
        else
            print_status "ERROR" "Main admin page not accessible"
        fi
    else
        print_status "ERROR" "Nginx proxy not working"
    fi
    
    echo ""
    echo "----------------------------------------"
}

# Function to test API endpoints
test_api_endpoints() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo ""
    echo "🔌 [$timestamp] API Endpoint Test"
    echo "================================="
    
    # Test health endpoints
    for endpoint in "/health" "/health/simple" "/health/readiness"; do
        if curl -f "http://localhost:8081$endpoint" >/dev/null 2>&1; then
            print_status "SUCCESS" "Endpoint $endpoint working"
        else
            print_status "ERROR" "Endpoint $endpoint not working"
        fi
    done
    
    # Test admin API endpoints
    if curl -f "http://localhost:8081/api/v1/admin/users" >/dev/null 2>&1; then
        print_status "SUCCESS" "Admin users API working"
    else
        print_status "ERROR" "Admin users API not working"
    fi
    
    echo ""
    echo "----------------------------------------"
}

# Function to check database connectivity
check_database() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo ""
    echo "🗄️  [$timestamp] Database Connectivity Test"
    echo "=========================================="
    
    # Test PostgreSQL
    if docker-compose exec -T postgres pg_isready -U admin -d viworks >/dev/null 2>&1; then
        print_status "SUCCESS" "PostgreSQL connection OK"
    else
        print_status "ERROR" "PostgreSQL connection failed"
    fi
    
    # Test Redis
    if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
        print_status "SUCCESS" "Redis connection OK"
    else
        print_status "ERROR" "Redis connection failed"
    fi
    
    echo ""
    echo "----------------------------------------"
}

# Main monitoring loop
echo "🚀 Starting system monitoring..."
echo "Monitoring interval: 30 seconds"
echo "Press Ctrl+C to stop"
echo ""

# Initial health check
check_system_health
test_admin_panel
test_api_endpoints
check_database

# Continuous monitoring loop
while true; do
    sleep 30
    
    # Run health checks
    check_system_health
    
    # Every 2 minutes, run full tests
    if [ $(( $(date +%s) % 120 )) -eq 0 ]; then
        test_admin_panel
        test_api_endpoints
        check_database
    fi
done
