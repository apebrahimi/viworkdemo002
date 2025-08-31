Got it. Here’s a clean, conflict-free flow + requirements plan (no code, no DB schemas) that matches your real process exactly and is ready for Cursor to implement step-by-step.

⸻

ViWorkS – Correct End-to-End Flow & Requirements (Cursor Implementation Plan)

1) Actors & Systems
	•	System Admin (web Admin Panel)
	•	Backend (control plane)
	•	Gateway OS (your Linux host running SPA/Port-Knocking, TLS proxy, OpenVPN, containerized Chrome/Firefox, nginx)
	•	Desktop Client (macOS in this demo)
	•	Mobile Authenticator (Android app)
	•	Isolated App Session (browser/container the user ultimately reaches)

⸻

2) Preconditions & Assumptions
	•	Gateway already runs your two provisioning scripts (VPN/SPA user + panel user for published Chrome).
	•	Desktop client and mobile app can talk to Backend over TLS.
	•	Backend has a secure control channel to Gateway OS (e.g., SSH ForceCommand or your Rust agent later) to run allowlisted actions and pull status.
	•	Admin Panel can call Backend APIs and receive live updates (WebSocket or polling).
	•	OTP will be 6 digits with a short validity window (e.g., ≤120s) and server-side rate limiting.

⸻

3) Provisioning Flow (Admin creates a user)

Goal: create a ViWorkS user everywhere they must exist so they can later connect and open the isolated browser.

Steps
	1.	Admin Panel → Backend: Admin submits “Create User” form (username, initial password, policy/time window, allowed country list, etc.).
	2.	Backend (Directory Record): Create/activate the user record with policy attributes (no DB details here—use what you have).
	3.	Backend → Gateway OS (Control Channel):
	•	Run VPN/SPA user create (your existing OpenVPN/SPA script).
	•	Run panel user create (your existing panel script for published Chrome access).
	4.	Backend → Admin Panel: Return provisioning status with granular flags:
	•	directory_user=created
	•	gateway_vpn_user=created
	•	panel_user=created
	5.	Audit: Log a single “user.created” event with who/when/where; include correlation IDs for later traceability.

UI Requirements
	•	Show per-step success/fail badges.
	•	If any step fails, show retry and diagnostic message; do not partially expose sensitive details.

Acceptance Criteria
	•	A new user appears as Active with three green checks (Directory, VPN/SPA, Panel).
	•	Audit timeline shows one composite event.

⸻

4) Desktop + Mobile Authentication Flow (what the user does)

Goal: authenticate the user with password + mobile based 2nd factor and confirm policy constraints before delivering bootstrap.

Steps
	1.	Desktop Client → Backend: User enters username/password.
	2.	Backend: Validate credentials and check base policy gates (account enabled, time window, high-level geo/ASN rules if available without mobile yet).
	3.	Backend → Desktop Client: Respond “OTP required” (no bootstrap yet).
	4.	Backend → Mobile App: Create an OTP challenge tied to the user and send a push/notification (or instruct user to open the app manually).
	5.	Mobile App (User action): User opens the Android Authenticator. The app runs device posture checks (country, SIM/network, basic integrity) and reports to Backend.
	6.	Backend: If posture/geo/policy checks pass, generate 6-digit OTP (short TTL) and deliver inside the mobile app UI.
	7.	User → Desktop Client: Types the 6-digit OTP from phone into the desktop client.
	8.	Desktop Client → Backend: Submit OTP for verification.
	9.	Backend: If OTP matches and is within TTL and policy holds, mark the session as authenticated and ready for bootstrap.

UI/UX Requirements
	•	Desktop shows clear stepper: Login ✓ → Waiting for mobile → Enter code.
	•	Mobile shows single code, countdown timer, and a “report a problem” link.
	•	On errors (wrong/expired code), keep messaging neutral and allow safe retry with backoff.

