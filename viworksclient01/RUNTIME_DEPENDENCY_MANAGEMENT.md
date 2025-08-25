# 🔧 ViWorkS Runtime Dependency Management

## 📋 **Overview**

The ViWorkS Windows client requires several runtime dependencies to function properly. This document explains how these dependencies are managed and how to ensure the client runs correctly during development and production.

---

## ⚠️ **IMPORTANT: Runtime Dependencies**

The Windows client executable (`viworks-desktop.exe`) requires the following files to be present in the same directory when running:

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

---

## 📁 **File Organization**

### **Source Location**
All runtime dependencies are stored in:
```
products/clients/windows/binaries/
```

### **Development Location**
During development, dependencies are copied to:
```
products/clients/windows/target/debug/     # Debug builds
products/clients/windows/target/release/   # Release builds
```

### **Production Location**
In production releases, all dependencies are packaged together with the executable.

---

## 🚀 **Automatic Dependency Management**

### **📦 Build Scripts**

#### **`fast_build.ps1`**
- Automatically copies dependencies after building
- Supports both debug and release modes
- Shows build time and executable size

```powershell
# Fast build with automatic dependency copying
.\scripts\fast_build.ps1

# Release build with dependencies
.\scripts\fast_build.ps1 -Release
```

#### **`run_app.ps1`**
- Checks for missing dependencies before running
- Automatically copies dependencies if needed
- Supports both debug and release modes

```powershell
# Run with automatic dependency checking
.\scripts\run_app.ps1

# Run release version
.\scripts\run_app.ps1 -Release
```

#### **`copy_runtime_deps.ps1`**
- Manual dependency copying for troubleshooting
- Shows detailed information about copied files
- Useful for debugging dependency issues

```powershell
# Copy to debug target
.\scripts\copy_runtime_deps.ps1

# Copy to release target
.\scripts\copy_runtime_deps.ps1 -Target release

# Show help
.\scripts\copy_runtime_deps.ps1 -Help
```

#### **`release.ps1`**
- Creates production release package
- Includes all runtime dependencies in distribution
- Runs security audits and dependency analysis

```powershell
# Create production release
.\scripts\release.ps1 -Version 1.0.0
```

---

## 🔧 **Development Workflow**

### **📋 Step-by-Step Process**

1. **Build the Project**
   ```powershell
   cd products/clients/windows
   .\scripts\fast_build.ps1
   ```

2. **Run the Application**
   ```powershell
   .\scripts\run_app.ps1
   ```

3. **Test the Application**
   - The application should start without missing DLL errors
   - All VPN functionality should work properly
   - Check system tray for the application icon

### **🔄 Alternative Workflow**

1. **Manual Build**
   ```powershell
   cargo build
   ```

2. **Copy Dependencies Manually**
   ```powershell
   .\scripts\copy_runtime_deps.ps1
   ```

3. **Run Directly**
   ```powershell
   .\target\debug\viworks-desktop.exe
   ```

---

## 🚨 **Troubleshooting**

### **❌ "Missing DLL" Errors**

If you encounter missing DLL errors:

1. **Check if dependencies are copied**:
   ```powershell
   dir target\debug\*.dll
   dir target\debug\*.exe
   ```

2. **Copy dependencies manually**:
   ```powershell
   .\scripts\copy_runtime_deps.ps1
   ```

3. **Verify binaries directory**:
   ```powershell
   dir binaries\
   ```

### **❌ "Application won't start"**

1. **Check executable location**:
   ```powershell
   dir target\debug\viworks-desktop.exe
   ```

2. **Run with dependency checking**:
   ```powershell
   .\scripts\run_app.ps1
   ```

