#!/bin/bash

# SSL Certificate script for website-viworks.neuratalent.com
# This script will obtain an SSL certificate using Certbot

set -e

echo "🔒 Setting up SSL certificate for website-viworks.neuratalent.com..."

# Configuration
DOMAIN="website-viworks.neuratalent.com"
SERVER_IP="64.227.46.188"

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

# Check if DNS is properly configured
print_status "Checking DNS configuration..."
DNS_CHECK=$(nslookup ${DOMAIN} 2>/dev/null | grep -A1 "Name:" | tail -1 | awk '{print $2}')

if [ "$DNS_CHECK" = "$SERVER_IP" ]; then
    print_status "✅ DNS is properly configured"
else
    print_error "❌ DNS is not properly configured"
    print_error "   Expected: ${DOMAIN} → ${SERVER_IP}"
    print_error "   Found: ${DOMAIN} → ${DNS_CHECK}"
    print_warning "Please add the DNS A record and wait for propagation"
    exit 1
fi

print_status "Obtaining SSL certificate..."
ssh -o StrictHostKeyChecking=no root@${SERVER_IP} << EOF
    # Get SSL certificate using Certbot
    certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos --email admin@neuratalent.com
    
    # Test Nginx configuration
    nginx -t
    
    # Reload Nginx
    systemctl reload nginx
    
    echo "SSL certificate obtained successfully"
EOF

print_status "✅ SSL certificate setup completed!"
print_status "🔗 Your website is now available at:"
print_status "   https://${DOMAIN}"
print_status ""
print_status "📋 SSL certificate will auto-renew every 60 days"
print_status "📊 Check certificate status with: certbot certificates"
