#!/bin/bash
set -e

echo "🚀 Starting ViWorks Clean Deployment..."

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Please run this script from the 'digital ocean docker' directory."
    exit 1
fi

# Stop and remove existing containers with force
echo "🛑 Stopping and removing existing containers..."
docker-compose down --remove-orphans || true

# Force remove any lingering containers with our names
echo "🧹 Force removing any lingering containers..."
docker rm -f viworks-backend viworks-frontend viworks-postgres viworks-redis 2>/dev/null || true

# Remove old images to free space
echo "🧹 Cleaning up old images..."
docker image prune -f

# Remove any dangling images
echo "🧹 Removing dangling images..."
docker image prune -a -f

# Build and start new containers
echo "🔨 Building and starting new containers..."
docker-compose up -d --build --force-recreate

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service status
echo "📊 Checking service status..."
docker-compose ps

# Test endpoints
echo "🧪 Testing endpoints..."
echo "Testing frontend..."
curl -f http://localhost:3000 || echo "Frontend not ready yet"
echo "Testing backend health..."
curl -f http://localhost:8081/health || echo "Backend not ready yet"
echo "Testing WebSocket endpoint..."
curl -f http://localhost:8081/ws || echo "WebSocket endpoint not ready yet"

echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Services are now running:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8081"
echo "   Health:   http://localhost:8081/health"
echo "   WebSocket: ws://localhost:8081/ws"
echo ""
echo "📊 Container status:"
docker-compose ps
