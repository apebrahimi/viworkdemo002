# 🚀 GitHub Actions CI/CD Setup Guide for ViWorks

This guide will help you set up automated deployment from GitHub to your DigitalOcean Docker containers. With this setup, you can automatically deploy your applications whenever you push code to GitHub.

## 📋 Prerequisites

- GitHub repository with your code
- DigitalOcean droplet with Docker and Docker Compose installed
- SSH access to your droplet
- GitHub CLI (optional, for automated setup)

## 🛠️ Quick Setup

### Option 1: Automated Setup (Recommended)

1. **Run the setup script:**
   ```bash
   ./setup-github-actions.sh
   ```

2. **Follow the prompts** to provide your DigitalOcean droplet information

3. **Push the changes to GitHub:**
   ```bash
   git add .
   git commit -m "Add CI/CD workflows"
   git push
   ```

### Option 2: Manual Setup

1. **Go to your GitHub repository settings:**
   - Navigate to `Settings` → `Secrets and variables` → `Actions`

2. **Add the following secrets:**
   - `DROPLET_IP`: Your DigitalOcean droplet IP address
   - `DROPLET_USER`: SSH user (usually `root`)
   - `SSH_PRIVATE_KEY`: Content of your SSH private key file

3. **Push the workflow files to GitHub**

## 🚀 Available Workflows

### 1. Automatic Deployment (`deploy-main.yml`)

**Triggers:** Push to `main` or `master` branch

**What it does:**
- Automatically deploys the full ViWorks stack
- Pulls latest changes from GitHub
- Rebuilds and restarts Docker containers
- Runs health checks

**Usage:** Simply push to main branch:
```bash
git push origin main
```

### 2. Specific Application Deployment (`deploy-specific.yml`)

**Triggers:** Manual trigger with options

**What it does:**
- Deploy specific applications (frontend, backend, admin-panel, etc.)
- Choose deployment environment
- Select branch to deploy from

**Usage:**
1. Go to GitHub → Actions → Deploy Specific Application
2. Click "Run workflow"
3. Select options and run

### 3. Multi-Application Deployment (`deploy-multi-app.yml`)

**Triggers:** Push to main/master/develop OR manual trigger

**What it does:**
- Deploy multiple applications at once
- Automatic rollback capabilities
- Environment-specific deployments
- Backup before deployment

**Usage:**
```bash
# Automatic on push to main
git push origin main

# Manual trigger with options
# Go to Actions → Deploy Multiple Applications → Run workflow
```

### 4. Test Deployment (`test-deployment.yml`)

**Triggers:** Manual trigger

**What it does:**
- Tests SSH connection
- Verifies Docker setup
- Checks application directory
- Validates configuration

**Usage:** Run this first to verify your setup works correctly.

## 🔧 Configuration Options

### Environment Variables

The workflows use these environment variables (set as GitHub secrets):

- `DROPLET_IP`: Your DigitalOcean droplet IP
- `DROPLET_USER`: SSH user (usually `root`)
- `SSH_PRIVATE_KEY`: Your SSH private key content

### Application Paths

The workflows expect your applications to be in these directories:
- Main frontend: `viworks-frontend/`
- Admin panel: `viworksclient01/products/admin-panel/`
- Website: `websitejadid/`
- Backend: `viworksclient01/products/admin-panel/backend/`

### Docker Configuration

The workflows work with your existing `docker-compose.yml` file and expect:
- Services named: `frontend`, `admin-frontend`, `backend`, `postgres`, `redis`, `nginx`
- Application directory: `/opt/viworks` on the droplet

## 📱 Deployment Scenarios

### Scenario 1: Full Stack Deployment
```bash
# Push to main branch - automatically deploys everything
git push origin main
```

### Scenario 2: Frontend Only Update
1. Go to Actions → Deploy Specific Application
2. Select "frontend" as application
3. Choose "production" environment
4. Run workflow

### Scenario 3: Backend API Update
1. Go to Actions → Deploy Specific Application
2. Select "backend" as application
3. Choose "production" environment
4. Run workflow

### Scenario 4: Multiple Applications
1. Go to Actions → Deploy Multiple Applications
2. Enter: `viworks,admin-panel,website`
3. Choose environment
4. Run workflow

## 🔍 Monitoring and Troubleshooting

### View Deployment Logs
1. Go to GitHub → Actions
2. Click on any workflow run
3. View detailed logs for each step

### Check Application Status
```bash
# SSH into your droplet
ssh root@YOUR_DROPLET_IP

# Check container status
cd /opt/viworks
docker-compose ps

# View logs
docker-compose logs -f [service-name]
```

### Common Issues

**SSH Connection Failed:**
- Verify your SSH key is correct
- Check droplet IP address
- Ensure SSH key is added to droplet

**Docker Build Failed:**
- Check Dockerfile syntax
- Verify all dependencies are available
- Check disk space on droplet

**Application Not Accessible:**
- Check if containers are running
- Verify nginx configuration
- Check firewall settings

## 🔄 Rollback Process

If a deployment fails or causes issues:

1. **Automatic Rollback:**
   - The multi-app workflow creates backups
   - Use the rollback option in manual triggers

2. **Manual Rollback:**
   ```bash
   ssh root@YOUR_DROPLET_IP
   cd /opt/viworks
   git log --oneline -5  # See recent commits
   git reset --hard HEAD~1  # Go back one commit
   docker-compose up -d --build
   ```

## 🛡️ Security Considerations

1. **SSH Keys:**
   - Use strong SSH keys
   - Never commit SSH keys to repository
   - Rotate keys regularly

2. **Environment Variables:**
   - Keep sensitive data in GitHub secrets
   - Use different secrets for different environments

3. **Access Control:**
   - Limit who can trigger deployments
   - Use branch protection rules
   - Require pull request reviews

## 📊 Best Practices

1. **Branch Strategy:**
   - Use `main` for production
   - Use `develop` for staging
   - Use feature branches for development

2. **Testing:**
   - Run tests before deployment
   - Use staging environment for testing
   - Implement health checks

3. **Monitoring:**
   - Set up application monitoring
   - Monitor resource usage
   - Set up alerts for failures

4. **Backup:**
   - Regular database backups
   - Configuration backups
   - Document deployment procedures

## 🎯 Next Steps

1. **Set up the workflows** using the setup script
2. **Test the deployment** with the test workflow
3. **Configure monitoring** for your applications
4. **Set up staging environment** for testing
5. **Implement automated testing** before deployment

## 📞 Support

If you encounter issues:

1. Check the GitHub Actions logs
2. Verify your SSH configuration
3. Test manual deployment first
4. Check Docker and system logs on the droplet

## 🎉 Benefits

With this CI/CD setup, you'll have:

- ✅ **Automatic deployments** on code push
- ✅ **Selective deployments** for specific applications
- ✅ **Rollback capabilities** for quick recovery
- ✅ **Environment management** for staging/production
- ✅ **Health monitoring** and verification
- ✅ **Time savings** - no more manual deployments
- ✅ **Consistency** - same deployment process every time
- ✅ **Reliability** - automated error handling and verification

---

**Happy deploying! 🚀**
