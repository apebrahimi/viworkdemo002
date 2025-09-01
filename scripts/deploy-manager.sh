#!/bin/bash

# ViWorks Deployment Manager
# Provides interactive deployment with rollback capabilities

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")/digital ocean docker"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# Services in deployment order
SERVICES=("postgres" "redis" "backend" "frontend" "website" "agent" "nginx")

# Function to check if service is running
is_service_running() {
    local service=$1
    cd "$DOCKER_DIR"
    if docker-compose ps $service | grep -q "Up"; then
        return 0
    else
        return 1
    fi
}

# Function to get service status
get_service_status() {
    local service=$1
    cd "$DOCKER_DIR"
    if is_service_running "$service"; then
        echo "🟢 Running"
    else
        echo "🔴 Stopped"
    fi
}

# Function to show current status
show_status() {
    print_info "Current ViWorks Stack Status:"
    echo "═══════════════════════════════"
    cd "$DOCKER_DIR"
    for service in "${SERVICES[@]}"; do
        status=$(get_service_status "$service")
        printf "%-12s: %s\n" "$service" "$status"
    done
    echo ""
}

# Function to deploy single service with confirmation
deploy_service() {
    local service=$1
    
    print_info "Deploying: $service"
    
    # Show current status
    current_status=$(get_service_status "$service")
    echo "Current status: $current_status"
    
    # Ask for confirmation
    read -p "🤔 Deploy $service? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Skipping $service"
        return 0
    fi
    
    # Save current state for rollback
    cd "$DOCKER_DIR"
    local was_running=false
    if is_service_running "$service"; then
        was_running=true
        print_info "Saving current state of $service for potential rollback..."
    fi
    
    # Deploy the service
    print_info "Starting deployment of $service..."
    if "$SCRIPT_DIR/deploy-single-service.sh" "$service"; then
        print_status "$service deployed successfully!"
        
        # Validate deployment
        print_info "Validating $service..."
        sleep 5
        if is_service_running "$service"; then
            print_status "$service is running correctly!"
        else
            print_error "$service failed to start properly!"
            
            # Offer rollback
            if [ "$was_running" = true ]; then
                read -p "🔄 Rollback $service? (Y/n): " -n 1 -r
                echo
                if [[ ! $REPLY =~ ^[Nn]$ ]]; then
                    print_info "Rolling back $service..."
                    docker-compose stop "$service"
                    docker-compose up -d "$service"
                    print_warning "$service rolled back"
                fi
            fi
            return 1
        fi
    else
        print_error "$service deployment failed!"
        return 1
    fi
    
    return 0
}

# Function for sequential deployment
sequential_deploy() {
    print_info "Starting Sequential ViWorks Deployment"
    echo "════════════════════════════════════════"
    
    local failed_services=()
    
    for service in "${SERVICES[@]}"; do
        echo ""
        if ! deploy_service "$service"; then
            failed_services+=("$service")
            
            read -p "❓ Continue with remaining services? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                break
            fi
        fi
        
        # Show updated status
        show_status
    done
    
    echo ""
    if [ ${#failed_services[@]} -eq 0 ]; then
        print_status "🎉 All services deployed successfully!"
        
        # Final validation
        print_info "Running final validation..."
        cd "$DOCKER_DIR"
        if curl -f -s http://localhost/health > /dev/null 2>&1; then
            print_status "✅ End-to-end validation passed!"
        else
            print_warning "⚠️ End-to-end validation failed - check nginx/backend connectivity"
        fi
    else
        print_error "⚠️ Some services failed to deploy:"
        for service in "${failed_services[@]}"; do
            echo "  - $service"
        done
    fi
}

# Function for selective deployment
selective_deploy() {
    while true; do
        echo ""
        print_info "Selective Deployment Mode"
        echo "═════════════════════════"
        show_status
        
        echo "Available services:"
        for i in "${!SERVICES[@]}"; do
            printf "%d) %s\n" $((i+1)) "${SERVICES[i]}"
        done
        echo "0) Exit"
        
        read -p "Select service to deploy (0-${#SERVICES[@]}): " choice
        
        if [[ "$choice" == "0" ]]; then
            break
        elif [[ "$choice" =~ ^[1-${#SERVICES[@]}]$ ]]; then
            service="${SERVICES[$((choice-1))]}"
            deploy_service "$service"
        else
            print_error "Invalid choice: $choice"
        fi
    done
}

# Function to stop all services
stop_all() {
    print_warning "Stopping all ViWorks services..."
    cd "$DOCKER_DIR"
    docker-compose down
    print_status "All services stopped"
}

# Function to restart all services
restart_all() {
    print_info "Restarting all ViWorks services..."
    cd "$DOCKER_DIR"
    docker-compose restart
    print_status "All services restarted"
}

# Main menu
main_menu() {
    while true; do
        echo ""
        echo "🚀 ViWorks Deployment Manager"
        echo "═══════════════════════════════"
        show_status
        
        echo "Options:"
        echo "1) Sequential Deployment (All Services)"
        echo "2) Selective Deployment (Choose Services)"
        echo "3) Show Detailed Status"
        echo "4) Stop All Services"
        echo "5) Restart All Services"
        echo "6) View Logs"
        echo "0) Exit"
        
        read -p "Choose an option (0-6): " choice
        
        case $choice in
            1)
                sequential_deploy
                ;;
            2)
                selective_deploy
                ;;
            3)
                cd "$DOCKER_DIR"
                docker-compose ps
                ;;
            4)
                stop_all
                ;;
            5)
                restart_all
                ;;
            6)
                cd "$DOCKER_DIR"
                echo "Recent logs from all services:"
                docker-compose logs --tail=10
                ;;
            0)
                echo "👋 Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid choice: $choice"
                ;;
        esac
    done
}

# Check if running from correct directory
if [ ! -d "$DOCKER_DIR" ]; then
    print_error "Docker directory not found: $DOCKER_DIR"
    print_info "Please run this script from the project root"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running or not accessible"
    exit 1
fi

# Start main menu
main_menu
