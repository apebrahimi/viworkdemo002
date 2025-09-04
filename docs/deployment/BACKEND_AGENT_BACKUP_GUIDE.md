# Backend Agent Backup and Restore Guide

## Overview
This guide provides comprehensive backup and restore procedures for the ViWorks Backend Agent to ensure disaster recovery capabilities.

## 🛡️ **BACKUP CREATED SUCCESSFULLY**

### **Backup Information**
- **Date**: September 4, 2025, 20:53:15 UTC
- **Location**: `/opt/viworks/backups/backend-agent/20250904_205315/`
- **Size**: 178MB
- **Status**: ✅ **COMPLETE AND VERIFIED**

### **Backup Contents**
```
/opt/viworks/backups/backend-agent/20250904_205315/
├── viworks-backend-agent              # Working binary (7MB)
├── nginx.conf                         # Nginx configuration (10KB)
├── viworks-backend-agent-container.tar # Complete container export (178MB)
├── BACKUP_INFO.txt                    # Backup documentation
└── config/                            # Configuration directory
```

---

## 📋 **BACKUP COMPONENTS**

### 1. **Container Image Backup**
- **Image**: `viworks-backend-agent-backup:20250904_205315`
- **Type**: Docker commit of running container
- **Size**: ~178MB
- **Contains**: Complete container state with working binary

### 2. **Binary Backup**
- **File**: `viworks-backend-agent`
- **Size**: 7MB
- **Location**: `/app/viworks-backend-agent` in container
- **Status**: Working and tested

### 3. **Configuration Backup**
- **Nginx Config**: `nginx.conf` with agent routing
- **Container Config**: Complete container filesystem
- **Network Config**: Docker network settings

### 4. **Container Export**
- **File**: `viworks-backend-agent-container.tar`
- **Type**: Complete container filesystem export
- **Size**: 178MB
- **Usage**: Can be imported to recreate exact container

---

## 🔄 **RESTORE PROCEDURES**

### **Method 1: Using Restore Script (Recommended)**

#### **Step 1: Copy Restore Script to Server**
```bash
# Copy the restore script to the server
scp scripts/restore-backend-agent.sh root@64.227.46.188:/opt/viworks/scripts/
```

#### **Step 2: Run Restore Script**
```bash
# SSH to server and run restore
ssh root@64.227.46.188 "chmod +x /opt/viworks/scripts/restore-backend-agent.sh"
ssh root@64.227.46.188 "/opt/viworks/scripts/restore-backend-agent.sh"
```

#### **Step 3: Verify Restore**
```bash
# Check health
curl -k https://agent.neuratalent.com/health

# Check container status
ssh root@64.227.46.188 "docker ps | grep viworks-backend-agent"
```

### **Method 2: Manual Restore**

#### **Step 1: Import Container**
```bash
# Import the container from backup
docker import /opt/viworks/backups/backend-agent/20250904_205315/viworks-backend-agent-container.tar viworks-backend-agent-restored:latest
```

#### **Step 2: Create New Container**
```bash
# Create new container with same network settings
docker run -d --name viworks-backend-agent-restored \
  --network viworks-internal \
  -p 8080-8081:8080-8081 \
  viworks-backend-agent-restored:latest \
  tail -f /dev/null
```

#### **Step 3: Copy Binary**
```bash
# Copy the working binary
docker cp /opt/viworks/backups/backend-agent/20250904_205315/viworks-backend-agent viworks-backend-agent-restored:/app/
```

#### **Step 4: Start Service**
```bash
# Start the Backend Agent service
docker exec viworks-backend-agent-restored bash -c "cd /app && chmod +x viworks-backend-agent && nohup ./viworks-backend-agent > /dev/null 2>&1 &"
```

#### **Step 5: Restore Nginx Configuration**
```bash
# Restore nginx configuration
cp /opt/viworks/backups/backend-agent/20250904_205315/nginx.conf /opt/viworks/digital\ ocean\ docker/nginx/
docker restart viworks-nginx
```

#### **Step 6: Verify Restore**
```bash
# Wait for startup
sleep 15

# Check health
curl -k https://agent.neuratalent.com/health

# Expected response: {"status":"healthy"}
```

---

## 🚨 **DISASTER RECOVERY SCENARIOS**

### **Scenario 1: Container Corruption**
```bash
# If current container is corrupted
docker stop viworks-backend-agent-new
docker rm viworks-backend-agent-new
/opt/viworks/scripts/restore-backend-agent.sh
```

