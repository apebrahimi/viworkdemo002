#!/bin/bash

echo "🧪 Testing Next.js Build Process"
echo "================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building Next.js application..."
npm run build

echo "🔍 Verifying build output..."
if [ -d ".next/standalone" ]; then
    echo "✅ Standalone build output found!"
    echo "📁 Contents of .next/standalone:"
    ls -la .next/standalone/
    
    if [ -f ".next/standalone/server.js" ]; then
        echo "✅ server.js found in standalone output"
    else
        echo "❌ server.js missing from standalone output"
    fi
    
    if [ -d ".next/standalone/.next" ]; then
        echo "✅ .next directory found in standalone output"
    else
        echo "❌ .next directory missing from standalone output"
    fi
else
    echo "❌ Standalone build output not found!"
    echo "📁 Contents of .next directory:"
    ls -la .next/
    exit 1
fi

echo "🎉 Build test completed successfully!"
