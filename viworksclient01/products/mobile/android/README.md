# ViWorkS Android Authenticator

## Overview

The ViWorkS Android Authenticator provides secure multi-factor authentication for the ViWorkS platform. It uses hardware-backed security features and device integrity verification to ensure secure authentication.

## Features

- **Push Notifications**: Receive real-time verification requests
- **Device Integrity**: Verify device security using Play Integrity API
- **Hardware-Backed Security**: Use Android KeyStore for secure key storage
- **Signal Collection**: Collect device signals (GPS, IP, carrier info)
- **Verification Code Display**: Show 6-digit verification codes to users

## Architecture

The application follows a modular architecture:

- **UI Layer**: Activities and fragments for user interaction
- **Service Layer**: Firebase Cloud Messaging and API services
- **Security Layer**: Device integrity checks and secure storage
- **Utility Layer**: Signal collection and preference management

## Setup Instructions

### Prerequisites

- Android Studio Arctic Fox (2020.3.1) or newer
- JDK 11 or newer
- Android SDK 33 or newer
- Firebase project (for push notifications)

### Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Add an Android app to your Firebase project
3. Download the `google-services.json` file
4. Place the file in the `app/` directory

### Build and Run

```bash
# Navigate to the Android app directory
cd viworksclient01/products/mobile/android

# Make the build script executable
chmod +x build-and-install.sh

# Run the build script
./build-and-install.sh
```

## Demo Mode

The app is currently configured to run in demo mode, which allows you to test the verification flow without a backend:

1. Launch the app on an emulator or device
2. Click "Check Security" to simulate device integrity checks
3. Click "Simulate Verification Request" to see the verification flow
4. View the randomly generated 6-digit code
5. Click "Approve" or "Deny" to complete the flow

For more details on the complete authentication flow, see [demo-flow.md](demo-flow.md).

## Integration with ViWorkS Platform

The Android Authenticator integrates with the ViWorkS platform through:

1. **Push Notifications**: Receives authentication requests via Firebase Cloud Messaging
2. **API Communication**: Securely communicates with the ViWorkS backend
3. **Verification Flow**: Displays verification codes that users enter in the desktop client

## Security Features

- **Certificate Pinning**: Prevents man-in-the-middle attacks
- **Hardware-Backed KeyStore**: Secures cryptographic keys
- **Play Integrity API**: Verifies device and app integrity
- **Encrypted Preferences**: Secures stored user data

## Testing

```bash
# Run unit tests
./gradlew test

# Run instrumented tests
./gradlew connectedAndroidTest
```

## Deployment

```bash
# Build release version
./gradlew assembleRelease

# Build App Bundle for Play Store
./gradlew bundleRelease
```

## License

Copyright © 2023 ViWorkS. All rights reserved.
