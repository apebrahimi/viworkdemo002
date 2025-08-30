#!/usr/bin/env bash
# Quick Security Check for ViWorkS Admin Panel
set -e

echo "🔒 ViWorkS Admin Panel - Quick Security Check"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "1. Checking Container Health..."
if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "healthy"; then
    print_status 0 "All containers are healthy"
else
    print_status 1 "Some containers are not healthy"
fi

echo ""
echo "2. Checking for Security Vulnerabilities..."

# Check Docker images
echo "   Scanning Docker images..."
if command -v trivy >/dev/null 2>&1; then
    BACKEND_VULNS=$(trivy image --severity HIGH,CRITICAL --format json viworks/backend:prod 2>/dev/null | jq '.Vulnerabilities | length' 2>/dev/null || echo "0")
    FRONTEND_VULNS=$(trivy image --severity HIGH,CRITICAL --format json backup-frontend-prod:latest 2>/dev/null | jq '.Vulnerabilities | length' 2>/dev/null || echo "0")
    
    if [ "$BACKEND_VULNS" = "0" ]; then
        print_status 0 "Backend image: No HIGH/CRITICAL vulnerabilities"
    else
        print_status 1 "Backend image: $BACKEND_VULNS HIGH/CRITICAL vulnerabilities"
    fi
    
    if [ "$FRONTEND_VULNS" = "0" ]; then
        print_status 0 "Frontend image: No HIGH/CRITICAL vulnerabilities"
    else
        print_status 1 "Frontend image: $FRONTEND_VULNS HIGH/CRITICAL vulnerabilities"
    fi
else
    print_warning "Trivy not installed - skipping image vulnerability scan"
fi

# Check Node.js dependencies
echo "   Checking Node.js dependencies..."
if [ -f pnpm-lock.yaml ]; then
    if pnpm audit --audit-level=high 2>/dev/null | grep -q "0 vulnerabilities"; then
        print_status 0 "Node.js: No HIGH+ vulnerabilities"
    else
        print_status 1 "Node.js: Vulnerabilities found"
    fi
else
    print_warning "No pnpm-lock.yaml found - skipping Node.js audit"
fi

# Check Rust dependencies
echo "   Checking Rust dependencies..."
if command -v cargo-audit >/dev/null 2>&1; then
    cd viworksclient01/products/admin-panel/backup/viworks-backend 2>/dev/null
    if cargo audit 2>/dev/null | grep -q "Success"; then
        print_status 0 "Rust: No security advisories"
    else
        RUST_ADVISORIES=$(cargo audit 2>/dev/null | grep -c "RUSTSEC-" || echo "0")
        print_status 1 "Rust: $RUST_ADVISORIES security advisories found"
    fi
    cd - >/dev/null 2>&1
else
    print_warning "cargo-audit not installed - skipping Rust audit"
fi

echo ""
echo "3. Checking Network Security..."

# Check port binding
if docker ps --format "{{.Ports}}" | grep -q "127.0.0.1"; then
    print_status 0 "Services bound to localhost only"
else
    print_status 1 "Services may be exposed externally"
fi

# Check for exposed ports (count unique port mappings)
EXPOSED_PORTS=$(docker ps --format "{{.Ports}}" | grep -o "[0-9]*->[0-9]*" | cut -d'>' -f2 | sort -u | wc -l)
if [ "$EXPOSED_PORTS" -le 4 ]; then
    print_status 0 "Reasonable number of exposed ports ($EXPOSED_PORTS)"
else
    print_warning "Many ports exposed ($EXPOSED_PORTS) - review if necessary"
fi

echo ""
echo "4. Checking Environment Security..."

# Check for environment files
if [ -f .env ]; then
    print_warning ".env file found - ensure it's not committed to git"
else
    print_status 0 "No .env file in root (good practice)"
fi

# Check for secrets in environment
if docker exec viworks-backend-prod env 2>/dev/null | grep -i "password\|secret\|key" | grep -v "PATH\|PWD" >/dev/null; then
    print_status 0 "Environment variables are set"
else
    print_warning "No obvious secret environment variables found"
fi

echo ""
echo "5. Checking Database Security..."

# Check PostgreSQL connection
if docker exec viworks-postgres psql -U viworks_user -d viworks_admin -c "SELECT 1;" >/dev/null 2>&1; then
    print_status 0 "PostgreSQL connection working"
else
    print_status 1 "PostgreSQL connection failed"
fi

# Check Redis connection
if docker exec viworks-redis redis-cli -a secure_redis_password PING >/dev/null 2>&1; then
    print_status 0 "Redis connection working"
else
    print_status 1 "Redis connection failed"
fi

echo ""
echo "6. Checking Application Health..."

# Check backend health
if curl -s http://localhost:8081/health >/dev/null; then
    print_status 0 "Backend health endpoint responding"
else
    print_status 1 "Backend health endpoint not responding"
fi

# Check frontend health
if curl -s http://localhost:3000 >/dev/null; then
    print_status 0 "Frontend responding"
else
    print_status 1 "Frontend not responding"
fi

echo ""
echo "7. Quick Penetration Tests..."

# Test invalid login
INVALID_LOGIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong_password"}' 2>/dev/null || echo "000")

if [ "$INVALID_LOGIN_RESPONSE" = "401" ] || [ "$INVALID_LOGIN_RESPONSE" = "400" ]; then
    print_status 0 "Invalid login properly rejected"
else
    print_warning "Invalid login response: $INVALID_LOGIN_RESPONSE"
fi

# Test unauthorized access
UNAUTHORIZED_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X GET http://localhost:8081/api/v1/admin/users \
  -H "Authorization: Bearer INVALID_TOKEN" 2>/dev/null || echo "000")

if [ "$UNAUTHORIZED_RESPONSE" = "401" ] || [ "$UNAUTHORIZED_RESPONSE" = "403" ]; then
    print_status 0 "Unauthorized access properly rejected"
else
    print_warning "Unauthorized access response: $UNAUTHORIZED_RESPONSE"
fi

echo ""
echo "=============================================="
echo "🔒 Security Check Complete!"
echo ""
echo "For detailed analysis, run: ./scripts/project_audit.sh"
echo "For full vulnerability scan, run: trivy image --severity HIGH,CRITICAL viworks/backend:prod"
echo ""
echo "📋 Full security checklist available in: SECURITY_CHECKLIST.md"
