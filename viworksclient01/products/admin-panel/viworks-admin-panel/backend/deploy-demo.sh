#!/bin/bash

# ViWorkS Admin Backend - Demo Deployment Script
# This script deploys the demo version with all endpoints for the demo

set -e  # Exit on any error

echo "🚀 ViWorkS Admin Backend - Demo Deployment"
echo "=========================================="

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

# Check if we're in the right directory
if [ ! -f "Cargo.toml" ]; then
    print_error "Cargo.toml not found. Please run this script from the backend directory."
    exit 1
fi

print_status "Starting demo deployment..."

# Step 1: Backup current main.rs
print_status "Creating backup of current main.rs..."
if [ -f "src/main.rs" ]; then
    cp src/main.rs src/main_backup_$(date +%Y%m%d_%H%M%S).rs
    print_success "Backup created"
fi

# Step 2: Use the demo version (current main.rs is already demo version)
print_status "Using demo version (current main.rs)"

# Step 3: Clean previous builds
print_status "Cleaning previous builds..."
cargo clean
print_success "Clean completed"

# Step 4: Check compilation without database features
print_status "Checking compilation (no database features)..."
if cargo check --no-default-features; then
    print_success "Compilation check passed"
else
    print_error "Compilation failed"
    exit 1
fi

# Step 5: Build the application
print_status "Building application..."
if cargo build --release --no-default-features; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Step 6: Test the binary
print_status "Testing binary..."
if [ -f "target/release/viworks-admin-backend" ]; then
    print_success "Binary created successfully"
else
    print_error "Binary not found"
    exit 1
fi

# Step 7: Create Docker image
print_status "Building Docker image..."
if docker build -t viworks-admin-backend:demo .; then
    print_success "Docker image built successfully"
else
    print_error "Docker build failed"
    exit 1
fi

# Step 8: Stop existing containers
print_status "Stopping existing containers..."
docker stop viworks-admin-backend-demo 2>/dev/null || true
docker rm viworks-admin-backend-demo 2>/dev/null || true
print_success "Existing containers stopped"

# Step 9: Run the container
print_status "Starting demo container..."
docker run -d \
    --name viworks-admin-backend-demo \
    --restart unless-stopped \
    -p 8080:8080 \
    -e RUST_LOG=info \
    -e DATABASE_URL="postgresql://postgres:password@localhost:5432/viworks_admin" \
    viworks-admin-backend:demo

# Step 10: Wait for container to start
print_status "Waiting for container to start..."
sleep 5

# Step 11: Check container status
if docker ps | grep -q viworks-admin-backend-demo; then
    print_success "Container is running"
else
    print_error "Container failed to start"
    docker logs viworks-admin-backend-demo
    exit 1
fi

# Step 12: Health check
print_status "Performing health check..."
sleep 3
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    print_success "Health check passed"
else
    print_warning "Health check failed - checking logs..."
    docker logs viworks-admin-backend-demo
fi

# Step 13: Test demo endpoints
print_status "Testing demo endpoints..."

# Test login endpoint
print_status "Testing login endpoint..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"demo","password":"demo"}')

if echo "$LOGIN_RESPONSE" | grep -q "success.*true"; then
    print_success "Login endpoint working"
else
    print_warning "Login endpoint test failed"
fi

# Test health endpoint
print_status "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:8080/health)
if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    print_success "Health endpoint working"
else
    print_warning "Health endpoint test failed"
fi

print_success "Demo deployment completed successfully!"
echo ""
echo "🌐 Demo Backend is running at: http://localhost:8080"
echo "📊 Health check: http://localhost:8080/health"
echo "🔌 WebSocket: ws://localhost:8080/ws"
echo ""
echo "📋 Available Demo Endpoints:"
echo "  POST /api/v1/auth/login"
echo "  POST /api/v1/auth/challenge/initiate"
echo "  POST /api/v1/auth/challenge/verify"
echo "  POST /api/v1/auth/device/bind"
echo "  POST /api/v1/auth/client/bootstrap"
echo "  POST /api/v1/agent/user/create"
echo "  POST /api/v1/agent/container/spawn"
echo "  POST /api/v1/agent/session/terminate"
echo ""
echo "📝 Container logs: docker logs viworks-admin-backend-demo"
echo "🛑 Stop demo: docker stop viworks-admin-backend-demo"
echo "🗑️  Remove demo: docker rm viworks-admin-backend-demo"
