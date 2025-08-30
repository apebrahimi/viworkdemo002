# 🐳 ViWorkS Admin Panel - Container Deployment Guide

## 📋 **OVERVIEW**

This guide provides step-by-step instructions for deploying the ViWorkS Admin Panel to various cloud Docker platforms. The application is fully containerized and can be deployed to any platform that supports Docker containers.

---

## 🏗️ **ARCHITECTURE OVERVIEW**

### **Containerized Components**
```
┌─────────────────────────────────────────────────────────────────┐
│                    ViWorkS Admin Panel Containers               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   Frontend      │    │   Backend       │    │   Database   │ │
│  │   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)│ │
│  │   Port: 3000    │    │   Port: 8080    │    │   Port: 5432 │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
│           │                       │                             │
│           │                       │                             │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │   Nginx         │    │   Redis         │                    │
│  │   (Reverse      │    │   (Cache)       │                    │
│  │   Proxy)        │    │   Port: 6379    │                    │
│  └─────────────────┘    └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

### **Container Images**
- **Frontend**: `viworks-admin-frontend:latest` (Next.js 14)
- **Backend**: `viworks-admin-backend:latest` (Node.js 20)
- **Database**: `postgres:15-alpine`
- **Cache**: `redis:7-alpine`
- **Proxy**: `nginx:alpine` (optional)
- **Management**: `dpage/pgadmin4:latest`

---

## 🚀 **DEPLOYMENT OPTIONS**

### **1. Local Development**
**Best for**: Development, testing, small teams

#### **Quick Start**
```bash
# Clone the repository
git clone <repository-url>
cd viworks-admin-panel

# Copy environment configuration
cp env.example .env

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
# pgAdmin: http://localhost:5050
```

#### **Individual Component Deployment**
```bash
# Start only database and cache
docker-compose up -d postgres redis

# Start backend only
docker-compose up -d backend

# Start frontend only
docker-compose up -d frontend
```

---

### **2. AWS ECS (Elastic Container Service)**
**Best for**: Production, enterprise, high availability

#### **Prerequisites**
- AWS CLI installed and configured
- Docker installed
- AWS account with ECS permissions

#### **Deployment Steps**
```bash
# 1. Build and push images
./deploy-cloud.sh build

# 2. Deploy to AWS ECS
./deploy-cloud.sh aws

# 3. Configure environment variables in AWS ECS console
# 4. Set up Application Load Balancer
# 5. Configure auto-scaling
```

#### **AWS ECS Configuration**
```json
// aws/task-definition-backend.json
{
  "family": "viworks-admin-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "ACCOUNT.dkr.ecr.REGION.amazonaws.com/viworks-admin-backend:latest",
      "portMappings": [{"containerPort": 8080}],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "DATABASE_URL", "value": "postgresql://..."}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/viworks-admin-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### **Cost Estimate**: $50-200/month

---

### **3. Google Cloud Run**
**Best for**: Serverless, pay-per-use, easy scaling

#### **Prerequisites**
- Google Cloud CLI installed and configured
- Docker installed
- Google Cloud project with billing enabled

#### **Deployment Steps**
```bash
# 1. Build and push images
./deploy-cloud.sh build

# 2. Deploy to Google Cloud Run
./deploy-cloud.sh gcp

# 3. Configure environment variables in Cloud Run console
# 4. Set up custom domain (optional)
```

#### **Cloud Run Configuration**
```yaml
# cloud-run.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: viworks-admin-backend
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"
        autoscaling.knative.dev/maxScale: "10"
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      containers:
      - image: gcr.io/PROJECT/viworks-admin-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          value: "postgresql://..."
        resources:
          limits:
            cpu: "1000m"
            memory: "512Mi"
```

#### **Cost Estimate**: $20-100/month

---

### **4. Azure Container Instances**
**Best for**: Simple container deployment, Windows containers

#### **Prerequisites**
- Azure CLI installed and configured
- Docker installed
- Azure subscription

#### **Deployment Steps**
```bash
# 1. Build and push images
./deploy-cloud.sh build

# 2. Deploy to Azure Container Instances
./deploy-cloud.sh azure

# 3. Configure environment variables in Azure portal
# 4. Set up Azure Container Registry
```

