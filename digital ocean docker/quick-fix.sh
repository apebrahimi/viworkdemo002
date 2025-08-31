#!/bin/bash
set -e

echo "🔧 Quick Fix for ViWorks Deployment Issues"

# Stop and remove all containers
echo "🛑 Stopping and removing containers..."
docker-compose down --timeout 10 || true
docker rm -f viworks-backend viworks-frontend viworks-postgres viworks-redis 2>/dev/null || true

# Clean up
echo "🧹 Cleaning up..."
docker image prune -f
docker network prune -f || true

# Rebuild and start
echo "🔨 Rebuilding and starting..."
docker-compose up -d --build --force-recreate

echo "✅ Quick fix completed!"
echo "📊 Status:"
docker-compose ps
