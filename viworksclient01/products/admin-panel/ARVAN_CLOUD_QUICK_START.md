# 🚀 Arvan Cloud Quick Start Guide

## ⚡ **Quick Deployment to Arvan Cloud**

This guide provides the fastest way to deploy your ViWorkS Admin Panel to Arvan Cloud Container Service.

---

## 📋 **Prerequisites**

### **1. Install Required Tools**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### **2. Arvan Cloud Setup**
1. **Create Account**: [Arvan Cloud](https://arvancloud.com)
2. **Enable Container Service** in your project
3. **Download kubeconfig** from Arvan Cloud dashboard
4. **Configure kubectl** with your cluster

---

## 🚀 **One-Command Deployment**

### **Complete Deployment**
```bash
# Navigate to admin panel directory
cd viworksclient01/products/admin-panel

# Run complete deployment
./deploy-arvan-cloud.sh all
```

### **Step-by-Step Deployment**
```bash
# 1. Build images only
./deploy-arvan-cloud.sh build

# 2. Push images only
./deploy-arvan-cloud.sh push

# 3. Deploy to Arvan Cloud only
./deploy-arvan-cloud.sh deploy
```

---

## 🔧 **Configuration Updates**

### **1. Update Domain Names**
Edit `k8s-manifests/ingress.yaml`:
```yaml
# Replace with your actual domains
- your-domain.ir
- api.your-domain.ir
```

### **2. Update Secrets**
Edit `k8s-manifests/secret.yaml`:
```yaml
# Update these values for production
JWT_SECRET: <your-secure-jwt-secret>
POSTGRES_PASSWORD: <your-secure-password>
```

### **3. Update Environment Variables**
Edit `k8s-manifests/configmap.yaml`:
```yaml
# Update URLs to match your domains
CORS_ORIGIN: "https://your-domain.ir"
ADMIN_PANEL_URL: "https://your-domain.ir"
NEXT_PUBLIC_API_URL: "https://api.your-domain.ir"
```

---

## 🌐 **Access Your Application**

### **After DNS Configuration**
- **Frontend**: https://your-domain.ir
- **Backend API**: https://api.your-domain.ir

### **Check Deployment Status**
```bash
# Check all resources
kubectl get all -n viworks-admin

# Check pods
kubectl get pods -n viworks-admin

# Check services
kubectl get services -n viworks-admin

# Check ingress
kubectl get ingress -n viworks-admin
```

---

## 📊 **Monitoring Commands**

### **View Logs**
```bash
# Backend logs
kubectl logs -f deployment/viworks-backend -n viworks-admin

# Frontend logs
kubectl logs -f deployment/viworks-frontend -n viworks-admin

# Database logs
kubectl logs -f deployment/viworks-postgres -n viworks-admin
```

### **Resource Usage**
```bash
# Pod resource usage
kubectl top pods -n viworks-admin

# Node resource usage
kubectl top nodes
```

### **Scale Applications**
```bash
# Scale backend
kubectl scale deployment viworks-backend --replicas=3 -n viworks-admin

# Scale frontend
kubectl scale deployment viworks-frontend --replicas=3 -n viworks-admin
```

---

## 🔄 **Update Deployment**

### **Update Images**
```bash
# Build new images
./deploy-arvan-cloud.sh build

# Push new images
./deploy-arvan-cloud.sh push

# Update deployment
kubectl set image deployment/viworks-backend backend=registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-backend:v2 -n viworks-admin
kubectl set image deployment/viworks-frontend frontend=registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-frontend:v2 -n viworks-admin
```

### **Rollback Deployment**
```bash
# Rollback to previous version
kubectl rollout undo deployment/viworks-backend -n viworks-admin
kubectl rollout undo deployment/viworks-frontend -n viworks-admin
```

---

## 🆘 **Troubleshooting**

### **Common Issues**

#### **1. Image Pull Errors**
```bash
# Check registry login
docker login registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir

# Check image exists
docker pull registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-backend:v1
```

#### **2. Pod Startup Issues**
```bash
# Check pod status
kubectl describe pod <pod-name> -n viworks-admin

# Check pod logs
kubectl logs <pod-name> -n viworks-admin
```

#### **3. Service Connectivity**
```bash
# Test service connectivity
kubectl run test-pod --image=busybox -n viworks-admin --rm -it --restart=Never -- wget -O- http://viworks-backend-service:8081/health
```

---

## 📚 **Useful Commands**

### **Port Forwarding (for debugging)**
```bash
# Forward backend port
kubectl port-forward service/viworks-backend-service 8081:8081 -n viworks-admin

# Forward frontend port
kubectl port-forward service/viworks-frontend-service 3000:3000 -n viworks-admin

# Forward database port
kubectl port-forward service/viworks-postgres-service 5432:5432 -n viworks-admin
```

### **Database Access**
```bash
# Access PostgreSQL
kubectl exec -it deployment/viworks-postgres -n viworks-admin -- psql -U admin -d viworks_admin

# Access Redis
kubectl exec -it deployment/viworks-redis -n viworks-admin -- redis-cli
```

### **Delete Deployment**
```bash
# Delete all resources
kubectl delete namespace viworks-admin

# Or delete individual resources
kubectl delete -f k8s-manifests/
```

---

## 🎯 **Next Steps**

1. **Configure DNS**: Point your domain to Arvan Cloud
2. **Update SSL**: Verify SSL certificates are working
3. **Set up Monitoring**: Configure alerts and monitoring
4. **Backup Strategy**: Set up database backups
5. **Security**: Review and update security configurations

---

**🎉 Your ViWorkS Admin Panel is now running on Arvan Cloud!**
