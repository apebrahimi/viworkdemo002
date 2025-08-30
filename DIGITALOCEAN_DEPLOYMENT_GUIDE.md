# 🚀 ViWorks DigitalOcean Deployment Guide

## Overview
This guide will help you deploy your ViWorks application to your DigitalOcean Docker droplet at `64.227.46.188`.

## Prerequisites
- ✅ DigitalOcean Docker droplet running Ubuntu 22.04
- ✅ SSH access to the droplet
- ✅ Docker and Docker Compose installed (already available on the droplet)

## Application Architecture
Your ViWorks application consists of:
- **Frontend**: Next.js application (port 3000)
- **Backend**: Admin panel with Rust backend (port 8081) and Next.js frontend (port 3000)
- **Database**: PostgreSQL (port 5432)
- **Cache**: Redis (port 6379)
- **Database Management**: pgAdmin (port 5050)

## Step 1: Connect to Your DigitalOcean Droplet

```bash
ssh root@64.227.46.188
```

## Step 2: Prepare the Server Environment

### Update the system
```bash
apt update && apt upgrade -y
```

### Create application directory
```bash
mkdir -p /opt/viworks
cd /opt/viworks
```

### Install additional tools
```bash
apt install -y git curl wget nano htop
```

## Step 3: Clone Your Application

### Option A: Clone from Git (if your code is in a repository)
```bash
git clone <your-repository-url> .
```

### Option B: Upload files manually
If your code isn't in a repository, you can use `scp` to upload files:

From your local machine:
```bash
# Upload the entire project
scp -r /path/to/your/viworks/project root@188.166.156.31:/opt/viworks/
```

## Step 4: Create Production Environment Files

### Create environment file for the admin panel
```bash
nano /opt/viworks/viworksclient01/products/admin-panel/.env
```

Add the following content:
```env
# Database Configuration
POSTGRES_PASSWORD=your_secure_postgres_password_here
DATABASE_URL=postgresql://admin:your_secure_postgres_password_here@postgres:5432/viworks_admin

# Redis Configuration
REDIS_URL=redis://redis:6379

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here_change_this_in_production

# Application URLs
ADMIN_PANEL_URL=http://64.227.46.188:3000
CORS_ORIGIN=http://64.227.46.188:3000

# Logging
LOG_LEVEL=info

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Node Environment
NODE_ENV=production

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://64.227.46.188:8081
NEXT_PUBLIC_WS_URL=ws://64.227.46.188:8081

# pgAdmin Configuration
PGADMIN_EMAIL=admin@viworks.com
PGADMIN_PASSWORD=your_secure_pgadmin_password_here
```

### Create environment file for the main frontend
```bash
nano /opt/viworks/viworks-frontend/.env
```

Add the following content:
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://64.227.46.188:8081
```

## Step 5: Configure Firewall

The DigitalOcean droplet has UFW enabled. We need to open the necessary ports:

```bash
# Allow HTTP and HTTPS
ufw allow 80
ufw allow 443

# Allow application ports
ufw allow 3000
ufw allow 8081
ufw allow 5432
ufw allow 6379
ufw allow 5050

# Reload firewall
ufw reload

# Check firewall status
ufw status
```

## Step 6: Create Docker Compose for Production

### Create main docker-compose.yml
```bash
nano /opt/viworks/docker-compose.yml
```

Add the following content:
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: viworks-postgres
    environment:
      POSTGRES_DB: viworks_admin
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --lc-collate=C --lc-ctype=C"
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - viworks-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d viworks_admin"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: viworks-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - viworks-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # Backend API Server
  backend:
    build:
      context: ./viworksclient01/products/admin-panel/backend
      dockerfile: Dockerfile
    container_name: viworks-backend
    ports:
      - "8081:8081"
    env_file:
      - ./viworksclient01/products/admin-panel/.env
    volumes:
      - ./viworksclient01/products/admin-panel/backend/logs:/app/logs
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - viworks-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8081/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Admin Panel Frontend
  admin-frontend:
    build:
      context: ./viworksclient01/products/admin-panel/frontend
      dockerfile: Dockerfile
    container_name: viworks-admin-frontend
    ports:
      - "3000:3000"
    env_file:
      - ./viworksclient01/products/admin-panel/.env
    depends_on:
      - backend
    networks:
      - viworks-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Main Frontend
  frontend:
    build:
      context: ./viworks-frontend
      dockerfile: Dockerfile
    container_name: viworks-frontend
    ports:
      - "3001:3000"
    env_file:
      - ./viworks-frontend/.env
    depends_on:
      - backend
    networks:
      - viworks-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  # pgAdmin (Database Management)
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: viworks-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD}
      PGADMIN_CONFIG_SERVER_MODE: 'False'
    ports:
      - "5050:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    depends_on:
      - postgres
    networks:
      - viworks-network
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: viworks-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - admin-frontend
      - backend
    networks:
      - viworks-network
    restart: unless-stopped

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  pgadmin_data:
    driver: local

networks:
  viworks-network:
    driver: bridge
```

