#!/bin/bash

# ViWorkS Admin Panel - Production Readiness Test
# This script tests all API endpoints and verifies the system is production-ready

set -e

echo "🚀 ViWorkS Admin Panel - Production Readiness Test"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_status="$3"
    
    echo -n "Testing $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((TESTS_FAILED++))
    fi
}

# Function to test API endpoint
test_api_endpoint() {
    local endpoint="$1"
    local method="${2:-GET}"
    local data="${3:-}"
    local expected_status="${4:-200}"
    
    local curl_cmd="curl -s -o /dev/null -w '%{http_code}'"
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        curl_cmd="$curl_cmd -X POST -H 'Content-Type: application/json' -d '$data'"
    elif [ "$method" != "GET" ]; then
        curl_cmd="$curl_cmd -X $method"
    fi
    curl_cmd="$curl_cmd http://localhost:8081$endpoint"
    
    local status=$(eval "$curl_cmd")
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL (Status: $status, Expected: $expected_status)${NC}"
        ((TESTS_FAILED++))
    fi
}

echo -e "${BLUE}1. Checking Container Status${NC}"
echo "--------------------------------"

# Check if containers are running
echo -n "Backend container status... "
if docker ps | grep -q viworks-admin-backend; then
    echo -e "${GREEN}✓ RUNNING${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ NOT RUNNING${NC}"
    ((TESTS_FAILED++))
fi

echo -n "Frontend container status... "
if docker ps | grep -q viworks-admin-frontend; then
    echo -e "${GREEN}✓ RUNNING${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ NOT RUNNING${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo -e "${BLUE}2. Testing Backend Health${NC}"
echo "-------------------------------"

# Test basic health endpoints
echo -n "Testing /health... "
test_api_endpoint "/health"

echo -n "Testing /api/status... "
test_api_endpoint "/api/status"

echo -n "Testing /api/v1/health... "
test_api_endpoint "/api/v1/health"

echo -n "Testing /api/v1/health/full... "
test_api_endpoint "/api/v1/health/full"

echo ""
echo -e "${BLUE}3. Testing Authentication Endpoints${NC}"
echo "-------------------------------------------"

# Test authentication endpoints
echo -n "Testing /api/auth/login... "
test_api_endpoint "/api/auth/login" "POST" '{"username": "admin", "password": "admin123"}'

echo -n "Testing /api/v1/auth/login... "
test_api_endpoint "/api/v1/auth/login" "POST" '{"username": "admin", "password": "admin123"}'

echo -n "Testing /api/v1/auth/me... "
test_api_endpoint "/api/v1/auth/me"

echo -n "Testing /api/v1/auth/logout... "
test_api_endpoint "/api/v1/auth/logout" "POST"

echo -n "Testing /api/v1/auth/refresh... "
test_api_endpoint "/api/v1/auth/refresh" "POST" '{"refresh_token": "dummy_refresh_token_for_admin"}'

echo ""
echo -e "${BLUE}4. Testing Data Endpoints${NC}"
echo "--------------------------------"

# Test data endpoints
echo -n "Testing /api/v1/users... "
test_api_endpoint "/api/v1/users"

echo -n "Testing /api/v1/clients... "
test_api_endpoint "/api/v1/clients"

echo -n "Testing /api/v1/sessions... "
test_api_endpoint "/api/v1/sessions"

echo -n "Testing /api/v1/monitoring/alerts... "
test_api_endpoint "/api/v1/monitoring/alerts"

echo -n "Testing /api/v1/monitoring/metrics... "
test_api_endpoint "/api/v1/monitoring/metrics"

echo -n "Testing /api/v1/monitoring/dashboard... "
test_api_endpoint "/api/v1/monitoring/dashboard"

echo -n "Testing /api/v1/monitoring/logs... "
test_api_endpoint "/api/v1/monitoring/logs"

echo ""
echo -e "${BLUE}5. Testing Action Endpoints${NC}"
echo "-----------------------------------"

# Test action endpoints
echo -n "Testing user unlock... "
test_api_endpoint "/api/v1/users/test-user/unlock" "POST"

echo -n "Testing password reset... "
test_api_endpoint "/api/v1/users/test-user/reset-password" "POST"

