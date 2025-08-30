#!/bin/bash

# 🚀 ViWorks DigitalOcean Deployment Script
# This script automates the deployment of ViWorks to DigitalOcean

set -e  # Exit on any error

# Configuration
DROPLET_IP="64.227.46.188"
DROPLET_USER="root"
APP_DIR="/opt/viworks"
LOCAL_PROJECT_DIR="."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to create environment file
create_env_file() {
    local env_file="$1"
    local content="$2"
    
    print_status "Creating environment file: $env_file"
    ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "cat > $env_file << 'EOF'
$content
EOF"
    print_success "Environment file created: $env_file"
}

# Function to create nginx configuration
create_nginx_config() {
    print_status "Creating nginx configuration..."
    
    ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "mkdir -p ${APP_DIR}/nginx/ssl"
    
    ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "cat > ${APP_DIR}/nginx/nginx.conf << 'EOF'
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
        server_name ${DROPLET_IP};

        # Main Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Admin Panel
        location /admin {
            proxy_pass http://admin-frontend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Backend API
        location /api {
            proxy_pass http://backend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # pgAdmin
        location /pgadmin {
            proxy_pass http://pgadmin:80;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
}
EOF"
    
    print_success "Nginx configuration created"
}

# Function to create docker-compose file
create_docker_compose() {
    print_status "Creating docker-compose.yml..."
    
    ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "cat > ${APP_DIR}/docker-compose.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: viworks-postgres
    environment:
      POSTGRES_DB: viworks_admin
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_INITDB_ARGS: \"--encoding=UTF-8 --lc-collate=C --lc-ctype=C\"
    ports:
      - \"5432:5432\"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - viworks-network
    healthcheck:
      test: [\"CMD-SHELL\", \"pg_isready -U admin -d viworks_admin\"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: viworks-redis
    ports:
      - \"6379:6379\"
    volumes:
      - redis_data:/data
    networks:
      - viworks-network
    healthcheck:
      test: [\"CMD\", \"redis-cli\", \"ping\"]
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
      - \"8081:8081\"
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
      test: [\"CMD\", \"curl\", \"-f\", \"http://localhost:8081/health\"]
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
      - \"3000:3000\"
    env_file:
      - ./viworksclient01/products/admin-panel/.env
    depends_on:
      - backend
    networks:
      - viworks-network
    restart: unless-stopped
    healthcheck:
      test: [\"CMD\", \"curl\", \"-f\", \"http://localhost:3000\"]
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
      - \"3001:3000\"
    env_file:
      - ./viworks-frontend/.env
    depends_on:
      - backend
    networks:
      - viworks-network
    restart: unless-stopped
    healthcheck:
      test: [\"CMD\", \"curl\", \"-f\", \"http://localhost:3000\"]
      interval: 30s
      timeout: 10s
      retries: 3

  # pgAdmin (Database Management)
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: viworks-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: \${PGADMIN_EMAIL}
      PGADMIN_DEFAULT_PASSWORD: \${PGADMIN_PASSWORD}
      PGADMIN_CONFIG_SERVER_MODE: 'False'
    ports:
      - \"5050:80\"
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
      - \"80:80\"
      - \"443:443\"
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
EOF"
    
    print_success "Docker Compose file created"
}

# Main deployment function
deploy() {
    print_status "Starting ViWorks deployment to DigitalOcean..."
    
    # Check if ssh is available
    if ! command_exists ssh; then
        print_error "SSH is not installed. Please install it first."
        exit 1
    fi
    
    # Check if scp is available
    if ! command_exists scp; then
        print_error "SCP is not installed. Please install it first."
        exit 1
    fi
    
    # Test SSH connection
    print_status "Testing SSH connection to ${DROPLET_IP}..."
    if ! ssh -o ConnectTimeout=10 -o BatchMode=no -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "echo 'SSH connection test successful'" 2>/dev/null; then
        print_error "Cannot connect to ${DROPLET_IP}. Please check your SSH configuration."
        print_error "Make sure your SSH key is properly configured."
        exit 1
    fi
    print_success "SSH connection successful"
    
    # Update system
    print_status "Updating system packages..."
    ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "apt update && apt upgrade -y"
    print_success "System updated"
    
    # Install additional tools
    print_status "Installing additional tools..."
    ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "apt install -y git curl wget nano htop"
    print_success "Tools installed"
    
    # Create application directory
    print_status "Creating application directory..."
    ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "mkdir -p ${APP_DIR}"
    print_success "Application directory created"
    
    # Upload project files
    print_status "Uploading project files..."
    scp -i ~/.ssh/id_ed25519 -r ${LOCAL_PROJECT_DIR}/* ${DROPLET_USER}@${DROPLET_IP}:${APP_DIR}/
    print_success "Project files uploaded"
    
    # Configure firewall
    print_status "Configuring firewall..."
    ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "
        ufw allow 80
        ufw allow 443
        ufw allow 3000
        ufw allow 8081
        ufw allow 5432
        ufw allow 6379
        ufw allow 5050
        ufw reload
    "
    print_success "Firewall configured"
    
    # Create environment files
    print_status "Creating environment files..."
    
    # Admin panel environment
    ADMIN_ENV_CONTENT="# Database Configuration
POSTGRES_PASSWORD=your_secure_postgres_password_here
DATABASE_URL=postgresql://admin:your_secure_postgres_password_here@postgres:5432/viworks_admin

# Redis Configuration
REDIS_URL=redis://redis:6379

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here_change_this_in_production

# Application URLs
ADMIN_PANEL_URL=http://${DROPLET_IP}:3000
CORS_ORIGIN=http://${DROPLET_IP}:3000

# Logging
LOG_LEVEL=info

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Node Environment
NODE_ENV=production

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://${DROPLET_IP}:8081
NEXT_PUBLIC_WS_URL=ws://${DROPLET_IP}:8081

# pgAdmin Configuration
PGADMIN_EMAIL=admin@viworks.com
PGADMIN_PASSWORD=your_secure_pgadmin_password_here"
    
    create_env_file "${APP_DIR}/viworksclient01/products/admin-panel/.env" "$ADMIN_ENV_CONTENT"
    
    # Main frontend environment
    FRONTEND_ENV_CONTENT="NODE_ENV=production
NEXT_PUBLIC_API_URL=http://${DROPLET_IP}:8081"
    
    create_env_file "${APP_DIR}/viworks-frontend/.env" "$FRONTEND_ENV_CONTENT"
    
    # Create nginx configuration
    create_nginx_config
    
    # Create docker-compose file
    create_docker_compose
    
    # Build and start services
    print_status "Building and starting services..."
    ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "cd ${APP_DIR} && docker-compose up -d --build"
    print_success "Services started"
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check service status
    print_status "Checking service status..."
    ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "cd ${APP_DIR} && docker-compose ps"
    
    # Test endpoints
    print_status "Testing endpoints..."
    ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "
        echo 'Testing main frontend...'
        curl -f http://${DROPLET_IP} || echo 'Main frontend not ready yet'
        
        echo 'Testing admin panel...'
        curl -f http://${DROPLET_IP}/admin || echo 'Admin panel not ready yet'
        
        echo 'Testing backend health...'
        curl -f http://${DROPLET_IP}/api/health || echo 'Backend not ready yet'
        
        echo 'Testing pgAdmin...'
        curl -f http://${DROPLET_IP}/pgadmin || echo 'pgAdmin not ready yet'
    "
    
    print_success "Deployment completed!"
    echo ""
    echo "🎉 Your ViWorks application is now deployed on DigitalOcean!"
    echo ""
    echo "Access your application at:"
    echo "  • Main Frontend: http://${DROPLET_IP}"
    echo "  • Admin Panel: http://${DROPLET_IP}/admin"
    echo "  • Backend API: http://${DROPLET_IP}/api"
    echo "  • Database Management: http://${DROPLET_IP}/pgadmin"
    echo ""
    echo "Useful commands:"
    echo "  • View logs: ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} 'cd ${APP_DIR} && docker-compose logs -f'"
    echo "  • Restart services: ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} 'cd ${APP_DIR} && docker-compose restart'"
    echo "  • Stop services: ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} 'cd ${APP_DIR} && docker-compose down'"
    echo ""
    print_warning "Don't forget to change the default passwords in the .env files!"
}

# Function to show usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -i, --ip       Specify droplet IP (default: 188.166.156.31)"
    echo "  -u, --user     Specify SSH user (default: root)"
    echo "  -d, --dir      Specify local project directory (default: current directory)"
    echo ""
    echo "Example:"
    echo "  $0 -i 192.168.1.100 -u ubuntu -d ./my-project"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            exit 0
            ;;
        -i|--ip)
            DROPLET_IP="$2"
            shift 2
            ;;
        -u|--user)
            DROPLET_USER="$2"
            shift 2
            ;;
        -d|--dir)
            LOCAL_PROJECT_DIR="$2"
            shift 2
            ;;
        *)
            print_error "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# Check if we're in the right directory
if [ ! -f "viworks-frontend/Dockerfile" ] || [ ! -f "viworksclient01/products/admin-panel/backend/Dockerfile" ]; then
    print_error "This script must be run from the root of the ViWorks project directory."
    print_error "Make sure you have the following structure:"
    echo "  • viworks-frontend/Dockerfile"
    echo "  • viworksclient01/products/admin-panel/backend/Dockerfile"
    echo "  • viworksclient01/products/admin-panel/frontend/Dockerfile"
    exit 1
fi

# Run deployment
deploy
