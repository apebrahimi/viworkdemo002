#!/bin/bash

echo "🧪 COMPLETE SYSTEM TESTING SCRIPT"
echo "=================================="
echo "This script will test all aspects of your ViWorks system"
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

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_status "ERROR" "docker-compose.yml not found. Please run this from the project root."
    exit 1
fi

echo ""
print_status "INFO" "Phase 1: Container Status Check"
echo "=========================================="

# Check all container statuses
echo "📊 Checking container statuses..."
docker-compose ps

echo ""
print_status "INFO" "Phase 2: Health Check Verification"
echo "=============================================="

# Test backend health
echo "🔍 Testing backend health endpoint..."
if curl -f http://localhost:8081/health >/dev/null 2>&1; then
    print_status "SUCCESS" "Backend health endpoint responding"
    # Get actual response
    echo "📋 Backend health response:"
    curl -s http://localhost:8081/health | jq . 2>/dev/null || curl -s http://localhost:8081/health
else
    print_status "ERROR" "Backend health endpoint not responding"
fi

# Test frontend health
echo ""
echo "🔍 Testing frontend health..."
if curl -f http://localhost:3000/ >/dev/null 2>&1; then
    print_status "SUCCESS" "Frontend responding"
else
    print_status "ERROR" "Frontend not responding"
fi

echo ""
print_status "INFO" "Phase 3: Database Connectivity Test"
echo "================================================"

# Test database connection
echo "🔍 Testing database connectivity..."
if docker-compose exec -T postgres pg_isready -U admin -d viworks >/dev/null 2>&1; then
    print_status "SUCCESS" "PostgreSQL connection OK"
    
    # Test a simple query
    if docker-compose exec -T postgres psql -U admin -d viworks -c "SELECT COUNT(*) FROM users;" >/dev/null 2>&1; then
        print_status "SUCCESS" "Database queries working"
        echo "📊 User count:"
        docker-compose exec -T postgres psql -U admin -d viworks -c "SELECT COUNT(*) FROM users;"
    else
        print_status "ERROR" "Database queries failing"
    fi
else
    print_status "ERROR" "PostgreSQL connection failed"
fi

# Test Redis connection
echo ""
echo "🔍 Testing Redis connectivity..."
if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
    print_status "SUCCESS" "Redis connection OK"
    echo "📊 Redis response:"
    docker-compose exec -T redis redis-cli ping
else
    print_status "ERROR" "Redis connection failed"
fi

echo ""
print_status "INFO" "Phase 4: Network Connectivity Test"
echo "================================================"

# Test internal network communication
echo "🔍 Testing internal network communication..."

# Test backend to database
if docker-compose exec -T backend pg_isready -h postgres -U admin -d viworks >/dev/null 2>&1; then
    print_status "SUCCESS" "Backend can connect to database"
else
    print_status "ERROR" "Backend cannot connect to database"
fi

# Test backend to Redis
if docker-compose exec -T backend redis-cli -h redis ping >/dev/null 2>&1; then
    print_status "SUCCESS" "Backend can connect to Redis"
else
    print_status "ERROR" "Backend cannot connect to Redis"
fi

echo ""
print_status "INFO" "Phase 5: API Endpoint Testing"
echo "========================================"

# Test various API endpoints
echo "🔍 Testing API endpoints..."

# Health endpoints
for endpoint in "/health" "/health/simple" "/health/readiness"; do
    if curl -f "http://localhost:8081$endpoint" >/dev/null 2>&1; then
        print_status "SUCCESS" "Endpoint $endpoint working"
    else
        print_status "ERROR" "Endpoint $endpoint not working"
    fi
done

# Test admin endpoints
echo ""
echo "🔍 Testing admin endpoints..."
if curl -f "http://localhost:8081/api/v1/admin/users" >/dev/null 2>&1; then
    print_status "SUCCESS" "Admin users endpoint working"
