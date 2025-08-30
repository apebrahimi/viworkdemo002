#!/bin/bash

# ViWorkS macOS Client Test Connection Script
# This script tests the connection functionality

set -e

echo "=== ViWorkS macOS Client Connection Test ==="

# Check if we're in the right directory
if [ ! -f "Cargo.toml" ]; then
    echo "Error: Cargo.toml not found. Please run this script from the project root."
    exit 1
fi

# Check if binary exists
BINARY_PATH="./target/debug/viworks-desktop"
if [ ! -f "$BINARY_PATH" ]; then
    echo "Binary not found at $BINARY_PATH"
    echo "Building first..."
    ./scripts/fast_build.sh
fi

# Set test logging
export RUST_LOG=debug
export RUST_BACKTRACE=1

echo "Running connection test..."
echo "Log level: $RUST_LOG"
echo ""

# Run the application in test mode (if supported)
# For now, just run normally and let the user test manually
echo "Starting application for manual testing..."
echo "Please test the connection functionality manually."
echo ""

exec "$BINARY_PATH"
