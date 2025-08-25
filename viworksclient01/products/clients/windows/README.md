# 🖥️ ViWorkS Windows Client

## 📋 **Overview**

The ViWorkS Windows Client is a fully functional Rust + egui desktop application that provides secure VPN access with enterprise-grade security features. This client is **COMPLETED** and ready for production use.

---

## 🏗️ **Project Structure**

```
windows/
├── apps/                    # Desktop application source
├── crates/                  # Rust crates and modules
├── assets/                  # Icons and resources
├── binaries/                # Runtime dependencies ⚠️ IMPORTANT
├── security/                # Security configurations
├── scripts/                 # Build and deployment scripts
├── target/                  # Build output (gitignored)
├── Cargo.toml              # Dependencies
└── README.md               # This file
```

---

## ⚠️ **IMPORTANT: Runtime Dependencies**

The Windows client requires several runtime dependencies to function properly. These are stored in the `binaries/` directory and must be available next to the executable when running.

### **🔧 Required Runtime Files**
- **`fwknop.exe`** - Single Packet Authorization tool
- **`openvpn.exe`** - OpenVPN client
- **`stunnel.exe`** - SSL/TLS tunneling tool
- **`libcrypto-3-x64.dll`** - OpenSSL crypto library
- **`libssl-3-x64.dll`** - OpenSSL SSL library
- **`libgcc_s_seh-1.dll`** - GCC runtime library
- **`libssp-0.dll`** - Stack smashing protection
- **`ca-certs.pem`** - CA certificates
- **`openssl.cnf`** - OpenSSL configuration
- **`stunnel.conf`** - Stunnel configuration

### **📦 Automatic Dependency Management**
The build scripts automatically copy these dependencies to the correct location:
- **Development**: Dependencies copied to `target/debug/` or `target/release/`
- **Production**: Dependencies included in the distribution package

---

## 🚀 **Development Workflow**

### **📋 Prerequisites**
- **Rust**: Latest stable version
- **Windows**: Windows 10 or later (x64)
- **PowerShell**: For running build scripts

### **🔧 Build Commands**

#### **Fast Development Build**
```powershell
# Navigate to Windows client directory
cd products/clients/windows

# Fast build with automatic dependency copying
.\scripts\fast_build.ps1

# Or with options
.\scripts\fast_build.ps1 -Clean -Release
```

#### **Run the Application**
```powershell
# Run debug version (with automatic dependency copying)
.\scripts\run_app.ps1

# Run release version
.\scripts\run_app.ps1 -Release
```

#### **Copy Runtime Dependencies Manually**
```powershell
# Copy dependencies to debug target
.\scripts\copy_runtime_deps.ps1

# Copy dependencies to release target
.\scripts\copy_runtime_deps.ps1 -Target release
```

#### **Production Release**
```powershell
# Create production release with all checks
.\scripts\release.ps1

# Create release with specific version
.\scripts\release.ps1 -Version 1.1.0

# Skip tests for faster release
.\scripts\release.ps1 -SkipTests
```

---

## 🎯 **Features**

### **🔐 Security Features**
- **Zero-Knowledge Architecture**: Client data encrypted before transmission
- **Stealth Access**: Services hidden from internet discovery
- **Certificate Pinning**: Prevents MITM attacks
- **Process Hardening**: Windows-specific security mitigations
- **Memory Security**: Secure memory handling and zeroization

### **🖥️ User Interface**
- **Cross-Platform UI**: Consistent experience with egui
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

## 📦 **Build Scripts**

### **`fast_build.ps1`**
- Fast development build with optimizations
- Automatically copies runtime dependencies
- Supports debug and release modes
- Shows build time and executable size

### **`run_app.ps1`**
- Runs the application with automatic dependency checking
- Supports both debug and release modes
- Ensures all required files are present

### **`copy_runtime_deps.ps1`**
- Manually copies runtime dependencies
- Useful for troubleshooting dependency issues
- Shows detailed information about copied files

### **`release.ps1`**
- Creates production-ready release package
- Runs security audits and dependency analysis
- Includes all runtime dependencies in distribution
- Creates comprehensive documentation

---

## 🔧 **Troubleshooting**

### **❌ "Missing DLL" Errors**
If you encounter missing DLL errors:

1. **Check binaries directory**:
   ```powershell
   dir binaries\
   ```

2. **Copy dependencies manually**:
   ```powershell
   .\scripts\copy_runtime_deps.ps1
   ```

3. **Verify executable location**:
   ```powershell
   dir target\debug\viworks-desktop.exe
   ```

### **❌ "Application won't start"**
1. **Check if all dependencies are present**:
   ```powershell
   dir target\debug\*.exe
   dir target\debug\*.dll
   ```

2. **Run with dependency copying**:
   ```powershell
   .\scripts\run_app.ps1
   ```

### **❌ "Build fails"**
1. **Clean and rebuild**:
   ```powershell
   .\scripts\fast_build.ps1 -Clean
   ```

2. **Check Rust installation**:
   ```powershell
   rustc --version
   cargo --version
   ```

---

## 📊 **Development Status**

### **✅ COMPLETED**
- **Desktop Application**: Fully functional Rust + egui application
- **Security Features**: Comprehensive security measures implemented
- **VPN Integration**: SPA → Stunnel → OpenVPN connection flow
- **User Interface**: Professional-grade UI with security dashboard
- **Build System**: Automated build and deployment scripts
- **Runtime Dependencies**: Properly managed and distributed

### **🔧 Ready for Production**
- **Security Audit**: All security checks passed
- **Dependency Analysis**: All dependencies verified
- **Testing**: Comprehensive testing completed
- **Documentation**: Complete documentation available

---

## 🚀 **Deployment**

### **📦 Development Testing**
```powershell
# Build and run for testing
.\scripts\fast_build.ps1
.\scripts\run_app.ps1
```

### **🏭 Production Release**
```powershell
# Create production release
.\scripts\release.ps1 -Version 1.0.0
```

### **📋 Distribution Package**
The release script creates a complete distribution package:
- **Executable**: `viworks-desktop.exe`
- **Runtime Dependencies**: All required DLLs and executables
- **Documentation**: README and installation instructions
- **Installer**: PowerShell installation script

---

## 📝 **Documentation**

### **📚 Related Documentation**
- **Platform Architecture**: `../../docs/platform/PLATFORM_MASTER_PLAN.md`
- **Security Features**: `../../docs/guides/SECURITY_FEATURES.md`
- **Client Integration**: `../../docs/guides/CLIENT_INTEGRATION_PROTOCOL.md`
- **Troubleshooting**: `../../docs/guides/CLIENT_TROUBLESHOOTING_GUIDE.md`

### **🔧 Development Guides**
- **Setup**: Platform-specific setup instructions
- **Building**: Build and packaging guides
- **Testing**: Testing strategies and procedures
- **Deployment**: Distribution and installation

---

## 🎯 **Next Steps**

### **🔄 Cross-Platform Development**
1. **Linux Client**: Port Windows client to Linux
2. **macOS Client**: Port Windows client to macOS
3. **Cross-Platform Testing**: Ensure consistent behavior

### **🔗 Integration**
1. **Admin Panel**: Connect with server-side admin panel
2. **Mobile Apps**: Integrate with mobile authentication
3. **Backend Services**: Connect with microservices

---

**The ViWorkS Windows Client is production-ready with comprehensive security features and proper runtime dependency management! 🚀**
