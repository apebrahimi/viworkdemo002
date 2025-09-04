# Backend Agent CI/CD Deployment Plan

## Overview
This document outlines a comprehensive CI/CD plan for automatically deploying the Backend Agent when changes are pushed to the GitHub repository.

## 🎯 **CI/CD Objectives**

### Primary Goals
- **Automated Deployment**: Deploy Backend Agent on every push to main branch
- **Zero Downtime**: Ensure service availability during deployments
- **Rollback Capability**: Quick rollback if deployment fails
- **Testing Integration**: Run tests before deployment
- **Security**: Secure deployment pipeline with proper authentication

---

## 🏗️ **Architecture Overview**

### Current Infrastructure
- **Source**: GitHub repository
- **Target**: Digital Ocean server (64.227.46.188)
- **Container**: `viworks-backend-agent-new`
- **Domain**: `agent.neuratalent.com`
- **SSL**: Let's Encrypt certificate

### Deployment Pipeline
```
GitHub Push → GitHub Actions → Build → Test → Deploy → Verify → Notify
```

---

## 📋 **Implementation Plan**

### Phase 1: GitHub Actions Setup

#### 1.1 Create GitHub Actions Workflow
**File**: `.github/workflows/deploy-backend-agent.yml`

```yaml
name: Deploy Backend Agent

on:
  push:
    branches: [ main ]
    paths: [ 'backend agent/**' ]
  pull_request:
    branches: [ main ]
    paths: [ 'backend agent/**' ]

env:
  CARGO_TERM_COLOR: always
  RUST_BACKTRACE: 1

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Install Rust
      uses: actions-rs/toolchain@v1
      with:
        toolchain: stable
        components: rustfmt, clippy
    
    - name: Cache cargo registry
      uses: actions/cache@v3
      with:
        path: ~/.cargo/registry
        key: ${{ runner.os }}-cargo-registry-${{ hashFiles('**/Cargo.lock') }}
    
    - name: Cache cargo index
      uses: actions/cache@v3
      with:
        path: ~/.cargo/git
        key: ${{ runner.os }}-cargo-index-${{ hashFiles('**/Cargo.lock') }}
    
    - name: Cache cargo build
      uses: actions/cache@v3
      with:
        path: target
        key: ${{ runner.os }}-cargo-build-target-${{ hashFiles('**/Cargo.lock') }}
    
    - name: Run tests
      run: |
        cd "backend agent"
        cargo test --verbose
    
    - name: Run clippy
      run: |
        cd "backend agent"
        cargo clippy -- -D warnings
    
    - name: Check formatting
      run: |
        cd "backend agent"
        cargo fmt -- --check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Install Rust
      uses: actions-rs/toolchain@v1
      with:
        toolchain: stable
    
    - name: Cache cargo build
      uses: actions/cache@v3
      with:
        path: target
        key: ${{ runner.os }}-cargo-build-target-${{ hashFiles('**/Cargo.lock') }}
    
    - name: Build Backend Agent
      run: |
        cd "backend agent"
        cargo build --release
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: backend-agent-binary
        path: "backend agent/target/release/viworks-backend-agent"

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: backend-agent-binary
    
    - name: Deploy to Digital Ocean
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.DIGITALOCEAN_HOST }}
        username: ${{ secrets.DIGITALOCEAN_USERNAME }}
        key: ${{ secrets.DIGITALOCEAN_SSH_KEY }}
        script: |
          # Create deployment directory
          mkdir -p /opt/viworks/deployments/backend-agent
          
          # Backup current binary
          if [ -f /opt/viworks/deployments/backend-agent/viworks-backend-agent ]; then
            cp /opt/viworks/deployments/backend-agent/viworks-backend-agent /opt/viworks/deployments/backend-agent/viworks-backend-agent.backup.$(date +%Y%m%d_%H%M%S)
          fi
          
          # Stop current container
          docker stop viworks-backend-agent-new || true
          
          # Wait for graceful shutdown
          sleep 5
    
    - name: Upload new binary
      uses: appleboy/scp-action@v0.1.4
      with:
        host: ${{ secrets.DIGITALOCEAN_HOST }}
        username: ${{ secrets.DIGITALOCEAN_USERNAME }}
        key: ${{ secrets.DIGITALOCEAN_SSH_KEY }}
        source: "viworks-backend-agent"
        target: "/opt/viworks/deployments/backend-agent/"
    
    - name: Start Backend Agent
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.DIGITALOCEAN_HOST }}
        username: ${{ secrets.DIGITALOCEAN_USERNAME }}
        key: ${{ secrets.DIGITALOCEAN_SSH_KEY }}
        script: |
          # Make binary executable
          chmod +x /opt/viworks/deployments/backend-agent/viworks-backend-agent
          
          # Start container with new binary
          docker exec viworks-backend-agent-new bash -c "cd /app && nohup ./viworks-backend-agent > /dev/null 2>&1 &"
          
          # Wait for startup
          sleep 10
          
          # Verify deployment
          curl -k https://agent.neuratalent.com/health || {
            echo "Deployment verification failed, rolling back..."
            docker exec viworks-backend-agent-new bash -c "pkill -f viworks-backend-agent"
            if [ -f /opt/viworks/deployments/backend-agent/viworks-backend-agent.backup.$(date +%Y%m%d_%H%M%S) ]; then
              cp /opt/viworks/deployments/backend-agent/viworks-backend-agent.backup.$(date +%Y%m%d_%H%M%S) /opt/viworks/deployments/backend-agent/viworks-backend-agent
              docker exec viworks-backend-agent-new bash -c "cd /app && nohup ./viworks-backend-agent > /dev/null 2>&1 &"
            fi
            exit 1
          }
          
          echo "Deployment successful!"

  notify:
    needs: [test, build, deploy]
    runs-on: ubuntu-latest
    if: always()
    steps:
    - name: Notify deployment status
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        fields: repo,message,commit,author,action,eventName,ref,workflow
```

