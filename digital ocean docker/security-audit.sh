#!/bin/bash
set -e

echo "🔒 ViWorks Website Security Audit"
echo "================================="
echo "Date: $(date)"
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
        "PASS")
            echo -e "${GREEN}✅ PASS${NC}: $message"
            ;;
        "FAIL")
            echo -e "${RED}❌ FAIL${NC}: $message"
            ;;
        "WARN")
            echo -e "${YELLOW}⚠️  WARN${NC}: $message"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  INFO${NC}: $message"
            ;;
    esac
}

echo "📋 Phase 1: Container Security Analysis"
echo "======================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_status "FAIL" "Docker is not running"
    exit 1
fi

print_status "PASS" "Docker is running"

# Check running containers
echo ""
echo "🔍 Checking running containers..."
RUNNING_CONTAINERS=$(docker ps --format "{{.Names}}")
if [ -z "$RUNNING_CONTAINERS" ]; then
    print_status "WARN" "No containers are currently running"
else
    print_status "INFO" "Running containers:"
    echo "$RUNNING_CONTAINERS"
fi

# Check for containers with direct port exposure
echo ""
echo "🔍 Checking for direct port exposure..."
EXPOSED_PORTS=$(docker ps --format "table {{.Names}}\t{{.Ports}}" | grep -E "0\.0\.0\.0|:::" || true)
if [ -n "$EXPOSED_PORTS" ]; then
    print_status "FAIL" "Containers with direct port exposure found:"
    echo "$EXPOSED_PORTS"
else
    print_status "PASS" "No containers with direct port exposure"
fi

# Check network configuration
echo ""
echo "🔍 Checking network configuration..."
NETWORKS=$(docker network ls --format "{{.Name}}")
if echo "$NETWORKS" | grep -q "viworks-internal"; then
    print_status "PASS" "Internal network exists"
else
    print_status "FAIL" "Internal network missing"
fi

if echo "$NETWORKS" | grep -q "viworks-external"; then
    print_status "PASS" "External network exists"
else
    print_status "FAIL" "External network missing"
fi

# Check container network isolation
echo ""
echo "🔍 Checking container network isolation..."
if docker ps --format "{{.Names}}" | grep -q "postgres\|redis"; then
    for container in $(docker ps --format "{{.Names}}" | grep -E "postgres|redis"); do
        NETWORKS=$(docker inspect "$container" --format '{{range $net, $config := .NetworkSettings.Networks}}{{$net}} {{end}}')
        if echo "$NETWORKS" | grep -q "viworks-internal"; then
            print_status "PASS" "$container is on internal network"
        else
            print_status "FAIL" "$container is not properly isolated"
        fi
    done
fi

echo ""
echo "📋 Phase 2: SSL/TLS Security Analysis"
echo "===================================="

# Check if nginx is running
if docker ps --format "{{.Names}}" | grep -q "nginx"; then
    print_status "PASS" "Nginx container is running"
    
    # Check SSL certificates
    echo ""
    echo "🔍 Checking SSL certificates..."
    if docker exec viworks-standalone-nginx test -f /etc/letsencrypt/live/website-vw.neuratalent.com/fullchain.pem 2>/dev/null; then
        print_status "PASS" "SSL certificate exists for website"
    else
        print_status "FAIL" "SSL certificate missing for website"
    fi
    
    # Test HTTPS connectivity
    echo ""
    echo "🔍 Testing HTTPS connectivity..."
    if curl -s -I https://website-vw.neuratalent.com > /dev/null 2>&1; then
        print_status "PASS" "HTTPS is accessible"
    else
        print_status "FAIL" "HTTPS is not accessible"
    fi
else
    print_status "FAIL" "Nginx container is not running"
fi

echo ""
echo "📋 Phase 3: Environment Security Analysis"
echo "========================================"

# Check environment file security
if [ -f "env.production" ]; then
    print_status "INFO" "Environment file exists"
    
    # Check for hardcoded passwords
    if grep -q "password\|secret\|key" env.production; then
        print_status "WARN" "Environment file contains sensitive data"
        echo "   Consider using Docker secrets or external secret management"
    else
        print_status "PASS" "No obvious sensitive data in environment file"
    fi
    
    # Check file permissions
    PERMS=$(stat -c %a env.production 2>/dev/null || stat -f %Lp env.production 2>/dev/null)
    if [ "$PERMS" = "600" ]; then
        print_status "PASS" "Environment file has secure permissions (600)"
    else
        print_status "WARN" "Environment file permissions: $PERMS (should be 600)"
    fi
else
    print_status "FAIL" "Environment file missing"
fi

echo ""
echo "📋 Phase 4: Code Security Analysis"
echo "================================="

# Check for common security issues in code
echo ""
echo "🔍 Checking for common security vulnerabilities..."

# Check for hardcoded secrets in code
if find . -name "*.js" -o -name "*.ts" -o -name "*.tsx" -o -name "*.rs" | xargs grep -l "password\|secret\|key\|token" 2>/dev/null; then
    print_status "WARN" "Potential hardcoded secrets found in code files"
else
    print_status "PASS" "No obvious hardcoded secrets in code"
fi

# Check for SQL injection vulnerabilities
if find . -name "*.rs" | xargs grep -l "format!.*{}.*{}" 2>/dev/null; then
    print_status "WARN" "Potential SQL injection vulnerabilities (format! with user input)"
