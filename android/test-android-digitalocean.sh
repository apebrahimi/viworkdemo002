#!/bin/bash

echo "🔍 Testing ViWorkS Android App Connection to DigitalOcean Backend"
echo "================================================================="

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

echo "📱 Testing 2FA request endpoint..."
if curl -s --connect-timeout 10 "$BACKEND_URL/api/v1/auth/request-2fa" > /dev/null; then
    echo "✅ 2FA request endpoint is accessible"
else
    echo "❌ 2FA request endpoint is not accessible"
    exit 1
fi

echo ""
echo "🎯 Configuration Summary:"
echo "   Backend URL: $BACKEND_URL"
echo "   Frontend URL: https://clownfish-app-hylwo.ondigitalocean.app"
echo ""
echo "📱 Android App Configuration:"
echo "   Environment: PRODUCTION (uses DigitalOcean backend)"
echo "   API Base URL: $BACKEND_URL"
echo ""
echo "🔧 To build and install the Android app:"
echo "   ./gradlew assembleDebug"
echo "   adb install app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "🔑 Demo Credentials for testing:"
echo "   Username: admin"
echo "   Password: admin123"
echo "   or"
echo "   Username: keyvan"
echo "   Password: demo123"
echo ""
echo "📋 2FA Flow:"
echo "   1. macOS client logs in with username/password"
echo "   2. Backend requests 2FA code"
echo "   3. Android app receives 2FA request"
echo "   4. User approves on Android app"
echo "   5. macOS client receives session token"
echo "   6. VPN connection established"
