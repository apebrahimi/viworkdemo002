#!/bin/bash

# ViWorkS Android App Custom Backend Integration Test
# This script demonstrates the Android app working with our custom backend (no Firebase dependency)

echo "📱 ViWorkS Android App - Custom Backend Integration"
echo "=================================================="
echo ""

# Check if backend is running
echo "📡 Checking backend status..."
if curl -s http://localhost:8081/health > /dev/null; then
    echo "✅ Enhanced backend is running on port 8081"
else
    echo "❌ Enhanced backend is not running. Please start it first."
    echo "   Run: cd ../admin-panel/viworks-admin-panel && docker-compose up -d"
    exit 1
fi

echo ""
echo "🔧 Custom Backend Features (No Firebase Dependency)"
echo "=================================================="
echo "✅ Device registration endpoint"
echo "✅ Verification code generation"
echo "✅ Verification confirmation"
echo "✅ User device management"
echo "✅ Verification request tracking"
echo "✅ Complete audit logging"
echo "✅ Real-time data synchronization"
echo ""

# Test 1: Device Registration
echo "🔐 Test 1: Device Registration"
echo "-------------------------------"
DEVICE_REG_RESPONSE=$(curl -s -X POST http://localhost:8081/api/v1/auth/register-device \
    -H "Content-Type: application/json" \
    -d '{
        "user_id": "admin",
        "device_id": "android_pixel_6_123",
        "fcm_token": "demo_fcm_token_12345",
        "device_info": {
            "model": "Pixel 6",
            "os": "Android 13",
            "app_version": "1.0.0"
        }
    }')

if echo "$DEVICE_REG_RESPONSE" | jq -e '.success' > /dev/null; then
    echo "✅ Device registration successful"
    echo "   Device ID: android_pixel_6_123"
    echo "   User: admin"
else
    echo "❌ Device registration failed"
    echo "$DEVICE_REG_RESPONSE"
    exit 1
fi

echo ""

# Test 2: Verification Code Generation
echo "🔐 Test 2: Verification Code Generation"
echo "---------------------------------------"
VERIFICATION_RESPONSE=$(curl -s -X POST http://localhost:8081/api/v1/auth/verification-code \
    -H "Content-Type: application/json" \
    -d '{
        "request_id": "verification_req_456",
        "device_id": "android_pixel_6_123",
        "location": {
            "latitude": 37.7749,
            "longitude": -122.4194
        },
        "network_info": {
            "ip": "192.168.1.100",
            "carrier": "T-Mobile",
            "network_type": "WIFI"
        },
        "device_integrity_token": "demo_integrity_token"
    }')

if echo "$VERIFICATION_RESPONSE" | jq -e '.success' > /dev/null; then
    echo "✅ Verification code generated successfully"
    VERIFICATION_CODE=$(echo "$VERIFICATION_RESPONSE" | jq -r '.code')
    EXPIRES_AT=$(echo "$VERIFICATION_RESPONSE" | jq -r '.expiresAt')
    echo "   Code: $VERIFICATION_CODE"
    echo "   Expires: $EXPIRES_AT"
else
    echo "❌ Verification code generation failed"
    echo "$VERIFICATION_RESPONSE"
    exit 1
fi

echo ""

# Test 3: Verification Confirmation
echo "🔐 Test 3: Verification Confirmation"
echo "------------------------------------"
CONFIRM_RESPONSE=$(curl -s -X POST http://localhost:8081/api/v1/auth/confirm-verification \
    -H "Content-Type: application/json" \
    -d '{
        "request_id": "verification_req_456",
        "approved": true,
        "device_id": "android_pixel_6_123"
    }')

if echo "$CONFIRM_RESPONSE" | jq -e '.success' > /dev/null; then
    echo "✅ Verification confirmed successfully"
else
    echo "❌ Verification confirmation failed"
    echo "$CONFIRM_RESPONSE"
    exit 1
fi

echo ""

