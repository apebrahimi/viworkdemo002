#!/bin/bash

# ViWorkS Gateway Agent Deployment Script
# Deploys the Gateway Agent to the target server (178.128.42.148)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
GATEWAY_HOST="178.128.42.148"
GATEWAY_USER="root"
AGENT_BINARY="target/release/viworks-gateway-agent"
CONFIG_FILE="agent-outbound.toml"
SERVICE_FILE="viworks-gateway-agent.service"

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

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_header "ViWorkS Gateway Agent Deployment"

# Check if binary exists
if [ ! -f "$AGENT_BINARY" ]; then
    print_error "Gateway Agent binary not found: $AGENT_BINARY"
    print_status "Please run 'cargo build --release' first"
    exit 1
fi

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    print_error "Configuration file not found: $CONFIG_FILE"
    exit 1
fi

# Check if service file exists
if [ ! -f "$SERVICE_FILE" ]; then
    print_error "Service file not found: $SERVICE_FILE"
    exit 1
fi

print_status "Deploying Gateway Agent to $GATEWAY_HOST..."

# Test SSH connection
print_status "Testing SSH connection to $GATEWAY_HOST..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes $GATEWAY_USER@$GATEWAY_HOST "echo 'SSH connection successful'" > /dev/null 2>&1; then
    print_error "Cannot connect to $GATEWAY_HOST via SSH"
    print_status "Please ensure SSH key is configured and server is accessible"
    exit 1
fi
print_success "SSH connection successful"

# Create deployment directory on target server
print_status "Creating deployment directory on target server..."
ssh $GATEWAY_USER@$GATEWAY_HOST "mkdir -p /opt/viworks/agent && chmod 755 /opt/viworks/agent"

# Copy binary to target server
print_status "Copying Gateway Agent binary to target server..."
scp $AGENT_BINARY $GATEWAY_USER@$GATEWAY_HOST:/opt/viworks/agent/viworks-gateway-agent
print_success "Binary copied successfully"

# Copy configuration to target server
print_status "Copying configuration to target server..."
scp $CONFIG_FILE $GATEWAY_USER@$GATEWAY_HOST:/opt/viworks/agent/agent-outbound.toml
print_success "Configuration copied successfully"

# Copy service file to target server
print_status "Copying systemd service file to target server..."
scp $SERVICE_FILE $GATEWAY_USER@$GATEWAY_HOST:/etc/systemd/system/viworks-gateway-agent.service
print_success "Service file copied successfully"

# Set up the agent on target server
print_status "Setting up Gateway Agent on target server..."
ssh $GATEWAY_USER@$GATEWAY_HOST << 'EOF'
    # Set proper permissions
    chmod +x /opt/viworks/agent/viworks-gateway-agent
    chmod 644 /opt/viworks/agent/agent-outbound.toml
    chmod 644 /etc/systemd/system/viworks-gateway-agent.service
    
    # Create necessary directories
    mkdir -p /opt/viworks/agent/certs
    mkdir -p /opt/Viworks/scripts_viworks
    mkdir -p /var/log/viworks
    
    # Set ownership
    chown -R root:root /opt/viworks/agent
    chown -R root:root /opt/Viworks
    chown -R root:root /var/log/viworks
    
    # Create required scripts (placeholder)
    cat > /opt/Viworks/scripts_viworks/add_user.sh << 'SCRIPT_EOF'
#!/bin/bash
# Placeholder script for adding users
echo "User $1 added successfully"
SCRIPT_EOF

    cat > /opt/Viworks/scripts_viworks/delete_user.sh << 'SCRIPT_EOF'
#!/bin/bash
# Placeholder script for deleting users
echo "User $1 deleted successfully"
SCRIPT_EOF

    cat > /opt/Viworks/scripts_viworks/add_vpn_user.sh << 'SCRIPT_EOF'
#!/bin/bash
# Placeholder script for adding VPN users
echo "VPN user $1 added successfully"
SCRIPT_EOF

    cat > /opt/Viworks/scripts_viworks/delete_vpn_user.sh << 'SCRIPT_EOF'
#!/bin/bash
# Placeholder script for deleting VPN users
echo "VPN user $1 deleted successfully"
SCRIPT_EOF

    # Make scripts executable
    chmod +x /opt/Viworks/scripts_viworks/*.sh
    
    # Reload systemd
    systemctl daemon-reload
    
    # Enable service
    systemctl enable viworks-gateway-agent
    
    echo "Gateway Agent setup completed successfully"
EOF

print_success "Gateway Agent setup completed on target server"

# Start the service
print_status "Starting Gateway Agent service..."
ssh $GATEWAY_USER@$GATEWAY_HOST "systemctl start viworks-gateway-agent"

# Check service status
print_status "Checking service status..."
ssh $GATEWAY_USER@$GATEWAY_HOST "systemctl status viworks-gateway-agent --no-pager"

# Show logs
print_status "Showing recent logs..."
ssh $GATEWAY_USER@$GATEWAY_HOST "journalctl -u viworks-gateway-agent --no-pager -n 20"

print_header "Deployment Summary"
print_success "Gateway Agent deployed successfully to $GATEWAY_HOST"
print_status "Service: viworks-gateway-agent"
print_status "Binary: /opt/viworks/agent/viworks-gateway-agent"
print_status "Config: /opt/viworks/agent/agent-outbound.toml"
print_status "Logs: journalctl -u viworks-gateway-agent -f"
print_status "Status: systemctl status viworks-gateway-agent"

print_warning "Note: You may need to configure certificates and SPKI pin for full functionality"
print_status "Next steps:"
print_status "1. Configure client certificates in /opt/viworks/agent/certs/"
print_status "2. Update SPKI pin in agent-outbound.toml"
print_status "3. Test connection to Backend Agent"
