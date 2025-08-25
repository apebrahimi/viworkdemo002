#!/bin/bash

# ViWorkS macOS Client Run with Logs Script
# This script runs the client with detailed logging

set -e

echo "=== ViWorkS macOS Client (with logs) ==="

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

# Set detailed logging
export RUST_LOG=debug
export RUST_BACKTRACE=1

echo "Starting ViWorkS Client with detailed logging..."
echo "Log level: $RUST_LOG"
echo "Backtrace: enabled"
echo ""

# Run the application
exec "$BINARY_PATH"