#### 1.2 Required GitHub Secrets
```bash
# Add these secrets to GitHub repository settings
DIGITALOCEAN_HOST=64.227.46.188
DIGITALOCEAN_USERNAME=root
DIGITALOCEAN_SSH_KEY=<private_ssh_key>
SLACK_WEBHOOK=<slack_webhook_url>  # Optional
```

### Phase 2: Enhanced Deployment Strategy

#### 2.1 Blue-Green Deployment
```yaml
# Enhanced deployment with blue-green strategy
deploy:
  needs: build
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  steps:
  - name: Blue-Green Deployment
    uses: appleboy/ssh-action@v0.1.5
    with:
      host: ${{ secrets.DIGITALOCEAN_HOST }}
      username: ${{ secrets.DIGITALOCEAN_USERNAME }}
      key: ${{ secrets.DIGITALOCEAN_SSH_KEY }}
      script: |
        # Determine current and new environment
        CURRENT_ENV=$(docker ps --format "table {{.Names}}" | grep viworks-backend-agent | head -1)
        NEW_ENV="viworks-backend-agent-new"
        
        if [ "$CURRENT_ENV" = "viworks-backend-agent-new" ]; then
          NEW_ENV="viworks-backend-agent-blue"
        fi
        
        echo "Current: $CURRENT_ENV, New: $NEW_ENV"
        
        # Deploy to new environment
        docker run -d --name $NEW_ENV \
          --network viworks-internal \
          -v /opt/viworks/deployments/backend-agent:/app \
          debian:latest \
          tail -f /dev/null
        
        # Copy new binary to new container
        docker cp /opt/viworks/deployments/backend-agent/viworks-backend-agent $NEW_ENV:/app/
        
        # Start new service
        docker exec $NEW_ENV bash -c "cd /app && chmod +x viworks-backend-agent && nohup ./viworks-backend-agent > /dev/null 2>&1 &"
        
        # Wait for health check
        sleep 15
        
        # Verify new deployment
        if curl -k https://agent.neuratalent.com/health; then
          echo "New deployment healthy, switching traffic..."
          
          # Update nginx to point to new container
          # (This would require nginx configuration update)
          
          # Stop old container
          docker stop $CURRENT_ENV
          docker rm $CURRENT_ENV
          
          echo "Deployment successful!"
        else
          echo "New deployment failed, keeping current version"
          docker stop $NEW_ENV
          docker rm $NEW_ENV
          exit 1
        fi
```

#### 2.2 Database Migration Support
```yaml
# Add database migration step
migrate:
  needs: build
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  steps:
  - name: Run Database Migrations
    uses: appleboy/ssh-action@v0.1.5
    with:
      host: ${{ secrets.DIGITALOCEAN_HOST }}
      username: ${{ secrets.DIGITALOCEAN_USERNAME }}
      key: ${{ secrets.DIGITALOCEAN_SSH_KEY }}
      script: |
        # Run database migrations if needed
        docker exec viworks-backend-agent-new bash -c "cd /app && ./viworks-backend-agent migrate"
```

### Phase 3: Monitoring and Alerting