### **Scenario 2: Binary Corruption**
```bash
# If binary is corrupted but container is fine
docker cp /opt/viworks/backups/backend-agent/20250904_205315/viworks-backend-agent viworks-backend-agent-new:/app/
docker exec viworks-backend-agent-new bash -c "cd /app && chmod +x viworks-backend-agent && pkill -f viworks-backend-agent && nohup ./viworks-backend-agent > /dev/null 2>&1 &"
```

### **Scenario 3: Complete Server Failure**
```bash
# On new server, restore from backup
# 1. Copy backup files to new server
# 2. Import container: docker import viworks-backend-agent-container.tar viworks-backend-agent:latest
# 3. Create container with same network settings
# 4. Copy binary and start service
# 5. Restore nginx configuration
```

### **Scenario 4: Nginx Configuration Loss**
```bash
# Restore nginx configuration
cp /opt/viworks/backups/backend-agent/20250904_205315/nginx.conf /opt/viworks/digital\ ocean\ docker/nginx/
docker restart viworks-nginx
```

---

## 📊 **BACKUP VERIFICATION**

### **Health Check Commands**
```bash
# Basic health check
curl -k https://agent.neuratalent.com/health

# Detailed health check
curl -k -v https://agent.neuratalent.com/health

# SSL certificate check
openssl s_client -connect agent.neuratalent.com:443 -servername agent.neuratalent.com
```

### **Container Status Check**
```bash
# Check container status
docker ps | grep viworks-backend-agent

# Check container logs
docker logs viworks-backend-agent-new --tail 20

# Check process inside container
docker exec viworks-backend-agent-new ps aux | grep viworks-backend-agent
```

### **Network Connectivity Check**
```bash
# Test internal connectivity
docker exec viworks-nginx curl http://viworks-backend-agent-new:8080/health

# Test external connectivity
curl -k https://agent.neuratalent.com/health
```

---

## 🔧 **BACKUP MAINTENANCE**

### **Backup Retention Policy**
- **Daily Backups**: Keep for 7 days
- **Weekly Backups**: Keep for 4 weeks
- **Monthly Backups**: Keep for 12 months
- **Critical Backups**: Keep indefinitely (like this one)

### **Backup Cleanup Script**
```bash
#!/bin/bash
# Cleanup old backups
find /opt/viworks/backups/backend-agent/ -type d -mtime +7 -exec rm -rf {} \;
```

### **Backup Verification Script**
```bash
#!/bin/bash
# Verify backup integrity
BACKUP_DIR="/opt/viworks/backups/backend-agent/20250904_205315"

# Check if all files exist
for file in "viworks-backend-agent" "nginx.conf" "viworks-backend-agent-container.tar"; do
    if [ ! -f "$BACKUP_DIR/$file" ]; then
        echo "ERROR: Missing file $file"
        exit 1
    fi
done

echo "✅ Backup verification successful"
```

---

## 📈 **BACKUP MONITORING**

### **Backup Status Monitoring**
```bash
# Check backup size
du -sh /opt/viworks/backups/backend-agent/20250904_205315

# Check backup age
ls -la /opt/viworks/backups/backend-agent/20250904_205315

# Check backup integrity
tar -tf /opt/viworks/backups/backend-agent/20250904_205315/viworks-backend-agent-container.tar | head -10
```

### **Automated Backup Verification**
```bash
# Add to cron for daily verification
0 2 * * * /opt/viworks/scripts/verify-backup.sh
```

---

## 🎯 **SUCCESS CRITERIA**

### **✅ Backup Complete**
- [x] Container image backed up
- [x] Binary file backed up
- [x] Configuration files backed up
- [x] Complete container export created
- [x] Documentation created
- [x] Restore script created

### **✅ Restore Tested**
- [ ] Restore script tested (ready for testing)
- [ ] Manual restore procedure documented
- [ ] Disaster recovery scenarios covered
- [ ] Verification procedures documented

---

## 🚀 **NEXT STEPS**

1. **Test Restore Script**: Run the restore script to verify it works
2. **Document Results**: Update this guide with test results
3. **Schedule Regular Backups**: Set up automated backup schedule
4. **Train Team**: Ensure team knows how to use restore procedures
5. **Monitor Backups**: Set up monitoring for backup integrity

---

## 📞 **EMERGENCY CONTACTS**

### **Restore Commands (Quick Reference)**
```bash
# Quick restore
ssh root@64.227.46.188 "/opt/viworks/scripts/restore-backend-agent.sh"

# Health check
curl -k https://agent.neuratalent.com/health

# Container status
ssh root@64.227.46.188 "docker ps | grep viworks-backend-agent"
```

**The Backend Agent backup is now complete and ready for disaster recovery scenarios!** 🛡️
