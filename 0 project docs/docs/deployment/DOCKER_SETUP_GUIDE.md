# 🐳 Docker Setup Guide for ViWorkS Admin Panel

## 📋 **OVERVIEW**

This guide will help you install Docker and set up your containerized ViWorkS Admin Panel when you're ready. The admin panel is already fully containerized and ready to deploy!

---

## 🎯 **WHEN YOU'RE READY TO DEPLOY**

### **Prerequisites Checklist**
- [ ] Docker Desktop installed
- [ ] Docker Compose installed
- [ ] Git installed
- [ ] At least 4GB RAM available
- [ ] 10GB free disk space

---

## 🚀 **DOCKER INSTALLATION BY PLATFORM**

### **Windows 10/11**
```bash
# 1. Download Docker Desktop
# Visit: https://www.docker.com/products/docker-desktop

# 2. Install Docker Desktop
# Run the installer and follow the setup wizard

# 3. Enable WSL 2 (if prompted)
# Docker Desktop will guide you through this

# 4. Verify installation
docker --version
docker-compose --version
```

### **macOS**
```bash
# 1. Download Docker Desktop for Mac
# Visit: https://www.docker.com/products/docker-desktop

# 2. Install Docker Desktop
# Drag Docker.app to Applications folder

# 3. Start Docker Desktop
# Launch from Applications or Spotlight

# 4. Verify installation
docker --version
docker-compose --version
```

### **Ubuntu/Debian Linux**
```bash
# 1. Update package index
sudo apt-get update

# 2. Install prerequisites
sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release

# 3. Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 4. Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. Install Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# 6. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 7. Add user to docker group
sudo usermod -aG docker $USER

# 8. Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# 9. Verify installation
docker --version
docker-compose --version
```

### **CentOS/RHEL/Fedora**
```bash
# 1. Install prerequisites
sudo yum install -y yum-utils

# 2. Add Docker repository
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 3. Install Docker Engine
sudo yum install docker-ce docker-ce-cli containerd.io

# 4. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 5. Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# 6. Add user to docker group
sudo usermod -aG docker $USER

# 7. Verify installation
docker --version
docker-compose --version
```

---

## 🔧 **POST-INSTALLATION SETUP**

### **1. Verify Docker Installation**
```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version

# Test Docker with hello-world
docker run hello-world

# Check Docker daemon status
docker info
```

### **2. Configure Docker Settings (Optional)**
```bash
# Increase memory limit (Docker Desktop)
# Go to Docker Desktop > Settings > Resources > Advanced
# Increase memory to at least 4GB

# Configure disk space
# Ensure you have at least 10GB free space for images
```

### **3. Test Docker Compose**
```bash
# Create a test compose file
cat > test-compose.yml << EOF
version: '3.8'
services:
  test:
    image: hello-world
EOF

# Run test
docker-compose -f test-compose.yml up

# Clean up
docker-compose -f test-compose.yml down
rm test-compose.yml
```

---

## 🚀 **DEPLOYING YOUR VIWORKS ADMIN PANEL**

### **Step 1: Navigate to Project Directory**
```bash
# Navigate to your admin panel directory
cd viworks-admin-panel

# Verify files are present
ls -la
```

### **Step 2: Set Up Environment**
```bash
# Copy environment configuration
cp env.example .env

# Edit environment variables (optional)
# nano .env
# or
# code .env
```

### **Step 3: Start All Services**
```bash
# Start all services in background
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### **Step 4: Verify Deployment**
```bash
# Test backend health
curl http://localhost:8080/health

# Test frontend
curl http://localhost:3000

# Test database
docker-compose exec postgres psql -U admin -d viworks_admin -c "SELECT version();"
```

### **Step 5: Access Your Application**
Open your web browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **pgAdmin**: http://localhost:5050
  - Email: admin@viworks.com
  - Password: admin123

---

## 🛠️ **USEFUL DOCKER COMMANDS**

### **Service Management**
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View running containers
docker-compose ps

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

### **Container Management**
```bash
# Access container shell
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec postgres psql -U admin -d viworks_admin

