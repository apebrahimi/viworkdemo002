viworks_backend.md

Component: ViWorkS Backend (Control Plane)
Audience: Backend engineers, security engineering, SRE/ops, audit/compliance
Version: 1.0 (implementation-ready)
Terminology (consistent): SPA → stunnel → OpenVPN, sealed bootstrap, device binding, in-memory configs, SPKI pinning, SSH ForceCommand, SIEM detections

⸻

1) Role & Scope

1.1 Purpose

The ViWorkS Backend is the central control plane for the platform. It brokers identity, policy, bootstrap, and orchestration between users/clients, mobile devices, and gateway nodes.

Authoritative responsibilities
	•	Authentication & OTP
	•	Password login for desktop clients.
	•	Mobile device-bound OTP challenges (TTL ≤ 120s).
	•	Rate limiting, geo/ASN/risk conditions.
	•	Device Binding & Attestation
	•	First-run desktop device key enrollment (TPM/Secure Enclave preferred).
	•	Mobile binding + attestation (Android Play Integrity / iOS DeviceCheck/App Attest).
	•	Sealed Bootstrap Delivery
	•	Issue short-lived, HPKE-sealed bundles containing SPA token, front-door FQDN, and temporary OpenVPN materials (inline) for in-memory use only.
	•	Policy & Session Engine
	•	RBAC + ABAC (time, geo/ASN, device posture, risk).
	•	Session lifecycle, heartbeat, and forced revocation.
	•	Gateway Orchestration (Control Plane)
	•	SSH (port 2222) with ForceCommand to gateways (no TTY, key-based, firewall pinned to Backend IPs).
	•	Idempotent commands: create VPN users, update CCD, spawn/terminate isolated browser containers, pull logs, reload nginx.
	•	Audit & Telemetry
	•	Structured JSON logs with correlation IDs; push to SIEM; exposure of health/metrics for SRE.

1.2 Out of Scope (for Backend)
	•	Serving the front-door TLS (stunnel) or OpenVPN itself.
	•	Exposing any control API directly on gateways (all gateway control is via SSH ForceCommand only).
	•	End-user UI (Admin Panel is a separate component that consumes Backend APIs).
	•	Client update distribution (handled by Update service; Backend may sign/host manifests but not required here).

⸻

2) Interfaces & Dependencies

2.1 External APIs (HTTPS 443, TLS 1.3)

All endpoints use JSON over HTTPS with TLS 1.3. Clients (desktop/mobile/admin) SPKI-pin the Backend certificate.

Auth & OTP
	•	POST /auth/login → { username, password, device_client_id? }
→ 200 { login_id, next: "OTP_REQUIRED", throttle_ms }
	•	POST /auth/otp/request (mobile) → { user_id }
→ 201 { challenge_id, expires_at }
	•	POST /auth/otp/verify → { login_id, code, device_client_id }
→ 200 { session_token, exp, policy_context }

Device Binding
	•	POST /device/desktop/enroll/start → { user_id, platform }
→ 200 { enrollment_nonce, hpke_recipient_params }
	•	POST /device/desktop/enroll/finish → { user_id, enrollment_nonce, device_pubkey, attest_evidence? }
→ 201 { device_id }
	•	POST /device/mobile/enroll → { user_id, device_info, attest_evidence }
→ 201 { mobile_device_id }

Bootstrap (short-lived)
	•	GET /client/bootstrap (desktop after OTP)
Headers: Authorization: Bearer <session_token>
→ 200 { sealed_bootstrap, exp } (HPKE envelope, Base64)

Policy & Sessions
	•	GET /policies/effective?user_id=... → effective RBAC/ABAC for UI.
	•	POST /sessions/revoke → { session_id | user_id | device_id }
→ 202 { queued: true } (revocation push to gateways).
	•	GET /sessions/active?user_id=...

