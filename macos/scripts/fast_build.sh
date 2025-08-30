#!/bin/bash

# ViWorkS macOS Client Fast Build Script
# This script builds the client quickly for testing

set -e

echo "=== ViWorkS macOS Client Fast Build ==="

# Check if we're in the right directory
if [ ! -f "Cargo.toml" ]; then
    echo "Error: Cargo.toml not found. Please run this script from the project root."
    exit 1
fi

# Build only the desktop app without cleaning
echo "Building desktop application (fast mode)..."
cargo build --package viworks-desktop

echo "=== Fast build completed ==="
echo "Binary location: target/debug/viworks-desktop"
echo ""
echo "To run: ./target/debug/viworks-desktop"
