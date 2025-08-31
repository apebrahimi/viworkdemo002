#!/bin/bash

# Deploy standalone nginx container
# This script will create a standalone nginx container that can access all services

set -e

echo "🚀 Deploying standalone nginx container..."

# Create logs directory
mkdir -p logs

# Stop any existing nginx containers that might conflict
echo "🛑 Stopping existing nginx containers..."
docker stop viworks-standalone-nginx 2>/dev/null || true
docker rm viworks-standalone-nginx 2>/dev/null || true

# Build and start the standalone nginx container
echo "🔨 Building standalone nginx container..."
docker-compose build

echo "🚀 Starting standalone nginx container..."
docker-compose up -d

# Wait for nginx to start
echo "⏳ Waiting for nginx to start..."
sleep 5

# Test the configuration
echo "🧪 Testing nginx configuration..."
docker exec viworks-standalone-nginx nginx -t

# Check if nginx is running
if docker ps | grep -q viworks-standalone-nginx; then
    echo "✅ Standalone nginx container is running successfully!"
    echo "🌐 Nginx is now accessible on ports 80 and 443"
    echo "📊 Container status:"
    docker ps | grep viworks-standalone-nginx
else
    echo "❌ Failed to start standalone nginx container"
    echo "📋 Container logs:"
    docker logs viworks-standalone-nginx
    exit 1
fi

echo "🎉 Standalone nginx deployment completed!"
echo "🔗 Your website should now be accessible at: https://website-vw.neuratalent.com"