## Step 7: Create Nginx Configuration

### Create nginx directory
```bash
mkdir -p /opt/viworks/nginx
mkdir -p /opt/viworks/nginx/ssl
```

### Create nginx configuration
```bash
nano /opt/viworks/nginx/nginx.conf
```

Add the following content:
```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream admin-frontend {
        server admin-frontend:3000;
    }

    upstream backend {
        server backend:8081;
    }

    server {
        listen 80;
        server_name 64.227.46.188;

        # Main Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Admin Panel
        location /admin {
            proxy_pass http://admin-frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Backend API
        location /api {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # pgAdmin
        location /pgadmin {
            proxy_pass http://pgadmin:80;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## Step 8: Deploy the Application

### Build and start the services
```bash
cd /opt/viworks

# Build and start all services
docker-compose up -d --build

# Check the status
docker-compose ps

# View logs
docker-compose logs -f
```

### Check individual service logs
```bash
# Check backend logs
docker-compose logs backend

# Check frontend logs
docker-compose logs frontend

# Check admin frontend logs
docker-compose logs admin-frontend

# Check database logs
docker-compose logs postgres
```

## Step 9: Verify Deployment

### Check if services are running
```bash
docker ps
```

### Test the endpoints
```bash
# Test main frontend
curl http://64.227.46.188

# Test admin panel
curl http://64.227.46.188/admin

# Test backend health
curl http://64.227.46.188/api/health

# Test pgAdmin
curl http://64.227.46.188/pgadmin
```

## Step 10: Access Your Application

- **Main Frontend**: http://64.227.46.188
- **Admin Panel**: http://64.227.46.188/admin
- **Backend API**: http://64.227.46.188/api
- **pgAdmin**: http://64.227.46.188/pgadmin

## Step 11: Useful Commands

### Stop all services
```bash
docker-compose down
```

### Restart all services
```bash
docker-compose restart
```

### Update and redeploy
```bash
# Pull latest changes (if using git)
git pull

# Rebuild and restart
docker-compose up -d --build
```

### View resource usage
```bash
docker stats
```

### Backup database
```bash
docker exec viworks-postgres pg_dump -U admin viworks_admin > backup.sql
```

### Restore database
```bash
docker exec -i viworks-postgres psql -U admin viworks_admin < backup.sql
```

## Step 12: Monitoring and Maintenance

### Set up log rotation
```bash
# Create logrotate configuration
nano /etc/logrotate.d/viworks
```

Add:
```
/opt/viworks/viworksclient01/products/admin-panel/backend/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 root root
}
```

### Monitor disk space
```bash
# Check disk usage
df -h

# Check Docker disk usage
docker system df
```

### Clean up Docker
```bash
# Remove unused containers, networks, and images
docker system prune -a

# Remove unused volumes
docker volume prune
```

## Troubleshooting

### If services fail to start
```bash
# Check detailed logs
docker-compose logs [service-name]

# Check if ports are in use
netstat -tulpn | grep :3000
netstat -tulpn | grep :8081
```

### If database connection fails
```bash
# Check if PostgreSQL is running
docker exec viworks-postgres pg_isready -U admin

# Check database logs
docker-compose logs postgres
```

### If frontend can't connect to backend
```bash
# Check if backend is healthy
curl http://localhost:8081/health

# Check network connectivity
docker exec viworks-frontend ping backend
```

## Security Considerations

1. **Change default passwords** in the `.env` file
2. **Use HTTPS** in production (set up SSL certificates)
3. **Restrict database access** (don't expose PostgreSQL port publicly)
4. **Regular updates** of Docker images
5. **Monitor logs** for suspicious activity

## Next Steps

1. Set up SSL certificates with Let's Encrypt
2. Configure automated backups
3. Set up monitoring and alerting
4. Configure CI/CD pipeline for automated deployments
5. Set up domain name and DNS

---

**Your ViWorks application is now deployed on DigitalOcean!** 🎉

Access your application at:
- Main Frontend: http://64.227.46.188
- Admin Panel: http://64.227.46.188/admin
- Database Management: http://64.227.46.188/pgadmin
