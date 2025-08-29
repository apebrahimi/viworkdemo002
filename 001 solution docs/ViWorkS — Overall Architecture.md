ViWorkS — Overall Architecture (Implementation-Ready)

Audience: engineering, security reviewers, SRE/ops
Version: 1.0 (implementation baseline)
Terminology (consistent across docs): SPA → stunnel → OpenVPN, sealed bootstrap, device binding, in-memory configs, SPKI pinning, SSH ForceCommand control plane, SIEM detections.

⸻

1) Executive Summary

Problem

Organizations require high-assurance remote access for distributed teams without exposing internal networks. The solution must combine stealth, strong cryptography, device binding, tight policy control, and deep observability, while performing well over the public Internet and supporting Windows/macOS/Linux desktop clients now (mobile companion app for device validation; iOS/Android).

Solution

ViWorkS establishes a layered, stealth-first access path:
	1.	SPA (fwknop) — the gateway is dark by default; a cryptographic single-packet opens 443 only for the requester for a short TTL.
	2.	stunnel (TLS 1.3) — terminates a pinned TLS channel on the gateway front door.
	3.	OpenVPN (mTLS + tls-crypt) — runs inside the TLS channel to apply per-user routing/DNS policy and session control.

Authentication is desktop username/password plus mobile device-bound OTP (120s). After OTP, the desktop fetches a sealed bootstrap (SPA token, front-door FQDN, OpenVPN inline materials), HPKE-encrypted to the desktop device key. The client decrypts in memory only and connects via SPA → TLS → OpenVPN. No persistent configs or secrets land on disk.

Control plane from Backend to Gateways is SSH (port 2222) with ForceCommand only (key-based, no TTY, command allowlist, firewall-pinned from Backend IPs, full audit to SIEM).

Key decisions
	•	Client secrecy & blindness: embedded TLS proxy (Rustls) and OpenVPN started with stdin config; no file-based stunnel/ovpn on disk; server addresses appear only as stable FQDNs, not raw IPs.
	•	Pinning everywhere: SPKI pinning in desktop/mobile to Backend and Gateway front-door certs (primary + backup pins); pin-roll playbook maintained.
	•	Attestation & device binding: mobile OTP issuance requires Play Integrity/App Attest; desktop holds an enroll-time device public key (TPM/Secure Enclave preferred); sealed bootstrap uses that key (HPKE).
	•	Observability by default: standardized event schema; SIEM dashboards and rules for SPA anomalies, TLS/JA3 anomalies, OTP abuse, geo/ASN risk, split-tunnel bypass attempts.

Constraints
	•	Must run On-Prem and Cloud with comparable posture.
	•	No public disclosure of sensitive infra details (IP rotation can be added later; assume stable front-door FQDN for now).
	•	Demo-ready; production-grade security.

Non-goals (current release)
	•	SD-WAN/ZTNA L7 proxying; delegated SSO to external IdPs (can be added later).
	•	Per-session IP rotation of the front door (out of current scope).

⸻

2) Big Picture (C4 Context + Containers)

2.1 Context (actors & systems)
	•	End User — runs Desktop Client (Windows/macOS/Linux).
	•	Mobile Device — ViWorkS Mobile App (Android/iOS), bound to the user; provides attestation + OTP.
	•	Admin/Operator — uses Admin Panel to manage users, policies, sessions, and view audit/health.
	•	ViWorkS Backend — Auth/OTP, Device Binding, Sealed Bootstrap, Policy & Session engine, SSH control to gateways, Audit API.
	•	Gateway Nodes — fwknopd, stunnel, OpenVPN, restricted SSH, container runtime (isolated browser), nginx reverse proxy.
	•	PKI/KMS — CA hierarchy for stunnel/OpenVPN/client device certs; keys in HSM/KMS; HPKE sender keys.
	•	SIEM/Monitoring — central log ingestion, correlation/dashboards/alerts.
	•	Target Resources — reached via isolated browser containers behind gateways (no lateral access).

2.2 Containers (roles, interfaces, trust boundaries)

Container	Role	Exposed Interfaces	Trust Boundary
Admin Panel (Web)	UI for users/devices/policies/sessions/audit	HTTPS 443 → Backend (REST + WebSocket)	Admin LAN ↔ Backend
Backend (Rust/Actix)	Auth/OTP, Device binding, Sealed bootstrap, Policy/Session, Audit	HTTPS 443 (clients+mobile); SSH 2222 → Gateways	Internet ↔ Backend; Backend ↔ GW
Gateway Node	SPA gate, TLS front door, OpenVPN, container runtime, nginx	SPA port (UDP/TCP), TLS 443; SSH 2222 (Backend only)	Internet ↔ Gateway; Backend ↔ GW
Desktop Client	Login/OTP, Preflight, SPA→TLS→OVPN, in-memory configs	HTTPS 443 → Backend; SPA → GW; TLS 443 → GW	Internet ↔ Backend/Gateway
Mobile App	Device binding & attestation, OTP display	HTTPS 443 → Backend	Internet ↔ Backend
PKI/KMS	CA issuance/rotation, HPKE, key escrow	Internal only (Backend)	Backend ↔ PKI/KMS (private)
SIEM/Monitoring	Central log storage/analytics	Syslog/TLS or HTTPS ingest	Backend/Gateway ↔ SIEM (private)

