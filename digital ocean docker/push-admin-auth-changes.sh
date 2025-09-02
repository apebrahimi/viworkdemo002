#!/bin/bash

# ViWorkS Admin Authentication Separation - GitHub Push Script
# This script commits and pushes the admin auth separation changes

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}     ViWorkS Admin Authentication Separation - GitHub Push${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Check if git is available
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed${NC}"
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Verify branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}Current branch: ${CURRENT_BRANCH}${NC}"
read -p "Is this the correct branch to push to? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Please switch to the correct branch and try again${NC}"
    exit 0
fi

# List files to be committed
echo -e "${YELLOW}Files to be committed:${NC}"
echo

# Backend files
echo -e "${BLUE}Backend files:${NC}"
echo "- backend/migrations/002_admin_auth_separation.sql"
echo "- backend/src/admin/mod.rs"
echo "- backend/src/admin/auth.rs"
echo "- backend/src/admin/models.rs"
echo "- backend/src/admin/jwt.rs"
echo "- backend/src/admin/middleware.rs"
echo "- backend/src/admin/audit.rs"
echo "- backend/src/admin/rbac.rs"
echo "- backend/src/main_admin.rs"
echo "- backend/Cargo.toml"
echo "- backend/env.production.example"

# Frontend files
echo -e "${BLUE}Frontend files:${NC}"
echo "- frontend/src/contexts/AdminAuthContext.tsx"
echo "- frontend/src/lib/admin-api-services.ts"
echo "- frontend/src/lib/cookie-utils.ts"
echo "- frontend/src/lib/types.ts"
echo "- frontend/src/app/admin/layout.tsx"
echo "- frontend/src/app/admin/login/page.tsx"
echo "- frontend/src/app/admin/page.tsx"
echo "- frontend/src/components/AdminProtectedRoute.tsx"
echo "- frontend/src/components/IdleTimeoutIndicator.tsx"

# Nginx and deployment files
echo -e "${BLUE}Nginx and deployment files:${NC}"
echo "- nginx/nginx-admin-separated.conf"
echo "- nginx/nginx-local.conf"
echo "- deploy-admin-separation.sh"
echo "- test-admin-separation.sh"
echo "- docker-compose.local.yml"
echo "- README-ADMIN-AUTH.md"
echo "- ADMIN_AUTH_SEPARATION_GUIDE.md"

echo
read -p "Continue with commit? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Commit cancelled${NC}"
    exit 0
fi

# Get commit message
COMMIT_MESSAGE=$(cat COMMIT_MESSAGE.md)

# Stage files
echo -e "${YELLOW}Staging files...${NC}"

# Backend files
git add backend/migrations/002_admin_auth_separation.sql
git add backend/src/admin/
git add backend/src/main_admin.rs
git add backend/Cargo.toml
git add backend/env.production.example

# Frontend files
git add frontend/src/contexts/AdminAuthContext.tsx
git add frontend/src/lib/admin-api-services.ts
git add frontend/src/lib/cookie-utils.ts
git add frontend/src/lib/types.ts
git add frontend/src/app/admin/
git add frontend/src/components/AdminProtectedRoute.tsx
git add frontend/src/components/IdleTimeoutIndicator.tsx

# Nginx and deployment files
git add nginx/nginx-admin-separated.conf
git add nginx/nginx-local.conf
git add deploy-admin-separation.sh
git add test-admin-separation.sh
git add docker-compose.local.yml
git add README-ADMIN-AUTH.md
git add ADMIN_AUTH_SEPARATION_GUIDE.md

# Commit
echo -e "${YELLOW}Committing changes...${NC}"
git commit -m "$COMMIT_MESSAGE"

# Push
echo -e "${YELLOW}Ready to push to ${CURRENT_BRANCH}${NC}"
read -p "Push changes? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Pushing to ${CURRENT_BRANCH}...${NC}"
    git push origin $CURRENT_BRANCH
    echo -e "${GREEN}Changes pushed successfully!${NC}"
else
    echo -e "${YELLOW}Push cancelled. Changes are committed but not pushed.${NC}"
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}     Process completed!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
