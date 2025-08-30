#!/bin/bash

# 🌐 Domain Setup Script for ViWorks
# This script sets up subdomains for viworks.neuratalent.com

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DROPLET_IP="64.227.46.188"
DOMAIN="neuratalent.com"
PROJECT="viworks"
SUBDOMAINS=("$PROJECT" "admin-$PROJECT" "api-$PROJECT" "app-$PROJECT")

echo -e "${BLUE}🌐 ViWorks Domain Setup Script${NC}"
echo "=================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if running on the droplet
if [ "$(hostname)" != "docker-ubuntu-s-2vcpu-4gb-120gb-intel-lon1-01" ]; then
    print_error "This script must be run on the DigitalOcean droplet"
    print_info "SSH into the droplet first: ssh root@$DROPLET_IP"
    exit 1
fi

print_info "Starting domain setup for $PROJECT.$DOMAIN..."

# Step 1: Install Certbot
print_info "Installing Certbot..."
apt update
apt install -y certbot python3-certbot-nginx

# Step 2: Check DNS propagation
print_info "Checking DNS propagation..."
for subdomain in "${SUBDOMAINS[@]}"; do
    full_domain="$subdomain.$DOMAIN"
    print_info "Checking $full_domain..."
    
    # Check if DNS resolves
    if nslookup "$full_domain" > /dev/null 2>&1; then
        resolved_ip=$(nslookup "$full_domain" | grep -A1 "Name:" | tail -n1 | awk '{print $2}')
        if [ "$resolved_ip" = "$DROPLET_IP" ]; then
            print_status "$full_domain resolves to $DROPLET_IP"
        else
            print_warning "$full_domain resolves to $resolved_ip (expected $DROPLET_IP)"
        fi
    else
        print_error "$full_domain does not resolve. Please add DNS record first."
        print_info "Add this DNS record in DigitalOcean:"
        echo "  Type: A"
        echo "  Name: $subdomain"
        echo "  Value: $DROPLET_IP"
        echo "  TTL: 3600"
        exit 1
    fi
done

# Step 3: Generate SSL certificates
print_info "Generating SSL certificates..."
for subdomain in "${SUBDOMAINS[@]}"; do
    full_domain="$subdomain.$DOMAIN"
    print_info "Generating certificate for $full_domain..."
    
    # Check if certificate already exists
    if [ -d "/etc/letsencrypt/live/$full_domain" ]; then
        print_warning "Certificate for $full_domain already exists"
        read -p "Regenerate? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            continue
        fi
    fi
    
    # Generate certificate
    if certbot --nginx -d "$full_domain" --non-interactive --agree-tos --email admin@$DOMAIN; then
        print_status "Certificate generated for $full_domain"
    else
        print_error "Failed to generate certificate for $full_domain"
        exit 1
    fi
done

# Step 4: Update Nginx configuration
print_info "Updating Nginx configuration..."
cd /opt/viworks

# Backup current config
cp nginx/nginx.conf nginx/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)

# Test Nginx configuration
if nginx -t; then
    print_status "Nginx configuration is valid"
else
    print_error "Nginx configuration is invalid"
    exit 1
fi

# Reload Nginx
systemctl reload nginx
print_status "Nginx reloaded successfully"

# Step 5: Test endpoints
print_info "Testing endpoints..."
sleep 5  # Wait for Nginx to fully reload

for subdomain in "${SUBDOMAINS[@]}"; do
    full_domain="$subdomain.$DOMAIN"
    print_info "Testing https://$full_domain/health"
    
    if curl -s -f "https://$full_domain/health" > /dev/null; then
        print_status "$full_domain is accessible"
    else
        print_warning "$full_domain is not accessible yet (may need DNS propagation)"
    fi
done

# Step 6: Set up automatic certificate renewal
print_info "Setting up automatic certificate renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
print_status "Certificate renewal scheduled"

# Step 7: Final status
echo
print_status "Domain setup completed!"
echo
echo "🌐 Your ViWorks applications are now accessible at:"
echo "   • Main ViWorks: https://$PROJECT.$DOMAIN"
echo "   • Admin Panel: https://admin-$PROJECT.$DOMAIN"
echo "   • API: https://api-$PROJECT.$DOMAIN"
echo "   • Frontend App: https://app-$PROJECT.$DOMAIN"
echo
echo "🔒 SSL certificates will auto-renew every 90 days"
echo "📊 Monitor your applications with: docker-compose logs -f"
echo
print_info "Setup complete! 🎉"
