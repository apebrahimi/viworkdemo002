#!/bin/bash
set -e

echo "🔍 Connecting to DigitalOcean Server (64.227.46.188)"
echo "=================================================="

# Check if SSH key exists
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "❌ Error: SSH key not found at ~/.ssh/id_ed25519"
    echo "Please ensure your SSH key is properly configured."
    exit 1
fi

echo "🔑 Using SSH key: ~/.ssh/id_ed25519"

# Test SSH connection first
echo "🔍 Testing SSH connection..."
ssh -o ConnectTimeout=10 -i ~/.ssh/id_ed25519 root@64.227.46.188 "echo 'SSH connection successful'" || {
    echo "❌ SSH connection failed. Please check:"
    echo "1. SSH key is correct"
    echo "2. Server IP is correct"
    echo "3. Firewall allows SSH access"
    exit 1
}

echo "✅ SSH connection successful!"

# Create the server check script
cat > server_check_script.sh << 'EOF'
#!/bin/bash
set -e

echo "🔍 DigitalOcean Server Status Check"
echo "==================================="
echo "Server: $(hostname)"
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo ""

echo "📊 Current Docker Containers:"
echo "----------------------------"
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}" || echo "Docker not available"

echo ""
echo "🔍 ViWorks Containers Status:"
echo "-----------------------------"
docker ps -a | grep viworks || echo "No viworks containers found"

echo ""
echo "📋 All Running Containers:"
echo "--------------------------"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}" || echo "No running containers"

echo ""
echo "🔍 Docker Networks:"
echo "------------------"
docker network ls || echo "Docker networks not available"

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
if [ -f "/opt/viworks/digital ocean docker/docker-compose.yml" ]; then
    grep -i nginx "/opt/viworks/digital ocean docker/docker-compose.yml" || echo "No nginx service found in docker-compose.yml"
else
    echo "docker-compose.yml not found"
fi

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
echo "🔍 Application Directory Check:"
echo "------------------------------"
if [ -d "/opt/viworks" ]; then
    echo "✅ ViWorks application directory found: /opt/viworks"
    ls -la /opt/viworks/
    
    if [ -d "/opt/viworks/digital ocean docker" ]; then
        echo ""
        echo "✅ Docker directory found: /opt/viworks/digital ocean docker"
        ls -la "/opt/viworks/digital ocean docker/"
        
        echo ""
        echo "🔍 Docker Compose Status:"
        echo "------------------------"
        cd "/opt/viworks/digital ocean docker" && docker-compose ps 2>/dev/null || echo "Docker compose not available or no services running"
        
        echo ""
        echo "🔍 Recent Container Logs:"
        echo "------------------------"
        echo "Backend logs (last 10 lines):"
        cd "/opt/viworks/digital ocean docker" && docker-compose logs --tail=10 backend 2>/dev/null || echo "No backend logs available"
        
        echo ""
        echo "Frontend logs (last 10 lines):"
        cd "/opt/viworks/digital ocean docker" && docker-compose logs --tail=10 frontend 2>/dev/null || echo "No frontend logs available"
        
        echo ""
        echo "PostgreSQL logs (last 10 lines):"
        cd "/opt/viworks/digital ocean docker" && docker-compose logs --tail=10 postgres 2>/dev/null || echo "No postgres logs available"
        
        echo ""
        echo "Redis logs (last 10 lines):"
        cd "/opt/viworks/digital ocean docker" && docker-compose logs --tail=10 redis 2>/dev/null || echo "No redis logs available"
        
        echo ""
        echo "🔍 Environment Variables Check:"
        echo "-------------------------------"
        if [ -f "/opt/viworks/digital ocean docker/env.production" ]; then
            echo "env.production file exists"
            echo "Key variables:"
            grep -E "(DATABASE_URL|REDIS_URL|JWT_SECRET)" "/opt/viworks/digital ocean docker/env.production" || echo "No key variables found"
        else
            echo "env.production file not found"
        fi
    else
        echo "❌ Docker directory not found"
    fi
else
    echo "❌ ViWorks application directory not found"
fi

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
EOF

# Upload and execute the script on the server
echo "📤 Uploading check script to server..."
scp -i ~/.ssh/id_ed25519 server_check_script.sh root@64.227.46.188:/tmp/

echo "🔧 Making script executable and running it..."
ssh -i ~/.ssh/id_ed25519 root@64.227.46.188 "chmod +x /tmp/server_check_script.sh && /tmp/server_check_script.sh"

# Clean up
rm -f server_check_script.sh

echo ""
echo "✅ Server check completed!"
