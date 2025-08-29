viworks_desktop_client.md

Component: ViWorkS Desktop Client (Win/macOS/Linux)
Audience: Client engineers, security engineers, QA, IT packaging, red/blue teams
Version: 1.0 (implementation-ready)
Canonical terms: SPA → TLS proxy → OpenVPN, sealed bootstrap (HPKE), device binding, SPKI pinning, in-memory configs, dual stack Win/macOS/Linux

⸻

1) Role & Scope

1.1 Purpose

The ViWorkS Desktop Client is the user-facing, security-critical endpoint that:
	•	Authenticates the user (username/password).
	•	Performs step-up with a bound mobile app OTP (6-digit, ~120s TTL).
	•	Runs preflight checks (no active tunnel, time/geo policy, binaries, network reachability).
	•	Fetches a sealed bootstrap from Backend (HPKE-encrypted to a device key).
	•	Decrypts bootstrap only in locked memory; never writes secrets to disk.
	•	Executes the connection sequence SPA → TLS(1.3, pinned) → OpenVPN (mTLS) using:
	•	Built-in TLS proxy (Rustls) in place of external stunnel.
	•	OpenVPN launched with --config - (stdin) and inline certs/keys.
	•	Enforces client-side safety (redirect-gateway, DNS leak checks) and emits minimal telemetry.

1.2 Non-goals
	•	No direct policy decisions (allow/deny, routes, DNS) beyond client-side enforcement of server policies.
Policy is validated server-side; client must fail closed on policy mismatches.
	•	No direct communication with Gateways for control (that is Backend↔Gateway over SSH ForceCommand).
	•	No persistence of sensitive bootstrap artifacts on disk under any circumstance.

⸻

2) Interfaces & Dependencies

2.1 Backend APIs (HTTPS, TLS 1.3, SPKI pinned)
	•	POST /auth/login — { username, password, device_nonce } → { login_state, txn_id }
	•	POST /auth/verify — { txn_id, otp_code } → { access_token (short-lived), bootstrap_grant }
	•	GET  /client/bootstrap — authz by token; returns HPKE-sealed payload (see §8.1)
	•	POST /device/enroll — first-run binding: { device_pubkey, fingerprint, platform, version }

Notes
	•	All requests include a client trace_id header; responses include the same for SIEM correlation.
	•	SPKI pinning to Backend front-door with primary + backup pins; fail-closed.

2.2 Gateway (data path only)
	•	SPA (Single Packet Authorization): client sends a single, keyed authorization packet to fwknopd.
	•	TLS proxy: client connects to gw.<org>.example:443 over TLS 1.3 (Rustls; SPKI pinned).
	•	OpenVPN over TLS: TCP stream proxied to 127.0.0.1:1194; OpenVPN runs mTLS inside TLS.

2.3 Mobile App (human in loop)
	•	User views time-boxed 6-digit OTP on bound device after Backend pushes challenge.
	•	Optionally, future BLE co-presence check to ensure mobile is physically near desktop.

2.4 OS Integrations
	•	Key storage:
	•	Windows: TPM 2.0 bound key with DPAPI-NG protection fallback.
	•	macOS: Secure Enclave (Keychain, kSecAttrTokenIDSecureEnclave), fallback to Keychain.
	•	Linux: TPM2 via tpm2-pkcs11 or kernel keyring + FS encryption, guarded by mlockall.
	•	Process mitigations:
	•	Windows: SetDefaultDllDirectories, CFG, CET, DisallowDynamicCode.
	•	macOS: Hardened Runtime, Notarization, library validation.
	•	Linux: seccomp-basic profile (optional), no_new_privs, PR_SET_DUMPABLE=0.

⸻

3) Data & Config Management

3.1 Device Key & Identity
	•	On first run:
	•	Generate device key pair (default: X25519 or P-256). Private key is non-exportable where supported:
	•	Windows: CNG KSP tied to TPM; DPAPI (with machine entropy) as fallback.
	•	macOS: Keychain item with Secure Enclave (kSecAttrTokenIDSecureEnclave).
	•	Linux: TPM2 if available; else store encrypted using libsodium sealed box + machine binding, and mlockall to avoid swap.
	•	Send public key + device fingerprint to Backend /device/enroll for binding approval.
	•	Storage: Only opaque handle/label of the private key is persisted; no plaintext keys.

