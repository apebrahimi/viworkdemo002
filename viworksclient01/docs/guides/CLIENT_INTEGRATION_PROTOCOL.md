# 🔌 ViWorkS Client Integration Protocol

## 📋 **OVERVIEW**

This document defines the secure communication protocol between ViWorkS clients and the admin panel server. The protocol ensures **zero-knowledge architecture** where the admin panel never has access to sensitive client data while still providing comprehensive monitoring and management capabilities.

---

## 🔐 **SECURITY PRINCIPLES**

### **Zero-Knowledge Architecture**
- **Client data remains encrypted** on the client side
- **Admin panel never sees** raw client data
- **Metadata only** is transmitted for monitoring
- **Client-side encryption** for all sensitive information

### **Secure Communication**
- **mTLS (Mutual TLS)** for all communications
- **Certificate pinning** to prevent MITM attacks
- **API key authentication** with scoped permissions
- **Rate limiting** and DDoS protection

---

## 📡 **COMMUNICATION PROTOCOL**

### **1. Client Registration**

#### **Initial Registration**
```typescript
interface ClientRegistration {
  client_id: string;           // Unique client identifier
  public_key: string;          // Client's public key for encryption
  capabilities: string[];      // Client capabilities
  version: string;             // Client version
  node_id?: string;           // Associated VPN node
  device_info: DeviceInfo;    // Device fingerprint (encrypted)
  timestamp: number;          // Registration timestamp
  signature: string;          // Digital signature
}

interface DeviceInfo {
  os_type: string;            // Operating system
  os_version: string;         // OS version
  device_id: string;          // Unique device identifier
  hardware_hash: string;      // Hardware fingerprint
  encrypted: boolean;         // Always true
}
```

#### **Registration Process**
1. **Client generates** unique client ID and key pair
2. **Client encrypts** sensitive device information
3. **Client signs** registration data with private key
4. **Client sends** registration to admin panel
5. **Admin panel validates** signature and stores public key
6. **Admin panel returns** API key and configuration

### **2. Heartbeat Protocol**

#### **Health Check**
```typescript
interface Heartbeat {
  client_id: string;          // Client identifier
  timestamp: number;          // Heartbeat timestamp
  status: ClientStatus;       // Client status
  metrics: ClientMetrics;     // Performance metrics
  signature: string;          // Digital signature
}

enum ClientStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  MAINTENANCE = 'maintenance'
}

interface ClientMetrics {
  uptime: number;             // Client uptime in seconds
  memory_usage: number;       // Memory usage percentage
  cpu_usage: number;          // CPU usage percentage
  network_activity: number;   // Network activity level
  encrypted: boolean;         // Always true
}
```

#### **Heartbeat Frequency**
- **Default**: Every 30 seconds
- **Configurable**: 15-300 seconds based on policy
- **Failure detection**: 3 missed heartbeats = offline

### **3. Session Reporting**

#### **Session Information**
```typescript
interface SessionReport {
  client_id: string;          // Client identifier
  session_id: string;         // Unique session identifier
  session_type: SessionType;  // Type of session
  start_time: number;         // Session start timestamp
  end_time?: number;          // Session end timestamp (if ended)
  status: SessionStatus;      // Current session status
  metadata: SessionMetadata;  // Session metadata (encrypted)
  signature: string;          // Digital signature
}

enum SessionType {
  VPN_CONNECTION = 'vpn_connection',
  SPA_SIGNAL = 'spa_signal',
  ADMIN_ACCESS = 'admin_access'
}

enum SessionStatus {
  ACTIVE = 'active',
  DISCONNECTED = 'disconnected',
  TERMINATED = 'terminated',
  ERROR = 'error'
}

interface SessionMetadata {
  node_id: string;            // VPN node identifier
  client_ip: string;          // Client IP address (anonymized)
  internal_ip?: string;       // Internal IP (encrypted)
  user_agent: string;         // User agent string
  protocol_version: string;   // Protocol version
  encrypted: boolean;         // Always true
}
```

### **4. Security Event Reporting**

#### **Security Events**
```typescript
interface SecurityEvent {
  client_id: string;          // Client identifier
  event_id: string;           // Unique event identifier
  event_type: SecurityEventType; // Type of security event
  severity: SecuritySeverity; // Event severity
  timestamp: number;          // Event timestamp
  details: EventDetails;      // Event details (encrypted)
  signature: string;          // Digital signature
}

enum SecurityEventType {
  AUTHENTICATION_FAILURE = 'authentication_failure',
  CERTIFICATE_ERROR = 'certificate_error',
  CONNECTION_ATTEMPT = 'connection_attempt',
  POLICY_VIOLATION = 'policy_violation',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  SYSTEM_ERROR = 'system_error'
}

enum SecuritySeverity {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

interface EventDetails {
  description: string;        // Event description
  source_ip?: string;         // Source IP (anonymized)
  target_ip?: string;         // Target IP (anonymized)
  user_agent?: string;        // User agent
  error_code?: string;        // Error code
  encrypted: boolean;         // Always true
}
```

