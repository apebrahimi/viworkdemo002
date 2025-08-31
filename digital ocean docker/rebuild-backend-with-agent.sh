#!/bin/bash

echo "=========================================="
echo "Rebuilding Backend with Gateway Agent Integration"
echo "=========================================="

# Stop the current backend
echo "Stopping current backend..."
docker stop viworks-backend

# Build the new backend image
echo "Building new backend image..."
cd backend
docker build -t digitaloceandocker-backend:latest .

# Start the backend with new environment
echo "Starting backend with Gateway Agent integration..."
docker run -d \
  --name viworks-backend-new \
  --network host \
  --env-file ../env.production \
  --restart unless-stopped \
  digitaloceandocker-backend:latest

# Wait for the new backend to start
echo "Waiting for backend to start..."
sleep 10

# Test the new backend
echo "Testing new backend..."
curl -s http://localhost:8081/health

# If successful, remove the old container
echo "Removing old backend container..."
docker rm viworks-backend
docker rename viworks-backend-new viworks-backend

echo "Backend rebuild complete!"
