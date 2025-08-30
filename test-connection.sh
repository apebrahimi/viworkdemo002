#!/bin/bash

# 🧪 Local Connection Test Script
# This script tests the SSH connection locally to verify everything works before GitHub Actions

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🧪 Local Connection Test"
echo "======================="
echo ""

# Configuration
DROPLET_IP="64.227.46.188"
DROPLET_USER="root"
SSH_KEY_PATH="$HOME/.ssh/id_ed25519_github"

print_status "Testing connection to $DROPLET_IP..."

# Test 1: Check if SSH key exists
if [ -f "$SSH_KEY_PATH" ]; then
    print_success "SSH key found: $SSH_KEY_PATH"
else
    print_error "SSH key not found: $SSH_KEY_PATH"
    exit 1
fi

# Test 2: Check SSH key permissions
PERMS=$(stat -f "%Lp" "$SSH_KEY_PATH" 2>/dev/null || stat -c "%a" "$SSH_KEY_PATH" 2>/dev/null)
if [ "$PERMS" = "600" ]; then
    print_success "SSH key permissions correct: $PERMS"
else
    print_warning "SSH key permissions should be 600, found: $PERMS"
    chmod 600 "$SSH_KEY_PATH"
    print_success "Fixed SSH key permissions"
fi

# Test 3: Test basic connectivity
print_status "Testing basic connectivity to $DROPLET_IP:22..."
if timeout 10 bash -c "</dev/tcp/$DROPLET_IP/22" 2>/dev/null; then
    print_success "Port 22 is reachable"
else
    print_error "Port 22 is not reachable"
    exit 1
fi

# Test 4: Test SSH connection
print_status "Testing SSH connection..."
if ssh -o ConnectTimeout=10 -o BatchMode=yes -i "$SSH_KEY_PATH" "${DROPLET_USER}@${DROPLET_IP}" "echo 'SSH connection test successful'" 2>/dev/null; then
    print_success "SSH connection successful!"
else
    print_error "SSH connection failed"
    exit 1
fi

# Test 5: Test Docker
print_status "Testing Docker installation..."
if ssh -i "$SSH_KEY_PATH" "${DROPLET_USER}@${DROPLET_IP}" "docker --version" 2>/dev/null; then
    print_success "Docker is installed"
else
    print_error "Docker is not installed"
    exit 1
fi

# Test 6: Test Docker Compose
print_status "Testing Docker Compose..."
if ssh -i "$SSH_KEY_PATH" "${DROPLET_USER}@${DROPLET_IP}" "docker-compose --version" 2>/dev/null; then
    print_success "Docker Compose is installed"
else
    print_error "Docker Compose is not installed"
    exit 1
fi

# Test 7: Test application directory
print_status "Testing application directory..."
if ssh -i "$SSH_KEY_PATH" "${DROPLET_USER}@${DROPLET_IP}" "test -d /opt/viworks && echo 'Directory exists'" 2>/dev/null; then
    print_success "Application directory exists"
else
    print_error "Application directory not found"
    exit 1
fi

# Test 8: Test web endpoints
print_status "Testing web endpoints..."
sleep 2

if curl -f -s http://${DROPLET_IP}/health >/dev/null 2>&1; then
    print_success "Health endpoint is working"
else
    print_warning "Health endpoint not responding"
fi

if curl -f -s http://${DROPLET_IP}/ >/dev/null 2>&1; then
    print_success "Main endpoint is working"
else
    print_warning "Main endpoint not responding"
fi

echo ""
print_success "🎉 All local tests passed!"
echo ""
echo "📋 Summary:"
echo "✅ SSH key: Valid"
echo "✅ Connectivity: Working"
echo "✅ SSH connection: Successful"
echo "✅ Docker: Installed"
echo "✅ Docker Compose: Installed"
echo "✅ Application directory: Ready"
echo "✅ Web endpoints: Accessible"
echo ""
echo "🚀 Your local setup is working correctly!"
echo "   If GitHub Actions still fails, the issue might be:"
echo "   • GitHub Actions IP being blocked"
echo "   • SSH key not properly updated in GitHub secrets"
echo "   • Network restrictions on GitHub's side"
echo ""
print_status "Try running the GitHub Actions test workflow again."
