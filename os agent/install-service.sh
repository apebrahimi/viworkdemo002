#!/bin/bash

# ViWorkS Gateway Agent Service Installation Script
# This script installs and configures the systemd service for the Gateway Agent

set -e

echo "=== ViWorkS Gateway Agent Service Installation ==="

# Configuration
SERVICE_NAME="viworks-gateway-agent"
SERVICE_FILE="viworks-gateway-agent.service"
INSTALL_DIR="/opt/viworks/agent"
BINARY_NAME="viworks-gateway-agent"
CONFIG_DIR="/opt/viworks/agent/config"
LOG_DIR="/var/log/viworks"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Error: This script must be run as root"
    exit 1
fi

echo "Installing ViWorkS Gateway Agent service..."

# Create directories
echo "Creating directories..."
mkdir -p "$INSTALL_DIR"
mkdir -p "$CONFIG_DIR"
mkdir -p "$LOG_DIR"

# Copy service file
echo "Installing systemd service file..."
cp "$SERVICE_FILE" "/etc/systemd/system/$SERVICE_NAME.service"

# Set permissions
chmod 644 "/etc/systemd/system/$SERVICE_NAME.service"

# Create environment file
echo "Creating environment file..."
cat > "$INSTALL_DIR/.env" << EOF
# ViWorkS Gateway Agent Environment
RUST_LOG=info
RUST_BACKTRACE=1
AGENT_CONFIG_PATH=$CONFIG_DIR/agent.toml
AGENT_OUTBOUND_CONFIG_PATH=$CONFIG_DIR/agent-outbound.toml
EOF

# Set permissions on environment file
chmod 600 "$INSTALL_DIR/.env"

# Copy configuration files if they exist
if [ -f "config/agent.toml" ]; then
    echo "Copying agent.toml configuration..."
    cp "config/agent.toml" "$CONFIG_DIR/"
    chmod 600 "$CONFIG_DIR/agent.toml"
fi

if [ -f "config/agent-outbound.toml" ]; then
    echo "Copying agent-outbound.toml configuration..."
    cp "config/agent-outbound.toml" "$CONFIG_DIR/"
    chmod 600 "$CONFIG_DIR/agent-outbound.toml"
fi

# Build the binary if Cargo.toml exists
if [ -f "Cargo.toml" ]; then
    echo "Building Gateway Agent binary..."
    cargo build --release
    
    if [ -f "target/release/$BINARY_NAME" ]; then
        echo "Installing binary..."
        cp "target/release/$BINARY_NAME" "$INSTALL_DIR/"
        chmod +x "$INSTALL_DIR/$BINARY_NAME"
    else
        echo "Error: Binary not found at target/release/$BINARY_NAME"
        exit 1
    fi
else
    echo "Warning: Cargo.toml not found. Please ensure the binary is installed at $INSTALL_DIR/$BINARY_NAME"
fi

# Create scripts directory
echo "Creating scripts directory..."
mkdir -p "$INSTALL_DIR/scripts"

# Copy scripts if they exist
if [ -d "scripts" ]; then
    echo "Copying scripts..."
    cp -r scripts/* "$INSTALL_DIR/scripts/"
    chmod +x "$INSTALL_DIR/scripts"/*
fi

# Set ownership
echo "Setting ownership..."
chown -R root:root "$INSTALL_DIR"
chown -R root:root "$LOG_DIR"

# Reload systemd
echo "Reloading systemd daemon..."
systemctl daemon-reload

# Enable service
echo "Enabling service..."
systemctl enable "$SERVICE_NAME"

echo "Service installation completed successfully!"
echo ""
echo "Next steps:"
echo "1. Configure the agent configuration files in $CONFIG_DIR/"
echo "2. Start the service: systemctl start $SERVICE_NAME"
echo "3. Check status: systemctl status $SERVICE_NAME"
echo "4. View logs: journalctl -u $SERVICE_NAME -f"
echo ""
echo "Configuration files:"
echo "  - $CONFIG_DIR/agent.toml"
echo "  - $CONFIG_DIR/agent-outbound.toml"
echo "  - $INSTALL_DIR/.env"
echo ""
echo "Service management:"
echo "  - Start: systemctl start $SERVICE_NAME"
echo "  - Stop: systemctl stop $SERVICE_NAME"
echo "  - Restart: systemctl restart $SERVICE_NAME"
echo "  - Status: systemctl status $SERVICE_NAME"
echo "  - Logs: journalctl -u $SERVICE_NAME -f"
