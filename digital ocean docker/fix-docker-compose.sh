#!/bin/bash
set -e

echo "🔧 Fixing Docker Compose and Restarting Services"
echo "================================================"

# Check if SSH key exists
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "❌ Error: SSH key not found at ~/.ssh/id_ed25519"
    exit 1
fi

echo "🔑 Using SSH key: ~/.ssh/id_ed25519"

# Create the fix script
cat > fix_docker_compose_script.sh << 'EOF'
#!/bin/bash
set -e

echo "🔧 Fixing Docker Compose and Restarting Services"
echo "================================================"

cd /opt/viworks/"digital ocean docker"

echo "🔍 Current docker-compose.yml status:"
echo "------------------------------------"
head -20 docker-compose.yml

echo ""
echo "🔧 Fixing docker-compose.yml file..."
echo "===================================="

# Create a backup
cp docker-compose.yml docker-compose.yml.backup

# Fix the ports section properly
cat > docker-compose.yml << 'COMPOSE_EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: viworks-postgres
    environment:
      POSTGRES_DB: viworks
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: viworks123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - viworks-network
    restart: unless-stopped
    # Ports commented out for security - only accessible via internal network
    # ports:
    #   - "5432:5432"

  redis:
    image: redis:7-alpine
    container_name: viworks-redis
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - viworks-network
    restart: unless-stopped
    # Ports commented out for security - only accessible via internal network
    # ports:
    #   - "6379:6379"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: viworks-backend
    environment:
      - DATABASE_URL=postgresql://admin:viworks123@postgres:5432/viworks
      - REDIS_URL=redis://redis:6379
      - RUST_LOG=info
    volumes:
      - ./backend/logs:/app/logs
    depends_on:
      - postgres
      - redis
    networks:
      - viworks-network
    restart: unless-stopped
    # Ports commented out for security - only accessible via internal network
    # ports:
    #   - "8081:8081"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: viworks-frontend
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8081
      - NODE_ENV=production
    depends_on:
      - backend
    networks:
      - viworks-network
    restart: unless-stopped
    # Ports commented out for security - only accessible via internal network
    # ports:
    #   - "3000:3000"

networks:
  viworks-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
COMPOSE_EOF

echo "✅ Docker compose file fixed"

echo ""
echo "🔨 Starting services..."
echo "======================"
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
echo "✅ Docker compose fix and monitoring completed!"
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
EOF

# Upload and execute the script on the server
echo "📤 Uploading docker-compose fix script to server..."
scp -i ~/.ssh/id_ed25519 fix_docker_compose_script.sh root@64.227.46.188:/tmp/

echo "🔧 Making script executable and running it..."
ssh -i ~/.ssh/id_ed25519 root@64.227.46.188 "chmod +x /tmp/fix_docker_compose_script.sh && /tmp/fix_docker_compose_script.sh"

# Clean up
rm -f fix_docker_compose_script.sh

echo ""
echo "✅ Docker compose fix completed!"
