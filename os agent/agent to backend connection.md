ViWorkS Agent — Outbound Control Channel & Secure Command Execution

Implementation Plan for Cursor (no code, exact behaviors + schemas)

0) Objectives
	•	Eliminate inbound exposure on Gateway OS by using an outbound-only, mTLS-protected, persistent channel from Agent → Backend.
	•	Execute only allowlisted actions (user creation, container/session control, health/metrics) with strict validation, timeouts, and audit.
	•	Keep SSH ForceCommand as documented break-glass (no code change now).
	•	Preserve existing HTTP endpoints behind a feature flag (disabled in prod).

⸻

1) High-Level Architecture (Target)
	•	Agent → Backend: one persistent WebSocket (or gRPC) connection over TLS 1.3 + mTLS.
	•	Identity: short-lived client certs (≤30 min) from internal CA. Pin backend SPKI in Agent.
	•	Command Model: Backend sends a signed command envelope; Agent verifies signature, nonce, TTL, and allowlist → executes sandboxed local action → returns signed result.
	•	Telemetry: Agent pushes health & container/session metrics every 30s on the same stream.
	•	Fallback: Existing inbound HTTP endpoints behind feature flag (default OFF) and firewall (backend IPs only).

⸻

2) Configuration (env + file)

Create a minimal config surface (no secrets in CLI flags):

Environment variables
	•	VIW_AGENT_BACKEND_URL – e.g., wss://backend.example.com/agent
	•	VIW_AGENT_ID – stable gateway/host identifier (UUID or hostname + site)
	•	VIW_AGENT_CERT_PATH / VIW_AGENT_KEY_PATH – mTLS client cert/key (PEM or PKCS#12)
	•	VIW_AGENT_TRUST_BUNDLE – PEM CA bundle to validate backend + SPKI pin
	•	VIW_AGENT_BACKEND_SPKI_PIN – base64 SPKI pin of backend cert
	•	VIW_AGENT_FEATURE_INBOUND_HTTP – false (prod default)
	•	VIW_AGENT_FEATURE_EXEC_ENABLE – true (maintenance toggle; if false, only telemetry allowed)
	•	VIW_AGENT_SCRIPTS_ROOT – /opt/Viworks/scripts_viworks (absolute)
	•	VIW_AGENT_MAX_CONCURRENCY – e.g., 4
	•	VIW_AGENT_CMD_TIMEOUT_SECS – e.g., 45
	•	VIW_AGENT_LOG_LEVEL – info|debug
	•	VIW_AGENT_SITE – optional site/region tag for routing
	•	VIW_AGENT_CONTAINER_ENGINE – docker|podman

Files
	•	/etc/viworks-agent/agent.yaml – optional mirror of env vars (env wins).
	•	sudoers (separate ops step): allow exact binaries/args needed by scripts & container controls; no wildcards.

⸻

3) Connection Lifecycle (Agent → Backend)
	1.	Bootstrap
	•	Load config; validate paths; read SPKI pin; load client cert.
	•	Refuse to start if any required file missing or world-writable.
	2.	Connect
	•	Dial VIW_AGENT_BACKEND_URL via TLS 1.3 with mTLS; verify server chain AND SPKI pin.
	•	Backoff with jitter on failures (e.g., 1s → 2s → 5s → max 30s).
	3.	Register (HELLO)
	•	Send HELLO frame with:
	•	agent_id, site, agent_version, os, kernel, container_engine, supported_verbs[], start_time, feature_flags.
	4.	Keepalive
	•	Heartbeat ping/pong every 15s; detect dead link < 45s; reconnect.
	5.	Command Stream
	•	Receive signed command envelopes; verify; execute; send signed results.
	6.	Telemetry
	•	Every 30s: push health snapshot. On important events (container spawn/stop, user created), send event frames.

⸻

4) Security Envelope (no code; exact fields)

4.1 Signed Command Envelope (Backend → Agent)
	•	Transport: within the persistent stream message.
	•	Outer: plain JSON wrapper:
{"type":"COMMAND","payload":"<JWS-compact-or-detached>"}
	•	Inner JWS (signed) JSON body (UTF-8):

{
  "corr_id": "uuid-or-ksuid",
  "verb": "create_openvpn_user",
  "args": {
    "username": "alice",
    "userpass": "•••",
    "source_ip": "10.20.30.11",
    "key": "Keys2338388373737",
    "hmac_key": "Hmac38737383838",
    "timeout": 3600
  },
  "actor": {"id":"admin-123","role":"ADMIN"},
  "policy_id": "p-2025-09-01-01",
  "nonce": "random-128bit-hex",
  "iat": 1693574400,
  "exp": 1693574460,  // e.g., 60s
  "agent_targets": ["<agent_id>"]
}

	•	Agent must verify:
	•	Stream is mTLS authenticated.
	•	JWS signature with pinned backend public key.
	•	exp not expired; iat within ±60s (clock skew tolerance).
	•	Nonce not seen before (store in in-memory LRU with TTL).
	•	verb in allowlist; args schema exact match; no extra keys.

