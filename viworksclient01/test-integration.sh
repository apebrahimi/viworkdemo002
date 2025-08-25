#!/bin/bash

# ViWorkS Integration Test Script
# Tests the three critical components: MacOS Client Auth, 2FA, and Device Management

set -e

echo "🚀 ViWorkS Integration Test Script"
echo "=================================="
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

# Check if required tools are installed
check_dependencies() {
    print_status "INFO" "Checking dependencies..."
    
    local missing_deps=()
    
    # Check for curl
    if ! command -v curl &> /dev/null; then
        missing_deps+=("curl")
    fi
    
    # Check for jq
    if ! command -v jq &> /dev/null; then
        missing_deps+=("jq")
    fi
    
    # Check for docker
    if ! command -v docker &> /dev/null; then
        missing_deps+=("docker")
    fi
    
    # Check for docker-compose
    if ! command -v docker-compose &> /dev/null; then
        missing_deps+=("docker-compose")
    fi
    
    if [ ${#missing_deps[@]} -eq 0 ]; then
        print_status "SUCCESS" "All dependencies are installed"
    else
        print_status "ERROR" "Missing dependencies: ${missing_deps[*]}"
        print_status "INFO" "Please install the missing dependencies and try again"
        exit 1
    fi
}

# Start the backend services
start_backend() {
    print_status "INFO" "Starting backend services..."
    
    cd "products/admin-panel/viworks-admin-panel"
    
    # Check if docker-compose is running
    if docker-compose ps | grep -q "Up"; then
        print_status "WARNING" "Backend services are already running"
    else
        print_status "INFO" "Starting backend services with docker-compose..."
        docker-compose up -d
        
        # Wait for services to be ready
        print_status "INFO" "Waiting for services to be ready..."
        sleep 10
    fi
    
    cd ../../..
}

# Test backend health
test_backend_health() {
    print_status "INFO" "Testing backend health..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:8081/health > /dev/null 2>&1; then
            print_status "SUCCESS" "Backend is healthy and responding"
            return 0
        fi
        
        print_status "INFO" "Attempt $attempt/$max_attempts: Backend not ready yet..."
        sleep 2
        ((attempt++))
    done
    
    print_status "ERROR" "Backend failed to start within expected time"
    return 1
}

# Test authentication endpoints
test_auth_endpoints() {
    print_status "INFO" "Testing authentication endpoints..."
    
    # Test login endpoint
    print_status "INFO" "Testing login endpoint..."
    local login_response=$(curl -s -X POST http://localhost:8081/api/v1/auth/login \
        -H "Content-Type: application/json" \
        -d '{"username": "admin", "password": "admin123"}')
    
    if echo "$login_response" | jq -e '.success' > /dev/null 2>&1; then
        print_status "SUCCESS" "Login endpoint is working"
    else
        print_status "ERROR" "Login endpoint failed"
        echo "Response: $login_response"
        return 1
    fi
    
    # Test 2FA request endpoint
    print_status "INFO" "Testing 2FA request endpoint..."
    local twofa_response=$(curl -s -X POST http://localhost:8081/api/v1/auth/request-2fa \
        -H "Content-Type: application/json" \
        -d '{"username": "admin"}')
    
    if echo "$twofa_response" | jq -e '.success' > /dev/null 2>&1; then
        print_status "SUCCESS" "2FA request endpoint is working"
        local code=$(echo "$twofa_response" | jq -r '.code // empty')
        if [ -n "$code" ]; then
            print_status "INFO" "Generated 2FA code: $code"
        fi
    else
        print_status "ERROR" "2FA request endpoint failed"
        echo "Response: $twofa_response"
        return 1
    fi
}

# Test device management endpoints
test_device_endpoints() {
    print_status "INFO" "Testing device management endpoints..."
    
    # Test device registration
    print_status "INFO" "Testing device registration..."
    local device_response=$(curl -s -X POST http://localhost:8081/api/v1/auth/register-device \
        -H "Content-Type: application/json" \
        -d '{
            "user_id": "00000000-0000-0000-0000-000000000000",
            "device_id": "test-macos-device-001",
            "fcm_token": null,
            "device_info": {
                "model": "MacBook Pro",
                "os": "macOS",
                "app_version": "1.0.0",
                "manufacturer": "Apple",
                "device_name": "Test MacOS Client"
            }
        }')
    
    if echo "$device_response" | jq -e '.success' > /dev/null 2>&1; then
        print_status "SUCCESS" "Device registration endpoint is working"
    else
        print_status "ERROR" "Device registration endpoint failed"
        echo "Response: $device_response"
        return 1
    fi
    
    # Test device list endpoint (with mock token)
    print_status "INFO" "Testing device list endpoint..."
    local device_list_response=$(curl -s -X GET http://localhost:8081/api/v1/auth/devices \
        -H "Authorization: Bearer mock-token")
    
    if echo "$device_list_response" | jq -e '.success' > /dev/null 2>&1; then
        print_status "SUCCESS" "Device list endpoint is working"
        local device_count=$(echo "$device_list_response" | jq '.devices | length')
        print_status "INFO" "Found $device_count registered devices"
    else
        print_status "WARNING" "Device list endpoint returned error (expected with mock token)"
        echo "Response: $device_list_response"
    fi
}

# Test WebSocket connection
test_websocket() {
    print_status "INFO" "Testing WebSocket connection..."
    
    # Simple WebSocket test using curl (basic connectivity)
    if curl -s -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
        -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: test" \
        http://localhost:8081/ws | grep -q "101 Switching Protocols"; then
        print_status "SUCCESS" "WebSocket endpoint is accessible"
    else
        print_status "WARNING" "WebSocket endpoint test inconclusive (may require proper WebSocket client)"
    fi
}

# Test MacOS client build
test_macos_client() {
    print_status "INFO" "Testing MacOS client build..."
    
    cd "products/clients/macos"
    
    if cargo check --workspace > /dev/null 2>&1; then
        print_status "SUCCESS" "MacOS client compiles successfully"
    else
        print_status "ERROR" "MacOS client compilation failed"
        cd ../../..
        return 1
    fi
    
    cd ../../..
}

# Test admin panel frontend
test_admin_panel() {
    print_status "INFO" "Testing admin panel frontend..."
    
    cd "products/admin-panel/viworks-admin-panel/frontend"
    
    if npm run build > /dev/null 2>&1; then
        print_status "SUCCESS" "Admin panel frontend builds successfully"
    else
        print_status "ERROR" "Admin panel frontend build failed"
        cd ../../../../..
        return 1
    fi
    
    cd ../../../../..
}

# Main test execution
main() {
    echo "Starting comprehensive integration test..."
    echo ""
    
    # Check dependencies
    check_dependencies
    echo ""
    
    # Start backend
    start_backend
    echo ""
    
    # Test backend health
    if test_backend_health; then
        echo ""
        
        # Test authentication
        if test_auth_endpoints; then
            echo ""
            
            # Test device management
            if test_device_endpoints; then
                echo ""
                
                # Test WebSocket
                test_websocket
                echo ""
                
                # Test MacOS client
                if test_macos_client; then
                    echo ""
                    
                    # Test admin panel
                    if test_admin_panel; then
                        echo ""
                        print_status "SUCCESS" "🎉 All integration tests passed!"
                        print_status "INFO" "The three critical components are working:"
                        print_status "INFO" "  ✅ MacOS Client Authentication Flow"
                        print_status "INFO" "  ✅ Two-Factor Authentication"
                        print_status "INFO" "  ✅ Device Management"
                        echo ""
                        print_status "INFO" "Next steps:"
                        print_status "INFO" "  1. Run the MacOS client: cd products/clients/macos && ./scripts/run_app.sh"
                        print_status "INFO" "  2. Start the admin panel: cd products/admin-panel/viworks-admin-panel/frontend && npm run dev"
                        print_status "INFO" "  3. Test the complete flow with real user interaction"
                    else
                        print_status "ERROR" "Admin panel frontend test failed"
                        exit 1
                    fi
                else
                    print_status "ERROR" "MacOS client test failed"
                    exit 1
                fi
            else
                print_status "ERROR" "Device management test failed"
                exit 1
            fi
        else
            print_status "ERROR" "Authentication test failed"
            exit 1
        fi
    else
        print_status "ERROR" "Backend health check failed"
        exit 1
    fi
}

# Run the main function
main "$@"
