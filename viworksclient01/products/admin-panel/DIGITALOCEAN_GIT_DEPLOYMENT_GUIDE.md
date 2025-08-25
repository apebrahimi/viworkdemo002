# 🚀 DigitalOcean Git-Based Deployment Guide

## Overview

This guide will help you deploy the ViWorkS Admin Panel to DigitalOcean App Platform using Git-based deployment. This approach is superior to manual Docker image management because:

- ✅ **Automatic builds** from source code
- ✅ **No architecture issues** (DigitalOcean handles platform compatibility)
- ✅ **Continuous deployment** on every Git push
- ✅ **Better version control** and rollback capabilities
- ✅ **No manual image management** required

## 📋 Prerequisites

1. **GitHub Repository**: Your code is already pushed to `https://github.com/apebrahimi/viworkdemo002.git`
2. **DigitalOcean Account**: Active account with App Platform access
3. **GitHub Integration**: DigitalOcean connected to your GitHub account

## 🎯 Deployment Steps

### Step 1: Connect GitHub to DigitalOcean

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click **"Create App"**
3. Choose **"GitHub"** as your source
4. Authorize DigitalOcean to access your GitHub account if not already done
5. Select the repository: `apebrahimi/viworkdemo002`
6. Choose the **`main`** branch

### Step 2: Configure the Application

DigitalOcean will automatically detect the `.do/app.yaml` configuration file and set up:

#### Backend Service (Rust)
- **Source Directory**: `/backend`
- **Environment**: Rust
- **Build Command**: Automatic (cargo build)
- **Run Command**: `./viworks-admin-backend`
- **Port**: 8081

#### Frontend Service (Node.js)
- **Source Directory**: `/frontend`
- **Environment**: Node.js
- **Build Command**: Automatic (npm run build)
- **Run Command**: `npm start`
- **Port**: 3000

### Step 3: Environment Variables

The following environment variables are automatically configured:

#### Backend Variables
```
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=production
LOG_LEVEL=info
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
CORS_ORIGIN=https://viworks-frontend-${APP_ID}.ondigitalocean.app
ADMIN_PANEL_URL=https://viworks-frontend-${APP_ID}.ondigitalocean.app
PORT=8081
```

#### Frontend Variables
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://viworks-backend-${APP_ID}.ondigitalocean.app
NEXT_PUBLIC_WS_URL=wss://viworks-backend-${APP_ID}.ondigitalocean.app
PORT=3000
```

### Step 4: Deploy

1. Click **"Create Resources"**
2. DigitalOcean will:
   - Clone your repository
   - Build both services from source
   - Deploy to the London region (lon1)
   - Generate unique URLs for each service

## 🔧 Configuration Details

### App Specification (`.do/app.yaml`)

```yaml
name: viworks-admin-panel
region: lon1
services:
- name: viworks-backend
  source_dir: /backend
  github:
    repo: viworks/viworks-admin-panel
    branch: main
  run_command: ./viworks-admin-backend
  environment_slug: rust
  instance_count: 1
  instance_size_slug: basic-xxs
  # ... environment variables

- name: viworks-frontend
  source_dir: /frontend
  github:
    repo: viworks/viworks-admin-panel
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  # ... environment variables
```

### Key Benefits of This Configuration

1. **Source-based builds**: No Docker image management needed
2. **Automatic platform detection**: DigitalOcean handles architecture compatibility
3. **Environment-specific builds**: Optimized for production
4. **Automatic scaling**: Can be easily scaled up/down
5. **Health checks**: Built-in monitoring and restart capabilities

## 🌐 Accessing Your Application

After deployment, you'll get:

- **Frontend URL**: `https://viworks-frontend-{APP_ID}.ondigitalocean.app`
- **Backend URL**: `https://viworks-backend-{APP_ID}.ondigitalocean.app`

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

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check the build logs in DigitalOcean dashboard
   - Verify all dependencies are in `Cargo.toml` and `package.json`
   - Ensure the source directories are correct

2. **Runtime Errors**
   - Check the runtime logs
   - Verify environment variables are set correctly
   - Check port configurations

3. **Connection Issues**
   - Verify the URLs are correct
   - Check CORS settings
   - Ensure services can communicate with each other

### Debug Commands

```bash
# Check app status
doctl apps list

# View app details
doctl apps get {APP_ID}

# View logs
doctl apps logs {APP_ID}
```

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

## 📈 Next Steps

1. **Monitor Performance**: Use DigitalOcean's monitoring tools
2. **Set Up Alerts**: Configure notifications for downtime
3. **Backup Strategy**: Consider database backups if needed
4. **Custom Domain**: Configure custom domain names
5. **CDN**: Enable CDN for better global performance

## 🎉 Success!

Your ViWorkS Admin Panel is now deployed with:
- ✅ Git-based continuous deployment
- ✅ Automatic builds from source code
- ✅ No architecture compatibility issues
- ✅ Professional monitoring and logging
- ✅ Scalable infrastructure
- ✅ Production-ready configuration

---

**Repository**: `https://github.com/apebrahimi/viworkdemo002.git`  
**Deployment Method**: DigitalOcean App Platform (Git-based)  
**Region**: London (lon1)  
**Status**: Ready for deployment