Acceptance Criteria
	•	Wrong/multiple OTP attempts are rate-limited and auditable.
	•	OTP cannot be reused after success or TTL expiry.

⸻

5) Bootstrap Delivery (after OTP success)

Goal: provide the short-lived bootstrap so the desktop client can connect to the Gateway OS.

Rules
	•	Bootstrap includes SPA/Port-Knocking material, TLS proxy settings, OpenVPN client profile & credentials necessary to reach the Gateway OS.
	•	Bootstrap is short-lived and ephemeral; the client should hold it in memory and wipe on failure or disconnect.
	•	Backend must not expose persistent infrastructure internals (use minimal, time-boxed values only).

Steps
	1.	Desktop Client → Backend: Request bootstrap (now allowed).
	2.	Backend: Generate a fresh, time-boxed bundle bound to the authenticated session and policy.
	3.	Desktop Client: Receive and prepare to connect (keep it in memory; if your current client writes to disk temporarily for MVP, delete immediately after connecting).

Acceptance Criteria
	•	Bootstrap cannot be used beyond its TTL.
	•	A second bootstrap request for the same session invalidates the first (optional but safer).
	•	Audit event “bootstrap.issued” is recorded.

⸻

6) Tunnel & Resource Access (connect and open the containerized browser)

Goal: connect through SPA → TLS proxy → OpenVPN and open the isolated Chrome container that reaches only the allowed organizational resources.

Steps
	1.	Desktop Client: Sends SPA/Port-Knocking packet; Gateway briefly allows the TLS entry.
	2.	Desktop Client: Connects to TLS proxy (client pins server identity; server presents proper certs).
	3.	Desktop Client: Starts OpenVPN inside the TLS channel; tunnel comes up, routes and DNS are applied.
	4.	Backend → Gateway OS (optional, policy-based): If your design spawns a per-user container, trigger container create/map (Chrome/Firefox or full Linux/Windows desktop per policy), then expose path via nginx for the user’s session; otherwise re-use existing pool.
	5.	Desktop Client: Opens the published app URL (Chrome/Firefox or desktop) within the secure path (e.g., random path mapped to user/session).

Acceptance Criteria
	•	Routes/DNS reflect only allowed destinations (no split-tunnel unless explicitly allowed by policy).
	•	Admin Panel shows session = Connected, including gateway, assigned IP, and published resource path label.

⸻

7) Live Monitoring & Telemetry (Admin visibility)

Goal: system admin can see CPU/RAM, containers state, session counters, and policy mismatches in near real-time.

Requirements
	•	Backend should refresh Gateway stats (pull or receive push) on a regular cadence and broadcast to Admin Panel (WS or polling).
	•	Minimum telemetry:
	•	Gateway health: up/down, CPU%, RAM usage, disk headroom, service status (SPA/TLS proxy/OpenVPN).
	•	Containers: list (name, image, state, labels: user/session), count.
	•	Sessions: active list (user, gateway, start time, policy name), terminated reasons.
	•	Audit/metrics: every control operation (provision, terminate, container spawn/stop) must generate a structured audit event.

Acceptance Criteria
	•	Admin sees changes within ≤10–15s.
	•	Stats updates don’t block control operations.

⸻

8) Session Termination (scheduled or manual)

Goal: end user’s access on policy expiry or admin command, and clean up any resources.

Triggers
	•	Policy time window ends (backend scheduler detects it).
	•	Admin clicks “Terminate” in Admin Panel.

Steps
	1.	Backend: Sends a terminate request through the control channel to Gateway OS.
	2.	Gateway OS: Cleanly drop the OpenVPN session, clear routes, and stop/detach the per-user container if applicable; keep shared resources intact.
	3.	Backend: Mark session Ended, update UI, and log audit (“session.terminated” + reason).
	4.	Desktop Client: Sees the session closed and wipes any residual bootstrap/config in memory.

