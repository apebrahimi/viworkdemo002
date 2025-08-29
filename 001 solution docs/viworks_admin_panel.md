viworks_admin_panel.md

Component: ViWorkS Admin Panel (Secure Operations Console)
Audience: Frontend engineers, UX, backend consumers, SRE/ops, security reviewers
Version: 1.0 (implementation-ready)
Consistent terms: SPA → stunnel → OpenVPN, sealed bootstrap, device binding, dual approval, SSH ForceCommand, SIEM detections

⸻

1) Role & Scope

1.1 Purpose

The Admin Panel is the secure, web-based operations console for ViWorkS. It enables authorized staff to:
	•	User & Device Management (CRUD)
	•	Create/disable users; reset passwords; assign roles (RBAC).
	•	Review and approve device binding requests (desktop & mobile); revoke devices.
	•	Policy Authoring & Governance
	•	Define and manage RBAC and ABAC policies (time windows, geo/ASN allowlists, device posture, risk rules).
	•	Draft → review → dual approval for risky changes (e.g., enabling split-tunnel, relaxing geo).
	•	Immutable policy versions; audit trails.
	•	Session & Gateway Operations
	•	Live session monitoring (per-user tunnels, assigned IPs, routes/DNS, container status).
	•	Terminate sessions, trigger forced revocation.
	•	Gateway overview (health, capacity, error rates).
	•	Audit, Security & Health
	•	Audit dashboards (auth events, OTP lifecycle, SPA/stunnel/OpenVPN events).
	•	SIEM drill-downs (normalized fields + deep links).
	•	Platform health (latency SLOs, handshake success rate, alert banners).

The Admin Panel presents UI and calls Backend APIs over HTTPS; it never connects directly to Gateways.

1.2 Out of Scope
	•	No direct SSH/API access to Gateways. All orchestration goes Admin Panel → Backend → (SSH ForceCommand) → Gateway.
	•	No storage of long-term secrets in the browser.
	•	No end-user client distribution or update logic.

⸻

2) Interfaces & Dependencies

2.1 Backend Connectivity
	•	Transport: HTTPS (TLS 1.3) with SPKI pinning on the browser side via service worker / preload hints.
	•	APIs consumed (representative):
	•	Auth: /admin/auth/login, /admin/auth/totp/verify, optional OIDC/SAML callback endpoints.
	•	Users: /admin/users{GET,POST,PUT,PATCH,DELETE}, /admin/users/:id/devices, /admin/users/:id/sessions.
	•	Devices: /admin/devices{GET,POST,PATCH}, /admin/devices/:id/approve, /admin/devices/:id/revoke.
	•	Policies: /admin/policies{GET,POST,PUT}, /admin/policies/:id/submit, /admin/policies/:id/approve, /admin/policies/:id/reject, /admin/policies/:id/history.
	•	Sessions: /sessions/active, /sessions/revoke, /sessions/:id.
	•	Gateways: /admin/gateways, /admin/gateways/:id/metrics, /admin/gateway/ops (submit ForceCommand op).
	•	Audit & SIEM: /audit/events, /audit/export, /siem/drilldown (signed link or backend-proxied query).
	•	Health: /healthz, /readyz, /metrics (read-only badges).
	•	Realtime: WebSocket (WSS) to /ws/admin (same origin), JWT cookie/session bound; multiplexed channels:
	•	sessions.* (connect/disconnect, revocation, assigned_ip)
	•	gateways.* (health, capacity, SPA/stunnel/OVPN counters)
	•	policies.* (draft submitted, approved, applied)
	•	security.* (high-severity alerts: policy relaxation attempts, OTP abuse, DoS indicators)

2.2 Admin Authentication
	•	Primary: Local admin accounts with password + TOTP (RFC 6238).
	•	Optional: OIDC/SAML SSO with enforced step-up TOTP inside the panel for privileged actions.
	•	Session: HttpOnly, Secure, SameSite=Strict cookies for session token; inactivity timeout 15 min, absolute 12 h; re-auth on risky operations.

2.3 External Dependencies
	•	SIEM: Embedded dashboards via backend-generated signed iframes or link-outs with prebuilt queries; never expose SIEM creds in the browser.
	•	Time service: relies on browser and Backend time; all approvals show server time & timezone.

⸻

3) Data & Config Management

3.1 Browser-Side State
	•	No secrets persisted to localStorage/sessionStorage.
	•	Runtime UI state (filters, column widths) in memory; optional encrypted localStorage for UX preferences only.
	•	CSRF token stored in a secure cookie or double-submit token pattern.

3.2 Policy Drafting & Versioning
	•	Drafts are created and saved in the Backend, not the browser.
	•	A draft includes:

