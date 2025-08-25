#!/bin/bash

# ViWorkS Admin Panel - Arvan Cloud Deployment Script
# Supports: Arvan Cloud Container Service (Kubernetes)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="viworks-admin-panel"
REGISTRY_URL="registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir"
REGISTRY_USERNAME="abpourebrahimi"
REGISTRY_PASSWORD="nanbeb-nuRkys-8wyqxa"
NAMESPACE="viworks"
IMAGE_TAG="v1"

# Function to print colored output
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
    
    # Check if we're in the right directory
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found. Please run this script from the admin-panel directory."
        exit 1
    fi
}

# Function to build and tag images
build_images() {
    print_header "Building Docker Images"
    
    # Build backend image
    print_status "Building backend image..."
    docker build -t viworks-admin-backend:latest ./viworks-admin-panel/backend
    
    # Build frontend image
    print_status "Building frontend image..."
    docker build -t viworks-admin-frontend:latest ./viworks-admin-panel/frontend
    
    # Tag images for Arvan Cloud registry
    print_status "Tagging images for Arvan Cloud registry..."
    docker tag viworks-admin-backend:latest $REGISTRY_URL/viworks-backend:$IMAGE_TAG
    docker tag viworks-admin-frontend:latest $REGISTRY_URL/viworks-frontend:$IMAGE_TAG
    
    print_status "All images built and tagged successfully!"
}

# Function to push images to Arvan Cloud registry
push_images() {
    print_header "Pushing Images to Arvan Cloud Registry"
    
    # Login to Arvan Cloud registry
    print_status "Logging into Arvan Cloud registry..."
    echo $REGISTRY_PASSWORD | docker login $REGISTRY_URL -u $REGISTRY_USERNAME --password-stdin
    
    if [ $? -eq 0 ]; then
        print_status "Login successful!"
        
        # Push backend image
        print_status "Pushing backend image..."
        docker push $REGISTRY_URL/viworks-backend:$IMAGE_TAG
        
        if [ $? -eq 0 ]; then
            print_status "Backend image pushed successfully!"
        else
            print_error "Failed to push backend image"
            exit 1
        fi
        
        # Push frontend image
        print_status "Pushing frontend image..."
        docker push $REGISTRY_URL/viworks-frontend:$IMAGE_TAG
        
        if [ $? -eq 0 ]; then
            print_status "Frontend image pushed successfully!"
        else
            print_error "Failed to push frontend image"
            exit 1
        fi
        
        print_status "All images pushed successfully to Arvan Cloud!"
    else
        print_error "Failed to login to Arvan Cloud registry"
        exit 1
    fi
}

# Function to create Kubernetes manifests
create_manifests() {
    print_header "Creating Kubernetes Manifests"
    
    # Create manifests directory
    mkdir -p k8s-manifests
    
    # Create namespace
    cat > k8s-manifests/namespace.yaml << EOF
apiVersion: v1
kind: Namespace
metadata:
  name: $NAMESPACE
  labels:
    name: $NAMESPACE
EOF
    
    # Create ConfigMap
    cat > k8s-manifests/configmap.yaml << EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: viworks-admin-config
  namespace: $NAMESPACE
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
EOF
    
    # Create Secret (you'll need to update these values)
    cat > k8s-manifests/secret.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: viworks-admin-secret
  namespace: $NAMESPACE
type: Opaque
data:
  JWT_SECRET: $(echo -n "your-super-secret-jwt-key-change-in-production" | base64)
  POSTGRES_PASSWORD: $(echo -n "secure_password_production" | base64)
  DATABASE_URL: $(echo -n "postgresql://admin:secure_password_production@viworks-postgres-service:5432/viworks_admin" | base64)
  REDIS_URL: $(echo -n "redis://viworks-redis-service:6379" | base64)
EOF
    
    # Create PostgreSQL deployment
    cat > k8s-manifests/postgres-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: viworks-postgres
  namespace: $NAMESPACE
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
  namespace: $NAMESPACE
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
  namespace: $NAMESPACE
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
EOF
    
    # Create Redis deployment
    cat > k8s-manifests/redis-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: viworks-redis
  namespace: $NAMESPACE
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
  namespace: $NAMESPACE
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
  namespace: $NAMESPACE
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
EOF
    
    # Create Backend deployment
    cat > k8s-manifests/backend-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: viworks-backend
  namespace: $NAMESPACE
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
        image: $REGISTRY_URL/viworks-backend:$IMAGE_TAG
        ports:
        - containerPort: 8081
        envFrom:
        - configMapRef:
            name: viworks-admin-config
        - secretRef:
            name: viworks-admin-secret
        resources:
          requests:
            memory: "1Gi"
            cpu: "1000m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
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
  namespace: $NAMESPACE
spec:
  selector:
    app: viworks-backend
  ports:
  - port: 8081
    targetPort: 8081
  type: ClusterIP
EOF
    
    # Create Frontend deployment
    cat > k8s-manifests/frontend-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: viworks-frontend
  namespace: $NAMESPACE
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
        image: $REGISTRY_URL/viworks-frontend:$IMAGE_TAG
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: viworks-admin-config
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
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
  namespace: $NAMESPACE
spec:
  selector:
    app: viworks-frontend
  ports:
  - port: 3000
    targetPort: 3000
  type: ClusterIP
EOF
    
    # Create Ingress
    cat > k8s-manifests/ingress.yaml << EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: viworks-admin-ingress
  namespace: $NAMESPACE
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
EOF
    
    print_status "Kubernetes manifests created in k8s-manifests/ directory"
    print_warning "Please update the following in the manifests:"
    print_warning "  - Domain names in ingress.yaml"
    print_warning "  - Secret values in secret.yaml"
    print_warning "  - Environment variables in configmap.yaml"
}

