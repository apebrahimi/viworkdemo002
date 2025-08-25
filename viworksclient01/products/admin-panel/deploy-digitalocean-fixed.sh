#!/bin/bash

# ViWorkS Admin Panel - Fixed DigitalOcean Deployment Script
# This script handles the entire deployment process with proper image handling

set -e

echo "🚀 ViWorkS Admin Panel - Fixed DigitalOcean Deployment"
echo "====================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check if doctl is installed
    if ! command -v doctl &> /dev/null; then
        print_error "doctl is not installed. Please install it first:"
        echo "  macOS: brew install doctl"
        echo "  Linux: snap install doctl"
        echo "  Windows: Download from https://github.com/digitalocean/doctl/releases"
        exit 1
    fi
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Check DigitalOcean authentication
    print_status "Checking DigitalOcean authentication..."
    if ! doctl account get &> /dev/null; then
        print_error "Not authenticated with DigitalOcean. Please run:"
        echo "  doctl auth init"
        exit 1
    fi
    
    print_success "All prerequisites are satisfied"
}

# Function to setup container registry
setup_registry() {
    print_header "Setting up DigitalOcean Container Registry"
    
    # Check if registry already exists
    if doctl registry list --format Name --no-header | grep -q "viworks-registry"; then
        print_status "Registry 'viworks-registry' already exists"
        REGISTRY_NAME="viworks-registry"
    else
        print_status "Creating container registry..."
        doctl registry create viworks-registry --subscription-tier basic
        REGISTRY_NAME="viworks-registry"
    fi
    
    # Login to registry
    print_status "Logging into container registry..."
    doctl registry login
    
    print_success "Container registry setup completed"
}

# Function to build and push images
build_and_push_images() {
    print_header "Building and Pushing Images"
    
    # Get registry name
    REGISTRY_NAME=$(doctl registry list | grep viworks-registry | awk '{print $1}')
    
    # Navigate to project directory
    cd viworks-admin-panel
    
    # Build backend image
    print_status "Building backend image..."
    docker build -t viworks-backend:v1 ./backend/
    
    # Build frontend image
    print_status "Building frontend image..."
    docker build -t viworks-frontend:v1 ./frontend/
    
    # Tag images for DigitalOcean registry
    print_status "Tagging images for DigitalOcean registry..."
    docker tag viworks-backend:v1 registry.digitalocean.com/$REGISTRY_NAME/viworks-backend:v1
    docker tag viworks-frontend:v1 registry.digitalocean.com/$REGISTRY_NAME/viworks-frontend:v1
    
    # Push images
    print_status "Pushing images to registry..."
    docker push registry.digitalocean.com/$REGISTRY_NAME/viworks-backend:v1
    docker push registry.digitalocean.com/$REGISTRY_NAME/viworks-frontend:v1
    
    print_success "Images built and pushed successfully"
}

# Function to create app specification
create_app_spec() {
    print_header "Creating App Specification"
    
    # Get registry name
    REGISTRY_NAME=$(doctl registry list | grep viworks-registry | awk '{print $1}')
    
    # Create app specification file
    cat > digitalocean-app-simple.yaml << EOF
name: viworks-admin-panel
region: lon1
services:
- name: viworks-backend
  image:
    registry_type: DOCR
    registry: $REGISTRY_NAME
    repository: viworks-backend
    tag: v1
  run_command: ./viworks-admin-backend
  environment_slug: rust
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: JWT_SECRET
    value: your-super-secret-jwt-key-change-in-production
  - key: NODE_ENV
    value: production
  - key: LOG_LEVEL
    value: info
  - key: BCRYPT_ROUNDS
    value: "12"
  - key: RATE_LIMIT_WINDOW
    value: "900000"
  - key: RATE_LIMIT_MAX
    value: "100"
  - key: CORS_ORIGIN
    value: https://viworks-frontend-\${APP_ID}.ondigitalocean.app
  - key: ADMIN_PANEL_URL
    value: https://viworks-frontend-\${APP_ID}.ondigitalocean.app
  - key: PORT
    value: "8081"

- name: viworks-frontend
  image:
    registry_type: DOCR
    registry: $REGISTRY_NAME
    repository: viworks-frontend
    tag: v1
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: NEXT_PUBLIC_API_URL
    value: https://viworks-backend-\${APP_ID}.ondigitalocean.app
  - key: NEXT_PUBLIC_WS_URL
    value: wss://viworks-backend-\${APP_ID}.ondigitalocean.app
  - key: PORT
    value: "3000"
EOF
    
    print_success "App specification created"
}

