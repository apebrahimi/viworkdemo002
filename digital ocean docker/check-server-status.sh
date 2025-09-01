#!/bin/bash
set -e

echo "🔍 DigitalOcean Server Status Check"
echo "==================================="

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Please run this script from the 'digital ocean docker' directory."
    exit 1
fi

echo "📊 Current Docker Containers:"
echo "----------------------------"
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"

echo ""
echo "🔍 ViWorks Containers Status:"
echo "-----------------------------"
docker ps -a | grep viworks || echo "No viworks containers found"

echo ""
echo "📋 All Running Containers:"
echo "--------------------------"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"

echo ""
echo "🔍 Docker Networks:"
echo "------------------"
docker network ls

echo ""
echo "🔍 ViWorks Network Details:"
echo "---------------------------"
docker network inspect viworks-network 2>/dev/null | jq '.[0] | {Name: .Name, Driver: .Driver, Containers: (.Containers | keys)}' || echo "ViWorks network not found"

echo ""
echo "🔍 Docker Volumes:"
echo "-----------------"
docker volume ls | grep viworks || echo "No viworks volumes found"

echo ""
echo "🔍 Nginx Configuration Check:"
echo "----------------------------"
echo "Checking for nginx containers..."
docker ps -a | grep -i nginx || echo "No nginx containers found"

echo ""
echo "Checking for nginx processes..."
ps aux | grep nginx | grep -v grep || echo "No nginx processes found"

echo ""
echo "Checking for nginx configuration files..."
find /etc/nginx -name "*.conf" 2>/dev/null | head -10 || echo "No nginx config files found in /etc/nginx"

echo ""
echo "Checking for nginx in docker-compose..."
grep -i nginx docker-compose.yml || echo "No nginx service found in docker-compose.yml"

echo ""
echo "🔍 Port Usage Check:"
echo "-------------------"
echo "Checking ports 80, 443, 3000, 8081, 5432, 6379..."
netstat -tulpn | grep -E ':(80|443|3000|8081|5432|6379)' || echo "No services found on checked ports"

echo ""
echo "🔍 SSL Certificate Check:"
echo "------------------------"
if [ -d "/etc/letsencrypt" ]; then
    echo "Let's Encrypt certificates found:"
    ls -la /etc/letsencrypt/live/ 2>/dev/null || echo "No live certificates found"
else
    echo "No Let's Encrypt directory found"
fi

echo ""
echo "🔍 Container Resource Usage:"
echo "---------------------------"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}" | grep viworks || echo "No viworks containers running"

echo ""
echo "🔍 Recent Container Logs:"
echo "------------------------"
echo "Backend logs (last 10 lines):"
docker-compose logs --tail=10 backend 2>/dev/null || echo "No backend logs available"

echo ""
echo "Frontend logs (last 10 lines):"
docker-compose logs --tail=10 frontend 2>/dev/null || echo "No frontend logs available"

echo ""
echo "PostgreSQL logs (last 10 lines):"
docker-compose logs --tail=10 postgres 2>/dev/null || echo "No postgres logs available"

echo ""
echo "Redis logs (last 10 lines):"
docker-compose logs --tail=10 redis 2>/dev/null || echo "No redis logs available"

echo ""
echo "🔍 Environment Variables Check:"
echo "-------------------------------"
if [ -f "env.production" ]; then
    echo "env.production file exists"
    echo "Key variables:"
    grep -E "(DATABASE_URL|REDIS_URL|JWT_SECRET)" env.production || echo "No key variables found"
else
    echo "env.production file not found"
fi

echo ""
echo "🔍 Docker Compose Status:"
echo "------------------------"
docker-compose ps 2>/dev/null || echo "Docker compose not available or no services running"

echo ""
echo "🔍 System Resources:"
echo "-------------------"
echo "Disk usage:"
df -h | grep -E "(/$|/opt)" || echo "No relevant disk usage info"

echo ""
echo "Memory usage:"
free -h

echo ""
echo "CPU info:"
lscpu | grep -E "(Model name|CPU\(s\))" || echo "CPU info not available"

echo ""
echo "✅ Server Status Check Complete!"
echo ""
echo "📋 Summary:"
echo "----------"
echo "Total containers: $(docker ps -a | wc -l)"
echo "Running containers: $(docker ps | wc -l)"
echo "ViWorks containers: $(docker ps -a | grep viworks | wc -l)"
echo "Nginx containers: $(docker ps -a | grep -i nginx | wc -l)"
