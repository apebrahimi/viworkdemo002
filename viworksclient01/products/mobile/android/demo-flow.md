# ViWorks Android App Demo Flow

This document demonstrates how the ViWorks Android Authenticator app works in the authentication flow.

## Complete Authentication Flow

1. **Windows Client Login**
   - User opens the ViWorks Windows client
   - User enters username and password
   - Client sends credentials to the backend
   - Backend validates credentials

2. **Backend Initiates 2FA**
   - Backend generates a verification request
   - Backend sends push notification to user's Android device via Firebase
   - Backend waits for user to approve and enter the verification code

3. **Android App Authentication**
   - User receives push notification on Android device
   - User opens the notification, launching the ViWorks Authenticator app
   - App verifies device integrity (hardware-backed keystore, Play Integrity API)
   - App collects device signals (location, network info)
   - App sends signals to backend
   - Backend validates signals and generates a 6-digit verification code
   - App displays the verification code to the user

4. **Completing Authentication**
   - User enters the 6-digit code in the Windows client
   - Windows client sends the code to the backend
   - Backend verifies the code
   - If valid, the Windows client proceeds with connection setup
   - Windows client fetches connection configurations (SPA, STunnel, OpenVPN)
   - Windows client establishes connection to the Linux server

## Demo Simulation

Since we're running in demo mode without a backend, the app simulates this flow:

1. **Start Demo**
   - Launch the Android app
   - Click "Simulate Verification Request" on the home screen

2. **Verification Screen**
   - App shows a simulated verification screen
   - App displays a randomly generated 6-digit code
   - App shows a countdown timer for code expiration

3. **Approval/Denial**
   - Click "Approve" to simulate approving the verification request
   - Or click "Deny" to simulate denying the request

## Integration with Admin Panel

In production, the app would integrate with your existing admin panel backend:

1. **User Management**
   - Users are defined in the admin panel database
   - Each user can have multiple registered devices

2. **Device Registration**
   - When a user first installs the app, it registers with the admin panel
   - The admin panel stores the device's FCM token for push notifications

3. **Authentication Logs**
   - All authentication attempts are logged in the admin panel
   - Admins can view successful and failed authentication attempts
   - Logs include device signals (location, IP, etc.)

4. **Security Policies**
   - Admins can define security policies in the admin panel
   - Policies include allowed login times, locations, etc.
   - The app enforces these policies during authentication
