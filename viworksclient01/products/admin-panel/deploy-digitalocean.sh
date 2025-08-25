#!/bin/bash

# DigitalOcean ViWorkS Admin Panel Deployment Script

set -e

echo "🚀 Deploying ViWorkS Admin Panel to DigitalOcean"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    print_error "doctl is not installed. Please install it first:"
    echo "https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Checking DigitalOcean authentication..."
if ! doctl account get &> /dev/null; then
    print_error "Not authenticated with DigitalOcean. Please run:"
    echo "doctl auth init"
    exit 1
fi

print_success "DigitalOcean authentication verified"

# Build and push images to DigitalOcean Container Registry
print_status "Building and pushing images to DigitalOcean Container Registry..."

# Get registry name
REGISTRY_NAME=$(doctl registry list --format Name --no-header | head -1)
if [ -z "$REGISTRY_NAME" ]; then
    print_error "No DigitalOcean Container Registry found. Please create one first."
    exit 1
fi

print_status "Using registry: $REGISTRY_NAME"

# Build and tag images
print_status "Building backend image..."
docker build -t viworks-backend:v1 ./viworks-admin-panel/backend/

print_status "Building frontend image..."
docker build -t viworks-frontend:v1 ./viworks-admin-panel/frontend/

# Tag for DigitalOcean registry
docker tag viworks-backend:v1 registry.digitalocean.com/$REGISTRY_NAME/viworks-backend:v1
docker tag viworks-frontend:v1 registry.digitalocean.com/$REGISTRY_NAME/viworks-frontend:v1

# Push images
print_status "Pushing images to registry..."
docker push registry.digitalocean.com/$REGISTRY_NAME/viworks-backend:v1
docker push registry.digitalocean.com/$REGISTRY_NAME/viworks-frontend:v1

print_success "Images pushed successfully"

# Create App Platform app
print_status "Creating DigitalOcean App Platform application..."

# Create app spec file
cat > app.yaml << EOF
name: viworks-admin-panel
region: nyc
services:
- name: viworks-backend
  image:
    registry_type: DOCR
    registry: $REGISTRY_NAME
    repository: viworks-backend
    tag: v1
  run_command: ./viworks-admin-backend
  environment_slug: rust
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: DATABASE_URL
    value: \${viworks-postgres.DATABASE_URL}
  - key: REDIS_URL
    value: \${viworks-redis.REDIS_URL}
  - key: JWT_SECRET
    value: your-super-secret-jwt-key-change-in-production
  - key: NODE_ENV
    value: production
  - key: LOG_LEVEL
    value: info
  - key: BCRYPT_ROUNDS
    value: "12"
  - key: RATE_LIMIT_WINDOW
    value: "900000"
  - key: RATE_LIMIT_MAX
    value: "100"
  - key: CORS_ORIGIN
    value: https://viworks-backend-\${APP_ID}.ondigitalocean.app
  - key: ADMIN_PANEL_URL
    value: https://viworks-backend-\${APP_ID}.ondigitalocean.app

- name: viworks-frontend
  image:
    registry_type: DOCR
    registry: $REGISTRY_NAME
    repository: viworks-frontend
    tag: v1
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: NEXT_PUBLIC_API_URL
    value: https://viworks-backend-\${APP_ID}.ondigitalocean.app
  - key: NEXT_PUBLIC_WS_URL
    value: wss://viworks-backend-\${APP_ID}.ondigitalocean.app

databases:
- name: viworks-postgres
  engine: PG
  version: "15"
  size: db-s-1vcpu-1gb
  db_name: viworks_admin
  db_user: admin

- name: viworks-redis
  engine: REDIS
  version: "7"
  size: db-s-1vcpu-1gb
EOF

# Deploy the app
print_status "Deploying application..."
doctl apps create --spec app.yaml

print_success "Deployment initiated! Check your DigitalOcean dashboard for status."

echo ""
print_status "Next steps:"
echo "1. Go to DigitalOcean App Platform dashboard"
echo "2. Monitor the deployment progress"
echo "3. Get your application URLs from the dashboard"
echo "4. Update environment variables with the actual URLs"
echo "5. Test your application"

print_success "DigitalOcean deployment script completed!"
