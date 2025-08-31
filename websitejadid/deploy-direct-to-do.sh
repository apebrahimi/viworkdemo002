#!/bin/bash

# ViWorks Website Deployment Script for DigitalOcean
# Builds and deploys directly on the server

set -e

echo "🚀 Starting ViWorks website deployment to DigitalOcean..."

# Configuration
REMOTE_HOST="64.227.46.188"
REMOTE_USER="root"
REMOTE_DIR="/opt/viworks-website"
CONTAINER_NAME="viworkswebsite"
PORT="3001"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "Dockerfile" ]; then
    print_error "Please run this script from the websitejadid directory"
    exit 1
fi

print_status "Creating remote directory and copying files..."
# Create remote directory
ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} "mkdir -p ${REMOTE_DIR}"

# Copy all website files to the server
print_status "Copying website files to server..."
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' ./ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/

print_status "Building and deploying on DigitalOcean server..."
ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} << EOF
    cd ${REMOTE_DIR}
    
    # Stop and remove existing container if it exists
    docker stop ${CONTAINER_NAME} || true
    docker rm ${CONTAINER_NAME} || true
    
    # Remove existing image if it exists
    docker rmi viworks-website:latest || true
    
    # Build the Docker image
    echo "Building Docker image..."
    docker build -t viworks-website:latest .
    
    # Create and start the new container
    echo "Starting container..."
    docker run -d \\
        --name ${CONTAINER_NAME} \\
        --restart unless-stopped \\
        -p ${PORT}:3000 \\
        -e NODE_ENV=production \\
        -e NEXT_TELEMETRY_DISABLED=1 \\
        viworks-website:latest
    
    # Show container status
    echo "Container status:"
    docker ps | grep ${CONTAINER_NAME}
    
    echo "Container logs:"
    docker logs --tail=20 ${CONTAINER_NAME}
EOF

print_status "✅ Deployment completed!"
print_status "🌐 Website should be available at: http://64.227.46.188:${PORT}"
print_status "📊 Check container status with: ssh root@64.227.46.188 'docker ps | grep ${CONTAINER_NAME}'"
print_status "📋 View logs with: ssh root@64.227.46.188 'docker logs -f ${CONTAINER_NAME}'"
print_status "🛑 Stop container with: ssh root@64.227.46.188 'docker stop ${CONTAINER_NAME}'"
print_status "🗑️ Remove container with: ssh root@64.227.46.188 'docker rm ${CONTAINER_NAME}'"
