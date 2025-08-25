#!/bin/bash

# Comprehensive ViWorkS Admin Panel Test Script
# Tests all components: Backend, Frontend, Database, Redis, and Integration

set -e

echo "🚀 ViWorkS Admin Panel - Comprehensive Test Suite"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "ERROR")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    print_status "INFO" "Running test: $test_name"
    
    if eval "$test_command" > /dev/null 2>&1; then
        print_status "SUCCESS" "$test_name - PASSED"
        ((TESTS_PASSED++))
    else
        print_status "ERROR" "$test_name - FAILED"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Phase 1: Check Dependencies
print_status "INFO" "Phase 1: Checking Dependencies"
echo "----------------------------------------"

run_test "Docker Installation" "docker --version"
run_test "Docker Compose Installation" "docker-compose --version"
run_test "Curl Installation" "curl --version"

# Phase 2: Database Tests
print_status "INFO" "Phase 2: Database Tests"
echo "--------------------------------"

run_test "PostgreSQL Container Health" "docker-compose ps postgres | grep -q 'Up'"
run_test "PostgreSQL Connection" "docker-compose exec -T postgres pg_isready -U admin -d viworks_admin"
run_test "Database Schema" "docker-compose exec -T postgres psql -U admin -d viworks_admin -c 'SELECT COUNT(*) FROM users;'"

# Phase 3: Redis Tests
print_status "INFO" "Phase 3: Redis Tests"
echo "----------------------------"

run_test "Redis Container Health" "docker-compose ps redis | grep -q 'Up'"
run_test "Redis Connection" "docker-compose exec -T redis redis-cli ping"

# Phase 4: Backend Tests
print_status "INFO" "Phase 4: Backend Tests"
echo "--------------------------------"

run_test "Backend Container Health" "docker-compose ps backend | grep -q 'Up'"
run_test "Backend Health Endpoint" "curl -s http://localhost:8081/health | grep -q 'ok'"
run_test "Backend Login Endpoint" "curl -s -X POST http://localhost:8081/api/v1/auth/login -H 'Content-Type: application/json' -d '{\"username\": \"admin\", \"password\": \"admin123\"}' | grep -q 'token'"
run_test "Backend 2FA Request Endpoint" "curl -s -X POST http://localhost:8081/api/v1/auth/request-2fa -H 'Content-Type: application/json' -d '{\"username\": \"admin\"}' | grep -q 'success'"

# Phase 5: Device Management Tests
print_status "INFO" "Phase 5: Device Management Tests"
echo "--------------------------------------------"

run_test "Device Registration Endpoint" "curl -s -X POST http://localhost:8081/api/v1/auth/register-device -H 'Content-Type: application/json' -d '{\"user_id\": \"00000000-0000-0000-0000-000000000000\", \"device_id\": \"test-device-001\", \"device_info\": {\"model\": \"Test Device\", \"os\": \"TestOS\", \"app_version\": \"1.0.0\"}}' | grep -q 'success'"

# Phase 6: WebSocket Tests
print_status "INFO" "Phase 6: WebSocket Tests"
echo "--------------------------------"

run_test "WebSocket Endpoint Accessibility" "curl -s -i -N -H 'Connection: Upgrade' -H 'Upgrade: websocket' -H 'Sec-WebSocket-Version: 13' -H 'Sec-WebSocket-Key: test' http://localhost:8081/ws | grep -q '101'"

# Phase 7: Frontend Tests (if running)
print_status "INFO" "Phase 7: Frontend Tests"
echo "--------------------------------"

if docker-compose ps frontend | grep -q 'Up'; then
    run_test "Frontend Container Health" "docker-compose ps frontend | grep -q 'Up'"
    run_test "Frontend Accessibility" "curl -s http://localhost:3000 | grep -q 'html'"
else
    print_status "WARNING" "Frontend container not running - skipping frontend tests"
fi

# Phase 8: Integration Tests
print_status "INFO" "Phase 8: Integration Tests"
echo "--------------------------------------"

# Test complete authentication flow
print_status "INFO" "Testing complete authentication flow..."

# Step 1: Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8081/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username": "admin", "password": "admin123"}')

