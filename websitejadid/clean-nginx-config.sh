#!/bin/bash

# Create a clean Nginx configuration by removing all Certbot-generated conflicts

# Backup current configuration
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)

# Remove the problematic conditional redirect block
sed -i '/if ($host = website-vw.neuratalent.com)/,/} # managed by Certbot/d' /etc/nginx/nginx.conf

# Remove the malformed SSL configuration from HTTP redirect block
sed -i '/listen 443 ssl; # managed by Certbot/,/ssl_dhparam \/etc\/letsencrypt\/ssl-dhparams.pem; # managed by Certbot/d' /etc/nginx/nginx.conf

# Fix the HTTP redirect block structure
sed -i 's/    return 301 https:\/\/$server_name$request_uri;/    return 301 https:\/\/$server_name$request_uri;\n    }/' /etc/nginx/nginx.conf

# Test configuration
nginx -t

if [ $? -eq 0 ]; then
    echo "Configuration is valid. Reloading Nginx..."
    systemctl reload nginx
    echo "Nginx configuration cleaned successfully!"
else
    echo "Configuration test failed. Restoring backup..."
    cp /etc/nginx/nginx.conf.backup.* /etc/nginx/nginx.conf
    nginx -t && systemctl reload nginx
    echo "Backup restored."
fi
