# 🚀 ViWorkS Admin Panel - Arvan Cloud Deployment Guide

## 📋 **Overview**

This guide provides step-by-step instructions for deploying the ViWorkS Admin Panel to **Arvan Cloud Container Service**. Arvan Cloud offers a managed Kubernetes service that's perfect for containerized applications like yours.

---

## 🎯 **Why Arvan Cloud?**

### **✅ Advantages**
- **Iran-based Infrastructure**: Lower latency for Iranian users
- **Managed Kubernetes**: No need to manage cluster infrastructure
- **Integrated Registry**: Built-in container registry
- **Persian Support**: Local language support
- **Cost-Effective**: Competitive pricing for the region
- **SSL Certificates**: Free SSL certificates included
- **Load Balancing**: Built-in load balancer
- **Auto-scaling**: Automatic scaling based on demand

### **💰 Cost Estimate**
- **Basic Plan**: ~$20-50/month (2-4 vCPU, 4-8GB RAM)
- **Standard Plan**: ~$50-100/month (4-8 vCPU, 8-16GB RAM)
- **Enterprise Plan**: ~$100+/month (8+ vCPU, 16+ GB RAM)

---

## 🏗️ **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Arvan Cloud Container Service                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   Frontend      │    │   Backend       │    │   Database   │ │
│  │   (Next.js)     │◄──►│   (Rust)        │◄──►│   (PostgreSQL)│ │
│  │   Port: 3000    │    │   Port: 8081    │    │   Port: 5432 │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
│           │                       │                             │
│           │                       │                             │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │   Nginx         │    │   Redis         │                    │
│  │   (Ingress)     │    │   (Cache)       │                    │
│  │   SSL/TLS       │    │   Port: 6379    │                    │
│  └─────────────────┘    └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 **Deployment Steps**

### **Step 1: Prerequisites**

#### **1.1 Install Required Tools**
```bash
# Install Docker (if not already installed)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Arvan Cloud CLI (if available)
# Check Arvan Cloud documentation for CLI tools
```

