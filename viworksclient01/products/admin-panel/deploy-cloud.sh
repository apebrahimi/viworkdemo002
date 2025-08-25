#!/bin/bash

# ViWorkS Admin Panel - Cloud Deployment Script
# Supports: AWS ECS, Google Cloud Run, Azure Container Instances, DigitalOcean App Platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="viworks-admin-panel"
REGION="us-east-1"
DOMAIN="your-domain.com"

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
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_status "Docker Compose found: $(docker-compose --version)"
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from .env.example..."
        cp .env.example .env
        print_warning "Please edit .env file with your configuration before deploying."
    fi
}

# Function to build and tag images
build_images() {
    print_header "Building Docker Images"
    
    # Build backend image
    print_status "Building backend image..."
    docker build -t viworks-admin-backend:latest ./backend
    
    # Build frontend image
    print_status "Building frontend image..."
    docker build -t viworks-admin-frontend:latest ./frontend
    
    print_status "All images built successfully!"
}

# Function to deploy to AWS ECS
deploy_aws_ecs() {
    print_header "Deploying to AWS ECS"
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install AWS CLI first."
        exit 1
    fi
    
    # Check if logged in to AWS
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "Not logged in to AWS. Please run 'aws configure' first."
        exit 1
    fi
    
    # Create ECR repositories
    print_status "Creating ECR repositories..."
    aws ecr create-repository --repository-name viworks-admin-backend --region $REGION || true
    aws ecr create-repository --repository-name viworks-admin-frontend --region $REGION || true
    
    # Get ECR login token
    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com
    
    # Tag and push images
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    ECR_BASE="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
    
    docker tag viworks-admin-backend:latest $ECR_BASE/viworks-admin-backend:latest
    docker tag viworks-admin-frontend:latest $ECR_BASE/viworks-admin-frontend:latest
    
    docker push $ECR_BASE/viworks-admin-backend:latest
    docker push $ECR_BASE/viworks-admin-frontend:latest
    
    # Create ECS cluster
    print_status "Creating ECS cluster..."
    aws ecs create-cluster --cluster-name viworks-admin-cluster --region $REGION || true
    
    # Create task definitions
    print_status "Creating task definitions..."
    aws ecs register-task-definition --cli-input-json file://aws/task-definition-backend.json --region $REGION
    aws ecs register-task-definition --cli-input-json file://aws/task-definition-frontend.json --region $REGION
    
    # Create services
    print_status "Creating ECS services..."
    aws ecs create-service --cli-input-json file://aws/service-backend.json --region $REGION || true
    aws ecs create-service --cli-input-json file://aws/service-frontend.json --region $REGION || true
    
    print_status "AWS ECS deployment completed!"
    print_status "Check your ECS console for service status."
}

# Function to deploy to Google Cloud Run
deploy_gcp_cloudrun() {
    print_header "Deploying to Google Cloud Run"
    
    # Check gcloud CLI
    if ! command -v gcloud &> /dev/null; then
        print_error "Google Cloud CLI is not installed. Please install gcloud CLI first."
        exit 1
    fi
    
    # Check if logged in to GCP
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        print_error "Not logged in to Google Cloud. Please run 'gcloud auth login' first."
        exit 1
    fi
    
    # Set project
    PROJECT_ID=$(gcloud config get-value project)
    print_status "Using GCP project: $PROJECT_ID"
    
    # Enable required APIs
    print_status "Enabling required APIs..."
    gcloud services enable run.googleapis.com
    gcloud services enable containerregistry.googleapis.com
    
    # Configure Docker for GCR
    gcloud auth configure-docker
    
    # Tag and push images
    docker tag viworks-admin-backend:latest gcr.io/$PROJECT_ID/viworks-admin-backend:latest
    docker tag viworks-admin-frontend:latest gcr.io/$PROJECT_ID/viworks-admin-frontend:latest
    
    docker push gcr.io/$PROJECT_ID/viworks-admin-backend:latest
    docker push gcr.io/$PROJECT_ID/viworks-admin-frontend:latest
    
    # Deploy to Cloud Run
    print_status "Deploying backend to Cloud Run..."
    gcloud run deploy viworks-admin-backend \
        --image gcr.io/$PROJECT_ID/viworks-admin-backend:latest \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --port 8080 \
        --set-env-vars NODE_ENV=production
    
    print_status "Deploying frontend to Cloud Run..."
    gcloud run deploy viworks-admin-frontend \
        --image gcr.io/$PROJECT_ID/viworks-admin-frontend:latest \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --port 3000 \
        --set-env-vars NODE_ENV=production
    
    print_status "Google Cloud Run deployment completed!"
}

