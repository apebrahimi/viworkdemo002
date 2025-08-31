# 🔒 ViWorks Secure Deployment Configuration

This directory contains the secure deployment configuration for ViWorks with enterprise-grade network isolation and security.

## 🎯 **Security Features**

- ✅ **Zero Direct Container Exposure**: No containers directly accessible from internet
- ✅ **All Traffic Through Nginx**: Single entry point with reverse proxy
- ✅ **Database Isolation**: PostgreSQL and Redis on internal network only
- ✅ **Network Segmentation**: External and internal networks properly separated
- ✅ **SSL/TLS Encryption**: HTTPS with strong ciphers and security headers
- ✅ **Automatic Certificate Renewal**: SSL certificates auto-renew every 60 days

## 📁 **File Structure**

```
digital ocean docker/
├── docker-compose-secure.yml     # Secure container orchestration
├── docker-compose.yml            # Original configuration (insecure)
├── nginx/
│   └── nginx.conf               # Secure nginx configuration
├── backend/                     # Backend application
├── frontend/                    # Frontend application
├── website/                     # Website application
├── deploy-secure.sh            # Secure deployment script
├── setup-ssl.sh                # SSL certificate setup
└── README-SECURE.md            # This file
```

## 🌐 **Network Architecture**

```
Internet → Nginx (Ports 80/443) → Frontend/Website (External Network)
                                → Backend (External Network)
Backend → Redis/PostgreSQL (Internal Network)
```

### **Network Segments**

- **External Network** (`viworks-external`): Frontend, website, nginx, backend
- **Internal Network** (`viworks-internal`): PostgreSQL, Redis (backend access only)

## 🚀 **Quick Deployment**

### **1. Prerequisites**
- Docker and Docker Compose installed
- SSL certificates for your domains
- Environment variables configured

### **2. Deploy with Security**
```bash
# Navigate to the directory
cd "digital ocean docker"

# Make deployment script executable
chmod +x deploy-secure.sh

# Deploy with secure configuration
./deploy-secure.sh
```

### **3. Manual Deployment**
```bash
# Create secure networks
docker network create viworks-internal
docker network create viworks-external

# Deploy with docker-compose
docker-compose -f docker-compose-secure.yml up -d --build
```

## 🔒 **Security Configuration**

### **Container Security**

| Service | Network | Port Exposure | Access |
|---------|---------|---------------|---------|
| `nginx` | `viworks-external` | ✅ 80, 443 | Public (Reverse Proxy) |
| `frontend` | `viworks-external` | ❌ None | Through nginx only |
| `website` | `viworks-external` | ❌ None | Through nginx only |
| `backend` | `viworks-external` + `viworks-internal` | ❌ None | Through nginx only |
| `postgres` | `viworks-internal` | ❌ None | Backend only |
| `redis` | `viworks-internal` | ❌ None | Backend only |

### **SSL/TLS Configuration**
- **Protocols**: TLSv1.2, TLSv1.3
- **Ciphers**: ECDHE-RSA-AES256-GCM-SHA512, DHE-RSA-AES256-GCM-SHA512
- **HTTP/2**: Enabled
- **HSTS**: Strict-Transport-Security headers

### **Security Headers**
- **X-Frame-Options**: DENY (admin), SAMEORIGIN (website)
- **X-Content-Type-Options**: nosniff
- **X-XSS-Protection**: 1; mode=block
- **Strict-Transport-Security**: max-age=31536000; includeSubDomains
- **Referrer-Policy**: no-referrer-when-downgrade

## 🌐 **Domain Configuration**

### **Supported Domains**
- `https://website-vw.neuratalent.com` - Website
- `https://admin-viworks.neuratalent.com` - Admin Panel
- `https://viworks.neuratalent.com` - Main Application

### **SSL Certificates**
SSL certificates are managed by Let's Encrypt and automatically renewed.

## 📊 **Monitoring and Health Checks**

