#!/bin/bash

# Remote Sequential Deployment for ViWorks on DigitalOcean
# Usage: ./remote-deploy.sh [service|all] [--skip-validation]

set -e

# Configuration
DROPLET_IP="${DROPLET_IP:-64.227.46.188}"
DROPLET_USER="${DROPLET_USER:-root}"
SSH_KEY="${SSH_KEY:-~/.ssh/id_ed25519}"

SERVICE="${1:-all}"
SKIP_VALIDATION="$2"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️ $1${NC}"; }

# Function to run commands on remote server
remote_exec() {
    local cmd="$1"
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$DROPLET_USER@$DROPLET_IP" "$cmd"
}

# Function to copy script to remote server
copy_script() {
    local script_content="$1"
    local script_name="$2"
    
    echo "$script_content" | ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$DROPLET_USER@$DROPLET_IP" "cat > /tmp/$script_name && chmod +x /tmp/$script_name"
}

# Function to deploy specific service on remote
deploy_remote_service() {
    local service="$1"
    local validation_flag=""
    
    if [ "$SKIP_VALIDATION" == "--skip-validation" ]; then
        validation_flag="--no-validate"
    fi
    
    print_info "Deploying $service on remote server..."
    
    # Create the deployment script
    local script_content=$(cat << 'EOF'
#!/bin/bash
set -e

SERVICE="$1"
SKIP_VALIDATION="$2"

cd /root/viworks-repo
git fetch origin
git reset --hard origin/main
cd "digital ocean docker"

# Ensure networks exist
docker network create --driver bridge viworks-public 2>/dev/null || echo "Network viworks-public already exists"
docker network create --driver bridge --internal viworks-internal 2>/dev/null || echo "Network viworks-internal already exists"

# Function to wait for service health
wait_for_service() {
    local service=$1
    local health_cmd=$2
    local timeout=${3:-60}
    
    echo "⏳ Waiting for $service to be healthy..."
    for i in $(seq 1 $timeout); do
        if eval "$health_cmd" > /dev/null 2>&1; then
            echo "✅ $service is healthy"
            return 0
        fi
        echo "⏳ $service not ready yet... ($i/$timeout)"
        sleep 5
    done
    echo "❌ $service failed health check after $timeout attempts"
    return 1
}

# Deploy specific service
case $SERVICE in
    postgres)
        echo "🗄️ Deploying PostgreSQL..."
        docker-compose up -d postgres
        if [ "$SKIP_VALIDATION" != "--no-validate" ]; then
            wait_for_service "PostgreSQL" "docker-compose exec -T postgres pg_isready -U admin -d viworks" 30
        fi
        ;;
    
    redis)
        echo "🔴 Deploying Redis..."
        docker-compose up -d redis
        if [ "$SKIP_VALIDATION" != "--no-validate" ]; then
            wait_for_service "Redis" "docker-compose exec -T redis redis-cli ping | grep -q PONG" 15
        fi
        ;;
    
    backend)
        echo "🦀 Deploying Backend..."
        echo "🔨 Building backend..."
        docker-compose build backend
        docker-compose up -d backend
        if [ "$SKIP_VALIDATION" != "--no-validate" ]; then
            wait_for_service "Backend" "docker-compose exec -T backend curl -f -s http://localhost:8081/health" 90
            echo "🧪 Checking database connection..."
            sleep 5
            if docker-compose logs backend | grep -q "Database connected successfully"; then
                echo "✅ Database connection confirmed"
            else
                echo "⚠️ Database connection not confirmed in logs"
                docker-compose logs --tail=20 backend
            fi
        fi
        ;;
    
    frontend)
        echo "⚛️ Deploying Frontend..."
        echo "🔨 Building frontend..."
        docker-compose build frontend
        docker-compose up -d frontend
        if [ "$SKIP_VALIDATION" != "--no-validate" ]; then
            wait_for_service "Frontend" "docker-compose exec -T frontend curl -f -s http://localhost:3000" 60
        fi
        ;;
    
    website)
        echo "🌐 Deploying Website..."
        echo "🔨 Building website..."
        docker-compose build website
        docker-compose up -d website
        if [ "$SKIP_VALIDATION" != "--no-validate" ]; then
            wait_for_service "Website" "docker-compose exec -T website curl -f -s http://localhost:3000" 60
        fi
        ;;
    
    agent)
        echo "🤖 Deploying Agent..."
        echo "🔨 Building agent..."
        docker-compose build agent
        docker-compose up -d agent
        if [ "$SKIP_VALIDATION" != "--no-validate" ]; then
            sleep 10
            if docker-compose ps agent | grep -q "Up"; then
                echo "✅ Agent is running"
            else
                echo "❌ Agent failed to start"
                docker-compose logs agent
                exit 1
            fi
        fi
        ;;
    
    nginx)
        echo "🌐 Deploying Nginx..."
        docker-compose up -d nginx
        if [ "$SKIP_VALIDATION" != "--no-validate" ]; then
            wait_for_service "Nginx" "curl -f -s http://localhost/health" 30
        fi
        ;;
    
    *)
        echo "❌ Unknown service: $SERVICE"
        exit 1
        ;;