{
  "name": "default-policy",
  "rbac": ["User","Operator","Admin","Auditor"],
  "abac": {
    "time_windows":[{"days":[1,2,3,4,5],"start":"07:00","end":"19:00","tz":"Asia/Tehran"}],
    "geo_allow":["IR","DE","FR"],
    "asn_allow":[58224],
    "device_posture":{"mobile_attested":true,"desktop_enrolled":true},
    "network":{"split_tunnel":false,"dns":"10.0.0.53"}
  },
  "risk": {"otp_fail_threshold":5,"velocity_km_max":500},
  "version": 17
}


	•	Immutable history: submitting/approving creates a new version; old versions remain read-only with diff views.

3.3 Surfacing Sessions & Audit
	•	Sessions: paginated table with filters (user, gateway, geo, ASN, start/end, policy version).
	•	Audit: fetches normalized events (auth, OTP, SPA grant/deny, stunnel handshake, OpenVPN connect/disconnect, container spawn/stop).
	•	Device approvals: dedicated queue with evidence preview (attestation verdicts, device fingerprint, previous bindings).

⸻

4) Security Controls
	•	MFA required for all admin logins.
	•	RBAC roles:
	•	Admin: full access, can approve high-risk policy changes.
	•	Operator: user/device/session management; cannot approve risky policy changes.
	•	Auditor: view-only (audit, sessions, policies), export logs.
	•	Dual approval (four-eyes) for risky actions:
	•	Enabling split-tunnel.
	•	Relaxing geo/ASN allowlists.
	•	Disabling device attestation requirements.
	•	Extending session timeouts beyond default.
	•	Gateway-wide config changes.
	•	Enforcement: the requester cannot approve their own change; approvals logged and sent to SIEM.
	•	CSP (strict):

Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  connect-src 'self' https://<backend-fqdn> wss://<backend-fqdn>;
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'none';
  upgrade-insecure-requests;

No third-party scripts/fonts; if charts require fonts, self-host.

	•	Browser hygiene:
	•	SameSite=Strict cookies; HttpOnly; Secure; short expiry with rolling refresh.
	•	CSRF tokens on all state-changing requests (double-submit or header with anti-replay).
	•	Clickjacking: X-Frame-Options: DENY, frame-ancestors 'none'.
	•	Referrer-Policy: no-referrer.
	•	Subresource Integrity (SRI) if any external asset (prefer none).
	•	Event Integrity
	•	All UI actions include a trace_id header sourced from a request interceptor to correlate with Backend logs.

⸻

5) Implementation Notes

5.1 Tech Stack
	•	Frontend: React + TypeScript + Vite (or Next.js in SPA mode).
	•	State: React Query (HTTP) + native WebSocket client with exponential backoff (max jittered).
	•	UI Kit: Headless UI or Material-UI (self-hosted styles).
	•	Charts: Recharts / ECharts (self-hosted).
	•	Tables: Virtualized grid (e.g., TanStack Table) for large lists.

5.2 Modules (Routes)
	•	/login — password + TOTP; optional SSO entry.
	•	/dashboard — KPIs (active sessions, handshake success, OTP failure rates), alert banner.
	•	/users — list/create/edit; reset password; assign roles; view devices/sessions.
	•	/devices — approval queue; details (attestation, bindings, history); revoke.
	•	/policies — list; create draft; diff; submit for approval; approve/reject with comments; view risk impact summary.
	•	/sessions — live grid (WebSocket updates), terminate session, force revoke.
	•	/gateways — health metrics, capacity, errors; submit ops (via Backend → SSH ForceCommand).
	•	/audit — search/filter; export; deep link to SIEM.
	•	/settings — roles matrix, SSO config (view), timeouts, webhooks.

5.3 WebSocket Events (examples)
	•	sessions.connected

{"type":"sessions.connected","ts":"...","session_id":"s-77ccaa","user_id":"u-1a2b3c","gateway_id":"gw-1","assigned_ip":"10.8.0.19","policy_version":17}


	•	sessions.disconnected

{"type":"sessions.disconnected","ts":"...","session_id":"s-77ccaa","reason":"revoked","duration_s":642}


	•	gateways.health

{"type":"gateways.health","ts":"...","gateway_id":"gw-1","spa_open_p95_ms":160,"stunnel_handshake_p95_ms":340,"ovpn_sessions":128,"cpu_pct":56}


	•	policies.applied

{"type":"policies.applied","ts":"...","policy_id":"pol-default","version":18,"by":"admin@corp"}



5.4 UX Patterns
	•	Risk banner: when editing policies, show risk deltas (e.g., “+High risk: split-tunnel enabled”).
	•	Approval workflow: Approvers must enter comment & reason; email/WebSocket notification to subscribers.
	•	Kill switch: “Emergency revoke all sessions” (requires two approvals; clearly labeled destructive).

5.5 SIEM Integration
	•	Backend exposes /siem/drilldown?query=… that returns a signed URL (short TTL) to SIEM or a pre-rendered report (backend-proxied) to avoid exposing SIEM credentials.
	•	Field dictionary aligns with backend: user_id, device_id, session_id, fwknop_id, tls_ja3, asn, country, gateway_id, policy_version.

⸻

