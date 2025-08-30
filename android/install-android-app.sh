#!/bin/bash

echo "📱 Installing ViWorkS Android App"
echo "=================================="

APK_PATH="app/build/outputs/apk/debug/app-debug.apk"

if [ ! -f "$APK_PATH" ]; then
    echo "❌ APK not found at $APK_PATH"
    echo "Please build the app first with: ./gradlew assembleDebug"
    exit 1
fi

echo "📦 APK found: $APK_PATH"
echo "📏 Size: $(ls -lh $APK_PATH | awk '{print $5}')"

# Check if adb is available
if ! command -v adb &> /dev/null; then
    echo "❌ ADB not found. Please install Android SDK or connect device manually."
    echo "📱 Manual installation:"
    echo "   1. Copy APK to your Android device"
    echo "   2. Enable 'Install from unknown sources' in settings"
    echo "   3. Install the APK file"
    exit 1
fi

# Check for connected devices
echo "🔍 Checking for connected devices..."
adb devices

# Install the APK
echo "📥 Installing APK..."
adb install -r "$APK_PATH"

if [ $? -eq 0 ]; then
    echo "✅ Installation successful!"
    echo ""
    echo "🎯 Next Steps:"
    echo "   1. Open ViWorkS app on your Android device"
    echo "   2. Go to Settings (gear icon)"
    echo "   3. Tap 'Set Production' button"
    echo "   4. Verify API URL shows: https://walrus-app-5hly8.ondigitalocean.app"
    echo "   5. The app is now ready for 2FA authentication"
    echo ""
    echo "🔑 Demo Credentials for testing:"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo "   or"
    echo "   Username: keyvan"
    echo "   Password: demo123"
else
    echo "❌ Installation failed!"
    echo "Please check:"
    echo "   - Device is connected via USB"
    echo "   - USB debugging is enabled"
    echo "   - Device allows installation from ADB"
fi