#### **Azure Configuration**
```bash
# Create resource group
az group create --name viworks-admin-rg --location eastus

# Create container registry
az acr create --resource-group viworks-admin-rg --name viworksadminregistry --sku Basic

# Deploy backend container
az container create \
  --resource-group viworks-admin-rg \
  --name viworks-admin-backend \
  --image viworksadminregistry.azurecr.io/viworks-admin-backend:latest \
  --dns-name-label viworks-admin-backend \
  --ports 8080 \
  --environment-variables NODE_ENV=production
```

#### **Cost Estimate**: $30-150/month

---

### **5. DigitalOcean App Platform**
**Best for**: Simple deployment, managed databases

#### **Prerequisites**
- DigitalOcean CLI (doctl) installed and configured
- Docker installed
- DigitalOcean account

#### **Deployment Steps**
```bash
# 1. Build and push images
./deploy-cloud.sh build

# 2. Deploy to DigitalOcean App Platform
./deploy-cloud.sh digitalocean

# 3. Configure environment variables in DO console
# 4. Set up managed databases
```

#### **DigitalOcean Configuration**
```yaml
# do-app.yaml
name: viworks-admin-panel
region: nyc1
services:
- name: backend
  source_dir: /backend
  github:
    repo: your-username/viworks-admin-panel
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: DATABASE_URL
    value: ${DATABASE_URL}

databases:
- name: postgres
  engine: PG
  version: "15"
  size: db-s-1vcpu-1gb
```

#### **Cost Estimate**: $25-75/month

---

## 🔧 **ENVIRONMENT CONFIGURATION**

### **Required Environment Variables**
```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"
POSTGRES_PASSWORD="secure_password"

# Cache
REDIS_URL="redis://host:port"

# Security
JWT_SECRET="your-super-secret-jwt-key"
BCRYPT_ROUNDS="12"

# Application
NODE_ENV="production"
CORS_ORIGIN="https://your-domain.com"
ADMIN_PANEL_URL="https://your-domain.com"

# Frontend
NEXT_PUBLIC_API_URL="https://api.your-domain.com"
NEXT_PUBLIC_WS_URL="wss://api.your-domain.com"
```

### **Environment Setup by Platform**

#### **AWS ECS**
```bash
# Set environment variables in ECS task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

#### **Google Cloud Run**
```bash
# Set environment variables during deployment
gcloud run deploy viworks-admin-backend \
  --set-env-vars NODE_ENV=production,DATABASE_URL=postgresql://...
```

#### **Azure Container Instances**
```bash
# Set environment variables during container creation
az container create \
  --environment-variables NODE_ENV=production DATABASE_URL=postgresql://...
```

#### **DigitalOcean App Platform**
```yaml
# Set in app specification
envs:
- key: NODE_ENV
  value: production
- key: DATABASE_URL
  value: ${DATABASE_URL}
```

---

## 🔐 **SECURITY CONFIGURATION**

### **SSL/TLS Setup**
```bash
# Generate SSL certificates
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem

# Configure Nginx with SSL
docker-compose -f docker-compose.yml --profile production up -d
```

### **Network Security**
```bash
# Configure security groups (AWS)
aws ec2 create-security-group \
  --group-name viworks-admin-sg \
  --description "Security group for ViWorkS Admin Panel"

# Configure firewall rules (GCP)
gcloud compute firewall-rules create viworks-admin \
  --allow tcp:80,tcp:443 \
  --source-ranges 0.0.0.0/0
```

### **Secrets Management**
```bash
# AWS Secrets Manager
aws secretsmanager create-secret \
  --name viworks-admin-secrets \
  --secret-string '{"JWT_SECRET":"your-secret","DATABASE_URL":"postgresql://..."}'

# Google Secret Manager
echo -n "your-secret" | gcloud secrets create jwt-secret --data-file=-

# Azure Key Vault
az keyvault secret set --vault-name viworks-admin-vault --name jwt-secret --value "your-secret"
```

---

## 📊 **MONITORING & LOGGING**

### **Application Monitoring**
```bash
# Health check endpoints
curl http://localhost:8080/health
curl http://localhost:3000

