Awesome—your agent is production-ready and outbound-only (WebSocket, mTLS, SPKI pinning, command allowlist, telemetry frames). I’ll give you a backend-side implementation plan that plugs into this with minimal risk and zero breaking changes, plus a packaging recommendation. I’ll reference the agent’s current capabilities where useful.  ￼

⸻

Backend “Agent Gateway” – Minimal-Risk Implementation Plan

0) Packaging & Deployment Recommendation

Goal: Let agents (in many sites) initiate outbound mTLS WebSocket connections to your control plane, without destabilizing existing user/auth APIs.
	•	Option A (fastest, minimal change — RECOMMENDED for now):
Add an “agent-gateway” module inside your existing backend container, exposed under a new path (e.g., /agent/ws), with its own config/env, logs, and health endpoints.
	•	Pros: one deployable, no new DNS; smallest blast radius of change.
	•	Cons: same process—heavy agent traffic could contend with API if misconfigured (we’ll isolate via threadpools and rate limits).
	•	Option B (cleaner long-term):
A separate agent-gateway microservice container behind the same Nginx, own autoscaling and threadpools.
	•	Pros: isolation, horizontal scaling per agent traffic; easier perf/SLOs.
	•	Cons: another service to run/monitor.

Start with A, keep code in a separate crate/module so you can promote to B later with no logic changes.

⸻

1) Public Interface (Backend)

Add a new WebSocket endpoint and two REST endpoints:
	•	GET /agent/ws
	•	Upgrade to WebSocket only if client mTLS is verified and agent certificate matches your CA/profile.
	•	On connect, agent sends HELLO (agent_id, site/env, version, capabilities).
	•	Backend replies WELCOME (server nonce, session_id, heartbeat config).
	•	WS subprotocol: viworks-agent-v1.
	•	No auth cookies/JWT here—mTLS is the primary auth; optionally a per-agent HMAC on frames for MAC-level integrity (see §4).
	•	POST /agent/commands/:agent_id
	•	Admin/API drops a command envelope for a connected (or soon-to-be connected) agent.
	•	If connected: immediate dispatch; else: buffer (short-TTL) and return queued.
	•	Idempotent via correlation_id.
	•	GET /agent/telemetry/:agent_id/latest
	•	Returns last TelemetryFrame & basic status used by Admin Panel. (You can expand later to paged history.)