Acceptance Criteria
	•	End-to-end time from trigger to disconnect visible in UI: ≤10 seconds target for demo.
	•	Post-termination, user cannot reconnect without re-auth + new bootstrap.

⸻

9) Error Handling & Edge Cases (user-friendly + safe)
	•	Wrong password → generic failure (no user existence leak), audit “auth.failed”.
	•	Mobile posture fails (wrong country, emulator, out-of-policy) → show neutral message on mobile; desktop remains blocked; audit “posture.denied”.
	•	OTP expired → clear message, new OTP allowed with backoff; audit “otp.expired”.
	•	Gateway unreachable at provisioning or terminate → show retriable error; queue and retry with exponential backoff; raise alert if repeated.
	•	Container spawn failure → do not expose details; show “resource unavailable, retry”; audit reason code.
	•	Partial successes (e.g., VPN user created but panel user failed) → surface precise step with remediation/retry; do not leak script internals.

⸻

10) Security & Privacy Requirements (non-negotiable)
	•	No persistent secrets on desktop: bootstrap is short-lived and ephemeral; wipe on disconnect or error.
	•	Minimal exposure: client must not learn permanent IPs/ports or long-term credentials.
	•	Rate limits: login and OTP attempts must be rate-limited and audited.
	•	Policy enforcement is server-side (do not rely on client claims).
	•	Control channel: allowlisted commands only; no shell; strongly authenticated; all requests/responses audited with correlation IDs.
	•	Logging: avoid PII where not needed; keep logs structured and redacted where appropriate.
	•	UI content safety: never display ports/addresses, cert hashes, or stack traces.

⸻

11) Admin Panel – UX Requirements for this flow
	•	Create User dialog: shows three provisioning steps with status pills and a single “Create” button.
	•	Sessions tab: filters for Active/Ended, with Terminate action.
	•	Gateway detail: CPU/RAM, containers count/list, service status, last update time.
	•	360° Modal (row click anywhere): user profile, device bindings, last mobile posture result (geo verdict), session list, allowed resources label, recent audit events.
	•	Notifications: non-blocking toasts for key events (provisioned, terminated).

⸻

12) Implementation Order (Cursor work plan, tech-agnostic)
	1.	Provisioning flow
	•	Wire Admin → Backend “create user”.
	•	Backend runs the two gateway scripts and returns per-step statuses.
	2.	Auth + OTP
	•	Desktop login → “OTP required”.
	•	Mobile app challenge → code shown with TTL.
	•	Desktop submits code → Backend marks session ready.
	3.	Bootstrap + Connect
	•	Issue short-lived bootstrap.
	•	Desktop connects (SPA → TLS → OpenVPN) and opens resource URL.
	4.	Monitoring
	•	Backend refreshes gateway metrics (pull or agent push).
	•	Admin sees live stats and sessions.
	5.	Terminate
	•	Scheduler + manual terminate; ensure ≤10s disconnect and UI reflects it.
	6.	Polish
	•	Audit timeline, error messages, rate limits, accessibility.

⸻

13) Demo Checklist (what to verify live)
	•	Create new user → all three provisioning checks go green.
	•	Desktop login → mobile gets OTP → enter code → bootstrap issued.
	•	Tunnel connects; published Chrome opens; limited resource label is visible.
	•	Admin sees active session; CPU/RAM/containers update.
	•	Manual terminate → session ends within 10s → desktop auto-disconnect → audit event appears.

⸻

This version corrects the wording and matches your real process precisely:
	•	User is provisioned in three places at creation time (Directory, VPN/SPA, Panel).
	•	OTP is generated and displayed on the mobile app after device checks, then entered on the desktop.
	•	Only after OTP success does the desktop receive the time-boxed bootstrap, then connects.
	•	Termination is driven by Backend → Gateway, and Admin Panel reflects everything.

If you want, I can also turn this into a checklist of Cursor tasks with acceptance criteria per task, or a Mermaid sequence diagram for the README so everyone builds to the same flow.