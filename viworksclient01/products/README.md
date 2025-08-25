# 🏗️ ViWorkS Products Directory

## 📋 **Overview**

This directory contains all ViWorkS platform products organized by type for maintainability and development efficiency.

---

## 🗂️ **Directory Structure**

```
products/
├── clients/                # Desktop client applications
│   ├── windows/           # Windows client (Rust + egui)
│   ├── linux/             # Linux client (Rust + egui)
│   └── macos/             # macOS client (Rust + egui)
├── admin-panel/           # Admin panel web application
│   ├── backend/           # Rust backend service
│   ├── frontend/          # Next.js frontend
│   └── nginx/             # Reverse proxy configuration
├── website/               # Marketing website
├── mobile/                # Mobile applications
│   ├── android/           # Android app (Kotlin)
│   └── ios/               # iOS app (Swift)
├── services/              # Backend microservices
│   ├── cert-service/      # Certificate management
│   ├── admin-service/     # User management
│   ├── push-service/      # Push notifications
│   ├── auth-service/      # Authentication
│   └── config-service/    # Configuration management
└── shared/                # Shared libraries and utilities
    ├── libs/              # Shared libraries
    ├── configs/           # Shared configurations
    ├── scripts/           # Shared scripts
    └── docker/            # Shared Docker configurations
```

---

## 🎯 **Product Overview**

### **🖥️ Desktop Clients**
- **Technology**: Rust + egui
- **Purpose**: Secure VPN client with stealth access
- **Platforms**: Windows, Linux, macOS
- **Status**: Windows client completed, others in development

### **🌐 Admin Panel**
- **Technology**: Rust backend + Next.js frontend
- **Purpose**: Centralized management and monitoring
- **Features**: User management, security monitoring, policy enforcement
- **Status**: In development

### **📱 Mobile Apps**
- **Technology**: Kotlin (Android) + Swift (iOS)
- **Purpose**: Multi-factor authentication and verification
- **Features**: Signal collection, device integrity, push notifications
- **Status**: Planned

### **🌐 Website**
- **Technology**: Next.js + TypeScript
- **Purpose**: Marketing and documentation
- **Features**: Persian/Farsi RTL support, lead generation
- **Status**: Planned

### **🔧 Backend Services**
- **Technology**: Rust microservices
- **Purpose**: Distributed backend infrastructure
- **Services**: CERT, Admin, Push, Auth, Config
- **Status**: Planned

---

## 🚀 **Development Workflow**

### **📋 Getting Started**
1. **Choose a product** from the directory structure
2. **Navigate to the product directory**
3. **Follow the product-specific README**
4. **Set up the development environment**
5. **Start development**

### **🔧 Standard Commands**
```bash
# Navigate to a product
cd products/clients/windows

# Install dependencies (if applicable)
npm install  # or cargo build

# Run development server
npm run dev  # or cargo run

# Run tests
npm test     # or cargo test

# Build for production
npm run build # or cargo build --release
```

---

## 📊 **Development Status**

### **✅ Completed**
- Windows client (Rust + egui)
- Basic security architecture
- Documentation organization

### **🔄 In Progress**
- Admin panel backend (Rust)
- Admin panel frontend (Next.js)

### **⏳ Planned**
- Linux/macOS clients
- Mobile applications
- Website
- Backend services

---

## 🔐 **Security Standards**

### **🔒 All Products Must Follow**
- Zero-knowledge architecture
- Secure coding practices
- Comprehensive testing
- Security review process
- Audit logging

### **📋 Security Checklist**
- [ ] Input validation and sanitization
- [ ] Secure communication (mTLS)
- [ ] Proper authentication and authorization
- [ ] Error handling without information disclosure
- [ ] Regular security updates

---

## 📝 **Documentation**

### **📚 Product Documentation**
Each product has its own documentation:
- `README.md` - Setup and usage
- `docs/` - Detailed documentation
- `CHANGELOG.md` - Version history

### **🏗️ Architecture Documentation**
- `../docs/platform/` - Platform architecture
- `../docs/admin-panel/` - Admin panel design
- `../docs/mobile/` - Mobile app specifications
- `../docs/website/` - Website requirements

---

## 🛠️ **Technology Stack**

### **🦀 Rust**
- **Desktop Clients**: egui for UI, tokio for async
- **Backend Services**: Actix-web, SQLx, Redis
- **Security**: Ring, Argon2, OpenSSL

### **⚛️ Next.js**
- **Admin Panel**: TypeScript, Tailwind CSS
- **Website**: Persian/Farsi RTL support
- **Features**: App Router, Server Components

### **📱 Mobile**
- **Android**: Kotlin, Play Integrity API
- **iOS**: Swift, DeviceCheck API
- **Features**: Hardware-backed security

---

## 🚀 **Deployment**

### **🐳 Containerization**
- All products support Docker deployment
- Multi-stage builds for optimization
- Health checks and monitoring

### **☁️ Cloud Platforms**
- **Development**: Docker Compose
- **Production**: AWS, GCP, Azure, DigitalOcean
- **CI/CD**: GitHub Actions

---

## 📞 **Support**

### **🔧 Development Support**
- Follow the standard project structure
- Use shared libraries and configurations
- Maintain consistent coding standards
- Document all changes

### **📚 Resources**
- [Platform Documentation](../docs/)
- [Standard Structure](shared/configs/standard-structure.md)
- [Development Guidelines](../docs/guides/)

---

**This directory structure ensures maintainability, consistency, and scalability across all ViWorkS products.**
