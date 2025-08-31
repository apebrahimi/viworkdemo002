#!/bin/bash

# Immediate fix for website-viworks.neuratalent.com domain
# This will configure HTTP-only access to get the website working immediately

set -e

echo "🔧 Fixing domain configuration immediately..."

# Configuration
SERVER_IP="64.227.46.188"
DOMAIN="website-viworks.neuratalent.com"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_status "Creating HTTP-only configuration..."
cat > /tmp/website-viworks-fixed.conf << 'EOF'
# Nginx configuration for website-viworks.neuratalent.com (HTTP only)
server {
    listen 80;
    listen [::]:80;
    server_name website-viworks.neuratalent.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Proxy to the website container
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
}
EOF

print_status "Copying configuration to server..."
scp -o StrictHostKeyChecking=no /tmp/website-viworks-fixed.conf root@${SERVER_IP}:/tmp/website-viworks-fixed.conf

print_status "Updating Nginx configuration..."
ssh -o StrictHostKeyChecking=no root@${SERVER_IP} << 'EOF'
    # Backup current configuration
    cp /etc/nginx/sites-available/website-viworks /etc/nginx/sites-available/website-viworks.backup
    
    # Replace with HTTP-only configuration
    mv /tmp/website-viworks-fixed.conf /etc/nginx/sites-available/website-viworks
    
    # Test configuration
    nginx -t
    
    # Reload Nginx
    systemctl reload nginx
    
    echo "Configuration updated successfully"
EOF

print_status "Testing the domain..."
sleep 3
curl -I http://${DOMAIN}

print_status "✅ Domain fixed! Your website should now be accessible at:"
print_status "   http://${DOMAIN}"
print_warning "⚠️  Note: This is HTTP only. To add HTTPS later, run: ./get-ssl-cert.sh"
