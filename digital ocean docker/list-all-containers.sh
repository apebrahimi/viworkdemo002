#!/bin/bash
set -e

echo "📋 Complete Container List - DigitalOcean Server"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Please run this script from the 'digital ocean docker' directory."
    exit 1
fi

echo "🔍 All Docker Containers (Running and Stopped):"
echo "-----------------------------------------------"
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"

echo ""
echo "📊 Running Containers Only:"
echo "---------------------------"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"

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
docker network ls

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
echo "✅ Container list complete!"
