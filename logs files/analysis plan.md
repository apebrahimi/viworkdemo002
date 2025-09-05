You are debugging ViWorkS agent connectivity. Do not change configs or restart anything yet. First, produce a complete, non-destructive analysis and a written report.



Context (read carefully)
	•	Architecture: Gateway Agent(s) (on remote OS) must connect via WebSocket (WSS) to a Backend Agent “agent-bridge” that sits behind Nginx on the backend host.
	•	The Admin Panel (frontend) must never talk to agents. Only backend ↔ agents via the bridge.
	•	Known symptoms:
	1.	We previously saw multiple services on the Gateway host binding the same port (possible collision).
	2.	Even when the WS server appears up, the Backend Agent does not receive connections.
	3.	Nginx reverse proxy might be misconfigured for WebSockets and/or TLS (SNI/ALPN/SPKI), or auth (HMAC/mTLS) could be mismatched.

Goals
	1.	End-to-end, non-destructive root cause analysis of why Gateway Agent(s) are not connecting to the Backend Agent via Nginx.
	2.	Deliver a single comprehensive report at reports/agent_connectivity_report.md containing findings, evidence (logs/commands), and a minimal-risk fix plan.
	3.	Prepare actionable diffs (but do not apply) for Nginx and service configs if misconfig is found, saved under reports/suggested_diffs/….

Constraints
	•	No service restarts, no destructive changes. Read-only diagnostics only.
	•	If you must run commands, prefer safe, read-only commands (curl, openssl s_client, netstat/ss, docker inspect/logs).
	•	If something requires a change, propose a diff in the report; do not apply.

What to analyze (in this order)
	1.	Inventory & Topology (repo & runtime)
	•	Enumerate relevant directories and files:
	•	@backend agent/ or services/agent-bridge/ (WebSocket server),
	•	any workers/* writing to Redis/Postgres,
	•	nginx/ (vhosts, includes, snippets),
	•	agent config files (e.g., agent-outbound.toml, env files).
	•	Print (summarize) current WS endpoint path (e.g., /agent, /ws, etc.), expected domain (agent vhost), expected auth (HMAC or mTLS), SPKI pin if configured, and ports.
	•	Docker/compose inventory: list services, images, ports, networks; highlight the agent-bridge container and Nginx container.
	2.	Nginx WS Reverse Proxy correctness
	•	Identify the server block for the agent vhost (e.g., agent.<domain>). Extract exact config.
	•	Verify all required WS directives are present:
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade"; (or mapped variable)
proxy_read_timeout ≥ 75s (prefer 300s)
proxy_set_header Host $host;
proxy_set_header X-Forwarded-Proto $scheme;
	•	Confirm upstream target (container name:port) and that it matches the agent-bridge listener.
	•	Check TLS/SNI cert chain on the vhost; capture cert SANs and SPKI fingerprint.
	•	Output a minimal corrected server block if anything is missing (as a diff in reports/suggested_diffs/nginx_agent_vhost.diff).
	3.	Agent-Bridge listener health
	•	From inside the backend host/container context, verify the agent-bridge is listening on the expected port and path, and on the correct interface (e.g., 0.0.0.0:8082): use ss -ltnp or netstat -plnt.
	•	Using curl or a WS tester (wscat or websocket-client), perform a loopback WS handshake directly to the bridge (bypassing Nginx):
	•	Expect HTTP/1.1 101 Switching Protocols.
	•	Capture response headers.
	•	Repeat the handshake through Nginx (wss://agent.<domain>/<ws-path>). Confirm 101; if not, capture the failure (status, body, headers).
	4.	Auth & handshake preconditions
	•	Identify agent-bridge expected auth (HMAC header names and sample value or mTLS client cert requirement).
	•	Check Nginx is not stripping required headers (e.g., Authorization, custom HMAC headers) and that client certs are not mistakenly required at the edge if the bridge expects HMAC only.
	•	Validate clock skew: log current system time on both ends (more than ±60s may break nonces).
	•	Confirm CORS is irrelevant (WS is backend↔agent; browser not involved). Ensure no origin policy blocks WS (some WS servers enforce Origin).
	5.	DNS / SNI / ALPN / Cert path
	•	Resolve the agent vhost to the backend IP. Confirm SNI name matches cert.
	•	Use openssl s_client -connect agent.host:443 -servername agent.host -alpn http/1.1 to capture the certificate chain and alpn; ensure it’s HTTP/1.1 (WS requires HTTP/1.1 upgrade).
	•	Record the SPKI fingerprint; ensure it matches any pinned value in the Gateway Agent config.
	6.	Gateway Agent side checks (read-only)
	•	Extract Gateway Agent config (backend URL, exact WS path, HMAC key id/secret or client cert paths, SPKI pin).
	•	Confirm no local port collisions on the Gateway host: output ss -ltnp and identify if multiple services bind the same port (e.g., 8443).
	•	Check recent Gateway Agent logs around connection attempts; extract precise error messages (DNS failure, TLS error, 400/403 from server, HMAC signature invalid, ping/pong timeout).
	7.	Network policy / firewalls
	•	Confirm outbound TCP/443 from Gateway to the backend vhost is open. If custom port is used, verify that too.
	•	If Nginx listens on 443 but forwards to agent-bridge:8082, verify Docker network connectivity: docker exec into Nginx and curl http://agent-bridge:8082/health (or the bridge health URL). Capture results.
	8.	Message flow (sanity)
	•	If a connection succeeds, verify telemetry frames get to Redis Streams and Postgres via workers (without restarting anything). Capture XINFO STREAM viw.telemetry and a SELECT count(*) from the telemetry table (if safe).

Deliverables (must produce)
	1.	reports/agent_connectivity_report.md — Structured as:
	•	Summary of current state
	•	Inventory (containers, ports, domains, paths)
	•	Nginx analysis (vhost correctness for WS)
	•	Agent-bridge listener checks (direct vs via Nginx)
	•	Auth & TLS/SNI/SPKI findings
	•	Gateway Agent logs & port collision table
	•	Root cause(s) with evidence snippets
	•	Fix plan with minimal steps, prioritized (P0, P1, P2)
	•	Verification steps (explicit commands) for after fixes
	•	Rollback considerations
	2.	reports/suggested_diffs/ — If config problems are found, include unapplied diffs for:
	•	nginx vhost block (WS headers, timeouts, upstream)
	•	agent-bridge env or config (if path/port mismatch)
	3.	reports/commands_to_verify.txt — A short list of copy-paste commands (curl/openssl/wscat/redis-cli) to validate once we approve changes.

Evidence to include (examples)
	•	curl -vkI https://agent.<domain>/ (show server header/cert/SNI)
	•	curl -vk https://agent.<domain>/<ws-path> -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: test==" (show 101 or error)
	•	openssl s_client -connect agent.<domain>:443 -servername agent.<domain> -alpn http/1.1 -showcerts
	•	ss -ltnp / docker ps / docker inspect snippets
	•	Redacted Gateway Agent logs showing exact failure strings

Acceptance criteria
	•	The report clearly identifies why the Gateway Agent is not reaching the Backend Agent through Nginx (or confirms it is and where else it fails), with evidence.
	•	Proposed fixes are minimal, reversible, and provided as diffs but not applied.
	•	The report contains a 5-minute verification checklist we can run after we apply the fixes.

When done, print the path to reports/agent_connectivity_report.md so we can open it. Then wait for approval before making any changes.

⸻
