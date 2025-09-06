# Simplified ViWorkS Authentication Flow - MVP Implementation

## Goal
Get the basic Desktop + Mobile authentication flow working end-to-end for testing.

## Simplified Flow

### 1. User Registration (One-time setup)
- User opens Android app
- Enters username/password
- App collects device info (location, IP, ASN, device fingerprint)
- Sends registration to backend
- Backend stores device info and marks as registered

### 2. Desktop Login Flow
- User opens macOS client
- Client does basic system checks (no active tunnel, clock skew, etc.)
- User enters username/password
- Client sends credentials + system check results to backend
- Backend validates credentials
- If valid: Client shows 2FA page
- If invalid: Show error message

### 3. 2FA Flow
- User clicks "Request 2FA" button
- Client sends 2FA request to backend
- Backend generates 6-digit code
- Backend sends push notification to Android app
- User opens Android app
- App shows the 6-digit code
- User enters code in macOS client
- Client sends code to backend for validation
- If valid: Backend sends connection configs (Stunnel, PortKnock, OpenVPN)
- Client stores configs in RAM and uses them to connect

## Implementation Plan

### Phase 1: Backend API Updates (Priority: HIGH)

#### 1.1 Device Registration Endpoint
**File**: `digital ocean docker/backend/src/api/auth.rs`

```rust
// New endpoint for device registration
pub async fn register_mobile_device(req: web::Json<DeviceRegistrationRequest>) -> Result<HttpResponse> {
    // 1. Validate user credentials
    // 2. Collect device info (location, IP, ASN, device fingerprint)
    // 3. Store device info in database
    // 4. Mark device as registered
    // 5. Return success response
}

#[derive(Deserialize)]
pub struct DeviceRegistrationRequest {
    pub username: String,
    pub password: String,
    pub device_info: DeviceInfo,
}

#[derive(Deserialize)]
pub struct DeviceInfo {
    pub device_id: String,
    pub location: LocationInfo,
    pub network_info: NetworkInfo,
    pub device_fingerprint: String,
}

#[derive(Deserialize)]
pub struct LocationInfo {
    pub latitude: f64,
    pub longitude: f64,
    pub country: String,
}

#[derive(Deserialize)]
pub struct NetworkInfo {
    pub ip_address: String,
    pub asn: String,
    pub carrier: Option<String>,
}
```

#### 1.2 2FA Code Generation
```rust
// Enhanced 2FA request endpoint
pub async fn request_2fa_code(req: web::Json<TwoFactorRequest>) -> Result<HttpResponse> {
    // 1. Validate user credentials
    // 2. Check if device is registered
    // 3. Generate 6-digit code
    // 4. Store code in Redis with 5-minute TTL
    // 5. Send push notification to Android app
    // 6. Return success response
}

#[derive(Deserialize)]
pub struct TwoFactorRequest {
    pub username: String,
    pub device_id: String,
}
```

#### 1.3 2FA Code Validation
```rust
// Enhanced 2FA validation endpoint
pub async fn validate_2fa_code(req: web::Json<TwoFactorValidation>) -> Result<HttpResponse> {
    // 1. Validate 6-digit code
    // 2. Check TTL
    // 3. If valid: Generate connection configs
    // 4. Return configs to client
}

#[derive(Deserialize)]
pub struct TwoFactorValidation {
    pub username: String,
    pub code: String,
}

#[derive(Serialize)]
pub struct ConnectionConfigs {
    pub stunnel_config: String,
    pub portknock_config: String,
    pub openvpn_config: String,
}
```

### Phase 2: macOS Client Updates (Priority: HIGH)

#### 2.1 System Checks
**File**: `macos/crates/core/src/validation.rs`

```rust
pub struct SystemValidator;

impl SystemValidator {
    pub async fn run_checks() -> Result<SystemCheckResult> {
        // 1. Check for active tunnel
        // 2. Check clock skew
        // 3. Check network connectivity
        // 4. Return results
    }
}

#[derive(Serialize)]
pub struct SystemCheckResult {
    pub no_active_tunnel: bool,
    pub clock_skew_ok: bool,
    pub network_ok: bool,
    pub checks_passed: bool,
}
```

#### 2.2 Login Flow Updates
**File**: `macos/crates/auth_api/src/client.rs`

```rust
impl AuthClient {
    pub async fn login_with_checks(&self, request: LoginRequest, checks: SystemCheckResult) -> Result<LoginResponse> {
        // 1. Send login request with system checks
        // 2. Handle 2FA requirement
        // 3. Return appropriate response
    }
    
    pub async fn request_2fa(&self, username: &str, device_id: &str) -> Result<String> {
        // 1. Send 2FA request
        // 2. Return success message
    }
    
    pub async fn validate_2fa(&self, username: &str, code: &str) -> Result<ConnectionConfigs> {
        // 1. Send 2FA code for validation
        // 2. Return connection configs on success
    }
}
```

#### 2.3 UI Updates
**File**: `macos/apps/desktop_egui/src/ui/login_panel.rs`

