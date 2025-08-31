#!/bin/bash
set -e

echo "🧹 ViWorks Container Cleanup Script"
echo "=================================="

# Function to check if container exists
container_exists() {
    docker ps -a --format 'table {{.Names}}' | grep -q "^$1$"
}

# Function to remove container if it exists
remove_container() {
    if container_exists "$1"; then
        echo "🗑️  Removing container: $1"
        docker rm -f "$1"
        echo "✅ Removed: $1"
    else
        echo "ℹ️  Container not found: $1"
    fi
}

# Stop all containers first
echo "🛑 Stopping all containers..."
docker-compose down --timeout 30 || true

# Force stop any running containers
echo "🛑 Force stopping containers..."
docker stop viworks-backend viworks-frontend viworks-postgres viworks-redis 2>/dev/null || true

# Remove containers
echo "🧹 Removing containers..."
remove_container "viworks-backend"
remove_container "viworks-frontend"
remove_container "viworks-postgres"
remove_container "viworks-redis"

# Remove orphaned containers
echo "🧹 Removing orphaned containers..."
docker-compose down --remove-orphans || true

# Clean up images
echo "🧹 Cleaning up images..."
docker image prune -f
docker image prune -a -f

# Clean up networks
echo "🧹 Cleaning up networks..."
docker network prune -f || true

echo "✅ Cleanup completed!"
echo ""
echo "📊 Current containers:"
docker ps -a | grep viworks || echo "No viworks containers found"

echo ""
echo "📊 Current images:"
docker images | grep viworks || echo "No viworks images found"
