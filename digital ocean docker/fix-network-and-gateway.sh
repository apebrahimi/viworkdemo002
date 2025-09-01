#!/bin/bash
set -e

echo "🔧 Fixing Network and Gateway Agent"
echo "==================================="

# Check if SSH key exists
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "❌ Error: SSH key not found at ~/.ssh/id_ed25519"
    exit 1
fi

echo "🔑 Using SSH key: ~/.ssh/id_ed25519"

# Create the fix script
cat > fix_network_script.sh << 'EOF'
#!/bin/bash
set -e

echo "🔧 Fixing Network and Gateway Agent"
echo "==================================="

cd /opt/viworks/"digital ocean docker"

# Check available networks
echo "🔍 Available Docker Networks:"
docker network ls

echo ""
echo "🔍 Checking which network the main containers are using..."
docker inspect viworks-backend | grep -A 10 -B 10 "NetworkMode\|Networks" || echo "Backend container not found"

echo ""
echo "🔍 Starting gateway agent with correct network..."
if docker images | grep -q "viworks-gateway-agent"; then
    echo "🔍 Gateway agent image found, starting container..."
    
    # Try to find the correct network
    if docker network ls | grep -q "viworks-network"; then
        NETWORK="viworks-network"
    elif docker network ls | grep -q "digitaloceandocker_viworks-network"; then
        NETWORK="digitaloceandocker_viworks-network"
    elif docker network ls | grep -q "viworks-external"; then
        NETWORK="viworks-external"
    else
        echo "⚠️  No viworks network found, using default bridge"
        NETWORK="bridge"
    fi
    
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
echo "✅ Cleanup and monitoring completed!"
echo ""
echo "📊 Summary:"
echo "----------"
echo "Total containers: $(docker ps -a | wc -l)"
echo "Running containers: $(docker ps | wc -l)"
echo "ViWorks containers: $(docker ps -a | grep viworks | wc -l)"
echo "Main app containers: $(docker-compose ps | grep -c Up)"
EOF

# Upload and execute the script on the server
echo "📤 Uploading network fix script to server..."
scp -i ~/.ssh/id_ed25519 fix_network_script.sh root@64.227.46.188:/tmp/

echo "🔧 Making script executable and running it..."
ssh -i ~/.ssh/id_ed25519 root@64.227.46.188 "chmod +x /tmp/fix_network_script.sh && /tmp/fix_network_script.sh"

# Clean up
rm -f fix_network_script.sh

echo ""
echo "✅ Network fix and cleanup completed!"