if echo "$LOGIN_RESPONSE" | grep -q 'token'; then
    print_status "SUCCESS" "Authentication Flow - Login - PASSED"
    ((TESTS_PASSED++))
else
    print_status "ERROR" "Authentication Flow - Login - FAILED"
    ((TESTS_FAILED++))
fi

# Step 2: 2FA Request
TWOFA_RESPONSE=$(curl -s -X POST http://localhost:8081/api/v1/auth/request-2fa \
    -H "Content-Type: application/json" \
    -d '{"username": "admin"}')

if echo "$TWOFA_RESPONSE" | grep -q 'success'; then
    print_status "SUCCESS" "Authentication Flow - 2FA Request - PASSED"
    ((TESTS_PASSED++))
else
    print_status "ERROR" "Authentication Flow - 2FA Request - FAILED"
    ((TESTS_FAILED++))
fi

# Step 3: Device Registration
DEVICE_RESPONSE=$(curl -s -X POST http://localhost:8081/api/v1/auth/register-device \
    -H "Content-Type: application/json" \
    -d '{
        "user_id": "00000000-0000-0000-0000-000000000000",
        "device_id": "integration-test-device",
        "device_info": {
            "model": "Integration Test Device",
            "os": "TestOS",
            "app_version": "1.0.0",
            "manufacturer": "Test Manufacturer",
            "device_name": "Integration Test Device"
        }
    }')

if echo "$DEVICE_RESPONSE" | grep -q 'success'; then
    print_status "SUCCESS" "Authentication Flow - Device Registration - PASSED"
    ((TESTS_PASSED++))
else
    print_status "ERROR" "Authentication Flow - Device Registration - FAILED"
    ((TESTS_FAILED++))
fi

# Phase 9: Performance Tests
print_status "INFO" "Phase 9: Performance Tests"
echo "------------------------------------"

# Test response times
print_status "INFO" "Testing API response times..."

HEALTH_TIME=$(curl -s -w "%{time_total}" -o /dev/null http://localhost:8081/health)
LOGIN_TIME=$(curl -s -w "%{time_total}" -o /dev/null -X POST http://localhost:8081/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username": "admin", "password": "admin123"}')

if (( $(echo "$HEALTH_TIME < 1.0" | bc -l) )); then
    print_status "SUCCESS" "Health endpoint response time: ${HEALTH_TIME}s - PASSED"
    ((TESTS_PASSED++))
else
    print_status "WARNING" "Health endpoint response time: ${HEALTH_TIME}s - SLOW"
    ((TESTS_FAILED++))
fi

if (( $(echo "$LOGIN_TIME < 2.0" | bc -l) )); then
    print_status "SUCCESS" "Login endpoint response time: ${LOGIN_TIME}s - PASSED"
    ((TESTS_PASSED++))
else
    print_status "WARNING" "Login endpoint response time: ${LOGIN_TIME}s - SLOW"
    ((TESTS_FAILED++))
fi

# Final Results
echo ""
echo "=================================================="
print_status "INFO" "Test Results Summary"
echo "=================================================="
echo ""

print_status "SUCCESS" "Tests Passed: $TESTS_PASSED"
if [ $TESTS_FAILED -gt 0 ]; then
    print_status "ERROR" "Tests Failed: $TESTS_FAILED"
else
    print_status "SUCCESS" "Tests Failed: $TESTS_FAILED"
fi

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
SUCCESS_RATE=$(echo "scale=1; $TESTS_PASSED * 100 / $TOTAL_TESTS" | bc -l)

echo ""
print_status "INFO" "Success Rate: ${SUCCESS_RATE}%"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    print_status "SUCCESS" "🎉 All tests passed! The ViWorkS Admin Panel is fully functional."
    print_status "INFO" "You can now access:"
    print_status "INFO" "  - Backend API: http://localhost:8081"
    print_status "INFO" "  - Frontend: http://localhost:3000 (if running)"
    print_status "INFO" "  - pgAdmin: http://localhost:5050"
    print_status "INFO" "  - Database: localhost:5432"
    print_status "INFO" "  - Redis: localhost:6379"
else
    echo ""
    print_status "WARNING" "Some tests failed. Please check the logs and fix the issues."
fi

echo ""
print_status "INFO" "Test completed at: $(date)"
