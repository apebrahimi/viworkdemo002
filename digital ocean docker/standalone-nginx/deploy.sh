#!/bin/bash
set -e

echo "🚀 Deploying Standalone Nginx Container..."

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Please run this script from the standalone-nginx directory."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p ssl

# Stop any existing nginx containers
echo "🛑 Stopping existing nginx containers..."
docker-compose down || true
docker stop viworks-standalone-nginx || true
docker rm viworks-standalone-nginx || true

# Stop system nginx if running
echo "🛑 Stopping system nginx..."
sudo systemctl stop nginx || true
sudo systemctl disable nginx || true

# Create network if it doesn't exist
echo "🌐 Creating Docker network..."
docker network create viworks-network || true

# Build and start the standalone nginx container
echo "🔨 Starting standalone nginx container..."
docker-compose up -d

# Wait for nginx to be ready
echo "⏳ Waiting for nginx to be ready..."
sleep 10

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
docker exec viworks-standalone-nginx nginx -t

# Check container status
echo "📊 Checking container status..."
docker-compose ps

# Test endpoints
echo "🧪 Testing endpoints..."
echo "Testing nginx health..."
curl -f http://localhost/health || echo "Nginx not ready yet"

echo "✅ Standalone nginx deployment completed successfully!"
echo ""
echo "🌐 Nginx is now running on:"
echo "   HTTP:  http://localhost"
echo "   HTTPS: https://localhost"
echo ""
echo "📊 Container status:"
docker-compose ps
echo ""
echo "📋 Next steps:"
echo "1. Ensure all other containers are running and connected to viworks-network"
echo "2. Test website access: https://website-vw.neuratalent.com"
echo "3. Test admin panel: https://admin-viworks.neuratalent.com"
echo "4. Check logs: docker logs viworks-standalone-nginx"
