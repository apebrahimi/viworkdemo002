#!/bin/bash
set -e

echo "📋 Getting Complete Container List from DigitalOcean Server"
echo "=========================================================="

# Check if SSH key exists
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "❌ Error: SSH key not found at ~/.ssh/id_ed25519"
    exit 1
fi

echo "🔑 Using SSH key: ~/.ssh/id_ed25519"

# Create the container list script
cat > container_list_script.sh << 'EOF'
#!/bin/bash
set -e

echo "📋 Complete Container List - DigitalOcean Server"
echo "================================================"
echo "Server: $(hostname)"
echo "Date: $(date)"
echo ""

echo "🔍 All Docker Containers (Running and Stopped):"
echo "-----------------------------------------------"
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}" || echo "Docker not available"

echo ""
echo "📊 Running Containers Only:"
echo "---------------------------"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}" || echo "No running containers"

echo ""
echo "🔍 Container Details by Category:"
echo "================================="

echo ""
echo "🚀 ViWorks Application Containers:"
echo "----------------------------------"
docker ps -a | grep -E "(viworks-backend|viworks-frontend|viworks-postgres|viworks-redis)" || echo "No ViWorks application containers found"

echo ""
echo "🌐 Nginx Containers:"
echo "-------------------"
docker ps -a | grep -i nginx || echo "No nginx containers found"

echo ""
echo "🌍 Website Containers:"
echo "---------------------"
docker ps -a | grep -E "(website|viworkswebsite)" || echo "No website containers found"

echo ""
echo "🔧 Gateway/Agent Containers:"
echo "----------------------------"
docker ps -a | grep -E "(gateway|agent)" || echo "No gateway/agent containers found"

echo ""
echo "🛠️  Temporary/Build Containers:"
echo "-------------------------------"
docker ps -a | grep -E "(temp|rebuild|build)" || echo "No temporary containers found"

echo ""
echo "📊 Container Statistics:"
echo "======================="
echo "Total containers: $(docker ps -a | wc -l)"
echo "Running containers: $(docker ps | wc -l)"
echo "Stopped containers: $(docker ps -a | grep -c "Exited\|Created")"

echo ""
echo "🔍 Container Health Status:"
echo "==========================="
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "(healthy|unhealthy)" || echo "No health status information"

echo ""
echo "🌐 Network Information:"
echo "======================"
echo "Docker networks:"
docker network ls || echo "No networks found"

echo ""
echo "📋 Container Summary by Status:"
echo "==============================="
echo "✅ Healthy containers:"
docker ps --format "table {{.Names}}\t{{.Status}}" | grep "healthy" || echo "None"

echo ""
echo "❌ Unhealthy containers:"
docker ps --format "table {{.Names}}\t{{.Status}}" | grep "unhealthy" || echo "None"

echo ""
echo "🔄 Restarting containers:"
docker ps -a --format "table {{.Names}}\t{{.Status}}" | grep "Restarting" || echo "None"

echo ""
echo "⏹️  Stopped containers:"
docker ps -a --format "table {{.Names}}\t{{.Status}}" | grep "Exited" || echo "None"

echo ""
echo "🔍 Container Resource Usage:"
echo "============================"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" || echo "No resource usage data"

echo ""
echo "✅ Container list complete!"
EOF

# Upload and execute the script on the server
echo "📤 Uploading container list script to server..."
scp -i ~/.ssh/id_ed25519 container_list_script.sh root@64.227.46.188:/tmp/

echo "🔧 Making script executable and running it..."
ssh -i ~/.ssh/id_ed25519 root@64.227.46.188 "chmod +x /tmp/container_list_script.sh && /tmp/container_list_script.sh"

# Clean up
rm -f container_list_script.sh

echo ""
echo "✅ Container list retrieval completed!"