else
    print_status "PASS" "No obvious SQL injection patterns found"
fi

# Check for XSS vulnerabilities
if find . -name "*.tsx" -o -name "*.js" | xargs grep -l "dangerouslySetInnerHTML\|innerHTML" 2>/dev/null; then
    print_status "WARN" "Potential XSS vulnerabilities (dangerous HTML insertion)"
else
    print_status "PASS" "No obvious XSS patterns found"
fi

echo ""
echo "📋 Phase 5: Network Security Analysis"
echo "===================================="

# Check firewall rules
echo ""
echo "🔍 Checking firewall configuration..."
if command -v ufw > /dev/null 2>&1; then
    UFW_STATUS=$(ufw status 2>/dev/null || echo "inactive")
    if [ "$UFW_STATUS" != "inactive" ]; then
        print_status "PASS" "UFW firewall is active"
    else
        print_status "WARN" "UFW firewall is inactive"
    fi
elif command -v iptables > /dev/null 2>&1; then
    if iptables -L | grep -q "DROP\|REJECT"; then
        print_status "PASS" "IPTables rules are configured"
    else
        print_status "WARN" "No IPTables rules found"
    fi
else
    print_status "WARN" "No firewall detected"
fi

# Check open ports
echo ""
echo "🔍 Checking open ports..."
OPEN_PORTS=$(netstat -tlnp 2>/dev/null | grep LISTEN || ss -tlnp 2>/dev/null | grep LISTEN || true)
if echo "$OPEN_PORTS" | grep -q ":80\|:443"; then
    print_status "PASS" "Web ports (80/443) are open as expected"
else
    print_status "FAIL" "Web ports are not accessible"
fi

# Check for unnecessary open ports
UNNECESSARY_PORTS=$(echo "$OPEN_PORTS" | grep -E ":(22|80|443)" -v | grep -E ":[0-9]+" || true)
if [ -n "$UNNECESSARY_PORTS" ]; then
    print_status "WARN" "Potentially unnecessary open ports:"
    echo "$UNNECESSARY_PORTS"
else
    print_status "PASS" "No unnecessary ports open"
fi

echo ""
echo "📋 Phase 6: Container Health Analysis"
echo "===================================="

# Check container health
echo ""
echo "🔍 Checking container health..."
if docker ps --format "{{.Names}}\t{{.Status}}" | grep -q "unhealthy"; then
    print_status "FAIL" "Some containers are unhealthy"
    docker ps --format "{{.Names}}\t{{.Status}}" | grep "unhealthy"
else
    print_status "PASS" "All containers are healthy"
fi

# Check container resource usage
echo ""
echo "🔍 Checking container resource usage..."
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

echo ""
echo "📋 Phase 7: Security Headers Analysis"
echo "===================================="

# Test security headers
echo ""
echo "🔍 Testing security headers..."
if command -v curl > /dev/null 2>&1; then
    HEADERS=$(curl -s -I https://website-vw.neuratalent.com 2>/dev/null || true)
    
    if echo "$HEADERS" | grep -q "Strict-Transport-Security"; then
        print_status "PASS" "HSTS header is present"
    else
        print_status "FAIL" "HSTS header is missing"
    fi
    
    if echo "$HEADERS" | grep -q "X-Frame-Options"; then
        print_status "PASS" "X-Frame-Options header is present"
    else
        print_status "FAIL" "X-Frame-Options header is missing"
    fi
    
    if echo "$HEADERS" | grep -q "X-Content-Type-Options"; then
        print_status "PASS" "X-Content-Type-Options header is present"
    else
        print_status "FAIL" "X-Content-Type-Options header is missing"
    fi
    
    if echo "$HEADERS" | grep -q "X-XSS-Protection"; then
        print_status "PASS" "X-XSS-Protection header is present"
    else
        print_status "FAIL" "X-XSS-Protection header is missing"
    fi
else
    print_status "WARN" "curl not available for header testing"
fi

echo ""
echo "📋 Phase 8: Recommendations"
echo "==========================="

echo ""
print_status "INFO" "Security Recommendations:"
echo ""
echo "1. 🔐 Secrets Management:"
echo "   - Use Docker secrets or external secret management"
echo "   - Rotate JWT secrets regularly"
echo "   - Use strong, unique passwords for all services"
echo ""
echo "2. 🔒 Network Security:"
echo "   - Ensure firewall is properly configured"
echo "   - Monitor network traffic for anomalies"
echo "   - Consider implementing rate limiting"
echo ""
echo "3. 🛡️ Container Security:"
echo "   - Keep containers updated with latest security patches"
echo "   - Scan container images for vulnerabilities"
echo "   - Implement container runtime security monitoring"
echo ""
echo "4. 📊 Monitoring:"
echo "   - Set up log monitoring and alerting"
echo "   - Monitor for failed login attempts"
echo "   - Track unusual network activity"
echo ""
echo "5. 🔄 Maintenance:"
echo "   - Regularly update SSL certificates"
echo "   - Keep all dependencies updated"
echo "   - Perform regular security audits"
echo ""

echo "🔒 Security Audit Complete!"
echo "=========================="
echo "Date: $(date)"
echo ""
echo "For detailed security analysis, consider using:"
echo "- Docker Bench Security"
echo "- Trivy vulnerability scanner"
echo "- OWASP ZAP for web application testing"
echo "- SonarQube for code quality analysis"
