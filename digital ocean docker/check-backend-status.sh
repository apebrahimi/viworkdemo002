#!/bin/bash
set -e

echo "🔍 Checking Backend Status on DigitalOcean Server"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Please run this script from the 'digital ocean docker' directory."
    exit 1
fi

echo "📊 Current Container Status:"
echo "----------------------------"
docker-compose ps

echo ""
echo "🔍 Backend Container Details:"
echo "-----------------------------"
docker inspect viworks-backend 2>/dev/null | jq '.[0] | {Name: .Name, Status: .State.Status, Health: .State.Health, RestartCount: .RestartCount, Created: .Created}' || echo "Backend container not found"

echo ""
echo "📋 Backend Logs (Last 50 lines):"
echo "--------------------------------"
docker-compose logs --tail=50 backend || echo "No backend logs available"

echo ""
echo "🔍 Backend Health Check:"
echo "------------------------"
curl -f http://localhost:8081/health 2>/dev/null && echo "✅ Backend health check passed" || echo "❌ Backend health check failed"

echo ""
echo "🔍 Database Connection Test:"
echo "----------------------------"
docker exec viworks-backend pg_isready -h postgres -p 5432 -U admin 2>/dev/null && echo "✅ Database connection OK" || echo "❌ Database connection failed"

echo ""
echo "🔍 Redis Connection Test:"
echo "-------------------------"
docker exec viworks-backend redis-cli -h redis ping 2>/dev/null && echo "✅ Redis connection OK" || echo "❌ Redis connection failed"

echo ""
echo "🔍 Resource Usage:"
echo "------------------"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}" | grep viworks || echo "No viworks containers running"

echo ""
echo "🔍 Network Connectivity:"
echo "-----------------------"
docker network inspect viworks-network 2>/dev/null | jq '.[0] | {Name: .Name, Driver: .Driver, Containers: (.Containers | keys)}' || echo "Network not found"

echo ""
echo "🔍 Environment Variables Check:"
echo "-------------------------------"
docker exec viworks-backend env | grep -E "(DATABASE_URL|REDIS_URL|JWT_SECRET|RUST_LOG)" || echo "No environment variables found"

echo ""
echo "✅ Backend Status Check Complete!"
