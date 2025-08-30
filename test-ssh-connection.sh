#!/bin/bash

# Test SSH connection to DigitalOcean droplet
DROPLET_IP="64.227.46.188"
DROPLET_USER="root"

echo "🔍 Testing SSH connection to ${DROPLET_IP}..."

# Test basic SSH connection
if ssh -o ConnectTimeout=10 -o BatchMode=yes -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "echo 'SSH connection successful!'"; then
    echo "✅ SSH connection successful!"
    
    # Test Docker availability
    echo "🔍 Checking Docker installation..."
    if ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "docker --version"; then
        echo "✅ Docker is installed"
    else
        echo "❌ Docker is not installed or not accessible"
        exit 1
    fi
    
    # Test Docker Compose availability
    echo "🔍 Checking Docker Compose installation..."
    if ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "docker-compose --version"; then
        echo "✅ Docker Compose is installed"
    else
        echo "❌ Docker Compose is not installed or not accessible"
        exit 1
    fi
    
    # Check system resources
    echo "🔍 Checking system resources..."
    ssh -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "
        echo 'Memory usage:'
        free -h
        echo ''
        echo 'Disk usage:'
        df -h
        echo ''
        echo 'CPU info:'
        nproc
    "
    
    echo "✅ All checks passed! Ready for deployment."
    echo ""
    echo "You can now run: ./deploy-to-digitalocean.sh"
    
else
    echo "❌ SSH connection failed!"
    echo ""
    echo "Troubleshooting tips:"
    echo "1. Make sure your SSH key is properly configured"
    echo "2. Check if the droplet IP is correct: ${DROPLET_IP}"
    echo "3. Verify your SSH key is added to the droplet"
    echo "4. Try connecting manually: ssh -i ~/.ssh/id_ed25519 root@${DROPLET_IP}"
    exit 1
fi