# View container resources
docker stats

# Clean up unused resources
docker system prune -a
```

### **Database Management**
```bash
# Create database backup
docker-compose exec postgres pg_dump -U admin viworks_admin > backup.sql

# Restore database
docker-compose exec -T postgres psql -U admin -d viworks_admin < backup.sql

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

---

## 🔐 **SECURITY CONSIDERATIONS**

### **Production Deployment**
```bash
# 1. Change default passwords in .env
# Edit .env file and update:
# - POSTGRES_PASSWORD
# - JWT_SECRET
# - PGADMIN_PASSWORD

# 2. Generate SSL certificates
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem

# 3. Start with production profile
docker-compose -f docker-compose.yml --profile production up -d
```

### **Network Security**
```bash
# Check exposed ports
docker-compose ps

# Verify network isolation
docker network ls
docker network inspect viworks-admin-panel_viworks-admin-network
```

---

## 🆘 **TROUBLESHOOTING**

### **Common Issues**

#### **Docker Not Starting**
```bash
# Windows/macOS: Restart Docker Desktop
# Linux: Check Docker service
sudo systemctl status docker
sudo systemctl start docker
```

#### **Port Conflicts**
```bash
# Check if ports are in use
netstat -tulpn | grep :3000
netstat -tulpn | grep :8080
netstat -tulpn | grep :5432

# Change ports in docker-compose.yml if needed
```

#### **Permission Issues (Linux)**
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and log back in, or run:
newgrp docker
```

#### **Insufficient Resources**
```bash
# Check available memory
free -h

# Check available disk space
df -h

# Increase Docker Desktop resources (Windows/macOS)
# Go to Docker Desktop > Settings > Resources
```

#### **Container Won't Start**
```bash
# Check container logs
docker-compose logs backend
docker-compose logs frontend

# Check container status
docker-compose ps

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d
```

---

## 📚 **ADDITIONAL RESOURCES**

### **Docker Documentation**
- [Docker Desktop](https://docs.docker.com/desktop/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com/)

### **Platform-Specific Guides**
- [Windows Docker Setup](https://docs.docker.com/desktop/install/windows/)
- [macOS Docker Setup](https://docs.docker.com/desktop/install/mac/)
- [Linux Docker Setup](https://docs.docker.com/engine/install/)

### **ViWorkS Admin Panel Documentation**
- `CONTAINER_DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `CONTAINER_DEPLOYMENT_SUMMARY.md` - Quick reference
- `BACKEND_HOSTING_RECOMMENDATIONS.md` - Cloud hosting options

---

## 🎯 **NEXT STEPS AFTER DOCKER INSTALLATION**

### **Phase 1: Local Testing**
1. ✅ Install Docker and Docker Compose
2. ✅ Set up environment configuration
3. ✅ Start services locally
4. ✅ Test all functionality
5. ✅ Verify database connectivity

### **Phase 2: Cloud Deployment**
1. Choose cloud platform (AWS, GCP, Azure, DigitalOcean)
2. Deploy to staging environment
3. Configure production settings
4. Set up monitoring and alerts

### **Phase 3: Production Launch**
1. Deploy to production
2. Configure SSL certificates
3. Set up automated backups
4. Implement monitoring

---

## 🎉 **READY TO DEPLOY!**

Once you have Docker installed, your ViWorkS Admin Panel will be ready to run with just a few commands:

```bash
cd viworks-admin-panel
cp env.example .env
docker-compose up -d
```

**Your containerized admin panel is waiting for you! 🚀**

---

## 📞 **GETTING HELP**

If you encounter issues during Docker installation:

1. **Check Docker documentation** for your platform
2. **Verify system requirements** (RAM, disk space)
3. **Check for port conflicts** on your system
4. **Review troubleshooting section** above
5. **Use Docker community forums** for platform-specific issues

**Your ViWorkS Admin Panel is fully containerized and ready to deploy whenever you're ready! 🐳**
