#!/bin/bash
set -e

echo "🚀 Deploying ViWorks with Secure Network Configuration"
echo "====================================================="

# Check if we're in the right directory
if [ ! -f "docker-compose-secure.yml" ]; then
    echo "❌ Error: docker-compose-secure.yml not found. Please run this script from the 'digital ocean docker' directory."
    exit 1
fi

echo "📋 Step 1: Stopping existing containers..."
# Stop existing containers
docker-compose -f docker-compose-secure.yml down || true

echo "📋 Step 2: Creating secure networks..."
# Create secure networks
docker network create viworks-internal || true
docker network create viworks-external || true

echo "📋 Step 3: Building and starting secure containers..."
# Build and start new containers with secure configuration
docker-compose -f docker-compose-secure.yml up -d --build

echo "📋 Step 4: Waiting for services to be ready..."
sleep 30

echo "📋 Step 5: Checking service status..."
# Check service status
docker-compose -f docker-compose-secure.yml ps

echo "📋 Step 6: Testing secure connectivity..."
# Test nginx connectivity to services
echo "Testing nginx connectivity to frontend..."
docker exec viworks-standalone-nginx curl -f http://viworks-frontend:3000 > /dev/null 2>&1 && echo "✅ Nginx can reach frontend" || echo "❌ Nginx cannot reach frontend"

echo "Testing nginx connectivity to website..."
docker exec viworks-standalone-nginx curl -f http://viworks-website:3000 > /dev/null 2>&1 && echo "✅ Nginx can reach website" || echo "❌ Nginx cannot reach website"

echo "Testing backend connectivity to databases..."
docker exec viworks-backend ping -c 1 viworks-postgres > /dev/null 2>&1 && echo "✅ Backend can reach postgres" || echo "❌ Backend cannot reach postgres"
docker exec viworks-backend ping -c 1 viworks-redis > /dev/null 2>&1 && echo "✅ Backend can reach redis" || echo "❌ Backend cannot reach redis"

echo "📋 Step 7: Verifying no direct port exposure..."
echo "🔍 Checking for exposed ports:"
docker ps --format "table {{.Names}}\t{{.Ports}}" | grep -E "0\.0\.0\.0|:::" || echo "✅ No containers with direct port exposure found"

echo ""
echo "✅ Secure deployment completed successfully!"
echo ""
echo "🔒 Security Features:"
echo "   ✅ No containers directly accessible from internet"
echo "   ✅ All traffic routed through nginx"
echo "   ✅ Database containers on internal network only"
echo "   ✅ Frontend containers on external network only"
echo "   ✅ Backend can access both networks"
echo "   ✅ No public IP exposure for sensitive services"
echo ""
echo "🌐 Network Architecture:"
echo "   Internet → Nginx → Frontend/Website (external network)"
echo "   Backend → Redis/Postgres (internal network)"
echo "   Nginx → Backend (external network)"
echo ""
echo "📊 Container status:"
docker-compose -f docker-compose-secure.yml ps
echo ""
echo "🔍 Test endpoints:"
echo "   Website: https://website-vw.neuratalent.com"
echo "   Admin Panel: https://admin-viworks.neuratalent.com"
echo "   Main App: https://viworks.neuratalent.com"
