#!/bin/bash
set -e

echo "🔧 Setting up ViWorks Docker Networks..."

# Create networks if they don't exist (idempotent)
echo "📡 Creating viworks-public network..."
docker network create --driver bridge viworks-public 2>/dev/null || echo "✅ Network viworks-public already exists"

echo "🔒 Creating viworks-internal network..."
docker network create --driver bridge --internal viworks-internal 2>/dev/null || echo "✅ Network viworks-internal already exists"

# Verify networks exist
echo "🔍 Verifying networks..."
docker network ls | grep viworks

echo "✅ Network setup completed successfully!"
echo ""
echo "🌐 Networks ready:"
echo "   - viworks-public: External traffic to Nginx"
echo "   - viworks-internal: Internal service communication"
