#!/bin/bash
set -e

echo "🚀 Starting ViWorks Fixed Deployment..."
echo "======================================"

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Please run this script from the 'digital ocean docker' directory."
    exit 1
fi

echo "🔧 Configuration Summary:"
echo "  - Frontend: Port 3000 (env.frontend)"
echo "  - Backend: Port 8081 (env.backend)" 
echo "  - Website: Port 3000 (env.website)"
echo "  - Nginx: SSL certificates from /etc/letsencrypt"
echo ""

# Stop all existing containers
echo "🛑 Stopping all existing containers..."
docker-compose down --remove-orphans || true

# Remove any lingering containers
echo "🧹 Force removing any lingering containers..."
docker rm -f viworks-backend viworks-frontend viworks-postgres viworks-redis viworks-nginx viworks-website 2>/dev/null || true

# Clean up old images
echo "🧹 Cleaning up old images..."
docker image prune -f

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
echo "Testing frontend on port 3000..."
docker exec viworks-nginx curl -f http://viworks-frontend:3000/ || echo "Frontend not ready yet"
echo "Testing backend health on port 8081..."
docker exec viworks-nginx curl -f http://viworks-backend:8081/health || echo "Backend not ready yet"

# Test external access
echo "🌐 Testing external access..."
echo "Testing admin panel..."
curl -k -I https://admin-viworks.neuratalent.com 2>/dev/null | head -5 || echo "Admin panel not accessible yet"
echo "Testing API..."
curl -k -I https://api-viworks.neuratalent.com 2>/dev/null | head -5 || echo "API not accessible yet"

echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Services are now running:"
echo "   Admin Panel: https://admin-viworks.neuratalent.com"
echo "   API:         https://api-viworks.neuratalent.com"
echo "   Website:     https://viworks.neuratalent.com"
echo ""
echo "📊 Container status:"
docker-compose ps
