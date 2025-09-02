#!/bin/bash
set -e

echo "🔍 Checking Remote Server Container Status"
echo "=========================================="

# Server details
SERVER_IP="64.227.46.188"
SERVER_USER="root"
SSH_KEY="~/.ssh/id_ed25519"

echo "🌐 Server: $SERVER_USER@$SERVER_IP"
echo "🔑 SSH Key: $SSH_KEY"
echo ""

# Check if SSH key exists
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "❌ Error: SSH key not found at ~/.ssh/id_ed25519"
    exit 1
fi

echo "🔍 Testing SSH connection..."
if ssh -i ~/.ssh/id_ed25519 -o ConnectTimeout=10 -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "echo 'SSH connection successful'" > /dev/null 2>&1; then
    echo "✅ SSH connection successful"
else
    echo "❌ SSH connection failed"
    exit 1
fi

echo ""
echo "📊 Container Status:"
echo "===================="

# Check container status
ssh -i ~/.ssh/id_ed25519 -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'REMOTE_SCRIPT'
cd /opt/viworks/"digital ocean docker"

echo "🔍 Current Docker Containers:"
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"

echo ""
echo "🔍 ViWorks Containers Status:"
docker ps -a | grep viworks || echo "No viworks containers found"

echo ""
echo "🔍 Docker Networks:"
docker network ls

echo ""
echo "🔍 Docker Volumes:"
docker volume ls | grep viworks || echo "No viworks volumes found"

echo ""
echo "🔍 Recent Container Logs:"
echo "Backend logs (last 5 lines):"
docker logs viworks-backend --tail=5 2>/dev/null || echo "No backend logs found"

echo ""
echo "Frontend logs (last 5 lines):"
docker logs viworks-frontend --tail=5 2>/dev/null || echo "No frontend logs found"

echo ""
echo "Nginx logs (last 5 lines):"
docker logs viworks-nginx --tail=5 2>/dev/null || echo "No nginx logs found"

echo ""
echo "🔍 Port Usage Check:"
netstat -tulpn | grep -E ':(80|443|3000|8081|5432|6379)' 2>/dev/null || echo "No services found on checked ports"

echo ""
echo "🔍 Container Resource Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | grep viworks 2>/dev/null || echo "No viworks containers running"
REMOTE_SCRIPT

echo ""
echo "✅ Remote status check completed!"
