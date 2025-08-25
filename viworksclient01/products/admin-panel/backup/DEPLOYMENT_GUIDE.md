# 🚀 ViWorkS DigitalOcean Deployment Guide

## 📋 Overview

This guide will help you deploy the ViWorkS admin panel to DigitalOcean App Platform using two separate repositories for backend and frontend.

## 📁 Repository Structure

```
backup/
├── viworks-backend/          # Backend API (Rust)
│   ├── .do/app.yaml         # DigitalOcean configuration
│   ├── src/                 # Rust source code
│   ├── Cargo.toml           # Rust dependencies
│   ├── Dockerfile           # Container configuration
│   └── README.md            # Backend documentation
└── viworks-frontend/        # Frontend (Next.js)
    ├── .do/app.yaml         # DigitalOcean configuration
    ├── src/                 # Next.js source code
    ├── package.json         # Node.js dependencies
    ├── Dockerfile           # Container configuration
    └── README.md            # Frontend documentation
```

## 🎯 Deployment Steps

### Step 1: Create GitHub Repositories

1. **Create Backend Repository**
   - Go to GitHub and create a new repository: `viworks-backend`
   - Upload the contents of `backup/viworks-backend/`

2. **Create Frontend Repository**
   - Go to GitHub and create a new repository: `viworks-frontend`
   - Upload the contents of `backup/viworks-frontend/`

### Step 2: Deploy Backend to DigitalOcean

1. **Go to DigitalOcean App Platform**
   - Visit [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Click **"Create App"**

2. **Connect to GitHub**
   - Choose **"GitHub"** as source
   - Select the `viworks-backend` repository
   - Choose the `main` branch

3. **Configure the App**
   - DigitalOcean will automatically detect the `.do/app.yaml` configuration
   - Review the settings:
     - **Environment**: Rust
     - **Region**: London (lon1)
     - **Instance Size**: basic-xxs
     - **Port**: 8081

4. **Deploy**
   - Click **"Create Resources"**
   - Wait for the build and deployment to complete
   - Note the generated URL: `https://viworks-backend-{APP_ID}.ondigitalocean.app`

### Step 3: Deploy Frontend to DigitalOcean

1. **Create Another App**
   - Click **"Create App"** again
   - Choose **"GitHub"** as source
   - Select the `viworks-frontend` repository
   - Choose the `main` branch

2. **Update Environment Variables**
   - In the environment variables section, update:
     - `NEXT_PUBLIC_API_URL`: `https://viworks-backend-{BACKEND_APP_ID}.ondigitalocean.app`
     - `NEXT_PUBLIC_WS_URL`: `wss://viworks-backend-{BACKEND_APP_ID}.ondigitalocean.app`

3. **Deploy**
   - Click **"Create Resources"**
   - Wait for the build and deployment to complete
   - Note the generated URL: `https://viworks-frontend-{APP_ID}.ondigitalocean.app`

## 🔧 Configuration Details

### Backend Configuration (`.do/app.yaml`)

```yaml
name: viworks-backend
region: lon1
services:
- name: viworks-backend
  source_dir: /
  github:
    repo: viworks/viworks-backend
    branch: main
  run_command: ./viworks-admin-backend
  environment_slug: rust
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: JWT_SECRET
    value: your-super-secret-jwt-key-change-in-production
  - key: PORT
    value: "8081"
```

### Frontend Configuration (`.do/app.yaml`)

```yaml
name: viworks-frontend
region: lon1
services:
- name: viworks-frontend
  source_dir: /
  github:
    repo: viworks/viworks-frontend
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: NEXT_PUBLIC_API_URL
    value: https://viworks-backend-${APP_ID}.ondigitalocean.app
  - key: PORT
    value: "3000"
```

## 🌐 Accessing Your Application

After deployment, you'll have:

- **Backend URL**: `https://viworks-backend-{APP_ID}.ondigitalocean.app`
- **Frontend URL**: `https://viworks-frontend-{APP_ID}.ondigitalocean.app`

### Testing the Deployment

1. **Backend Health Check**:
   ```bash
   curl https://viworks-backend-{APP_ID}.ondigitalocean.app/health
   ```

2. **Frontend Access**:
   - Open the frontend URL in your browser
   - Login with default credentials: `admin` / `admin123`

## 🔄 Continuous Deployment

### Automatic Deployments

- Every push to the `main` branch triggers a new deployment
- DigitalOcean automatically builds and deploys the changes
- No manual intervention required

### Manual Deployments

You can also trigger manual deployments:
1. Go to your app in DigitalOcean dashboard
2. Click **"Deploy"** tab
3. Click **"Deploy"** button

## 📊 Monitoring and Logs

### View Logs
1. Go to your app dashboard
2. Click on a service
3. Go to **"Logs"** tab
4. View real-time logs

### Health Monitoring
- DigitalOcean automatically monitors service health
- Failed services are automatically restarted
- Performance metrics are available in the dashboard

## 💰 Cost Optimization

### Current Configuration
- **Backend**: basic-xxs (1 vCPU, 512MB RAM) - $5/month
- **Frontend**: basic-xxs (1 vCPU, 512MB RAM) - $5/month
- **Total**: ~$10/month

### Scaling Options
- **Scale up**: Change instance size for better performance
- **Scale out**: Increase instance count for high availability
- **Auto-scaling**: Enable automatic scaling based on traffic

## 🔒 Security Considerations

1. **Update JWT Secret**: Change the default JWT secret in production
2. **Environment Variables**: Use DigitalOcean's secret management for sensitive data
3. **HTTPS**: Automatic SSL certificates provided by DigitalOcean
4. **Access Control**: Configure IP restrictions if needed

## 🎉 Success!

Your ViWorkS Admin Panel is now deployed with:
- ✅ Separate backend and frontend repositories
- ✅ Automatic builds from source code
- ✅ No architecture compatibility issues
- ✅ Professional monitoring and logging
- ✅ Scalable infrastructure
- ✅ Production-ready configuration

---

**Backend Repository**: `viworks-backend`  
**Frontend Repository**: `viworks-frontend`  
**Deployment Method**: DigitalOcean App Platform (Git-based)  
**Region**: London (lon1)  
**Status**: Ready for deployment