3.2 Sealed Bootstrap (HPKE)
	•	After OTP, client calls /client/bootstrap and receives:
	•	hpke_encapsulated_key, ciphertext, aad, exp (≤ 10 min).
	•	Client derives shared secret with device private key to decrypt payload.
	•	Decryption target: locked memory only
	•	Windows: VirtualLock pages; macOS/Linux: mlock/munlock.
	•	Sensitive buffers are wrapped in zeroize::Zeroizing<T>; wiped on drop.
	•	Never persisted: No temp file, no crash dump (disable or sanitize crash handlers).
	•	On disconnect/exit: All secrets (SPA key, TLS pin set, mTLS material) are zeroized.

3.3 OpenVPN Launch (stdin config)
	•	Launch openvpn with:
	•	--config - (read from stdin).
	•	Inline ca, cert, key, tls-crypt from decrypted bootstrap.
	•	No management interface by default. If enabled for telemetry, bind 127.0.0.1: with password from bootstrap and never log it.
	•	Wintun is preferred on Windows (fall back to TAP).
	•	Cleanup: on termination, ensure routes/dns revert; kill orphaned process group.

3.4 Embedded TLS Proxy (Rustls)
	•	Client starts an internal TLS proxy that:
	•	Listens 127.0.0.1:1194.
	•	Dials gw.<org>.example:443 with TLS 1.3, ServerName verified, SPKI pinned (primary + backup).
	•	Forwards a raw TCP stream (no ALPN or http/2).
	•	Keeps socketpair metrics to report handshake and round-trip latencies (for SLOs).

⸻

4) Security Controls
	•	SPKI pinning:
	•	Backend SPKI (for REST/WS).
	•	Gateway SPKI (for Rustls proxy). Supports dual pins for roll.
	•	Code signing / notarization:
	•	Windows: Sign with EV cert; enable ASR-friendly patterns; PE mitigations on.
	•	macOS: Sign + Notarize, Hardened Runtime, entitlements minimal.
	•	Linux: Package signing (rpm/deb) + repo signing; detached signature for tarballs.
	•	Integrity self-check:
	•	On startup, compute hash of executable/resources; verify embedded signature.
	•	Refuse to run if invalid; emit telemetry (without secrets).
	•	Anti-debug/hooking:
	•	Detect ptrace/DebugActiveProcess, common hooking DLLs/Frida; terminate with generic error.
	•	On macOS, Disable Library Validation only if strictly needed; prefer keep it enabled.
	•	Preflight checks (fail-closed with specific UI messages):
	•	Network reachability to Backend (p50 ≤ 200ms) and Gateway DNS resolution.
	•	No active VPN: detect TUN/TAP/Wintun or routes from previous sessions.
	•	Timezone/Geo policy: read OS timezone; if off-policy, block or require admin override per Backend.
	•	Process hardening applied (Windows mitigations set).
	•	Binaries present (OpenVPN) & signatures verified (Windows).
	•	Traffic enforcement:
	•	Push redirect-gateway def1; verify default route post-connect.
	•	DNS: honor pushed DNS; on Windows push block-outside-dns.
	•	Leak tests: after connect, run DNS/HTTP probes to confirm no local egress; if leak, auto-disconnect and report.
	•	Session controls:
	•	Idle auto-logout (default 15 min, server-configurable).
	•	Heartbeat to Backend; on revocation event, disconnect < 10s target.

⸻

5) Implementation Notes

5.1 Tech Stack (Rust)
	•	Runtime: tokio (async), tracing (structured logs), anyhow/thiserror (errors).
	•	Crypto:
	•	TLS: rustls (TLS 1.3 only).
	•	HPKE: hpke crate (X25519HKDF-SHA256 + ChaCha20-Poly1305 or AES-GCM).
	•	Random: rand::rngs::OsRng.
	•	Zeroization: zeroize.
	•	System:
	•	Windows: windows crate to apply mitigations & DPAPI/TPM access.
	•	macOS: security-framework for Keychain/Enclave; libc for mlock.
	•	Linux: rtnetlink optional for route checks; libc for mlock/PR_SET_DUMPABLE.

5.2 Process Hardening (Windows example)
	•	Early in main():
	•	SetDefaultDllDirectories(LOAD_LIBRARY_SEARCH_SYSTEM32), SetDllDirectoryW(L"").
	•	SetProcessMitigationPolicy with DisallowDynamicCode=1, DisableExtensionPoints=1, DisableNonSystemFonts=1.
	•	Ensure handle inheritance off; child processes with env_clear.