esac

echo "✅ $SERVICE deployment complete!"
echo "📊 Current status:"
docker-compose ps $SERVICE

# Show recent logs
echo "📝 Recent logs for $SERVICE:"
docker-compose logs --tail=10 $SERVICE
EOF
    )
    
    copy_script "$script_content" "deploy-single-remote.sh"
    
    # Execute the deployment
    if remote_exec "/tmp/deploy-single-remote.sh '$service' '$validation_flag'"; then
        print_status "$service deployed successfully on remote server!"
        return 0
    else
        print_error "$service deployment failed on remote server!"
        return 1
    fi
}

# Function for sequential deployment
sequential_deploy() {
    local services=("postgres" "redis" "backend" "frontend" "website" "agent" "nginx")
    local failed_services=()
    
    print_info "Starting Sequential Remote Deployment"
    echo "═══════════════════════════════════════"
    
    for service in "${services[@]}"; do
        echo ""
        print_info "Phase: Deploying $service"
        
        if ! deploy_remote_service "$service"; then
            failed_services+=("$service")
            
            echo ""
            read -p "❓ Continue with remaining services? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                break
            fi
        fi
        
        # Brief pause between services
        sleep 2
    done
    
    echo ""
    if [ ${#failed_services[@]} -eq 0 ]; then
        print_status "🎉 All services deployed successfully!"
        
        # Final validation
        print_info "Running final end-to-end validation..."
        if remote_exec "curl -f -s http://localhost/health > /dev/null 2>&1"; then
            print_status "✅ End-to-end validation passed!"
        else
            print_warning "⚠️ End-to-end validation failed"
        fi
    else
        print_error "⚠️ Some services failed to deploy:"
        for service in "${failed_services[@]}"; do
            echo "  - $service"
        done
    fi
}

# Function to show remote status
show_remote_status() {
    print_info "Current Remote Server Status:"
    echo "═══════════════════════════════"
    remote_exec "cd /root/viworks-repo/'digital ocean docker' && docker-compose ps"
}

# Check SSH connectivity
print_info "Testing SSH connection to $DROPLET_IP..."
if ! ssh -i "$SSH_KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$DROPLET_USER@$DROPLET_IP" "echo 'SSH connection successful'" > /dev/null 2>&1; then
    print_error "Cannot connect to remote server via SSH"
    print_info "Please check:"
    print_info "  - SSH key path: $SSH_KEY"
    print_info "  - Server IP: $DROPLET_IP"
    print_info "  - Username: $DROPLET_USER"
    exit 1
fi
print_status "SSH connection verified"

# Main logic
case "$SERVICE" in
    "all")
        sequential_deploy
        ;;
    "status")
        show_remote_status
        ;;
    "postgres"|"redis"|"backend"|"frontend"|"website"|"agent"|"nginx")
        deploy_remote_service "$SERVICE"
        ;;
    *)
        echo "Usage: $0 [service|all|status] [--skip-validation]"
        echo ""
        echo "Services: postgres, redis, backend, frontend, website, agent, nginx"
        echo "Examples:"
        echo "  $0 all                    # Deploy all services sequentially"
        echo "  $0 backend                # Deploy only backend"
        echo "  $0 frontend --skip-validation  # Deploy frontend without health checks"
        echo "  $0 status                 # Show current status"
        exit 1
        ;;
esac
