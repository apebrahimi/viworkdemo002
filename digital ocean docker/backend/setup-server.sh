#!/bin/bash

# ViWorkS Backend Server Setup Script
# Run this on the Digital Ocean server to set up the backend service

set -e

echo "🚀 Setting up ViWorkS Backend on server..."

# Create backend directory
mkdir -p /root/viworks-backend

# Install systemd service
cp viworks-backend.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable viworks-backend

echo "✅ Server setup complete!"
echo "📋 To start the backend: systemctl start viworks-backend"
echo "📋 To check status: systemctl status viworks-backend"
echo "📋 To view logs: journalctl -u viworks-backend -f"
