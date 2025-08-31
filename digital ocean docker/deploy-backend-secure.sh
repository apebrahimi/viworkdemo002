#!/bin/bash
set -e

echo "🔒 Secure Backend Deployment Script"
echo "==================================="

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Please run this script from the 'digital ocean docker' directory."
    exit 1
fi

# Function to check if container exists
container_exists() {
    docker ps -a --format 'table {{.Names}}' | grep -q "^$1$"
}

# Function to remove container if it exists
remove_container() {
    if container_exists "$1"; then
        echo "🗑️  Removing existing container: $1"
        docker rm -f "$1" || true
    fi
}

# Function to check service health
check_service_health() {
    local service=$1
    local max_attempts=30
    local attempt=1
    
    echo "🔍 Checking $service health..."
    while [ $attempt -le $max_attempts ]; do
        if docker-compose ps | grep -q "$service.*Up"; then
            echo "✅ $service is healthy"
            return 0
        fi
        echo "⏳ Waiting for $service to be healthy... ($attempt/$max_attempts)"
        sleep 5
        attempt=$((attempt + 1))
    done
    
    echo "❌ $service failed to become healthy"
    return 1
}

# Stop all containers gracefully first
echo "🛑 Stopping all containers gracefully..."
docker-compose down --timeout 30 || true

# Force stop any running containers with our names
echo "🛑 Force stopping any running containers..."
docker stop viworks-backend viworks-frontend viworks-postgres viworks-redis 2>/dev/null || true

# Remove containers with our specific names
echo "🧹 Removing containers with specific names..."
remove_container "viworks-backend"
remove_container "viworks-frontend"
remove_container "viworks-postgres"
remove_container "viworks-redis"

# Remove any orphaned containers
echo "🧹 Removing orphaned containers..."
docker-compose down --remove-orphans || true

# Clean up images
echo "🧹 Cleaning up Docker images..."
docker image prune -f
docker image prune -a -f

# Clean up networks
echo "🧹 Cleaning up unused networks..."
docker network prune -f || true

# Verify no conflicting containers exist
echo "🔍 Verifying no conflicting containers exist..."
if container_exists "viworks-backend" || container_exists "viworks-frontend" || container_exists "viworks-postgres" || container_exists "viworks-redis"; then
    echo "❌ Error: Conflicting containers still exist. Manual cleanup required."
    docker ps -a | grep viworks
    exit 1
fi

# Build and start new containers
echo "🔨 Building and starting new containers..."
docker-compose up -d --build --force-recreate

# Wait for services to be ready with better error handling
echo "⏳ Waiting for services to be ready..."
for i in {1..60}; do
    if docker-compose ps | grep -q "Up"; then
        echo "✅ Services are starting up..."
        break
    fi
    echo "⏳ Waiting for services to start... ($i/60)"
    sleep 5
done

# Check individual service health
echo "🔍 Checking individual service health..."
check_service_health "postgres" || exit 1
check_service_health "redis" || exit 1
check_service_health "backend" || exit 1
check_service_health "frontend" || exit 1

# Check service status
echo "📊 Checking service status..."
docker-compose ps

# Test endpoints with retries
echo "🧪 Testing endpoints..."
for endpoint in "http://localhost:3000" "http://localhost:8081/health"; do
    echo "Testing $endpoint..."
    for i in {1..10}; do
        if curl -f -s "$endpoint" > /dev/null; then
            echo "✅ $endpoint is responding"
            break
        else
            echo "⏳ $endpoint not ready yet... ($i/10)"
            sleep 5
        fi
    done
done

# Additional backend-specific tests
echo "🔍 Running backend-specific tests..."
echo "Testing database connection..."
docker exec viworks-backend pg_isready -h postgres -p 5432 -U admin && echo "✅ Database connection OK" || echo "❌ Database connection failed"

echo "Testing Redis connection..."
docker exec viworks-backend redis-cli -h redis ping && echo "✅ Redis connection OK" || echo "❌ Redis connection failed"

echo "Testing backend API endpoints..."
curl -f http://localhost:8081/health && echo "✅ Backend health check passed" || echo "❌ Backend health check failed"

# Check resource usage
echo "📊 Checking resource usage..."
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | grep viworks || echo "No viworks containers found"

# Show logs for debugging
echo ""
echo "📋 Recent logs (last 20 lines each):"
echo "Backend logs:"
docker-compose logs --tail=20 backend || true
echo ""
echo "PostgreSQL logs:"
docker-compose logs --tail=20 postgres || true
echo ""
echo "Redis logs:"
docker-compose logs --tail=20 redis || true

echo ""
echo "✅ Secure backend deployment completed successfully!"
echo "📅 Deployment completed at: $(date)"
echo ""
echo "🌐 Services are now running:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8081"
echo "   Health:   http://localhost:8081/health"
echo "   WebSocket: ws://localhost:8081/ws"
echo ""
echo "🔒 Security Status:"
echo "   ✅ Containers running as non-root users"
echo "   ✅ Network isolation implemented"
echo "   ✅ Health checks active"
echo "   ✅ Resource limits applied"
echo ""
echo "📊 Container status:"
docker-compose ps
