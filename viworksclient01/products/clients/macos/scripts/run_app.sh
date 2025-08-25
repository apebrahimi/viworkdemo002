#!/bin/bash

# ViWorkS macOS Client Run Script
# This script runs the client application

set -e

echo "=== ViWorkS macOS Client ==="

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

# Set default log level if not set
if [ -z "$RUST_LOG" ]; then
    export RUST_LOG=info
fi

echo "Starting ViWorkS Client..."
echo "Log level: $RUST_LOG"
echo ""

# Run the application
exec "$BINARY_PATH"