5.3 Embedded TLS Proxy (design)
	•	Single threaded proxy task:
	•	Accept on 127.0.0.1:1194.
	•	On connect: establish Rustls client session to gw.<org>.example:443.
	•	Verify hostname and SPKI (primary/backup).
	•	Ciphersuites: TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256.
	•	No renegotiation; session resumption allowed; 0-RTT disabled.
	•	Pump bytes between the two sockets with backpressure.

5.4 OpenVPN invocation
	•	Resolve absolute path:
	•	Windows: C:\Program Files\ViWorkS\bin\openvpn.exe (signature verified).
	•	macOS/Linux: /usr/local/sbin/openvpn or bundled path.
	•	Launch with:

openvpn --config - --verb 3 --setenv UV_ID <session-id>


	•	stdin contains full config (see §8.2) built from in-memory bootstrap.

5.5 UI & UX (minimal)
	•	Pages/States: Login → OTP → Preflight → Connect → Connected → Disconnect.
	•	Status log pane with steps (Login OK → OTP verified → Bootstrap received → SPA sent → TLS ok → OVPN up).
	•	Errors are redacted; never show keys/addresses; copyable diagnostic code for support.

⸻

6) Failure & Recovery

Failure	Behavior	Recovery
OTP expired/invalid	Prompt re-entry; exponential backoff; lockout after N attempts	Re-request OTP from mobile; show time remaining
SPA failure	Show guidance (“network or policy issue”); do 3 retries with jitter	Validate clock skew; ensure IP not NAT-mismatched; escalate to admin
TLS pin mismatch	Hard fail; display diagnostic code; log event; block until manual update	Require client update with new backup pin; consult pin roll playbook
OpenVPN crash/exit	Cleanup routes/DNS; retry up to N with backoff; cap attempts	Persist last error code; suggest contacting admin
Backend unreachable	Fail closed; do not use stale bootstrap	Retry login later; offline mode not supported
Key store error	Attempt fallback (e.g., DPAPI on Windows); if not allowed by policy, fail closed	Prompt to re-enroll device


⸻

7) Future Extensions
	•	BLE co-presence with mobile for proximity validation (configurable for high-assurance users).
	•	TPM attestation (Windows/Linux) and DeviceCheck/Attestation (macOS) for desktop posture.
	•	OpenVPN management telemetry (strict: loopback only, random port, password from bootstrap, disabled by default).
	•	DoH for captive portal detection before connect to avoid false leak alarms.

⸻

8) Configuration Reference (Appendix)

8.1 Bootstrap Payload (HPKE-sealed) — example schema

{
  "ver": 1,
  "exp": "2025-09-01T12:34:56Z",
  "user": "u-1a2b3c",
  "session_id": "s-77ccaa",
  "gw_fqdn": "gw.viworks.example",
  "spki_pins": {
    "backend": {"primary_b64":"...","backup_b64":"..."},
    "gateway": {"primary_b64":"...","backup_b64":"..."}
  },
  "spa": {
    "proto": "udp",
    "port": 62201,
    "hmac_key": "base64...",
    "enc_key": "base64...",
    "ttl_s": 20
  },
  "ovpn": {
    "proto": "tcp-client",
    "cipher": "AES-256-GCM",
    "data_ciphers": ["AES-256-GCM","AES-128-GCM"],
    "auth": "SHA256",
    "tls_crypt_key_inline": "-----BEGIN OpenVPN Static key V1-----\n...\n-----END OpenVPN Static key V1-----\n",
    "ca_inline": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n",
    "cert_inline": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n",
    "key_inline": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
    "dns_push": ["10.0.0.53"],
    "redirect_gateway": true,
    "block_outside_dns": true
  }
}

Delivered as HPKE ciphertext + enc + aad; client must decrypt in locked memory.

8.2 OpenVPN stdin Config (constructed in memory)

client
dev tun
proto tcp-client
remote 127.0.0.1 1194
resolv-retry infinite
nobind
persist-key
persist-tun

cipher AES-256-GCM
data-ciphers AES-256-GCM:AES-128-GCM
auth SHA256
remote-cert-tls server
explicit-exit-notify 1
verb 3