Trust boundaries:
	•	Internet ↔ Gateway (SPA, TLS, OpenVPN).
	•	Internet ↔ Backend (Desktop/Mobile APIs).
	•	Backend ↔ Gateways (SSH 2222 only, from Backend IPs).
	•	Backend ↔ PKI/KMS/SIEM (private segments).

2.3 Component breakdown (selected)

Backend
	•	Auth Service: password login, OTP lifecycle, rate limiting, geo/ASN policy.
	•	Device Binding: desktop key enrollment; mobile attestation verification (Play Integrity / App Attest).
	•	Bootstrap Service: builds per-user short-lived SPA+TLS+OVPN bundle; HPKE-encrypts to desktop device key.
	•	Policy/Session Engine: ABAC (time, geo/ASN, device posture), session heartbeats, revocation.
	•	Gateway Orchestrator: runs ForceCommand SSH ops (create VPN user, update CCD, spawn/terminate containers, reload nginx).
	•	Audit/Events: normalized logs (auth, device, SPA, TLS, OpenVPN, containers, admin actions) → SIEM.

Gateway
	•	fwknopd: validates SPA packet; inserts ephemeral firewall rule (443) for source IP, TTL.
	•	stunnel: TLS 1.3 front door (pinned by clients), forwards to local OpenVPN.
	•	OpenVPN: tcp-server on 1194 (localhost), mTLS + tls-crypt; pushes route/DNS policy.
	•	Restricted SSH: dedicated user, ForceCommand dispatcher; firewall to Backend IPs; full audit.
	•	Containers + nginx: isolated browser containers; nginx reverse proxy with random path per session.

⸻

3) Deployment & Topology

3.1 Environments
	•	Dev/Stage/Prod — identical topology, separate secrets/PKI. Non-prod gateways are Internet-isolated or behind test front-doors.

3.2 On-Prem vs Cloud
	•	On-Prem: Gateways in DMZ; Backend in App/Mgmt networks; PKI/KMS/SIEM internal.
	•	Cloud: Gateways in edge VPC/VNet; Backend in app subnets; private links to managed KMS/DB/SIEM.
	•	Stable front-door FQDN with LB/Anycast as desired (current scope assumes stable FQDN; no per-session IP rotation).

3.3 Network segments & security groups
	•	DMZ (Gateways): fwknopd, stunnel, OpenVPN, restricted SSH 2222.
	•	App (Backend): Auth/Bootstrap/Policy/Audit services, DB/Cache.
	•	Mgmt: Admin Panel, SIEM.
	•	Isolated user land: container network for browser sessions; no lateral routes to core infra.

3.4 Exposed endpoints, ports, protocols, ciphers
	•	fwknopd: UDP/TCP (e.g., UDP 62201) — cryptographic SPA; ACCESS_TIMEOUT ≤ 20s.
	•	stunnel server: TCP 443; TLS 1.3 only, ciphersuites:
	•	TLS_AES_256_GCM_SHA384
	•	TLS_CHACHA20_POLY1305_SHA256
(no renegotiation, verify=2).
	•	OpenVPN (server): tcp-server 1194 localhost only, mTLS + tls-crypt, data-ciphers AES-256-GCM:AES-128-GCM, auth SHA256.
	•	Backend API: HTTPS 443 (TLS 1.3); SPKI pinned by clients; mobile also pins Backend.
	•	SSH control plane: TCP 2222, from Backend IPs only, key-based, ForceCommand, no-pty, full audit.

3.5 HA/DR strategy
	•	Gateways: N+1 per site, stateless; can be autoscaled; LB across healthy nodes.
	•	Backend: active-active behind L7 (2+ AZs).
	•	DB: PITR (≤15 min).
	•	RPO ≤ 15 min, RTO ≤ 30 min (automated rehydration, infra as code).
	•	Trust boundary markers and blast radius documented for incident response.

⸻

4) Identity, Access & Policy

4.1 Authentication
	•	Desktop: username/password → OTP (mobile); AAL2 equivalent.
	•	Mobile: device binding; attestation (Android Play Integrity / iOS App Attest); OTP displayed (6 digits, 120s TTL).
	•	Admin: local admin + TOTP or SSO (OIDC/SAML) if available; session inactivity timeout.

