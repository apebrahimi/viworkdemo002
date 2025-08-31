# 🌐 Domain Setup Guide for website-viworks.neuratalent.com

## 📋 Overview
This guide will help you set up `website-viworks.neuratalent.com` to point to your ViWorks website running on port 3001.

## 🚀 Current Status
- ✅ Website container is running on port 3001
- ✅ Nginx configuration is installed
- ⏳ **PENDING**: DNS A record needs to be added
- ⏳ **PENDING**: SSL certificate needs to be obtained

## 📝 Step-by-Step Instructions

### Step 1: Add DNS A Record
You need to add a DNS A record in your domain provider's DNS settings:

**DNS Record:**
- **Type:** A
- **Name:** `website-viworks`
- **Value:** `64.227.46.188`
- **TTL:** 300 (or default)

**Full domain:** `website-viworks.neuratalent.com` → `64.227.46.188`

### Step 2: Wait for DNS Propagation
DNS changes can take 5-15 minutes to propagate globally. You can check propagation using:
```bash
nslookup website-viworks.neuratalent.com
```

### Step 3: Get SSL Certificate
Once DNS is propagated, run:
```bash
./get-ssl-cert.sh
```

This will:
- Verify DNS is properly configured
- Obtain SSL certificate from Let's Encrypt
- Configure Nginx with SSL

### Step 4: Verify Setup
After SSL certificate is obtained, your website will be available at:
**https://website-viworks.neuratalent.com**

## 🔧 Configuration Details

### Nginx Configuration
- **File:** `/etc/nginx/sites-available/website-viworks`
- **Enabled:** `/etc/nginx/sites-enabled/website-viworks`
- **Proxy:** HTTP/HTTPS → `localhost:3001` (your website container)

### SSL Certificate
- **Provider:** Let's Encrypt
- **Auto-renewal:** Every 60 days
- **Email:** admin@neuratalent.com

### Security Features
- ✅ HTTP to HTTPS redirect
- ✅ Security headers (X-Frame-Options, XSS Protection, etc.)
- ✅ Gzip compression
- ✅ SSL/TLS encryption

## 📊 Management Commands

### Check Website Status
```bash
# Check if container is running
ssh root@64.227.46.188 'docker ps | grep viworkswebsite'

# Check website logs
ssh root@64.227.46.188 'docker logs -f viworkswebsite'
```

### Check Nginx Status
```bash
# Test Nginx configuration
ssh root@64.227.46.188 'nginx -t'

# Check Nginx status
ssh root@64.227.46.188 'systemctl status nginx'
```

### Check SSL Certificate
```bash
# List all certificates
ssh root@64.227.46.188 'certbot certificates'

# Check certificate expiry
ssh root@64.227.46.188 'certbot certificates | grep -A 10 "website-viworks"'
```

## 🛠️ Troubleshooting

### If DNS is not resolving:
1. Verify the A record is added correctly
2. Wait longer for propagation (up to 24 hours)
3. Check with different DNS servers: `nslookup website-viworks.neuratalent.com 8.8.8.8`

### If SSL certificate fails:
1. Ensure DNS is properly configured
2. Check that port 80 and 443 are accessible
3. Verify the domain points to the correct server IP

### If website is not loading:
1. Check if the container is running: `docker ps | grep viworkswebsite`
2. Check container logs: `docker logs viworkswebsite`
3. Test direct access: `curl http://localhost:3001`

## 📞 Support
If you encounter any issues:
1. Check the logs using the commands above
2. Verify DNS propagation
3. Ensure the website container is running
4. Check Nginx configuration syntax

## 🎯 Final Result
After completing all steps, your ViWorks website will be accessible at:
**https://website-viworks.neuratalent.com**

The setup includes:
- ✅ Secure HTTPS access
- ✅ Automatic SSL certificate renewal
- ✅ Reverse proxy with security headers
- ✅ Gzip compression for better performance
- ✅ Proper error handling and logging
