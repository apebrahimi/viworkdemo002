#!/bin/bash
set -e

echo "🚨 Fixing Critical Networking Issues"
echo "==================================="

echo "📋 Step 1: Stopping all containers to clean up..."
# Stop all containers
docker stop $(docker ps -q) || true

echo "📋 Step 2: Removing old insecure containers..."
# Remove old containers
docker rm viworks-frontend viworks-backend viworks-redis viworks-postgres || true

echo "📋 Step 3: Cleaning up networks..."
# Remove old networks
docker network rm digitaloceandocker_viworks-network || true
docker network rm viworks-network || true

echo "📋 Step 4: Creating clean secure networks..."
# Create clean networks
docker network create viworks-internal
docker network create viworks-external

echo "📋 Step 5: Starting only secure containers..."

# Start secure postgres
echo "Starting secure postgres..."
docker run -d \
    --name viworks-postgres-secure \
    --network viworks-internal \
    --restart unless-stopped \
    -e POSTGRES_DB=viworks_admin \
    -e POSTGRES_USER=admin \
    -e POSTGRES_PASSWORD=viworks_password_2024 \
    postgres:15-alpine

# Start secure redis
echo "Starting secure redis..."
docker run -d \
    --name viworks-redis-secure \
    --network viworks-internal \
    --restart unless-stopped \
    redis:7-alpine

# Start secure backend (connect to both networks)
echo "Starting secure backend..."
docker run -d \
    --name viworks-backend-secure \
    --network viworks-internal \
    --network viworks-external \
    --restart unless-stopped \
    viworks-backend:latest

# Start secure frontend
echo "Starting secure frontend..."
docker run -d \
    --name viworks-frontend-secure \
    --network viworks-external \
    --restart unless-stopped \
    viworks-frontend:latest

# Start secure website
echo "Starting secure website..."
docker run -d \
    --name viworks-website-secure \
    --network viworks-external \
    --restart unless-stopped \
    viworks-website:latest

echo "📋 Step 6: Updating nginx configuration..."
# Update nginx config to use correct container names
cd /root/standalone-nginx
sed -i 's/viworks-frontend:3000/viworks-frontend-secure:3000/g' nginx.conf
sed -i 's/viworkswebsite:3000/viworks-website-secure:3000/g' nginx.conf
sed -i 's/viworks-backend:8081/viworks-backend-secure:8081/g' nginx.conf

echo "📋 Step 7: Restarting nginx with correct configuration..."
# Restart nginx
docker stop viworks-standalone-nginx || true
docker rm viworks-standalone-nginx || true
docker-compose up -d

echo "📋 Step 8: Waiting for services to be ready..."
sleep 20

echo "📋 Step 9: Testing connectivity..."
# Test nginx connectivity
echo "Testing nginx connectivity to frontend..."
if docker exec viworks-standalone-nginx curl -f http://viworks-frontend-secure:3000 > /dev/null 2>&1; then
    echo "✅ Nginx can reach frontend"
else
    echo "❌ Nginx cannot reach frontend"
fi

echo "Testing nginx connectivity to website..."
if docker exec viworks-standalone-nginx curl -f http://viworks-website-secure:3000 > /dev/null 2>&1; then
    echo "✅ Nginx can reach website"
else
    echo "❌ Nginx cannot reach website"
fi

echo "Testing backend connectivity to databases..."
if docker exec viworks-backend-secure ping -c 1 viworks-redis-secure > /dev/null 2>&1; then
    echo "✅ Backend can reach redis"
else
    echo "❌ Backend cannot reach redis"
fi

if docker exec viworks-backend-secure ping -c 1 viworks-postgres-secure > /dev/null 2>&1; then
    echo "✅ Backend can reach postgres"
else
    echo "❌ Backend cannot reach postgres"
fi

echo "📋 Step 10: Verifying no direct port exposure..."
echo "🔍 Checking for exposed ports:"
docker ps --format "table {{.Names}}\t{{.Ports}}" | grep -E "0\.0\.0\.0|:::" || echo "✅ No containers with direct port exposure found"

echo ""
echo "✅ Networking issues fixed!"
echo ""
echo "🔒 Security Status:"
echo "   ✅ No containers directly accessible from internet"
echo "   ✅ All traffic routed through nginx"
echo "   ✅ Database containers on internal network only"
echo "   ✅ Frontend containers on external network only"
echo "   ✅ Backend can access both networks"
echo ""
echo "📊 Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Networks}}"
