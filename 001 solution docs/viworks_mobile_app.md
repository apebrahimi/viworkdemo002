viworks_mobile_app.md

Component: ViWorkS Mobile App (Android + iOS)
Audience: Mobile engineers, security engineers, QA, blue team, release engineering
Version: 1.0 (implementation-ready)
Canonical terms: Device binding, attestation, OTP issuance (120s), co-presence (BLE), SPKI pinning, sealed bootstrap (desktop only)

⸻

1) Role & Scope

1.1 Purpose

The ViWorkS Mobile App is the user’s possession factor and device-of-record that:
	•	Performs first-run device binding (key generation in secure keystore + attestation).
	•	Provides mobile attestation on demand (Play Integrity / App Attest / DeviceCheck).
	•	Issues OTP (6-digit, time-boxed ≤120s) after successful attestation and policy checks.
	•	Optionally proves co-presence with the Desktop Client via BLE for high-assurance roles.
	•	Publishes minimal telemetry (attestation verdicts, coarse geo signals) to Backend for risk scoring.

1.2 Non-goals
	•	No VPN/tunnel control, no gateway discovery, no bootstrap handling.
	•	No storage of Desktop/Client secrets.
	•	No direct connection to Gateway or container resources.

⸻

2) Interfaces & Dependencies

2.1 Backend APIs (TLS 1.3, SPKI pinned)

All requests: Authorization: Bearer <device_token_or_refresh>, X-Trace-Id, X-Client-Version, JSON body.
	•	POST /device/enroll
Body: { platform, device_pubkey, device_fingerprint, app_sig_digest, os_version, build_fingerprint }
Result: { device_id, status: "pending|approved", token }
	•	POST /mobile/attest
Android Body: { device_id, attestation_type:"play_integrity", jws_token }
iOS Body: { device_id, attestation_type:"app_attest", client_data, att_obj }
Result: { verdict: "pass|fail", reasons:[...], device_token (rotatable) }
	•	POST /auth/otp/issue
Body: { device_id, sign: base64(signature_over_server_challenge), signals }
Signals (subset): { tz, ip_asn, coarse_geo, mcc_mnc, bssid_hash, os_patch_level }
Result: { otp_code, expires_at } (≤120s TTL; not reusable)
	•	POST /device/heartbeat (optional)
Body: { device_id, battery, jailbroken/rooted: bool, last_attest_at }
Result: { policy: {...} } (may instruct co-presence requirement)

Timeouts: connect ≤ 3s, read ≤ 5s. Retry: 3 attempts with backoff (jitter).
SPKI pinning: primary + backup pins for Backend front-door.

2.2 BLE (optional co-presence)
	•	Mobile (Central) ↔ Desktop (Peripheral) using BLE GATT:
	•	Service UUID: a1f3xxxx-...-viworks-presence
	•	Characteristics:
	•	challenge (notify): desktop emits ephemeral 32-byte nonce.
	•	response (write): mobile writes HMAC(device_privkey_alias, nonce || time_s).
	•	rssi (read/notify): desktop measures RSSI and reports to Backend.
	•	Desktop forwards verification to Backend; Backend validates signature using the device public key from binding.

2.3 OS Secure Keystore
	•	Android: Android Keystore with StrongBox if present; EC P-256 (or Ed25519 where supported). Keys non-exportable.
	•	iOS: Keychain with Secure Enclave (kSecAttrTokenIDSecureEnclave), EC P-256, access control: kSecAccessControlBiometryCurrentSet | kSecAccessControlDevicePasscode (configurable policy).

⸻

3) Data & Config Management

3.1 Local Data (minimal)
	•	device_id (opaque), key_alias, app_version, last_attest_timestamp.
	•	No user credentials, no bootstrap, no server addresses beyond FQDN already public.

3.2 Keys
	•	Generate key pair during onboarding using OS keystore. Private key is non-exportable.
	•	Store only alias/handle; never raw key material.
	•	Key rotation supported via /device/rotate (future), with seamless re-bind.

3.3 Attestation Tokens
	•	Verified server-side; on the device keep only a short-term cache marker (≤10m) to avoid repeated calls under rate limits.
	•	Tokens never persisted long-term; kept in memory.

3.4 OTP Lifecycle
	•	OTP issued only after: bound device + fresh attestation + policy (geo/ASN/time) checks.
	•	OTP TTL ≤ 120s (configurable); single use.
	•	No local generation (no TOTP seed on device). All OTPs are server-issued.

⸻

4) Security Controls