4.2 Authorization (RBAC/ABAC)
	•	RBAC roles: Admin, Operator, Auditor, User.
	•	ABAC conditions: time windows, geo/ASN, device posture (attestation verdict, jailbreak/root flags), same-NAT/ble co-presence (optional, per policy), risk scores.
	•	Dual approval required to relax risky policies (e.g., enabling split tunnel).

4.3 Device binding & attestation
	•	Desktop: enroll device public key (TPM/Secure Enclave/Keychain preferred). Bootstrap sealed via HPKE to this key. Optional short-lived client cert for channel binding.
	•	Mobile: bound at first run; OTP only after attestation OK; reject on root/emulator/mock-location.

4.4 Session management
	•	Desktop preflight: no active VPN, timezone policy (e.g., “Iran Standard Time” for certain tenants), network reachability, binary presence; fail-closed.
	•	Bootstrap token short-lived (≤10 min); session heartbeat; revocation pushes to gateway (< 10 s teardown target).
	•	Logout/idle timeout clears secrets; memory zeroized.

⸻

5) Data Catalog & Protection

5.1 Data classification & storage

Data	Store	Sensitivity	At Rest	In Transit	Retention
User identity & roles	Postgres	High	AES-256 (disk) + DB encryption	TLS 1.3	Customer policy (e.g., 3y)
Device binding (desktop pubkey)	Postgres	High	AES-256	TLS 1.3	Until device unbound
Mobile attestation results	Postgres	High	AES-256	TLS 1.3	12–18 months
OTP challenges (codes, TTL≤120s)	Redis	High	Encrypted volume	TLS 1.3	TTL only
Sealed bootstrap (refs only)	Ephemeral	High	HPKE payload; ephemeral handle	TLS 1.3	TTL≤10m
SPA/stunnel/OVPN materials (client)	Memory only	High	Never written to disk	N/A (internal memory)	Lifetime of session
Audit & session logs	SIEM	High	WORM/signed chain (where possible)	TLS 1.2+/1.3	12–18 months (tenant-set)
PKI keys, HPKE sender keys	HSM/KMS	Critical	HSM/KMS controls	mTLS or private link	As per key policy

5.2 Secrets & certificates
	•	PKI: Offline root; online intermediates in HSM; short-lived server/client certs (e.g., 180d server; 30–90d client).
	•	SPKI pinning: desktop pins Gateway front-door; mobile pins Backend. Maintain primary + backup pins; pin-roll playbook.
	•	HPKE: X25519 + ChaCha20-Poly1305 for sealing bootstrap; per-session ephemeral.
	•	No persistent client configs; inline OpenVPN + embedded Rustls TLS proxy.

5.3 Privacy/GDPR
	•	Lawful basis: legitimate interests (enterprise security).
	•	Pseudonymize IDs in logs; minimize PII; respect DSARs; configurable retention; DPIA documented.

⸻

6) End-to-End Flows

6.1 Desktop login → mobile validation → sealed bootstrap → connect

sequenceDiagram
  autonumber
  participant U as User
  participant C as Desktop Client
  participant B as Backend (Auth/Bootstrap)
  participant M as Mobile App
  participant G as Gateway

  U->>C: Enter username/password
  C->>B: POST /auth/login (creds)
  B-->>C: 200 (OTP required)
  B-->>M: Create OTP (bound device) + notify
  U->>M: Open app (attested), sees 6-digit code (TTL=120s)
  U->>C: Enter code
  C->>B: POST /auth/verify (code)
  B-->>C: 200 (short-lived token)
  C->>B: GET /client/bootstrap
  B-->>C: HPKE-sealed bundle (SPA token, FQDN, OVPN inline, policy, expiry)
  C->>C: Decrypt in memory (device key); preflight ok
  C->>G: Send SPA (fwknop)
  C->>G: TLS 1.3 connect (SPKI pinned)
  C->>G: OpenVPN mTLS inside TLS
  G-->>C: Tunnel up; DNS/route applied

DFD (selected)

#	Step	Data	Boundary Crossing	Controls
1	Login	username/password	Internet → Backend	Rate limit, IP/ASN policy
2	OTP creation & display	device binding id, OTP	Backend → Mobile	Attestation required, TTL≤120s
3	OTP verify	6-digit code	Internet → Backend	Rate limit, one-time use
4	Sealed bootstrap	HPKE envelope (SPA token, FQDN, OVPN)	Backend → Desktop	Short-lived, sealed to device key
5	SPA	SPA packet	Client → Gateway	Per-IP, TTL window, nonces
6	TLS handshakes	ClientHello/ServerHello	Client → Gateway	TLS 1.3, SPKI pinning
7	OpenVPN bring-up	mTLS + tls-crypt	Client → Gateway (inside TLS)	AEAD ciphers, redirect-gateway, DNS policy