#### **1.2 Arvan Cloud Account Setup**
1. **Create Account**: Sign up at [Arvan Cloud](https://arvancloud.com)
2. **Create Project**: Create a new project in Arvan Cloud dashboard
3. **Enable Container Service**: Enable the Container Service in your project
4. **Get Credentials**: Note down your registry credentials and cluster access

### **Step 2: Build and Push Images**

#### **2.1 Build Docker Images**
```bash
# Navigate to admin panel directory
cd viworksclient01/products/admin-panel

# Build backend image
docker build -t viworks-admin-backend:latest ./viworks-admin-panel/backend

# Build frontend image
docker build -t viworks-admin-frontend:latest ./viworks-admin-panel/frontend

# Tag images for Arvan Cloud registry
docker tag viworks-admin-backend:latest registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-backend:v1
docker tag viworks-admin-frontend:latest registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-frontend:v1
```

#### **2.2 Push to Arvan Cloud Registry**
```bash
# Login to Arvan Cloud registry
docker login registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir -u abpourebrahimi -p nanbeb-nuRkys-8wyqxa

# Push images
docker push registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-backend:v1
docker push registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-frontend:v1
```

### **Step 3: Create Kubernetes Manifests**

#### **3.1 Create Namespace**
```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: viworks-admin
  labels:
    name: viworks-admin
```

#### **3.2 Create ConfigMap for Environment Variables**
```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: viworks-admin-config
  namespace: viworks-admin
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  BCRYPT_ROUNDS: "12"
  RATE_LIMIT_WINDOW: "900000"
  RATE_LIMIT_MAX: "100"
  CORS_ORIGIN: "https://your-domain.ir"
  ADMIN_PANEL_URL: "https://your-domain.ir"
  NEXT_PUBLIC_API_URL: "https://api.your-domain.ir"
  NEXT_PUBLIC_WS_URL: "wss://api.your-domain.ir"
```

#### **3.3 Create Secret for Sensitive Data**
```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: viworks-admin-secret
  namespace: viworks-admin
type: Opaque
data:
  JWT_SECRET: <base64-encoded-jwt-secret>
  POSTGRES_PASSWORD: <base64-encoded-password>
  DATABASE_URL: <base64-encoded-database-url>
  REDIS_URL: <base64-encoded-redis-url>
```

#### **3.4 Create PostgreSQL Deployment**
```yaml
# postgres-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: viworks-postgres
  namespace: viworks-admin
spec:
  replicas: 1
  selector:
    matchLabels:
      app: viworks-postgres
  template:
    metadata:
      labels:
        app: viworks-postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: "viworks_admin"
        - name: POSTGRES_USER
          value: "admin"
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: viworks-admin-secret
              key: POSTGRES_PASSWORD
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: viworks-postgres-service
  namespace: viworks-admin
spec:
  selector:
    app: viworks-postgres
  ports:
  - port: 5432
    targetPort: 5432
  type: ClusterIP
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: viworks-admin
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

#### **3.5 Create Redis Deployment**
```yaml
# redis-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: viworks-redis
  namespace: viworks-admin
spec:
  replicas: 1
  selector:
    matchLabels:
      app: viworks-redis
  template:
    metadata:
      labels:
        app: viworks-redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: redis-storage
          mountPath: /data
      volumes:
      - name: redis-storage
        persistentVolumeClaim:
          claimName: redis-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: viworks-redis-service
  namespace: viworks-admin
spec:
  selector:
    app: viworks-redis
  ports:
  - port: 6379
    targetPort: 6379
  type: ClusterIP
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-pvc
  namespace: viworks-admin
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```

#### **3.6 Create Backend Deployment**
```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: viworks-backend
  namespace: viworks-admin
spec:
  replicas: 2
  selector:
    matchLabels:
      app: viworks-backend
  template:
    metadata:
      labels:
        app: viworks-backend
    spec:
      containers:
      - name: backend
        image: registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-backend:v1
        ports:
        - containerPort: 8081
        envFrom:
        - configMapRef:
            name: viworks-admin-config
        - secretRef:
            name: viworks-admin-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8081
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8081
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: viworks-backend-service
  namespace: viworks-admin
spec:
  selector:
    app: viworks-backend
  ports:
  - port: 8081
    targetPort: 8081
  type: ClusterIP
```

#### **3.7 Create Frontend Deployment**
```yaml
# frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: viworks-frontend
  namespace: viworks-admin
spec:
  replicas: 2
  selector:
    matchLabels:
      app: viworks-frontend
  template:
    metadata:
      labels:
        app: viworks-frontend
    spec:
      containers:
      - name: frontend
        image: registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-frontend:v1
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: viworks-admin-config
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: viworks-frontend-service
  namespace: viworks-admin
spec:
  selector:
    app: viworks-frontend
  ports:
  - port: 3000
    targetPort: 3000
  type: ClusterIP
```

#### **3.8 Create Ingress for External Access**
```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: viworks-admin-ingress
  namespace: viworks-admin
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - your-domain.ir
    - api.your-domain.ir
    secretName: viworks-admin-tls
  rules:
  - host: your-domain.ir
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: viworks-frontend-service
            port:
              number: 3000
  - host: api.your-domain.ir
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: viworks-backend-service
            port:
              number: 8081
```

### **Step 4: Deploy to Arvan Cloud**

#### **4.1 Apply Kubernetes Manifests**
```bash
# Create namespace
kubectl apply -f namespace.yaml

# Apply configurations
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

# Deploy databases
kubectl apply -f postgres-deployment.yaml
kubectl apply -f redis-deployment.yaml

# Deploy applications
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml

# Deploy ingress
kubectl apply -f ingress.yaml
```

#### **4.2 Verify Deployment**
```bash
# Check all resources
kubectl get all -n viworks-admin

# Check pods status
kubectl get pods -n viworks-admin

# Check services
kubectl get services -n viworks-admin

# Check ingress
kubectl get ingress -n viworks-admin

# View logs
kubectl logs -f deployment/viworks-backend -n viworks-admin
kubectl logs -f deployment/viworks-frontend -n viworks-admin
```

---

## 🔧 **Automated Deployment Script**

### **Create Comprehensive Deployment Script**
```bash
#!/bin/bash

# ViWorkS Admin Panel - Arvan Cloud Deployment Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_NAME="viworks-admin-panel"
REGISTRY_URL="registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir"
REGISTRY_USERNAME="abpourebrahimi"
REGISTRY_PASSWORD="nanbeb-nuRkys-8wyqxa"
NAMESPACE="viworks-admin"

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_status "Docker found: $(docker --version)"
    
    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
    print_status "kubectl found: $(kubectl version --client)"
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from .env.example..."
        cp .env.example .env
        print_warning "Please edit .env file with your configuration before deploying."
    fi
}