4.1 Mobile Attestation & Pinning
	•	Android: Google Play Integrity API (Standard + Device Integrity + Basic Integrity). Reject if:
	•	MEETS_STRONG_INTEGRITY absent for high-assurance roles, or
	•	MEETS_DEVICE_INTEGRITY absent for standard roles, or
	•	ctsProfileMatch=false (legacy SafetyNet fallback), or
	•	appRecognitionVerdict not PLAY_RECOGNIZED.
	•	iOS: App Attest (preferred) or DeviceCheck fallback; require:
	•	Valid attestation object for current app bundle ID & Team ID,
	•	Nonce bound to current device_id,
	•	Freshness window ≤ 2 min.
	•	SPKI pinning to Backend; fail-closed on mismatch.
	•	App signature self-check at runtime:
	•	Android: verify signing cert SHA-256 fingerprint matches embedded constants, check installer package is Google Play (if policy).
	•	iOS: verify bundleIdentifier & teamIdentifier match build-time constants.

4.2 Device Posture & Anti-Tamper
	•	Root/Jailbreak/Emulator detection:
	•	Android: root binaries, rw system partitions, dangerous props, Magisk/Xposed/Frida, emulator artifacts (qemu, goldfish), debugging flags, isDebuggable=false enforcement.
	•	iOS: jailbreak files, sandbox escapes, writable system paths, suspicious dylibs, ptrace/hooking detection (e.g., sysctl, task_get_exception_ports).
	•	Developer options: if adb_enabled || allow_mock_location then deny or escalate to high-risk flow.
	•	Hooking/debugging: detect Frida/objection; anti-Frida stubs; block JDWP on release.
	•	Obfuscation: R8/ProGuard + string/resource encryption; iOS Swift with build-time string encryption.

4.3 Geo-Fraud Defenses
	•	GPS spoof detection:
	•	Cross-check GPS vs Wi-Fi BSSID (hashed), cell MCC/MNC vs IP geo (from Backend).
	•	Android: reject isFromMockProvider==true.
	•	If any major divergence → mark risk_high → deny OTP or require co-presence.
	•	Velocity checks: impossible travel (distance/time), ASN change velocity.

4.4 Co-presence (BLE)
	•	Hard requirement for high-assurance groups.
	•	Mobile responds to desktop nonce with keystore-backed signature.
	•	Backend verifies signature and RSSI threshold (config per site). If RSSI low or signature invalid → deny OTP.

4.5 Privacy & Logging
	•	Structured logs without sensitive data.
	•	All PII minimized (only device_id, verdict flags, coarse geo).
	•	GDPR: expose “reset device binding” flow via Admin if requested.

⸻

5) Implementation Notes

5.1 Android
	•	Language: Kotlin. Min SDK 24+.
	•	Keystore: KeyGenParameterSpec with setUserAuthenticationRequired(true) (config), setIsStrongBoxBacked(true) when available, curve EC_P256.
	•	Attestation: Play Integrity API with server-side verification; timeout ≤ 3s.
	•	Network: OkHttp(HTTPS) or Ktor + Conscrypt optional; TLS 1.3 only; SPKI pinning via OkHttp CertificatePinner.
	•	BLE: BluetoothLeScanner for desktop peripheral; GATT client with auto-reconnect jitter.

5.2 iOS
	•	Language: Swift. iOS 14+.
	•	Secure Enclave: SecKeyCreateRandomKey with kSecAttrTokenIDSecureEnclave, access control for local auth as policy.
	•	Attestation: App Attest flow (ASAuthorizationPlatformPublicKeyCredentialProvider alt if needed).
	•	Network: URLSession with ATS enforced; SPKI pinning with SecTrustEvaluate custom evaluator.
	•	BLE: CoreBluetooth central; background modes not required (foreground-only presence).

5.3 UX / States
	•	Enroll → Attest → Ready; show device status indicator.
	•	OTP screen shows 6-digit code + remaining TTL; disables copy/paste (optional).
	•	Co-presence prompt when required; progress bar for BLE handshake.
	•	Failures map to precise error codes (for SIEM & support).

⸻

6) Failure & Recovery

Scenario	User Feedback	App Behavior	Backend Expectation
Attestation fail	“Device integrity check failed.”	Offer remediation tips (update OS, disable dev options), re-try after cooldown	Log reason codes; increment risk; optional case open
OTP expired	“Code expired. Request a new code.”	Auto-refresh disabled; explicit re-request with backoff	Old OTP invalidated
Network loss	“Network unavailable.”	Show retry; no offline OTP	None
BLE fail	“Co-presence could not be verified.”	Retry up to N with jitter; fallback to risk engine if policy allows	Policy decides deny/step-up
SPKI pin mismatch	“Secure connection error.”	Hard fail; instruct app update	Alert ops; pin rollbook


⸻