6.2 SPA → stunnel → OpenVPN (handshake sequence)

sequenceDiagram
  participant C as Client
  participant G as Gateway (fwknopd/stunnel/OpenVPN)
  C->>G: SPA packet
  G-->>G: Opens 443 to C's IP (TTL<=20s)
  C->>G: TLS1.3 handshake (ciphers pinned)
  C->>G: OpenVPN TLS (mTLS + tls-crypt) over the TLS tunnel
  G-->>C: "Initialization Sequence Completed"

6.3 Admin policy update → propagation

sequenceDiagram
  participant A as Admin Panel
  participant B as Backend (Policy/Orchestrator)
  participant G as Gateway (ForceCommand)
  A->>B: Save policy (RBAC/ABAC)
  B->>G: SSH 2222 ForceCommand (apply delta)
  G-->>G: Update CCD/iptables/nginx as needed
  G-->>B: Ack + status
  B-->>A: UI shows "Policy in effect"

6.4 Client update / rollback (signed artifacts)
	•	Desktop checks signed manifest.json from Update Server (TLS pinned).
	•	If signature/version policy ok, download signed artifact; verify; stage rollout; apply; if health fails → rollback.

⸻

7) Security Architecture & Threat Model

7.1 Assets & entry points
	•	Assets: SPA keys, front-door TLS certs, OpenVPN CA/client certs, sealed bootstrap, device binding keys, admin creds, SIEM audit trail.
	•	Entry points: SPA port, TLS 443 (post-SPA), Backend API 443, SSH 2222 (Backend → Gateway only).

7.2 STRIDE + MITRE ATT&CK (selected risks)

ID	Threat	Method (STRIDE / ATT&CK)	Impact	Likelihood	Mitigations	Residual
T1	Public discovery of gateways	S / Recon TA0043	High	Low	SPA default-deny; ephemeral allow; firewall; no banners	Low
T2	SPA replay/flood	R,D / TA0007	Medium	Medium	Nonces; TTL; per-IP/ASN rate limits; iptables recent; anomaly alerts	Low
T3	TLS downgrade	T / TA0006	High	Low	TLS 1.3 only; ciphers pinned; SPKI pinning; no renegotiation	Low
T4	OpenVPN handshake exhaustion	D / TA0040	High	Medium	SPA gate + stunnel limits; SYN cookies; autoscale; JA3 rate controls	Med-Low
T5	Split-tunnel exfil	I,E / TA0010	High	Medium	redirect-gateway + block-outside-dns + DNS push; egress allowlists; leak-tests	Low
T6	Client RE/tamper	T / TA0005	High	Medium	Code signing, notarization, integrity self-check, obfuscation; server-side policy validation	Med-Low
T7	OTP bypass / device unbinding	S,T / TA0006	High	Low-Med	Attestation required; short TTL; rate limit; bind OTP to device+session+geo/ASN	Low
T8	Geo bypass (VPN/proxy/SIM swap)	S	High	Medium	Multi-signal risk (IP+carrier+history), velocity checks, deny risky ASNs, manual review	Medium
T9	Gateway compromise	E,I	Critical	Low	CIS hardening; EDR; SSH ForceCommand; minimal packages; immutable images; key rotation	Medium
T10	Container escape	E	High	Low	Seccomp/AppArmor; read-only FS; drop caps; net-ns isolation; egress allowlists	Low
T11	Admin abuse (policy relax)	R,E	Critical	Medium	RBAC; dual approval; immutable audit; alerts on relaxations	Medium
T12	PKI compromise	S,T	Critical	Low	Offline root, HSM intermediates, short-lived certs, CT monitoring, pin-roll plan	Medium
T13	Update supply chain	T	Critical	Low-Med	Signed artifacts; SBOM; SLSA provenance; canary + rollback	Medium

(More exhaustive tables are in prior security analyses; this table lists the high-value set we implement now.)

⸻

8) Controls & Hardening Baselines

8.1 OS baselines (CIS)
	•	Gateways (Debian/Ubuntu): minimal packages; automatic security updates; ProtectSystem=strict; sshd hardened; logging to SIEM.
	•	Backend (RHEL/Debian): CIS hardening; no direct Internet inbound except 443; secrets via KMS; auditd rules.
	•	Clients:
	•	Windows: Code-signed; ASR-friendly, DLL search path hardening, DEP/ASLR/CET; DPAPI/TPM for device key.
	•	macOS: Hardened Runtime & notarization; Keychain + Secure Enclave; network extensions as needed.
	•	Linux: TPM2 if present; file permission hardening.

