# 🚀 Standalone Nginx Container for ViWorks

This directory contains a standalone nginx container that acts as a reverse proxy for all ViWorks services.

## 🎯 Purpose

The standalone nginx container solves the network connectivity issues by:
- Running independently of other containers
- Having access to all services through Docker networking
- Properly routing requests to the correct containers
- Handling SSL termination for all domains

## 📁 Files

- `docker-compose.yml` - Docker Compose configuration for the nginx container
- `nginx.conf` - Nginx configuration with all domain routing rules
- `deploy.sh` - Basic deployment script
- `connect-containers.sh` - Script to connect all containers to the network
- `setup-standalone-nginx.sh` - Comprehensive setup script

## 🚀 Quick Setup

1. **Navigate to the standalone-nginx directory:**
   ```bash
   cd "digital ocean docker/standalone-nginx"
   ```

2. **Run the comprehensive setup script:**
   ```bash
   chmod +x setup-standalone-nginx.sh
   ./setup-standalone-nginx.sh
   ```

## 🔧 Manual Setup

If you prefer to set up manually:

1. **Create necessary directories:**
   ```bash
   mkdir -p logs ssl
   ```

2. **Stop existing nginx services:**
   ```bash
   sudo systemctl stop nginx
   sudo systemctl disable nginx
   docker-compose down
   ```

3. **Create Docker network:**
   ```bash
   docker network create viworks-network
   ```

4. **Connect all containers to the network:**
   ```bash
   chmod +x connect-containers.sh
   ./connect-containers.sh
   ```

5. **Start the standalone nginx container:**
   ```bash
   docker-compose up -d
   ```

## 🌐 Domain Configuration

The nginx configuration handles the following domains:

- `website-vw.neuratalent.com` → `viworks-website:3000`
- `viworks.neuratalent.com` → `viworks-frontend:3000`
- `admin-viworks.neuratalent.com` → `viworks-frontend:3000`
- `api-viworks.neuratalent.com` → `viworks-backend:8081`
- `app-viworks.neuratalent.com` → `viworks-frontend:3000`

## 🔍 Troubleshooting

### Check container status:
```bash
docker-compose ps
```

### Check nginx logs:
```bash
docker logs viworks-standalone-nginx
```

### Test container connectivity:
```bash
docker exec viworks-standalone-nginx ping viworks-website
docker exec viworks-standalone-nginx ping viworks-frontend
docker exec viworks-standalone-nginx ping viworks-backend
```

### Check network connectivity:
```bash
docker network inspect viworks-network
```

### Test nginx configuration:
```bash
docker exec viworks-standalone-nginx nginx -t
```

## 🔄 Updating Configuration

To update the nginx configuration:

1. Edit `nginx.conf`
2. Restart the container:
   ```bash
   docker-compose restart
   ```

## 🛑 Stopping the Service

To stop the standalone nginx container:

```bash
docker-compose down
```

## 📊 Monitoring

Monitor the nginx container with:

```bash
# View logs in real-time
docker logs -f viworks-standalone-nginx

# Check resource usage
docker stats viworks-standalone-nginx

# Test endpoints
curl -I https://website-vw.neuratalent.com
curl -I https://admin-viworks.neuratalent.com
```
