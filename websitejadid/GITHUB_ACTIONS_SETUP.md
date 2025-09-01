# 🚀 GitHub Actions CI/CD Setup Guide

This guide will help you set up automatic deployment of your website to DigitalOcean using GitHub Actions.

## 📋 **Prerequisites**

1. **DigitalOcean Account** with:
   - Container Registry enabled
   - Droplet running your services
   - API token with write permissions

2. **GitHub Repository** with:
   - Main branch set up
   - Actions enabled

## 🔐 **Required GitHub Secrets**

Go to your GitHub repository → Settings → Secrets and variables → Actions, then add these secrets:

### **DigitalOcean Container Registry**
```
DIGITALOCEAN_ACCESS_TOKEN
```
Your DigitalOcean API token (read/write permissions)

### **DigitalOcean Project**
```
DIGITALOCEAN_PROJECT_NAME
```
Your DigitalOcean project name (e.g., `viworks-project`)

### **Droplet Connection**
```
DROPLET_HOST
```
Your droplet's IP address (e.g., `64.227.46.188`)

```
DROPLET_USERNAME
```
SSH username (usually `root`)

```
DROPLET_SSH_KEY
```
Your private SSH key for connecting to the droplet

## 🛠️ **Setup Steps**

### **1. Generate SSH Key (if you don't have one)**
```bash
ssh-keygen -t ed25519 -C "github-actions@viworks.com"
```

### **2. Add Public Key to Droplet**
```bash
# Copy your public key to the droplet
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@YOUR_DROPLET_IP
```

### **3. Test SSH Connection**
```bash
ssh root@YOUR_DROPLET_IP
```

### **4. Add Secrets to GitHub**
- Go to your repository settings
- Navigate to Secrets and variables → Actions
- Add each secret listed above

## 🔄 **How It Works**

1. **Push to main branch** triggers the workflow
2. **Tests run** to ensure code quality
3. **Docker image builds** and pushes to DigitalOcean registry
4. **Deployment script runs** on your droplet via SSH
5. **Container updates** automatically
6. **Health check** verifies deployment success

## 📊 **Workflow Features**

- ✅ **Automatic testing** before deployment
- ✅ **Docker image caching** for faster builds
- ✅ **Rollback capability** (previous images preserved)
- ✅ **Health monitoring** after deployment
- ✅ **Cleanup** of old images

## 🚨 **Troubleshooting**

### **SSH Connection Failed**
- Verify SSH key is correct
- Check droplet firewall settings
- Ensure SSH service is running

### **Docker Build Failed**
- Check Dockerfile syntax
- Verify build context
- Check for missing dependencies

### **Deployment Failed**
- Check droplet disk space
- Verify Docker service is running
- Check network configuration

## 🔒 **Security Notes**

- **SSH key** should be dedicated for GitHub Actions
- **API token** should have minimal required permissions
- **Container registry** access is restricted to your project
- **Network isolation** maintained through Docker networks

## 📈 **Monitoring**

After setup, you can monitor deployments:
- **GitHub Actions** tab shows workflow status
- **DigitalOcean Console** shows container registry
- **Droplet logs** show deployment activity

## 🎯 **Next Steps**

1. **Push this workflow** to your repository
2. **Add the required secrets**
3. **Make a test commit** to trigger deployment
4. **Monitor the Actions tab** for deployment status

Your website will now automatically deploy on every push to the main branch! 🎉
