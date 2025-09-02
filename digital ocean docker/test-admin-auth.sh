#!/bin/bash

# Test script for admin authentication
# This verifies the new simple auth works without breaking client auth

echo "========================================="
echo "Admin Authentication Test Script"
echo "========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test configuration
ADMIN_URL="http://localhost:3000"
API_URL="http://localhost:8081"

echo -e "\n${YELLOW}1. Testing Admin Login Endpoint${NC}"
echo "Testing POST /api/admin/login..."

# Test admin login with correct credentials
ADMIN_LOGIN_RESPONSE=$(curl -s -X POST ${ADMIN_URL}/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"changeme123"}' \
  -c /tmp/admin-cookies.txt \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$ADMIN_LOGIN_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
RESPONSE_BODY=$(echo "$ADMIN_LOGIN_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" = "200" ]; then
  echo -e "${GREEN}✓ Admin login successful${NC}"
  echo "Response: $RESPONSE_BODY"
else
  echo -e "${RED}✗ Admin login failed (HTTP $HTTP_STATUS)${NC}"
  echo "Response: $RESPONSE_BODY"
fi

echo -e "\n${YELLOW}2. Testing Admin Session Check${NC}"
echo "Testing GET /api/admin/me..."

# Test session check with cookie
ME_RESPONSE=$(curl -s -X GET ${ADMIN_URL}/api/admin/me \
  -b /tmp/admin-cookies.txt \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$ME_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
RESPONSE_BODY=$(echo "$ME_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" = "200" ]; then
  echo -e "${GREEN}✓ Admin session valid${NC}"
  echo "Response: $RESPONSE_BODY"
else
  echo -e "${RED}✗ Admin session check failed (HTTP $HTTP_STATUS)${NC}"
  echo "Response: $RESPONSE_BODY"
fi

echo -e "\n${YELLOW}3. Testing Admin Logout${NC}"
echo "Testing POST /api/admin/logout..."

# Test logout
LOGOUT_RESPONSE=$(curl -s -X POST ${ADMIN_URL}/api/admin/logout \
  -b /tmp/admin-cookies.txt \
  -c /tmp/admin-cookies.txt \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$LOGOUT_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
RESPONSE_BODY=$(echo "$LOGOUT_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" = "200" ]; then
  echo -e "${GREEN}✓ Admin logout successful${NC}"
  echo "Response: $RESPONSE_BODY"
else
  echo -e "${RED}✗ Admin logout failed (HTTP $HTTP_STATUS)${NC}"
  echo "Response: $RESPONSE_BODY"
fi

echo -e "\n${YELLOW}4. Verifying Session Cleared${NC}"
echo "Testing GET /api/admin/me after logout..."

# Verify session is cleared
ME_AFTER_LOGOUT=$(curl -s -X GET ${ADMIN_URL}/api/admin/me \
  -b /tmp/admin-cookies.txt \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$ME_AFTER_LOGOUT" | grep "HTTP_STATUS" | cut -d: -f2)

if [ "$HTTP_STATUS" = "401" ]; then
  echo -e "${GREEN}✓ Session properly cleared${NC}"
else
  echo -e "${RED}✗ Session not cleared (HTTP $HTTP_STATUS)${NC}"
fi

echo -e "\n${YELLOW}5. Testing Client Auth API (Should Still Work)${NC}"
echo "Testing backend /api/v1/auth/login..."

# Test that client auth API still works
CLIENT_AUTH_RESPONSE=$(curl -s -X POST ${API_URL}/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}' \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$CLIENT_AUTH_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)

if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "401" ]; then
  echo -e "${GREEN}✓ Client auth API responding normally${NC}"
  echo "  (Returns $HTTP_STATUS - endpoint is working)"
else
  echo -e "${RED}✗ Client auth API not responding (HTTP $HTTP_STATUS)${NC}"
fi

echo -e "\n${YELLOW}6. Testing Invalid Admin Credentials${NC}"
echo "Testing with wrong password..."

# Test with wrong credentials
INVALID_LOGIN=$(curl -s -X POST ${ADMIN_URL}/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrongpassword"}' \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$INVALID_LOGIN" | grep "HTTP_STATUS" | cut -d: -f2)

if [ "$HTTP_STATUS" = "401" ]; then
  echo -e "${GREEN}✓ Invalid credentials properly rejected${NC}"
else
  echo -e "${RED}✗ Invalid credentials not rejected (HTTP $HTTP_STATUS)${NC}"
fi

# Cleanup
rm -f /tmp/admin-cookies.txt

echo -e "\n========================================="
echo -e "${GREEN}Admin Authentication Test Complete!${NC}"
echo "========================================="
echo ""
echo "Summary:"
echo "- Admin login/logout working: Check above results"
echo "- Client auth API unchanged: Still at /api/v1/auth/*"
echo "- Session management: Using HttpOnly cookies"
echo ""
echo "Next steps:"
echo "1. Set production credentials in env.production"
echo "2. Build Docker image: docker-compose build frontend"
echo "3. Deploy: docker-compose up -d"
echo "4. Test on https://admin-viworks.neuratalent.com"
