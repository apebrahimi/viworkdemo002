# ViWorks Deployment Protocol Guide

## Overview

**Yes, you deploy to the same container infrastructure!** This guide explains the correct protocol for deploying new code to your existing DigitalOcean droplet.

## How It Works

### 1. Infrastructure vs Application Code

**Infrastructure (Stays the Same):**
- Docker containers (names, networks, volumes)
- Database (PostgreSQL data persists)
- Redis cache (session data persists)
- Nginx configuration
- SSL certificates
- Server configuration

**Application Code (Gets Updated):**
- Backend Rust application
- Frontend Next.js application
- Configuration files
- Environment variables

### 2. Deployment Process

```
GitHub Push → GitHub Actions → SSH to Server → Git Pull → Docker Rebuild → Restart Services
```

## Current Setup

### GitHub Actions Workflow
- **Trigger**: Push to `main` or `master` branch
- **Action**: Automatically deploys to DigitalOcean droplet
- **Location**: `.github/workflows/deploy-main.yml`

### Server Infrastructure
- **Location**: `/opt/viworks` on DigitalOcean droplet
- **Containers**: 
  - `viworks-backend` (Rust API)
  - `viworks-frontend` (Next.js app)
  - `viworks-postgres` (Database)
  - `viworks-redis` (Cache)
- **Ports**: 3000 (frontend), 8081 (backend), 5432 (DB), 6379 (Redis)

## Deployment Protocol

### 1. Code Changes
```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main
```

### 2. Automatic Deployment
GitHub Actions automatically:
1. Connects to your DigitalOcean droplet
2. Pulls the latest code
3. Stops existing containers
4. Rebuilds containers with new code
5. Starts services
6. Verifies deployment

### 3. What Happens on the Server

```bash
# 1. Navigate to app directory
cd /opt/viworks

# 2. Pull latest code
git fetch origin
git reset --hard origin/main

# 3. Navigate to Docker setup
cd "digital ocean docker"

# 4. Stop and remove old containers
docker-compose down --remove-orphans
docker rm -f viworks-backend viworks-frontend viworks-postgres viworks-redis

# 5. Build new containers with updated code
docker-compose up -d --build --force-recreate

# 6. Verify deployment
docker-compose ps
curl http://localhost:3000
curl http://localhost:8081/health
```

## Data Persistence

### What Stays Intact
- **Database**: All PostgreSQL data persists in Docker volumes
- **Redis**: Session data and cache persists
- **Uploads**: Any file uploads stored in volumes
- **Configuration**: Environment variables and settings

### What Gets Updated
- **Application code**: New features, bug fixes
- **Dependencies**: Updated packages and libraries
- **Configuration**: New environment variables

## Manual Deployment (If Needed)

### Option 1: Use GitHub Actions
```bash
# Push to trigger automatic deployment
git push origin main
```

### Option 2: Manual SSH Deployment
```bash
# SSH to your server
ssh root@your-droplet-ip

# Navigate to app directory
cd /opt/viworks

# Pull latest code
git pull origin main

# Deploy using our scripts
cd "digital ocean docker"
./deploy-robust.sh
```

### Option 3: Quick Fix
```bash
# SSH to server and run quick fix
ssh root@your-droplet-ip
cd /opt/viworks/"digital ocean docker"
./quick-fix.sh
```

## Monitoring Deployment

### Check Deployment Status
```bash
# View container status
docker-compose ps

# Check logs
docker-compose logs -f

# Test endpoints
curl http://localhost:3000
curl http://localhost:8081/health
```

### GitHub Actions Logs
- Go to your GitHub repository
- Click "Actions" tab
- View the latest deployment run
- Check for any errors or warnings

## Troubleshooting

### Common Issues

#### 1. Container Name Conflicts
```bash
# Run cleanup script
./cleanup-containers.sh
```

#### 2. Build Failures
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend
```

#### 3. Service Not Starting
```bash
# Check resource usage
docker stats

# Restart specific service
docker-compose restart backend
```

### Emergency Procedures

#### Complete Reset
```bash
# Stop everything
docker-compose down

# Remove all containers
docker rm -f $(docker ps -aq)

# Rebuild from scratch
docker-compose up -d --build
```

## Best Practices

### 1. Code Deployment
- Always test locally before pushing
- Use meaningful commit messages
- Keep commits small and focused

### 2. Monitoring
- Check GitHub Actions logs after each deployment
- Monitor application logs regularly
- Set up alerts for service failures

### 3. Backup
- Database backups are handled by Docker volumes
- Consider setting up automated backups
- Test restore procedures periodically

### 4. Security
- Keep dependencies updated
- Monitor for security vulnerabilities
- Use environment variables for secrets

## URLs and Access

### Production URLs
- **Main App**: https://viworks.neuratalent.com
- **Admin Panel**: https://admin-viworks.neuratalent.com
- **API**: https://api-viworks.neuratalent.com
- **Frontend App**: https://app-viworks.neuratalent.com
- **Website**: https://website-vw.neuratalent.com

### Development URLs
- **Frontend**: http://your-droplet-ip:3000
- **Backend**: http://your-droplet-ip:8081
- **Health Check**: http://your-droplet-ip:8081/health

## Summary

**The correct protocol is:**
1. **Push code to GitHub** → Triggers automatic deployment
2. **Same infrastructure** → Containers, volumes, networks stay the same
3. **Updated application** → New code gets built and deployed
4. **Data persists** → Database and cache remain intact
5. **Zero downtime** → Services restart with new code

This approach ensures:
- ✅ Consistent deployment process
- ✅ Data persistence
- ✅ Minimal downtime
- ✅ Easy rollback capability
- ✅ Automated testing and verification
