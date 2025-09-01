#!/bin/bash

# Single Service Deployment Script for ViWorks
# Usage: ./deploy-single-service.sh <service> [--no-validate]
# Services: postgres, redis, backend, frontend, website, agent, nginx

set -e

SERVICE=$1
SKIP_VALIDATION=$2

if [ -z "$SERVICE" ]; then
    echo "Usage: $0 <service> [--no-validate]"
    echo "Available services: postgres, redis, backend, frontend, website, agent, nginx"
    exit 1
fi

# Load environment variables
if [ -f "env.production" ]; then
    source env.production
fi

echo "🚀 Deploying single service: $SERVICE"
echo "📅 Started at: $(date)"

# Ensure networks exist
echo "🌐 Ensuring networks exist..."
docker network create --driver bridge viworks-public 2>/dev/null || echo "Network viworks-public already exists"
docker network create --driver bridge --internal viworks-internal 2>/dev/null || echo "Network viworks-internal already exists"

# Function to wait for service health
wait_for_service() {
    local service=$1
    local health_cmd=$2
    local timeout=${3:-60}
    
    echo "⏳ Waiting for $service to be healthy..."
    for i in $(seq 1 $timeout); do
        if eval "$health_cmd" > /dev/null 2>&1; then
            echo "✅ $service is healthy"
            return 0
        fi
        echo "⏳ $service not ready yet... ($i/$timeout)"
        sleep 5
    done
    echo "❌ $service failed health check after $timeout attempts"
    return 1
}

# Deploy specific service
case $SERVICE in
    postgres)
        echo "🗄️ Deploying PostgreSQL..."
        docker-compose up -d postgres
        if [ "$SKIP_VALIDATION" != "--no-validate" ]; then
            wait_for_service "PostgreSQL" "docker-compose exec -T postgres pg_isready -U admin -d viworks" 30
        fi
        ;;
    
    redis)
        echo "🔴 Deploying Redis..."
        docker-compose up -d redis
        if [ "$SKIP_VALIDATION" != "--no-validate" ]; then
            wait_for_service "Redis" "docker-compose exec -T redis redis-cli ping | grep -q PONG" 15
        fi
        ;;
    
    backend)
        echo "🦀 Deploying Backend..."
        echo "🔨 Building backend..."
        docker-compose build backend
        docker-compose up -d backend
        if [ "$SKIP_VALIDATION" != "--no-validate" ]; then
            wait_for_service "Backend" "docker-compose exec -T backend curl -f -s http://localhost:8081/health" 60
            echo "🧪 Checking database connection..."
            docker-compose logs backend | grep -q "Database connected successfully" || echo "⚠️ No database connection log found"
        fi
        ;;
    
    frontend)
        echo "⚛️ Deploying Frontend..."
        echo "🔨 Building frontend..."
        docker-compose build frontend
        docker-compose up -d frontend
        if [ "$SKIP_VALIDATION" != "--no-validate" ]; then
            wait_for_service "Frontend" "docker-compose exec -T frontend curl -f -s http://localhost:3000" 60
        fi
        ;;
    
    website)
        echo "🌐 Deploying Website..."
        echo "🔨 Building website..."
        docker-compose build website
        docker-compose up -d website
        if [ "$SKIP_VALIDATION" != "--no-validate" ]; then
            wait_for_service "Website" "docker-compose exec -T website curl -f -s http://localhost:3000" 60
        fi
        ;;
    
    agent)
        echo "🤖 Deploying Agent..."
        echo "🔨 Building agent..."
        docker-compose build agent
        docker-compose up -d agent
        if [ "$SKIP_VALIDATION" != "--no-validate" ]; then
            sleep 10
            if docker-compose ps agent | grep -q "Up"; then
                echo "✅ Agent is running"
            else
                echo "❌ Agent failed to start"
                exit 1
            fi
        fi
        ;;
    
    nginx)
        echo "🌐 Deploying Nginx..."
        docker-compose up -d nginx
        if [ "$SKIP_VALIDATION" != "--no-validate" ]; then
            wait_for_service "Nginx" "curl -f -s http://localhost/health" 30
        fi
        ;;
    
    *)
        echo "❌ Unknown service: $SERVICE"
        echo "Available services: postgres, redis, backend, frontend, website, agent, nginx"
        exit 1
        ;;
esac

echo "✅ $SERVICE deployment complete!"
echo "📊 Current status:"
docker-compose ps $SERVICE

# Show recent logs
echo "📝 Recent logs for $SERVICE:"
docker-compose logs --tail=5 $SERVICE
