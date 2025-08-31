#!/bin/bash
set -e

echo "🚀 Deploying Standalone Nginx to DigitalOcean Server"
echo "=================================================="

# Server details
SERVER_IP="64.227.46.188"
SERVER_USER="root"
SSH_KEY="~/.ssh/id_ed25519"

# Local directory
LOCAL_DIR="$(pwd)"
REMOTE_DIR="/root/standalone-nginx"

echo "📋 Step 1: Creating remote directory..."
ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP "mkdir -p $REMOTE_DIR"

echo "📋 Step 2: Copying files to server..."
scp -i $SSH_KEY -r ./* $SERVER_USER@$SERVER_IP:$REMOTE_DIR/

echo "📋 Step 3: Making scripts executable on server..."
ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP "chmod +x $REMOTE_DIR/*.sh"

echo "📋 Step 4: Running setup on server..."
ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP "cd $REMOTE_DIR && ./setup-standalone-nginx.sh"

echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Test the websites:"
echo "   Website: https://website-vw.neuratalent.com"
echo "   Admin Panel: https://admin-viworks.neuratalent.com"
echo "   Main App: https://viworks.neuratalent.com"
echo ""
echo "📊 Check status on server:"
echo "   ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'cd $REMOTE_DIR && docker-compose ps'"
echo ""
echo "📋 View logs on server:"
echo "   ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker logs viworks-standalone-nginx'"