8.2 fwknopd
	•	Per-user keys; ACCESS_TIMEOUT ≤ 20s; strict source validation; unique nonces; no “any-source” SPA.

8.3 stunnel (server)
	•	TLS 1.3 only; ciphersuites TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256; verify=2; NO_RENEGOTIATION.
	•	Certs from PKI; rotation automation; OCSP stapling optional.

8.4 OpenVPN
	•	tls-crypt (prefer over tls-auth).
	•	data-ciphers AES-256-GCM:AES-128-GCM; auth SHA256; remote-cert-tls server.
	•	push "redirect-gateway def1"; push "block-outside-dns" (Windows); push "dhcp-option DNS <GW_DNS>".
	•	explicit-exit-notify 1; verb 3; client-config-dir for per-user routing where needed.

8.5 Kernel/network tuning (gateways)
	•	net.core.rmem_max, net.core.wmem_max increased; reasonable conntrack limits; SYN cookies;
	•	OpenVPN MTU/MSS: tun-mtu 1500, mssfix 1450 (adjust to path); no compression (avoid CRIME/VORACLE).
	•	Disable IPv6 if not needed.

8.6 MASVS / ASVS mappings (highlights)
	•	Mobile (MASVS-L2): attestation, secure keystore, anti-tamper, network pinning, root/emulator/mock detection.
	•	Web/API (ASVS 3.x): session mgmt, cryptography, logging/auditing, access control.

⸻

9) Observability, Telemetry & Detection

9.1 Logs & metrics (normalized schema)
	•	Auth: login successes/failures; OTP generated/verified/expired; device bind/unbind.
	•	Risk: IP, ASN, country, JA3; carrier (hashed MCC/MNC).
	•	Tunnel: SPA decisions; TLS handshake stats (success/fail, latency); OpenVPN connect/disconnect, assigned IP, DNS/route pushes.
	•	Containers: spawn/stop; image digest; CPU/RAM/IO; nginx reverse-path.
	•	Admin: user/device/policy CRUD; session termination; policy relaxations (flag).
	•	Infra health: gateway heartbeats; backlog; SSH ForceCommand outcomes; SIEM ingest lag.

Required fields: timestamp, tenant, user_id, device_id, session_id, action, result, ip, asn, country, fwknop_id, tls_ja3, ovpn_ip, policy_id, cmd, rc.

9.2 Detection rules (examples)
	•	spa_opened AND no_stunnel_handshake within 60s → probing SPA.
	•	otp_failures >= 5 AND distinct_asn >= 3 within 10m → credential stuffing via VPNs.
	•	policy_relaxation == true → high priority alert & second approval.
	•	openvpn_handshakes_per_min > threshold → possible DoS.
	•	dns_leak_detected == true → client misconfig; auto-remediate/deny.

9.3 SLIs/SLOs
	•	SPA→TLS handshake p50 < 400ms, p95 < 800ms (regional).
	•	OpenVPN bring-up < 2s typical LAN/DC.
	•	Handshake success rate ≥ 99.5%.
	•	Session revocation propagation < 10s (target).

⸻

10) Performance & Capacity
	•	Crypto: prefer AES-GCM (AES-NI) on x86; ChaCha20-Poly1305 for low-power.
	•	Throughput: size each gateway for ≥ 2–5 Gbps aggregate with multi-core OpenVPN; scale horizontally via LB.
	•	Baseline: tun-mtu 1500, mssfix 1450, keepalive 10 60, no compression.
	•	Load test plan: iperf3 through tunnels; concurrent handshake churn; measure CPU, mem, latency, and error rates; step tests to capacity.

⸻

11) Reliability & DR
	•	Backups: DB (PITR), PKI/CA & HPKE keys (HSM backup with split-knowledge), policy snapshots, SIEM indexes (as per retention).
	•	Escrow: CA key split; recovery drills.
	•	Chaos tests: kill a gateway under load; revoke a cert mid-session; SIEM outage; ensure graceful degradation and recovery.

⸻

12) DevSecOps & Release Engineering
	•	CI/CD:
	•	SAST (Rust, TS, Kotlin/Swift), secret scanning, IaC scanning (tfsec/Checkov).
	•	DAST for Backend APIs in stage; automated integration tests for SPA→TLS→OVPN.
	•	SBOM (CycloneDX) generation and verification.
	•	Signed/attested builds (SLSA L3+); clients verify signature at install/update time.
	•	Promotion gates: pen-test findings triaged; test coverage thresholds; canary rollout + automatic rollback.

⸻

13) Configuration Reference (appendix)

NOTE: sanitize secrets if you paste these into repos; these are known-good baselines.

