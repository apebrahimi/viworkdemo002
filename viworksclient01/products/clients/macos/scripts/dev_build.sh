#!/bin/bash

# ViWorkS macOS Client Development Build Script
# This script builds the client for development/testing purposes

set -e

echo "=== ViWorkS macOS Client Development Build ==="

# Check if we're in the right directory
if [ ! -f "Cargo.toml" ]; then
    echo "Error: Cargo.toml not found. Please run this script from the project root."
    exit 1
fi

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "Error: Rust/Cargo not found. Please install Rust first."
    echo "Visit: https://rustup.rs/"
    exit 1
fi

# Check if required tools are installed
echo "Checking dependencies..."

# Check for Homebrew (optional)
if command -v brew &> /dev/null; then
    echo "✓ Homebrew found"
else
    echo "⚠ Homebrew not found (optional for development)"
fi

# Check for Xcode Command Line Tools
if xcode-select -p &> /dev/null; then
    echo "✓ Xcode Command Line Tools found"
else
    echo "Error: Xcode Command Line Tools not found."
    echo "Please install with: xcode-select --install"
    exit 1
fi

# Clean previous builds
echo "Cleaning previous builds..."
cargo clean

# Update dependencies
echo "Updating dependencies..."
cargo update

# Build in development mode
echo "Building in development mode..."
cargo build --workspace

# Build the desktop app specifically
echo "Building desktop application..."
cargo build --package viworks-desktop

echo "=== Build completed successfully ==="
echo "Development binary location: target/debug/viworks-desktop"
echo ""
echo "To run the application:"
echo "  ./target/debug/viworks-desktop"
echo ""
echo "To run with logging:"
echo "  RUST_LOG=debug ./target/debug/viworks-desktop"