Admin & Orchestration
	•	POST /admin/users / PATCH /admin/users/:id / DELETE /admin/users/:id
	•	POST /admin/gateway/ops → queues SSH ForceCommand to gateway: {command, args, target_gateway_id}
→ 202 { op_id } then async status via /admin/ops/:op_id

Audit & Health
	•	GET /audit/events?filters=... (paginated; role-restricted).
	•	GET /healthz / GET /readyz (plain 200).
	•	GET /metrics (Prometheus exposition; private).

Note: Admin Panel uses the same HTTPS API (RBAC guards). No direct DB access.

2.2 Internal Dependencies & Ports
	•	Postgres (5432, private) — canonical store.
	•	Redis (6379, private) — ephemeral state (OTP challenges, session caches, rate-limit counters).
	•	KMS/HSM — PKI CA keys, server TLS keys (if centrally managed), HPKE sender key(s) for sealing bootstrap.
	•	SSH to Gateways (2222/tcp) — from Backend hosts only, via key-based auth to a non-interactive account using ForceCommand dispatcher on gateway.
	•	SIEM — logs over TLS Syslog or HTTPS ingestion (outbound from Backend).

Protocols & crypto
	•	TLS 1.3 for HTTPS; ciphersuites: TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256.
	•	HPKE: X25519 KEM + ChaCha20-Poly1305 (or AES-GCM) + HKDF-SHA256 (via hpke crate).
	•	SSH: Ed25519 keys, no-pty, command="<dispatcher>", no-agent-forwarding, no-port-forwarding.

⸻

3) Data & Config Management

3.1 Persistent Models (Postgres)
	•	users
	•	id (uuid), username (unique), pass_hash, roles[], status, created_at, updated_at.
	•	Password hashing: Argon2id (memory-hard parameters tuned).
	•	devices_desktop
	•	id, user_id, device_pubkey (HPKE recipient), platform, fingerprint, enrolled_at, status.
	•	devices_mobile
	•	id, user_id, device_info (model, os, version), attest_history[], bound_at, status.
	•	otp_challenges (optionally persisted for audit; state lives in Redis)
	•	challenge_id, user_id, created_at, expires_at, revoked, meta (geo/asn, risk).
	•	sessions
	•	id, user_id, device_id, status, started_at, last_heartbeat, gateway_id, peer_ip, policy_snapshot.
	•	policies
	•	id, name, rbac_roles[], abac (jsonb) (time windows, geo/ASN allowlist, posture requirements), version, created_by.
	•	admin_ops
	•	op_id, actor_id, command, args (jsonb), target_gateway_id, status, stdout_tail, stderr_tail, rc, submitted_at, completed_at.
	•	audit_events
	•	id, ts, tenant, actor, subject, action, result, fields (jsonb), trace_id.

Indexes: username unique; sessions(user_id, status), audit_events(ts), policies(version).

3.2 Ephemeral State (Redis)
	•	otp:{challenge_id} → {user_id, code_hash, exp, attempts, risk_ctx} (TTL 120s).
	•	session_token:{id} (JWT/jti to metadata; TTL ≤ 10m pre-bootstrap).
	•	rate:auth:{username or ip} counters with sliding TTLs.
	•	revocation_queue (list) for rapid push to gateway workers.
	•	gateway_op:{op_id} → status (TTL 1h).

3.3 Sealed Bootstrap (HPKE)
	•	Payload (before sealing):

{
  "exp": "2025-01-10T12:34:56Z",
  "frontdoor_fqdn": "gw.viworks.example",
  "spa": { "method": "udp", "port": 62201, "token": "<opaque>" , "ttl_s": 20 },
  "openvpn": {
    "inline": { "ca": "...", "cert": "...", "key": "...", "tls_crypt": "..." },
    "params": { "proto": "tcp-client", "mssfix": 1450, "verb": 3 }
  },
  "policy": { "dns": "10.0.0.53", "redirect_gateway": true },
  "nonce": "<random-96bit>",
  "session_id": "<uuid>"
}


	•	Sealing: hpke.seal( recipient_pubkey=device_pubkey, aad=session_id, plaintext=payload, info="viworks:bootstrap:v1").
	•	Delivery: Base64 HPKE envelope as sealed_bootstrap.
	•	Decryption: desktop uses device private key (TPM/Enclave when possible). Never written to disk; used in memory to start embedded TLS proxy + OpenVPN with stdin config.
	•	Expiry: exp ≤ 10 minutes from issuance.