13.1 fwknopd.conf (server)

PCAP_INTF            eth0
ENABLE_IPT_FORWARDING 0
ACCESS_TIMEOUT       20
REQUIRE_SOURCE_ADDRESS y
ENABLE_DIGEST_PWD    y
SOURCE_ADDR_ANY      N
# User-specific keys in /etc/fwknop/access.conf

13.2 stunnel (server) — /etc/stunnel/viworks-gw.conf

setuid = stunnel4
setgid = stunnel4
foreground = no
pid = /var/run/stunnel-gw.pid
debug = notice

[viworks_tls]
accept = 0.0.0.0:443
connect = 127.0.0.1:1194
verify = 2
sslVersion = TLSv1.3
ciphersuites = TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
cert = /etc/pki/stunnel/server.pem
key  = /etc/pki/stunnel/server.key
CAfile = /etc/pki/stunnel/ca.pem
options = NO_RENEGOTIATION

13.3 OpenVPN (server) — /etc/openvpn/server.conf

port 1194
proto tcp-server
dev tun
topology subnet

ca /etc/pki/ovpn/ca.crt
cert /etc/pki/ovpn/server.crt
key /etc/pki/ovpn/server.key
dh none
tls-crypt /etc/pki/ovpn/tls-crypt.key

cipher AES-256-GCM
data-ciphers AES-256-GCM:AES-128-GCM
auth SHA256
remote-cert-tls server

user nobody
group nogroup
keepalive 10 60
persist-key
persist-tun
explicit-exit-notify 1

push "redirect-gateway def1"
push "block-outside-dns"
push "dhcp-option DNS 10.0.0.53"

client-config-dir /etc/openvpn/ccd
status /var/log/openvpn-status.log
log-append /var/log/openvpn.log
verb 3

13.4 OpenVPN (client) — stdin config (sealed bootstrap → in-memory only)

client
dev tun
proto tcp-client
remote 127.0.0.1 1194    # via embedded TLS proxy to gw.example:443
resolv-retry infinite
nobind
persist-key
persist-tun

<ca>
# inline from sealed bootstrap
</ca>
<cert>
# inline from sealed bootstrap
</cert>
<key>
# inline from sealed bootstrap
</key>
<tls-crypt>
# inline from sealed bootstrap
</tls-crypt>

cipher AES-256-GCM
data-ciphers AES-256-GCM:AES-128-GCM
auth SHA256
remote-cert-tls server
verb 3

13.5 stunnel (client) — replaced with embedded Rustls proxy

(No file on disk; the embedded proxy dials gw.viworks.example:443, verifies SPKI, and exposes 127.0.0.1:1194 to OpenVPN.)

13.6 iptables (gateway excerpt)

# default deny inbound
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# allow loopback
iptables -A INPUT -i lo -j ACCEPT

# allow related/established
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# allow SPA port (example: UDP 62201)
iptables -A INPUT -p udp --dport 62201 -j ACCEPT

# stunnel 443 will be opened transiently by fwknopd rule injection (recent list)
# Example pattern if you tag source:
# iptables -A INPUT -p tcp --dport 443 -m recent --rcheck --name SPAOPEN -j ACCEPT

# management SSH 2222 only from backend IP
iptables -A INPUT -p tcp --dport 2222 -s <BACKEND_IP_CIDR> -j ACCEPT

13.7 systemd hardening (examples)

/etc/systemd/system/stunnel-viworks.service

[Unit]
Description=ViWorkS stunnel front door
After=network.target

[Service]
ExecStart=/usr/bin/stunnel /etc/stunnel/viworks-gw.conf
Restart=on-failure
User=stunnel4
ProtectSystem=strict
PrivateTmp=yes
NoNewPrivileges=yes

[Install]
WantedBy=multi-user.target

/etc/systemd/system/openvpn@server.service — stock with Restart=on-failure, ProtectSystem=strict, PrivateTmp=yes.

13.8 SSH ForceCommand dispatcher (gateway sketch)

#!/usr/bin/env bash
# /opt/viworks/bin/dispatch
set -euo pipefail

cmd="$1"; shift || true
log() { logger -t viworks-forcecmd -- "$cmd $*"; }

case "$cmd" in
  vpn_user_create)      /opt/viworks/bin/vpn_user_create "$@";;
  vpn_user_delete)      /opt/viworks/bin/vpn_user_delete "$@";;
  vpn_user_passwd)      /opt/viworks/bin/vpn_user_passwd "$@";;
  update_ccd)           /opt/viworks/bin/update_ccd "$@";;
  spawn_browser_container) /opt/viworks/bin/spawn_browser_container "$@";;
  terminate_session)    /opt/viworks/bin/terminate_session "$@";;
  pull_logs)            /opt/viworks/bin/pull_logs "$@";;
  *)                    echo "invalid"; exit 2;;