echo -n "Testing client disconnect... "
test_api_endpoint "/api/v1/clients/test-client/disconnect" "POST"

echo -n "Testing session revoke... "
test_api_endpoint "/api/v1/sessions/test-session/revoke" "PUT"

echo -n "Testing user sessions revoke... "
test_api_endpoint "/api/v1/sessions/user/test-user/revoke" "PUT"

echo -n "Testing expired sessions cleanup... "
test_api_endpoint "/api/v1/sessions/expired" "DELETE"

echo ""
echo -e "${BLUE}6. Testing Frontend Access${NC}"
echo "--------------------------------"

# Test frontend endpoints
echo -n "Testing frontend login page... "
if curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/login | grep -q "200"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((TESTS_FAILED++))
fi

echo -n "Testing frontend main page... "
if curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/ | grep -q "200"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo -e "${BLUE}7. Testing API Response Quality${NC}"
echo "--------------------------------------"

# Test that responses contain expected data
echo -n "Testing login response structure... "
if curl -s http://localhost:8081/api/v1/auth/login -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password": "admin123"}' | jq -e '.token and .refresh_token and .user' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((TESTS_FAILED++))
fi

echo -n "Testing users response structure... "
if curl -s http://localhost:8081/api/v1/users | jq -e '.users and .total' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((TESTS_FAILED++))
fi

echo -n "Testing clients response structure... "
if curl -s http://localhost:8081/api/v1/clients | jq -e '.clients and .total' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo -e "${BLUE}8. Performance Tests${NC}"
echo "---------------------------"

# Test response times
echo -n "Testing health endpoint response time... "
start_time=$(date +%s%N)
curl -s http://localhost:8081/health > /dev/null
end_time=$(date +%s%N)
response_time=$(( (end_time - start_time) / 1000000 ))
if [ $response_time -lt 1000 ]; then
    echo -e "${GREEN}✓ PASS (${response_time}ms)${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠ SLOW (${response_time}ms)${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo -e "${BLUE}9. Security Tests${NC}"
echo "----------------------"

# Test CORS headers
echo -n "Testing CORS headers... "
if curl -s -D - -o /dev/null -H "Origin: http://localhost:3000" http://localhost:8081/health | grep -q "access-control-allow-origin"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((TESTS_FAILED++))
fi

# Test invalid credentials
echo -n "Testing invalid login... "
if curl -s -o /dev/null -w '%{http_code}' http://localhost:8081/api/v1/auth/login -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password": "wrong"}' | grep -q "401"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo -e "${BLUE}10. Container Health Checks${NC}"
echo "--------------------------------"

# Check container logs for errors
echo -n "Checking backend logs for errors... "
if docker logs viworks-admin-backend 2>&1 | grep -i "error\|panic\|fatal" | wc -l | grep -q "0"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL (Errors found in logs)${NC}"
    ((TESTS_FAILED++))
fi

echo -n "Checking frontend logs for errors... "
if docker logs viworks-admin-frontend 2>&1 | grep -i "error\|fatal" | wc -l | grep -q "0"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL (Errors found in logs)${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "=================================================="
echo -e "${BLUE}TEST RESULTS SUMMARY${NC}"
echo "=================================================="
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 ALL TESTS PASSED! 🎉${NC}"
    echo -e "${GREEN}The ViWorkS Admin Panel is PRODUCTION READY!${NC}"
    echo ""
    echo -e "${BLUE}Access Information:${NC}"
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:8081"
    echo "Login: admin / admin123"
    echo ""
    echo -e "${BLUE}Available Features:${NC}"
    echo "✓ User Authentication"
    echo "✓ Dashboard with Statistics"
    echo "✓ User Management"
    echo "✓ Client Management"
    echo "✓ Session Management"
    echo "✓ Security Alerts"
    echo "✓ System Monitoring"
    echo "✓ System Logs"
    echo ""
    echo -e "${GREEN}Ready for cloud deployment! 🚀${NC}"
else
    echo ""
    echo -e "${RED}❌ SOME TESTS FAILED! ❌${NC}"
    echo -e "${YELLOW}Please review the failed tests above and fix the issues before deployment.${NC}"
    exit 1
fi
