#!/bin/bash

echo "🔧 Testing macOS Client Authentication Fix"
echo "=========================================="

# Check if the binary exists
if [ ! -f "target/release/viworks-desktop" ]; then
    echo "❌ Binary not found. Please build first with: cargo build --release"
    exit 1
fi

echo "✅ Binary found: target/release/viworks-desktop"
echo ""
echo "🚀 Starting macOS client for testing..."
echo "   - Enter username: admin"
echo "   - Enter password: admin123"
echo "   - The app should transition from 'Authenticating...' to 2FA screen"
echo "   - You should see the Android authentication interface"
echo ""
echo "Press Ctrl+C to stop the test"
echo ""

# Run the client
./target/release/viworks-desktop
