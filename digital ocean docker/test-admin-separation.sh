#!/bin/bash

# ViWorkS Admin Authentication Separation - Test Script
# This script tests the admin/user auth separation implementation

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}     ViWorkS Admin Authentication Separation Test Script${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command_exists curl; then
    echo -e "${RED}curl is not installed${NC}"
    exit 1
fi

if ! command_exists jq; then
    echo -e "${YELLOW}jq is not installed, some tests will be limited${NC}"
fi

echo -e "${GREEN}✓ Prerequisites met${NC}"

# Configuration
BACKEND_URL="http://localhost:8081"
ADMIN_API_URL="$BACKEND_URL/admin/api"
USER_API_URL="$BACKEND_URL/api/v1"
ADMIN_CREDENTIALS='{"username":"admin","password":"AdminP@ss2024!"}'
USER_CREDENTIALS='{"username":"demo_user","password":"demo_password"}'

# Test functions
test_backend_health() {
    echo -e "${YELLOW}Testing backend health...${NC}"
    
    HEALTH_RESPONSE=$(curl -s "$BACKEND_URL/health")
    echo "$HEALTH_RESPONSE"
    
    if [[ "$HEALTH_RESPONSE" == *"healthy"* ]]; then
        echo -e "${GREEN}✓ Backend is healthy${NC}"
    else
        echo -e "${RED}✗ Backend health check failed${NC}"
        exit 1
    fi
    
    echo ""
}

test_admin_api_health() {
    echo -e "${YELLOW}Testing admin API health...${NC}"
    
    ADMIN_HEALTH_RESPONSE=$(curl -s "$ADMIN_API_URL/health")
    echo "$ADMIN_HEALTH_RESPONSE"
    
    if [[ "$ADMIN_HEALTH_RESPONSE" == *"healthy"* ]]; then
        echo -e "${GREEN}✓ Admin API is healthy${NC}"
    else
        echo -e "${RED}✗ Admin API health check failed${NC}"
        exit 1
    fi
    
    echo ""
}

test_admin_login() {
    echo -e "${YELLOW}Testing admin login...${NC}"
    
    ADMIN_LOGIN_RESPONSE=$(curl -s -X POST "$ADMIN_API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "$ADMIN_CREDENTIALS")
    
    echo "$ADMIN_LOGIN_RESPONSE"
    
    if [[ "$ADMIN_LOGIN_RESPONSE" == *"success"*"true"* ]]; then
        echo -e "${GREEN}✓ Admin login successful${NC}"
        
        # Extract token if jq is available
        if command_exists jq; then
            ADMIN_TOKEN=$(echo "$ADMIN_LOGIN_RESPONSE" | jq -r '.session.token')
            echo -e "${BLUE}Admin token: ${ADMIN_TOKEN}${NC}"
        fi
    else
        echo -e "${RED}✗ Admin login failed${NC}"
    fi
    
    echo ""
}

test_user_login() {
    echo -e "${YELLOW}Testing user login...${NC}"
    
    USER_LOGIN_RESPONSE=$(curl -s -X POST "$USER_API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "$USER_CREDENTIALS")
    
    echo "$USER_LOGIN_RESPONSE"
    
    if [[ "$USER_LOGIN_RESPONSE" == *"success"*"true"* ]]; then
        echo -e "${GREEN}✓ User login successful${NC}"
        
        # Extract token if jq is available
        if command_exists jq; then
            USER_TOKEN=$(echo "$USER_LOGIN_RESPONSE" | jq -r '.token')
            echo -e "${BLUE}User token: ${USER_TOKEN}${NC}"
        fi
    else
        echo -e "${RED}✗ User login failed${NC}"
    fi
    
    echo ""
}

test_cross_realm_access() {
    echo -e "${YELLOW}Testing cross-realm access...${NC}"
    
    if ! command_exists jq; then
        echo -e "${YELLOW}Skipping cross-realm tests (jq not installed)${NC}"
        return
    fi
    
    # Get tokens
    ADMIN_LOGIN_RESPONSE=$(curl -s -X POST "$ADMIN_API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "$ADMIN_CREDENTIALS")
    
    USER_LOGIN_RESPONSE=$(curl -s -X POST "$USER_API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "$USER_CREDENTIALS")
    
    ADMIN_TOKEN=$(echo "$ADMIN_LOGIN_RESPONSE" | jq -r '.session.token')
    USER_TOKEN=$(echo "$USER_LOGIN_RESPONSE" | jq -r '.token')
    
    # Test admin token on user endpoint
    echo -e "${YELLOW}Testing admin token on user endpoint...${NC}"
    ADMIN_ON_USER_RESPONSE=$(curl -s "$USER_API_URL/auth/me" \
        -H "Authorization: Bearer $ADMIN_TOKEN")
    
    echo "$ADMIN_ON_USER_RESPONSE"
    
    if [[ "$ADMIN_ON_USER_RESPONSE" == *"error"* || "$ADMIN_ON_USER_RESPONSE" == *"unauthorized"* ]]; then
        echo -e "${GREEN}✓ Admin token correctly rejected on user endpoint${NC}"
    else
        echo -e "${RED}✗ Admin token incorrectly accepted on user endpoint${NC}"
    fi
    
    # Test user token on admin endpoint
    echo -e "${YELLOW}Testing user token on admin endpoint...${NC}"
    USER_ON_ADMIN_RESPONSE=$(curl -s "$ADMIN_API_URL/auth/me" \
        -H "Authorization: Bearer $USER_TOKEN")
    
    echo "$USER_ON_ADMIN_RESPONSE"
    
    if [[ "$USER_ON_ADMIN_RESPONSE" == *"error"* || "$USER_ON_ADMIN_RESPONSE" == *"unauthorized"* ]]; then
        echo -e "${GREEN}✓ User token correctly rejected on admin endpoint${NC}"
    else
        echo -e "${RED}✗ User token incorrectly accepted on admin endpoint${NC}"
    fi
    
    echo ""
}

# Run tests
test_backend_health
test_admin_api_health
test_admin_login
test_user_login
test_cross_realm_access

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}     All tests completed!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