6) Failure & Recovery
	•	Backend loss / 5xx:
	•	Display read-only mode banner; disable mutating controls.
	•	Retry GETs with exponential backoff; record UI errors with trace_id.
	•	WebSocket drops:
	•	Auto-reconnect with jittered backoff; queue toast “Realtime updates paused”; on reconnect, re-sync via /sessions/active snapshot.
	•	Admin session expiry:
	•	Force logout to /login; preserve last route in memory for post-login redirect.
	•	For approvals, if session expires mid-flow, re-auth then resume.
	•	SIEM outage:
	•	Replace embedded frames with a warning and link to export raw audit from Backend.

⸻

7) Future Extensions
	•	Runbooks in UI: guided incident responses (suspicious OTP activity, DoS playbooks).
	•	Compliance views: ISO 27001 control coverage dashboard; SOC 2 evidence pointers; GDPR retention status.
	•	Onboarding wizards: initial tenant setup (RBAC defaults, ABAC templates, SIEM link), first admin creation, policy scaffolding.

⸻

8) Configuration Reference (Appendix)

8.1 Roles & Permissions Matrix (initial)

Capability	Admin	Operator	Auditor
Login (TOTP required)	✓	✓	✓
User CRUD	✓	✓	✗
Device approve/revoke	✓	✓	✗
Policy draft create/edit	✓	✓	✗
Submit risky policy changes	✓	✓	✗
Approve risky policy changes	✓	✗	✗
Session view/terminate	✓	✓	✗
Gateway health view	✓	✓	✓
Submit gateway ops (via Backend)	✓	✓	✗
Audit view/export	✓	✓	✓
Settings (timeouts, SSO view)	✓	✗	✗

A user cannot approve their own submitted risky change.

8.2 WebSocket Event Payloads (schema snippets)

// sessions.connected
type SessionConnected = {
  type: 'sessions.connected';
  ts: string;
  session_id: string;
  user_id: string;
  device_id?: string;
  gateway_id: string;
  assigned_ip: string;
  policy_version: number;
  geo?: string;
  asn?: number;
};

// gateways.health
type GatewayHealth = {
  type: 'gateways.health';
  ts: string;
  gateway_id: string;
  cpu_pct: number;
  mem_pct?: number;
  spa_open_p95_ms: number;
  stunnel_handshake_p95_ms: number;
  ovpn_sessions: number;
  errors_last_5m: number;
};


⸻

9) Test Plan

9.1 Functional Tests
	1.	Admin Login + TOTP: success path and lockout after N failures; verify inactivity timeout.
	2.	User CRUD: create user, assign roles, disable user; verify reflected in Backend.
	3.	Device Approval: view pending, inspect attestation evidence, approve; ensure session allowed post-approval; revoke device and verify denial.
	4.	Policy Workflow: create draft; toggle split-tunnel → system marks as risky; submit; verify dual approval requirement; second admin approves; policy version increments; WebSocket policies.applied event received.
	5.	Sessions: observe live connects/disconnects; terminate a session; ensure disconnect < 10s; audit trail present.
	6.	Gateway Ops: submit reload_nginx and spawn_browser_container; display op status/rc/stdout tail.
	7.	Audit: filter by user/time; export CSV/JSON; drill into SIEM with signed link.

9.2 Security/Negative Tests
	•	Attempt policy relaxation without required approvals → blocked; SIEM alert generated.
	•	Attempt XSS via form inputs → blocked by validation & CSP; no script execution.
	•	CSRF: submit POST without CSRF token → rejected (403).
	•	Clickjacking attempt via embedding panel → blocked (X-Frame-Options, frame-ancestors).
	•	WebSocket token theft simulation → server rejects without valid cookie/session & origin checks.
	•	SIEM outage → panel shows fallback & still fetches audit from Backend.

⸻

10) Risk Register & Open Questions

10.1 Risks

Risk	Impact	Likelihood	Mitigation	Residual
Admin credential theft	High	Medium	TOTP; SSO w/ IdP risk signals; short sessions; re-auth on sensitive ops	Medium
UI-level XSS/CSRF	High	Low	CSP strict; input sanitization; CSRF tokens; no third-party scripts; SRI for assets	Low
Weak role separation / privilege creep	High	Low-Med	RBAC enforcement in Backend; permissions matrix; quarterly access review	Low
Approval collusion (two admins collude)	High	Low	Independent approver policy; immutable audit; out-of-band alerts to security distribution	Medium
WebSocket auth hijack	Med	Low	Cookie HttpOnly; origin checks; token rotation; idle timeout	Low
SIEM dependency for drill-downs	Med	Med	Backend-proxied summaries; signed links; local export paths	Low-Med

10.2 Open Questions
	•	SIEM integration mode per tenant (embed vs link-out), and SSO alignment.
	•	SSO rollout timeline; supported IdPs (Azure AD, Okta, Keycloak).
	•	Final approval catalog (which actions require dual approval) and thresholds.
	•	Localization/timezone support scope for global operators.

⸻

End of viworks_admin_panel.md