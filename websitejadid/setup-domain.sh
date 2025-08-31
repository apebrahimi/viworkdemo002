#!/bin/bash

# Setup script for website-viworks.neuratalent.com domain
# This script will configure Nginx and SSL for the website subdomain

set -e

echo "🌐 Setting up domain configuration for website-viworks.neuratalent.com..."

# Configuration
DOMAIN="website-viworks.neuratalent.com"
SERVER_IP="64.227.46.188"
NGINX_CONFIG="/etc/nginx/sites-available/website-viworks"
NGINX_ENABLED="/etc/nginx/sites-enabled/website-viworks"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Copying Nginx configuration to server..."
scp -o StrictHostKeyChecking=no nginx-website-config.conf root@${SERVER_IP}:/tmp/website-viworks.conf

print_status "Configuring Nginx on server..."
ssh -o StrictHostKeyChecking=no root@${SERVER_IP} << EOF
    # Move the config file to the correct location
    mv /tmp/website-viworks.conf ${NGINX_CONFIG}
    
    # Create symlink to enable the site
    ln -sf ${NGINX_CONFIG} ${NGINX_ENABLED}
    
    # Test Nginx configuration
    nginx -t
    
    # Reload Nginx
    systemctl reload nginx
    
    echo "Nginx configuration updated successfully"
EOF

print_status "✅ Domain configuration setup completed!"
print_warning "⚠️  IMPORTANT: You need to add a DNS A record for ${DOMAIN}"
print_warning "   Point ${DOMAIN} to ${SERVER_IP}"
print_warning "   Wait for DNS propagation (usually 5-15 minutes)"
print_status ""
print_status "📋 Next steps:"
print_status "1. Add DNS A record: ${DOMAIN} → ${SERVER_IP}"
print_status "2. Wait for DNS propagation"
print_status "3. Run: ./get-ssl-cert.sh"
print_status ""
print_status "🔗 After DNS is set up, your website will be available at:"
print_status "   https://${DOMAIN}"