All routes are additive; nothing in existing /api/v1/* changes.

⸻

2) mTLS, Identity, and Nginx

Keep the agent outbound-only model. Do mTLS at the edge and propagate identity inward:
	•	Nginx (edge)
	•	Terminate TLS with client certificate verification (ssl_verify_client on).
	•	Trust your Agent-Intermediate CA only.
	•	On success, forward identity headers to backend (e.g., X-SSL-Client-Verify: SUCCESS, X-SSL-Client-Fingerprint, X-SSL-Client-DN, X-SSL-Client-SAN).
	•	Only Nginx sets these headers; backend rejects requests missing them or not from the internal Nginx network.
	•	Enable WebSocket upgrade/proxy timeouts suitable for long-lived sessions.
	•	Backend (app layer)
	•	Validate: X-SSL-Client-Verify == SUCCESS, fingerprint/SAN match an enrolled agent (agent_id, site, status=active).
	•	Check CRL/OCSP (or edge does it) for revoked agent certs.
	•	Optionally require Agent Version ≥ min_version (feature gating).

This matches your agent’s current mTLS + SPKI pinning expectations (the agent pins your server SPKI; you verify the agent cert).  ￼

⸻

3) Session Lifecycle (WebSocket)
	1.	TLS+mTLS handshake via Nginx → backend gets verified client identity.
	2.	HELLO (agent → backend): {agent_id, site, version, capabilities[], supported_verbs[], now, nonce}.
	3.	WELCOME (backend → agent): {session_id, heartbeat_s, cmd_timeout_s, now, server_nonce}.
	4.	HEARTBEAT bidirectional (e.g., every 20–30s). Backend drops session if missed N intervals.
	5.	TELEMETRY (agent → backend): periodic system health, services, containers consistent with agent doc. Backend stores last state and append-only event rows for charts.  ￼
	6.	COMMAND/RESULT exchange as needed (see §4–§5).
	7.	GRACEFUL CLOSE or server-initiated terminate (e.g., rotate key, maintenance).

⸻

4) Envelope & Security (without code)

To keep MVP minimal but safe:
	•	Envelope fields (both directions)
type, correlation_id, agent_id, issued_at, expires_at, nonce, verb, args{} or data{}, error{code,msg}
	•	Validity checks
	•	Clock skew: ±60s; expires_at ≤ 60s from issued_at.
	•	Nonce cache (LRU per session) to block replays (e.g., remember last 256 nonces).
	•	Verb allowlist matches the agent’s 16 commands (user, VPN, containers, telemetry).  ￼
	•	Integrity
	•	Phase 1: rely on mTLS + in-memory session key to tag frames (e.g., server adds random session_key_id; agent echoes; backend tracks).
	•	Phase 2 (hardening): add JWS (HMAC-SHA256) over envelope with per-agent secret stored in backend (rotatable).
	•	Phase 3: Ed25519 per-agent keypair for detached signatures (rotate via command).

Your agent doc already mentions signed envelopes as a future step; we’re staging it to avoid breaking changes.  ￼

⸻

5) Command Routing & Backpressure
	•	In-memory session map: agent_id → ws_handle, capabilities, last_seen.
	•	Dispatch path: Admin action → /agent/commands/:agent_id → enqueue (bounded) → send over WS.
	•	Response: Agent replies RESULT with correlation_id; backend updates the admin job status.
	•	Backpressure:
	•	Max in-flight per agent (e.g., 4) to match agent max_concurrency.  ￼
	•	If queue full → 429 Retry-After.
	•	Offline agent: Return queued and keep short-TTL pending queue (e.g., 60s) or reject with agent_offline—your call.

⸻

6) Data Model (minimal, non-breaking)
	•	agents (id, fingerprint, site, version_min, status, notes, created_at, updated_at)
	•	agent_sessions (session_id, agent_id, connected_at, last_heartbeat_at, remote_ip)
	•	agent_commands (id, agent_id, verb, args_json, status, result_json, created_at, completed_at)
	•	agent_telemetry_latest (agent_id PK, payload_json, updated_at)
	•	agent_events (append-only, type, payload_json, ts) – optional for charts

No changes to existing user/session tables. Add as a new schema/namespace to avoid conflicts.

⸻

7) Nginx + Infra (safe defaults)
	•	New upstream location for /agent/ws with WebSocket upgrade and client cert verify ON.
	•	Restrict by source IP if feasible (e.g., allow only your agent subnets/VPN).
	•	Read timeout high enough (e.g., 75–120s) to keep WS open.
	•	Access logs include $ssl_client_fingerprint for correlation.

If you prefer end-to-end mTLS (not terminating at Nginx), you can run a stream block and hand raw TLS to the backend listener dedicated to agents. For MVP, terminating at Nginx is simpler and battle-tested.

⸻

8) Observability & Safety Rails
	•	Structured logs on connect/HELLO/WELCOME/HEARTBEAT/COMMAND/RESULT with agent_id, correlation_id, durations, rc.
	•	Metrics: active_sessions, heartbeats_missed, commands_inflight, queue_depth, dispatch_latency_ms.
	•	SLOs: 99% dispatch latency < 2s at p50, < 5s at p95; connection uptime > 99%.
	•	Rate limits: per IP and per agent_id on /agent/ws and /agent/commands/*.
	•	Feature flags: AGENT_WS_ENABLED, AGENT_ENVELOPE_JWS_REQUIRED=false (for staged rollout).

⸻

9) Rollout (additive, reversible)
	1.	PR-1 (backend only)
	•	Add agent DB tables (additive).
	•	Add /agent/ws, /agent/commands/*, /agent/telemetry/* handlers behind AGENT_WS_ENABLED=false.
	•	Add health: /agent/_health returns “disabled”/“enabled”.
	2.	PR-2 (Nginx + certs)
	•	Configure client-auth TLS for /agent/ws.
	•	Deploy agent-intermediate CA bundle on Nginx.
	•	Turn on AGENT_WS_ENABLED=true in staging.
	3.	PR-3 (single canary agent)
	•	Point one production gateway agent to staging backend.
	•	Verify HELLO/WELCOME/TELEMETRY only.
	•	Soak for a day.
	4.	PR-4 (commands canary)
	•	Enable two verbs only: create_panel_user, create_openvpn_user.
	•	Confirm they execute server scripts via your Rust agent (which already shells to /opt/Viworks/scripts_viworks/...).  ￼
	5.	PR-5 (admin UI wiring)
	•	Show agent online, last telemetry, Command → In-flight/Done.
	•	No changes to end-user flows.
	6.	Scale-out
	•	Add remaining verbs; tune timeouts/backpressure; consider moving to Option B (separate microservice) if load warrants.

⸻

10) Security Notes (fit your model)
	•	Agent side already: outbound-only, SPKI pinning, allowlist, nonces, time-boxed envelopes, max concurrency.  ￼
	•	Backend side now: strict mTLS identity, replay/expiry checks, bounded queues, per-agent rate limits, audit logs.
	•	Key rotation: Replace agent certs via normal PKI rotation; backend trusts new Issuer; mark old cert fingerprint as revoked in agents table.
	•	Multi-site: Use site/env tags from HELLO to group status and apply policy filters.

⸻

11) What not to do (to avoid breakage)
	•	Don’t reuse existing /api/v1/* auth/JWT for agents. Keep the agent realm separate.
	•	Don’t require DB schema changes in user/session tables. Additive only.
	•	Don’t send oversized telemetry blobs—cap payload and frequency (start with 30s).

⸻

12) Acceptance Criteria
	•	Agent can connect via /agent/ws (mTLS verified), HELLO/WELCOME succeed.
	•	Admin can queue a command; if agent online → delivered; else → queued.
	•	Agent sends telemetry; Admin sees online/metrics.
	•	All events logged with correlation IDs; no user-facing APIs impacted.
	•	Feature flag allows instant disable/rollback.

⸻

13) “Cursor-ready” high-level prompt (no code, safe to run)

Goal: Add an agent-gateway to the backend with a mutual-TLS WebSocket at /agent/ws, plus /agent/commands/:agent_id and /agent/telemetry/:agent_id/latest. Keep this additive and behind a feature flag.

Do:
	1.	Create a new backend module (or crate) agent_gateway with: WS handler (HELLO/WELCOME/HEARTBEAT/TELEMETRY/COMMAND/RESULT), session map, bounded queues, replay/expiry checks, and structured logging/metrics.
	2.	Add minimal tables (agents, agent_sessions, agent_commands, agent_telemetry_latest). No changes to existing user tables.
	3.	Add envs: AGENT_WS_ENABLED, AGENT_CA_BUNDLE, AGENT_CLIENT_DN_POLICY, AGENT_QUEUE_MAX, AGENT_ENVELOPE_JWS_REQUIRED.
	4.	Implement Nginx path for /agent/ws with client cert verify ON, forwarding client fingerprint/DN headers only from Nginx. Backend rejects if headers missing or X-Forwarded-For not from trusted subnet.
	5.	Implement command verbs initially for two actions only: create_panel_user and create_openvpn_user; map to the agent verbs already available.
	6.	Implement telemetry acceptor: store latest payload, update “last seen” and site/version fields.
	7.	Add health endpoint /agent/_health and metrics counters.
	8.	Wire Admin UI to display agent online, last telemetry, and command status for a single canary agent.

Don’t: Touch existing /api/v1/* routes; change user auth; introduce breaking schema changes.

Exit criteria: One production agent connects; HELLO/WELCOME; telemetry visible; one command executes end-to-end.

⸻

This plan lines up with your agent’s current production-ready design (outbound WebSocket, mTLS, allowlisted commands, telemetry) and gets you to a working backend integration without destabilizing anything you already have. Once the canary is solid, we can talk about promoting the agent-gateway to its own microservice and turning on signed envelopes.  ￼




------------- 

Great question. You’ve got two good ways to run the gateway agent on each OS node, and the communication patterns are slightly different in terms of how the agent touches the host, not how it talks to the backend.

Below is a clear blueprint focused on a standalone (containerized) agent that still lets you (a) pull host logs/metrics and (b) execute allowed actions (user create/terminate, session kill) safely—plus a simpler “host-native systemd” mode you can keep using until you’re ready.

⸻

A) Recommended containerized model (agent container + tiny host helper)

Why this shape

A container alone can’t safely run /opt/Viworks/scripts_viworks/*.sh, reload OpenVPN, or touch fwknop without broad privileges. Giving the container high privileges defeats the point. The safer pattern is split-privilege:
	•	Unprivileged agent container: owns the outbound WebSocket to backend, does command validation, rate-limits, telemetry, buffering.
	•	Minimal host helper (systemd service): runs on the host with least privileges to execute a tiny allowlist of actions (create panel user, create OpenVPN/fwknop user, terminate session, tail logs), exposed only via a local Unix domain socket.

Communication map

[Backend control-plane]
        ▲          ▲
        | WS/mTLS  | HTTPS (admin uses backend)
        |          |
        |      (enqueue command)
        |          |
        |    ┌──────────────┐
        |    │ Agent WS Hub │  /agent/ws  (mTLS)
        |    └──────────────┘
        |           ▲
        |   WS: HELLO/COMMAND/RESULT/TELEMETRY
        |           │
        ▼    (egress only, SPKI pin)
┌──────────────────────────────────────────────────────┐
│           Agent container (least-priv)              │
│  - Command allowlist & schema                       │
│  - Nonce/expiry checks                              │
│  - Telemetry collection                             │
│  - Talks to host only via UDS                       │
│             │                                       │
│   UDS (/run/viworks/host_helper.sock)               │
└─────────────┼────────────────────────────────────────┘
              │  local, authenticated, HMAC-ed
┌─────────────▼────────────────────────────────────────┐
│        Host helper (systemd unit, least-priv)       │
│  - Verifies request (agent_id, HMAC, nonce, TTL)    │
│  - Executes *only allowlisted* actions via sudoers: │
│     • /opt/Viworks/scripts_viworks/add_user.sh      │
│     • /opt/Viworks/scripts_viworks/add_vpn_user.sh  │
│     • systemctl reload openvpn@viworks              │
│     • fwknop config updates                         │
│  - Tails journal/logs (read-only)                   │
│  - Returns structured JSON (rc, stdout, stderr)     │
└──────────────────────────────────────────────────────┘

What each piece does
	•	Agent container
	•	Keeps the outbound mTLS WebSocket to backend (no inbound ports).
	•	Receives command envelopes → validates (verb allowlist, schema, nonce, expiry) → forwards a minimal action to the host helper if required.
	•	Sends RESULT envelopes to backend with rc/stdout/stderr and normalized error codes.
	•	Periodically collects telemetry (CPU/RAM/disk, container counts, service health); for host-level stats it calls the helper’s read-only endpoints rather than mounting host namespaces.
	•	Never executes arbitrary shell; it only calls helper verbs.
	•	Host helper (systemd service)
	•	Listens on Unix domain socket (e.g., /run/viworks/host_helper.sock), owned root:viworks, 0660.
	•	Requires HMAC (shared secret file root-only) + nonce + TTL from the agent container; drops requests failing validation.
	•	Maps verbs → exact commands (no user input in argv positions that can break out). Uses sudo with a locked-down sudoers file that whitelists only the exact binaries/args needed.
	•	Can tail journald with cursors (e.g., “give me last 100 lines since cursor X”) and return JSON lines.

Security controls that matter
	•	No inbound on the host for agent. Agent egress is only to backend FQDN:443 (enforce with host firewall or container egress policy).
	•	mTLS + SPKI pinning on the agent’s WebSocket to backend.
	•	UDS only between container and helper, not TCP.
	•	Helper is not a shell; it is a small RPC dispatcher with: fixed verbs, fixed args, seccomp/AppArmor, NoNewPrivileges, and a very tight sudoers.
	•	All actions generate structured audit logs: (agent_id, verb, args_hash, rc, duration_ms, stdout_crc32, stderr_crc32) to journald; agent forwards summaries to backend.

How you get logs & status into the backend UI
	•	Backend → WS → Agent: “tail_logs {unit: ‘openvpn@viworks’, lines: 200, since_cursor: ‘…’}”
	•	Agent → Host helper: UDS request → returns JSON with lines + next cursor
	•	Agent → Backend: RESULT with lines (or summarized) → backend stores for the admin panel.
	•	Likewise for system health (helper exposes read-only endpoints for CPU/RAM/load), containers list, service status, etc.

Executing user/session actions from backend
	•	Admin clicks “Create user” → Backend enqueues command → Agent receives create_openvpn_user {username, userpass, source_ip, key, hmac_key, timeout} → Agent validates → Host helper runs /opt/Viworks/scripts_viworks/add_vpn_user.sh … (exact argv), captures rc/stdout/stderr → returns → Agent sends RESULT to backend → Admin sees green check or exact error.

This preserves your current scripts and operational model, but confines their execution to a small, attestable path.

⸻

B) Simpler mode (what you already did): host-native systemd agent

If you’re happy with the current release build + systemd on the host, keep it for now:
	•	The agent runs on the host (root or a dedicated service user with controlled sudoers).
	•	It can directly run /opt/Viworks/scripts_viworks/*.sh, read journald, and manage OpenVPN/fwknop.
	•	Outbound WebSocket to backend remains exactly the same.
	•	Risk: the agent process holds more local power than the containerized split model; mitigate with SystemCallFilter, CapabilityBoundingSet, NoNewPrivileges, and strict input validation.

This is perfectly fine for first production; you can migrate to the container+helper split later with no backend change (the WS protocol is identical).

⸻

Deployment checklist (container + helper)
	1.	Host helper (systemd)

	•	Install viworks-host-helper binary + unit file:
	•	ListenStream=/run/viworks/host_helper.sock, SocketUser=root, SocketGroup=viworks, SocketMode=0660
	•	NoNewPrivileges=yes, PrivateTmp=yes, ProtectSystem=strict, ProtectHome=yes, CapabilityBoundingSet=CAP_DAC_READ_SEARCH CAP_SYS_ADMIN (only if truly needed), else keep minimal.
	•	SystemCallFilter=@system-service @mount -ptrace -keyring (tune to your scripts).
	•	/etc/sudoers.d/viworks-helper: allow only exact script paths with exact argv positions (no wildcards).
	•	Place shared secret at /etc/viworks/host_helper.secret (mode 0400).

	2.	Agent container

	•	Run as non-root, --cap-drop=ALL, read-only filesystem, tmpfs for /tmp.
	•	Mount only /run/viworks/host_helper.sock from host.
	•	Egress allowlist to backend FQDN:443.
	•	Configure outbound WS URL, mTLS certs, SPKI pin, and HMAC key reference (the agent holds the client key/cert for mTLS to backend; only the helper holds local sudo power).

	3.	Backend

	•	Provide /agent/ws (mTLS, subprotocol), /agent/commands/:agent_id, /agent/telemetry/:agent_id/latest.
	•	Store last telemetry and command results; show in Admin UI.

	4.	Observability

	•	journald on host logs helper actions; agent logs structured JSON; backend logs agent events with correlation_id.
	•	Alert on: repeated command failures, helper unreachable, heartbeats missed.

⸻

Failure scenarios & recovery
	•	Helper down: Agent marks helper as unavailable, sends error results; backend shows red status; systemd restarts helper.
	•	Agent WS down: Agent exponential backoff reconnect; keeps no sensitive disk buffers; telemetry lost is acceptable; commands get NACK’d.
	•	Script non-zero rc: Return rc + truncated stdout/stderr, do not retry automatically unless idempotent.
	•	Log floods: Apply server-side sampling (e.g., first 200 lines), then “expand on demand.”

⸻

What to ask Cursor to build (high level, no code)

Goal: Run the gateway agent as an unprivileged container that talks outbound to the backend via mTLS WebSocket and talks locally to a least-privileged host helper over a Unix domain socket for host actions (scripts, service reloads, logs).

Deliverables:
	1.	A minimal host helper (systemd service) with a Unix socket at /run/viworks/host_helper.sock, an HMAC-authenticated RPC with verb allowlist: create_panel_user, create_openvpn_user, terminate_session, stop_container, tail_logs, get_system_health, get_service_status, list_containers. Each verb maps to exact commands or read-only journal queries; results must be structured JSON {rc, stdout, stderr, duration_ms}. Include a tightly scoped sudoers file and systemd hardening.
	2.	Update the agent container to call the helper over UDS (no TCP), enforce nonce/TTL/HMAC, and keep the existing outbound WS protocol to backend unchanged.
	3.	Add a log tail verb that supports “since cursor” semantics (journald cursor) and a service status verb for OpenVPN/fwknop.
	4.	Write deployment docs for both modes: container+helper and host-native systemd (current), so we can choose per site.

Constraints:
	•	No inbound ports exposed on agent or helper.
	•	No broad privileges to the agent container.
	•	Exact allowlist for helper commands; no shell interpolation.
	•	Structured audit logs at each hop with agent_id and correlation_id.

Acceptance:
	•	From backend, I can issue create_openvpn_user and see success/failure + rc/stdout/stderr in Admin UI within 5s.
	•	I can fetch last 200 lines of OpenVPN logs and a “next cursor” to paginate.
	•	Telemetry updates every 30s; heartbeat stable; no inbound exposure.

⸻

If you want the simplest path today

Keep your systemd agent (host-native) and add only the backend WS hub. It already works and requires no helper. The split model above is for when you want least-privilege separation without giving the container broad control.




-----------------------


Here’s a safe, additive prompt you can paste into Cursor. It keeps your current backend untouched and stable, and creates a separate, opt-in microservice (agent-bridge) to accept the agent’s outbound WebSocket—so no CI/CD breakage, no surprise restarts.

⸻

Prompt for Cursor — Non-breaking backend side for agent connectivity

Context & constraints
	•	The gateway agent is already running on the OS and uses an outbound WebSocket (wss) to a backend endpoint.
	•	We must not break the existing backend container or CI/CD.
	•	Implement the backend side as a separate microservice in the same repo (Rust/Actix), built as a separate binary & Docker target, not referenced by the main backend container or its compose by default.
	•	No DB migrations. No changes to existing admin/user auth flows. No Nginx changes in this PR.
	•	Goal: a minimal, production-grade Agent Bridge that can (1) accept connections from agents, (2) keep them alive, (3) receive telemetry frames, (4) echo back test commands later, and (5) expose read-only admin endpoints for visibility. We’ll wire commands and SIEM later.

⸻

1) New microservice scaffold (no coupling, no migrations)
	•	Create a new crate/binary in @backend/ named agent-bridge (Rust, Actix-Web).
	•	Do not import or depend on the main backend binary; keep it standalone.
	•	Add a multi-stage Dockerfile target named agent-bridge (don’t touch the existing targets).
	•	Add an optional docker-compose.agent-bridge.yml with a service agent-bridge that:
	•	Is not included in any default compose file.
	•	Exposes port 8082 internally only.
	•	Uses env vars from a new .env.agent-bridge file (not required by CI).

Acceptance: cargo build -p agent-bridge succeeds; docker build --target agent-bridge succeeds; main backend build is unchanged.

⸻

2) Config & env (runtime gated)
	•	Config file support (read if present): config/agent-bridge.toml.
	•	Env vars (all optional, with sane defaults):
	•	AGENT_BRIDGE_ENABLED (default: false) — gateway to start HTTP server.
	•	AGENT_BRIDGE_BIND (default: 0.0.0.0:8082)
	•	AGENT_BRIDGE_SHARED_SECRET (optional) — HMAC for per-message auth.
	•	AGENT_BRIDGE_ALLOWED_AGENT_IDS (CSV, optional) — allowlist filter.
	•	AGENT_BRIDGE_MAX_CONN (default: 100)
	•	AGENT_BRIDGE_LOG_JSON (default: true)
	•	If AGENT_BRIDGE_ENABLED=false, the service should start and exit 0 immediately with a clear log (“disabled”). This avoids noisy restarts.

Acceptance: Running without envs logs “disabled” and exits 0.

⸻

3) WebSocket endpoint for agents (wss path only, no public pages)
	•	HTTP server (Actix-Web) with one WebSocket route: GET /agent/ws.
	•	Handshake headers required:
	•	X-Agent-Id: <string>
	•	X-Agent-Auth: <HMAC-SHA256> over method|path|timestamp|nonce|agent_id using AGENT_BRIDGE_SHARED_SECRET.
	•	X-Timestamp (UTC ISO8601) and X-Nonce (UUIDv4).
	•	Reject if:
	•	secret unset but X-Agent-Auth present (or vice versa).
	•	timestamp ±5 minutes window fails.
	•	nonce replay (keep a small in-memory LRU set with TTL 5 min).
	•	agent_id not in allowlist (if allowlist is set).
	•	On connect:
	•	Store connection in an in-memory registry keyed by agent_id. Use DashMap<String, AgentConnMeta>.
	•	Send a HELLO JSON frame:

{"type":"HELLO_ACK","server_time":"...","supported":["HELLO","TELEMETRY","RESULT","PING","PONG"],"agent_id":"...","conn_id":"..."}


	•	Start ping/pong: server pings every 20s; disconnect if no pong in 40s.
	•	Backpressure: limit outbound queue per connection (e.g., 1,000 messages or 5 MB).

	•	Message types (JSON; schema checked, but no DB writes):
	•	HELLO: { "type":"HELLO", "agent_id":"...", "capabilities":["create_openvpn_user", ...], "version":"x.y.z" }
	•	TELEMETRY: { "type":"TELEMETRY", "agent_id":"...", "ts":"...", "metrics":{...} }
	•	RESULT: { "type":"RESULT", "agent_id":"...", "correlation_id":"...", "status":"success|error", "rc":0, "stdout":"...", "stderr":"..." }
	•	PONG: keepalive
	•	For now: queue telemetry in memory only (per-agent ring buffer, e.g., last 50 frames). No persistence. If memory pressure, drop oldest.

Acceptance: Connect with a test client and see HELLO_ACK; send TELEMETRY and see it listed via admin endpoints (below).

⸻

4) Minimal admin read-only HTTP endpoints (local only)

Add a small, read-only admin surface (JSON) under /internal/agent:
	•	GET /internal/agent/_healthz → { "status":"ok", "uptime_s":..., "connections":N }
	•	GET /internal/agent/agents → list connected agents with {agent_id, connected_at, last_seen, ip, version}
	•	GET /internal/agent/agents/:agent_id/telemetry → last N telemetry frames (from in-memory buffer)
	•	GET /internal/agent/agents/:agent_id/last-result → last RESULT (if any)

Security (for now):
	•	Bind on 0.0.0.0:8082 but document that ops must firewall it to internal/VPN only.
	•	Add a simple admin bearer token gate via AGENT_BRIDGE_ADMIN_TOKEN (optional). If set, require header Authorization: Bearer <token>.

Acceptance: curl to _healthz returns JSON; telemetry endpoint returns agent’s last frames after a WS session pushes data.

⸻

5) Structured logging & stability
	•	Always log in structured JSON when AGENT_BRIDGE_LOG_JSON=true with fields: ts, level, msg, conn_id, agent_id, ip, event, error, rc, duration_ms.
	•	Never panic the process on WS errors. All handler errors are caught, logged, and connection is closed gracefully.
	•	Process exit rules:
	•	If enabled and bind fails → exit non-zero with clear message.
	•	If enabled and runtime error occurs, keep serving—don’t crash the whole process.
	•	Metrics counters (in-memory): connections current/total, messages in/out, dropped frames.

Acceptance: Load test with a mock client; no panics; logs show structured events; registry remains consistent after disconnects.

⸻

6) Command enqueue skeleton (no real side-effects yet)

Prepare the shape for future admin → agent commands, but do not send anything by default:
	•	POST /internal/agent/agents/:agent_id/commands with body:

{ "correlation_id":"...", "type":"ECHO", "payload":{"message":"..."}, "ttl_s":30 }


	•	For now, if the agent is connected:
	•	Validate schema, check connection queue budget, enqueue to that socket.
	•	Return 202 Accepted with {queued:true}.
	•	If agent missing, return 404.

Acceptance: With a dev agent that echoes RESULT, we can observe 202 + a RESULT frame arriving and visible at /last-result. If no agent, 404 (no crash).

⸻

7) Packaging without touching your current CI/CD
	•	Do not add the new target to your main CI build matrix yet.
	•	Provide a Makefile target and docs to build/run manually:
	•	make agent-bridge-build
	•	docker build -t viworks/agent-bridge:dev --target agent-bridge .
	•	docker compose -f docker-compose.agent-bridge.yml up --build
	•	Provide a RUNBOOK.md with:
	•	Env examples (.env.agent-bridge).
	•	How to run locally with self-signed TLS terminated by a local reverse proxy (optional).
	•	How to test via wscat or the real agent (HELLO, TELEMETRY).

Acceptance: Team can bring up agent-bridge locally or in a lab without touching the main backend container.

⸻

8) Non-goals (to avoid scope creep now)
	•	No database writes or schema changes.
	•	No Nginx changes in this PR.
	•	No admin UI changes.
	•	No SIEM wiring.
	•	No mTLS termination in this service (we may put this behind existing TLS terminator later).
	•	No changes to main backend code or ports.

⸻

9) Success criteria for this PR
	•	agent-bridge builds and runs independently.
	•	The main backend container continues to build/run exactly as before.
	•	An agent can connect to /agent/ws, send HELLO and TELEMETRY, and we can see it via /internal/agent/agents/:id/telemetry.
	•	All networking/auth failures result in clear logs, not crashes.
	•	Everything is guarded by envs and off by default.

⸻

10) Next PR (later, not now)
	•	Add command verbs (create_openvpn_user, create_panel_user, terminate_session) and forward to the agent using the existing envelope.
	•	Add mTLS or proxy-passed client-cert info at the edge when we wire behind Nginx.
	•	Plumb limited summaries into the Admin Panel (read-only cards).

⸻

Please implement exactly the above. Keep changes minimal, additive, and off-by-default. Start with the scaffold + WS + telemetry listing + logging. No surprises to the main backend container or CI.




---------------------


Awesome—let’s design this so nothing breaks, the admin panel keeps talking only to the main backend, and we can scale to many gateways (OSs) cleanly.

Below is a Cursor-ready action plan, phase-by-phase. It explains what to build, why, and where the data flows, without forcing risky changes to your current backend container. You can paste this into Cursor and let it implement step by step.

⸻

Agent Connectivity & Multi-OS Management — Implementation Plan (Safe & Additive)

Guiding Principles
	•	No breaking changes to the current backend or admin panel.
	•	Additive microservices only; opt-in via feature flags.
	•	Admin panel → Backend (only). Backend is the single public API for the UI.
	•	Agent(s) connect outbound to a dedicated Agent Bridge microservice.
	•	Redis Streams for decoupled eventing (telemetry/commands/results).
	•	Postgres for inventory & durable state (not for high-frequency telemetry).
	•	Graceful rollout: new components run side-by-side, turned on only when stable.

⸻

Phase 0 — Repo, Build & Environment (No Runtime Changes)

Goal: Prepare scaffolding with zero risk to current services.
	1.	Create folders:
	•	services/agent-bridge/ — Rust/Actix WebSocket server for agents.
	•	workers/telemetry-writer/ — Rust/async worker to consume Redis Streams → Postgres.
	•	workers/results-writer/ — Rust/async worker to store command results/audit → Postgres.
	2.	Compose files (opt-in only):
	•	docker-compose.agent.yml — includes agent-bridge, telemetry-writer, results-writer disabled by default.
	•	Do not touch your current docker-compose.yml.
	3.	Env files (opt-in only):
	•	.env.agent-bridge, .env.telemetry-writer, .env.results-writer with defaults.
	•	Nothing required for your main backend yet.
	4.	Makefile targets:
	•	make agent-bridge-build | up | logs
	•	make telemetry-writer-build | up | logs
	•	make results-writer-build | up | logs

Acceptance: Repo builds cleanly; default stack unchanged; optional services can be built/run separately.

⸻

Phase 1 — Agent Bridge (WebSocket Hub)

Goal: Securely accept outbound connections from many agents (gateways), validate, keep alive, and publish their messages to Redis Streams.

1.1 Behavior
	•	WebSocket endpoint: GET /agent/ws (behind TLS at edge; the pod can be HTTP internally).
	•	Mandatory headers on handshake:
	•	X-Agent-Id
	•	X-Nonce (UUIDv4)
	•	X-Timestamp (ISO8601)
	•	X-Agent-Auth = HMAC-SHA256 over method|path|timestamp|nonce|agent_id using AGENT_BRIDGE_SHARED_SECRET.
	•	Reject on missing/invalid headers, skew > 5 min, or nonce replay (use in-memory LRU with TTL).
	•	On connect:
	•	Register connection in an in-memory registry keyed by agent_id.
	•	Send HELLO_ACK JSON frame.
	•	Start ping/pong (20s/40s). Backpressure: cap outbound buffer per connection.

1.2 Message Intake → Redis Streams
	•	Accept these frames from agent (JSON, schema validated):
	•	HELLO
	•	TELEMETRY
	•	RESULT
	•	HEARTBEAT
	•	For each valid frame, XADD to Redis Streams:
	•	viw.telemetry (for TELEMETRY)
	•	viw.agent_hello (for HELLO)
	•	viw.command_results (for RESULT)
	•	Minimal per-agent in-memory ring-buffer (e.g., last 50 telemetry frames) for quick admin introspection endpoints (local, read-only).

1.3 Outbound Commands (from Backend → Agent)
	•	Do not expose public HTTP to the admin panel.
	•	Subscribe to Redis Stream viw.commands with a consumer group, filter by agent_id.
	•	When command arrives and the agent is connected:
	•	Enqueue to that WebSocket (respect per-socket backpressure).
	•	If agent is offline or queue full, NACK the message (stay pending).
	•	Agent will return RESULT frames; publish them to viw.command_results.

1.4 Minimal internal endpoints (ops only)
	•	GET /internal/agent/_healthz → connections count, uptime.
	•	GET /internal/agent/agents → connected agents snapshot.
	•	GET /internal/agent/agents/:id/telemetry → last N frames from memory.
	•	Protect via AGENT_BRIDGE_ADMIN_TOKEN (Bearer). Firewall to internal network only.

Acceptance:
	•	Multiple OS agents connect and push telemetry.
	•	Frames appear in Redis Streams.
	•	Commands published into viw.commands reach the respective agent and RESULT frames appear in viw.command_results.

⸻

Phase 2 — Workers (Streams → Postgres)

Goal: Decouple high-volume data; write only what’s needed to Postgres; keep admin panel fast.

2.1 workers/telemetry-writer
	•	Input: viw.agent_hello, viw.telemetry (Redis Streams).
	•	Logic:
	•	On HELLO: upsert os_gateways table (agent registry):
	•	agent_id, hostname, version, first_seen, last_seen, site, labels.
	•	On TELEMETRY: upsert a current snapshot table (one row per agent):
	•	os_gateway_status: CPU, mem, disk, container counts, service health, updated_at.
	•	Optional: append a downsampled time-series table (e.g., 1 point / 60s) for historical charts.
	•	Resilience: Use Redis consumer groups (ack on successful write). On failure, retry with backoff.

2.2 workers/results-writer
	•	Input: viw.command_results.
	•	Logic:
	•	Append to agent_command_results (audit log): correlation_id, agent_id, command, rc, status, stdout/stderr (redacted), started_at, finished_at.
	•	Update agent_commands table row if it exists (status done/failed).
	•	Redaction: Apply server-side filters for secrets (e.g., passwords in stdout).

Acceptance:
	•	Postgres holds inventory & latest status per agent.
	•	Results are durably stored for admin auditing.
	•	No schema change to your current user/tunnel tables is required.

⸻

Phase 3 — Backend (Tiny, Additive APIs Only)

Goal: Keep the admin panel pointing to backend only, while backend itself does not talk to agents directly. Backend just writes to/read from Redis/Postgres.

These are small, additive endpoints under /admin/api and do not impact user auth/tunnel logic.

3.1 Read APIs (admin pane needs visibility)
	•	GET /admin/api/gateways
	•	List from os_gateways joined with os_gateway_status (latest snapshot).
	•	GET /admin/api/gateways/:agent_id
	•	Details + last N results.
	•	GET /admin/api/gateways/:agent_id/containers
	•	Read from snapshot (or Redis cache if you prefer).

3.2 Command APIs (admin actions)
	•	POST /admin/api/gateways/:agent_id/commands
	•	Body: { command, parameters, ttl_s }.
	•	Backend does not call agent; it XADDs to viw.commands with correlation_id, agent_id, command, params, issued_by_admin_id.
	•	Return 202 Accepted + correlation_id.
	•	GET /admin/api/gateways/:agent_id/commands/:correlation_id
	•	Return last known status (backend reads from agent_command_results or a small Redis cache keyed by correlation_id).

Why this split?
	•	Admin panel remains unchanged architecturally (always calls backend).
	•	Backend stays stateless for agent I/O; Redis provides the queue; workers provide durability.
	•	You can scale agent-bridge horizontally; Redis Streams ensure at-least-once delivery.

Acceptance:
	•	Admin can see gateways and their current health.
	•	Admin triggers “create user” → backend enqueues → agent executes → result appears → admin sees status.

⸻

Phase 4 — Multi-OS Inventory & Flows

Goal: Support adding/removing gateways (OSs) and correlating sessions.

4.1 Gateway Inventory
	•	Table: os_gateways (managed by telemetry-writer on HELLO upserts and by backend for human metadata).
	•	Backend endpoint: POST /admin/api/gateways/register
	•	Creates an intended record (agent expected) with human-friendly name, site, labels.
	•	When the real agent connects and sends HELLO, the writer matches agent_id and sets status → connected.
	•	Backend endpoint: DELETE /admin/api/gateways/:agent_id
	•	Marks gateway as decommissioned (soft delete). A follow-up command to the agent can shut it down if connected.

4.2 User & Session Lifecycle (high level)
	•	Create user: Backend enqueues command {create_panel_user, create_openvpn_user, timeout, src_ip, keys...} to viw.commands for a given agent_id.
	•	Terminate session/user: Backend enqueues {terminate_session|delete_user}.
	•	Monitor: Admin queries backend → backend reads Postgres snapshots (and optionally Redis for last N seconds freshness).

⸻

Phase 5 — Security Controls (Minimal Now, Expand Later)
	•	Agent Bridge:
	•	HMAC on handshake headers (later: mTLS at edge).
	•	Nonce cache & timestamp window.
	•	Allowlist of agent_ids (env CSV) during early rollout.
	•	Internal admin endpoints behind Bearer token + network firewalling.
	•	Inter-service auth:
	•	workers/* connect to Redis/Postgres with service accounts (separate credentials).
	•	PII/log hygiene:
	•	Redact secrets from command stdout/stderr.
	•	Limit telemetry payload sizes, reject oversized frames.

⸻

Phase 6 — Ops & Rollout
	•	Start with one gateway and one agent-bridge instance.
	•	Turn on telemetry-writer first (read-only change).
	•	Add results-writer after first command run.
	•	Enable small set of backend admin endpoints guarded by your admin realm.
	•	Only then, point the admin panel UI to the new read APIs.

⸻

Data Flow (Answering “Where do logs/metrics go?”)
	•	Agent → Agent Bridge (WS) → Redis Streams
	•	viw.telemetry, viw.agent_hello, viw.command_results.
	•	Workers consume Streams → Postgres
	•	os_gateways (inventory), os_gateway_status (latest health), agent_command_results (audit).
	•	Admin Panel → Backend
	•	Read: backend reads Postgres (and optionally cache from Redis).
	•	Write: backend XADDs viw.commands → bridge delivers to the right agent.

This keeps the admin panel logic unchanged (only endpoints change), isolates high-churn flows in Redis, and keeps Postgres clean for queries.

⸻

Minimal Schemas (Additive, Guidance Only)

(Cursor can adapt to your existing DB—these are to orient the implementation)
	•	os_gateways(agent_id PK, display_name, site, labels jsonb, first_seen, last_seen, version, status)
	•	os_gateway_status(agent_id FK, cpu_pct, mem_pct, load1, containers_running, services jsonb, updated_at)
	•	agent_command_results(id PK, correlation_id, agent_id, command, status, rc, stdout_redacted, stderr_redacted, started_at, finished_at, issued_by_admin_id)

⸻

Acceptance Checklist
	•	Current backend/admin panel continue to run unchanged.
	•	agent-bridge accepts multiple agent connections; publishes to Redis Streams.
	•	telemetry-writer and results-writer persist to Postgres; retries on failure.
	•	Backend exposes new, additive admin endpoints to list gateways, show health, and enqueue commands.
	•	Admin can create a user → command runs on the right OS → result shown in UI.
	•	No container restart loops; clear logs and healthz available for each process.

⸻

Why this satisfies your concerns
	•	No tight coupling: Agent-bridge and workers are optional, isolated.
	•	No breakage: Backend changes are minimal (few new endpoints), everything else is side-carred.
	•	Scales to many OSs: One backend, many agent connections; Redis Streams manage fan-in/out.
	•	Security-first: Outbound-only agents; strict handshake; internal endpoints; redaction.
	•	Operational clarity: Clear queues, retries, and audit trail across Redis/Postgres.

⸻

One-line to Cursor to kick this off

“Implement Phases 0–2 exactly as specified (agent-bridge + telemetry-writer + results-writer with Redis Streams), without modifying existing backend endpoints or Nginx. Add minimal internal health endpoints and structured JSON logs. Provide a small README with run commands. Stop before Phase 3; we’ll wire backend admin endpoints after verification.”

When you’re ready, I’ll give you the Phase 3 prompt to add the tiny backend APIs and wire the admin panel to them.