---

## 🌐 **API ENDPOINTS**

### **Base URL**
```
https://admin.viworks.com/api/v1
```

### **Authentication**
```
Authorization: Bearer <api_key>
X-Client-ID: <client_id>
X-Signature: <digital_signature>
```

### **Endpoints**

#### **1. Client Registration**
```http
POST /clients/register
Content-Type: application/json

{
  "client_id": "viworks-client-12345",
  "public_key": "-----BEGIN PUBLIC KEY-----\n...",
  "capabilities": ["vpn", "spa", "monitoring"],
  "version": "1.0.0",
  "device_info": {
    "os_type": "Windows",
    "os_version": "10.0.19045",
    "device_id": "device-abc123",
    "hardware_hash": "hash-xyz789",
    "encrypted": true
  },
  "timestamp": 1703123456789,
  "signature": "signature-here"
}
```

#### **2. Heartbeat**
```http
POST /clients/heartbeat
Content-Type: application/json

{
  "client_id": "viworks-client-12345",
  "timestamp": 1703123456789,
  "status": "online",
  "metrics": {
    "uptime": 3600,
    "memory_usage": 45.2,
    "cpu_usage": 12.8,
    "network_activity": 1024,
    "encrypted": true
  },
  "signature": "signature-here"
}
```

#### **3. Session Report**
```http
POST /clients/sessions
Content-Type: application/json

{
  "client_id": "viworks-client-12345",
  "session_id": "session-abc123",
  "session_type": "vpn_connection",
  "start_time": 1703123456789,
  "status": "active",
  "metadata": {
    "node_id": "node-001",
    "client_ip": "192.168.1.100",
    "user_agent": "ViWorkS/1.0.0",
    "protocol_version": "1.0",
    "encrypted": true
  },
  "signature": "signature-here"
}
```

#### **4. Security Event**
```http
POST /clients/events
Content-Type: application/json

{
  "client_id": "viworks-client-12345",
  "event_id": "event-xyz789",
  "event_type": "authentication_failure",
  "severity": "medium",
  "timestamp": 1703123456789,
  "details": {
    "description": "Failed login attempt",
    "source_ip": "192.168.1.100",
    "error_code": "AUTH_001",
    "encrypted": true
  },
  "signature": "signature-here"
}
```

#### **5. Configuration Fetch**
```http
GET /clients/config
Authorization: Bearer <api_key>
X-Client-ID: <client_id>
X-Signature: <digital_signature>
```

#### **6. Policy Update**
```http
GET /clients/policies
Authorization: Bearer <api_key>
X-Client-ID: <client_id>
X-Signature: <digital_signature>
```

---

## 🔧 **CLIENT IMPLEMENTATION**

### **1. Client-Side Encryption**

#### **Data Encryption**
```rust
// In ViWorkS client (Rust)
use aes_gcm::{Aes256Gcm, Key, Nonce};
use aes_gcm::aead::{Aead, NewAead};

pub struct ClientEncryption {
    key: Key<Aes256Gcm>,
    admin_public_key: Vec<u8>,
}

impl ClientEncryption {
    pub fn encrypt_for_admin(&self, data: &[u8]) -> Result<Vec<u8>, Error> {
        // Generate random nonce
        let nonce = Nonce::from_slice(b"unique nonce");
        
        // Encrypt data with AES-256-GCM
        let cipher = Aes256Gcm::new(&self.key);
        let encrypted_data = cipher.encrypt(nonce, data)?;
        
        // Encrypt AES key with admin's public key
        let encrypted_key = self.encrypt_key_with_admin_public_key(&self.key)?;
        
        // Combine encrypted key and data
        let mut result = encrypted_key;
        result.extend(encrypted_data);
        
        Ok(result)
    }
}
```

#### **Digital Signatures**
```rust
use ed25519_dalek::{Keypair, PublicKey, SecretKey, Signature, Signer, Verifier};

pub struct ClientSigner {
    keypair: Keypair,
}

impl ClientSigner {
    pub fn sign_data(&self, data: &[u8]) -> Result<Signature, Error> {
        Ok(self.keypair.sign(data))
    }
    
    pub fn verify_signature(&self, data: &[u8], signature: &Signature) -> Result<bool, Error> {
        Ok(self.keypair.verify(data, signature).is_ok())
    }
}
```

### **2. API Client Implementation**