# Function to build and push images
build_and_push_images() {
    print_header "Building and Pushing Docker Images"
    
    # Login to Arvan Cloud registry
    print_status "Logging into Arvan Cloud registry..."
    echo $REGISTRY_PASSWORD | docker login $REGISTRY_URL -u $REGISTRY_USERNAME --password-stdin
    
    # Build backend image
    print_status "Building backend image..."
    docker build -t viworks-admin-backend:latest ./viworks-admin-panel/backend
    
    # Build frontend image
    print_status "Building frontend image..."
    docker build -t viworks-admin-frontend:latest ./viworks-admin-panel/frontend
    
    # Tag images
    print_status "Tagging images..."
    docker tag viworks-admin-backend:latest $REGISTRY_URL/viworks-backend:v1
    docker tag viworks-admin-frontend:latest $REGISTRY_URL/viworks-frontend:v1
    
    # Push images
    print_status "Pushing backend image..."
    docker push $REGISTRY_URL/viworks-backend:v1
    
    print_status "Pushing frontend image..."
    docker push $REGISTRY_URL/viworks-frontend:v1
    
    print_status "All images pushed successfully!"
}

# Function to create Kubernetes manifests
create_manifests() {
    print_header "Creating Kubernetes Manifests"
    
    # Create manifests directory
    mkdir -p k8s-manifests
    
    # Generate manifests from templates
    print_status "Generating Kubernetes manifests..."
    
    # Create namespace
    cat > k8s-manifests/namespace.yaml << EOF
apiVersion: v1
kind: Namespace
metadata:
  name: $NAMESPACE
  labels:
    name: $NAMESPACE
EOF
    
    # Create other manifests (configmap, secret, deployments, etc.)
    # ... (include all the YAML content from above)
    
    print_status "Kubernetes manifests created in k8s-manifests/ directory"
}

# Function to deploy to Arvan Cloud
deploy_to_arvan() {
    print_header "Deploying to Arvan Cloud"
    
    # Apply manifests
    print_status "Applying Kubernetes manifests..."
    kubectl apply -f k8s-manifests/
    
    # Wait for deployment
    print_status "Waiting for deployment to complete..."
    kubectl wait --for=condition=available --timeout=300s deployment/viworks-backend -n $NAMESPACE
    kubectl wait --for=condition=available --timeout=300s deployment/viworks-frontend -n $NAMESPACE
    
    # Check deployment status
    print_status "Checking deployment status..."
    kubectl get pods -n $NAMESPACE
    kubectl get services -n $NAMESPACE
    kubectl get ingress -n $NAMESPACE
    
    print_status "Deployment completed successfully!"
}

# Main execution
main() {
    check_prerequisites
    build_and_push_images
    create_manifests
    deploy_to_arvan
    
    print_header "Deployment Summary"
    print_status "ViWorkS Admin Panel has been deployed to Arvan Cloud!"
    print_status "Access URLs:"
    print_status "  - Frontend: https://your-domain.ir"
    print_status "  - Backend API: https://api.your-domain.ir"
    print_status ""
    print_status "Next Steps:"
    print_status "  1. Configure your domain DNS to point to Arvan Cloud"
    print_status "  2. Update SSL certificates if needed"
    print_status "  3. Monitor application logs and performance"
    print_status "  4. Set up monitoring and alerting"
}