# Function to deploy to Arvan Cloud
deploy_to_arvan() {
    print_header "Deploying to Arvan Cloud"
    
    # Check if kubectl is configured
    if ! kubectl get namespaces &> /dev/null; then
        print_error "kubectl is not configured. Please configure your Arvan Cloud cluster access."
        print_status "You may need to:"
        print_status "  1. Download kubeconfig from Arvan Cloud dashboard"
        print_status "  2. Set KUBECONFIG environment variable"
        print_status "  3. Or place kubeconfig in ~/.kube/config"
        exit 1
    fi
    
    # Apply manifests
    print_status "Applying Kubernetes manifests..."
    kubectl apply -f k8s-manifests/
    
    # Wait for deployment
    print_status "Waiting for deployment to complete..."
    kubectl wait --for=condition=available --timeout=300s deployment/viworks-backend -n $NAMESPACE || true
    kubectl wait --for=condition=available --timeout=300s deployment/viworks-frontend -n $NAMESPACE || true
    
    # Check deployment status
    print_status "Checking deployment status..."
    kubectl get pods -n $NAMESPACE
    kubectl get services -n $NAMESPACE
    kubectl get ingress -n $NAMESPACE
    
    print_status "Deployment completed!"
}

# Function to show deployment summary
show_summary() {
    print_header "Deployment Summary"
    print_status "ViWorkS Admin Panel has been deployed to Arvan Cloud!"
    print_status ""
    print_status "📋 Deployed Images:"
    print_status "  - Backend:  $REGISTRY_URL/viworks-backend:$IMAGE_TAG"
    print_status "  - Frontend: $REGISTRY_URL/viworks-frontend:$IMAGE_TAG"
    print_status ""
    print_status "🌐 Access URLs (after DNS configuration):"
    print_status "  - Frontend: https://your-domain.ir"
    print_status "  - Backend API: https://api.your-domain.ir"
    print_status ""
    print_status "📊 Monitoring Commands:"
    print_status "  - Check pods: kubectl get pods -n $NAMESPACE"
    print_status "  - View logs: kubectl logs -f deployment/viworks-backend -n $NAMESPACE"
    print_status "  - Check services: kubectl get services -n $NAMESPACE"
    print_status ""
    print_status "🔧 Next Steps:"
    print_status "  1. Configure your domain DNS to point to Arvan Cloud"
    print_status "  2. Update domain names in ingress.yaml"
    print_status "  3. Update secret values for production"
    print_status "  4. Set up monitoring and alerting"
    print_status "  5. Configure SSL certificates"
}

# Function to show help
show_help() {
    echo "ViWorkS Admin Panel - Arvan Cloud Deployment Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  build     Build Docker images only"
    echo "  push      Push images to Arvan Cloud registry only"
    echo "  deploy    Deploy to Arvan Cloud only"
    echo "  all       Complete deployment (build, push, deploy)"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build     # Build images only"
    echo "  $0 push      # Push images only"
    echo "  $0 deploy    # Deploy to Arvan Cloud only"
    echo "  $0 all       # Complete deployment"
}

# Main execution
main() {
    case "${1:-all}" in
        "build")
            check_prerequisites
            build_images
            ;;
        "push")
            check_prerequisites
            push_images
            ;;
        "deploy")
            check_prerequisites
            create_manifests
            deploy_to_arvan
            show_summary
            ;;
        "all")
            check_prerequisites
            build_images
            push_images
            create_manifests
            deploy_to_arvan
            show_summary
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