esac
log "$@"

authorized_keys example (one line):

command="/opt/viworks/bin/dispatch",no-agent-forwarding,no-port-forwarding,no-pty ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...


⸻

14) Compliance Mapping (concise)
	•	ISO 27001:
	•	A.5/A.6 (Policies/Org), A.8 Access Control, A.12 Operations, A.13 Communications security, A.16 Incident mgmt, A.18 Compliance.
	•	SOC 2 (Security/Availability/Confidentiality): change mgmt evidence, access reviews, monitoring SLOs, DR tests.
	•	GDPR: DPIA, data minimization/pseudonymization, retention controls, DSAR process.
	•	NIST 800-53: AC (Access Control), AU (Audit), IA (Identification & Auth), SC (Cryptographic protection), CM (Config Mgmt), IR (Incident Response).
	•	NIST 800-207 (Zero Trust): policy decision at backend, continuous evaluation, least privilege, device posture incorporation.
	•	OWASP ASVS / MASVS: session mgmt, crypto, secure mobile storage, integrity/anti-tamper, network pinning.

⸻

15) Test Plan (functional + security)

15.1 Functional (happy path)
	1.	Create user → bind mobile device → desktop login → OTP → fetch sealed bootstrap → SPA→TLS→OVPN up → container spawned → browsing works → admin sees live session → admin terminates session → forced disconnect (<10s).
	2.	Policy update (e.g., time window) → propagate to gateways via SSH ForceCommand → verify enforcement.
	3.	Logs visible in SIEM: auth, OTP, SPA, TLS, OVPN, container, admin actions.

15.2 Negative & security tests
	•	Pinning: swap front-door cert → desktop refuses.
	•	Split-tunnel: attempt local egress/DNS → blocked; leak test logs violation.
	•	Downgrade: force TLS 1.2 → stunnel rejects.
	•	SPA replay: resend old SPA → denied; detect in logs.
	•	OTP replay/guess: rate-limit & expire; alerts after threshold.
	•	Revocation: unbind device or disable user → active session torn down <10s.
	•	Rooted/emulated mobile: attestation fails → OTP issuance denied.
	•	DoS: SPA flood, TLS handshake storm, OpenVPN churn → rate limits trigger; LB/scale; alerts fire.
	•	ForceCommand abuse: attempt disallowed command → rejected; SIEM alert.
	•	Client persistence: ensure no sealed bootstrap artifacts on disk; memory scrubbing on disconnect.

⸻

16) Risk Register & Open Questions

16.1 Risk register

Risk	Impact	Likelihood	Mitigation	Owner	Target
Gateway node compromise	High	Low-Med	CIS hardening, minimal services, EDR, SSH ForceCommand, rotation	SecOps	Q4
Bootstrap/profile leak	High	Low	HPKE sealed, short-lived refs, in-memory only, DPAPI/Keychain storage	Platform	Q3
Client tamper/RE	Medium	Medium	Code signing, notarization, obfuscation, integrity self-tests	Client Eng	Q3
SIEM overload/outage	Medium	Low	Dual-path shipping, local buffers, ingest lag alerts	SecOps	Q2
PKI misconfig / pin-roll failure	High	Low	Pin-roll playbook; primary+backup pins; CT monitoring	Platform	Q2
Geo/ASN bypass via VPN/proxy/SIM swap	High	Medium	Multi-signal risk engine; deny risky ASNs; velocity checks	Security	Q3
Update supply chain	Critical	Low-Med	Signed artifacts, SBOM, SLSA L3+, staged rollout, rollback	Release Eng	Q2
Container escape	High	Low	Seccomp/AppArmor, drop caps, RO FS, egress allowlist	SecOps	Q3
DoS at SPA/stunnel/OVPN	High	Medium	Layered rate limits; autoscale; WAF/L4 DDoS where applicable	SRE	Q2
Insider policy relaxation	High	Medium	Dual approval; immutable logs; alerting; periodic access reviews	Compliance	Q2

16.2 Open questions
	•	Finalize the ForceCommand allowlist and change-approval workflow.
	•	Confirm SIEM field dictionary and retention by tenant.
	•	Define BLE co-presence and same-NAT usage (mandatory for which roles?).
	•	Desktop TPM-based attestation scope (optional now).

⸻

17) Machine-Readable Artifacts

17.1 architecture_manifest.yaml