# Function to deploy to DigitalOcean App Platform
deploy_digitalocean() {
    print_header "Deploying to DigitalOcean App Platform"
    
    # Check doctl CLI
    if ! command -v doctl &> /dev/null; then
        print_error "DigitalOcean CLI (doctl) is not installed. Please install doctl first."
        exit 1
    fi
    
    # Check if logged in to DigitalOcean
    if ! doctl account get &> /dev/null; then
        print_error "Not logged in to DigitalOcean. Please run 'doctl auth init' first."
        exit 1
    fi
    
    # Create app specification
    print_status "Creating app specification..."
    cat > do-app.yaml << EOF
name: viworks-admin-panel
region: $REGION
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
    value: \${DATABASE_URL}
  - key: JWT_SECRET
    value: \${JWT_SECRET}
  - key: REDIS_URL
    value: \${REDIS_URL}

- name: frontend
  source_dir: /frontend
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
  - key: NEXT_PUBLIC_API_URL
    value: \${NEXT_PUBLIC_API_URL}

databases:
- name: postgres
  engine: PG
  version: "15"
  size: db-s-1vcpu-1gb

- name: redis
  engine: REDIS
  version: "7"
  size: db-s-1vcpu-1gb
EOF
    
    # Deploy app
    print_status "Deploying to DigitalOcean App Platform..."
    doctl apps create --spec do-app.yaml
    
    print_status "DigitalOcean App Platform deployment completed!"
}

# Function to deploy to Azure Container Instances
deploy_azure() {
    print_header "Deploying to Azure Container Instances"
    
    # Check Azure CLI
    if ! command -v az &> /dev/null; then
        print_error "Azure CLI is not installed. Please install Azure CLI first."
        exit 1
    fi
    
    # Check if logged in to Azure
    if ! az account show &> /dev/null; then
        print_error "Not logged in to Azure. Please run 'az login' first."
        exit 1
    fi
    
    # Set resource group
    RESOURCE_GROUP="viworks-admin-rg"
    print_status "Creating resource group..."
    az group create --name $RESOURCE_GROUP --location $REGION || true
    
    # Create container registry
    REGISTRY_NAME="viworksadminregistry"
    print_status "Creating container registry..."
    az acr create --resource-group $RESOURCE_GROUP --name $REGISTRY_NAME --sku Basic || true
    
    # Login to registry
    az acr login --name $REGISTRY_NAME
    
    # Tag and push images
    docker tag viworks-admin-backend:latest $REGISTRY_NAME.azurecr.io/viworks-admin-backend:latest
    docker tag viworks-admin-frontend:latest $REGISTRY_NAME.azurecr.io/viworks-admin-frontend:latest
    
    docker push $REGISTRY_NAME.azurecr.io/viworks-admin-backend:latest
    docker push $REGISTRY_NAME.azurecr.io/viworks-admin-frontend:latest
    
    # Deploy containers
    print_status "Deploying backend container..."
    az container create \
        --resource-group $RESOURCE_GROUP \
        --name viworks-admin-backend \
        --image $REGISTRY_NAME.azurecr.io/viworks-admin-backend:latest \
        --dns-name-label viworks-admin-backend \
        --ports 8080 \
        --environment-variables NODE_ENV=production
    
    print_status "Deploying frontend container..."
    az container create \
        --resource-group $RESOURCE_GROUP \
        --name viworks-admin-frontend \
        --image $REGISTRY_NAME.azurecr.io/viworks-admin-frontend:latest \
        --dns-name-label viworks-admin-frontend \
        --ports 3000 \
        --environment-variables NODE_ENV=production
    
    print_status "Azure Container Instances deployment completed!"
}

# Function to deploy locally with Docker Compose
deploy_local() {
    print_header "Deploying Locally with Docker Compose"
    
    print_status "Starting services..."
    docker-compose up -d
    
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check service health
    print_status "Checking service health..."
    if curl -f http://localhost:8080/health &> /dev/null; then
        print_status "Backend is healthy!"
    else
        print_warning "Backend health check failed"
    fi
    
    if curl -f http://localhost:3000 &> /dev/null; then
        print_status "Frontend is healthy!"
    else
        print_warning "Frontend health check failed"
    fi
    
    print_status "Local deployment completed!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend: http://localhost:8080"
    print_status "pgAdmin: http://localhost:5050"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  local      Deploy locally with Docker Compose"
    echo "  aws        Deploy to AWS ECS"
    echo "  gcp        Deploy to Google Cloud Run"
    echo "  azure      Deploy to Azure Container Instances"
    echo "  digitalocean Deploy to DigitalOcean App Platform"
    echo "  build      Build Docker images only"
    echo "  help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 local"
    echo "  $0 aws"
    echo "  $0 gcp"
}

# Main script
main() {
    case "${1:-help}" in
        "local")
            check_prerequisites
            build_images
            deploy_local
            ;;
        "aws")
            check_prerequisites
            build_images
            deploy_aws_ecs
            ;;
        "gcp")
            check_prerequisites
            build_images
            deploy_gcp_cloudrun
            ;;
        "azure")
            check_prerequisites
            build_images
            deploy_azure
            ;;
        "digitalocean")
            check_prerequisites
            build_images
            deploy_digitalocean
            ;;
        "build")
            check_prerequisites
            build_images
            ;;
        "help"|*)
            show_usage
            ;;
    esac
}

# Run main function
main "$@"
