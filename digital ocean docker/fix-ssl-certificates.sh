#!/bin/bash

echo "🔧 FIXING SSL CERTIFICATES FOR NGINX"
echo "===================================="

# Create SSL directory
mkdir -p nginx/ssl

# Generate self-signed fallback certificates
echo "📜 Generating fallback SSL certificates..."

# Generate private key
openssl genrsa -out nginx/ssl/fallback.key 2048

# Generate certificate signing request
openssl req -new -key nginx/ssl/fallback.key -out nginx/ssl/fallback.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Generate self-signed certificate
openssl x509 -req -in nginx/ssl/fallback.csr -signkey nginx/ssl/fallback.key -out nginx/ssl/fallback.crt -days 365

# Set proper permissions
chmod 600 nginx/ssl/fallback.key
chmod 644 nginx/ssl/fallback.crt

echo "✅ Fallback SSL certificates generated successfully!"

# Check if Let's Encrypt certificates exist
echo ""
echo "🔍 Checking Let's Encrypt certificates..."

if [ -f "/etc/letsencrypt/live/viworks.neuratalent.com/fullchain.pem" ]; then
    echo "✅ Let's Encrypt certificates found!"
    echo "   Fullchain: /etc/letsencrypt/live/viworks.neuratalent.com/fullchain.pem"
    echo "   Private Key: /etc/letsencrypt/live/viworks.neuratalent.com/privkey.pem"
else
    echo "⚠️  Let's Encrypt certificates not found!"
    echo "   Using fallback self-signed certificates"
    echo "   To get real certificates, run:"
    echo "   certbot certonly --standalone -d viworks.neuratalent.com -d admin-viworks.neuratalent.com -d app-viworks.neuratalent.com"
fi

echo ""
echo "🚀 Now let's restart nginx with the fixed configuration..."

# Copy the fixed nginx config
cp nginx/nginx-fixed.conf nginx/nginx.conf

# Restart nginx container
docker-compose restart nginx

echo ""
echo "✅ SSL issue should be fixed!"
echo "🌐 Try accessing your admin panel now:"
echo "   https://admin-viworks.neuratalent.com"
echo "   Username: changeme"
echo "   Password: changeme"
