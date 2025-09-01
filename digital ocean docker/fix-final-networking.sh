#!/bin/bash
set -e

echo "🔧 Fixing Final Networking Issue"
echo "================================="

# Check if SSH key exists
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "❌ Error: SSH key not found at ~/.ssh/id_ed25519"
    exit 1
fi

echo "🔑 Using SSH key: ~/.ssh/id_ed25519"

# Create the final networking fix script
cat > fix_final_networking_script.sh << 'EOF'
#!/bin/bash
set -e

echo "🔧 Fixing Final Networking Issue"
echo "================================="

cd /opt/viworks/"digital ocean docker"

echo "🔍 Current Issue Analysis:"
echo "=========================="
echo "Backend is trying to connect to 'postgres' and 'redis'"
echo "But containers are named 'viworks-postgres' and 'viworks-redis'"
echo "This causes network resolution failure"

echo ""
echo "🔧 Fixing docker-compose.yml with correct container names..."
echo "=========================================================="

# Create the final corrected docker-compose.yml
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

echo "✅ Docker compose file fixed with correct container names"

echo ""
echo "🔧 Fixing nginx configuration to use correct container names..."
echo "============================================================="

# Update nginx configuration to use correct container names
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

echo "✅ Nginx configuration fixed with correct container names"

echo ""
echo "🚀 Restarting services with corrected configuration..."
echo "===================================================="

# Stop and restart everything
docker-compose down
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
echo "🔍 Testing Network Connectivity..."
echo "================================="

echo "Testing backend -> postgres connectivity:"
docker exec viworks-backend ping -c 2 viworks-postgres > /dev/null 2>&1 && echo "✅ Backend can reach postgres" || echo "❌ Backend cannot reach postgres"

echo "Testing backend -> redis connectivity:"
docker exec viworks-backend ping -c 2 viworks-redis > /dev/null 2>&1 && echo "✅ Backend can reach redis" || echo "❌ Backend cannot reach redis"

echo "Testing nginx -> frontend connectivity:"
docker exec viworks-nginx ping -c 2 viworks-frontend > /dev/null 2>&1 && echo "✅ Nginx can reach frontend" || echo "❌ Nginx cannot reach frontend"

echo "Testing nginx -> backend connectivity:"
docker exec viworks-nginx ping -c 2 viworks-backend > /dev/null 2>&1 && echo "✅ Nginx can reach backend" || echo "❌ Nginx cannot reach backend"

echo ""
echo "🔍 Testing Database Connection..."
echo "================================="

echo "Testing if postgres container is accessible:"
docker exec viworks-postgres pg_isready -U admin || echo "❌ Postgres not accessible"

echo ""
echo "Testing if redis container is accessible:"
docker exec viworks-redis redis-cli ping || echo "❌ Redis not accessible"

echo ""
echo "🔍 Backend Status and Logs..."
echo "============================="

# Wait a bit for backend to start
sleep 15

echo "Backend status:"
docker-compose ps backend

echo ""
echo "Backend logs (last 15 lines):"
docker logs viworks-backend --tail=15 || echo "No backend logs found"

echo ""
echo "🔍 Testing Backend Health..."
echo "============================"

# Test if backend is responding
echo "Testing backend health endpoint:"
if curl -f -s http://localhost:8081/health > /dev/null; then
    echo "✅ Backend health endpoint is responding"
else
    echo "❌ Backend health endpoint is not responding"
fi

echo ""
echo "Testing backend through nginx:"
if curl -f -s -k https://localhost/health > /dev/null; then
    echo "✅ Backend is responding through nginx"
else
    echo "❌ Backend is not responding through nginx"
fi

echo ""
echo "📊 Final Container Status:"
echo "=========================="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"

echo ""
echo "🌐 Final Network Status:"
echo "========================"
docker network ls

echo ""
echo "✅ Final networking fix completed!"
echo ""
echo "📊 Summary:"
echo "----------"
echo "Total containers: $(docker ps -a | wc -l)"
echo "Running containers: $(docker ps | wc -l)"
echo "ViWorks containers: $(docker ps -a | grep viworks | wc -l)"
echo "Main app containers: $(docker-compose ps | grep -c Up)"

echo ""
echo "🔍 Network Architecture:"
echo "----------------------"
echo "Public Network: Nginx receives external traffic"
echo "Internal Network: Backend, Postgres, Redis, Frontend"
echo "Nginx bridges both networks to route traffic appropriately"
EOF

# Upload and execute the script on the server
echo "📤 Uploading final networking fix script to server..."
scp -i ~/.ssh/id_ed25519 fix_final_networking_script.sh root@64.227.46.188:/tmp/

echo "🔧 Making script executable and running it..."
ssh -i ~/.ssh/id_ed25519 root@64.227.46.188 "chmod +x /tmp/fix_final_networking_script.sh && /tmp/fix_final_networking_script.sh"

# Clean up
rm -f fix_final_networking_script.sh

echo ""
echo "✅ Final networking fix completed!"