# Run main function
main "$@"
```

---

## 🔐 **Security Configuration**

### **SSL/TLS Setup**
Arvan Cloud provides automatic SSL certificate management through Let's Encrypt. The ingress configuration above includes the necessary annotations for automatic SSL certificate generation.

### **Network Security**
```yaml
# network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: viworks-admin-network-policy
  namespace: viworks-admin
spec:
  podSelector:
    matchLabels:
      app: viworks-backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: viworks-admin
    ports:
    - protocol: TCP
      port: 8081
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: viworks-admin
    ports:
    - protocol: TCP
      port: 5432
    - protocol: TCP
      port: 6379
```

---

## 📊 **Monitoring and Scaling**

### **Horizontal Pod Autoscaler**
```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: viworks-backend-hpa
  namespace: viworks-admin
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: viworks-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### **Resource Monitoring**
```bash
# Monitor resource usage
kubectl top pods -n viworks-admin
kubectl top nodes

# Monitor logs
kubectl logs -f deployment/viworks-backend -n viworks-admin
kubectl logs -f deployment/viworks-frontend -n viworks-admin

# Monitor events
kubectl get events -n viworks-admin --sort-by='.lastTimestamp'
```

---

## 🚀 **Quick Deployment Commands**

### **One-Command Deployment**
```bash
# Run the complete deployment script
chmod +x deploy-arvan-cloud.sh
./deploy-arvan-cloud.sh
```

### **Manual Deployment Steps**
```bash
# 1. Build and push images
docker build -t viworks-admin-backend:latest ./backend
docker build -t viworks-admin-frontend:latest ./frontend
docker tag viworks-admin-backend:latest registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-backend:v1
docker tag viworks-admin-frontend:latest registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-frontend:v1
docker push registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-backend:v1
docker push registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-frontend:v1

# 2. Apply Kubernetes manifests
kubectl apply -f k8s-manifests/

# 3. Check deployment status
kubectl get pods -n viworks-admin
```

---

## 🔧 **Troubleshooting**

### **Common Issues and Solutions**

#### **1. Image Pull Errors**
```bash
# Check if images exist in registry
docker pull registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-backend:v1

# Check registry credentials
docker login registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir
```

#### **2. Pod Startup Issues**
```bash
# Check pod status
kubectl describe pod <pod-name> -n viworks-admin

# Check pod logs
kubectl logs <pod-name> -n viworks-admin

# Check events
kubectl get events -n viworks-admin
```

#### **3. Service Connectivity Issues**
```bash
# Check service endpoints
kubectl get endpoints -n viworks-admin

# Test service connectivity
kubectl run test-pod --image=busybox -n viworks-admin --rm -it --restart=Never -- wget -O- http://viworks-backend-service:8081/health
```

#### **4. Ingress Issues**
```bash
# Check ingress status
kubectl describe ingress viworks-admin-ingress -n viworks-admin

# Check ingress controller logs
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller
```

---

## 📚 **Additional Resources**

### **Arvan Cloud Documentation**
- [Arvan Cloud Container Service](https://arvancloud.com/container-service)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Arvan Cloud CLI Tools](https://arvancloud.com/docs)

### **Useful Commands**
```bash
# Scale deployments
kubectl scale deployment viworks-backend --replicas=3 -n viworks-admin

# Update image
kubectl set image deployment/viworks-backend backend=registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-backend:v2 -n viworks-admin

# Rollback deployment
kubectl rollout undo deployment/viworks-backend -n viworks-admin

# Port forward for debugging
kubectl port-forward service/viworks-backend-service 8081:8081 -n viworks-admin
```

---

**🎉 Your ViWorkS Admin Panel is now ready for deployment on Arvan Cloud! The containerized architecture provides scalability, reliability, and easy management through Kubernetes.**