4.2 Signed Result Envelope (Agent → Backend)

{
  "type": "RESULT",
  "payload": {
    "corr_id": "same-as-command",
    "agent_id": "<agent_id>",
    "verb": "create_openvpn_user",
    "status": "SUCCESS|ERROR|DENIED|TIMEOUT",
    "rc": 0,
    "duration_ms": 1234,
    "stdout": "base64-encoded-snippet-or-redacted-hash",
    "stderr_hash": "sha256-hex",
    "error_code": "SCRIPT_NOT_FOUND|VALIDATION_FAILED|EXEC_TIMEOUT|...|NONE",
    "ts": "2025-09-03T09:01:23Z"
  },
  "sig": "<agent-side detached signature of payload (optional)>"
}

	•	Do not echo sensitive args (passwords, keys). Redact or hash.

⸻

5) Allowed Verbs & Argument Schemas (strict)

Implement a static allowlist with JSON schema validation for each verb:
	1.	create_panel_user
	•	args: { "username": string(3..64, a-z0-9_-), "password": string(8..128) }
	•	Run: /opt/Viworks/scripts_viworks/add_user.sh <username> <password>
	2.	create_openvpn_user
	•	args: { "username": string, "userpass": string, "source_ip": ipv4, "key": string, "hmac_key": string, "timeout": int(60..86400) }
	•	Run: /opt/Viworks/scripts_viworks/add_vpn_user.sh <username> <userpass> <source_ip> <key> <hmac_key> <timeout>
	3.	spawn_container
	•	args: { "username": string, "session_id": string, "image": string, "cpu": "0.5-4", "mem_mb": 256..8192, "egress_profile": "default|strict" }
	•	Run: container engine with limits, labels: viw.session=<session_id>
	4.	stop_container
	•	args: { "container_id": string }
	5.	terminate_session
	•	args: { "session_id": string } (stop all containers labeled with that session)
	6.	list_containers
	•	args: {} (none)
	7.	get_system_health
	•	args: {}
	8.	get_service_status
	•	args: {}

Reject any other verb or any schema mismatch with DENIED.

Execution guardrails (for all verbs)
	•	Use an internal “exec runner” that:
	•	Accepts absolute paths only, no shell interpretation for script args.
	•	Scrubs env (PATH=/usr/bin:/bin, LC_ALL=C).
	•	Applies hard timeout (VIW_AGENT_CMD_TIMEOUT_SECS).
	•	Captures stdout/stderr; truncate long outputs; compute stderr_hash.
	•	Limits concurrency (VIW_AGENT_MAX_CONCURRENCY).
	•	Returns DENIED if VIW_AGENT_FEATURE_EXEC_ENABLE=false.

⸻

6) Telemetry & Health (Agent → Backend)
	•	Interval: every 30s (configurable).
	•	Frame: {"type":"TELEMETRY","payload":{...}}
	•	Payload fields:

{
  "agent_id":"<id>",
  "site":"<site>",
  "ts":"2025-09-03T09:00:00Z",
  "uptime_s":12345,
  "cpu_pct": 23.4,
  "mem": {"total_mb":16384,"used_mb":5720},
  "loadavg": [0.35,0.40,0.60],
  "disk": [{"mount":"/","used_pct":62.1}],
  "services": {"openvpn":"active","stunnel":"active","fwknopd":"active"},
  "containers": {"running":3,"images":[{"image":"chrome-sandbox:1.2","count":3}]},
  "version": {"agent":"x.y.z","engine":"docker 25.0"}
}

	•	Event frames on lifecycle changes (spawn/stop, user created/failed).

⸻

7) Logging & Audit (local stdout + optional syslog)
	•	Structured JSON per line. Required fields on every log:
	•	ts, level, agent_id, site, event, corr_id?, verb?, status?, rc?, duration_ms?, actor?, nonce?, error_code?, stderr_hash?
	•	Never log secrets (passwords/keys). Use constant redaction or hashes.
	•	Sampling: None for command logs; allowed for telemetry at high rates.

⸻

8) Resilience & Backpressure
	•	Reconnect with exponential backoff + jitter.
	•	Idempotency: if the backend resends a command with same corr_id, do not re-execute; return last result.
	•	Replay cache: store (nonce, exp) tuples in memory with TTL; window 60–120s; LRU capped (e.g., 10k).
	•	Queue limits: cap queued commands (e.g., 100). On overflow, respond ERROR: QUEUE_FULL.

