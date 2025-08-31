#!/bin/bash
set -e

echo "🔗 Connecting all containers to viworks-network..."

# Create network if it doesn't exist
echo "🌐 Creating viworks-network..."
docker network create viworks-network || true

# Connect frontend container
echo "🔗 Connecting viworks-frontend to network..."
docker network connect viworks-network viworks-frontend || true

# Connect backend container
echo "🔗 Connecting viworks-backend to network..."
docker network connect viworks-network viworks-backend || true

# Connect website container
echo "🔗 Connecting viworkswebsite to network..."
docker network connect viworks-network viworkswebsite || true

# Connect postgres container
echo "🔗 Connecting viworks-postgres to network..."
docker network connect viworks-network viworks-postgres || true

# Connect redis container
echo "🔗 Connecting viworks-redis to network..."
docker network connect viworks-network viworks-redis || true

# List all containers in the network
echo "📊 Containers in viworks-network:"
docker network inspect viworks-network --format='{{range .Containers}}{{.Name}} {{end}}'

echo "✅ All containers connected to viworks-network!"
echo ""
echo "🌐 Network details:"
docker network inspect viworks-network --format='{{json .}}' | jq '.'
