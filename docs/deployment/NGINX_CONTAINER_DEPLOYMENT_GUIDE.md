# NGINX Container Deployment Guide

## Overview
This guide provides step-by-step instructions for adding new containers to the ViWorks nginx reverse proxy configuration, including domain setup and SSL certificate management.

## Prerequisites
- Access to the Digital Ocean server (64.227.46.188)
- Domain name configured to point to the server IP
- Docker container running and accessible via internal network
- SSH access to the server

## Step-by-Step Process

### 1. Prepare the New Container

#### 1.1 Ensure Container is Running
```bash
# Check if your container is running
docker ps | grep your-container-name

# If not running, start it
docker start your-container-name
```

#### 1.2 Verify Internal Network Access
```bash
# Test internal connectivity from nginx container
docker exec viworks-nginx curl http://your-container-name:port/health
```

### 2. Add Domain to Nginx Configuration

#### 2.1 Backup Current Configuration
```bash
# Create backup with timestamp
cp "/opt/viworks/digital ocean docker/nginx/nginx.conf" "/opt/viworks/digital ocean docker/nginx/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)"
```

#### 2.2 Update Local nginx.conf
Edit the local file: `digital ocean docker/nginx/nginx.conf`

Add the new server block before the closing `}` of the `http` block:

```nginx
# Your New Service Server - HTTPS only
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.neuratalent.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.neuratalent.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.neuratalent.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;

    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Required headers
    add_header X-VIW-Server your-service-vhost always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Dedicated access log
    access_log /var/log/nginx/your-service.access.log main;

    # Service endpoints
    location / {
        proxy_pass http://your-container-name:port;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 3600s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }

    # Health check endpoint
    location = /_health {
        access_log off;
        return 200 "ok\n";
        add_header Content-Type text/plain;
    }

    # Error handling
    error_page 502 503 504 @fallback;
    location @fallback {
        return 503 "Service temporarily unavailable. Please try again later.";
        add_header Content-Type text/plain;
    }
}
```

#### 2.3 Copy Configuration to Server
```bash
# Copy updated configuration to server
scp "digital ocean docker/nginx/nginx.conf" root@64.227.46.188:"/opt/viworks/digital ocean docker/nginx/"
```

### 3. Generate SSL Certificate

#### 3.1 Stop Nginx Container (Required for Certbot)
```bash
# Stop nginx to free up ports 80 and 443
docker stop viworks-nginx
```

#### 3.2 Generate SSL Certificate
```bash
# Generate certificate using standalone mode
certbot certonly --standalone -d your-domain.neuratalent.com
```

#### 3.3 Restart Nginx Container
```bash
# Restart nginx container
docker start viworks-nginx
```

### 4. Test and Validate Configuration

#### 4.1 Test Nginx Configuration
```bash
# Test nginx configuration syntax
docker exec viworks-nginx nginx -t
```

#### 4.2 Restart Nginx if Needed
```bash
# If configuration test passes, reload nginx
docker exec viworks-nginx nginx -s reload

# Or restart container if reload doesn't work
docker restart viworks-nginx
```

#### 4.3 Verify Server Block is Loaded
```bash
# Check if your server block is present
docker exec viworks-nginx nginx -T | grep -A 5 "server_name your-domain.neuratalent.com"
```

### 5. Test the New Service

#### 5.1 Test Health Endpoint
```bash
# Test from server
curl -k -H 'Host: your-domain.neuratalent.com' https://localhost/health -v

# Test from external
curl -k https://your-domain.neuratalent.com/health -v
```

#### 5.2 Verify Headers
```bash
# Check for required headers
curl -k -I https://your-domain.neuratalent.com/health
```

Expected headers:
- `x-viw-server: your-service-vhost`
- `x-frame-options: SAMEORIGIN`
- `x-content-type-options: nosniff`

## Configuration Template Variables

Replace these variables in the template:

| Variable | Description | Example |
|----------|-------------|---------|
| `your-domain.neuratalent.com` | Your subdomain | `api.neuratalent.com` |
| `your-container-name` | Docker container name | `viworks-backend` |
| `port` | Container port | `8080` |
| `your-service-vhost` | Unique identifier | `api-vhost` |

## Common Issues and Solutions

### Issue: SSL Certificate Generation Fails
**Solution**: Ensure nginx container is stopped before running certbot
```bash
docker stop viworks-nginx
certbot certonly --standalone -d your-domain.neuratalent.com
docker start viworks-nginx
```

### Issue: Configuration Not Loading
**Solution**: Restart nginx container to pick up new configuration
```bash
docker restart viworks-nginx
```

### Issue: 502 Bad Gateway
**Solution**: Check if target container is running and accessible
```bash
# Check container status
docker ps | grep your-container-name

# Test internal connectivity
docker exec viworks-nginx curl http://your-container-name:port/health
```

### Issue: Wrong SSL Certificate
**Solution**: Verify server_name matches certificate domain
```bash
# Check certificate
openssl s_client -connect your-domain.neuratalent.com:443 -servername your-domain.neuratalent.com
```

## Security Considerations

1. **Always use HTTPS** - Never expose services on HTTP only
2. **Use strong SSL ciphers** - The configuration includes modern, secure ciphers
3. **Add security headers** - X-Frame-Options, X-Content-Type-Options, etc.
4. **Monitor access logs** - Use dedicated log files for each service
5. **Regular certificate renewal** - Let's Encrypt certificates expire every 90 days

## Maintenance

### Certificate Renewal
```bash
# Renew all certificates
certbot renew

# Test renewal
certbot renew --dry-run
```

### Log Monitoring
```bash
# Monitor service-specific logs
tail -f /var/log/nginx/your-service.access.log

# Monitor nginx error logs
docker exec viworks-nginx tail -f /var/log/nginx/error.log
```

## Example: Complete Deployment

Here's a complete example for adding a new API service:

```bash
# 1. Backup configuration
cp "/opt/viworks/digital ocean docker/nginx/nginx.conf" "/opt/viworks/digital ocean docker/nginx/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)"

# 2. Edit local nginx.conf (add server block for api-new.neuratalent.com)

# 3. Copy to server
scp "digital ocean docker/nginx/nginx.conf" root@64.227.46.188:"/opt/viworks/digital ocean docker/nginx/"

# 4. Stop nginx
docker stop viworks-nginx

# 5. Generate SSL certificate
certbot certonly --standalone -d api-new.neuratalent.com

# 6. Start nginx
docker start viworks-nginx

# 7. Test configuration
docker exec viworks-nginx nginx -t

# 8. Test service
curl -k https://api-new.neuratalent.com/health -v
```

This guide ensures consistent, secure, and maintainable nginx configurations for all new services.
