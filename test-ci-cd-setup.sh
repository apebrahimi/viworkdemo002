#!/bin/bash

# 🧪 CI/CD Setup Test Script
# This script tests your GitHub Actions setup before pushing to GitHub

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

echo "🧪 ViWorks CI/CD Setup Test"
echo "============================"
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "This script must be run from a git repository root."
    exit 1
fi

print_success "✅ Git repository detected"

# Check if GitHub workflows exist
if [ ! -d ".github/workflows" ]; then
    print_error "GitHub workflows directory not found."
    print_error "Please run the setup script first: ./setup-github-actions.sh"
    exit 1
fi

print_success "✅ GitHub workflows directory found"

# Check for required workflow files
REQUIRED_WORKFLOWS=(
    "deploy-main.yml"
    "deploy-specific.yml"
    "deploy-multi-app.yml"
    "test-deployment.yml"
)

for workflow in "${REQUIRED_WORKFLOWS[@]}"; do
    if [ -f ".github/workflows/$workflow" ]; then
        print_success "✅ Found workflow: $workflow"
    else
        print_warning "⚠️  Missing workflow: $workflow"
    fi
done

echo ""

# Check if setup script exists
if [ -f "setup-github-actions.sh" ]; then
    print_success "✅ Setup script found"
else
    print_warning "⚠️  Setup script not found"
fi

# Check if documentation exists
if [ -f "GITHUB_ACTIONS_SETUP_GUIDE.md" ]; then
    print_success "✅ Documentation found"
else
    print_warning "⚠️  Documentation not found"
fi

echo ""

# Check git status
print_status "Checking git status..."
if git diff --quiet && git diff --cached --quiet; then
    print_success "✅ Working directory is clean"
else
    print_warning "⚠️  You have uncommitted changes"
    echo "   Consider committing your changes before pushing:"
    echo "   git add ."
    echo "   git commit -m 'Add CI/CD workflows'"
fi

# Check remote repository
print_status "Checking remote repository..."
if git remote get-url origin &> /dev/null; then
    REPO_URL=$(git remote get-url origin)
    print_success "✅ Remote repository: $REPO_URL"
else
    print_error "❌ No remote repository configured"
    echo "   Please add a remote repository:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
fi

echo ""
echo "📋 Test Summary:"
echo "================"

if [ -d ".github/workflows" ] && [ -f "setup-github-actions.sh" ]; then
    print_success "🎉 Your CI/CD setup looks good!"
    echo ""
    echo "📝 Next Steps:"
    echo "1. Run the setup script: ./setup-github-actions.sh"
    echo "2. Push to GitHub: git add . && git commit -m 'Add CI/CD workflows' && git push"
    echo "3. Go to GitHub → Actions to see your workflows"
    echo "4. Run the 'Test Deployment Setup' workflow first"
    echo ""
    echo "🚀 After setup, you can:"
    echo "• Push to main branch for automatic deployment"
    echo "• Use manual triggers for specific applications"
    echo "• Deploy multiple applications at once"
else
    print_error "❌ Setup incomplete"
    echo ""
    echo "Please run: ./setup-github-actions.sh"
fi

echo ""
print_status "For detailed instructions, see: GITHUB_ACTIONS_SETUP_GUIDE.md"