#### 3.1 Health Check Integration
```yaml
# Add comprehensive health checks
health-check:
  needs: deploy
  runs-on: ubuntu-latest
  steps:
  - name: Comprehensive Health Check
    uses: appleboy/ssh-action@v0.1.5
    with:
      host: ${{ secrets.DIGITALOCEAN_HOST }}
      username: ${{ secrets.DIGITALOCEAN_USERNAME }}
      key: ${{ secrets.DIGITALOCEAN_SSH_KEY }}
      script: |
        # Wait for service to be ready
        for i in {1..30}; do
          if curl -k https://agent.neuratalent.com/health; then
            echo "Service is healthy"
            break
          fi
          echo "Waiting for service... ($i/30)"
          sleep 10
        done
        
        # Check SSL certificate
        echo | openssl s_client -connect agent.neuratalent.com:443 -servername agent.neuratalent.com 2>/dev/null | openssl x509 -noout -dates
        
        # Check container status
        docker ps | grep viworks-backend-agent
        
        # Check logs for errors
        docker logs viworks-backend-agent-new --tail 50
```

#### 3.2 Performance Testing
```yaml
# Add performance testing
performance-test:
  needs: deploy
  runs-on: ubuntu-latest
  steps:
  - name: Performance Test
    run: |
      # Test response time
      RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' https://agent.neuratalent.com/health)
      echo "Response time: ${RESPONSE_TIME}s"
      
      # Test concurrent connections
      for i in {1..10}; do
        curl -k https://agent.neuratalent.com/health &
      done
      wait
      
      echo "Performance test completed"
```

---

## 🔧 **Implementation Steps**

### Step 1: Create GitHub Actions Workflow
```bash
# Create the workflow file
mkdir -p .github/workflows
touch .github/workflows/deploy-backend-agent.yml
```

### Step 2: Add GitHub Secrets
```bash
# Add secrets to GitHub repository
# Go to: Settings → Secrets and variables → Actions
# Add:
# - DIGITALOCEAN_HOST
# - DIGITALOCEAN_USERNAME  
# - DIGITALOCEAN_SSH_KEY
```

### Step 3: Test the Pipeline
```bash
# Make a small change to trigger the pipeline
echo "# Test deployment" >> "backend agent/README.md"
git add .
git commit -m "Test CI/CD pipeline"
git push origin main
```

### Step 4: Monitor Deployment
```bash
# Check GitHub Actions tab for deployment status
# Monitor server logs
ssh root@64.227.46.188 "docker logs viworks-backend-agent-new -f"
```

---

## 🚨 **Rollback Strategy**

### Automatic Rollback
```bash
# If health check fails, automatically rollback
if ! curl -k https://agent.neuratalent.com/health; then
  echo "Health check failed, rolling back..."
  
  # Stop current container
  docker stop viworks-backend-agent-new
  
  # Restore backup binary
  cp /opt/viworks/deployments/backend-agent/viworks-backend-agent.backup.* /opt/viworks/deployments/backend-agent/viworks-backend-agent
  
  # Restart with backup
  docker exec viworks-backend-agent-new bash -c "cd /app && nohup ./viworks-backend-agent > /dev/null 2>&1 &"
  
  # Verify rollback
  sleep 10
  curl -k https://agent.neuratalent.com/health
fi
```

### Manual Rollback
```bash
# Manual rollback command
ssh root@64.227.46.188 "bash /opt/viworks/scripts/rollback-backend-agent.sh"
```

---

## 📊 **Monitoring and Metrics**

### Deployment Metrics
- **Deployment Frequency**: Daily deployments
- **Lead Time**: < 10 minutes from commit to production
- **Mean Time to Recovery**: < 5 minutes
- **Change Failure Rate**: < 5%

### Health Monitoring
- **Uptime**: > 99.9%
- **Response Time**: < 100ms
- **Error Rate**: < 0.1%
- **Resource Usage**: CPU < 10%, Memory < 100MB

---

## 🎯 **Success Criteria**

### ✅ **Automated Deployment**
- [ ] Push to main triggers deployment
- [ ] Tests run before deployment
- [ ] Zero-downtime deployment
- [ ] Automatic rollback on failure

### ✅ **Quality Assurance**
- [ ] Code quality checks (clippy, fmt)
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Performance tests pass

### ✅ **Monitoring**
- [ ] Health checks after deployment
- [ ] Performance monitoring
- [ ] Error tracking
- [ ] Alert notifications

---

## 🚀 **Next Steps**

1. **Create GitHub Actions workflow file**
2. **Add required secrets to GitHub**
3. **Test the pipeline with a small change**
4. **Monitor first deployment**
5. **Implement blue-green deployment**
6. **Add comprehensive monitoring**
7. **Set up alerting and notifications**

This CI/CD plan ensures reliable, automated deployment of the Backend Agent with proper testing, monitoring, and rollback capabilities.
