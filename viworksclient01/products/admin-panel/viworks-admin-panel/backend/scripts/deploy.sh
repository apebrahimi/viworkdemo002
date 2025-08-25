#!/bin/bash

# ViWorkS Admin Panel Backend Deployment Script
# This script handles the complete deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    local missing_deps=()
    
    if ! command_exists docker; then
        missing_deps+=("docker")
    fi
    
    if ! command_exists docker-compose; then
        missing_deps+=("docker-compose")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        print_error "Please install the missing dependencies and try again."
        exit 1
    fi
    
    print_success "All prerequisites are satisfied"
}

# Function to validate environment
validate_environment() {
    print_status "Validating environment..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        cp .env.example .env 2>/dev/null || {
            print_error "Could not create .env file. Please create it manually."
            exit 1
        }
    fi
    
    # Check if required environment variables are set
    source .env
    
    local required_vars=("DATABASE_URL" "JWT_SECRET")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables: ${missing_vars[*]}"
        print_error "Please set these variables in your .env file."
        exit 1
    fi
    
    print_success "Environment validation passed"
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p logs
    mkdir -p backups
    mkdir -p ssl
    mkdir -p monitoring
    
    print_success "Directories created"
}

# Function to build and start services
deploy_services() {
    local environment=${1:-development}
    
    print_status "Deploying services in $environment mode..."
    
    if [ "$environment" = "production" ]; then
        print_status "Starting production deployment..."
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
    else
        print_status "Starting development deployment..."
        docker-compose up -d --build
    fi
    
    print_success "Services deployed successfully"
}

# Function to wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be healthy..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose ps | grep -q "healthy"; then
            print_success "All services are healthy"
            return 0
        fi
        
        print_status "Waiting for services to be healthy... (attempt $attempt/$max_attempts)"
        sleep 10
        ((attempt++))
    done
    
    print_error "Services failed to become healthy within the expected time"
    docker-compose logs
    exit 1
}

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # Wait a bit for the database to be ready
    sleep 5
    
    # Run migrations using sqlx-cli in the backend container
    docker-compose exec -T backend sqlx migrate run || {
        print_error "Failed to run database migrations"
        exit 1
    }
    
    print_success "Database migrations completed"
}

# Function to seed initial data
seed_data() {
    print_status "Seeding initial data..."
    
    # Check if seed data file exists
    if [ -f "migrations/seed_data.sql" ]; then
        docker-compose exec -T postgres psql -U postgres -d viworks_admin -f /docker-entrypoint-initdb.d/seed_data.sql || {
            print_warning "Failed to seed data (this might be expected if data already exists)"
        }
        print_success "Initial data seeded"
    else
        print_warning "Seed data file not found, skipping data seeding"
    fi
}

# Function to check service status
check_status() {
    print_status "Checking service status..."
    
    docker-compose ps
    
    print_status "Service URLs:"
    echo "  - API Health Check: http://localhost:8080/api/v1/health"
    echo "  - API Base URL: http://localhost:8080/api/v1"
    echo "  - Database: localhost:5432"
    echo "  - Redis: localhost:6379"
}

# Function to show logs
show_logs() {
    print_status "Showing recent logs..."
    docker-compose logs --tail=50
}

# Function to stop services
stop_services() {
    print_status "Stopping services..."
    docker-compose down
    print_success "Services stopped"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up..."
    docker-compose down -v
    print_success "Cleanup completed"
}

# Function to show help
show_help() {
    echo "ViWorkS Admin Panel Backend Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  deploy [env]     Deploy the application (default: development)"
    echo "  start           Start existing services"
    echo "  stop            Stop services"
    echo "  restart         Restart services"
    echo "  status          Show service status"
    echo "  logs            Show service logs"
    echo "  cleanup         Stop and remove all containers and volumes"
    echo "  help            Show this help message"
    echo ""
    echo "Options:"
    echo "  env             Environment (development/production)"
    echo ""
    echo "Examples:"
    echo "  $0 deploy              # Deploy in development mode"
    echo "  $0 deploy production   # Deploy in production mode"
    echo "  $0 status              # Check service status"
    echo "  $0 logs                # View logs"
}

# Main script logic
main() {
    local command=${1:-deploy}
    local environment=${2:-development}
    
    case $command in
        deploy)
            check_prerequisites
            validate_environment
            create_directories
            deploy_services "$environment"
            wait_for_services
            run_migrations
            seed_data
            check_status
            print_success "Deployment completed successfully!"
            ;;
        start)
            docker-compose up -d
            print_success "Services started"
            ;;
        stop)
            stop_services
            ;;
        restart)
            stop_services
            sleep 2
            docker-compose up -d
            print_success "Services restarted"
            ;;
        status)
            check_status
            ;;
        logs)
            show_logs
            ;;
        cleanup)
            cleanup
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