7) Future Extensions
	•	FIDO2/WebAuthn as additional possession factor for privileged logins.
	•	Silent push challenge: auto open app to OTP screen with code pre-fetched post-attestation.
	•	In-app session view: list active sessions, allow user-initiated revoke.
	•	BLE + UWB distance bounds on supported devices.

⸻

8) Configuration Reference (Appendix)

8.1 Example: OTP Challenge/Response
	•	Flow:
	1.	Desktop user logs in → Backend creates otp_challenge for bound device_id.
	2.	Mobile opens app → calls /mobile/attest then /auth/otp/issue.
	•	Request:

POST /auth/otp/issue
{
  "device_id": "dev_8f3a...",
  "sign": "base64( Sign_{device_privkey}(server_challenge || now_utc_epoch) )",
  "signals": {
    "tz": "Asia/Tehran",
    "mcc_mnc": "432-11",
    "bssid_hash": "sha256:ab12...",
    "os_patch_level": "2025-08",
    "ip_asn": 58224,
    "coarse_geo": {"lat": 35.7, "lon": 51.4, "acc": 2500}
  }
}

	•	Response:

{
  "otp_code": "481263",
  "expires_at": "2025-09-01T12:34:56Z"
}

8.2 Attestation Verification (abstract)
	•	Android: App sends jws_token. Server verifies:
	•	Google signature, timestamp freshness, package name, SHA-256 cert digest, device verdict flags, nonce binding to device_id.
	•	iOS: App Attest object + client data. Server verifies:
	•	Apple signature chain, team/bundle IDs, challenge/nonce, key ID continuity, timestamp.

8.3 BLE Co-presence Handshake
	1.	Desktop advertises viworks-presence service; pushes nonce via notify.
	2.	Mobile computes resp = ECDSA_sign(device_privkey, H(nonce || t)) and writes to response.
	3.	Desktop forwards {device_id, nonce, resp, rssi} to Backend.
	4.	Backend verifies signature with bound device pubkey, checks RSSI ≥ threshold (site config), TTL ≤ 10s → pass.

⸻

9) Test Plan

9.1 Functional
	1.	Enroll device: generate key, send enroll → receive device_id.
	2.	Attest pass: Play Integrity/App Attest → Backend returns verdict=pass.
	3.	Issue OTP: request → receive 6-digit code, TTL shows countdown.
	4.	Desktop verify: user enters OTP → Backend accepts → desktop continues to bootstrap/connect.
	5.	Co-presence: BLE handshake while desktop listens → OTP only issued upon presence pass.

9.2 Security / Negative
	•	Root/jailbreak detected → OTP issuance blocked, SIEM event with reason codes.
	•	Emulator detected → deny.
	•	Mock location on Android → risk_high → deny or require BLE.
	•	Replay OTP → Backend rejects second use.
	•	Tampered app (repacked) → signature self-check fails + attestation fails.
	•	SPKI pin mismatch → connection refused.

9.3 BLE
	•	Near device (≤2m): RSSI above threshold → pass.
	•	Far device (>5–10m or separated by walls): RSSI low → fail presence.
	•	No BLE hardware: policy fallback path validated.

⸻

10) Risk Register & Open Questions

10.1 Risks

Risk	Impact	Likelihood	Mitigation	Residual
Root/jailbreak bypass via advanced tools	High	Med	Integrity APIs + multi-signal checks + deny list; periodic re-attestation	Med
App re-packaging	High	Med	App signature self-check + Attestation (package+cert binding)	Low-Med
GPS spoofing	Med	Med	Cross-signals: Wi-Fi BSSID, MCC/MNC, IP ASN, velocity; BLE co-presence	Low-Med
Integrity API unavailable (custom ROMs)	Med	Low-Med	Deny by policy or require BLE + manual exception	Low
BLE presence spoof (relay)	High	Low	Short-TTL nonce, signature, RSSI bounds, optional timing checks	Med
Token theft on device	Med	Low	Keystore-backed non-exportable keys; tokens short-lived; TLS pinning	Low
Privacy leakage via location	Med	Low	Coarse geo only; user consent; retention limits	Low

10.2 Open Questions
	•	Make co-presence mandatory for all users, or only high-assurance groups?
	•	Exact RSSI thresholds and environmental calibration per site.
	•	Policy for custom ROM users (block vs exception workflow).
	•	Frequency of re-attestation (per OTP vs sliding window).

⸻

Notes for Engineers
	•	Treat the client as hostile: all checks are advisory; server-side validation is final.
	•	Keep business logic (risk/geo policies, TTLs) on the server; the app supplies signals and performs UX.
	•	Do not log OTPs, tokens, or precise location.
	•	Fail closed: no offline OTP issuance, no cached approvals.

End of viworks_mobile_app.md