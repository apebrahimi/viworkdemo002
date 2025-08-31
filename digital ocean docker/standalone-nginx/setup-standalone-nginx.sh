#!/bin/bash
set -e

echo "🚀 Setting up Standalone Nginx Container for ViWorks"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Please run this script from the standalone-nginx directory."
    exit 1
fi

echo "📋 Step 1: Creating necessary directories..."
mkdir -p logs
mkdir -p ssl

echo "📋 Step 2: Stopping existing nginx services..."
# Stop any existing nginx containers
docker-compose down || true
docker stop viworks-standalone-nginx || true
docker rm viworks-standalone-nginx || true

# Stop system nginx if running
sudo systemctl stop nginx || true
sudo systemctl disable nginx || true

echo "📋 Step 3: Creating Docker network..."
# Create network if it doesn't exist
docker network create viworks-network || true

echo "📋 Step 4: Connecting all containers to network..."
# Connect frontend container
docker network connect viworks-network viworks-frontend || true

# Connect backend container
docker network connect viworks-network viworks-backend || true

# Connect website container
docker network connect viworks-network viworkswebsite || true

# Connect postgres container
docker network connect viworks-network viworks-postgres || true

# Connect redis container
docker network connect viworks-network viworks-redis || true

echo "📋 Step 5: Starting standalone nginx container..."
# Build and start the standalone nginx container
docker-compose up -d

echo "📋 Step 6: Waiting for nginx to be ready..."
sleep 15

echo "📋 Step 7: Testing nginx configuration..."
# Test nginx configuration
docker exec viworks-standalone-nginx nginx -t

echo "📋 Step 8: Checking container status..."
# Check container status
docker-compose ps

echo "📋 Step 9: Testing connectivity..."
# Test endpoints
echo "Testing nginx health..."
curl -f http://localhost/health || echo "Nginx not ready yet"

echo ""
echo "✅ Standalone nginx setup completed successfully!"
echo ""
echo "🌐 Nginx is now running on:"
echo "   HTTP:  http://localhost"
echo "   HTTPS: https://localhost"
echo ""
echo "📊 Container status:"
docker-compose ps
echo ""
echo "🌐 Network details:"
docker network inspect viworks-network --format='{{range .Containers}}{{.Name}} {{end}}'
echo ""
echo "📋 Next steps:"
echo "1. Test website access: https://website-vw.neuratalent.com"
echo "2. Test admin panel: https://admin-viworks.neuratalent.com"
echo "3. Check logs: docker logs viworks-standalone-nginx"
echo "4. If issues persist, check container connectivity:"
echo "   docker exec viworks-standalone-nginx ping viworkswebsite"
echo "   docker exec viworks-standalone-nginx ping viworks-frontend"
echo "   docker exec viworks-standalone-nginx ping viworks-backend"
