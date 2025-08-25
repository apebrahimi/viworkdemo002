# 🖥️ ViWorkS Desktop Clients

## 📋 **Overview**

This directory contains the ViWorkS desktop client applications for Windows, Linux, and macOS. All clients are built with Rust and egui for consistent cross-platform functionality and security.

---

## 🗂️ **Directory Structure**

```
clients/
├── windows/              # Windows client (completed)
│   ├── apps/            # Desktop application
│   ├── crates/          # Rust crates and modules
│   ├── assets/          # Icons and resources
│   ├── binaries/        # External binaries
│   ├── security/        # Security configurations
│   ├── Cargo.toml       # Dependencies
│   └── README.md        # Windows-specific documentation
├── linux/               # Linux client (planned)
│   └── README.md        # Linux-specific documentation
└── macos/               # macOS client (planned)
    └── README.md        # macOS-specific documentation
```

---

## 🎯 **Client Features**

### **🔐 Security Features**
- **Zero-Knowledge Architecture**: Client data encrypted before transmission
- **Stealth Access**: Services hidden from internet discovery
- **Certificate Pinning**: Prevents MITM attacks
- **Process Hardening**: Platform-specific security mitigations
- **Memory Security**: Secure memory handling and zeroization

### **🖥️ User Interface**
- **Cross-Platform UI**: Consistent experience across platforms
- **Security Dashboard**: Real-time security monitoring
- **Connection Management**: VPN connection status and controls
- **Settings Panel**: Configuration and preferences

### **🔧 Technical Features**
- **SPA Integration**: Single Packet Authorization
- **Stunnel Integration**: Secure tunneling
- **OpenVPN Integration**: VPN protocol support
- **Real-time Monitoring**: Security event tracking
- **Logging**: Comprehensive audit logging

---

## 🛠️ **Technology Stack**

### **🦀 Rust + egui**
- **Framework**: egui for cross-platform UI
- **Async Runtime**: Tokio for asynchronous operations
- **Serialization**: Serde for data handling
- **HTTP Client**: Reqwest for API communication

### **🔐 Security Libraries**
- **Cryptography**: Ring for cryptographic operations
- **Memory Security**: SecureBox for secure memory handling
- **Certificate Management**: OpenSSL integration
- **Process Security**: Platform-specific hardening

---

## 🚀 **Development Status**

### **✅ Windows Client - COMPLETED**
- **Status**: Fully functional
- **Features**: All core features implemented
- **Security**: Comprehensive security measures
- **Testing**: Thoroughly tested

### **⏳ Linux Client - PLANNED**
- **Status**: Development planned
- **Features**: Same as Windows client
- **Platform**: Linux-specific optimizations
- **Packaging**: deb/rpm packages

### **⏳ macOS Client - PLANNED**
- **Status**: Development planned
- **Features**: Same as Windows client
- **Platform**: macOS-specific optimizations
- **Packaging**: App Store distribution

---

## 🔧 **Development Commands**

### **📋 Setup**
```bash
# Navigate to Windows client
cd clients/windows

# Install dependencies
cargo build

# Run development version
cargo run

# Run with logging
cargo run --bin viworks-desktop
```

### **🧪 Testing**
```bash
# Run all tests
cargo test

# Run specific test
cargo test test_name

# Run with coverage
cargo tarpaulin
```

### **📦 Building**
```bash
# Build debug version
cargo build

# Build release version
cargo build --release

# Build for specific target
cargo build --target x86_64-unknown-linux-gnu
```

---

## 🔐 **Security Considerations**

### **🔒 Platform-Specific Security**
- **Windows**: Process hardening, memory protection
- **Linux**: SELinux/AppArmor integration, secure storage
- **macOS**: Keychain integration, Gatekeeper compliance

### **🛡️ Common Security Measures**
- Input validation and sanitization
- Secure communication protocols
- Certificate pinning and validation
- Memory zeroization
- Audit logging

---

## 📊 **Cross-Platform Strategy**

### **🔄 Code Sharing**
- **Shared Core**: Common business logic
- **Platform Modules**: Platform-specific implementations
- **UI Consistency**: Same egui interface across platforms
- **Security Parity**: Equivalent security measures

### **📦 Deployment**
- **Windows**: MSI installer, portable executable
- **Linux**: deb/rpm packages, AppImage
- **macOS**: App Store, DMG installer

---

## 📝 **Documentation**

### **📚 Client Documentation**
- **Windows**: `windows/README.md`
- **Linux**: `linux/README.md`
- **macOS**: `macos/README.md`

### **🔧 Development Guides**
- **Setup**: Platform-specific setup instructions
- **Building**: Build and packaging guides
- **Testing**: Testing strategies and procedures
- **Deployment**: Distribution and installation

---

## 🚀 **Next Steps**

### **🔄 Immediate Actions**
1. **Linux Client Development**
   - Port Windows client to Linux
   - Implement Linux-specific security features
   - Create Linux packaging

2. **macOS Client Development**
   - Port Windows client to macOS
   - Implement macOS-specific security features
   - Prepare App Store submission

3. **Cross-Platform Testing**
   - Ensure consistent behavior
   - Platform-specific testing
   - Security validation

---

**The ViWorkS desktop clients provide secure, cross-platform VPN access with enterprise-grade security features.**
