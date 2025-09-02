#!/bin/bash

# ViWorkS Admin Authentication Separation Deployment Script
# This script handles the phased deployment of admin/user auth separation

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCKER_COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env.production"
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}     ViWorkS Admin Authentication Separation Deployment${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command_exists docker; then
    echo -e "${RED}Docker is not installed${NC}"
    exit 1
fi

if ! command_exists docker-compose; then
    echo -e "${RED}Docker Compose is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites met${NC}"

# Create backup directory
echo -e "${YELLOW}Creating backup directory...${NC}"
mkdir -p "$BACKUP_DIR"

# Backup current configuration
echo -e "${YELLOW}Backing up current configuration...${NC}"
if [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" "$BACKUP_DIR/.env.production.backup"
    echo -e "${GREEN}✓ Environment file backed up${NC}"
fi

if [ -f "nginx/nginx.conf" ]; then
    cp "nginx/nginx.conf" "$BACKUP_DIR/nginx.conf.backup"
    echo -e "${GREEN}✓ Nginx configuration backed up${NC}"
fi

# Phase selection
echo ""
echo -e "${BLUE}Select deployment phase:${NC}"
echo "1) Phase A: Database Migration (additive changes only)"
echo "2) Phase B: Deploy Backend with Feature Flag OFF"
echo "3) Phase C: Enable Admin Realm (Feature Flag ON)"
echo "4) Phase D: Full Production Deployment"
echo "5) Rollback to Previous Configuration"
echo ""
read -p "Enter phase number (1-5): " PHASE

case $PHASE in
    1)
        echo -e "${YELLOW}═══ Phase A: Database Migration ═══${NC}"
        echo "This will add admin-specific tables without affecting existing data."
        read -p "Continue? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Running database migrations...${NC}"
            
            # Connect to database and run migration
            docker-compose exec -T backend sh -c "
                cd /app && \
                sqlx migrate run --source ./migrations
            " || {
                echo -e "${YELLOW}Creating migration runner container...${NC}"
                docker run --rm \
                    --network viworks_network \
                    -e DATABASE_URL="postgresql://postgres:password@postgres:5432/viworks_admin" \
                    -v "$(pwd)/backend/migrations:/migrations" \
                    postgres:15 \
                    psql postgresql://postgres:password@postgres:5432/viworks_admin -f /migrations/002_admin_auth_separation.sql
            }
            
            echo -e "${GREEN}✓ Database migrations completed${NC}"
            echo -e "${YELLOW}Next step: Run Phase B to deploy backend with feature flag OFF${NC}"
        fi
        ;;
        
    2)
        echo -e "${YELLOW}═══ Phase B: Deploy Backend with Feature Flag OFF ═══${NC}"
        echo "This will deploy the new backend code but keep using legacy auth."
        read -p "Continue? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Update environment file
            echo -e "${YELLOW}Updating environment configuration...${NC}"
            
            # Check if ADMIN_REALM_ENFORCED exists in env file
            if ! grep -q "ADMIN_REALM_ENFORCED" "$ENV_FILE" 2>/dev/null; then
                echo "" >> "$ENV_FILE"
                echo "# Admin Authentication Separation" >> "$ENV_FILE"
                echo "ADMIN_REALM_ENFORCED=false" >> "$ENV_FILE"
                echo "ADMIN_JWT_SECRET=$(openssl rand -base64 32)" >> "$ENV_FILE"
                echo "ADMIN_JWT_EXPIRATION=900" >> "$ENV_FILE"
                echo "ADMIN_SESSION_TIMEOUT=900" >> "$ENV_FILE"
                echo "ADMIN_IP_ALLOWLIST=10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,127.0.0.1/32" >> "$ENV_FILE"
            else
                # Ensure it's set to false
                sed -i 's/ADMIN_REALM_ENFORCED=.*/ADMIN_REALM_ENFORCED=false/' "$ENV_FILE"
            fi
            
            echo -e "${YELLOW}Building new backend image...${NC}"
            docker-compose build backend
            
            echo -e "${YELLOW}Deploying backend with rolling update...${NC}"
            docker-compose up -d --no-deps backend
            
            echo -e "${YELLOW}Waiting for backend to be healthy...${NC}"
            sleep 10
            
            # Check health
            if docker-compose exec backend curl -f http://localhost:8081/health > /dev/null 2>&1; then
                echo -e "${GREEN}✓ Backend deployed successfully with feature flag OFF${NC}"
                echo -e "${GREEN}✓ Legacy authentication is still active${NC}"
                echo -e "${YELLOW}Next step: Test thoroughly, then run Phase C to enable admin realm${NC}"
            else
                echo -e "${RED}Backend health check failed${NC}"
                echo -e "${YELLOW}Check logs: docker-compose logs backend${NC}"
            fi
        fi
        ;;
        
    3)
        echo -e "${YELLOW}═══ Phase C: Enable Admin Realm ═══${NC}"
        echo "This will enable the separated admin authentication."
        echo -e "${RED}WARNING: Admin panel will be restricted to allowed IPs only!${NC}"
        read -p "Have you configured your IP in ADMIN_IP_ALLOWLIST? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Get current IP
            CURRENT_IP=$(curl -s ifconfig.me)
            echo -e "${YELLOW}Your current public IP: ${CURRENT_IP}${NC}"
            read -p "Add this IP to allowlist? (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                # Update IP allowlist in env file
                sed -i "s/ADMIN_IP_ALLOWLIST=\(.*\)/ADMIN_IP_ALLOWLIST=\1,${CURRENT_IP}\/32/" "$ENV_FILE"
            fi
            
            # Enable feature flag
            echo -e "${YELLOW}Enabling admin realm feature flag...${NC}"
            sed -i 's/ADMIN_REALM_ENFORCED=false/ADMIN_REALM_ENFORCED=true/' "$ENV_FILE"
            
            # Update nginx configuration
            echo -e "${YELLOW}Updating nginx configuration...${NC}"
            cp nginx/nginx-admin-separated.conf nginx/nginx.conf
            
            # Add current IP to nginx config
            sed -i "/# YOUR_OFFICE_IP\/32 1;/a\\        ${CURRENT_IP}/32 1;" nginx/nginx.conf
            
            echo -e "${YELLOW}Reloading services...${NC}"
            docker-compose up -d backend nginx
            
            sleep 5
            
            echo -e "${GREEN}✓ Admin realm separation ENABLED${NC}"
            echo -e "${GREEN}✓ Admin panel now restricted to allowed IPs${NC}"
            echo ""
            echo -e "${YELLOW}Admin credentials:${NC}"
            echo "  Username: admin"
            echo "  Password: AdminP@ss2024! (CHANGE IMMEDIATELY)"
            echo ""
            echo -e "${YELLOW}Admin URLs:${NC}"
            echo "  Admin Panel: https://admin-viworks.neuratalent.com/admin"
            echo "  Admin API: https://api-viworks.neuratalent.com/admin/api"
            echo ""
            echo -e "${RED}IMPORTANT: Change the default admin password immediately!${NC}"
        fi
        ;;
        
    4)
        echo -e "${YELLOW}═══ Phase D: Full Production Deployment ═══${NC}"
        echo "This will deploy all components with admin separation enabled."
        read -p "Are you sure? This should only be done after testing! (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Performing full deployment...${NC}"
            
            # Ensure all configurations are in place
            cp nginx/nginx-admin-separated.conf nginx/nginx.conf
            sed -i 's/ADMIN_REALM_ENFORCED=false/ADMIN_REALM_ENFORCED=true/' "$ENV_FILE"
            
            # Build all images
            echo -e "${YELLOW}Building all images...${NC}"
            docker-compose build
            
            # Deploy with zero downtime
            echo -e "${YELLOW}Deploying all services...${NC}"
            docker-compose up -d
            
            echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
            sleep 15
            
            # Health checks
            echo -e "${YELLOW}Running health checks...${NC}"
            HEALTH_OK=true
            
            if ! docker-compose exec backend curl -f http://localhost:8081/health > /dev/null 2>&1; then
                echo -e "${RED}✗ Backend health check failed${NC}"
                HEALTH_OK=false
            else
                echo -e "${GREEN}✓ Backend healthy${NC}"
            fi
            
            if ! docker-compose exec frontend curl -f http://localhost:3000 > /dev/null 2>&1; then
                echo -e "${RED}✗ Frontend health check failed${NC}"
                HEALTH_OK=false
            else
                echo -e "${GREEN}✓ Frontend healthy${NC}"
            fi
            
            if ! docker-compose exec nginx nginx -t > /dev/null 2>&1; then
                echo -e "${RED}✗ Nginx configuration invalid${NC}"
                HEALTH_OK=false
            else
                echo -e "${GREEN}✓ Nginx configuration valid${NC}"
            fi
            
            if [ "$HEALTH_OK" = true ]; then
                echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
                echo -e "${GREEN}✓ Full deployment completed successfully!${NC}"
                echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
            else
                echo -e "${RED}Some health checks failed. Check logs for details.${NC}"
            fi
        fi
        ;;
        
    5)
        echo -e "${YELLOW}═══ Rollback to Previous Configuration ═══${NC}"
        echo -e "${RED}This will restore the previous configuration and disable admin separation.${NC}"
        read -p "Continue with rollback? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Rolling back configuration...${NC}"
            
            # Disable feature flag
            sed -i 's/ADMIN_REALM_ENFORCED=true/ADMIN_REALM_ENFORCED=false/' "$ENV_FILE"
            
            # Restore original nginx config if backup exists
            if [ -f "$BACKUP_DIR/nginx.conf.backup" ]; then
                cp "$BACKUP_DIR/nginx.conf.backup" nginx/nginx.conf
                echo -e "${GREEN}✓ Nginx configuration restored${NC}"
            fi
            
            # Reload services
            echo -e "${YELLOW}Reloading services...${NC}"
            docker-compose up -d backend nginx
            
            echo -e "${GREEN}✓ Rollback completed${NC}"
            echo -e "${GREEN}✓ Legacy authentication restored${NC}"
        fi
        ;;
        
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}                    Deployment Complete${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

# Show current status
echo ""
echo -e "${YELLOW}Current Status:${NC}"
ADMIN_REALM_STATUS=$(grep "ADMIN_REALM_ENFORCED" "$ENV_FILE" | cut -d'=' -f2)
if [ "$ADMIN_REALM_STATUS" = "true" ]; then
    echo -e "  Admin Realm: ${GREEN}ENABLED${NC}"
    echo -e "  Admin Panel: ${GREEN}IP Restricted${NC}"
else
    echo -e "  Admin Realm: ${YELLOW}DISABLED (using legacy auth)${NC}"
    echo -e "  Admin Panel: ${YELLOW}Publicly accessible${NC}"
fi

echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  View logs:        docker-compose logs -f backend"
echo "  Check status:     docker-compose ps"
echo "  Test admin API:   curl https://api-viworks.neuratalent.com/admin/api/health"
echo "  Run migrations:   docker-compose exec backend sqlx migrate run"
