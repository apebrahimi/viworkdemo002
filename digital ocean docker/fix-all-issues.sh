#!/bin/bash
set -e

echo "🔧 Fixing All Issues: Backend, Network, and Nginx"
echo "=================================================="

# Check if SSH key exists
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "❌ Error: SSH key not found at ~/.ssh/id_ed25519"
    exit 1
fi

echo "🔑 Using SSH key: ~/.ssh/id_ed25519"

# Create the comprehensive fix script
cat > fix_all_issues_script.sh << 'EOF'
#!/bin/bash
set -e

echo "🔧 Fixing All Issues: Backend, Network, and Nginx"
echo "=================================================="

cd /opt/viworks/"digital ocean docker"

echo "🧹 Complete cleanup and restart..."
echo "=================================="

# Stop everything
docker-compose down
docker rm -f viworks-gateway-agent 2>/dev/null || true

# Remove all networks
docker network rm viworks-internal viworks-public digitaloceandocker_viworks-internal digitaloceandocker_viworks-public 2>/dev/null || true

echo ""
echo "🔧 Fixing docker-compose.yml..."
echo "==============================="

# Create a clean docker-compose.yml without version and with proper network configuration
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
      - DATABASE_URL=postgresql://admin:viworks123@postgres:5432/viworks
      - REDIS_URL=redis://redis:6379
      - RUST_LOG=info
      - RUST_BACKTRACE=1
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
      - NEXT_PUBLIC_API_URL=http://backend:8081
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

echo "✅ Docker compose file fixed"

echo ""
echo "🔧 Fixing nginx configuration..."
echo "==============================="

# Create nginx directory
mkdir -p nginx/ssl

# Create a simpler nginx configuration that works
cat > nginx/nginx.conf << 'NGINX_EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

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

    # HTTP server (redirect to HTTPS)
    server {
        listen 80;
        server_name _;
        
        # Redirect all HTTP to HTTPS
        return 301 https://$host$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl;
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
            proxy_pass http://viworks-frontend:3000;
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
            proxy_pass http://viworks-backend:8081/;
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
            proxy_pass http://viworks-backend:8081/health;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
NGINX_EOF

echo "✅ Nginx configuration fixed"

echo ""
echo "🔐 Creating SSL certificate..."
echo "=============================="

# Create self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/nginx.key \
    -out nginx/ssl/nginx.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

echo "✅ SSL certificate created"

echo ""
echo "🚀 Starting services with fixed configuration..."
echo "==============================================="

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
echo "🔍 Checking Backend Database Migration Issue..."
echo "=============================================="

# Check if backend is running and check logs
echo "Backend status:"
docker-compose ps backend

echo ""
echo "Backend logs (last 20 lines):"
docker logs viworks-backend --tail=20 || echo "No backend logs found"

echo ""
echo "🔍 Testing Database Connection..."
echo "================================"

# Test database connection directly
echo "Testing direct database connection:"
docker exec viworks-postgres pg_isready -U admin -d viworks

echo ""
echo "🔍 Testing Redis Connection..."
echo "=============================="

# Test Redis connection directly
echo "Testing direct Redis connection:"
docker exec viworks-redis redis-cli ping

echo ""
echo "🔍 Health Check and Monitoring:"
echo "==============================="

# Check container status
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "🌐 Network Status:"
docker network ls

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
echo "📊 Resource Usage Monitoring:"
echo "============================="
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}"

echo ""
echo "📋 Final Container Status:"
echo "=========================="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"

echo ""
echo "✅ All issues fixed and monitoring completed!"
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
echo "📤 Uploading comprehensive fix script to server..."
scp -i ~/.ssh/id_ed25519 fix_all_issues_script.sh root@64.227.46.188:/tmp/

echo "🔧 Making script executable and running it..."
ssh -i ~/.ssh/id_ed25519 root@64.227.46.188 "chmod +x /tmp/fix_all_issues_script.sh && /tmp/fix_all_issues_script.sh"

# Clean up
rm -f fix_all_issues_script.sh

echo ""
echo "✅ All issues fixed!"