#### **HTTP Client**
```rust
use reqwest::Client;
use serde_json::Value;

pub struct AdminPanelClient {
    client: Client,
    base_url: String,
    api_key: String,
    client_id: String,
    signer: ClientSigner,
}

impl AdminPanelClient {
    pub async fn register_client(&self, registration: ClientRegistration) -> Result<(), Error> {
        let url = format!("{}/clients/register", self.base_url);
        
        // Sign the registration data
        let data = serde_json::to_vec(&registration)?;
        let signature = self.signer.sign_data(&data)?;
        
        // Add signature to request
        let mut request = registration;
        request.signature = signature.to_string();
        
        let response = self.client
            .post(&url)
            .json(&request)
            .send()
            .await?;
            
        if response.status().is_success() {
            Ok(())
        } else {
            Err(Error::RegistrationFailed)
        }
    }
    
    pub async fn send_heartbeat(&self, heartbeat: Heartbeat) -> Result<(), Error> {
        let url = format!("{}/clients/heartbeat", self.base_url);
        
        // Sign the heartbeat data
        let data = serde_json::to_vec(&heartbeat)?;
        let signature = self.signer.sign_data(&data)?;
        
        // Add signature to request
        let mut request = heartbeat;
        request.signature = signature.to_string();
        
        let response = self.client
            .post(&url)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("X-Client-ID", &self.client_id)
            .header("X-Signature", signature.to_string())
            .json(&request)
            .send()
            .await?;
            
        if response.status().is_success() {
            Ok(())
        } else {
            Err(Error::HeartbeatFailed)
        }
    }
}
```

### **3. Integration with ViWorkS Client**

#### **Main Application Integration**
```rust
// In main.rs or app.rs
use crate::admin_panel::AdminPanelClient;

pub struct ViWorkSApp {
    admin_client: AdminPanelClient,
    // ... other fields
}

impl ViWorkSApp {
    pub async fn start_admin_integration(&mut self) -> Result<(), Error> {
        // Register client with admin panel
        let registration = self.create_client_registration();
        self.admin_client.register_client(registration).await?;
        
        // Start heartbeat loop
        self.start_heartbeat_loop().await?;
        
        Ok(())
    }
    
    async fn start_heartbeat_loop(&self) -> Result<(), Error> {
        let admin_client = self.admin_client.clone();
        
        tokio::spawn(async move {
            let mut interval = tokio::time::interval(Duration::from_secs(30));
            
            loop {
                interval.tick().await;
                
                let heartbeat = create_heartbeat();
                if let Err(e) = admin_client.send_heartbeat(heartbeat).await {
                    log::error!("Failed to send heartbeat: {}", e);
                }
            }
        });
        
        Ok(())
    }
    
    pub async fn report_session(&self, session: SessionInfo) -> Result<(), Error> {
        let session_report = self.create_session_report(session);
        self.admin_client.report_session(session_report).await
    }
    
    pub async fn report_security_event(&self, event: SecurityEvent) -> Result<(), Error> {
        let event_report = self.create_security_event_report(event);
        self.admin_client.report_security_event(event_report).await
    }
}
```

---

## 🛡️ **SECURITY CONSIDERATIONS**

### **1. Data Privacy**
- **No sensitive data** is ever transmitted to admin panel
- **Client-side encryption** for all sensitive information
- **Metadata only** for monitoring purposes
- **Zero-knowledge architecture** maintained

### **2. Communication Security**
- **mTLS** for all API communications
- **Certificate pinning** to prevent MITM
- **Digital signatures** for data integrity
- **Rate limiting** to prevent abuse

### **3. Client Security**
- **No admin panel credentials** stored in client
- **Secure key generation** and storage
- **Automatic key rotation** policies
- **Tamper detection** mechanisms

### **4. Network Security**
- **IP allowlisting** for admin panel access
- **DDoS protection** on admin panel
- **Traffic analysis** prevention
- **Secure DNS** resolution

---

## 📊 **MONITORING & METRICS**

### **Client Metrics Collected**
- **Uptime and availability**
- **Performance metrics** (CPU, memory, network)
- **Session statistics** (count, duration, success rate)
- **Security events** (failures, violations, anomalies)
- **Error rates** and system health

### **Data Retention**
- **Real-time data**: 24 hours
- **Historical data**: 90 days (encrypted)
- **Audit logs**: 1 year (immutable)
- **Security events**: 2 years (for compliance)

---

## 🔄 **ERROR HANDLING**

### **Network Failures**
- **Exponential backoff** for retries
- **Circuit breaker** pattern for API calls
- **Local caching** of critical data
- **Graceful degradation** when admin panel unavailable

### **Authentication Failures**
- **Automatic re-registration** if API key invalid
- **Certificate renewal** if expired
- **Fallback to local mode** if admin panel unreachable
- **Alert generation** for security issues

---

This protocol ensures **secure, privacy-preserving communication** between ViWorkS clients and the admin panel while maintaining the **zero-knowledge architecture** that protects client data and maintains the security posture of the ViWorkS system.
