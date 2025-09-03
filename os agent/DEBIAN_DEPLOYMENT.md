# 🚀 Native Debian Deployment Guide (No Docker)

## **📋 Overview**
This guide explains how to deploy the ViWorks OS Agent **natively** on your Debian droplet (178.128.42.148) without Docker containers.

## **🔧 What This Approach Provides**
- **Native Debian**: Runs directly on the Debian OS
- **Systemd Service**: Managed as a proper system service
- **No Docker**: Eliminates container overhead and complexity
- **Direct Access**: Binary runs natively with full system access
- **Easy Management**: Standard Linux service management

## **🚀 Quick Deployment Steps**

### **Step 1: Copy Agent Source to Debian Droplet**
```bash
# From your local machine, copy the agent source
scp -r "os agent/" root@178.128.42.148:/tmp/os-agent-source
```

### **Step 2: SSH to Debian Droplet**
```bash
ssh root@178.128.42.148
```

### **Step 3: Run the Native Build Script**
```bash
# Navigate to the source directory
cd /tmp/os-agent-source

# Make the script executable
chmod +x build-on-debian-native.sh

# Run the native build script
./build-on-debian-native.sh
```

## **🔍 What the Script Does**

1. **System Setup**: Updates packages, installs dependencies
2. **Rust Installation**: Installs Rust toolchain
3. **Source Build**: Compiles the Rust application natively
4. **Service Setup**: Creates systemd service
5. **Configuration**: Sets up config files and directories
6. **Firewall**: Configures UFW firewall
7. **Nginx**: Sets up reverse proxy (optional)
8. **Deployment**: Starts the service

## **📊 Expected Results**

After successful deployment:
- **Binary**: `/opt/viworks/agent/viworks-gateway-agent`
- **Service**: `viworks-gateway-agent` systemd service
- **Port**: 8443 accessible
- **Health Endpoint**: `http://178.128.42.148:8443/api/v1/health`
- **Status Endpoint**: `http://178.128.42.148:8443/api/v1/status`
- **Nginx Proxy**: `http://178.128.42.148/api/v1/health` (port 80)

## **🧪 Testing the Agent**

### **From the Debian Droplet**
```bash
# Test health endpoint
curl http://localhost:8443/api/v1/health

# Test status endpoint
curl http://localhost:8443/api/v1/status

# Check service status
systemctl status viworks-gateway-agent

# View logs
journalctl -u viworks-gateway-agent -f
```

### **From Your Local Machine**
```bash
# Test direct access (port 8443)
curl http://178.128.42.148:8443/api/v1/health
curl http://178.128.42.148:8443/api/v1/status

# Test through nginx (port 80)
curl http://178.128.42.148/api/v1/health
curl http://178.128.42.148/api/v1/status
```

## **🔧 Service Management**

### **Start/Stop/Restart**
```bash
# Start the service
systemctl start viworks-gateway-agent

# Stop the service
systemctl stop viworks-gateway-agent

# Restart the service
systemctl restart viworks-gateway-agent

# Check status
systemctl status viworks-gateway-agent
```

### **Enable/Disable**
```bash
# Enable auto-start on boot
systemctl enable viworks-gateway-agent

# Disable auto-start
systemctl disable viworks-gateway-agent
```

### **Logs and Monitoring**
```bash
# Follow logs in real-time
journalctl -u viworks-gateway-agent -f

# View recent logs
journalctl -u viworks-gateway-agent --no-pager -n 50

# Check service logs
journalctl -u viworks-gateway-agent --since "1 hour ago"
```

## **🔧 Troubleshooting**

### **If Build Fails**
```bash
# Check Rust installation
cargo --version

# Check system resources
free -h
df -h

# Check dependencies
dpkg -l | grep -E "(build-essential|libssl-dev|pkg-config)"
```

### **If Service Won't Start**
```bash
# Check service status
systemctl status viworks-gateway-agent

# Check logs
journalctl -u viworks-gateway-agent --no-pager -n 20

# Check port availability
netstat -tuln | grep 8443

# Check binary permissions
ls -la /opt/viworks/agent/viworks-gateway-agent
```

### **If Endpoints Not Responding**
```bash
# Check firewall
ufw status

# Check nginx
systemctl status nginx
nginx -t

# Test local access
curl -v http://localhost:8443/api/v1/health
```

## **📈 Monitoring and Maintenance**

### **Resource Usage**
```bash
# Check memory usage
ps aux | grep viworks-gateway-agent

# Check CPU usage
top -p $(pgrep viworks-gateway-agent)

# Check file descriptors
ls -la /proc/$(pgrep viworks-gateway-agent)/fd | wc -l
```

### **Log Rotation**
Logs are automatically rotated daily and kept for 30 days:
- **Location**: `/var/log/viworks/`
- **Rotation**: Daily
- **Retention**: 30 days
- **Compression**: Yes

## **🔄 Updates**

To update the agent:
```bash
# Stop the service
systemctl stop viworks-gateway-agent

# Copy new source and rebuild
scp -r "os agent/" root@178.128.42.148:/tmp/os-agent-source
ssh root@178.128.42.148 "cd /tmp/os-agent-source && ./build-on-debian-native.sh"
```

## **🎯 Next Steps**

After successful deployment:
1. **Test endpoints** from your local machine
2. **Verify service health** and logs
3. **Test backend communication** (when ready)
4. **Configure external agents** to use the new endpoints

## **🔒 Security Features**

- **Non-root execution**: Runs as `viworks` user
- **Resource limits**: 512MB RAM, 50% CPU max
- **Firewall**: UFW configured with minimal ports
- **Service isolation**: systemd security features enabled
- **Log rotation**: Automatic log management

---

**Note**: This deployment runs the agent natively on Debian OS, providing better performance and easier management than containerized approaches.