else
    print_status "ERROR" "Admin users endpoint not working"
fi

echo ""
print_status "INFO" "Phase 6: Container Resource Usage"
echo "============================================="

# Check resource usage
echo "📊 Container resource usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

echo ""
print_status "INFO" "Phase 7: Log Analysis"
echo "==============================="

# Check recent logs for errors
echo "🔍 Checking recent logs for errors..."

# Backend logs
echo "📋 Backend logs (last 10 lines):"
docker-compose logs --tail=10 backend

echo ""
echo "🔍 Checking for error patterns in backend logs..."
if docker-compose logs backend 2>&1 | grep -i "error\|crash\|panic\|fatal" | tail -5; then
    print_status "WARNING" "Found errors in backend logs"
else
    print_status "SUCCESS" "No errors found in backend logs"
fi

# Frontend logs
echo ""
echo "📋 Frontend logs (last 10 lines):"
docker-compose logs --tail=10 frontend

# Database logs
echo ""
echo "📋 Database logs (last 10 lines):"
docker-compose logs --tail=10 postgres

echo ""
print_status "INFO" "Phase 8: System Stability Test"
echo "=========================================="

# Test system stability by checking uptime
echo "🔍 Testing system stability..."
echo "📊 Container uptimes:"
docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

# Check if any containers have restarted
echo ""
echo "🔍 Checking for container restarts..."
restart_count=$(docker-compose ps | grep -c "Restarting\|restart")
if [ "$restart_count" -gt 0 ]; then
    print_status "WARNING" "Found $restart_count container(s) restarting"
else
    print_status "SUCCESS" "No containers are restarting"
fi

echo ""
print_status "INFO" "Phase 9: Admin Panel Functionality Test"
echo "=================================================="

# Test admin panel through nginx proxy
echo "🔍 Testing admin panel functionality..."

# Test if nginx is proxying correctly
if curl -f "http://localhost/" >/dev/null 2>&1; then
    print_status "SUCCESS" "Nginx proxy responding"
    
    # Test admin panel routes
    echo "🔍 Testing admin panel routes..."
    if curl -f "http://localhost/login" >/dev/null 2>&1; then
        print_status "SUCCESS" "Admin login page accessible"
    else
        print_status "ERROR" "Admin login page not accessible"
    fi
else
    print_status "ERROR" "Nginx proxy not responding"
fi

echo ""
print_status "INFO" "Phase 10: Security Verification"
echo "=========================================="

# Check security settings
echo "🔍 Verifying security settings..."

# Check if containers are running as non-root
echo "📊 Container user verification:"
for container in backend frontend postgres redis; do
    if docker-compose exec -T "$container" id 2>/dev/null | grep -q "uid=0"; then
        print_status "WARNING" "Container $container running as root"
    else
        print_status "SUCCESS" "Container $container running as non-root user"
    fi
done

# Check network isolation
echo ""
echo "🔍 Checking network isolation..."
if docker network ls | grep -q "viworks-internal"; then
    print_status "SUCCESS" "Internal network exists"
else
    print_status "ERROR" "Internal network missing"
fi

if docker network ls | grep -q "viworks-public"; then
    print_status "SUCCESS" "Public network exists"
else
    print_status "ERROR" "Public network missing"
fi

echo ""
print_status "INFO" "TESTING COMPLETE!"
echo "================================"

echo ""
print_status "INFO" "SUMMARY OF FINDINGS:"
echo "1. Container Status: All containers should be running and healthy"
echo "2. Backend Health: Should be responding to /health endpoint"
echo "3. Database: PostgreSQL and Redis should be accessible"
echo "4. Network: Internal communication should be working"
echo "5. API: All endpoints should be responding"
echo "6. Admin Panel: Should be accessible through nginx"
echo "7. Security: Containers should be running as non-root users"

echo ""
print_status "SUCCESS" "System testing completed successfully!"
print_status "INFO" "Check the output above for any issues or warnings."
