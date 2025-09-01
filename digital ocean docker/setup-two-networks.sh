#!/bin/bash
set -e

echo "🌐 Setting Up Two-Network Architecture"
echo "======================================"

# Check if SSH key exists
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "❌ Error: SSH key not found at ~/.ssh/id_ed25519"
    exit 1
fi

echo "🔑 Using SSH key: ~/.ssh/id_ed25519"

# Create the setup script
cat > setup_two_networks_script.sh << 'EOF'
#!/bin/bash
set -e

echo "🌐 Setting Up Two-Network Architecture"
echo "======================================"

cd /opt/viworks/"digital ocean docker"

echo "🧹 Cleaning up existing containers and networks..."
echo "================================================="

# Stop and remove all containers
docker-compose down 2>/dev/null || true
docker rm -f viworks-gateway-agent viworks-standalone-nginx 2>/dev/null || true

# Remove old networks (keep only bridge, host, none)
docker network rm viworks-external viworks-internal digitaloceandocker_viworks-network 2>/dev/null || true

echo ""
echo "🔧 Creating clean docker-compose.yml with two networks..."
echo "========================================================"

# Create a clean docker-compose.yml
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
      - viworks-internal
    restart: unless-stopped
    # No ports exposed - only internal access

  redis:
    image: redis:7-alpine
    container_name: viworks-redis
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - viworks-internal
    restart: unless-stopped
    # No ports exposed - only internal access

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
      - viworks-internal
    restart: unless-stopped
    # No ports exposed - only internal access

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
      - viworks-internal
    restart: unless-stopped
    # No ports exposed - only internal access

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
    # This network can receive external traffic
  viworks-internal:
    driver: bridge
    # This network is isolated for internal services

volumes:
  postgres_data:
  redis_data:
COMPOSE_EOF

echo "✅ Docker compose file created with two networks"

echo ""
echo "🔧 Creating nginx configuration..."
echo "================================="

# Create nginx directory
mkdir -p nginx/ssl

# Create nginx configuration
cat > nginx/nginx.conf << 'NGINX_EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Upstream definitions
    upstream frontend {
        server viworks-frontend:3000;
    }

    upstream backend {
        server viworks-backend:8081;
    }

    # HTTP server (redirect to HTTPS)
    server {
        listen 80;
        server_name _;
        
        # Redirect all HTTP to HTTPS
        return 301 https://$host$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name _;

        # SSL configuration (self-signed for now)
        ssl_certificate /etc/nginx/ssl/nginx.crt;
        ssl_certificate_key /etc/nginx/ssl/nginx.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Frontend routes
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 86400;
        }

        # Backend API routes
        location /api/ {
            proxy_pass http://backend/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 86400;
        }

        # Health check endpoint
        location /health {
            proxy_pass http://backend/health;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
NGINX_EOF

echo "✅ Nginx configuration created"

echo ""
echo "🔐 Creating self-signed SSL certificate..."
echo "=========================================="

# Create self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/nginx.key \
    -out nginx/ssl/nginx.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

echo "✅ SSL certificate created"

echo ""
echo "🚀 Starting services with new network architecture..."
echo "===================================================="

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
echo "🔍 Network Architecture:"
echo "========================"
echo "Public Network (viworks-public):"
docker network inspect viworks-public --format "{{.Name}} - {{.Driver}} - {{.Scope}}"

echo ""
echo "Internal Network (viworks-internal):"
docker network inspect viworks-internal --format "{{.Name}} - {{.Driver}} - {{.Scope}}"

echo ""
echo "🔍 Individual Container Health:"
echo "==============================="

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

echo "Nginx logs:"
docker-compose logs --tail=5 nginx || echo "No nginx logs"

echo ""
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

echo "Testing nginx -> frontend connectivity:"
docker exec viworks-nginx ping -c 2 viworks-frontend > /dev/null 2>&1 && echo "✅ Nginx can reach frontend" || echo "❌ Nginx cannot reach frontend"

echo "Testing nginx -> backend connectivity:"
docker exec viworks-nginx ping -c 2 viworks-backend > /dev/null 2>&1 && echo "✅ Nginx can reach backend" || echo "❌ Nginx cannot reach backend"

echo ""
echo "📋 Final Container Status:"
echo "=========================="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"

echo ""
echo "✅ Two-network architecture setup completed!"
echo ""
echo "📊 Summary:"
echo "----------"
echo "Total containers: $(docker ps -a | wc -l)"
echo "Running containers: $(docker ps | wc -l)"
echo "ViWorks containers: $(docker ps -a | grep viworks | wc -l)"
echo "Main app containers: $(docker-compose ps | grep -c Up)"

echo ""
echo "🌐 Network Architecture:"
echo "----------------------"
echo "Public Network (viworks-public): Nginx receives external traffic"
echo "Internal Network (viworks-internal): Backend, Postgres, Redis, Frontend"
echo "Nginx bridges both networks to route traffic appropriately"
EOF

# Upload and execute the script on the server
echo "📤 Uploading two-network setup script to server..."
scp -i ~/.ssh/id_ed25519 setup_two_networks_script.sh root@64.227.46.188:/tmp/

echo "🔧 Making script executable and running it..."
ssh -i ~/.ssh/id_ed25519 root@64.227.46.188 "chmod +x /tmp/setup_two_networks_script.sh && /tmp/setup_two_networks_script.sh"

# Clean up
rm -f setup_two_networks_script.sh

echo ""
echo "✅ Two-network architecture setup completed!"
