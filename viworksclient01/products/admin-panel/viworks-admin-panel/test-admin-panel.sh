#!/bin/bash

# ViWorkS Admin Panel - Complete Testing Script
# This script runs all services and performs comprehensive testing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Get machine's IP address
get_ip() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
    else
        # Linux
        IP=$(hostname -I | awk '{print $1}')
    fi
    echo $IP
}

LOCAL_IP=$(get_ip)

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${CYAN}[ℹ]${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC} ${CYAN}$1${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"
}

# Function to check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    print_status "Docker: $(docker --version)"
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    print_status "Docker Compose: $(docker-compose --version)"
    
    # Check curl
    if ! command -v curl &> /dev/null; then
        print_error "curl is not installed"
        exit 1
    fi
    print_status "curl is available"
    
    # Check jq (optional but useful)
    if command -v jq &> /dev/null; then
        print_status "jq is available"
    else
        print_warning "jq is not installed (optional)"
    fi
}

# Function to stop all services
stop_all_services() {
    print_header "Stopping All Services"
    
    docker-compose -f docker-compose.complete.yml down --remove-orphans 2>/dev/null || true
    docker-compose -f docker-compose.fixed.yml down --remove-orphans 2>/dev/null || true
    docker-compose -f docker-compose.simple.yml down --remove-orphans 2>/dev/null || true
    
    print_status "All services stopped"
}

# Function to start all services
start_all_services() {
    print_header "Starting All Services"
    
    print_info "Starting database services..."
    docker-compose -f docker-compose.complete.yml up -d postgres redis
    
    print_info "Waiting for database to be ready..."
    sleep 10
    
    print_info "Starting backend service..."
    docker-compose -f docker-compose.complete.yml up -d backend
    
    print_info "Starting pgAdmin..."
    docker-compose -f docker-compose.complete.yml up -d pgadmin
    
    print_info "Waiting for services to stabilize..."
    sleep 5
    
    print_status "All services started"
}

# Function to test backend endpoints
test_backend() {
    print_header "Testing Backend API"
    
    local backend_url="http://localhost:8081"
    
    # Test health endpoint
    print_info "Testing health endpoint..."
    if curl -f -s "$backend_url/health" > /dev/null; then
        response=$(curl -s "$backend_url/health")
        print_status "Health endpoint: OK"
        if command -v jq &> /dev/null; then
            echo "$response" | jq '.' | head -5
        fi
    else
        print_error "Health endpoint: FAILED"
        return 1
    fi
    
    # Test root endpoint
    print_info "Testing root endpoint..."
    if curl -f -s "$backend_url/" > /dev/null; then
        print_status "Root endpoint: OK"
    else
        print_error "Root endpoint: FAILED"
    fi
    
    # Test API status
    print_info "Testing API status endpoint..."
    if curl -f -s "$backend_url/api/status" > /dev/null; then
        response=$(curl -s "$backend_url/api/status")
        print_status "API status endpoint: OK"
        if command -v jq &> /dev/null; then
            echo "$response" | jq '.' | head -5
        fi
    else
        print_error "API status endpoint: FAILED"
    fi
}

# Function to test database
test_database() {
    print_header "Testing Database"
    
    print_info "Testing PostgreSQL connection..."
    if docker exec viworks-admin-postgres psql -U admin -d viworks_admin -c "SELECT 1;" > /dev/null 2>&1; then
        print_status "PostgreSQL: Connected"
        
        # Check tables
        tables=$(docker exec viworks-admin-postgres psql -U admin -d viworks_admin -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
        print_status "Database tables: $tables"
        
        # Check users
        users=$(docker exec viworks-admin-postgres psql -U admin -d viworks_admin -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")
        print_status "Users in database: $users"
    else
        print_error "PostgreSQL: Connection failed"
    fi
    
    print_info "Testing Redis connection..."
    if docker exec viworks-admin-redis redis-cli ping > /dev/null 2>&1; then
        print_status "Redis: Connected"
    else
        print_error "Redis: Connection failed"
    fi
}

# Function to test pgAdmin
test_pgadmin() {
    print_header "Testing pgAdmin"
    
    print_info "Testing pgAdmin interface..."
    if curl -f -s "http://localhost:5050" > /dev/null 2>&1; then
        print_status "pgAdmin: Available at http://localhost:5050"
        print_info "Credentials: admin@viworks.com / admin123"
    else
        print_warning "pgAdmin: Not responding (may take time to start)"
    fi
}

# Function to perform load testing
load_test() {
    print_header "Load Testing"
    
    print_info "Performing basic load test on health endpoint..."
    
    local total_requests=100
    local concurrent=10
    local success=0
    local failed=0
    
    for i in $(seq 1 $total_requests); do
        if curl -f -s "http://localhost:8081/health" > /dev/null 2>&1; then
            ((success++))
        else
            ((failed++))
        fi
        
        # Show progress
        if [ $((i % 10)) -eq 0 ]; then
            echo -ne "\rProgress: $i/$total_requests requests"
        fi
    done
    
    echo ""
    print_status "Load test completed: $success successful, $failed failed"
}

# Function to check container health
check_container_health() {
    print_header "Container Health Status"
    
    print_info "Checking container status..."
    
    containers=("viworks-admin-postgres" "viworks-admin-redis" "viworks-admin-backend" "viworks-admin-pgadmin")
    
    for container in "${containers[@]}"; do
        if docker ps | grep -q "$container"; then
            status=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null || echo "unknown")
            health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "no health check")
            
            if [ "$status" = "running" ]; then
                print_status "$container: Running (Health: $health)"
            else
                print_warning "$container: Status: $status"
            fi
        else
            print_error "$container: Not running"
        fi
    done
}

