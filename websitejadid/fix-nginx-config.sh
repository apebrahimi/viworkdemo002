#!/bin/bash

# Fix Nginx configuration by removing problematic Certbot-generated sections

# Backup the current configuration
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)

# Remove the malformed SSL configuration from the HTTP redirect block (lines 60-66)
sed -i '60,66d' /etc/nginx/nginx.conf

# Remove the problematic conditional redirect block (lines 277-290)
sed -i '277,290d' /etc/nginx/nginx.conf

# Fix the HTTP redirect block to properly close
sed -i '56s/$/\n    }/' /etc/nginx/nginx.conf

# Test the configuration
nginx -t

if [ $? -eq 0 ]; then
    echo "Configuration is valid. Reloading Nginx..."
    systemctl reload nginx
    echo "Nginx configuration fixed successfully!"
else
    echo "Configuration test failed. Restoring backup..."
    cp /etc/nginx/nginx.conf.backup.* /etc/nginx/nginx.conf
    nginx -t && systemctl reload nginx
    echo "Backup restored."
fi
