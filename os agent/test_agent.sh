#!/bin/bash

# ViWorkS Gateway Agent Test Script
# This script demonstrates how the backend should communicate with the agent

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
AGENT_URL="http://localhost:8443"
CORRELATION_ID=$(uuidgen)

# Function to make API calls
call_agent() {
    local endpoint="$1"
    local data="$2"
    
    if [ -n "$data" ]; then
        curl -s -X POST \
            -H "Content-Type: application/json" \
            -H "X-Client-Cert: mock-client-certificate" \
            -d "$data" \
            "$AGENT_URL$endpoint"
    else
        curl -s -X GET \
            -H "X-Client-Cert: mock-client-certificate" \
            "$AGENT_URL$endpoint"
    fi
}

# Test 1: Health Check
print_status "Testing health check..."
response=$(call_agent "/api/v1/health")
echo "Health check response: $response"

# Test 2: Get System Status
print_status "Testing system status..."
response=$(call_agent "/api/v1/status")
echo "System status response: $response"

# Test 3: Create Panel User
print_status "Testing panel user creation..."
panel_user_data=$(cat <<EOF
{
    "correlation_id": "$CORRELATION_ID",
    "command": "create_panel_user",
    "parameters": {
        "username": "testuser1",
        "password": "Test@123"
    },
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "signature": "test-signature"
}
EOF
)
response=$(call_agent "/api/v1/command" "$panel_user_data")
echo "Panel user creation response: $response"

# Test 4: Create VPN User
print_status "Testing VPN user creation..."
vpn_user_data=$(cat <<EOF
{
    "correlation_id": "$(uuidgen)",
    "command": "create_openvpn_user",
    "parameters": {
        "username": "testuser1",
        "userpass": "Pass@123",
        "source_ip": "10.20.30.11",
        "key": "Keys2338388373737",
        "hmac_key": "Hmac38737383838",
        "timeout": 3600
    },
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "signature": "test-signature"
}
EOF
)
response=$(call_agent "/api/v1/command" "$vpn_user_data")
echo "VPN user creation response: $response"

# Test 5: Get Monitoring Data
print_status "Testing monitoring data..."
monitoring_data=$(cat <<EOF
{
    "correlation_id": "$(uuidgen)",
    "command": "get_monitoring_data",
    "parameters": {},
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "signature": "test-signature"
}
EOF
)
response=$(call_agent "/api/v1/command" "$monitoring_data")
echo "Monitoring data response: $response"

# Test 6: List Users
print_status "Testing user listing..."
list_users_data=$(cat <<EOF
{
    "correlation_id": "$(uuidgen)",
    "command": "list_users",
    "parameters": {},
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "signature": "test-signature"
}
EOF
)
response=$(call_agent "/api/v1/command" "$list_users_data")
echo "List users response: $response"

# Test 7: Get System Health
print_status "Testing system health..."
system_health_data=$(cat <<EOF
{
    "correlation_id": "$(uuidgen)",
    "command": "get_system_health",
    "parameters": {},
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "signature": "test-signature"
}
EOF
)
response=$(call_agent "/api/v1/command" "$system_health_data")
echo "System health response: $response"

print_success "All tests completed!"
print_status "Check the responses above for any errors."