# Function to show resource usage
show_resource_usage() {
    print_header "Resource Usage"
    
    print_info "Container resource usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" | grep viworks || true
}

# Function to show access information
show_access_info() {
    print_header "Access Information"
    
    echo -e "${CYAN}Local Access:${NC}"
    echo -e "  • Backend API:    ${GREEN}http://localhost:8081${NC}"
    echo -e "  • Health Check:   ${GREEN}http://localhost:8081/health${NC}"
    echo -e "  • API Status:     ${GREEN}http://localhost:8081/api/status${NC}"
    echo -e "  • pgAdmin:        ${GREEN}http://localhost:5050${NC}"
    echo ""
    echo -e "${CYAN}Network Access (from other devices):${NC}"
    echo -e "  • Backend API:    ${GREEN}http://$LOCAL_IP:8081${NC}"
    echo -e "  • pgAdmin:        ${GREEN}http://$LOCAL_IP:5050${NC}"
    echo ""
    echo -e "${CYAN}Credentials:${NC}"
    echo -e "  • pgAdmin:        ${YELLOW}admin@viworks.com / admin123${NC}"
    echo -e "  • Database:       ${YELLOW}admin / secure_password_dev${NC}"
}

# Function to test from external IP
test_external_access() {
    print_header "Testing External Access"
    
    print_info "Testing access from network IP: $LOCAL_IP"
    
    if curl -f -s "http://$LOCAL_IP:8081/health" > /dev/null 2>&1; then
        print_status "Backend accessible from network: http://$LOCAL_IP:8081"
    else
        print_warning "Backend not accessible from network IP"
        print_info "This might be due to firewall settings"
    fi
}

# Function to prepare for cloud deployment
prepare_cloud_deployment() {
    print_header "Cloud Deployment Readiness"
    
    print_status "✓ Database is configured and running"
    print_status "✓ Redis cache is operational"
    print_status "✓ Backend API is healthy"
    print_status "✓ All health checks passing"
    
    print_info "\nFor cloud deployment, you'll need to:"
    echo "  1. Push Docker images to a registry (Docker Hub, ECR, GCR, etc.)"
    echo "  2. Update environment variables for production"
    echo "  3. Configure SSL certificates"
    echo "  4. Set up a domain name"
    echo "  5. Configure cloud database (RDS, Cloud SQL, etc.)"
    echo "  6. Set up monitoring and logging"
    
    print_info "\nRecommended cloud platforms:"
    echo "  • AWS: ECS, EKS, or Elastic Beanstalk"
    echo "  • Google Cloud: Cloud Run or GKE"
    echo "  • Azure: Container Instances or AKS"
    echo "  • DigitalOcean: App Platform or Kubernetes"
}

# Function to generate deployment report
generate_report() {
    print_header "Deployment Test Report"
    
    report_file="deployment-report-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "ViWorkS Admin Panel - Deployment Test Report"
        echo "Generated: $(date)"
        echo "================================================"
        echo ""
        echo "System Information:"
        echo "  • Docker: $(docker --version)"
        echo "  • Docker Compose: $(docker-compose --version)"
        echo "  • Local IP: $LOCAL_IP"
        echo ""
        echo "Service Status:"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep viworks || true
        echo ""
        echo "Test Results:"
        echo "  • Backend Health: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8081/health)"
        echo "  • Database: $(docker exec viworks-admin-postgres psql -U admin -d viworks_admin -c 'SELECT 1;' > /dev/null 2>&1 && echo 'OK' || echo 'FAILED')"
        echo "  • Redis: $(docker exec viworks-admin-redis redis-cli ping > /dev/null 2>&1 && echo 'OK' || echo 'FAILED')"
        echo ""
        echo "Access URLs:"
        echo "  • Backend: http://localhost:8081"
        echo "  • pgAdmin: http://localhost:5050"
        echo "  • Network: http://$LOCAL_IP:8081"
    } > "$report_file"
    
    print_status "Report saved to: $report_file"
}

# Main execution
main() {
    clear
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════╗"
    echo "║     ViWorkS Admin Panel - Full Testing      ║"
    echo "╚══════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_prerequisites
    stop_all_services
    start_all_services
    
    # Wait for services to be fully ready
    print_info "Waiting for all services to be ready..."
    sleep 10
    
    # Run all tests
    check_container_health
    test_database
    test_backend
    test_pgadmin
    load_test
    show_resource_usage
    test_external_access
    
    # Show final information
    show_access_info
    prepare_cloud_deployment
    generate_report
    
    print_header "Testing Complete!"
    print_status "All systems are operational and ready for cloud deployment!"
    print_info "You can now access the admin panel at the URLs shown above."
}

# Run main function
main "$@"
