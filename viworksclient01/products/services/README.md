# 🔧 ViWorkS Backend Services

## 📋 **Overview**

The ViWorkS Backend Services provide a distributed, microservices-based infrastructure for the ViWorkS platform. Each service is built with Rust for maximum security and performance, following zero-knowledge architecture principles.

---

## 🗂️ **Directory Structure**

```
services/
├── cert-service/         # Certificate management service
│   ├── src/             # Source code
│   ├── Cargo.toml       # Dependencies
│   └── README.md        # Service documentation
├── admin-service/        # User management service
│   ├── src/             # Source code
│   ├── Cargo.toml       # Dependencies
│   └── README.md        # Service documentation
├── push-service/         # Push notification service
│   ├── src/             # Source code
│   ├── Cargo.toml       # Dependencies
│   └── README.md        # Service documentation
├── auth-service/         # Authentication service
│   ├── src/             # Source code
│   ├── Cargo.toml       # Dependencies
│   └── README.md        # Service documentation
├── config-service/       # Configuration management service
│   ├── src/             # Source code
│   ├── Cargo.toml       # Dependencies
│   └── README.md        # Service documentation
└── README.md            # This file
```

---

## 🎯 **Service Overview**

### **🔐 CERT Service**
- **Purpose**: Dynamic certificate and key management
- **Features**: Certificate generation, rotation, validation
- **Security**: Hardware security module integration
- **Integration**: Admin panel, client applications

### **👥 Admin Service**
- **Purpose**: User and policy management
- **Features**: RBAC, user lifecycle, policy enforcement
- **Security**: Zero-knowledge user data handling
- **Integration**: Admin panel, authentication service

### **📱 Push Service**
- **Purpose**: Mobile push notifications
- **Features**: FCM (Android), APNS (iOS), message queuing
- **Security**: Encrypted message delivery
- **Integration**: Mobile apps, admin service

### **🔑 Auth Service**
- **Purpose**: Multi-factor authentication
- **Features**: MFA, session management, risk assessment
- **Security**: Hardware-backed authentication
- **Integration**: All client applications

### **⚙️ Config Service**
- **Purpose**: Dynamic configuration management
- **Features**: Client configs, policy distribution
- **Security**: Signed configuration delivery
- **Integration**: Client applications, admin service

---

## 🛠️ **Technology Stack**

### **🦀 Rust Microservices**
- **Framework**: Actix-web for HTTP servers
- **Database**: PostgreSQL with SQLx ORM
- **Cache**: Redis for session and data caching
- **Message Queue**: Redis Streams or RabbitMQ
- **Security**: Ring, Argon2, OpenSSL

### **🔐 Security Infrastructure**
- **Zero-Knowledge**: Client data encryption
- **mTLS**: Mutual TLS for service communication
- **JWT**: Secure token-based authentication
- **Audit Logging**: Immutable audit trails

### **🐳 Containerization**
- **Docker**: Multi-stage builds for optimization
- **Kubernetes**: Orchestration and scaling
- **Service Mesh**: Istio for service communication
- **Monitoring**: Prometheus, Grafana, Jaeger

---

## 🚀 **Development Status**

### **⏳ All Services - PLANNED**
- **Status**: Development planned
- **Architecture**: Microservices design complete
- **Security**: Zero-knowledge architecture defined
- **Integration**: Service communication protocols defined

---

## 🔧 **Development Commands**

### **📋 Service Development**
```bash
# Navigate to a service
cd services/cert-service

# Install dependencies
cargo build

# Run development server
cargo run

# Run tests
cargo test

# Build for production
cargo build --release
```

### **🐳 Docker Development**
```bash
# Build service image
docker build -t viworks-cert-service .

# Run service container
docker run -p 8080:8080 viworks-cert-service

# Run with environment variables
docker run -e DATABASE_URL=postgresql://... viworks-cert-service
```

### **☸️ Kubernetes Deployment**
```bash
# Apply service configuration
kubectl apply -f k8s/cert-service.yaml

# Check service status
kubectl get pods -l app=cert-service

# View service logs
kubectl logs -l app=cert-service
```

---

## 🔐 **Security Architecture**

### **🔒 Service Communication**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Admin Panel   │    │   Auth Service  │    │   Push Service  │
│                 │◄──►│                 │◄──►│                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│  CERT Service  │◄─────────────┘
                        │                 │
                        └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │ Config Service  │
                        └─────────────────┘
```

### **🛡️ Security Measures**
- **Zero-Knowledge**: Client data never decrypted on server
- **mTLS**: Mutual TLS for all service communication
- **JWT Tokens**: Secure service-to-service authentication
- **Audit Logging**: Comprehensive audit trails
- **Rate Limiting**: DDoS protection and abuse prevention

---

## 📊 **Service APIs**

### **🔐 CERT Service API**
```
POST /api/v1/certificates/generate
GET  /api/v1/certificates/{id}
PUT  /api/v1/certificates/{id}/rotate
DELETE /api/v1/certificates/{id}
```

### **👥 Admin Service API**
```
GET  /api/v1/users
POST /api/v1/users
PUT  /api/v1/users/{id}
DELETE /api/v1/users/{id}
GET  /api/v1/policies
POST /api/v1/policies
```

### **📱 Push Service API**
```
POST /api/v1/notifications/send
GET  /api/v1/notifications/status
POST /api/v1/devices/register
DELETE /api/v1/devices/{id}
```

### **🔑 Auth Service API**
```
POST /api/v1/auth/login
POST /api/v1/auth/mfa/verify
POST /api/v1/auth/logout
GET  /api/v1/auth/sessions
```

### **⚙️ Config Service API**
```
GET  /api/v1/configs/{client_id}
POST /api/v1/configs
PUT  /api/v1/configs/{id}
DELETE /api/v1/configs/{id}
```

---

## 🚀 **Deployment**

### **🐳 Docker Deployment**
```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View service logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### **☸️ Kubernetes Deployment**
```bash
# Deploy to Kubernetes cluster
kubectl apply -f k8s/

# Check deployment status
kubectl get all -l app=viworks

# Scale service
kubectl scale deployment cert-service --replicas=3
```

### **☁️ Cloud Deployment**
```bash
# Deploy to cloud platform
./deploy-services.sh [platform]

# Supported platforms:
# - aws-eks
# - gcp-gke
# - azure-aks
# - digitalocean-kubernetes
```

---

## 📝 **Documentation**

### **📚 Service Documentation**
- **CERT Service**: `cert-service/README.md`
- **Admin Service**: `admin-service/README.md`
- **Push Service**: `push-service/README.md`
- **Auth Service**: `auth-service/README.md`
- **Config Service**: `config-service/README.md`

### **🔧 Development Guides**
- **Setup**: Service-specific setup instructions
- **API Reference**: REST API documentation
- **Testing**: Testing strategies and procedures
- **Deployment**: Container and cloud deployment

---

## 🎯 **Next Steps**

### **🔄 Immediate Actions**
1. **Service Development**
   - Set up Rust project structure for each service
   - Implement core API endpoints
   - Add database and Redis integration
   - Implement security measures

2. **Service Integration**
   - Set up service-to-service communication
   - Implement API gateways
   - Add monitoring and logging
   - Create deployment pipelines

3. **Testing & Validation**
   - Unit and integration testing
   - Security testing and validation
   - Performance testing
   - Load testing

---

**The ViWorkS Backend Services provide a secure, scalable, and maintainable microservices infrastructure for the ViWorkS platform.**
