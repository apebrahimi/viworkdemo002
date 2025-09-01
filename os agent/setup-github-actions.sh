#!/bin/bash

# 🚀 GitHub Actions Setup Script for ViWorks Agent
# This script helps you set up the required secrets and configuration

set -e

echo "🚀 Setting up GitHub Actions CI/CD for ViWorks Agent"
echo "=================================================="

# Check if required tools are installed
command -v gh >/dev/null 2>&1 || { echo "❌ GitHub CLI (gh) is required but not installed. Please install it first."; exit 1; }

# Check if user is authenticated
if ! gh auth status >/dev/null 2>&1; then
    echo "🔐 Please authenticate with GitHub first:"
    gh auth login
fi

echo ""
echo "📋 Required GitHub Secrets:"
echo "=========================="
echo ""

# Get repository info
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo "📍 Repository: $REPO"

echo ""
echo "🔐 Please add these secrets to your GitHub repository:"
echo "   Go to: https://github.com/$REPO/settings/secrets/actions"
echo ""

# DigitalOcean secrets
echo "🌊 DigitalOcean Secrets:"
echo "   DIGITALOCEAN_ACCESS_TOKEN    - Your DigitalOcean API token"
echo "   DIGITALOCEAN_PROJECT_NAME    - Your DigitalOcean project name"
echo ""

# Droplet secrets
echo "🖥️  Droplet Secrets:"
echo "   DROPLET_HOST                 - Your droplet IP (e.g., 64.227.46.188)"
echo "   DROPLET_USERNAME             - SSH username (usually 'root')"
echo "   DROPLET_SSH_KEY              - Your private SSH key"
echo ""

# Generate SSH key if needed
echo "🔑 SSH Key Setup:"
if [ ! -f ~/.ssh/id_ed25519_github ]; then
    echo "   Generating new SSH key for GitHub Actions..."
    ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_github -C "github-actions@viworks.com" -N ""
    echo "   ✅ SSH key generated: ~/.ssh/id_ed25519_github"
    echo "   📋 Public key content:"
    echo "   $(cat ~/.ssh/id_ed25519_github.pub)"
    echo ""
    echo "   🔧 Add this public key to your droplet:"
    echo "   ssh-copy-id -i ~/.ssh/id_ed25519_github.pub root@YOUR_DROPLET_IP"
else
    echo "   ✅ SSH key already exists: ~/.ssh/id_ed25519_github"
    echo "   📋 Public key content:"
    echo "   $(cat ~/.ssh/id_ed25519_github.pub)"
fi

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo "1. Add the secrets listed above to GitHub"
echo "2. Copy the SSH public key to your droplet"
echo "3. Push this workflow to your repository"
echo "4. Make a test commit to trigger deployment"
echo "5. Check agent health on port 8443"
echo ""
echo "📚 For detailed setup instructions, see: GITHUB_ACTIONS_SETUP.md"
echo ""
echo "🎉 Setup complete! Your ViWorks Agent will auto-deploy on every push to main."
