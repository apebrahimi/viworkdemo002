# ViWorks Platform - Production Deployment Guide

## 🚀 Overview

This repository contains the production deployment configuration for the ViWorks platform, including backend services, frontend applications, and infrastructure components.

## 🏗️ Architecture

### Network Structure
- **`viworks-public`**: Public-facing network (only Nginx exposed)
- **`viworks-internal`**: Internal network for all services

### Services
1. **PostgreSQL** (port 5432) - Database
2. **Redis** (port 6379) - Caching
3. **Backend** (port 8081) - Rust API server
4. **Frontend** (port 3000) - Next.js admin panel
5. **Website** (port 3000) - Public website
6. **Agent** (port 8443) - OS agent service
7. **Nginx** (ports 80, 443) - Reverse proxy

## 📋 Prerequisites

- Docker and Docker Compose
- DigitalOcean droplet with SSH access
- Domain names with SSL certificates
- At least 4GB RAM, 2 vCPUs, 80GB storage

## 🚀 Quick Deployment

### 1. Clone and Setup
```bash
git clone <repository>
cd "digital ocean docker"
```

### 2. Configure Environment
```bash
# Copy and edit environment file
cp env.production.example env.production
nano env.production
```

### 3. Create Networks
```bash
docker network create viworks-public
docker network create viworks-internal
```

### 4. Deploy
```bash
docker-compose up -d
```

## 🔧 Configuration

### Environment Variables
Key environment variables in `env.production`:
- `POSTGRES_PASSWORD`: Database password
- `JWT_SECRET`: JWT signing secret
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string

### SSL Certificates
Place SSL certificates in `./nginx/ssl/`:
- `viworks.neuratalent.com/`
- `admin-viworks.neuratalent.com/`
- `website-vw.neuratalent.com/`

## 📊 Monitoring and Health Checks

### Health Check Endpoints
- **Backend**: `http://localhost:8081/health`
- **Frontend**: `http://localhost:3000`
- **Website**: `http://localhost:3000`
- **Nginx**: `http://localhost/health`

### Manual Health Check
```bash
# Run comprehensive health check
./scripts/health-check.sh

# Check specific service
docker exec viworks-backend curl -f http://localhost:8081/health
```

### Continuous Monitoring
```bash
# Start monitoring service
./scripts/monitor.sh

# Run in background
nohup ./scripts/monitor.sh > monitor.log 2>&1 &
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Backend Container Restarting
**Symptoms**: Container exits immediately after "Launching app"
**Causes**: 
- Missing dependencies in Cargo.toml
- Database connection issues
- Missing environment variables

**Solutions**:
```bash
# Check logs
docker logs viworks-backend --tail 100

# Verify dependencies
docker exec viworks-backend ls -la /app/

# Check environment
docker exec viworks-backend env | grep -E "(DATABASE|REDIS|JWT)"
```

#### 2. NGINX Upstream Errors
**Symptoms**: "upstream not found" errors
**Causes**: Backend service not running or unhealthy

**Solutions**:
```bash
# Check backend status
docker ps | grep viworks-backend

# Test backend connectivity
curl -f http://localhost:8081/health

# Check network connectivity
docker exec viworks-backend ping postgres
docker exec viworks-backend ping redis
```

#### 3. Database Migration Issues
**Symptoms**: "relation already exists" errors
**Causes**: Migrations running multiple times

**Solutions**:
```bash
# Check migration status
docker exec viworks-postgres psql -U admin -d viworks -c "\dt"

# Reset migrations if needed
docker exec viworks-postgres psql -U admin -d viworks -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

### Debug Commands

#### Container Status
```bash
# All containers
docker ps -a

# Container logs
docker logs <container-name> --tail 100

# Container inspection
docker inspect <container-name>
```

#### Network Debugging
```bash
# Check networks
docker network ls
docker network inspect viworks-internal

# Test connectivity
docker exec viworks-backend ping postgres
docker exec viworks-backend ping redis
```

#### Resource Usage
```bash
# Container stats
docker stats --no-stream

# Disk usage
df -h
docker system df
```

## 🔒 Security Features

### Network Isolation
- Public services only accessible through Nginx
- Internal services on private network
- No direct external access to databases

### SSL/TLS
- All external traffic encrypted
- Modern cipher suites
- HSTS headers enabled

### Container Security
- Non-root users where possible
- Read-only filesystems for configs
- Resource limits enforced

## 📈 Performance Optimization

### Database
- Connection pooling configured
- Prepared statements enabled
- Index optimization

### Caching
- Redis for session storage
- Response caching headers
- Static asset optimization

### Load Balancing
- NGINX upstream configuration
- Health check integration
- Failover handling

## 🚨 Emergency Procedures

### Service Recovery
```bash
# Restart specific service
docker-compose restart <service-name>

# Full platform restart
docker-compose down
docker-compose up -d

# Emergency cleanup
docker-compose down -v --rmi all
docker system prune -a -f
```

### Data Backup
```bash
# Database backup
docker exec viworks-postgres pg_dump -U admin viworks > backup_$(date +%Y%m%d_%H%M%S).sql

# Redis backup
docker exec viworks-redis redis-cli BGSAVE
```

### Rollback
```bash
# Revert to previous version
git checkout <previous-commit>
docker-compose down
docker-compose up -d --build
```

## 📚 Maintenance

### Regular Tasks
- **Daily**: Check health check reports
- **Weekly**: Review logs for errors
- **Monthly**: Update dependencies
- **Quarterly**: Security audit

### Log Rotation
- Docker logs limited to 10MB per container
- Maximum 3 log files per container
- External log aggregation recommended

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Verify deployment
./scripts/health-check.sh
```

## 🤝 Support

### Getting Help
1. Check this documentation
2. Run health check script
3. Review container logs
4. Check GitHub issues
5. Contact development team

### Useful Resources
- [Docker Documentation](https://docs.docker.com/)
- [NGINX Configuration](https://nginx.org/en/docs/)
- [PostgreSQL Administration](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)

## 📝 Changelog

### Version 2.0.0 (Current)
- Enhanced error handling and resilience
- Comprehensive monitoring and alerting
- Improved health checks and logging
- Better container restart policies
- Enhanced NGINX configuration

### Version 1.0.0
- Initial production deployment
- Basic container orchestration
- SSL/TLS configuration
- Health check endpoints

---

**Last Updated**: $(date)
**Maintainer**: ViWorks Development Team
