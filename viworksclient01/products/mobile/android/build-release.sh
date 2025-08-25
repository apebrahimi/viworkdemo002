#!/bin/bash

echo "==== Building ViWorks Android App Release ===="
echo ""

# Check if we have the necessary tools
if ! command -v java &> /dev/null; then
    echo "Error: Java is not installed or not in PATH"
    echo "Please install Java JDK 11 or newer"
    exit 1
fi

echo "Java version:"
java -version
echo ""

# Check if we have Android SDK
if [ -z "$ANDROID_HOME" ]; then
    echo "Warning: ANDROID_HOME is not set"
    echo "If you have Android Studio installed, you can set it to:"
    echo "export ANDROID_HOME=\$HOME/Library/Android/sdk"
    echo ""
fi

echo "Building release APK..."
echo "This will create a signed APK that you can install on your phone"
echo ""

# Try to build the release APK
if [ -f "./gradlew" ]; then
    echo "Using Gradle wrapper..."
    ./gradlew assembleRelease
else
    echo "Gradle wrapper not found. Please run this in Android Studio instead."
    echo ""
    echo "To build in Android Studio:"
    echo "1. Open the project in Android Studio"
    echo "2. Go to Build -> Build Bundle(s) / APK(s) -> Build APK(s)"
    echo "3. The APK will be created in app/build/outputs/apk/release/"
    exit 1
fi

echo ""
echo "==== Build Complete ===="
echo ""
echo "If the build was successful, you should find the APK at:"
echo "app/build/outputs/apk/release/app-release.apk"
echo ""
echo "To install on your phone:"
echo "1. Enable 'Install from Unknown Sources' in your phone settings"
echo "2. Transfer the APK to your phone"
echo "3. Open the APK file on your phone to install"
echo ""
echo "Note: This is a demo version with mock data. For production use,"
echo "you'll need to configure the backend integration."
