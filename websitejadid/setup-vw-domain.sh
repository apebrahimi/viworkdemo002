#!/bin/bash

# Setup script for website-vw.neuratalent.com domain
# This script will configure Nginx and SSL for the new subdomain

set -e

echo "🌐 Setting up domain configuration for website-vw.neuratalent.com..."

# Configuration
DOMAIN="website-vw.neuratalent.com"
SERVER_IP="64.227.46.188"
NGINX_CONFIG="/etc/nginx/sites-available/website-vw"
NGINX_ENABLED="/etc/nginx/sites-enabled/website-vw"

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
scp -o StrictHostKeyChecking=no nginx-website-config-vw.conf root@${SERVER_IP}:/tmp/website-vw.conf

print_status "Configuring Nginx on server..."
ssh -o StrictHostKeyChecking=no root@${SERVER_IP} << EOF
    # Move the config file to the correct location
    mv /tmp/website-vw.conf ${NGINX_CONFIG}
    
    # Create symlink to enable the site
    ln -sf ${NGINX_CONFIG} ${NGINX_ENABLED}
    
    # Test Nginx configuration
    nginx -t
    
    # Reload Nginx
    systemctl reload nginx
    
    echo "Nginx configuration updated successfully"
EOF

print_status "✅ Domain configuration setup completed!"
print_status "🌐 Website should be available at: http://${DOMAIN}"
print_status ""
print_status "📋 Next steps:"
print_status "1. Wait for DNS propagation (usually 5-15 minutes)"
print_status "2. Test the website: curl -I http://${DOMAIN}"
print_status "3. To add HTTPS later, run: ./get-ssl-cert-vw.sh"
print_status ""
print_status "🔗 Your website will be accessible at:"
print_status "   http://${DOMAIN}"