⸻

9) Inbound HTTP Endpoints (Feature-flagged)
	•	Keep existing REST endpoints behind VIW_AGENT_FEATURE_INBOUND_HTTP=false by default.
	•	If enabled for testing, bind only to 127.0.0.1 unless explicitly set; require HMAC header + timestamp; firewall to backend IPs only.

⸻

10) System Integration (no code—ops steps)
	•	systemd unit:
	•	Restart=on-failure, RestartSec=5
	•	ProtectSystem=strict, NoNewPrivileges=true, PrivateTmp=yes
	•	Run as dedicated viworks-agent user
	•	sudoers: exact allowlist for:
	•	/opt/Viworks/scripts_viworks/add_user.sh
	•	/opt/Viworks/scripts_viworks/add_vpn_user.sh
	•	Container engine binaries with constrained subcommands (stop/rm/run with labels)
	•	File perms: scripts root owned by root, 0750; agent binaries 0755; configs 0640.

⸻

11) Testing Matrix (Cursor to implement harness & fakes)

Connectivity
	•	Invalid SPKI pin → agent refuses connect.
	•	Expired client cert → agent refuses to start / reconnect.

Envelope
	•	Bad signature → DENIED.
	•	Expired exp or skew > 60s → DENIED.
	•	Nonce replay → DENIED.

Allowlist
	•	Unknown verb → DENIED.
	•	Extra arg key → VALIDATION_FAILED.
	•	Missing required arg → VALIDATION_FAILED.

Exec
	•	Script path tamper (relative path) → DENIED.
	•	Command exceeds timeout → TIMEOUT.
	•	Concurrency > limit → queued/not executed; verify ordering or rejection.

Idempotency
	•	Re-send same corr_id → agent returns cached result; no re-exec.

Telemetry
	•	30s cadence; verify values; event on container spawn/stop.

Feature flag
	•	VIW_AGENT_FEATURE_EXEC_ENABLE=false → commands return DENIED, telemetry still flows.
	•	VIW_AGENT_FEATURE_INBOUND_HTTP=false → HTTP handlers don’t bind.

⸻

12) Rollout Plan
	1.	Phase 0 (Hardening now)
	•	Set VIW_AGENT_FEATURE_INBOUND_HTTP=false.
	•	Firewall existing HTTP to backend IPs only.
	2.	Phase 1 (Outbound channel)
	•	Implement persistent mTLS stream + envelopes + allowlist + telemetry.
	•	Run with backend stub that echos commands & verifies results.
	3.	Phase 2 (Cutover)
	•	Disable inbound HTTP in prod; leave behind feature flag for lab.
	•	Document SSH ForceCommand (break-glass) separately—no code needed now.
	4.	Phase 3 (Scale & Rotate)
	•	Add automated cert rotation; tighten retry/backoff; tune metrics.

⸻

13) Deliverables for this agent sprint
	•	Connection Manager: persistent mTLS WebSocket/gRPC with backoff, SPKI pin.
	•	Envelope Verifier: Ed25519 JWS verify, nonce cache, TTL checks.
	•	Allowlist Executor: verb registry + JSON schema validation + sandboxed exec with timeouts/concurrency caps.
	•	Telemetry Publisher: periodic health + event frames.
	•	Audit Logging: structured JSON; secrets redacted; correlation across request/result.
	•	Feature Flags: VIW_AGENT_FEATURE_INBOUND_HTTP, VIW_AGENT_FEATURE_EXEC_ENABLE.
	•	Configuration Loader: env + optional YAML; perms checks.
	•	Test Harness: backend stub + unit/integration tests per matrix above.
	•	Docs: README with env vars, ops notes (systemd, sudoers, firewall).

⸻

14) Acceptance Criteria (go/no-go)
	•	Agent runs with no inbound ports and maintains a stable mTLS stream to backend.
	•	Commands execute only if verb & args pass allowlist + schema; otherwise DENIED.
	•	Each command produces a single auditable result with corr_id, rc, duration_ms; idempotent on resend.
	•	No secrets appear in logs or results; stderr hashed.
	•	Telemetry pushes every 30s; reconnection works with jitter; max backoff ≤30s.
	•	Feature flags behave as specified.

⸻

One-liner for Cursor to start

Please implement the plan exactly as written above, avoiding code generation conflicts. Focus on: (1) outbound mTLS persistent connection, (2) signed command envelopes with nonce/TTL, (3) strict allowlist executor with sandboxed scripts, (4) periodic telemetry, (5) structured audit logs, and (6) feature flags to disable inbound HTTP and to toggle exec. Provide small, incremental commits with test harnesses for envelope validation, replay, timeouts, and idempotency. Do not remove any existing modules—additive changes only.