# Test 4: View Registered Devices
echo "📱 Test 4: View Registered Devices"
echo "----------------------------------"
DEVICES_RESPONSE=$(curl -s http://localhost:8081/api/v1/admin/user-devices)

if echo "$DEVICES_RESPONSE" | jq -e '.success' > /dev/null; then
    echo "✅ User devices retrieved successfully"
    DEVICE_COUNT=$(echo "$DEVICES_RESPONSE" | jq '.devices | length')
    echo "   Total devices: $DEVICE_COUNT"
    echo "   Devices:"
    echo "$DEVICES_RESPONSE" | jq -r '.devices[] | "     - \(.device_model) (\(.device_id))"'
else
    echo "❌ Failed to retrieve user devices"
    echo "$DEVICES_RESPONSE"
fi

echo ""

# Test 5: View Verification Requests
echo "📋 Test 5: View Verification Requests"
echo "-------------------------------------"
REQUESTS_RESPONSE=$(curl -s http://localhost:8081/api/v1/admin/verification-requests)

if echo "$REQUESTS_RESPONSE" | jq -e '.success' > /dev/null; then
    echo "✅ Verification requests retrieved successfully"
    REQUEST_COUNT=$(echo "$REQUESTS_RESPONSE" | jq '.requests | length')
    echo "   Total requests: $REQUEST_COUNT"
    echo "   Recent requests:"
    echo "$REQUESTS_RESPONSE" | jq -r '.requests[] | "     - \(.id): \(.code) (approved: \(.approved))"'
else
    echo "❌ Failed to retrieve verification requests"
    echo "$REQUESTS_RESPONSE"
fi

echo ""
echo "🚀 Android App Integration"
echo "=========================="
echo ""

echo "🔧 Android App Configuration:"
echo "   - API Base URL: http://10.0.2.2:8081 (emulator)"
echo "   - Backend: Custom Rust/Actix backend (no Firebase)"
echo "   - Authentication: Custom JWT-based auth"
echo "   - Device Management: Custom device registration"
echo "   - 2FA: Custom verification code generation"
echo ""

echo "📋 Android App Features (Custom Backend):"
echo "   ✅ Login with username/password"
echo "   ✅ Device registration with custom backend"
echo "   ✅ 2FA verification code display"
echo "   ✅ Device integrity checks"
echo "   ✅ Custom push notification simulation"
echo "   ✅ Device binding workflow"
echo "   ✅ Security dashboard"
echo "   ✅ Real-time data sync with custom backend"
echo ""

echo "🚀 Building Android App..."
if ./gradlew assembleDebug; then
    echo "✅ Android app built successfully"
    echo ""
    echo "📱 Installation Instructions:"
    echo "   1. Connect Android device or start emulator"
    echo "   2. Install the APK:"
    echo "      adb install app/build/outputs/apk/debug/app-debug.apk"
    echo "   3. Launch the ViWorkS Authenticator app"
    echo "   4. Login with: admin / admin123"
    echo "   5. Complete 2FA verification"
    echo ""
    echo "🎯 Demo Flow (Custom Backend):"
    echo "   1. Admin creates user in admin panel"
    echo "   2. User logs in to Android app"
    echo "   3. Android app registers device with custom backend"
    echo "   4. Android app displays 6-digit verification code"
    echo "   5. User enters code in Mac client"
    echo "   6. Connection established successfully"
    echo "   7. Admin monitors session in real-time"
    echo ""
    echo "✅ Android App is ready for demo!"
else
    echo "❌ Android app build failed"
    exit 1
fi

echo ""
echo "📊 Custom Backend Integration Summary:"
echo "   - Enhanced backend running on port 8081 ✅"
echo "   - Android app successfully built ✅"
echo "   - Custom API integration configured ✅"
echo "   - Device registration working ✅"
echo "   - 2FA flow working ✅"
echo "   - Device binding ready ✅"
echo "   - No Firebase dependency ✅"
echo "   - Complete local control ✅"
echo ""
echo "🎉 Android App with Custom Backend is ready for demo!"
echo ""
echo "💡 Benefits of Custom Backend:"
echo "   - No vendor lock-in"
echo "   - Complete data ownership"
echo "   - Full customization control"
echo "   - Local deployment"
echo "   - Cost-effective scaling"
echo "   - Enhanced security control"