version: 1
components:
  admin_panel:
    tech: react+ts
    port: 3000
    talks_to: [backend]
  backend:
    tech: rust/actix
    port: 443
    endpoints: [/auth/*, /device/*, /client/bootstrap, /policies/*, /sessions/*, /audit/*]
    talks_to: [pki, siem, gateway]
  gateway:
    roles: [fwknopd, stunnel, openvpn, restricted_ssh, nginx, containerd]
    exposed:
      - name: fwknopd
        port: 62201
        proto: udp
      - name: stunnel
        port: 443
        proto: tcp
    internal:
      - openvpn: "127.0.0.1:1194/tcp"
      - ssh_forcecmd: "2222/tcp"
  mobile_app:
    platforms: [android, ios]
    binds_device: true
    talks_to: [backend]
  desktop_client:
    platforms: [windows, macos, linux]
    flow: [login, otp, preflight, bootstrap, spa, tls, openvpn]
  siem:
    inputs: [auth_logs, tunnel_logs, container_logs, admin_logs]
protocols:
  - name: spa
    purpose: transient port open (443)
  - name: tls
    min_version: "1.3"
    ciphersuites: [TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256]
  - name: openvpn
    transport: tcp-over-tls
    tls: mTLS + tls-crypt
trust_boundaries:
  - internet_to_gateway
  - internet_to_backend
  - backend_to_gateway
  - backend_to_pki_siem

17.2 threat_model.json

{
  "assets": [
    "sealed_bootstrap", "gateway_keys", "client_device_keys",
    "admin_tokens", "audit_logs", "ovpn_ca"
  ],
  "threats": [
    {"id":"T1","stride":"S","desc":"Server discovery via scan","mitigations":["SPA gating","deny by default"]},
    {"id":"T2","stride":"T","desc":"Client tamper/RE","mitigations":["code signing","integrity checks","obfuscation","server-side validation"]},
    {"id":"T3","stride":"R","desc":"OTP replay","mitigations":["short TTL","rate limit","bind to device"]},
    {"id":"T4","stride":"I","desc":"Session hijack/redirect","mitigations":["TLS pinning","OpenVPN mTLS","route/DNS pinning"]},
    {"id":"T5","stride":"E","desc":"Split-tunnel exfil","mitigations":["redirect-gateway","DNS policy","egress allowlist"]},
    {"id":"T6","stride":"D","desc":"Handshake exhaustion","mitigations":["per-layer rate limits","autoscale","SYN cookies"]}
  ],
  "residual_risk": {"overall":"medium-low"}
}

17.3 data_flows.ndjson

{"flow":"login","step":1,"from":"desktop","to":"backend","data":"username/password","controls":["rate-limit","geo/asn policy"]}
{"flow":"login","step":2,"from":"backend","to":"mobile","data":"otp challenge","controls":["device binding","attestation","ttl=120s"]}
{"flow":"bootstrap","step":1,"from":"desktop","to":"backend","data":"short-lived token","controls":["AAL2 session"]}
{"flow":"bootstrap","step":2,"from":"backend","to":"desktop","data":"hpke sealed (spa+fqdn+ovpn inline)","controls":["short-lived","memory-only decrypt"]}
{"flow":"connect","step":1,"from":"desktop","to":"gateway","data":"SPA packet","controls":["per-ip","ttl<=20s","nonces"]}
{"flow":"connect","step":2,"from":"desktop","to":"gateway","data":"TLS1.3 handshake","controls":["spki pinning","ciphersuites pinned"]}
{"flow":"connect","step":3,"from":"desktop","to":"gateway","data":"OpenVPN mTLS + tls-crypt","controls":["AEAD","route/DNS push"]}
{"flow":"ops","step":1,"from":"admin","to":"backend","data":"policy delta","controls":["RBAC","dual approval for relaxations"]}
{"flow":"ops","step":2,"from":"backend","to":"gateway","data":"forcecommand ops","controls":["ssh 2222","allowlist","firewall source pinning"]}


⸻

18) Why this is implementation-ready
	•	End-to-end concreteness: exact ports, protocols, cipher suites, trust boundaries, sealed bootstrap mechanism, in-memory client configs, SPKI pinning, SSH ForceCommand control plane.
	•	Config baselines included: fwknopd, stunnel, OpenVPN (server & client), iptables, systemd, ForceCommand dispatcher.
	•	Security posture baked in: STRIDE/ATT&CK threats with mitigations, MASVS/ASVS mappings, CIS baselines, SIEM schema, concrete detections, SLOs.
	•	Operability covered: HA/DR targets, performance tuning, load test plan, DevSecOps (SLSA, SBOM, signed updates), rollback.
	•	Compliance mapped: ISO/SOC2/GDPR/NIST references matched to implemented controls.
	•	Machine-readable artifacts allow wiring CI, policy checks, and documentation tooling.

This single document contains sufficient specificity for engineering to build, security to review & test, and operations to deploy & run the ViWorkS platform with the intended assurance level.