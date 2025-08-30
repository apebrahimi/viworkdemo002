#!/bin/bash

echo "🔍 Testing ViWorkS macOS Client Connection to DigitalOcean Backend"
echo "=================================================================="

BACKEND_URL="https://walrus-app-5hly8.ondigitalocean.app"

echo "📡 Testing backend connectivity..."
if curl -s --connect-timeout 10 "$BACKEND_URL/health" > /dev/null; then
    echo "✅ Backend is reachable"
else
    echo "❌ Backend is not reachable"
    exit 1
fi

echo "🔐 Testing authentication endpoint..."
if curl -s --connect-timeout 10 "$BACKEND_URL/api/v1/auth/login" > /dev/null; then
    echo "✅ Authentication endpoint is accessible"
else
    echo "❌ Authentication endpoint is not accessible"
    exit 1
fi

echo ""
echo "🎯 Configuration Summary:"
echo "   Backend URL: $BACKEND_URL"
echo "   Frontend URL: https://clownfish-app-hylwo.ondigitalocean.app"
echo ""
echo "📱 macOS Client is ready to connect to DigitalOcean deployment!"
echo "   Run: ./target/release/viworks-desktop"
echo ""
echo "🔑 Demo Credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo "   or"
echo "   Username: keyvan"
echo "   Password: demo123"
