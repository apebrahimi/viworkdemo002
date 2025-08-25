# 🤖 ViWorkS Complete Platform - Cursor AI Reference Guide

## 📋 **PROJECT OVERVIEW**

**Project**: ViWorkS Complete Platform
**Goal**: Enterprise-grade secure remote access platform with multi-platform clients, mobile authentication, and centralized administration
**Architecture**: Zero-knowledge, distributed platform with stealth access and comprehensive monitoring

---

## 📚 **KEY FILES TO REFERENCE**

### **📖 Master Documents**
- `PLATFORM_MASTER_PLAN.md` - Complete platform implementation plan
- `PLATFORM_PROGRESS_TRACKER.md` - Current progress and next actions
- `admin-panel-plan` - Admin panel requirements
- `android-mobile-application` - Mobile app specifications
- `viworks-website` - Website requirements

### **🔧 Technical Documents**
- `ADMIN_PANEL_ARCHITECTURE_PLAN.md` - Admin panel design
- `CLIENT_INTEGRATION_PROTOCOL.md` - Client communication
- `BACKEND_HOSTING_RECOMMENDATIONS.md` - Deployment options

---

## 🚀 **HOW TO CONTINUE THE PROJECT**

### **Step 1: Check Current Status**
1. Read `PLATFORM_PROGRESS_TRACKER.md` to see current phase
2. Check `PLATFORM_MASTER_PLAN.md` for detailed phase information
3. Identify next immediate actions

### **Step 2: Execute Next Tasks**
1. Follow the specific tasks listed in the current phase
2. Reference technical documents for implementation details
3. Update progress as you complete tasks

### **Step 3: Update Progress**
1. Update `PLATFORM_PROGRESS_TRACKER.md` with completed tasks
2. Mark tasks with ✅ when done
3. Update timestamps and progress percentages

---

## 🎯 **CURRENT STATUS (as of 2025-08-22)**

**Phase**: 2 of 8 (Admin Panel Development)
**Progress**: 10%
**Next Action**: Continue admin panel backend development

### **Immediate Next Steps**
1. Continue admin panel backend development
2. Set up Rust project with dependencies
3. Initialize Next.js frontend project
4. Configure development environment

---

## 🛠️ **TECHNOLOGY STACK BY COMPONENT**

### **🖥️ Desktop Clients (Windows/Linux/macOS)**
```toml
# Rust + egui for all desktop clients
[dependencies]
eframe = "0.24"
egui = "0.24"
tokio = { version = "1.0", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
reqwest = { version = "0.11", features = ["json"] }
```

### **📱 Mobile Apps**
```kotlin
// Android (Kotlin)
implementation 'androidx.core:core-ktx:1.10.0'
implementation 'com.google.firebase:firebase-messaging:23.2.0'
implementation 'com.google.android.gms:play-services-integrity:18.0.1'
```

```swift
// iOS (Swift)
import Firebase
import DeviceCheck
import CoreLocation
```

### **🌐 Web Applications**
```toml
# Admin Panel Backend (Rust)
actix-web = "4.4"
tokio = { version = "1.0", features = ["full"] }
sqlx = { version = "0.7", features = ["runtime-tokio-rustls", "postgres"] }
redis = { version = "0.23", features = ["tokio-comp"] }
```

```json
// Admin Panel Frontend (Next.js)
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.3.0",
  "@headlessui/react": "^1.7.0"
}
```

### **🔧 Backend Services**
```toml
# All backend services (Rust)
actix-web = "4.4"
tokio = { version = "1.0", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
jsonwebtoken = "9.2"
argon2 = "0.5"
ring = "0.17"
```

---

## 📁 **PROJECT STRUCTURE**

```
viworks-platform/
├── clients/
│   ├── windows/              # Windows client (completed)
│   │   ├── src/
│   │   ├── Cargo.toml
│   │   └── README.md
│   ├── linux/               # Linux client
│   │   ├── src/
│   │   ├── Cargo.toml
│   │   └── README.md
│   └── macos/               # macOS client
│       ├── src/
│       ├── Cargo.toml
│       └── README.md
├── mobile/
│   ├── android/             # Android mobile app
│   │   ├── app/
│   │   ├── build.gradle
│   │   └── README.md
│   └── ios/                 # iOS mobile app
│       ├── ViWorksMobile/
│       ├── Podfile
│       └── README.md
├── web/
│   ├── admin-panel/         # Admin panel
│   │   ├── backend/
│   │   ├── frontend/
│   │   └── README.md
│   └── website/             # Marketing website
│       ├── src/
│       ├── package.json
│       └── README.md
├── services/
│   ├── cert-service/        # CERT service
│   ├── admin-service/       # Admin service
│   ├── push-service/        # Push notifications
│   ├── auth-service/        # Authentication
│   └── config-service/      # Configuration management
├── shared/                  # Shared libraries
├── docs/                    # Documentation
├── docker/                  # Containerization
├── PLATFORM_MASTER_PLAN.md  # Master implementation plan
├── PLATFORM_PROGRESS_TRACKER.md # Progress tracking
└── PLATFORM_CURSOR_GUIDE.md # This file
```