⸻

4) Security Controls

4.1 Transport & API
	•	TLS 1.3 only, SPKI-pinned by clients (desktop & mobile).
	•	JWT/opaque tokens: short-lived pre-bootstrap session; rotating signing keys stored in KMS.
	•	Rate limits on auth/OTP endpoints; IP+ASN+geo checks.

4.2 Authentication & OTP
	•	Password hashing with Argon2id; password policies enforced.
	•	OTP generation: 6 digits, random, TTL=120s, one-time use, rate limited; stored hashed in Redis.
	•	OTP verification binds to {login_id, user_id, device_client_id, risk_ctx}.

4.3 Device Binding & Attestation
	•	Desktop: enrollment (start/finish) stores device_pubkey; optional platform attestation evidence recorded.
	•	Mobile: attestation required (Play Integrity or DeviceCheck/App Attest). If attestation fails → no OTP.
	•	Risk engine hooks: combine IP geo/ASN, device history, carrier MCC/MNC (if provided by mobile), and velocity. Deny/step-up as policy dictates.

4.4 Bootstrap Sealing & Client Blindness
	•	Bootstrap sealed with HPKE to desktop device key; the payload contains only FQDN, not raw IPs; SPA token is opaque.
	•	Desktop decrypts in memory; embedded TLS proxy (Rustls) connects to FQDN (pinned). OpenVPN runs inside the TLS channel with inline materials.

4.5 Gateway Control (SSH ForceCommand)
	•	Never expose a gateway HTTP API.
	•	Outbound from Backend to gateway_ip:2222/tcp only.
	•	SSH user has authorized_keys entries with command="/opt/viworks/bin/dispatch", no-pty, no-agent-forwarding, no-port-forwarding.
	•	Allowlist subcommands only (listed in §5.4).
	•	Full command trail (args, rc, stdout/stderr tail) captured and sent to SIEM.

4.6 SIEM Logging & Tracing
	•	Structured JSON logs with fields:
ts, level, trace_id, user_id, device_id, session_id, action, result, ip, asn, country, fwknop_id, tls_ja3, gateway_id, policy_id, op_id.
	•	OpenTelemetry traces enabled (trace_id correlation between API calls, SSH ops, and gateway outcomes).
	•	Delivery: dual-path (primary ingestion + secondary buffer shipper); back-pressure if SIEM is unavailable (log locally, drain later).

⸻

5) Implementation Notes

5.1 Tech Stack
	•	Language/Framework: Rust + Actix-web (async).
	•	DB: Postgres (SQLx or equivalent), migrations via Diesel/SQLx migrations.
	•	Cache/Queues: Redis (TLS if remote).
	•	Crypto:
	•	TLS: rustls.
	•	HPKE: hpke Rust crate (X25519 + ChaCha20-Poly1305, HKDF-SHA256).
	•	Hash: SHA-256, Argon2id for passwords, HMAC-SHA256 for transient tokens.
	•	Workers: Tokio tasks for asynchronous SSH ops; rate-limiters (e.g., governor).

5.2 Deployment Model
	•	Containerized microservice (K8s or systemd on VMs).
	•	Horizontal scale (stateless API) behind L7.
	•	Redis in HA (sentinel or managed).
	•	Postgres in HA with PITR.
	•	Secrets from KMS/Secret Manager; never in images.

5.3 API Conventions
	•	AuthZ: Bearer tokens (short-lived), RBAC scopes in claims.
	•	Errors: Problem+JSON (type, title, detail, code, trace_id).
	•	Idempotency: Upserts for device binding; op_id for gateway ops.

