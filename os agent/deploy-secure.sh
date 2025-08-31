#!/bin/bash

# ViWorkS Gateway Agent - Secure Deployment Script

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

print_status "Starting secure deployment of ViWorkS Gateway Agent..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Security checks
print_status "Performing security checks..."

# Check for security vulnerabilities
if command -v cargo-audit &> /dev/null; then
    print_status "Running security audit..."
    if cargo audit; then
        print_success "No security vulnerabilities found"
    else
        print_error "Security vulnerabilities found - deployment aborted"
        exit 1
    fi
else
    print_warning "cargo-audit not available - skipping security audit"
fi

# Create secure directories
print_status "Creating secure directories..."
mkdir -p /etc/viworks
mkdir -p /var/log/viworks
mkdir -p /opt/Viworks/scripts_viworks

# Set secure permissions
print_status "Setting secure permissions..."
chmod 750 /etc/viworks
chmod 750 /var/log/viworks
chmod 750 /opt/Viworks

# Create viworks user if it doesn't exist
if ! id "viworks" &>/dev/null; then
    print_status "Creating viworks user..."
    useradd -r -s /bin/false -d /var/lib/viworks viworks
fi

# Set ownership
print_status "Setting ownership..."
chown -R viworks:viworks /etc/viworks /var/log/viworks /opt/Viworks

# Copy binary
print_status "Installing binary..."
cp viworks-gateway-agent /usr/local/bin/
chmod 755 /usr/local/bin/viworks-gateway-agent
chown root:root /usr/local/bin/viworks-gateway-agent

# Create systemd service with security options
print_status "Creating secure systemd service..."
cat > /etc/systemd/system/viworks-agent.service << 'SERVICE_EOF'
[Unit]
Description=ViWorkS Gateway Agent
After=network.target docker.service
Wants=docker.service

[Service]
Type=simple
User=viworks
Group=viworks
ExecStart=/usr/local/bin/viworks-gateway-agent
Restart=always
RestartSec=10
Environment=RUST_LOG=info

# Security options
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/log/viworks /etc/viworks
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictRealtime=true
RestrictSUIDSGID=true
LockPersonality=true
MemoryDenyWriteExecute=true

StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICE_EOF

# Reload systemd
print_status "Reloading systemd..."
systemctl daemon-reload

# Enable service
print_status "Enabling service..."
systemctl enable viworks-agent

print_success "Secure deployment completed!"
print_status "To start the service: sudo systemctl start viworks-agent"
print_status "To check status: sudo systemctl status viworks-agent"
print_status "To view logs: sudo journalctl -u viworks-agent -f"