3. **Check for missing files**:
   ```powershell
   $required = @("fwknop.exe", "openvpn.exe", "stunnel.exe", "libcrypto-3-x64.dll", "libssl-3-x64.dll")
   foreach ($file in $required) {
       if (Test-Path "target\debug\$file") {
           Write-Host "✓ $file" -ForegroundColor Green
       } else {
           Write-Host "✗ $file" -ForegroundColor Red
       }
   }
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

## 📦 **Production Deployment**

### **🏭 Release Package Structure**

The release script creates a complete distribution package:

```
ViWorkS-Client-v1.0.0-Windows-x64/
├── viworks-desktop.exe          # Main executable
├── fwknop.exe                   # SPA tool
├── openvpn.exe                  # OpenVPN client
├── stunnel.exe                  # SSL tunneling
├── libcrypto-3-x64.dll          # OpenSSL crypto
├── libssl-3-x64.dll             # OpenSSL SSL
├── libgcc_s_seh-1.dll           # GCC runtime
├── libssp-0.dll                 # Stack protection
├── ca-certs.pem                 # CA certificates
├── openssl.cnf                  # OpenSSL config
├── stunnel.conf                 # Stunnel config
├── README.txt                   # Installation guide
├── install.ps1                  # Installer script
└── start-viworks.bat           # Quick start script
```

### **📋 Installation Options**

#### **Portable Installation**
1. Extract all files to a folder
2. Run `viworks-desktop.exe` directly
3. All dependencies are in the same directory

#### **Full Installation**
1. Extract all files to a folder
2. Run `install.ps1` as administrator
3. Creates shortcuts and installs to Program Files

---

## 🔍 **Verification**

### **✅ Success Indicators**

The client is running correctly when:

1. **No missing DLL errors** appear
2. **Application starts** and shows in system tray
3. **VPN connection** can be established
4. **Security dashboard** displays correctly
5. **All features** work as expected

### **📊 Dependency Check Script**

You can verify all dependencies are present:

```powershell
$target_dir = "target\debug"
$required_files = @(
    "viworks-desktop.exe",
    "fwknop.exe",
    "openvpn.exe", 
    "stunnel.exe",
    "libcrypto-3-x64.dll",
    "libssl-3-x64.dll",
    "libgcc_s_seh-1.dll",
    "libssp-0.dll",
    "ca-certs.pem",
    "openssl.cnf",
    "stunnel.conf"
)

Write-Host "Checking runtime dependencies in $target_dir..." -ForegroundColor Cyan
$missing = @()

foreach ($file in $required_files) {
    $path = Join-Path $target_dir $file
    if (Test-Path $path) {
        $size = [math]::Round((Get-Item $path).Length / 1KB, 1)
        Write-Host "✓ $file ($size KB)" -ForegroundColor Green
    } else {
        Write-Host "✗ $file (MISSING)" -ForegroundColor Red
        $missing += $file
    }
}

if ($missing.Count -eq 0) {
    Write-Host "All dependencies present!" -ForegroundColor Green
} else {
    Write-Host "Missing files: $($missing -join ', ')" -ForegroundColor Red
    Write-Host "Run: .\scripts\copy_runtime_deps.ps1" -ForegroundColor Yellow
}
```

---

## 🎯 **Best Practices**

### **🔧 Development**
- **Always use build scripts**: They handle dependencies automatically
- **Test after builds**: Verify the application runs correctly
- **Check dependencies**: Use the verification script regularly

### **🏭 Production**
- **Use release script**: Creates complete distribution package
- **Test distribution**: Verify the package works on clean systems
- **Document requirements**: Include installation instructions

### **🔄 Maintenance**
- **Update dependencies**: Keep runtime files up to date
- **Version tracking**: Document dependency versions
- **Security updates**: Regularly update security-related files

---

## 📝 **Summary**

The ViWorkS Windows client runtime dependency management system ensures:

- **✅ Automatic handling** during development and production
- **✅ Complete distribution** packages with all required files
- **✅ Easy troubleshooting** with dedicated scripts
- **✅ Consistent behavior** across different environments
- **✅ Professional deployment** with proper packaging

**The system is designed to make development and deployment as smooth as possible while ensuring the client always has the required dependencies to function correctly.**

---

**For questions or issues with runtime dependencies, refer to the troubleshooting section or use the provided verification scripts.**
