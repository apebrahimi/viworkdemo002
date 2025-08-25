# 🚀 Arvan Cloud Fresh Deployment Guide

## Overview
This guide will help you deploy the ViWorkS Admin Panel on Arvan Cloud from scratch, avoiding all previous authentication and configuration issues.

## Prerequisites
- ✅ Docker installed and running
- ✅ Arvan Cloud account
- ✅ Images built locally (`viworks-backend:v1` and `viworks-frontend:v1`)

## Step-by-Step Deployment

### Step 1: Create Arvan Cloud Container Registry

1. **Go to Arvan Cloud Dashboard**
   - Navigate to: **Container** → **Container Registry**

2. **Create New Registry**
   - Click "Create Registry" or "ساخت رجیستری"
   - Choose a name (e.g., `viworks-registry`)
   - Note down the registry URL, username, and password

### Step 2: Push Images to Registry

Run the setup script to get the exact commands:
```bash
./setup-arvan-registry.sh
```

Then execute the commands with your registry details:
```bash
# Login to your registry
docker login <your-registry-url>

# Tag images
docker tag viworks-backend:v1 <your-registry-url>/viworks-backend:v1
docker tag viworks-frontend:v1 <your-registry-url>/viworks-frontend:v1

# Push images
docker push <your-registry-url>/viworks-backend:v1
docker push <your-registry-url>/viworks-frontend:v1
```

### Step 3: Deploy Infrastructure Services

#### 3.1 Deploy PostgreSQL
1. Go to **Container** → **Create Application**
2. Use configuration from `postgres-dashboard-config.md`
3. Choose "بدون دامنه" (No Domain) - internal service only

#### 3.2 Deploy Redis
1. Go to **Container** → **Create Application**
2. Use configuration from `redis-dashboard-config.md`
3. Choose "بدون دامنه" (No Domain) - internal service only

### Step 4: Deploy Backend Application

1. Go to **Container** → **Create Application**
2. Use configuration from `backend-dashboard-config.md`
3. **Important**: Replace `<your-registry-url>` and `<your-project-id>` with actual values
4. Choose "زیردامنه رایگان آروان کلاد" (Free Arvan Cloud Subdomain)

### Step 5: Deploy Frontend Application

1. Go to **Container** → **Create Application**
2. Use configuration from `frontend-dashboard-config.md`
3. **Important**: Replace `<your-registry-url>` and `<your-project-id>` with actual values
4. Choose "زیردامنه رایگان آروان کلاد" (Free Arvan Cloud Subdomain)

## Configuration Files

- `postgres-dashboard-config.md` - PostgreSQL deployment config
- `redis-dashboard-config.md` - Redis deployment config
- `backend-dashboard-config.md` - Backend deployment config
- `frontend-dashboard-config.md` - Frontend deployment config

## Expected URLs

After deployment, you should have:

- **Backend**: `http://viworks-backend-<project-id>-viworks.apps.ir-central1.arvancaas.ir`
- **Frontend**: `http://viworks-frontend-<project-id>-viworks.apps.ir-central1.arvancaas.ir`

## Troubleshooting

### Common Issues

1. **Image Pull Errors**
   - Ensure registry URL is correct
   - Verify login credentials
   - Check image tags match exactly

2. **Database Connection Errors**
   - Verify PostgreSQL is running
   - Check service names in environment variables
   - Ensure database credentials are correct

3. **Frontend API Connection Errors**
   - Verify backend URL in frontend environment variables
   - Check CORS settings
   - Ensure backend is fully deployed before frontend

### Verification Commands

```bash
# Check if kubectl is configured
kubectl get pods -n viworks

# Check application logs
kubectl logs <pod-name> -n viworks

# Check service status
kubectl get services -n viworks
```

## Security Notes

- Change default passwords in production
- Use strong JWT secrets
- Enable HTTPS for production
- Configure proper CORS settings

## Next Steps

1. Test all endpoints
2. Configure monitoring
3. Set up backups
4. Configure SSL certificates
5. Set up CI/CD pipeline

---

**🎉 Congratulations! Your ViWorkS Admin Panel should now be fully operational on Arvan Cloud!**
