# ViWorkS Backend GitHub Deployment Guide

## 🚀 Automated Deployment Setup

This guide will help you set up automated deployment of the ViWorkS backend with authentication system using GitHub Actions.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **Digital Ocean Server**: Access to your Digital Ocean server (64.227.46.188)
3. **SSH Key**: SSH key for accessing the Digital Ocean server

## 🔧 Setup Steps

### 1. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets (using the same format as your existing workflow):

```
DROPLET_IP=64.227.46.188
DROPLET_USER=root
SSH_PRIVATE_KEY=<your-private-ssh-key>
```

### 2. SSH Key Setup

Make sure your SSH key is added to the Digital Ocean server:

```bash
# On your local machine, copy your public key
cat ~/.ssh/id_rsa.pub

# On the Digital Ocean server, add it to authorized_keys
echo "your-public-key" >> ~/.ssh/authorized_keys
```

### 3. Server Preparation

Run this on your Digital Ocean server to prepare it:

```bash
# Install required packages
apt update
apt install -y curl jq

# Create backend directory
mkdir -p /root/viworks-backend

# Set up systemd service (optional, for better process management)
# Copy the viworks-backend.service file to /etc/systemd/system/
```

## 🚀 Deployment Process

### Automatic Deployment

The deployment will trigger automatically when you:

1. **Push to main branch** with changes to `digital ocean docker/backend/**`
2. **Manually trigger** the workflow from GitHub Actions tab

### Manual Deployment

You can also trigger deployment manually:

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select "Deploy ViWorkS Backend" workflow
4. Click "Run workflow"

## 📊 What the Deployment Does

1. **Builds** the Rust backend binary
2. **Stops** any existing backend process
3. **Uploads** the new binary to the server
4. **Starts** the backend service
5. **Tests** all authentication endpoints
6. **Reports** deployment status

## 🔍 Monitoring

### Check Backend Status

```bash
# SSH into your server
ssh root@64.227.46.188

# Check if backend is running
curl http://localhost:8081/health

# Check process
ps aux | grep viworks-backend

# View logs
tail -f /root/viworks-backend/backend.log
```

### Test Endpoints

```bash
# Health check
curl http://localhost:8081/health

# Authentication
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# 2FA initiation
curl -X POST http://localhost:8081/api/v1/auth/challenge/initiate \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test-session-123"}'

# Get 2FA code
curl http://localhost:8081/api/v1/auth/challenge/code/test-session-123
```

## 🔧 Nginx Configuration

After the backend is running, you need to configure nginx to proxy API requests:

```nginx
# Add this to your nginx configuration
location /api/ {
    proxy_pass http://localhost:8081;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 🐛 Troubleshooting

### Backend Not Starting

1. Check logs: `cat /root/viworks-backend/backend.log`
2. Check port availability: `lsof -i :8081`
3. Check permissions: `ls -la /root/viworks-backend/viworks-backend`

### Endpoints Not Accessible

1. Check if backend is running: `curl http://localhost:8081/health`
2. Check nginx configuration
3. Check firewall settings

### GitHub Actions Failing

1. Check GitHub secrets are set correctly
2. Verify SSH key has access to the server
3. Check the Actions logs for specific error messages

## 📈 Next Steps

After successful deployment:

1. **Test the complete authentication flow**
2. **Update macOS client** to use the correct API endpoints
3. **Update Android app** to use the correct API endpoints
4. **Configure nginx** to proxy API requests
5. **Set up monitoring** and logging

## 🎯 Expected Results

After deployment, you should be able to:

- Access `https://app-viworks.neuratalent.com/api/v1/auth/login`
- Get JSON responses instead of HTML 404 pages
- Test the complete authentication flow
- Use the macOS and Android clients with the backend

The backend will be running on port 8081 and accessible via the nginx proxy on the main domain.
