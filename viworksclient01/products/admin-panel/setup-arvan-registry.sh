#!/bin/bash

# Arvan Cloud Registry Setup Script
# This script helps set up the registry and push images

set -e

echo "🚀 Setting up Arvan Cloud Registry for ViWorkS Admin Panel"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Docker is running"

# Check if images exist locally
if ! docker image inspect viworks-backend:v1 > /dev/null 2>&1; then
    print_error "viworks-backend:v1 image not found. Please build it first."
    exit 1
fi

if ! docker image inspect viworks-frontend:v1 > /dev/null 2>&1; then
    print_error "viworks-frontend:v1 image not found. Please build it first."
    exit 1
fi

print_success "Local images found"

echo ""
print_status "📋 Next Steps:"
echo ""
echo "1. Go to Arvan Cloud Dashboard → Container → Container Registry"
echo "2. Create a new registry (if not exists)"
echo "3. Note down the registry URL, username, and password"
echo "4. Run the following commands with your registry details:"
echo ""
echo "   # Login to your Arvan Cloud registry"
echo "   docker login <your-registry-url>"
echo ""
echo "   # Tag images for your registry"
echo "   docker tag viworks-backend:v1 <your-registry-url>/viworks-backend:v1"
echo "   docker tag viworks-frontend:v1 <your-registry-url>/viworks-frontend:v1"
echo ""
echo "   # Push images to your registry"
echo "   docker push <your-registry-url>/viworks-backend:v1"
echo "   docker push <your-registry-url>/viworks-frontend:v1"
echo ""

print_status "After pushing images, you can deploy applications using the dashboard configuration files:"
echo "   - postgres-dashboard-config.md"
echo "   - redis-dashboard-config.md"
echo "   - backend-dashboard-config.md"
echo "   - frontend-dashboard-config.md"

print_success "Setup script completed!"
