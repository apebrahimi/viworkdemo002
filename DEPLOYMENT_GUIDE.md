# 🚀 ViWorks Sequential Deployment Guide

This guide provides multiple deployment strategies for the ViWorks stack, allowing you to deploy services individually and verify each one before proceeding to the next.

## 📋 Available Deployment Methods

### 1. 🎯 **Sequential GitHub Actions Workflow** (Recommended)
**File:** `.github/workflows/deploy-sequential.yml`

**Usage:**
- Go to your GitHub repository → Actions → "Sequential ViWorks Deployment"
- Click "Run workflow"
- Choose deployment phase:
  - `all` - Deploy all services sequentially 
  - `infrastructure` - Only PostgreSQL + Redis
  - `backend` - Only Backend API
  - `frontend` - Only Frontend
  - `website` - Only Website
  - `agent` - Only ViWorks Agent

**Features:**
- ✅ Deploys services in correct dependency order
- ✅ Validates each service before proceeding 
- ✅ Stops on first failure
- ✅ Detailed logging and health checks
- ✅ Rollback capabilities

### 2. 🖥️ **Remote Deployment Script**
**File:** `scripts/remote-deploy.sh`

**Usage:**
```bash
# Deploy all services sequentially
./scripts/remote-deploy.sh all

# Deploy single service
./scripts/remote-deploy.sh backend

# Deploy without validation (faster)
./scripts/remote-deploy.sh frontend --skip-validation

# Check current status
./scripts/remote-deploy.sh status
```

**Features:**
- ✅ Direct SSH deployment to DigitalOcean
- ✅ Individual service deployment
- ✅ Health validation for each service
- ✅ Real-time status monitoring

### 3. 🛠️ **Interactive Deployment Manager**
**File:** `scripts/deploy-manager.sh`

**Usage:**
```bash
./scripts/deploy-manager.sh
```

**Features:**
- ✅ Interactive menu-driven deployment
- ✅ Real-time service status display
- ✅ Selective service deployment
- ✅ Rollback capabilities
- ✅ Log viewing and debugging

### 4. 🎛️ **Single Service Deployment**
**File:** `scripts/deploy-single-service.sh`

**Usage:**
```bash
# Deploy specific service with validation
./scripts/deploy-single-service.sh backend

# Deploy without validation
./scripts/deploy-single-service.sh frontend --no-validate
```

**Available Services:**
- `postgres` - PostgreSQL database
- `redis` - Redis cache
- `backend` - Rust API server
- `frontend` - Next.js frontend
- `website` - Company website
- `agent` - ViWorks monitoring agent
- `nginx` - Reverse proxy

## 🏗️ Deployment Architecture

### Service Dependencies:
```
Internet → Nginx (Public Network)
           ↓
    ┌─────────────────────────────┐
    │    Internal Network         │
    │                            │
    │  Frontend ←→ Backend       │
    │      ↓         ↓           │
    │   Website   PostgreSQL     │
    │      ↓         ↓           │
    │   Agent ←→ Redis           │
    └─────────────────────────────┘
```

### Deployment Order:
1. **Infrastructure:** PostgreSQL + Redis + Networks
2. **Backend:** API server (connects to DB/Redis)
3. **Frontend:** Next.js app (connects to Backend)
4. **Website:** Company website
5. **Agent:** Monitoring agent
6. **Nginx:** Reverse proxy (exposes everything)

## 🔧 Configuration

### Environment Variables:
```bash
# For remote deployment
export DROPLET_IP="64.227.46.188"
export DROPLET_USER="root" 
export SSH_KEY="~/.ssh/id_ed25519"
```

### Required Files:
- `digital ocean docker/docker-compose.yml` - Service definitions
- `digital ocean docker/env.production` - Environment variables
- `digital ocean docker/nginx/nginx.conf` - Nginx configuration

## 🧪 Health Checks

Each service has specific health validation:

| Service | Health Check | Timeout |
|---------|-------------|---------|
| PostgreSQL | `pg_isready -U admin -d viworks` | 30s |
| Redis | `redis-cli ping` | 15s |
| Backend | `curl http://localhost:8081/health` | 90s |
| Frontend | `curl http://localhost:3000` | 60s |
| Website | `curl http://localhost:3000` | 60s |
| Agent | Process status check | 10s |
| Nginx | `curl http://localhost/health` | 30s |

## 🚨 Troubleshooting

### Common Issues:

1. **Backend won't start:**
   ```bash
   # Check database connectivity
   ./scripts/remote-deploy.sh postgres
   ./scripts/remote-deploy.sh redis
   ./scripts/remote-deploy.sh backend
   ```

2. **Website build fails:**
   ```bash
   # Deploy website separately with detailed logs
   ./scripts/remote-deploy.sh website
   ```

3. **Nginx can't reach services:**
   ```bash
   # Check internal network
   ./scripts/remote-deploy.sh status
   ```

4. **Agent fails to build:**
   ```bash
   # Deploy agent separately 
   ./scripts/remote-deploy.sh agent --skip-validation
   ```

### Debug Commands:
```bash
# View service logs
docker-compose logs <service>

# Check service status
docker-compose ps

# Test internal connectivity
docker-compose exec backend curl http://postgres:5432
docker-compose exec backend curl http://redis:6379

# Test nginx routing
curl http://localhost/health
curl http://localhost/
```

## 📊 Monitoring

### Quick Status Check:
```bash
./scripts/remote-deploy.sh status
```

### Detailed Health Check:
```bash
# From server
curl http://localhost/health        # Backend through nginx
curl http://localhost/              # Frontend through nginx
docker-compose ps                   # All container status
```

### Log Monitoring:
```bash
# Real-time logs
docker-compose logs -f <service>

# Recent logs from all services  
docker-compose logs --tail=20
```

## 🔄 Rollback Strategy

### Automatic Rollback:
- Sequential deployment stops on first failure
- Interactive manager offers rollback options
- Each service validation prevents bad deployments

### Manual Rollback:
```bash
# Stop problematic service
docker-compose stop <service>

# Revert to previous image
docker-compose up -d <service>

# Or rollback entire stack
docker-compose down
git checkout <previous-commit>
./scripts/remote-deploy.sh all
```

## 🎯 Best Practices

1. **Always test locally first:**
   ```bash
   cd "digital ocean docker"
   docker-compose build
   docker-compose up -d
   ```

2. **Use sequential deployment for full updates:**
   ```bash
   ./scripts/remote-deploy.sh all
   ```

3. **Use single service deployment for quick fixes:**
   ```bash
   ./scripts/remote-deploy.sh backend
   ```

4. **Monitor logs during deployment:**
   ```bash
   # In another terminal
   ssh root@64.227.46.188 "cd /root/viworks-repo/'digital ocean docker' && docker-compose logs -f"
   ```

5. **Validate after each phase:**
   - Infrastructure: Database/Redis connectivity
   - Backend: API endpoints responding
   - Frontend: Web app loading
   - Nginx: External access working

## 🚀 Quick Start

**For first-time deployment:**
```bash
git add .
git commit -m "Sequential deployment setup"
git push origin main

# Then use GitHub Actions "Sequential ViWorks Deployment"
# OR
./scripts/remote-deploy.sh all
```

**For quick service updates:**
```bash
# Update code
git add .
git commit -m "Fix backend issue"
git push origin main

# Deploy only backend
./scripts/remote-deploy.sh backend
```
