# ViWorkS DigitalOcean Setup Guide

## 🌐 Complete System Overview

Your ViWorkS platform is now fully deployed on DigitalOcean with the following components:

- **🌐 Frontend**: https://clownfish-app-hylwo.ondigitalocean.app
- **🔧 Backend**: https://walrus-app-5hly8.ondigitalocean.app  
- **💻 macOS Client**: Configured to connect to DigitalOcean backend
- **📱 Android App**: Configured to connect to DigitalOcean backend

## 🔧 Configuration Summary

### Backend Configuration
- **URL**: https://walrus-app-5hly8.ondigitalocean.app
- **CORS**: Configured to allow frontend domain
- **Environment**: Production

### Frontend Configuration  
- **URL**: https://clownfish-app-hylwo.ondigitalocean.app
- **API URL**: https://walrus-app-5hly8.ondigitalocean.app
- **WebSocket URL**: wss://walrus-app-5hly8.ondigitalocean.app

### macOS Client Configuration
- **Backend URL**: https://walrus-app-5hly8.ondigitalocean.app
- **Auth API URL**: https://walrus-app-5hly8.ondigitalocean.app
- **Status**: ✅ Ready to connect

### Android App Configuration
- **Environment**: PRODUCTION
- **API Base URL**: https://walrus-app-5hly8.ondigitalocean.app
- **Status**: ✅ Ready to connect

## 🔑 Demo Credentials

Use these credentials for testing all components:

- **Username**: `admin`
- **Password**: `admin123`

- **Username**: `keyvan`  
- **Password**: `demo123`

## 📱 2FA Authentication Flow

The complete authentication flow works as follows:

### 1. macOS Client Login
1. User opens macOS client
2. Enters username and password
3. Client sends login request to DigitalOcean backend
4. Backend validates credentials and requests 2FA

### 2. Android App 2FA
1. Backend sends 2FA request to Android app
2. Android app receives notification
3. User approves the login request on Android app
4. Android app sends approval to backend
5. Backend generates session token

### 3. VPN Connection
1. macOS client receives session token
2. Client establishes VPN connection using session token
3. User is now connected to ViWorkS VPN

## 🚀 Setup Instructions

### 1. Build and Install Android App

```bash
cd "/Users/abolfazl/Desktop/all current projects /viworks /source code/viworksclient01/products/mobile/android"

# Build the app
./gradlew assembleDebug

# Install on connected device
adb install app/build/outputs/apk/debug/app-debug.apk
```

### 2. Configure Android App

1. Open the ViWorkS Android app
2. Go to Settings (gear icon)
3. Tap "Set Production" button
4. Verify the API URL shows: `https://walrus-app-5hly8.ondigitalocean.app`
5. The app is now configured for DigitalOcean

### 3. Test macOS Client

```bash
cd "/Users/abolfazl/Desktop/all current projects /viworks /source code/viworksclient01/products/clients/macos"

# Run the client
./target/release/viworks-desktop
```

### 4. Test Complete Flow

1. **Start Android App**: Ensure it's running and configured for production
2. **Start macOS Client**: Run the desktop client
3. **Login**: Use demo credentials (admin/admin123)
4. **2FA**: Approve the login request on Android app
5. **Connection**: Verify VPN connection is established

## 🧪 Testing Scripts

### Test Backend Connectivity
```bash
cd "/Users/abolfazl/Desktop/all current projects /viworks /source code/viworksclient01/products/mobile/android"
./test-android-digitalocean.sh
```

### Test macOS Client
```bash
cd "/Users/abolfazl/Desktop/all current projects /viworks /source code/viworksclient01/products/clients/macos"
./test-digitalocean-connection.sh
```

## 🔍 Troubleshooting

### Common Issues

1. **macOS client stuck on authentication**
   - Ensure Android app is running and configured for production
   - Check that Android app can reach the backend
   - Verify 2FA approval is sent from Android app

2. **Android app not receiving 2FA requests**
   - Check Android app environment is set to PRODUCTION
   - Verify API URL is correct in settings
   - Ensure device has internet connectivity

3. **Backend connection issues**
   - Run connectivity tests using the provided scripts
   - Check DigitalOcean app status in dashboard
   - Verify CORS configuration is correct

### Debug Information

- **Backend Health**: https://walrus-app-5hly8.ondigitalocean.app/health
- **Frontend**: https://clownfish-app-hylwo.ondigitalocean.app
- **Android App Logs**: Check logcat for detailed error messages
- **macOS Client Logs**: Check console output for connection details

## 🎯 Success Indicators

✅ **Complete Setup**: All components configured for DigitalOcean
✅ **Backend Reachable**: Health endpoint responds
✅ **Frontend Working**: Admin panel accessible
✅ **macOS Client Ready**: Compiled and configured
✅ **Android App Ready**: Built and configured for production
✅ **2FA Flow**: Ready for end-to-end testing

Your ViWorkS platform is now fully operational on DigitalOcean! 🚀