### **Health Check Endpoints**
- `https://website-vw.neuratalent.com/health`
- `https://admin-viworks.neuratalent.com/health`
- `https://viworks.neuratalent.com/health`

### **Container Health Checks**
All containers have health checks configured:
- **Frontend**: HTTP 200 on port 3000
- **Backend**: HTTP 200 on `/health` endpoint
- **PostgreSQL**: `pg_isready` command
- **Redis**: `redis-cli ping` command
- **Nginx**: HTTP 200 on `/health` endpoint

## 🔍 **Troubleshooting**

### **Check Container Status**
```bash
# View all containers
docker-compose -f docker-compose-secure.yml ps

# Check container logs
docker-compose -f docker-compose-secure.yml logs [service-name]

# Check network connectivity
docker exec viworks-standalone-nginx ping viworks-frontend
docker exec viworks-backend ping viworks-postgres
```

### **Verify Security**
```bash
# Check for exposed ports
docker ps --format "table {{.Names}}\t{{.Ports}}" | grep -E "0\.0\.0\.0|:::"

# Test SSL certificates
openssl s_client -connect website-vw.neuratalent.com:443 -servername website-vw.neuratalent.com

# Check network isolation
docker network inspect viworks-internal
docker network inspect viworks-external
```

### **Common Issues**

1. **SSL Certificate Issues**
   ```bash
   # Check certificate expiration
   openssl x509 -in /etc/letsencrypt/live/website-vw.neuratalent.com/cert.pem -text -noout | grep "Not After"
   
   # Renew certificates
   ./setup-ssl.sh
   ```

2. **Network Connectivity Issues**
   ```bash
   # Recreate networks
   docker network rm viworks-internal viworks-external
   docker network create viworks-internal
   docker network create viworks-external
   
   # Restart containers
   docker-compose -f docker-compose-secure.yml restart
   ```

3. **Container Health Issues**
   ```bash
   # Check container health
   docker ps --format "table {{.Names}}\t{{.Status}}"
   
   # Restart unhealthy containers
   docker-compose -f docker-compose-secure.yml restart [service-name]
   ```

## 🔄 **Maintenance**

### **SSL Certificate Renewal**
Certificates are automatically renewed every 60 days. Manual renewal:
```bash
./setup-ssl.sh
```

### **Container Updates**
```bash
# Pull latest images and rebuild
docker-compose -f docker-compose-secure.yml pull
docker-compose -f docker-compose-secure.yml up -d --build
```

### **Backup and Restore**
```bash
# Backup databases
docker exec viworks-postgres pg_dump -U admin viworks_admin > backup.sql

# Restore databases
docker exec -i viworks-postgres psql -U admin viworks_admin < backup.sql
```

## 📋 **Environment Variables**

Create a `.env` file with the following variables:
```env
# Database
POSTGRES_PASSWORD=your_secure_password

# Backend
DATABASE_URL=postgresql://admin:your_secure_password@viworks-postgres:5432/viworks_admin
REDIS_URL=redis://viworks-redis:6379

# Frontend
NEXT_PUBLIC_API_URL=https://viworks.neuratalent.com/api
```

## 🎉 **Success Indicators**

Your deployment is secure when:
- ✅ Only nginx container shows port exposure (80, 443)
- ✅ All other containers show no port exposure
- ✅ HTTPS works for all domains
- ✅ HTTP redirects to HTTPS
- ✅ Health checks pass for all containers
- ✅ Backend can reach databases
- ✅ Nginx can reach frontend/website/backend

## 🔒 **Security Checklist**

- [ ] No containers directly accessible from internet
- [ ] All traffic routed through nginx
- [ ] Database containers on internal network only
- [ ] SSL certificates installed and working
- [ ] Security headers configured
- [ ] Health checks passing
- [ ] Network isolation verified
- [ ] Automatic SSL renewal configured

**Your ViWorks platform is now production-ready with enterprise-grade security!** 🔒🚀