---

## 🔐 **SECURITY REQUIREMENTS**

### **Zero-Knowledge Architecture**
- Client data encrypted before transmission
- Server never sees raw client data
- Digital signatures for all communications
- Certificate-based authentication

### **Mobile Authentication Security**
- Hardware-backed keys (Android KeyStore, iOS Secure Enclave)
- Device integrity checks (Play Integrity API, DeviceCheck)
- Signal collection (MCC/MNC, GPS, IP/ASN)
- Anti-tamper protection

### **Script Execution Security**
- Script validation and sandboxing
- Digital signature verification
- Resource limits and timeouts
- Rollback capabilities

### **Communication Security**
- mTLS for all connections
- Rate limiting and DDoS protection
- Input validation and sanitization
- Comprehensive audit logging

---

## 📝 **COMMON COMMANDS BY COMPONENT**

### **Desktop Clients (Rust)**
```bash
# Initialize project
cargo init --name viworks-client

# Add dependencies
cargo add eframe egui tokio serde reqwest

# Run development
cargo run

# Build for production
cargo build --release

# Cross-compile for different platforms
cargo build --target x86_64-unknown-linux-gnu
cargo build --target x86_64-apple-darwin
```

### **Mobile Apps**
```bash
# Android
./gradlew assembleDebug
./gradlew assembleRelease

# iOS
xcodebuild -workspace ViWorksMobile.xcworkspace -scheme ViWorksMobile -configuration Release
```

### **Web Applications**
```bash
# Admin Panel Backend
cargo run

# Admin Panel Frontend
npm run dev
npm run build

# Website
npm run dev
npm run build
```

### **Backend Services**
```bash
# All services
cargo run

# Docker deployment
docker-compose up -d
```

---

## 🎯 **SUCCESS CRITERIA BY PHASE**

### **Phase 2: Admin Panel Success Criteria**
- [ ] Admin panel backend compiles and runs
- [ ] Admin panel frontend builds successfully
- [ ] Database connection established
- [ ] Integration with Windows client working
- [ ] Basic API endpoints responding

### **Phase 3-4: Desktop Clients Success Criteria**
- [ ] Linux/macOS clients compile and run
- [ ] Cross-platform compatibility achieved
- [ ] Security features implemented
- [ ] Installation packages created

### **Phase 5-6: Mobile Apps Success Criteria**
- [ ] Android/iOS apps build successfully
- [ ] Push notifications working
- [ ] Signal collection functional
- [ ] Device integrity checks working
- [ ] App store packages ready

### **Phase 7: Website Success Criteria**
- [ ] Website builds and deploys
- [ ] SEO optimization complete
- [ ] Lead capture system working
- [ ] Content management functional

### **Phase 8: Backend Services Success Criteria**
- [ ] All services deploy successfully
- [ ] API documentation complete
- [ ] Integration testing passed
- [ ] Monitoring and alerting working

---

## 📞 **WHEN TO REFERENCE OTHER DOCUMENTS**

### **For Admin Panel Development**
- `ADMIN_PANEL_ARCHITECTURE_PLAN.md`
- `admin-panel-plan`

### **For Mobile App Development**
- `android-mobile-application`
- Android/iOS development documentation

### **For Website Development**
- `viworks-website`
- Next.js documentation

### **For Client Integration**
- `CLIENT_INTEGRATION_PROTOCOL.md`
- Existing Windows client code

### **For Deployment**
- `BACKEND_HOSTING_RECOMMENDATIONS.md`
- Docker documentation

---

## 🚨 **IMPORTANT NOTES**

1. **Security First**: All implementations must prioritize security
2. **Zero-Knowledge**: Client data must be encrypted before transmission
3. **Cross-Platform**: Ensure compatibility across all target platforms
4. **Mobile Integration**: Follow mobile app specifications exactly
5. **Real-time**: Implement WebSocket for live updates where needed
6. **Audit Logging**: Log all operations for compliance
7. **Code Sharing**: Maximize code reuse between similar components

---

## 🎯 **ARCHITECTURE DECISIONS**

### **CERT Service vs Admin Service**
- **Recommendation**: Use CERT Service for dynamic configuration management
- **Reason**: Better separation of concerns, dedicated security validation
- **Integration**: Admin Service manages policies, CERT Service generates configs

### **Mobile App Architecture**
- **Android**: Kotlin with Play Integrity API
- **iOS**: Swift with DeviceCheck API
- **Shared**: Common verification logic and API contracts

### **Desktop Client Strategy**
- **Code Sharing**: Maximum reuse between Windows/Linux/macOS
- **Platform-Specific**: Only security and system integration differences
- **Deployment**: Platform-specific packages (deb/rpm/dmg)

---

**Ready to continue with Phase 2 implementation! 🚀**

**Remember**: Always update `PLATFORM_PROGRESS_TRACKER.md` when completing tasks!
