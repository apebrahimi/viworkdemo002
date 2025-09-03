# **Secure Outbound Connection System**  
**Document Version**: 1.0  
**Last Updated**: Today  
**Author**: AI Assistant  

---

## **1. Overview**  
The `viworks-gateway-agent` now supports a **secure, outbound-only WebSocket connection** to the backend, replacing the previous HTTP-based communication. This ensures:  
- **No inbound ports** are exposed on the agent (reducing attack surface).  
- **Mutual TLS (mTLS)** for authentication.  
- **SPKI pinning** to prevent MITM attacks.  
- **Structured command envelopes** with validation.  

---

## **2. Key Components**  

### **2.1 OutboundManager**  
- **Role**: Manages the WebSocket connection lifecycle (connect, reconnect, heartbeat).  
- **Features**:  
  - Automatic reconnection with exponential backoff.  
  - Telemetry reporting loop (system health, container stats).  
  - Command execution orchestration.  

### **2.2 ConnectionManager**  
- **Role**: Handles WebSocket communication (message parsing, validation, and routing).  
- **Security**:  
  - Validates **nonces** to prevent replay attacks.  
  - Enforces **command allowlists** (only pre-approved verbs allowed).  
  - Implements **heartbeats** to detect disconnections.  

### **2.3 CommandExecutor**  
- **Role**: Executes backend commands in a sandboxed environment.  
- **Features**:  
  - Schema validation for all command arguments.  
  - Timeout enforcement (`cmd_timeout_secs`).  
  - Concurrency control (`max_concurrency`).  

### **2.4 Envelope System**  
- **Structures**:  
  - `CommandEnvelope`: Signed requests from backend.  
  - `ResultEnvelope`: Signed responses to backend.  
  - `TelemetryFrame`: Periodic system health reports.  
- **Validation**:  
  - Expiration timestamps (`iat`, `exp`).  
  - Agent targeting (`agent_targets`).  

---

## **3. Security Features**  

| Feature                | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| **mTLS**              | Client certificates (`client.crt`, `client.key`) for agent authentication. |
| **SPKI Pinning**      | Backend certificate fingerprint pinned to prevent MITM.                    |
| **Nonce Protection**  | Cached nonces prevent command replay attacks (2-minute window).            |
| **Allowlist**         | Only 16 pre-approved commands (e.g., `create_panel_user`, `spawn_container`). |
| **Schema Validation** | Strict JSON schema checks for all command arguments.                       |

---

## **4. Configuration**  
### **4.1 `agent-outbound.toml**  
```toml
[outbound]
backend_url = "wss://backend.example.com/agent"  # WebSocket endpoint
agent_id = "gateway-001"                         # Unique agent ID
site = "production"                              # Deployment environment

# mTLS Cert Paths
cert_path = "/etc/viworks-agent/client.crt"
key_path = "/etc/viworks-agent/client.key"
trust_bundle = "/etc/viworks-agent/ca.crt"

# Security
backend_spki_pin = "sha256/ABC123..."           # Backend cert fingerprint

# Features
feature_inbound_http = false                    # Disable inbound HTTP
feature_exec_enable = true                      # Allow command execution

# Limits
max_concurrency = 4                             # Max parallel commands
cmd_timeout_secs = 45                           # Per-command timeout
```

### **4.2 Environment Variables**  
Override any TOML setting:  
```bash
export VIW_AGENT_BACKEND_URL="wss://backend.example.com/agent"
export VIW_AGENT_BACKEND_SPKI_PIN="sha256/ABC123..."
export VIW_AGENT_FEATURE_EXEC_ENABLE="true"
```

---

## **5. Backend Integration**  
### **5.1 Expected Backend API**  
- **WebSocket Endpoint**: Accepts `CommandEnvelope` and returns `ResultEnvelope`.  
- **Required Headers**:  
  - `Sec-WebSocket-Protocol: viworks-agent-v1`  
  - Client certificate authentication.  

### **5.2 Command Flow**  
1. Agent sends `HELLO` frame on connection (with supported verbs).  
2. Backend sends signed `CommandEnvelope`.  
3. Agent validates, executes, and returns `ResultEnvelope`.  

---

## **6. Monitoring & Telemetry**  
- **Data Collected**:  
  - CPU/Memory/Disk usage.  
  - Container counts.  
  - Service health.  
- **Reporting Interval**: Configurable (`collect_interval` in `agent.toml`).  

---

## **7. Error Handling**  
| Error Code               | Description                          | Recovery Action                     |
|--------------------------|--------------------------------------|-------------------------------------|
| `ValidationFailed`       | Invalid command schema.              | Reject command.                     |
| `ReplayDetected`         | Duplicate nonce.                     | Ignore command.                     |
| `ExecTimeout`            | Command timed out.                   | Kill process, return error.         |

---

## **8. Deployment Checklist**  
1. **Generate mTLS Certificates**:  
   ```bash
   openssl req -x509 -newkey rsa:4096 -keyout client.key -out client.crt -days 365
   ```
2. **Set SPKI Pin**:  
   ```bash
   openssl x509 -in backend.crt -pubkey -noout | openssl pkey -pubin -outform der | openssl dgst -sha256
   ```
3. **Start Agent**:  
   ```bash
   cargo run --release
   ```

---

## **9. Future Work**  
- **JWS Signing**: Replace simple JSON with signed JWT envelopes.  
- **Edge Function Integration**: Deploy agent logic as Supabase Edge Functions.  

---

## **10. Appendix**  
- **Sample Commands**: See `OUTBOUND_CONNECTION_README.md`.  
- **Debugging**: Use `RUST_LOG=debug` for verbose logs.  

