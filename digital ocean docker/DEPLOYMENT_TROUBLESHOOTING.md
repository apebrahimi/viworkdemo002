# ViWorks Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. Container Name Conflict Error

**Error:** `Error response from daemon: Conflict. The container name "/viworks-backend" is already in use`

**Solution:**
```bash
# Run the cleanup script
./cleanup-containers.sh

# Or manually remove containers
docker rm -f viworks-backend viworks-frontend viworks-postgres viworks-redis
```

### 2. Deployment Scripts

#### Standard Deployment
```bash
./deploy.sh
```

#### Robust Deployment (Recommended)
```bash
./deploy-robust.sh
```

#### Manual Cleanup
```bash
./cleanup-containers.sh
```

### 3. Manual Container Management

#### Stop all containers
```bash
docker-compose down --timeout 30
```

#### Force remove specific containers
```bash
docker rm -f viworks-backend viworks-frontend viworks-postgres viworks-redis
```

#### Clean up Docker system
```bash
docker system prune -f
docker image prune -a -f
docker network prune -f
```

### 4. Debugging Steps

#### Check container status
```bash
docker ps -a | grep viworks
```

#### Check container logs
```bash
docker-compose logs backend
docker-compose logs frontend
```

#### Check if ports are in use
```bash
netstat -tulpn | grep -E ':(3000|8081|5432|6379)'
```

### 5. Environment Variables

Make sure `env.production` file exists and contains:
```bash
DATABASE_URL=postgresql://admin:viworks_password_2024@postgres:5432/viworks_admin
REDIS_URL=redis://redis:6379
RUST_LOG=info
RUST_BACKTRACE=1
```

### 6. Network Issues

#### Check Docker networks
```bash
docker network ls
docker network inspect digitaloceandocker_viworks-network
```

#### Recreate network if needed
```bash
docker network rm digitaloceandocker_viworks-network
docker-compose up -d
```

### 7. Build Issues

#### Clean build
```bash
docker-compose build --no-cache
```

#### Rebuild specific service
```bash
docker-compose build --no-cache backend
```

### 8. Health Checks

#### Test endpoints manually
```bash
curl -f http://localhost:3000
curl -f http://localhost:8081/health
```

#### Check service health
```bash
docker-compose ps
```

### 9. Common Error Messages

#### "no configuration file provided: not found"
- Check if docker-compose.yml exists in current directory
- Ensure you're running from the correct directory

#### "permission denied"
- Make scripts executable: `chmod +x *.sh`
- Check file permissions

#### "port already in use"
- Stop existing services: `docker-compose down`
- Check for other services using the same ports

### 10. Complete Reset Procedure

If all else fails, perform a complete reset:

```bash
# 1. Stop everything
docker-compose down --timeout 30

# 2. Remove all containers
docker rm -f $(docker ps -aq)

# 3. Remove all images
docker rmi -f $(docker images -q)

# 4. Clean up system
docker system prune -a -f

# 5. Rebuild from scratch
docker-compose up -d --build
```

### 11. Monitoring and Logs

#### Real-time logs
```bash
docker-compose logs -f
```

#### Service-specific logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

#### Resource usage
```bash
docker stats
```

### 12. SSL/HTTPS Issues

If using nginx with SSL certificates:
- Ensure certificates are properly configured
- Check nginx configuration syntax
- Verify domain DNS settings

### 13. Database Issues

#### Check database connectivity
```bash
docker exec -it viworks-postgres psql -U admin -d viworks_admin
```

#### Reset database
```bash
docker-compose down
docker volume rm digitaloceandocker_postgres_data
docker-compose up -d
```

### 14. Performance Issues

#### Check resource usage
```bash
docker stats --no-stream
```

#### Optimize images
```bash
docker image prune -a -f
```

### 15. Emergency Procedures

#### Quick restart
```bash
docker-compose restart
```

#### Force restart with rebuild
```bash
docker-compose down
docker-compose up -d --build --force-recreate
```

#### Complete system restart
```bash
sudo systemctl restart docker
docker-compose up -d
```

## Support

If issues persist:
1. Check the logs: `docker-compose logs`
2. Verify environment variables
3. Ensure all required files are present
4. Check system resources (CPU, memory, disk space)
5. Verify network connectivity