# Log aggregation
docker-compose logs -f backend
docker-compose logs -f frontend
```

### **Cloud Platform Monitoring**

#### **AWS CloudWatch**
```bash
# Enable CloudWatch logging
aws logs create-log-group --log-group-name /ecs/viworks-admin-backend
aws logs create-log-group --log-group-name /ecs/viworks-admin-frontend
```

#### **Google Cloud Monitoring**
```bash
# Enable Cloud Monitoring
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com
```

#### **Azure Monitor**
```bash
# Enable Azure Monitor
az monitor diagnostic-settings create \
  --resource-group viworks-admin-rg \
  --resource-type Microsoft.ContainerInstance/containerGroups \
  --name viworks-admin-monitoring
```

---

## 🔄 **CI/CD PIPELINE**

### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloud

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build and push images
      run: |
        docker build -t viworks-admin-backend:latest ./backend
        docker build -t viworks-admin-frontend:latest ./frontend
        # Push to registry
    
    - name: Deploy to cloud
      run: |
        ./deploy-cloud.sh aws  # or gcp, azure, digitalocean
```

### **Automated Deployment**
```bash
# Deploy on every push to main branch
git push origin main

# Manual deployment
./deploy-cloud.sh aws
./deploy-cloud.sh gcp
./deploy-cloud.sh azure
./deploy-cloud.sh digitalocean
```

---

## 🚀 **QUICK DEPLOYMENT COMMANDS**

### **Local Development**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### **Cloud Deployment**
```bash
# Build images
./deploy-cloud.sh build

# Deploy to specific platform
./deploy-cloud.sh aws
./deploy-cloud.sh gcp
./deploy-cloud.sh azure
./deploy-cloud.sh digitalocean

# Deploy locally
./deploy-cloud.sh local
```

### **Database Management**
```bash
# Access PostgreSQL
docker-compose exec postgres psql -U admin -d viworks_admin

# Access Redis
docker-compose exec redis redis-cli

# Access pgAdmin
# Open http://localhost:5050 in browser
```

---

## 📈 **SCALING & PERFORMANCE**

### **Horizontal Scaling**
```bash
# AWS ECS
aws ecs update-service --cluster viworks-cluster --service backend --desired-count 3

# Google Cloud Run
gcloud run services update viworks-admin-backend --max-instances 10

# Azure Container Instances
az container create --name backend-2 --image ... # Create additional instances

# DigitalOcean App Platform
# Update instance_count in app specification
```

### **Load Balancing**
```bash
# AWS Application Load Balancer
aws elbv2 create-load-balancer --name viworks-alb --subnets subnet-123 subnet-456

# Google Cloud Load Balancer
gcloud compute url-maps create viworks-lb --default-service backend-service

# Azure Application Gateway
az network application-gateway create --name viworks-agw --resource-group viworks-admin-rg
```

---

## 🎯 **DEPLOYMENT CHECKLIST**

### **Pre-Deployment**
- [ ] Environment variables configured
- [ ] SSL certificates generated
- [ ] Database backup strategy in place
- [ ] Monitoring and logging configured
- [ ] Security groups/firewall rules set up

### **Deployment**
- [ ] Images built and pushed to registry
- [ ] Services deployed to cloud platform
- [ ] Environment variables set in cloud platform
- [ ] Health checks passing
- [ ] SSL certificates installed

### **Post-Deployment**
- [ ] Application accessible via HTTPS
- [ ] Database connections working
- [ ] Real-time features functioning
- [ ] Monitoring alerts configured
- [ ] Backup jobs scheduled

---

## 🆘 **TROUBLESHOOTING**

### **Common Issues**

#### **Container Won't Start**
```bash
# Check container logs
docker-compose logs backend
docker-compose logs frontend

# Check resource usage
docker stats

# Restart containers
docker-compose restart backend
```

#### **Database Connection Issues**
```bash
# Test database connection
docker-compose exec backend npm run db:test

# Check database logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

#### **Network Issues**
```bash
# Check network connectivity
docker-compose exec backend ping postgres
docker-compose exec frontend ping backend

# Check port mappings
docker-compose ps
```

---

## 📚 **ADDITIONAL RESOURCES**

- [Docker Documentation](https://docs.docker.com/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Azure Container Instances Documentation](https://docs.microsoft.com/en-us/azure/container-instances/)
- [DigitalOcean App Platform Documentation](https://docs.digitalocean.com/products/app-platform/)

---

**The ViWorkS Admin Panel is now fully containerized and ready for deployment to any cloud platform that supports Docker containers!**
