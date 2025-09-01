#!/bin/bash
set -e

echo "🔍 Checking Container Status and Fixing Networking"
echo "=================================================="

# Check if SSH key exists
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "❌ Error: SSH key not found at ~/.ssh/id_ed25519"
    exit 1
fi

echo "🔑 Using SSH key: ~/.ssh/id_ed25519"

# Create the status check script
cat > check_container_status_script.sh << 'EOF'
#!/bin/bash
set -e

echo "🔍 Checking Container Status and Fixing Networking"
echo "=================================================="

cd /opt/viworks/"digital ocean docker"

echo "📊 Current Container Status:"
echo "============================"
docker ps -a

echo ""
echo "🌐 Current Network Status:"
echo "=========================="
docker network ls

echo ""
echo "🔍 Network Details for Each Container:"
echo "======================================"

echo "Backend network:"
docker inspect viworks-backend | grep -A 10 -B 5 "NetworkMode\|Networks" || echo "Cannot inspect backend"

echo ""
echo "Postgres network:"
docker inspect viworks-postgres | grep -A 10 -B 5 "NetworkMode\|Networks" || echo "Cannot inspect postgres"

echo ""
echo "Redis network:"
docker inspect viworks-redis | grep -A 10 -B 5 "NetworkMode\|Networks" || echo "Cannot inspect redis"

echo ""
echo "Frontend network:"
docker inspect viworks-frontend | grep -A 10 -B 5 "NetworkMode\|Networks" || echo "Cannot inspect frontend"

echo ""
echo "Nginx network:"
docker inspect viworks-nginx | grep -A 10 -B 5 "NetworkMode\|Networks" || echo "Cannot inspect nginx"

echo ""
echo "🔍 Testing Container Connectivity:"
echo "=================================="

echo "Testing backend -> postgres connectivity:"
docker exec viworks-backend ping -c 2 postgres > /dev/null 2>&1 && echo "✅ Backend can reach postgres" || echo "❌ Backend cannot reach postgres"

echo "Testing backend -> redis connectivity:"
docker exec viworks-backend ping -c 2 redis > /dev/null 2>&1 && echo "✅ Backend can reach redis" || echo "❌ Backend cannot reach redis"

echo "Testing nginx -> frontend connectivity:"
docker exec viworks-nginx ping -c 2 viworks-frontend > /dev/null 2>&1 && echo "✅ Nginx can reach frontend" || echo "❌ Nginx cannot reach frontend"

echo "Testing nginx -> backend connectivity:"
docker exec viworks-nginx ping -c 2 viworks-backend > /dev/null 2>&1 && echo "✅ Nginx can reach backend" || echo "❌ Nginx cannot reach backend"

echo ""
echo "🔍 Database Connection Test:"
echo "============================"

echo "Testing if postgres container is accessible:"
docker exec viworks-postgres pg_isready -U admin || echo "❌ Postgres not accessible"

echo ""
echo "Testing if redis container is accessible:"
docker exec viworks-redis redis-cli ping || echo "❌ Redis not accessible"

echo ""
echo "🔍 Backend Logs (Last 10 lines):"
echo "================================="
docker logs viworks-backend --tail=10 || echo "No backend logs found"

echo ""
echo "🔧 Fixing Network Configuration..."
echo "================================="

# Stop all services
docker-compose down

echo ""
echo "🔍 Current docker-compose.yml:"
echo "=============================="
cat docker-compose.yml

echo ""
echo "🔧 Fixing docker-compose.yml with proper network configuration..."
echo "==============================================================="

# Create a corrected docker-compose.yml
cat > docker-compose.yml << 'COMPOSE_EOF'
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
      - viworks-internal
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: viworks-redis
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - viworks-internal
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: viworks-backend
    environment:
      - DATABASE_URL=postgresql://admin:viworks123@viworks-postgres:5432/viworks
      - REDIS_URL=redis://viworks-redis:6379
      - RUST_LOG=info
      - RUST_BACKTRACE=1
      - JWT_SECRET=your-secret-key-here
    volumes:
      - ./backend/logs:/app/logs
    depends_on:
      - postgres
      - redis
    networks:
      - viworks-internal
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: viworks-frontend
    environment:
      - NEXT_PUBLIC_API_URL=http://viworks-backend:8081
      - NODE_ENV=production
    depends_on:
      - backend
    networks:
      - viworks-internal
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: viworks-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    networks:
      - viworks-public
      - viworks-internal
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

networks:
  viworks-public:
    driver: bridge
  viworks-internal:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
COMPOSE_EOF

echo "✅ Docker compose file fixed with proper container names in network"

echo ""
echo "🚀 Starting services with corrected network configuration..."
echo "=========================================================="

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
echo "🔍 Network Connectivity Test:"
echo "============================="

echo "Testing backend -> postgres connectivity:"
docker exec viworks-backend ping -c 2 viworks-postgres > /dev/null 2>&1 && echo "✅ Backend can reach postgres" || echo "❌ Backend cannot reach postgres"

echo "Testing backend -> redis connectivity:"
docker exec viworks-backend ping -c 2 viworks-redis > /dev/null 2>&1 && echo "✅ Backend can reach redis" || echo "❌ Backend cannot reach redis"

echo "Testing nginx -> frontend connectivity:"
docker exec viworks-nginx ping -c 2 viworks-frontend > /dev/null 2>&1 && echo "✅ Nginx can reach frontend" || echo "❌ Nginx cannot reach frontend"

echo "Testing nginx -> backend connectivity:"
docker exec viworks-nginx ping -c 2 viworks-backend > /dev/null 2>&1 && echo "✅ Nginx can reach backend" || echo "❌ Nginx cannot reach backend"

echo ""
echo "🔍 Database Connection Test:"
echo "============================"

echo "Testing if postgres container is accessible:"
docker exec viworks-postgres pg_isready -U admin || echo "❌ Postgres not accessible"

echo ""
echo "Testing if redis container is accessible:"
docker exec viworks-redis redis-cli ping || echo "❌ Redis not accessible"

echo ""
echo "🔍 Backend Health Check:"
echo "========================"

# Wait a bit for backend to start
sleep 10

echo "Backend status:"
docker-compose ps backend

echo ""
echo "Backend logs (last 10 lines):"
docker logs viworks-backend --tail=10 || echo "No backend logs found"

echo ""
echo "📋 Final Container Status:"
echo "=========================="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"

echo ""
echo "✅ Container status check and network fix completed!"
EOF

# Upload and execute the script on the server
echo "📤 Uploading container status check script to server..."
scp -i ~/.ssh/id_ed25519 check_container_status_script.sh root@64.227.46.188:/tmp/

echo "🔧 Making script executable and running it..."
ssh -i ~/.ssh/id_ed25519 root@64.227.46.188 "chmod +x /tmp/check_container_status_script.sh && /tmp/check_container_status_script.sh"

# Clean up
rm -f check_container_status_script.sh

echo ""
echo "✅ Container status check and network fix completed!"
