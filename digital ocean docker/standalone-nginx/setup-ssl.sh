#!/bin/bash
set -e

echo "🔒 Setting up SSL Certificates for ViWorks Domains"
echo "=================================================="

# Domain list
DOMAINS=(
    "website-vw.neuratalent.com"
    "viworks.neuratalent.com"
    "admin-viworks.neuratalent.com"
)

# Email for Let's Encrypt notifications
EMAIL="admin@neuratalent.com"

echo "📋 Step 1: Installing Certbot..."
# Install certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    apt update
    apt install -y certbot
else
    echo "Certbot is already installed"
fi

echo "📋 Step 2: Creating SSL directory..."
# Create SSL directory
mkdir -p /root/standalone-nginx/ssl

echo "📋 Step 3: Obtaining SSL certificates for each domain..."

for domain in "${DOMAINS[@]}"; do
    echo "🔐 Obtaining certificate for: $domain"
    
    # Stop nginx temporarily for certificate verification
    echo "🛑 Stopping nginx for certificate verification..."
    cd /root/standalone-nginx
    docker-compose stop
    
    # Obtain certificate using standalone mode
    certbot certonly \
        --standalone \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --domains $domain \
        --cert-path /etc/letsencrypt/live/$domain/cert.pem \
        --key-path /etc/letsencrypt/live/$domain/privkey.pem \
        --fullchain-path /etc/letsencrypt/live/$domain/fullchain.pem \
        --chain-path /etc/letsencrypt/live/$domain/chain.pem
    
    # Copy certificates to nginx ssl directory
    echo "📁 Copying certificates for $domain..."
    mkdir -p /root/standalone-nginx/ssl/live/$domain
    cp /etc/letsencrypt/live/$domain/fullchain.pem /root/standalone-nginx/ssl/live/$domain/
    cp /etc/letsencrypt/live/$domain/privkey.pem /root/standalone-nginx/ssl/live/$domain/
    
    echo "✅ Certificate obtained for $domain"
done

echo "📋 Step 4: Updating nginx configuration for HTTPS..."
# Update nginx configuration to include SSL
cd /root/standalone-nginx

echo "📋 Step 5: Starting nginx with SSL configuration..."
docker-compose up -d

echo "📋 Step 6: Testing SSL certificates..."
sleep 10

for domain in "${DOMAINS[@]}"; do
    echo "🧪 Testing HTTPS for: $domain"
    if curl -f -I https://$domain > /dev/null 2>&1; then
        echo "✅ HTTPS working for $domain"
    else
        echo "❌ HTTPS not working for $domain"
    fi
done

echo "📋 Step 7: Setting up automatic renewal..."
# Create renewal script
cat > /root/standalone-nginx/renew-ssl.sh << 'EOF'
#!/bin/bash
set -e

echo "🔄 Renewing SSL certificates..."

# Stop nginx
cd /root/standalone-nginx
docker-compose stop

# Renew certificates
certbot renew --standalone

# Copy renewed certificates
DOMAINS=("website-vw.neuratalent.com" "viworks.neuratalent.com" "admin-viworks.neuratalent.com")

for domain in "${DOMAINS[@]}"; do
    echo "📁 Copying renewed certificates for $domain..."
    mkdir -p /root/standalone-nginx/ssl/live/$domain
    cp /etc/letsencrypt/live/$domain/fullchain.pem /root/standalone-nginx/ssl/live/$domain/
    cp /etc/letsencrypt/live/$domain/privkey.pem /root/standalone-nginx/ssl/live/$domain/
done

# Start nginx
docker-compose up -d

echo "✅ SSL certificates renewed successfully!"
EOF

chmod +x /root/standalone-nginx/renew-ssl.sh

# Add to crontab for automatic renewal (every 60 days)
(crontab -l 2>/dev/null; echo "0 2 1 */2 * /root/standalone-nginx/renew-ssl.sh") | crontab -

echo ""
echo "✅ SSL Setup Completed Successfully!"
echo ""
echo "🌐 HTTPS URLs:"
for domain in "${DOMAINS[@]}"; do
    echo "   https://$domain"
done
echo ""
echo "📋 SSL certificates will be automatically renewed every 60 days"
echo "📋 Manual renewal: /root/standalone-nginx/renew-ssl.sh"
echo ""
echo "🔍 Test SSL certificates:"
echo "   openssl s_client -connect website-vw.neuratalent.com:443 -servername website-vw.neuratalent.com"
