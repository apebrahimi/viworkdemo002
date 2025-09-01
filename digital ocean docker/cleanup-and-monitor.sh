#!/bin/bash
set -e

echo "🧹 Container Cleanup and Health Monitoring"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Please run this script from the 'digital ocean docker' directory."
    exit 1
fi

echo "🔍 Current Container Status:"
echo "----------------------------"
docker-compose ps

echo ""
echo "🧹 Cleaning up unnecessary containers..."
echo "======================================"

# Remove viworks-rebuild-temp (unnecessary container)
echo "🗑️  Removing viworks-rebuild-temp container..."
docker rm -f viworks-rebuild-temp 2>/dev/null && echo "✅ Removed viworks-rebuild-temp" || echo "ℹ️  viworks-rebuild-temp not found"

# Remove secure containers (we'll secure the main ones instead)
echo "🗑️  Removing secure containers (will secure main ones instead)..."
docker rm -f viworks-postgres-secure viworks-redis-secure 2>/dev/null && echo "✅ Removed secure containers" || echo "ℹ️  Secure containers not found"

# Remove website container (not needed for main app)
echo "🗑️  Removing viworkswebsite container..."
docker rm -f viworkswebsite 2>/dev/null && echo "✅ Removed viworkswebsite" || echo "ℹ️  viworkswebsite not found"

echo ""
echo "🚀 Starting viworks-gateway-agent..."
echo "=================================="

# Check if gateway agent image exists
if docker images | grep -q "viworks-gateway-agent"; then
    echo "🔍 Gateway agent image found, starting container..."
    docker run -d --name viworks-gateway-agent \
        --network viworks-network \
        --restart unless-stopped \
        viworks-gateway-agent:alpine
    echo "✅ Gateway agent started"
else
    echo "⚠️  Gateway agent image not found, skipping..."
fi

echo ""
echo "🔒 Securing main containers (removing direct port exposure)..."
echo "============================================================"

# Stop current containers
echo "🛑 Stopping current containers..."
docker-compose down

# Update docker-compose to remove direct port exposure
echo "🔧 Updating docker-compose.yml to remove direct port exposure..."
sed -i 's/- "3000:3000"/# - "3000:3000"/g' docker-compose.yml
sed -i 's/- "8081:8081"/# - "8081:8081"/g' docker-compose.yml
sed -i 's/- "5432:5432"/# - "5432:5432"/g' docker-compose.yml
sed -i 's/- "6379:6379"/# - "6379:6379"/g' docker-compose.yml

echo "✅ Port exposure removed from main containers"

# Start containers without direct port exposure
echo "🔨 Starting containers without direct port exposure..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
echo "====================================="

# Wait for services to start
for i in {1..60}; do
    if docker-compose ps | grep -q "Up"; then
        echo "✅ Services are starting up..."
        break
    fi
    echo "⏳ Waiting for services to start... ($i/60)"
    sleep 5
done

echo ""
echo "🔍 Health Check and Monitoring:"
echo "==============================="

# Check container status
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "🔍 Individual Container Health:"
echo "==============================="

# Check backend health
echo "🔍 Backend Health Check:"
if curl -f -s http://localhost:8081/health > /dev/null; then
    echo "✅ Backend is healthy and responding"
else
    echo "❌ Backend health check failed"
fi

# Check frontend health
echo "🔍 Frontend Health Check:"
if curl -f -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is healthy and responding"
else
    echo "❌ Frontend health check failed"
fi

# Check database connectivity
echo "🔍 Database Connectivity:"
if docker exec viworks-backend pg_isready -h postgres -p 5432 -U admin > /dev/null 2>&1; then
    echo "✅ Database connection OK"
else
    echo "❌ Database connection failed"
fi

# Check Redis connectivity
echo "🔍 Redis Connectivity:"
if docker exec viworks-backend redis-cli -h redis ping > /dev/null 2>&1; then
    echo "✅ Redis connection OK"
else
    echo "❌ Redis connection failed"
fi

echo ""
echo "📊 Resource Usage Monitoring:"
echo "============================="
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}"

echo ""
echo "🔍 Container Logs (Last 5 lines each):"
echo "======================================"

echo "Backend logs:"
docker-compose logs --tail=5 backend || echo "No backend logs"

echo ""
echo "Frontend logs:"
docker-compose logs --tail=5 frontend || echo "No frontend logs"

echo ""
echo "PostgreSQL logs:"
docker-compose logs --tail=5 postgres || echo "No postgres logs"

echo ""
echo "Redis logs:"
docker-compose logs --tail=5 redis || echo "No redis logs"

echo ""
echo "🔍 Network Connectivity Test:"
echo "============================="

# Test inter-container communication
echo "Testing backend -> postgres connectivity:"
docker exec viworks-backend ping -c 2 postgres > /dev/null 2>&1 && echo "✅ Backend can reach postgres" || echo "❌ Backend cannot reach postgres"

echo "Testing backend -> redis connectivity:"
docker exec viworks-backend ping -c 2 redis > /dev/null 2>&1 && echo "✅ Backend can reach redis" || echo "❌ Backend cannot reach redis"

echo ""
echo "📋 Final Container Status:"
echo "=========================="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"

echo ""
echo "✅ Cleanup and monitoring completed!"
echo ""
echo "📊 Summary:"
echo "----------"
echo "Total containers: $(docker ps -a | wc -l)"
echo "Running containers: $(docker ps | wc -l)"
echo "ViWorks containers: $(docker ps -a | grep viworks | wc -l)"
echo "Main app containers: $(docker-compose ps | grep -c Up)"
