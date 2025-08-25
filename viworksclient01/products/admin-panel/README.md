# 🖥️ ViWorkS Admin Panel

## 📋 **Overview**

The ViWorkS Admin Panel is a comprehensive web application for managing ViWorkS clients, users, and security policies. It provides centralized administration with real-time monitoring and enterprise-grade security features.

---

## 🗂️ **Directory Structure**

```
admin-panel/
├── backend/              # Rust backend service
│   ├── src/             # Source code
│   ├── Cargo.toml       # Dependencies
│   └── README.md        # Backend documentation
├── frontend/            # Next.js frontend
│   ├── src/             # Source code
│   ├── package.json     # Dependencies
│   └── README.md        # Frontend documentation
├── nginx/               # Reverse proxy configuration
│   └── nginx.conf       # Nginx configuration
├── docker-compose.yml   # Local development setup
├── env.example          # Environment variables template
├── deploy-cloud.sh      # Cloud deployment script
├── setup-admin-panel.ps1 # Setup script
└── README.md            # This file
```

---

## 🎯 **Admin Panel Features**

### **👥 User Management**
- **Panel Users**: Admin, security, helpdesk roles
- **VPN Users**: Client user management
- **RBAC**: Role-based access control
- **MFA**: Multi-factor authentication

### **🔐 Security Management**
- **Policy Engine**: Time, geo, IP, device policies
- **Session Management**: Active session monitoring
- **Key Management**: Certificate and token management
- **Audit Logging**: Comprehensive audit trail

### **📊 Monitoring & Analytics**
- **Real-time Dashboard**: Live system status
- **Security Metrics**: Threat detection and alerts
- **Usage Analytics**: Client usage statistics
- **SIEM Integration**: Security information management

### **🔧 System Administration**
- **Node Management**: Gateway and server management
- **Configuration**: System and client configuration
- **Backup & Recovery**: Data backup and restoration
- **Integration**: Third-party system integration

---

## 🛠️ **Technology Stack**

### **🦀 Backend (Rust)**
- **Framework**: Actix-web for HTTP server
- **Database**: PostgreSQL with SQLx ORM
- **Cache**: Redis for session and data caching
- **Security**: Ring, Argon2, OpenSSL
- **Async**: Tokio runtime

### **⚛️ Frontend (Next.js)**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Radix UI
- **State Management**: Zustand, React Query

### **🐳 Infrastructure**
- **Containerization**: Docker and Docker Compose
- **Reverse Proxy**: Nginx
- **Deployment**: Multi-cloud support
- **Monitoring**: Health checks and logging

---

## 🚀 **Development Status**

### **🔄 Current Status**
- **Backend**: In development (Rust setup)
- **Frontend**: In development (Next.js setup)
- **Infrastructure**: Docker configuration ready
- **Documentation**: Comprehensive documentation available

### **📋 Next Steps**
1. Complete Rust backend setup
2. Initialize Next.js frontend
3. Set up database and Redis
4. Implement core API endpoints
5. Create admin dashboard UI

---

## 🔧 **Development Commands**

### **📋 Setup**
```bash
# Navigate to admin panel
cd products/admin-panel

# Start with Docker Compose
docker-compose up -d

# Or setup manually
./setup-admin-panel.ps1
```

### **🦀 Backend Development**
```bash
# Navigate to backend
cd backend

# Install dependencies
cargo build

# Run development server
cargo run

# Run tests
cargo test
```

### **⚛️ Frontend Development**
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### **🐳 Docker Development**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🔐 **Security Features**

### **🔒 Authentication & Authorization**
- **JWT Tokens**: Secure session management
- **RBAC**: Role-based access control
- **MFA**: Multi-factor authentication
- **Session Management**: Secure session handling

### **🛡️ Data Protection**
- **Zero-Knowledge**: Client data encryption
- **mTLS**: Mutual TLS for all connections
- **Input Validation**: Comprehensive input sanitization
- **Audit Logging**: Immutable audit trail

### **🔍 Monitoring & Alerting**
- **Real-time Monitoring**: Live system status
- **Security Alerts**: Threat detection and notification
- **Performance Monitoring**: System performance tracking
- **SIEM Integration**: Security information management

---

## 📊 **Architecture**

### **🏗️ System Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│    (Rust)       │◄──►│  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│     Redis      │◄─────────────┘
                        │    (Cache)     │
                        └─────────────────┘
```

### **🔗 API Structure**
- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Sessions**: `/api/sessions/*`
- **Policies**: `/api/policies/*`
- **Monitoring**: `/api/monitoring/*`
- **System**: `/api/system/*`

---

## 🚀 **Deployment**

### **🐳 Local Development**
```bash
# Start with Docker Compose
docker-compose up -d

# Access services
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
# Database: localhost:5432
# Redis: localhost:6379
```

### **☁️ Cloud Deployment**
```bash
# Deploy to cloud platform
./deploy-cloud.sh [platform]

# Supported platforms:
# - aws-ecs
# - gcp-cloudrun
# - azure-aci
# - digitalocean
```

---

## 📝 **Documentation**

### **📚 Admin Panel Documentation**
- **Architecture**: `../docs/admin-panel/ADMIN_PANEL_ARCHITECTURE_PLAN.md`
- **Development**: `../docs/admin-panel/ADMIN_PANEL_DEVELOPMENT_SETUP.md`
- **Summary**: `../docs/admin-panel/ADMIN_PANEL_SUMMARY.md`

### **🔧 Backend Documentation**
- **API Reference**: `backend/README.md`
- **Database Schema**: `backend/docs/schema.md`
- **Security Guide**: `backend/docs/security.md`

### **⚛️ Frontend Documentation**
- **Component Library**: `frontend/README.md`
- **UI Guidelines**: `frontend/docs/ui-guidelines.md`
- **State Management**: `frontend/docs/state-management.md`

---

## 🎯 **Next Steps**

### **🔄 Immediate Actions**
1. **Backend Development**
   - Complete Rust project setup
   - Implement core API endpoints
   - Set up database and Redis

2. **Frontend Development**
   - Initialize Next.js project
   - Create admin dashboard
   - Implement authentication UI

3. **Integration**
   - Connect frontend and backend
   - Implement real-time communication
   - Set up monitoring and alerting

---

**The ViWorkS Admin Panel provides comprehensive management capabilities with enterprise-grade security and monitoring.**
