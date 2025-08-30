# 🌐 Domain Setup Guide for ViWorks

## 📋 **Step 1: DNS Configuration in DigitalOcean**

### 1.1 Go to DigitalOcean DNS Settings
1. Log into your DigitalOcean account
2. Go to **Networking** → **Domains**
3. Click on your domain `neuratalent.com`
4. Click **Add Record**

### 1.2 Add DNS Records

#### **Main ViWorks Application**
```
Type: A
Name: viworks
Value: 64.227.46.188
TTL: 3600
```

#### **ViWorks Admin Panel**
```
Type: A
Name: admin-viworks
Value: 64.227.46.188
TTL: 3600
```

#### **ViWorks API**
```
Type: A
Name: api-viworks
Value: 64.227.46.188
TTL: 3600
```

#### **ViWorks Frontend App**
```
Type: A
Name: app-viworks
Value: 64.227.46.188
TTL: 3600
```

### 1.3 Verify DNS Records
After adding the records, you can verify them:
```bash
nslookup viworks.neuratalent.com
nslookup admin-viworks.neuratalent.com
nslookup api-viworks.neuratalent.com
nslookup app-viworks.neuratalent.com
```

## 🔧 **Step 2: SSL Certificate Setup**

### 2.1 Install Certbot on Droplet
```bash
ssh root@64.227.46.188
apt update
apt install certbot python3-certbot-nginx -y
```

### 2.2 Generate SSL Certificates
```bash
# For main ViWorks subdomain
certbot --nginx -d viworks.neuratalent.com

# For admin subdomain
certbot --nginx -d admin-viworks.neuratalent.com

# For API subdomain
certbot --nginx -d api-viworks.neuratalent.com

# For app subdomain
certbot --nginx -d app-viworks.neuratalent.com
```

## 🚀 **Step 3: Nginx Configuration**

### 3.1 Update Nginx Configuration
The Nginx configuration will be updated to handle the new subdomain structure.

### 3.2 Test Configuration
```bash
nginx -t
systemctl reload nginx
```

## 📱 **Step 4: Application Access**

After setup, you'll be able to access:
- **Main ViWorks**: https://viworks.neuratalent.com
- **Admin Panel**: https://admin-viworks.neuratalent.com
- **API**: https://api-viworks.neuratalent.com
- **Frontend App**: https://app-viworks.neuratalent.com

## 🔒 **Step 5: Security Considerations**

1. **Firewall Rules**: Ensure only ports 80, 443, and 22 are open
2. **SSL/TLS**: All traffic should be encrypted
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Monitoring**: Set up monitoring for your subdomains

## 🛠️ **Troubleshooting**

### Common Issues:
1. **DNS Propagation**: Can take up to 48 hours
2. **SSL Certificate Issues**: Check Certbot logs
3. **Nginx Configuration**: Validate syntax before reloading

### Useful Commands:
```bash
# Check DNS propagation
dig viworks.neuratalent.com

# Check SSL certificate
openssl s_client -connect viworks.neuratalent.com:443

# Check Nginx status
systemctl status nginx

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```