```rust
// Add 2FA input field
// Add "Request 2FA" button
// Add system check status display
// Update state machine for 2FA flow
```

### Phase 3: Android App Updates (Priority: HIGH)

#### 3.1 Device Registration
**File**: `android/app/src/main/java/com/viworks/mobile/service/AuthService.kt`

```kotlin
class AuthService {
    suspend fun registerDevice(username: String, password: String): Result<DeviceRegistrationResponse> {
        // 1. Collect device info
        // 2. Send registration request to backend
        // 3. Handle response
    }
    
    private fun collectDeviceInfo(): DeviceInfo {
        // 1. Get location
        // 2. Get IP address
        // 3. Get ASN info
        // 4. Get device fingerprint
        // 5. Return device info
    }
}
```

#### 3.2 2FA Code Display
**File**: `android/app/src/main/java/com/viworks/mobile/ui/HomeFragment.kt`

```kotlin
// Add 2FA code display screen
// Add countdown timer
// Add notification handling
// Add code display logic
```

### Phase 4: Push Notifications (Priority: MEDIUM)

#### 4.1 Backend Push Service
**File**: `digital ocean docker/backend/src/services/push.rs` (new file)

```rust
pub struct PushService {
    fcm_client: FcmClient,
}

impl PushService {
    pub async fn send_2fa_notification(&self, device_token: &str, code: &str) -> Result<()> {
        // 1. Create FCM message
        // 2. Send to Android device
        // 3. Handle response
    }
}
```

#### 4.2 Android FCM Integration
**File**: `android/app/src/main/java/com/viworks/mobile/service/ViWorksFCMService.kt`

```kotlin
class ViWorksFCMService : FirebaseMessagingService() {
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        // 1. Handle 2FA notification
        // 2. Display code to user
        // 3. Update UI
    }
}
```

## Implementation Steps

### Step 1: Backend API Implementation
1. Add device registration endpoint
2. Enhance 2FA request endpoint
3. Enhance 2FA validation endpoint
4. Add connection config generation
5. Test endpoints with Postman/curl

### Step 2: macOS Client Implementation
1. Add system checks
2. Update login flow
3. Add 2FA UI
4. Add connection config handling
5. Test with backend

### Step 3: Android App Implementation
1. Add device registration flow
2. Add 2FA code display
3. Add push notification handling
4. Test with backend

### Step 4: Integration Testing
1. Test device registration flow
2. Test login + 2FA flow
3. Test connection config delivery
4. Test end-to-end flow

## Testing Strategy

### Manual Testing Steps
1. **Device Registration**:
   - Open Android app
   - Enter username/password
   - Verify device registration success

2. **Desktop Login**:
   - Open macOS client
   - Enter username/password
   - Verify system checks pass
   - Verify 2FA page appears

3. **2FA Flow**:
   - Click "Request 2FA" in macOS client
   - Verify Android app receives notification
   - Verify code is displayed in Android app
   - Enter code in macOS client
   - Verify connection configs are received

4. **Connection**:
   - Verify configs are stored in RAM
   - Verify connection to gateway works

### Error Scenarios to Test
- Invalid credentials
- Unregistered device
- Expired 2FA code
- Wrong 2FA code
- Network failures
- System check failures

## Success Criteria

### Functional Requirements
- [ ] Device registration works
- [ ] System checks work
- [ ] Login validation works
- [ ] 2FA code generation works
- [ ] Push notifications work
- [ ] 2FA code validation works
- [ ] Connection configs are delivered
- [ ] Connection to gateway works

### Non-Functional Requirements
- [ ] Flow completes within 60 seconds
- [ ] No sensitive data in logs
- [ ] Proper error handling
- [ ] User-friendly error messages

## Timeline

### Week 1: Backend Implementation
- [ ] Device registration endpoint
- [ ] 2FA request endpoint
- [ ] 2FA validation endpoint
- [ ] Connection config generation
- [ ] Basic testing

### Week 2: Client Implementation
- [ ] macOS system checks
- [ ] macOS 2FA UI
- [ ] Android device registration
- [ ] Android 2FA display
- [ ] Basic testing

### Week 3: Integration
- [ ] Push notifications
- [ ] End-to-end testing
- [ ] Error handling
- [ ] Bug fixes

## Risk Mitigation

### High Risk
- Push notification delivery
- 2FA code synchronization
- Connection config security

### Mitigation
- Implement fallback mechanisms
- Add comprehensive logging
- Test with real devices
- Implement proper error handling

## Next Steps

1. **Start with Backend**: Implement the three main endpoints
2. **Test with Postman**: Verify API functionality
3. **Update macOS Client**: Add system checks and 2FA flow
4. **Update Android App**: Add device registration and 2FA display
5. **Integration Testing**: Test the complete flow
6. **Bug Fixes**: Address any issues found during testing


This simplified approach will get the core functionality working quickly, allowing us to test the complete flow before adding advanced features like rate limiting, device integrity checks, and comprehensive security measures.

