# 🚀 **DIGITALOCEAN DEPLOYMENT GUIDE - ViWorkS Admin Panel**

## 📋 **OVERVIEW**

This guide provides a complete, step-by-step process for deploying your ViWorkS Admin Panel to DigitalOcean App Platform. This deployment method is **100% compatible** with your existing containerized application and removes all Arvan Cloud dependencies.

---

## 🎯 **DEPLOYMENT SUMMARY**

### **✅ What We'll Deploy**
- **Backend**: Rust application with Actix-web
- **Frontend**: Next.js 15 with TypeScript
- **Database**: PostgreSQL 15 (Managed)
- **Cache**: Redis 7 (Managed)
- **Registry**: DigitalOcean Container Registry

### **💰 Cost Estimate**
- **Container Registry**: $5/month
- **App Platform**: $12/month (basic-xxs instances)
- **PostgreSQL Database**: $15/month
- **Redis Database**: $15/month
- **Total**: ~$47/month

### **⏱️ Deployment Time**
- **Total Time**: 30-60 minutes
- **Initial Setup**: 15 minutes
- **Image Building**: 20 minutes
- **App Deployment**: 15 minutes

---

## 🚀 **QUICK START (RECOMMENDED)**

### **Step 1: Run the Complete Deployment Script**
```bash
# Navigate to your project directory
cd viworksclient01/products/admin-panel

# Make script executable (if not already)
chmod +x deploy-digitalocean-complete.sh

# Run complete deployment
./deploy-digitalocean-complete.sh deploy
```

### **Step 2: Monitor Deployment**
```bash
# Check deployment status
doctl apps list

# Get detailed app information
doctl apps get <APP_ID>
```

### **Step 3: Access Your Application**
- **Frontend**: `https://viworks-frontend-<APP_ID>.ondigitalocean.app`
- **Backend**: `https://viworks-backend-<APP_ID>.ondigitalocean.app`

---

## 📋 **DETAILED STEP-BY-STEP GUIDE**

### **Phase 1: Prerequisites (5 minutes)**

#### **1.1 Install DigitalOcean CLI**
```bash
# macOS
brew install doctl

# Linux
snap install doctl

# Windows
# Download from: https://github.com/digitalocean/doctl/releases
```

#### **1.2 Authenticate with DigitalOcean**
```bash
# Get your API token from: https://cloud.digitalocean.com/account/api/tokens
doctl auth init
# Enter your DigitalOcean API token when prompted
```

#### **1.3 Verify Installation**
```bash
# Check doctl version
doctl version

# Verify authentication
doctl account get
```

### **Phase 2: Container Registry Setup (5 minutes)**

#### **2.1 Create Container Registry**
```bash
doctl registry create viworks-registry --subscription-tier basic
```

#### **2.2 Login to Registry**
```bash
doctl registry login
```

### **Phase 3: Build and Push Images (20 minutes)**

#### **3.1 Build Images**
```bash
# Navigate to project directory
cd viworks-admin-panel

# Build backend
docker build -t viworks-backend:v1 ./backend/

# Build frontend
docker build -t viworks-frontend:v1 ./frontend/
```

#### **3.2 Tag and Push Images**
```bash
# Get registry name
REGISTRY_NAME=$(doctl registry list --format Name --no-header | head -1)

# Tag images
docker tag viworks-backend:v1 registry.digitalocean.com/$REGISTRY_NAME/viworks-backend:v1
docker tag viworks-frontend:v1 registry.digitalocean.com/$REGISTRY_NAME/viworks-frontend:v1

# Push images
docker push registry.digitalocean.com/$REGISTRY_NAME/viworks-backend:v1
docker push registry.digitalocean.com/$REGISTRY_NAME/viworks-frontend:v1
```

### **Phase 4: Deploy Application (10 minutes)**

#### **4.1 Create App Specification**
The script will automatically create `digitalocean-app-clean.yaml` with the correct configuration.

#### **4.2 Deploy to App Platform**
```bash
doctl apps create --spec digitalocean-app-clean.yaml
```

---

## 🔧 **CONFIGURATION DETAILS**

### **App Platform Configuration**
```yaml
name: viworks-admin-panel
region: nyc1
services:
- name: viworks-backend
  image:
    registry_type: DOCR
    registry: viworks-registry
    repository: viworks-backend
    tag: v1
  run_command: ./viworks-admin-backend
  environment_slug: rust
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: DATABASE_URL
    value: ${viworks-postgres.DATABASE_URL}
  - key: REDIS_URL
    value: ${viworks-redis.REDIS_URL}
  - key: JWT_SECRET
    value: your-super-secret-jwt-key-change-in-production
  - key: NODE_ENV
    value: production
  - key: LOG_LEVEL
    value: info
  - key: BCRYPT_ROUNDS
    value: "12"
  - key: RATE_LIMIT_WINDOW
    value: "900000"
  - key: RATE_LIMIT_MAX
    value: "100"
  - key: CORS_ORIGIN
    value: https://viworks-frontend-${APP_ID}.ondigitalocean.app
  - key: ADMIN_PANEL_URL
    value: https://viworks-frontend-${APP_ID}.ondigitalocean.app
  - key: PORT
    value: "8081"

- name: viworks-frontend
  image:
    registry_type: DOCR
    registry: viworks-registry
    repository: viworks-frontend
    tag: v1
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: NEXT_PUBLIC_API_URL
    value: https://viworks-backend-${APP_ID}.ondigitalocean.app
  - key: NEXT_PUBLIC_WS_URL
    value: wss://viworks-backend-${APP_ID}.ondigitalocean.app
  - key: PORT
    value: "3000"

databases:
- name: viworks-postgres
  engine: PG
  version: "15"
  size: db-s-1vcpu-1gb
  db_name: viworks_admin
  db_user: admin

- name: viworks-redis
  engine: REDIS
  version: "7"
  size: db-s-1vcpu-1gb
```

