# 📱 ViWorkS Mobile Applications

## 📋 **Overview**

The ViWorkS Mobile Applications provide multi-factor authentication and verification for the ViWorkS platform. They support both Android and iOS platforms with hardware-backed security and device integrity verification.

---

## 🗂️ **Directory Structure**

```
mobile/
├── android/              # Android application (Kotlin)
│   ├── app/             # Android app source
│   ├── build.gradle     # Build configuration
│   └── README.md        # Android-specific documentation
├── ios/                 # iOS application (Swift)
│   ├── ViWorksMobile/   # iOS app source
│   ├── Podfile          # CocoaPods dependencies
│   └── README.md        # iOS-specific documentation
└── README.md            # This file
```

---

## 🎯 **Mobile App Features**

### **🔐 Authentication & Verification**
- **Multi-Factor Authentication**: Hardware-backed security
- **Device Integrity**: Platform-specific integrity checks
- **Signal Collection**: GPS, IP, ASN, MCC/MNC data
- **Push Notifications**: Real-time verification requests

### **🛡️ Security Features**
- **Hardware-Backed Keys**: Android KeyStore, iOS Secure Enclave
- **Device Integrity**: Play Integrity API, DeviceCheck API
- **Anti-Tamper Protection**: App integrity verification
- **Secure Communication**: Encrypted API communication

### **📱 User Experience**
- **Push Landing**: Instant verification interface
- **Code Display**: Verification code presentation
- **Settings Management**: Device and app configuration
- **Error Handling**: User-friendly error messages

---

## 🛠️ **Technology Stack**

### **🤖 Android (Kotlin)**
- **Language**: Kotlin
- **Framework**: Android SDK
- **Security**: Android KeyStore, Play Integrity API
- **UI**: Material Design 3
- **Dependencies**: Firebase, Google Play Services

### **🍎 iOS (Swift)**
- **Language**: Swift
- **Framework**: SwiftUI, UIKit
- **Security**: Secure Enclave, DeviceCheck API
- **UI**: SwiftUI with iOS design guidelines
- **Dependencies**: Firebase, Core Location

### **🔥 Firebase Integration**    I prefere supabase   
- **Push Notifications**: FCM for Android, APNS for iOS
- **Analytics**: Usage and performance tracking
- **Crashlytics**: Error reporting and monitoring
- **Remote Config**: Dynamic configuration

---

## 🚀 **Development Status**

### **⏳ Android App - PLANNED**
- **Status**: Development planned
- **Features**: Signal collection, device integrity
- **Security**: Hardware-backed keys, anti-tamper
- **Distribution**: Google Play Store

### **⏳ iOS App - PLANNED**
- **Status**: Development planned
- **Features**: Signal collection, device integrity
- **Security**: Secure Enclave, device checks
- **Distribution**: App Store

---

## 🔧 **Development Commands**

### **🤖 Android Development**
```bash
# Navigate to Android app
cd mobile/android

# Build debug version
./gradlew assembleDebug

# Build release version
./gradlew assembleRelease

# Run tests
./gradlew test

# Install on device
./gradlew installDebug
```

### **🍎 iOS Development**
```bash
# Navigate to iOS app
cd mobile/ios

# Install dependencies
pod install

# Open in Xcode
open ViWorksMobile.xcworkspace

# Build and run
xcodebuild -workspace ViWorksMobile.xcworkspace -scheme ViWorksMobile
```

---

## 🔐 **Security Architecture**

### **🔒 Authentication Flow**
```
1. User receives push notification
2. App verifies device integrity
3. Collects device signals (GPS, IP, etc.)
4. Sends encrypted verification data
5. Receives verification result
6. Displays verification code
```

### **🛡️ Security Measures**
- **Hardware-Backed Keys**: Secure key storage
- **Device Integrity**: Platform-specific verification
- **Signal Collection**: Location and network data
- **Encrypted Communication**: TLS 1.3 with pinning
- **Anti-Tamper**: App integrity verification

---

## 📊 **Platform-Specific Features**

### **🤖 Android Features**
- **Play Integrity API**: Device and app integrity
- **Android KeyStore**: Hardware-backed key storage
- **Location Services**: GPS and network location
- **Background Processing**: Push notification handling
- **Material Design**: Modern UI components

### **🍎 iOS Features**
- **DeviceCheck API**: Device integrity verification
- **Secure Enclave**: Hardware-backed security
- **Core Location**: Location services
- **Background App Refresh**: Push notification handling
- **SwiftUI**: Modern declarative UI

---

## 🚀 **Deployment**

### **🤖 Android Deployment**
```bash
# Build release APK
./gradlew assembleRelease

# Build App Bundle
./gradlew bundleRelease

# Sign with release key
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 app-release-unsigned.apk

# Optimize APK
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

### **🍎 iOS Deployment**
```bash
# Archive for App Store
xcodebuild -workspace ViWorksMobile.xcworkspace -scheme ViWorksMobile -configuration Release archive

# Export for distribution
xcodebuild -exportArchive -archivePath ViWorksMobile.xcarchive -exportPath ./build -exportOptionsPlist exportOptions.plist
```

---

## 📝 **Documentation**

### **📚 Mobile Documentation**
- **Android**: `android/README.md`
- **iOS**: `ios/README.md`
- **Specifications**: `../docs/mobile/android-mobile-application`

### **🔧 Development Guides**
- **Setup**: Platform-specific setup instructions
- **Building**: Build and packaging guides
- **Testing**: Testing strategies and procedures
- **Deployment**: Store submission and distribution

---

## 🎯 **Next Steps**

### **🔄 Immediate Actions**
1. **Android App Development**
   - Set up Android project structure
   - Implement signal collection
   - Add device integrity checks
   - Create push notification handling

2. **iOS App Development**
   - Set up iOS project structure
   - Implement signal collection
   - Add device integrity checks
   - Create push notification handling

3. **Cross-Platform Testing**
   - Ensure consistent behavior
   - Platform-specific testing
   - Security validation

---

**The ViWorkS Mobile Applications provide secure multi-factor authentication with hardware-backed security and device integrity verification.**