# Function to deploy application
deploy_application() {
    print_header "Deploying Application"
    
    print_status "Creating DigitalOcean App Platform application..."
    doctl apps create --spec digitalocean-app-simple.yaml
    
    print_success "Application deployment initiated!"
}

# Function to get deployment status
get_deployment_status() {
    print_header "Deployment Status"
    
    print_status "Getting application details..."
    doctl apps list
    
    echo ""
    print_status "Next steps:"
    echo "1. Go to DigitalOcean App Platform dashboard"
    echo "2. Monitor the deployment progress"
    echo "3. Get your application URLs from the dashboard"
    echo "4. Test your application endpoints"
    echo ""
    print_warning "Note: Initial deployment may take 5-10 minutes"
}

# Function to test deployment
test_deployment() {
    print_header "Testing Deployment"
    
    # Get app ID
    APP_ID=$(doctl apps list --format ID,Name --no-header | grep viworks-admin-panel | awk '{print $1}')
    
    if [ -z "$APP_ID" ]; then
        print_error "Could not find app ID. Please check deployment status manually."
        return 1
    fi
    
    print_status "Testing backend health..."
    sleep 30  # Wait for deployment to stabilize
    
    # Test backend health
    BACKEND_URL="https://viworks-backend-$APP_ID.ondigitalocean.app"
    if curl -f -s "$BACKEND_URL/health" > /dev/null; then
        print_success "Backend is healthy!"
    else
        print_warning "Backend health check failed. This is normal during initial deployment."
    fi
    
    # Test frontend
    FRONTEND_URL="https://viworks-frontend-$APP_ID.ondigitalocean.app"
    if curl -f -s "$FRONTEND_URL" > /dev/null; then
        print_success "Frontend is accessible!"
    else
        print_warning "Frontend check failed. This is normal during initial deployment."
    fi
    
    echo ""
    print_status "Your application URLs:"
    echo "Backend: $BACKEND_URL"
    echo "Frontend: $FRONTEND_URL"
}

# Main deployment function
main_deployment() {
    print_header "Starting Fixed DigitalOcean Deployment"
    
    check_prerequisites
    setup_registry
    build_and_push_images
    create_app_spec
    deploy_application
    get_deployment_status
    
    print_success "DigitalOcean deployment completed successfully!"
}

# Function to show usage
show_usage() {
    echo "ViWorkS Admin Panel - Fixed DigitalOcean Deployment Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  deploy    Complete deployment (default)"
    echo "  check     Check prerequisites only"
    echo "  registry  Setup registry only"
    echo "  build     Build and push images only"
    echo "  test      Test deployment (after deployment)"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy    # Complete deployment"
    echo "  $0 check     # Check prerequisites"
    echo "  $0 build     # Build and push images"
    echo "  $0 test      # Test deployment"
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        main_deployment
        ;;
    "check")
        check_prerequisites
        ;;
    "registry")
        check_prerequisites
        setup_registry
        ;;
    "build")
        check_prerequisites
        setup_registry
        build_and_push_images
        ;;
    "test")
        test_deployment
        ;;
    "help"|"-h"|"--help")
        show_usage
        ;;
    *)
        print_error "Unknown option: $1"
        show_usage
        exit 1
        ;;
esac
