# 🚀 GitHub Actions CI/CD Setup Guide - ViWorks Agent

This guide will help you set up automatic deployment of your ViWorks Agent to DigitalOcean using GitHub Actions.

## 📋 **Prerequisites**

1. **DigitalOcean Account** with:
   - Container Registry enabled
   - Droplet running your services
   - API token with write permissions

2. **GitHub Repository** with:
   - Main branch set up
   - Actions enabled

3. **Rust Development Environment** (for local testing)

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
2. **Rust tests run** to ensure code quality
3. **Docker image builds** using Alpine production Dockerfile
4. **Image pushes** to DigitalOcean registry
5. **Deployment script runs** on your droplet via SSH
6. **Agent container updates** automatically
7. **Health check** verifies deployment success

## 📊 **Workflow Features**

- ✅ **Rust compilation** and testing
- ✅ **Docker image caching** for faster builds
- ✅ **Alpine production build** for security
- ✅ **Automatic rollback** capability
- ✅ **Health monitoring** after deployment
- ✅ **Cleanup** of old images

## 🦀 **Rust-Specific Features**

- **Cargo caching** for faster dependency resolution
- **Release builds** for production deployment
- **Test execution** before deployment
- **Cross-compilation** support if needed

## 🚨 **Troubleshooting**

### **Rust Build Failed**
- Check Cargo.toml dependencies
- Verify Rust toolchain version
- Check for compilation errors

### **SSH Connection Failed**
- Verify SSH key is correct
- Check droplet firewall settings
- Ensure SSH service is running

### **Docker Build Failed**
- Check Dockerfile.alpine-production syntax
- Verify build context
- Check for missing dependencies

### **Deployment Failed**
- Check droplet disk space
- Verify Docker service is running
- Check network configuration
- Ensure viworks-internal network exists

## 🔒 **Security Notes**

- **SSH key** should be dedicated for GitHub Actions
- **API token** should have minimal required permissions
- **Container registry** access is restricted to your project
- **Network isolation** maintained through Docker networks
- **Alpine base image** provides minimal attack surface

## 📈 **Monitoring**

After setup, you can monitor deployments:
- **GitHub Actions** tab shows workflow status
- **DigitalOcean Console** shows container registry
- **Droplet logs** show deployment activity
- **Agent logs** show runtime status

## 🎯 **Next Steps**

1. **Push this workflow** to your repository
2. **Add the required secrets**
3. **Make a test commit** to trigger deployment
4. **Monitor the Actions tab** for deployment status
5. **Check agent health** on port 8443

Your ViWorks Agent will now automatically deploy on every push to the main branch! 🎉

## 🔧 **Agent Configuration**

The deployed agent will:
- Run on the `viworks-internal` network
- Listen on port 8443
- Have access to Docker socket for container management
- Use production Rust logging configuration
- Automatically restart on failure