5.4 ForceCommand Allowlist (initial)
	•	vpn_user_create <username> <realname?>
	•	vpn_user_delete <username>
	•	vpn_user_passwd <username> <password>
	•	update_ccd <username> <ccd_json> (routes/DNS/push options)
	•	spawn_browser_container <username> <constraints_json>
	•	terminate_session <session_id|username>
	•	reload_nginx
	•	pull_logs <path_glob> <tail_bytes>

Gateway scripts implement these atomically and log to syslog; backend SSH worker captures rc/stdout/stderr.

⸻

6) Failure & Recovery

6.1 OTP Service Issues
	•	Redis outage:
	•	Return 503 with Retry-After.
	•	Fall back to minimal in-process cache for rate limiting (bounded).
	•	Alert SRE; circuit breaker on OTP endpoints.
	•	Attestation vendor outage:
	•	Policy flag allow_degraded_attestation=false by default; if tenant approves, allow OTP with additional step-up (e.g., security questions) and SIEM “degraded” event.

6.2 Bootstrap Service Failure
	•	Return 503; never cache previous bootstrap server-side.
	•	Clients backoff (exponential jitter).
	•	Alert SRE; health checks include KMS availability for HPKE keys.

6.3 SSH Command Failure / Timeout
	•	Mark op as failed; include rc, stdout_tail, stderr_tail.
	•	Retries: up to 3 with exponential backoff for idempotent commands; no retry for passwd without operator approval.
	•	If gateway unreachable, queue op for later resume; alert SRE.

6.4 SIEM Outage
	•	Switch to local buffering (disk-backed queue); apply rate cap to avoid disk fill; emit siem_outage heartbeat.
	•	On recovery, drain with back-pressure awareness.

6.5 DB/Cache Failover
	•	Postgres: application retries (fast-fail on write if read-only).
	•	Redis: sentinel/multi-AZ; short TTLs reduce stale state risk.

⸻

7) Future Extensions
	•	BLE co-presence (mobile + desktop proximity) to mitigate geo-fraud.
	•	Risk engine integration (ASN reputation, device velocity, behavioral scoring).
	•	Optional mTLS for mobile APIs (per tenant) with device certs minted at enroll.
	•	Desktop TPM attestation (Windows/Linux) and macOS Secure Enclave attestation, where available.
	•	Per-tenant policy plug-ins (WebAssembly filter) for custom ABAC.

⸻

8) Configuration Reference (Appendix)

8.1 Example API (selected)

Login

POST /auth/login
Content-Type: application/json
{
  "username": "alice@corp",
  "password": "••••••••",
  "device_client_id": "desktop-3f4e..."
}
-- 200 --
{
  "login_id": "0c7b3b8e-...",
  "next": "OTP_REQUIRED",
  "throttle_ms": 0
}

OTP Verify

POST /auth/otp/verify
Authorization: Bearer <login-token-if-used>
Content-Type: application/json
{
  "login_id": "0c7b3b8e-...",
  "code": "492117",
  "device_client_id": "desktop-3f4e..."
}
-- 200 --
{
  "session_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "exp": "2025-01-10T12:30:00Z",
  "policy_context": { "geo":"IR", "asn":58224, "posture":"ok" }
}

Bootstrap

GET /client/bootstrap
Authorization: Bearer <session_token>
-- 200 --
{
  "sealed_bootstrap": "BASE64(HPKE_ENVELOPE_BYTES)",
  "exp": "2025-01-10T12:35:00Z"
}

Admin Gateway Op

POST /admin/gateway/ops
Authorization: Bearer <admin_token>
Content-Type: application/json
{
  "command": "spawn_browser_container",
  "args": { "username":"alice", "constraints": { "cpu":"2", "mem_mb":2048 } },
  "target_gateway_id": "gw-eu-1"
}
-- 202 --
{ "op_id": "op-7f2d..." }

