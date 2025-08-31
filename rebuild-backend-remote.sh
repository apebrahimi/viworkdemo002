#!/bin/bash

echo "=========================================="
echo "Rebuilding Backend with Gateway Agent Integration"
echo "=========================================="

# Copy the updated backend code to the server
echo "Copying updated backend code..."
tar -czf backend-update.tar.gz -C "digital ocean docker/backend" .
scp backend-update.tar.gz root@64.227.46.188:/tmp/

# Execute the rebuild on the remote server
ssh root@64.227.46.188 << 'EOF'
echo "Extracting backend code..."
cd /tmp
tar -xzf backend-update.tar.gz -C /opt/viworks-backend-update/

echo "Stopping current backend..."
docker stop viworks-backend

echo "Building new backend image..."
cd /opt/viworks-backend-update
docker build -t digitaloceandocker-backend:latest .

echo "Starting backend with Gateway Agent integration..."
docker run -d \
  --name viworks-backend-new \
  --network host \
  --env-file /opt/viworks/env.production \
  --restart unless-stopped \
  digitaloceandocker-backend:latest

echo "Waiting for backend to start..."
sleep 15

echo "Testing new backend..."
curl -s http://localhost:8081/health

echo "Removing old backend container..."
docker rm viworks-backend
docker rename viworks-backend-new viworks-backend

echo "Backend rebuild complete!"
EOF

echo "Remote backend rebuild completed!"
