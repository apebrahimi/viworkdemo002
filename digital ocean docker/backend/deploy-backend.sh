#!/bin/bash

# ViWorkS Backend Deployment Script
# This script deploys the demo backend with authentication endpoints

set -e

echo "🚀 Starting ViWorkS Backend Deployment..."

# Configuration
SERVER_IP="64.227.46.188"
SERVER_USER="root"
BACKEND_DIR="/root/viworks-backend"
BINARY_NAME="viworks-backend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Building backend binary...${NC}"
cargo build --release

echo -e "${YELLOW}📤 Uploading backend binary to server...${NC}"
scp target/release/$BINARY_NAME $SERVER_USER@$SERVER_IP:$BACKEND_DIR/

echo -e "${YELLOW}🔧 Setting up backend on server...${NC}"
ssh $SERVER_USER@$SERVER_IP << 'EOF'
    # Create backend directory if it doesn't exist
    mkdir -p /root/viworks-backend
    
    # Stop any existing backend process
    pkill -f viworks-backend || true
    
    # Make binary executable
    chmod +x /root/viworks-backend/viworks-backend
    
    # Set environment variables
    export HOST=0.0.0.0
    export PORT=8081
    export RUST_LOG=info
    
    # Start backend in background
    cd /root/viworks-backend
    nohup ./viworks-backend > backend.log 2>&1 &
    
    # Wait a moment for startup
    sleep 3
    
    # Check if backend is running
    if curl -s http://localhost:8081/health > /dev/null; then
        echo "✅ Backend started successfully!"
    else
        echo "❌ Backend failed to start. Check logs:"
        cat backend.log
        exit 1
    fi
EOF

echo -e "${GREEN}🎉 Backend deployment completed!${NC}"
echo -e "${YELLOW}📋 Testing endpoints...${NC}"

# Test the endpoints
echo "Testing health endpoint..."
curl -s https://$SERVER_IP/health || echo "Health endpoint not accessible via HTTPS"

echo "Testing auth endpoint..."
curl -s -k https://$SERVER_IP/api/v1/auth/login -X POST -H "Content-Type: application/json" -d '{"username":"test","password":"test"}' || echo "Auth endpoint not accessible via HTTPS"

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Configure nginx to proxy /api/* requests to localhost:8081"
echo "2. Test the complete authentication flow"
echo "3. Update client applications to use the correct endpoints"
