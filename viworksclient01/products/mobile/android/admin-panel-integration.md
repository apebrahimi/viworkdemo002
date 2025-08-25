# Integrating the Android App with the Admin Panel Backend

This guide explains how to integrate the ViWorks Android Authenticator app with your existing admin panel backend.

## Overview

The Android app needs to communicate with your backend for:

1. Receiving push notifications for verification requests
2. Retrieving verification codes
3. Sending device signals for security validation
4. Approving or denying verification requests

## Required Backend Endpoints

Add these endpoints to your admin panel backend:

### 1. Device Registration

```
POST /api/v1/auth/register-device
```

**Request Body:**
```json
{
  "userId": "user-uuid",
  "deviceId": "device-uuid",
  "fcmToken": "firebase-cloud-messaging-token",
  "deviceInfo": {
    "model": "Pixel 6",
    "os": "Android 13",
    "appVersion": "1.0.0"
  }
}
```

**Response:**
```json
{
  "success": true,
  "deviceRegistered": true
}
```

### 2. Verification Code Request

```
POST /api/v1/auth/verification-code
```

**Request Body:**
```json
{
  "requestId": "verification-request-uuid",
  "deviceId": "device-uuid",
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "networkInfo": {
    "ip": "192.168.1.1",
    "carrier": "T-Mobile",
    "networkType": "WIFI"
  },
  "deviceIntegrityToken": "play-integrity-token"
}
```

**Response:**
```json
{
  "success": true,
  "code": "123456",
  "expiresAt": 1679348400000
}
```

### 3. Verification Confirmation

```
POST /api/v1/auth/confirm-verification
```

**Request Body:**
```json
{
  "requestId": "verification-request-uuid",
  "approved": true,
  "deviceId": "device-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification confirmed"
}
```

## Database Schema Changes

Add these tables to your existing database:

### 1. Device Table

```sql
CREATE TABLE user_devices (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    device_id TEXT NOT NULL,
    fcm_token TEXT NOT NULL,
    device_model TEXT,
    device_os TEXT,
    app_version TEXT,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, device_id)
);
```

### 2. Verification Requests Table

```sql
CREATE TABLE verification_requests (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    device_id TEXT,
    code TEXT,
    expires_at TIMESTAMP,
    approved BOOLEAN,
    completed BOOLEAN DEFAULT FALSE,
    ip_address TEXT,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Firebase Cloud Messaging Integration

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Add Firebase Admin SDK to your backend:

```bash
# Node.js
npm install firebase-admin

# Java
implementation 'com.google.firebase:firebase-admin:9.1.1'

# Python
pip install firebase-admin
```

3. Initialize Firebase Admin in your backend:

```javascript
// Node.js example
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

4. Send push notifications when verification is needed:

```javascript
// Node.js example
async function sendVerificationRequest(userId, requestId) {
  // Get user's device FCM token from database
  const device = await db.getUserDevice(userId);
  
  if (!device || !device.fcmToken) {
    throw new Error('No registered device found');
  }
  
  const message = {
    token: device.fcmToken,
    data: {
      requestId: requestId,
      userId: userId,
      type: 'verification_request'
    },
    notification: {
      title: 'Authentication Request',
      body: 'Tap to verify your login attempt'
    },
    android: {
      priority: 'high'
    }
  };
  
  return admin.messaging().send(message);
}
```

## Android App Configuration

Update the Android app to point to your admin panel backend:

1. Edit `ApiService.kt`:

```kotlin
companion object {
    private const val TAG = "ApiService"
    private const val BASE_URL = "https://your-admin-panel-url.com" // Change to your admin panel URL
    private const val VERIFICATION_ENDPOINT = "/api/v1/auth/verification-code"
    private const val SIGNAL_ENDPOINT = "/api/v1/auth/signals"
    
    // Update certificate pinning for your admin panel
    private const val HOSTNAME = "your-admin-panel-url.com" 
    private val CERTIFICATE_PINS = arrayOf(
        "sha256/your-admin-panel-certificate-hash=",
        "sha256/your-backup-certificate-hash="
    )
}
```

2. Update `google-services.json` with your actual Firebase project details

## Testing the Integration

1. Set up a test user in your admin panel
2. Register a test device using the API
3. Trigger a verification request from the Windows client
4. Confirm that the Android app receives the push notification
5. Verify that the code is displayed and can be used to authenticate

## Security Considerations

1. **Certificate Pinning**: Ensure the app only communicates with your trusted backend
2. **Token Security**: Store FCM tokens securely in your database
3. **Request Validation**: Validate all incoming requests with proper authentication
4. **Rate Limiting**: Implement rate limiting to prevent brute force attacks
5. **Logging**: Log all authentication attempts for audit purposes
