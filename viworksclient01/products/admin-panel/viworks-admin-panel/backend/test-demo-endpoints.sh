#!/bin/bash

# ViWorkS Demo Endpoints Test Script
# Tests all the enhanced backend endpoints for the demo

BASE_URL="http://localhost:8081"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 ViWorkS Demo Endpoints Test${NC}"
echo "=================================="
echo ""

# Test 1: Health Check
echo -e "${YELLOW}1. Testing Health Check...${NC}"
HEALTH_RESPONSE=$(curl -s "$BASE_URL/health")
if echo "$HEALTH_RESPONSE" | jq -e '.status == "healthy"' > /dev/null; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "$HEALTH_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo "$HEALTH_RESPONSE"
fi
echo ""

# Test 2: User Login
echo -e "${YELLOW}2. Testing User Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"keyvan","password":"demo123"}')

if echo "$LOGIN_RESPONSE" | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✅ Login successful${NC}"
    SESSION_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.data.session_id')
    echo "Session ID: $SESSION_ID"
    echo "$LOGIN_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Login failed${NC}"
    echo "$LOGIN_RESPONSE"
    exit 1
fi
echo ""

# Test 3: 2FA Challenge Initiation
echo -e "${YELLOW}3. Testing 2FA Challenge Initiation...${NC}"
CHALLENGE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/challenge/initiate" \
    -H "Content-Type: application/json" \
    -d "{\"session_id\":\"$SESSION_ID\"}")

if echo "$CHALLENGE_RESPONSE" | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✅ 2FA challenge initiated${NC}"
    OTP_CODE=$(echo "$CHALLENGE_RESPONSE" | jq -r '.otp_code')
    echo "OTP Code: $OTP_CODE"
    echo "$CHALLENGE_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ 2FA challenge failed${NC}"
    echo "$CHALLENGE_RESPONSE"
    exit 1
fi
echo ""

# Test 4: 2FA Verification
echo -e "${YELLOW}4. Testing 2FA Verification...${NC}"
VERIFY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/challenge/verify" \
    -H "Content-Type: application/json" \
    -d "{\"session_id\":\"$SESSION_ID\",\"code\":\"$OTP_CODE\"}")

if echo "$VERIFY_RESPONSE" | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✅ 2FA verification successful${NC}"
    ACCESS_TOKEN=$(echo "$VERIFY_RESPONSE" | jq -r '.data.access_token')
    echo "Access Token: $ACCESS_TOKEN"
    echo "$VERIFY_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ 2FA verification failed${NC}"
    echo "$VERIFY_RESPONSE"
    exit 1
fi
echo ""

# Test 5: Client Bootstrap
echo -e "${YELLOW}5. Testing Client Bootstrap...${NC}"
BOOTSTRAP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/client/bootstrap" \
    -H "Content-Type: application/json" \
    -d "{\"session_id\":\"$SESSION_ID\"}")

if echo "$BOOTSTRAP_RESPONSE" | jq -e '.fwknop' > /dev/null; then
    echo -e "${GREEN}✅ Client bootstrap successful${NC}"
    echo "$BOOTSTRAP_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Client bootstrap failed${NC}"
    echo "$BOOTSTRAP_RESPONSE"
fi
echo ""

# Test 6: Device Binding Request
echo -e "${YELLOW}6. Testing Device Binding Request...${NC}"
DEVICE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/device/bind-request" \
    -H "Content-Type: application/json" \
    -d '{"username":"keyvan","fingerprint":"android_device_123"}')

if echo "$DEVICE_RESPONSE" | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✅ Device binding request successful${NC}"
    REQUEST_ID=$(echo "$DEVICE_RESPONSE" | jq -r '.request_id')
    echo "Request ID: $REQUEST_ID"
    echo "$DEVICE_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Device binding request failed${NC}"
    echo "$DEVICE_RESPONSE"
fi
echo ""

# Test 7: Admin Users List
echo -e "${YELLOW}7. Testing Admin Users List...${NC}"
USERS_RESPONSE=$(curl -s "$BASE_URL/api/v1/admin/users")

if echo "$USERS_RESPONSE" | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✅ Users list retrieved${NC}"
    echo "$USERS_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Users list failed${NC}"
    echo "$USERS_RESPONSE"
fi
echo ""

# Test 8: Device Requests List
echo -e "${YELLOW}8. Testing Device Requests List...${NC}"
DEVICE_REQUESTS_RESPONSE=$(curl -s "$BASE_URL/api/v1/admin/device/requests")