### **Environment Variables**
| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `${viworks-postgres.DATABASE_URL}` | Auto-generated by DigitalOcean |
| `REDIS_URL` | `${viworks-redis.REDIS_URL}` | Auto-generated by DigitalOcean |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-in-production` | **CHANGE IN PRODUCTION** |
| `NODE_ENV` | `production` | Production environment |
| `CORS_ORIGIN` | `https://viworks-frontend-${APP_ID}.ondigitalocean.app` | Frontend URL |
| `NEXT_PUBLIC_API_URL` | `https://viworks-backend-${APP_ID}.ondigitalocean.app` | Backend API URL |

---

## 🔍 **TROUBLESHOOTING**

### **Common Issues and Solutions**

#### **1. Authentication Issues**
```bash
# Error: Not authenticated with DigitalOcean
doctl auth init
# Enter your API token
```

#### **2. Registry Login Issues**
```bash
# Error: Failed to login to registry
doctl registry login
```

#### **3. Image Push Issues**
```bash
# Error: Failed to push image
# Check if you're logged into the registry
doctl registry login

# Check registry name
doctl registry list
```

#### **4. App Deployment Issues**
```bash
# Check app status
doctl apps list

# Get detailed logs
doctl apps logs <APP_ID>

# Check specific service logs
doctl apps logs <APP_ID> --service viworks-backend
```

#### **5. Database Connection Issues**
```bash
# Check database status
doctl databases list

# Get database connection details
doctl databases get <DATABASE_ID>
```

### **Debugging Commands**
```bash
# Check all resources
doctl apps list
doctl registry list
doctl databases list

# Get detailed information
doctl apps get <APP_ID>
doctl registry get <REGISTRY_NAME>
doctl databases get <DATABASE_ID>

# View logs
doctl apps logs <APP_ID> --follow
```

---

## 🔐 **SECURITY CONFIGURATION**

### **Production Security Checklist**
- [ ] Change `JWT_SECRET` to a strong, random string
- [ ] Update `CORS_ORIGIN` to your actual domain
- [ ] Enable SSL/TLS (automatic with DigitalOcean)
- [ ] Configure firewall rules if needed
- [ ] Set up monitoring and alerts

### **Environment Variable Security**
```bash
# Generate a strong JWT secret
openssl rand -base64 32

# Update the app with new secret
doctl apps update <APP_ID> --spec digitalocean-app-clean.yaml
```

---

## 📊 **MONITORING AND MAINTENANCE**

### **Health Checks**
```bash
# Check app health
curl https://viworks-backend-<APP_ID>.ondigitalocean.app/health

# Check frontend
curl https://viworks-frontend-<APP_ID>.ondigitalocean.app
```

### **Scaling**
```bash
# Scale backend instances
doctl apps update <APP_ID> --spec digitalocean-app-clean.yaml

# Update instance count in the spec file
instance_count: 2  # or more as needed
```

### **Updates**
```bash
# Build new images
docker build -t viworks-backend:v2 ./backend/
docker build -t viworks-frontend:v2 ./frontend/

# Tag and push
docker tag viworks-backend:v2 registry.digitalocean.com/viworks-registry/viworks-backend:v2
docker tag viworks-frontend:v2 registry.digitalocean.com/viworks-registry/viworks-frontend:v2
docker push registry.digitalocean.com/viworks-registry/viworks-backend:v2
docker push registry.digitalocean.com/viworks-registry/viworks-frontend:v2

# Update app specification with new tags
# Then redeploy
doctl apps update <APP_ID> --spec digitalocean-app-clean.yaml
```

---

## 🎉 **POST-DEPLOYMENT VERIFICATION**

### **1. Check Application URLs**
```bash
doctl apps get <APP_ID>
```

### **2. Test Endpoints**
```bash
# Test backend health
curl https://viworks-backend-<APP_ID>.ondigitalocean.app/health

# Test frontend
curl https://viworks-frontend-<APP_ID>.ondigitalocean.app
```

### **3. Verify Database Connection**
- Check DigitalOcean dashboard for database status
- Verify connection strings are properly set

### **4. Test Full Application Flow**
- Access frontend URL
- Test login functionality
- Verify API communication
- Check real-time features

---

## 📞 **SUPPORT AND RESOURCES**

### **DigitalOcean Documentation**
- [App Platform Documentation](https://docs.digitalocean.com/products/app-platform/)
- [Container Registry Documentation](https://docs.digitalocean.com/products/container-registry/)
- [Managed Databases Documentation](https://docs.digitalocean.com/products/databases/)

### **CLI Reference**
- [doctl CLI Documentation](https://docs.digitalocean.com/reference/doctl/)

### **Troubleshooting Resources**
- [DigitalOcean Community](https://www.digitalocean.com/community)
- [App Platform Troubleshooting](https://docs.digitalocean.com/products/app-platform/how-to/troubleshoot/)

---

## ✅ **DEPLOYMENT CHECKLIST**

### **Pre-Deployment**
- [ ] DigitalOcean account created
- [ ] API token generated
- [ ] doctl CLI installed
- [ ] Docker running
- [ ] Project code ready

### **Deployment**
- [ ] Authentication verified
- [ ] Container registry created
- [ ] Images built and pushed
- [ ] App specification created
- [ ] Application deployed

### **Post-Deployment**
- [ ] URLs accessible
- [ ] Health checks passing
- [ ] Database connected
- [ ] Frontend loading
- [ ] API responding
- [ ] Security configured

---

**🎉 Congratulations! Your ViWorkS Admin Panel is now successfully deployed on DigitalOcean!**
