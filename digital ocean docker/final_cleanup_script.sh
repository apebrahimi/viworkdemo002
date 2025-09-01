#!/bin/bash
set -e

echo "🧹 Final Container Cleanup and Setup"
echo "===================================="

cd /opt/viworks/"digital ocean docker"

echo "🔍 Current Container Status:"
echo "----------------------------"
docker ps -a

echo ""
echo "🧹 Final cleanup of all unnecessary containers..."
echo "================================================"

# Remove all unnecessary containers
echo "🗑️  Removing viworks-rebuild-temp..."
docker rm -f viworks-rebuild-temp 2>/dev/null && echo "✅ Removed viworks-rebuild-temp" || echo "ℹ️  viworks-rebuild-temp not found"

echo "🗑️  Removing secure containers..."
docker rm -f viworks-postgres-secure viworks-redis-secure 2>/dev/null && echo "✅ Removed secure containers" || echo "ℹ️  Secure containers not found"

echo "🗑️  Removing viworkswebsite..."
docker rm -f viworkswebsite 2>/dev/null && echo "✅ Removed viworkswebsite" || echo "ℹ️  viworkswebsite not found"

echo "🗑️  Removing any existing gateway agent..."
docker rm -f viworks-gateway-agent 2>/dev/null && echo "✅ Removed existing gateway agent" || echo "ℹ️  No existing gateway agent to remove"

echo ""
echo "🔍 Available Docker Networks:"
docker network ls

echo ""
echo "🚀 Starting viworks-gateway-agent with correct network..."
if docker images | grep -q "viworks-gateway-agent"; then
    echo "🔍 Gateway agent image found, starting container..."
    
    # Use the network that the main containers are using
    NETWORK="digitaloceandocker_viworks-network"
    echo "Using network: $NETWORK"
    
    docker run -d --name viworks-gateway-agent \
        --network "$NETWORK" \
        --restart unless-stopped \
        viworks-gateway-agent:alpine
    echo "✅ Gateway agent started successfully on network: $NETWORK"
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
echo "✅ Final cleanup and monitoring completed!"
echo ""
echo "📊 Summary:"
echo "----------"
echo "Total containers: $(docker ps -a | wc -l)"
echo "Running containers: $(docker ps | wc -l)"
echo "ViWorks containers: $(docker ps -a | grep viworks | wc -l)"
echo "Main app containers: $(docker-compose ps | grep -c Up)"

echo ""
echo "🔍 Gateway Agent Status:"
if docker ps | grep -q "viworks-gateway-agent"; then
    echo "✅ Gateway agent is running"
    docker ps | grep "viworks-gateway-agent"
else
    echo "❌ Gateway agent is not running"
fi
