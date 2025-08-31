#!/bin/bash

# ViWorkS Gateway Agent - Security Monitoring Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

print_status "Starting security monitoring for ViWorkS Gateway Agent..."

# Check service status
print_status "Checking service status..."
if systemctl is-active --quiet viworks-agent; then
    print_success "Service is running"
else
    print_error "Service is not running"
    systemctl status viworks-agent
fi

# Check for failed login attempts
print_status "Checking for failed login attempts..."
FAILED_ATTEMPTS=$(journalctl -u viworks-agent --since "1 hour ago" | grep -i "failed\|error\|unauthorized" | wc -l)
if [ "$FAILED_ATTEMPTS" -gt 0 ]; then
    print_warning "Found $FAILED_ATTEMPTS failed attempts in the last hour"
else
    print_success "No failed attempts detected"
fi

# Check file permissions
print_status "Checking file permissions..."
if [ "$(stat -c %a /usr/local/bin/viworks-gateway-agent)" = "755" ]; then
    print_success "Binary permissions are correct"
else
    print_warning "Binary permissions may be incorrect"
fi

if [ "$(stat -c %a /etc/viworks)" = "750" ]; then
    print_success "Configuration directory permissions are correct"
else
    print_warning "Configuration directory permissions may be incorrect"
fi

# Check for security vulnerabilities
print_status "Checking for security vulnerabilities..."
if command -v cargo-audit &> /dev/null; then
    if cargo audit --quiet; then
        print_success "No security vulnerabilities found"
    else
        print_error "Security vulnerabilities detected"
    fi
else
    print_warning "cargo-audit not available"
fi

# Check resource usage
print_status "Checking resource usage..."
MEMORY_USAGE=$(ps aux | grep viworks-gateway-agent | grep -v grep | awk '{print $4}' | head -1)
if [ -n "$MEMORY_USAGE" ]; then
    print_status "Memory usage: ${MEMORY_USAGE}%"
    if (( $(echo "$MEMORY_USAGE > 80" | bc -l) )); then
        print_warning "High memory usage detected"
    fi
fi

print_success "Security monitoring completed"
