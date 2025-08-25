# 🚀 **DIGITALOCEAN QUICK REFERENCE**

## ⚡ **ONE-COMMAND DEPLOYMENT**

```bash
cd viworksclient01/products/admin-panel
./deploy-digitalocean-complete.sh deploy
```

---

## 🔑 **ESSENTIAL COMMANDS**

### **Setup**
```bash
# Install doctl
brew install doctl  # macOS
snap install doctl  # Linux

# Authenticate
doctl auth init

# Verify
doctl account get
```

### **Registry**
```bash
# Create registry
doctl registry create viworks-registry --subscription-tier basic

# Login
doctl registry login

# List registries
doctl registry list
```

### **Apps**
```bash
# List apps
doctl apps list

# Get app details
doctl apps get <APP_ID>

# View logs
doctl apps logs <APP_ID>

# Update app
doctl apps update <APP_ID> --spec digitalocean-app-clean.yaml
```

### **Databases**
```bash
# List databases
doctl databases list

# Get database details
doctl databases get <DATABASE_ID>
```

---

## 🌐 **APPLICATION URLS**

After deployment, your apps will be available at:
- **Frontend**: `https://viworks-frontend-<APP_ID>.ondigitalocean.app`
- **Backend**: `https://viworks-backend-<APP_ID>.ondigitalocean.app`

---

## 🔧 **TROUBLESHOOTING**

### **Common Issues**
```bash
# Authentication failed
doctl auth init

# Registry login failed
doctl registry login

# App not deploying
doctl apps logs <APP_ID>

# Database connection issues
doctl databases list
```

### **Health Checks**
```bash
# Backend health
curl https://viworks-backend-<APP_ID>.ondigitalocean.app/health

# Frontend
curl https://viworks-frontend-<APP_ID>.ondigitalocean.app
```

---

## 💰 **COST BREAKDOWN**

| Service | Cost/Month |
|---------|------------|
| Container Registry | $5 |
| App Platform (2x basic-xxs) | $12 |
| PostgreSQL Database | $15 |
| Redis Database | $15 |
| **Total** | **$47** |

---

## 📞 **SUPPORT**

- **DigitalOcean Docs**: https://docs.digitalocean.com/
- **CLI Reference**: https://docs.digitalocean.com/reference/doctl/
- **Community**: https://www.digitalocean.com/community

---

## ✅ **DEPLOYMENT STATUS**

```bash
# Check all resources
doctl apps list
doctl registry list
doctl databases list
```
