# 🚀 Quick Start: Deploy ViWorks to DigitalOcean

## Prerequisites
- ✅ DigitalOcean Docker droplet at `64.227.46.188`
- ✅ SSH access to the droplet
- ✅ Your ViWorks project files

## Option 1: Automated Deployment (Recommended)

### 1. Run the deployment script
```bash
./deploy-to-digitalocean.sh
```

This script will:
- ✅ Connect to your DigitalOcean droplet
- ✅ Upload all project files
- ✅ Configure firewall rules
- ✅ Create environment files
- ✅ Set up Docker Compose
- ✅ Build and start all services
- ✅ Test the deployment

### 2. Access your application
After successful deployment, access your application at:
- **Main Frontend**: http://64.227.46.188
- **Admin Panel**: http://64.227.46.188/admin
- **Database Management**: http://64.227.46.188/pgadmin

## Option 2: Manual Deployment

### 1. Connect to your droplet
```bash
ssh root@64.227.46.188
```

### 2. Prepare the server
```bash
# Update system
apt update && apt upgrade -y

# Install tools
apt install -y git curl wget nano htop

# Create app directory
mkdir -p /opt/viworks
cd /opt/viworks
```

### 3. Upload your project
From your local machine:
```bash
scp -r /path/to/your/viworks/project/* root@64.227.46.188:/opt/viworks/
```

### 4. Configure firewall
```bash
ufw allow 80
ufw allow 443
ufw allow 3000
ufw allow 8081
ufw allow 5432
ufw allow 6379
ufw allow 5050
ufw reload
```

### 5. Create environment files
```bash
# Create admin panel environment
nano /opt/viworks/viworksclient01/products/admin-panel/.env
```

Add:
```env
POSTGRES_PASSWORD=your_secure_password
DATABASE_URL=postgresql://admin:your_secure_password@postgres:5432/viworks_admin
REDIS_URL=redis://redis:6379
JWT_SECRET=your_super_secure_jwt_secret
ADMIN_PANEL_URL=http://64.227.46.188:3000
CORS_ORIGIN=http://64.227.46.188:3000
LOG_LEVEL=info
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://64.227.46.188:8081
NEXT_PUBLIC_WS_URL=ws://64.227.46.188:8081
PGADMIN_EMAIL=admin@viworks.com
PGADMIN_PASSWORD=your_secure_pgadmin_password
```

```bash
# Create main frontend environment
nano /opt/viworks/viworks-frontend/.env
```

Add:
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://64.227.46.188:8081
```

### 6. Deploy with Docker Compose
```bash
cd /opt/viworks
docker-compose up -d --build
```

### 7. Check deployment
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Test endpoints
curl http://64.227.46.188
curl http://64.227.46.188/admin
curl http://64.227.46.188/api/health
```

## Post-Deployment

### Change default passwords
⚠️ **Important**: Change the default passwords in the `.env` files:
- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `PGADMIN_PASSWORD`

### Useful commands
```bash
# View logs
ssh root@64.227.46.188 'cd /opt/viworks && docker-compose logs -f'

# Restart services
ssh root@64.227.46.188 'cd /opt/viworks && docker-compose restart'

# Stop services
ssh root@64.227.46.188 'cd /opt/viworks && docker-compose down'

# Update and redeploy
ssh root@64.227.46.188 'cd /opt/viworks && git pull && docker-compose up -d --build'
```

### Backup database
```bash
ssh root@64.227.46.188 'docker exec viworks-postgres pg_dump -U admin viworks_admin > backup.sql'
```

## Troubleshooting

### If services fail to start
```bash
# Check detailed logs
ssh root@64.227.46.188 'cd /opt/viworks && docker-compose logs [service-name]'

# Check if ports are in use
ssh root@64.227.46.188 'netstat -tulpn | grep :3000'
```

### If database connection fails
```bash
# Check PostgreSQL status
ssh root@64.227.46.188 'docker exec viworks-postgres pg_isready -U admin'

# Check database logs
ssh root@64.227.46.188 'cd /opt/viworks && docker-compose logs postgres'
```

### If frontend can't connect to backend
```bash
# Check backend health
ssh root@64.227.46.188 'curl http://localhost:8081/health'

# Check network connectivity
ssh root@64.227.46.188 'docker exec viworks-frontend ping backend'
```

## Security Checklist

- [ ] Change default passwords in `.env` files
- [ ] Set up SSL certificates (Let's Encrypt)
- [ ] Configure automated backups
- [ ] Set up monitoring and alerting
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity

## Next Steps

1. **Set up SSL**: Configure HTTPS with Let's Encrypt
2. **Domain**: Point your domain to the droplet IP
3. **Monitoring**: Set up monitoring and alerting
4. **Backups**: Configure automated database backups
5. **CI/CD**: Set up automated deployment pipeline

---

**Your ViWorks application is now live on DigitalOcean!** 🎉

For detailed instructions, see `DIGITALOCEAN_DEPLOYMENT_GUIDE.md`
