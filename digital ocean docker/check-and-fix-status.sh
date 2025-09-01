#!/bin/bash
set -e

echo "🔍 Checking Current Status and Fixing Issues"
echo "============================================"

# Check if SSH key exists
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "❌ Error: SSH key not found at ~/.ssh/id_ed25519"
    exit 1
fi

echo "🔑 Using SSH key: ~/.ssh/id_ed25519"

# Create the check and fix script
cat > check_and_fix_script.sh << 'EOF'
#!/bin/bash
set -e

echo "🔍 Checking Current Status and Fixing Issues"
echo "============================================"

cd /opt/viworks/"digital ocean docker"

echo "📊 Current Container Status:"
echo "----------------------------"
docker ps -a

echo ""
echo "🌐 Current Network Status:"
echo "-------------------------"
docker network ls

echo ""
echo "🔍 Backend Logs (to see why it's restarting):"
echo "============================================="
docker logs viworks-backend --tail=20 || echo "No backend logs found"

echo ""
echo "🔍 Frontend Logs:"
echo "================="
docker logs viworks-frontend --tail=10 || echo "No frontend logs found"

echo ""
echo "🔍 Nginx Logs:"
echo "=============="
docker logs viworks-nginx --tail=10 || echo "No nginx logs found"

echo ""
echo "🔧 Fixing Network Names and Restarting Services..."
echo "================================================="

# Stop all services
docker-compose down

# Remove the prefixed networks
docker network rm digitaloceandocker_viworks-internal digitaloceandocker_viworks-public 2>/dev/null || true

# Create clean networks with correct names
docker network create viworks-internal
docker network create viworks-public

echo "✅ Clean networks created"

# Start services again
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
echo "🔍 Final Status Check:"
echo "======================"

echo "📊 Container Status:"
docker-compose ps

echo ""
echo "🌐 Network Status:"
docker network ls

echo ""
echo "🔍 Health Checks:"
echo "================="

# Check nginx health
echo "🔍 Nginx Health Check:"
if curl -f -s -k https://localhost > /dev/null; then
    echo "✅ Nginx is healthy and responding (HTTPS)"
else
    echo "❌ Nginx health check failed"
fi

# Check backend health through nginx
echo "🔍 Backend Health Check (through nginx):"
if curl -f -s -k https://localhost/health > /dev/null; then
    echo "✅ Backend is healthy and responding through nginx"
else
    echo "❌ Backend health check through nginx failed"
fi

# Check frontend through nginx
echo "🔍 Frontend Health Check (through nginx):"
if curl -f -s -k https://localhost > /dev/null; then
    echo "✅ Frontend is healthy and responding through nginx"
else
    echo "❌ Frontend health check through nginx failed"
fi

echo ""
echo "📊 Resource Usage:"
echo "=================="
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

echo ""
echo "🔍 Network Connectivity Test:"
echo "============================="

# Test inter-container communication
echo "Testing backend -> postgres connectivity:"
docker exec viworks-backend ping -c 2 postgres > /dev/null 2>&1 && echo "✅ Backend can reach postgres" || echo "❌ Backend cannot reach postgres"

echo "Testing backend -> redis connectivity:"
docker exec viworks-backend ping -c 2 redis > /dev/null 2>&1 && echo "✅ Backend can reach redis" || echo "❌ Backend cannot reach redis"

echo "Testing nginx -> frontend connectivity:"
docker exec viworks-nginx ping -c 2 viworks-frontend > /dev/null 2>&1 && echo "✅ Nginx can reach frontend" || echo "❌ Nginx cannot reach frontend"

echo "Testing nginx -> backend connectivity:"
docker exec viworks-nginx ping -c 2 viworks-backend > /dev/null 2>&1 && echo "✅ Nginx can reach backend" || echo "❌ Nginx cannot reach backend"

echo ""
echo "📋 Final Container Status:"
echo "=========================="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"

echo ""
echo "✅ Status check and fix completed!"
EOF

# Upload and execute the script on the server
echo "📤 Uploading check and fix script to server..."
scp -i ~/.ssh/id_ed25519 check_and_fix_script.sh root@64.227.46.188:/tmp/

echo "🔧 Making script executable and running it..."
ssh -i ~/.ssh/id_ed25519 root@64.227.46.188 "chmod +x /tmp/check_and_fix_script.sh && /tmp/check_and_fix_script.sh"

# Clean up
rm -f check_and_fix_script.sh

echo ""
echo "✅ Status check and fix completed!"
