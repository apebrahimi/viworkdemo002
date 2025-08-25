#!/bin/bash

# ViWorkS Admin Panel - Setup Script
# This script sets up the complete admin panel with Docker containers

set -e

echo "🚀 ViWorkS Admin Panel - Setup Script"
echo "======================================"

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

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if ports are available
check_ports() {
    print_status "Checking if required ports are available..."
    
    local ports=("3000" "8080" "5432" "6379" "5050")
    local unavailable_ports=()
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            unavailable_ports+=($port)
        fi
    done
    
    if [ ${#unavailable_ports[@]} -ne 0 ]; then
        print_warning "The following ports are already in use: ${unavailable_ports[*]}"
        print_warning "Please stop the services using these ports or modify the docker-compose.yml file"
        read -p "Do you want to continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        print_success "All required ports are available"
    fi
}

# Create environment file if it doesn't exist
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        if [ -f env.example ]; then
            cp env.example .env
            print_success "Created .env file from env.example"
        else
            print_error "env.example file not found"
            exit 1
        fi
    else
        print_warning ".env file already exists"
    fi
}

# Create SSL certificates for development
setup_ssl() {
    print_status "Setting up SSL certificates for development..."
    
    mkdir -p nginx/ssl
    
    if [ ! -f nginx/ssl/cert.pem ] || [ ! -f nginx/ssl/key.pem ]; then
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout nginx/ssl/key.pem \
            -out nginx/ssl/cert.pem \
            -subj "/C=US/ST=State/L=City/O=ViWorkS/CN=localhost"
        print_success "Created self-signed SSL certificates"
    else
        print_warning "SSL certificates already exist"
    fi
}

# Build and start containers
start_containers() {
    print_status "Building and starting containers..."
    
    # Stop any existing containers
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # Build images
    print_status "Building Docker images..."
    docker-compose build --no-cache
    
    # Start services
    print_status "Starting services..."
    docker-compose up -d
    
    print_success "Containers started successfully"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for PostgreSQL
    print_status "Waiting for PostgreSQL..."
    timeout=60
    while ! docker-compose exec -T postgres pg_isready -U admin -d viworks_admin >/dev/null 2>&1; do
        if [ $timeout -le 0 ]; then
            print_error "PostgreSQL failed to start within 60 seconds"
            exit 1
        fi
        sleep 1
        timeout=$((timeout - 1))
    done
    print_success "PostgreSQL is ready"
    
    # Wait for Redis
    print_status "Waiting for Redis..."
    timeout=30
    while ! docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; do
        if [ $timeout -le 0 ]; then
            print_error "Redis failed to start within 30 seconds"
            exit 1
        fi
        sleep 1
        timeout=$((timeout - 1))
    done
    print_success "Redis is ready"
    
    # Wait for backend
    print_status "Waiting for backend API..."
    timeout=60
    while ! curl -f http://localhost:8080/health >/dev/null 2>&1; do
        if [ $timeout -le 0 ]; then
            print_error "Backend API failed to start within 60 seconds"
            exit 1
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    print_success "Backend API is ready"
    
    # Wait for frontend
    print_status "Waiting for frontend..."
    timeout=60
    while ! curl -f http://localhost:3000 >/dev/null 2>&1; do
        if [ $timeout -le 0 ]; then
            print_error "Frontend failed to start within 60 seconds"
            exit 1
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    print_success "Frontend is ready"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # Wait a bit for the backend to be fully ready
    sleep 5
    
    # Run migrations using the backend container
    if docker-compose exec -T backend ./viworks-admin-backend --migrate; then
        print_success "Database migrations completed"
    else
        print_warning "Migration command not available, database should be initialized automatically"
    fi
}

# Display access information
show_access_info() {
    echo
    echo "🎉 ViWorkS Admin Panel is now running!"
    echo "======================================"
    echo
    echo "📱 Access URLs:"
    echo "   Frontend (Admin Panel): http://localhost:3000"
    echo "   Backend API: http://localhost:8080"
    echo "   pgAdmin (Database): http://localhost:5050"
    echo
    echo "🔐 Default Login Credentials:"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo
    echo "📊 Database Information:"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo "   Database: viworks_admin"
    echo "   Username: admin"
    echo "   Password: secure_password_dev"
    echo
    echo "🔧 Management Commands:"
    echo "   View logs: docker-compose logs -f"
    echo "   Stop services: docker-compose down"
    echo "   Restart services: docker-compose restart"
    echo "   Update and restart: docker-compose up -d --build"
    echo
    echo "📝 Notes:"
    echo "   - The admin panel supports Persian language with RTL layout"
    echo "   - All services are running in Docker containers"
    echo "   - Data is persisted in Docker volumes"
    echo "   - SSL certificates are self-signed for development"
    echo
}

# Main execution
main() {
    echo "Starting ViWorkS Admin Panel setup..."
    echo
    
    check_docker
    check_ports
    setup_environment
    setup_ssl
    start_containers
    wait_for_services
    run_migrations
    show_access_info
    
    print_success "Setup completed successfully!"
}

# Run main function
main "$@"