8.2 ForceCommand Command List (backend side)

Command	Args	Idempotent	Notes
vpn_user_create	username, realname?	yes	Create SoftEther/OpenVPN user
vpn_user_delete	username	yes	Safe if missing
vpn_user_passwd	username, password	no	Sensitive; no auto-retry
update_ccd	username, ccd_json	yes	Routes/DNS push
spawn_browser_container	username, constraints_json	yes	Returns reverse-path via stdout
terminate_session	session_id | username	yes	Uses OpenVPN mgmt / kernel teardown
reload_nginx	—	yes	Validate config before reload
pull_logs	path_glob, tail_bytes	yes	Whitelisted paths only

8.3 Structured Log Example

{
  "ts": "2025-01-10T12:31:54.321Z",
  "level": "INFO",
  "trace_id": "cdb9b8d48a0c2b5d",
  "action": "otp.verify",
  "result": "success",
  "user_id": "u-1a2b3c",
  "device_id": "d-7f8e9a",
  "ip": "203.0.113.12",
  "asn": 58224,
  "country": "IR",
  "policy_id": "pol-default",
  "session_id": "s-77ccaa",
  "meta": {"lat_ms": 84}
}


⸻

9) Test Plan

9.1 Functional
	1.	Happy path: create user → desktop enroll → mobile enroll (attested) → /auth/login → /auth/otp/verify → /client/bootstrap (sealed) → desktop connects (SPA→TLS→OVPN) → container spawned via spawn_browser_container → session shown in Admin Panel → /sessions/revoke forces disconnect (<10s).
	2.	Policy propagation: update ABAC time window → /admin/gateway/ops update_ccd → verify enforcement on next session.
	3.	SSH ops: vpn_user_create, vpn_user_passwd, reload_nginx return expected rc and logs.

9.2 Security / Negative
	•	Wrong OTP: 3+ attempts → rate limit; SIEM alert after threshold.
	•	Expired OTP: TTL 120s → reject with code_expired.
	•	Invalid attestation: mobile attestation “basicIntegrity=false” → deny OTP.
	•	Bootstrap replay: reuse sealed bundle after exp → 401 expired_bundle.
	•	ForceCommand misuse: attempt command=cat /etc/shadow → dispatcher rejects, alert raised.
	•	Redis outage: OTP endpoints return 503; recovery resumes cleanly.
	•	SIEM outage: logs buffered, siem_outage events emitted; back-pressure and later drain.
	•	Geo/ASN bypass: login from off-policy ASN → policy engine denies or requires admin approval; SIEM alert.
	•	TLS pinning test: swap Backend cert → desktop/mobile refuse.

⸻

10) Risk Register & Open Questions

10.1 Backend-Specific Risks

Risk	Impact	Likelihood	Mitigation	Residual
OTP replay / brute	Medium	Medium	TTL=120s, rate limit, bind to login_id+device_id, hash in Redis	Low
Redis outage	Medium	Medium	HA Redis, circuit breaker, backoff, alerting	Low
SSH misuse / command injection	High	Low-Med	ForceCommand allowlist, no-pty, validated args, firewall to Backend IP	Low
HPKE key mismanagement	High	Low	Keys in KMS/HSM, rotation, access controls, audit	Low
SIEM ingestion lag	Medium	Medium	Dual-path shipping, back-pressure, alerts	Low-Med
Pin-roll failure (brick clients)	High	Low	Primary+backup pins, staged roll, telemetry, runbook	Medium
DB migration error	Medium	Low-Med	Blue/green migrations, backups, rollback plan	Low

10.2 Open Questions
	•	Finalize ForceCommand argument schemas (strict JSON validation on both ends).
	•	Confirm SIEM field dictionary and retention per tenant.
	•	Which tenants require degraded attestation mode (if vendor outages occur)?
	•	Desktop TPM attestation scope & timeline.

⸻

End of viworks_backend.md