Skip to content
Navigation Menu
shaiannazari
viworksolution
 
Type / to search
Code
Issues
Pull requests
Actions
Projects
Security
Insights
Settings
Deploy ViWorks to DigitalOcean
 
Fix git authentication: copy SSH key to server for GitHub access #6
Jobs
Run details
Annotations
1 error
Upload and execute deployment script
Process completed with exit code 128.
deploy
failed 1 minute ago in 16s

0s
2s
2s
1s
0s
Run cat > deploy.sh << 'EOF'
4s
Run scp -i ~/.ssh/id_ed25519 ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP}:/tmp/github_ssh_key
# github.com:22 SSH-2.0-cb24e083
# github.com:22 SSH-2.0-88f9acd9
# github.com:22 SSH-2.0-88f9acd9
# github.com:22 SSH-2.0-88f9acd9
# github.com:22 SSH-2.0-88f9acd9
4s
Run scp -i ~/.ssh/id_ed25519 deploy.sh ${DROPLET_USER}@${DROPLET_IP}:/tmp/
🚀 Starting ViWorks Automated Deployment...
📅 Deployment started at: Fri Sep  5 15:36:31 UTC 2025
🛑 Stopping all containers gracefully...
time="2025-09-05T15:36:31Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
🛑 Force stopping any running containers...
🧹 Removing containers with specific names...
🧹 Removing orphaned containers...
time="2025-09-05T15:36:32Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
🧹 Cleaning up Docker images...
Total reclaimed space: 0B
Total reclaimed space: 0B
🧹 Cleaning up unused networks...
🔍 Verifying no conflicting containers exist...
🧹 Cleaning up and resetting git repository...
fatal: could not read Username for 'https://github.com': No such device or address
Error: Process completed with exit code 128.
0s
0s
0s
0s
