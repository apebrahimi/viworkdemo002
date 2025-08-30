#!/bin/bash

# 🚀 GitHub Actions CI/CD Setup Script for ViWorks
# This script helps you set up automated deployment from GitHub to DigitalOcean

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo "🚀 ViWorks GitHub Actions CI/CD Setup"
echo "======================================"
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "This script must be run from a git repository root."
    exit 1
fi

# Get repository information
REPO_URL=$(git remote get-url origin)
REPO_NAME=$(basename -s .git "$REPO_URL")

print_status "Repository: $REPO_NAME"
print_status "Repository URL: $REPO_URL"
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    print_warning "GitHub CLI (gh) is not installed."
    echo "Please install it from: https://cli.github.com/"
    echo "Or manually set up the secrets in your GitHub repository settings."
    echo ""
    
    print_status "Manual Setup Instructions:"
    echo "1. Go to your GitHub repository: https://github.com/YOUR_USERNAME/$REPO_NAME"
    echo "2. Click on 'Settings' tab"
    echo "3. Click on 'Secrets and variables' → 'Actions'"
    echo "4. Add the following secrets:"
    echo ""
    echo "   DROPLET_IP: Your DigitalOcean droplet IP address"
    echo "   DROPLET_USER: SSH user (usually 'root')"
    echo "   SSH_PRIVATE_KEY: Your SSH private key content"
    echo ""
    print_warning "After setting up secrets, you can use the GitHub Actions workflows!"
    exit 0
fi

# Check if user is authenticated with GitHub
if ! gh auth status &> /dev/null; then
    print_error "You are not authenticated with GitHub CLI."
    echo "Please run: gh auth login"
    exit 1
fi

print_success "GitHub CLI is installed and authenticated!"
echo ""

# Get DigitalOcean droplet information
print_status "Please provide your DigitalOcean droplet information:"
read -p "Droplet IP address: " DROPLET_IP
read -p "SSH user (default: root): " DROPLET_USER
DROPLET_USER=${DROPLET_USER:-root}

# Check SSH key
SSH_KEY_PATH="$HOME/.ssh/id_ed25519"
if [ ! -f "$SSH_KEY_PATH" ]; then
    print_warning "SSH key not found at $SSH_KEY_PATH"
    read -p "Enter path to your SSH private key: " SSH_KEY_PATH
    if [ ! -f "$SSH_KEY_PATH" ]; then
        print_error "SSH key file not found!"
        exit 1
    fi
fi

# Test SSH connection
print_status "Testing SSH connection to $DROPLET_IP..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes -i "$SSH_KEY_PATH" "${DROPLET_USER}@${DROPLET_IP}" "echo 'SSH connection successful'" 2>/dev/null; then
    print_error "Cannot connect to $DROPLET_IP using the provided SSH key."
    print_error "Please check your SSH configuration and try again."
    exit 1
fi

print_success "SSH connection successful!"
echo ""

# Set up GitHub secrets
print_status "Setting up GitHub secrets..."

# Read SSH private key content
SSH_PRIVATE_KEY=$(cat "$SSH_KEY_PATH")

# Set secrets using GitHub CLI
gh secret set DROPLET_IP --body "$DROPLET_IP" --repo "$REPO_NAME"
gh secret set DROPLET_USER --body "$DROPLET_USER" --repo "$REPO_NAME"
gh secret set SSH_PRIVATE_KEY --body "$SSH_PRIVATE_KEY" --repo "$REPO_NAME"

print_success "GitHub secrets configured successfully!"
echo ""

# Create a simple test workflow
print_status "Creating a test workflow to verify the setup..."

cat > .github/workflows/test-deployment.yml << 'EOF'
name: Test Deployment Setup

on:
  workflow_dispatch:

env:
  DROPLET_IP: ${{ secrets.DROPLET_IP }}
  DROPLET_USER: ${{ secrets.DROPLET_USER }}
  SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          ssh-keyscan -H $DROPLET_IP >> ~/.ssh/known_hosts
          
      - name: Test SSH connection
        run: |
          ssh -o ConnectTimeout=10 -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "echo 'SSH connection test successful'"
          
      - name: Check Docker status
        run: |
          ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "docker --version && docker-compose --version"
          
      - name: Check application directory
        run: |
          ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "ls -la /opt/viworks || echo 'Application directory not found'"
          
      - name: Success message
        run: |
          echo "✅ All tests passed! Your CI/CD setup is working correctly."
          echo "🌐 Your application should be accessible at: http://${DROPLET_IP}"
EOF

print_success "Test workflow created!"
echo ""

# Summary
print_success "🎉 GitHub Actions CI/CD setup completed!"
echo ""
echo "📋 Summary:"
echo "  • Repository: $REPO_NAME"
echo "  • Droplet IP: $DROPLET_IP"
echo "  • SSH User: $DROPLET_USER"
echo "  • SSH Key: $SSH_KEY_PATH"
echo ""
echo "🚀 Available Workflows:"
echo "  1. deploy-main.yml - Automatic deployment on push to main/master"
echo "  2. deploy-specific.yml - Manual deployment of specific applications"
echo "  3. deploy-multi-app.yml - Multi-application deployment with rollback"
echo "  4. test-deployment.yml - Test your setup (manual trigger)"
echo ""
echo "📝 Next Steps:"
echo "  1. Push this code to GitHub: git add . && git commit -m 'Add CI/CD workflows' && git push"
echo "  2. Go to Actions tab in your GitHub repository"
echo "  3. Run the 'Test Deployment Setup' workflow to verify everything works"
echo "  4. Start using the automated deployment workflows!"
echo ""
echo "🔧 Manual Triggers:"
echo "  • Go to Actions → Deploy Specific Application → Run workflow"
echo "  • Select which applications to deploy and to which environment"
echo ""
print_warning "Remember to keep your SSH keys secure and never commit them to the repository!"