<tls-crypt>
{{INLINE_TLS_CRYPT}}
</tls-crypt>

<ca>
{{INLINE_CA}}
</ca>

<cert>
{{INLINE_CERT}}
</cert>

<key>
{{INLINE_KEY}}
</key>

8.3 Rustls Embedded Proxy (illustrative snippet)

// Pseudocode for clarity; production code must include error handling & zeroization where relevant.
let accept = TcpListener::bind(("127.0.0.1", 1194)).await?;
let mut root_store = rustls::RootCertStore::empty(); // empty, we pin SPKI instead

let cfg = rustls::ClientConfig::builder()
    .with_safe_defaults()
    .with_custom_certificate_verifier(Arc::new(PinnedSpkiVerifier::new(primary_pin_b64, backup_pin_b64)))
    .with_no_client_auth();

loop {
    let (mut local, _) = accept.accept().await?;
    let server = TcpStream::connect(("gw.viworks.example", 443)).await?;

    let server_name = ServerName::try_from("gw.viworks.example")?;
    let conn = rustls::ClientConnection::new(Arc::new(cfg.clone()), server_name)?;
    let mut tls = rustls::StreamOwned::new(conn, server);

    // Split-copy between local <-> tls with backpressure
    tokio::try_join!(
        tokio::io::copy(&mut local, &mut tls),
        tokio::io::copy(&mut tls, &mut local)
    )?;
}


⸻

9) Test Plan

9.1 Functional
	1.	First-run enroll: Generate device key, enroll with Backend, receive approval.
	2.	Login → OTP: Enter creds; OTP arrives on bound mobile; verify; get access token.
	3.	Bootstrap: Receive HPKE sealed payload; decrypt in memory; verify exp.
	4.	Preflight: All green (network, timezone policy, no active VPN).
	5.	Connect: Send SPA; Rustls proxy handshake; OpenVPN stdin config; tunnel up.
	6.	Traffic enforcement: Confirm default route and DNS are via tunnel; leak test passes.
	7.	Disconnect: Routes/DNS revert; memory zeroized; session ends; Admin sees termination within <10s.

9.2 Security / Negative
	•	Wrong OTP N times → lockout & SIEM event.
	•	Bootstrap replay attempt → reject (expired/nonce mismatch).
	•	TLS pin mismatch → fail closed; proper diagnostic code.
	•	Tampered binary (modified PE/Mach-O) → integrity check fails; refuse to run.
	•	Key store denial (TPM/Enclave not available) → fallback policy enforced; if disallowed, block.
	•	DNS leak forced by local resolver → client detects and disconnects.
	•	Frida/ptrace attached → client detects and exits with generic error; SIEM notice.

9.3 OS-level
	•	Windows: Verify Wintun usage; block-outside-dns honored; DLL search hardening active.
	•	macOS: Verify notarization; Keychain/Enclave key non-exportable; routes set via scutil/route.
	•	Linux: mlockall active; PR_SET_DUMPABLE=0; fallback risk flag visible if TPM absent.

⸻

10) Risk Register & Open Questions

10.1 Desktop-specific Risks

Risk	Impact	Likelihood	Mitigation	Residual
Device key extraction on compromised host	High	Med	TPM/Enclave non-exportable keys; memory locking + zeroize; no disk secrets	Med
Reverse engineering & tamper	High	Med	Code signing, integrity self-check, anti-debug/hook, obfuscation, Hardened Runtime	Med-Low
Bootstrap data leak	High	Low	HPKE sealed; in-memory only; short TTL; zeroize on exit	Low
DNS/route leaks	High	Med	Enforce redirect-gateway, DNS push; post-connect leak tests; auto-disconnect	Low
TLS pin roll mishandled	Med	Low	Primary+backup pins; roll playbook; telemetry on pin usage	Low
OpenVPN process orphaned	Med	Low	Process group kill; route/DNS cleanup; watchdog	Low
Linux fallback without TPM	Med	Med	Kernel keyring + mlockall; raise risk score; optionally block by policy	Med

10.2 Open Questions
	•	Mandatory BLE co-presence for high-assurance groups (policy default?).
	•	TPM attestation rollout schedule per platform (Windows/Linux).
	•	OpenVPN telemetry via management interface — enable by default or opt-in?
	•	Exact leak-test endpoints and frequency (balance privacy and detection).

⸻

End of viworks_desktop_client.md