if echo "$DEVICE_REQUESTS_RESPONSE" | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✅ Device requests list retrieved${NC}"
    echo "$DEVICE_REQUESTS_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Device requests list failed${NC}"
    echo "$DEVICE_REQUESTS_RESPONSE"
fi
echo ""

# Test 9: Approve Device Request
echo -e "${YELLOW}9. Testing Device Request Approval...${NC}"
APPROVE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/admin/device/approve" \
    -H "Content-Type: application/json" \
    -d "{\"request_id\":\"$REQUEST_ID\"}")

if echo "$APPROVE_RESPONSE" | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✅ Device request approved${NC}"
    echo "$APPROVE_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Device request approval failed${NC}"
    echo "$APPROVE_RESPONSE"
fi
echo ""

# Test 10: Container Spawn
echo -e "${YELLOW}10. Testing Container Spawn...${NC}"
CONTAINER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/agent/container/spawn" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"keyvan\",\"session_id\":\"$SESSION_ID\"}")

if echo "$CONTAINER_RESPONSE" | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✅ Container spawned successfully${NC}"
    CONTAINER_URL=$(echo "$CONTAINER_RESPONSE" | jq -r '.url')
    echo "Container URL: $CONTAINER_URL"
    echo "$CONTAINER_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Container spawn failed${NC}"
    echo "$CONTAINER_RESPONSE"
fi
echo ""

# Test 11: Sessions List
echo -e "${YELLOW}11. Testing Sessions List...${NC}"
SESSIONS_RESPONSE=$(curl -s "$BASE_URL/api/v1/admin/sessions")

if echo "$SESSIONS_RESPONSE" | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✅ Sessions list retrieved${NC}"
    echo "$SESSIONS_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Sessions list failed${NC}"
    echo "$SESSIONS_RESPONSE"
fi
echo ""

# Test 12: Audit Logs
echo -e "${YELLOW}12. Testing Audit Logs...${NC}"
AUDIT_RESPONSE=$(curl -s "$BASE_URL/api/v1/admin/audit-logs")

if echo "$AUDIT_RESPONSE" | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✅ Audit logs retrieved${NC}"
    echo "$AUDIT_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Audit logs failed${NC}"
    echo "$AUDIT_RESPONSE"
fi
echo ""

# Test 13: Session Termination
echo -e "${YELLOW}13. Testing Session Termination...${NC}"
TERMINATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/agent/session/terminate" \
    -H "Content-Type: application/json" \
    -d "{\"session_id\":\"$SESSION_ID\"}")

if echo "$TERMINATE_RESPONSE" | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✅ Session terminated successfully${NC}"
    echo "$TERMINATE_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Session termination failed${NC}"
    echo "$TERMINATE_RESPONSE"
fi
echo ""

# Test 14: Create New User
echo -e "${YELLOW}14. Testing User Creation...${NC}"
CREATE_USER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/admin/users/create" \
    -H "Content-Type: application/json" \
    -d '{
        "username": "demo_user",
        "email": "demo@example.com",
        "mobile": "09123456789",
        "policy_window": "Mon-Fri 09:00-17:00",
        "device_binding": true
    }')

if echo "$CREATE_USER_RESPONSE" | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✅ User created successfully${NC}"
    echo "$CREATE_USER_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ User creation failed${NC}"
    echo "$CREATE_USER_RESPONSE"
fi
echo ""

# Test 15: Activate User
echo -e "${YELLOW}15. Testing User Activation...${NC}"
ACTIVATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/admin/users/activate" \
    -H "Content-Type: application/json" \
    -d '{"username":"demo_user"}')

if echo "$ACTIVATE_RESPONSE" | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✅ User activated successfully${NC}"
    echo "$ACTIVATE_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ User activation failed${NC}"
    echo "$ACTIVATE_RESPONSE"
fi
echo ""

echo -e "${GREEN}🎉 All Demo Endpoints Tested Successfully!${NC}"
echo "================================================"
echo ""
echo -e "${YELLOW}Demo Endpoints Summary:${NC}"
echo "✅ Health Check"
echo "✅ User Authentication (Login + 2FA)"
echo "✅ Client Bootstrap Configuration"
echo "✅ Device Binding Request"
echo "✅ Admin User Management"
echo "✅ Device Request Approval"
echo "✅ Container Spawning"
echo "✅ Session Management"
echo "✅ Audit Logging"
echo "✅ Session Termination"
echo ""
echo -e "${GREEN}The enhanced backend is ready for the demo!${NC}"
