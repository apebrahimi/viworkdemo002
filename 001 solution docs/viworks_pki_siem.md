viworks_pki_siem.md

Component: ViWorkS PKI & SIEM
Audience: Platform engineering, SecOps/Blue Team, Compliance, SRE
Status: Implementation-ready specification (production hardening)

⸻

1) Role & Scope

1.1 PKI (Public Key Infrastructure)

Purpose
	•	Issue and manage X.509 certificates and keys for:
	•	Gateway TLS front (stunnel/rustls on :443) — server certs.
	•	OpenVPN — server certs and optionally client/machine certs for mTLS/channel binding.
	•	Backend API — server certs (pinned by mobile/desktop).
	•	Desktop/Mobile device-bound certificates (optional desktop channel binding, mandatory mobile app signing/attestation keys where applicable).
	•	HPKE sealing: publish device public keys (generated on clients, anchored to PKI identity) used by Backend to seal bootstrap artifacts to a specific device.
	•	Operate revocation (CRL/OCSP) and provide distribution for internal consumers.
	•	Enforce lifecycle & rotation (short-lived intermediates, ≤180 days end-entity certs; automated renewals).
	•	Provide SPKI pinning material (primary + backup) for clients; maintain pin-roll telemetry and playbooks.
	•	Certificate Transparency (CT) monitoring for public-facing FQDNs (gateway/front door).

Non-goals
	•	PKI does not perform user authentication or authorization decisions (handled by Backend).
	•	PKI does not expose any public issuance endpoints.

1.2 SIEM (Security Information & Event Management)

Purpose
	•	Ingest normalized logs/metrics/events from Backend, Gateways, Admin Panel, Desktop/Mobile, PKI.
	•	Provide dashboards, detections, correlations, and WORM/immutable storage for audit/regulatory evidence.
	•	Offer dual-path log shipping to avoid single-point ingestion failure.

Non-goals
	•	SIEM does not control policy or access; it observes, detects, and reports.

⸻

2) Interfaces & Dependencies

2.1 PKI Interfaces
	•	Issuance API (internal only)
	•	mTLS over HTTPS (TLS 1.3) on :8444 (example), firewall-restricted to Backend subnets.
	•	Endpoints (examples):
	•	POST /v1/certs/issue/server → TLS/stunnel/OpenVPN server cert
	•	POST /v1/certs/issue/client → device/desktop client cert (optional)
	•	POST /v1/certs/rotate → trigger rotation
	•	GET /v1/ca/chain → CA chain bundle
	•	Revocation
	•	CRL distribution (internal HTTP/HTTPS or file share).
	•	OCSP responder (internal), optional stapling downstream.

2.2 SIEM Interfaces
	•	Ingestion
	•	syslog/TLS on 6514/tcp (primary path).
	•	HTTPS bulk ingestion on :7443 with signed payloads (secondary path).
	•	Dashboards access
	•	Admin SSO (OIDC/SAML) → SIEM UI (read-only/analyst/Auditor roles).

2.3 Dependencies
	•	HSM/KMS: host intermediate CA private keys; perform signing operations; protect HW-bound key material.
	•	Backend: mTLS client to PKI issuance API; publishes SIEM events.
	•	Gateways: consume certs/keys (stunnel/OpenVPN); ship logs to SIEM.
	•	Admin Panel: consumes SIEM dashboards by embedding or via links; no direct PKI calls.

⸻

3) Data & Config Management

3.1 CA Hierarchy
	•	Root CA (offline):
	•	Stored on encrypted removable media, multi-person control (M-of-N).
	•	Used only to sign Intermediate CAs.
	•	Location: secure safe; power-off; air-gapped.
	•	Intermediate CAs (online, HSM-backed):
	•	Separate profiles: int-tls, int-vpn, int-backend, int-device.
	•	Keys generated and non-exportable in HSM.
	•	Cert validity ≤ 2 years; CRLs issued daily; OCSP real-time.

3.2 Certificate Profiles (end-entity)

Profile	Use	Key Type	Validity	SANs	Critical Extensions
tls-gateway	stunnel/rustls front (:443)	ECDSA P-256 (preferred) or RSA-2048	≤ 180d	FQDN(s), IPs if needed	KU:DigitalSignature,KeyEncipherment; EKU:ServerAuth
vpn-server	OpenVPN server	ECDSA P-256 or RSA-2048	≤ 180d	CN=ovpn.<site>	KU:DigitalSignature,KeyEncipherment; EKU:ServerAuth
backend-api	Backend HTTPS	ECDSA P-256	≤ 180d	api.<domain>	EKU:ServerAuth
device-desktop	Optional desktop/machine channel binding	ECDSA P-256 + attestation data in SAN/OU	≤ 365d	Device ID	EKU:ClientAuth
device-mobile	Mobile app key attestation anchor (if used)	EC keypair in Secure Enclave/StrongBox	≤ 365d	Device ID	EKU:ClientAuth

Note: For performance, prefer ECDSA on server certs with TLS 1.3. Keep RSA for interop only if necessary.

3.3 HPKE Sealing Keys
	•	Desktop/Mobile devices generate an asymmetric keypair during enrollment (KEM: X25519 recommended).
	•	Device public key is uploaded to Backend and anchored via PKI (e.g., Backend issues a device certificate containing the HPKE public key as an extension or stores the key with a signed attestation record).
	•	Backend uses device public key to HPKE-seal the bootstrap bundle (SPA key, embedded TLS client profile, OpenVPN inline certs).
	•	Sealed artifacts are never stored at rest unencrypted; only decrypted in memory on the client.

3.4 Revocation (CRL/OCSP)
	•	CRLs published every 24h; on emergency revocation, update immediately.
	•	OCSP responder provides fresh status; Gateways/Backend validate OCSP where configured.
	•	Clients enforce revocation check for Backend and Gateway TLS certs (desktop pinning + revocation checking where platform allows).

3.5 SIEM Schema

Mandatory fields (normalized)

timestamp, env, site, tenant_id, user_id, device_id, session_id,
src_ip, src_port, dst_ip, dst_port, proto, asn, country,
component, action, result, severity,
fwknop_id, tls_ja3, ovpn_virtual_ip, policy_id,
trace_id, cmd, rc, bytes_in, bytes_out, duration_ms, error_code, error_msg

	•	PII handling: store user_id as pseudonymous opaque ID; map kept in Backend DB with access control.
	•	Retention: default 12–18 months, configurable per customer.
	•	WORM: immutable storage (object lock/legal hold) for audit evidence copies.

⸻

4) Security Controls

4.1 Key Management
	•	HSM-backed intermediates; keys never leave HSM.
	•	Split-knowledge backups (sealed HSM backups) stored in separate physical safes.
	•	Quarterly recovery drills proving we can restore intermediates.

4.2 SPKI Pinning
	•	For Gateway TLS and Backend API, publish two SPKI pins (primary+backup).
	•	Desktop/Mobile clients pin SPKI; pin-roll plan: deploy backup pin in clients before certificate rotation and measure usage telemetry; flip to new key then retire old after safe window.

4.3 Signed Log Chains & WORM
	•	All normalized SIEM events are batched per minute; compute Merkle root and sign with a dedicated Log Signing Key (HSM-protected).
	•	Store signed batch manifests in immutable storage (e.g., S3 Object Lock or filesystem WORM).
	•	Provide a verification tool to validate log integrity end-to-end.

4.4 Dual-Path Log Shipping
	•	Primary: rsyslog/syslog-ng over TLS to SIEM-A (6514/tcp).
	•	Secondary: Filebeat/Vector agent shipping HTTPS bulk to SIEM-B (7443/tcp).
	•	Local disk buffering for both; back-pressure alerts.

4.5 CT Monitoring
	•	Subscribe to CT logs for all public FQDNs (e.g., gateway front-door domains).
	•	Create alert if unexpected issuer/SPKI appears; link to pin-roll playbooks.

4.6 SIEM Dashboards & Alerts (minimum set)
	•	Dashboards
	•	Auth Funnel: login → OTP → bootstrap → tunnel.
	•	Handshake Metrics: SPA → TLS → OpenVPN latencies, success rates.
	•	Geo/ASN: heatmaps, ISP/carrier mix, anomaly overlay.
	•	Policy Changes: timeline; dual approvals tracked.
	•	Gateway Health: per-node CPU/mem, handshakes/min, session count.
	•	Alerts
	•	SPA opened without follow-up TLS within 60s.
	•	OTP failures across ≥3 distinct ASNs within 10m (credential stuffing).
	•	JA3 not in allowlist (unexpected TLS client).
	•	Policy relaxation (split-tunnel enable, geo allow-all) — critical.
	•	DoS indicators: handshake bursts; high SYN backlog; OpenVPN churn.
	•	Pin-roll mismatch: clients presenting old pin when window elapsed.

⸻

5) Implementation Notes

5.1 PKI Tooling

Options (choose one; both proven):
	•	Smallstep CA (recommended)
	•	HSM support via PKCS#11; ACME for automated issuance if needed (internal only).
	•	Policy templates for profiles.
	•	CFSSL
	•	JSON-based signing profiles; integrate with HSM for key ops.

Issuance workflow
	•	Backend authenticates to PKI with mTLS client cert + policy (scopes which profiles it may request).
	•	Backend calls POST /v1/certs/issue/server with subject, sans, profile, validity.
	•	PKI returns certificate + chain; key is never returned (server key generated on Gateway if keygen mode selected; or CSR mode with HSM signing).

5.2 Example Issuance Profiles (CFSSL style)

profiles.json

{
  "signing": {
    "default": {"usages": ["digital signature", "key encipherment"], "expiry": "2160h"},
    "profiles": {
      "tls-gateway": {
        "usages": ["digital signature", "key encipherment", "server auth"],
        "expiry": "4320h", "ca_constraint": {"is_ca": false}
      },
      "vpn-server": {
        "usages": ["digital signature", "key encipherment", "server auth"],
        "expiry": "4320h", "ca_constraint": {"is_ca": false}
      },
      "backend-api": {
        "usages": ["digital signature", "key encipherment", "server auth"],
        "expiry": "4320h", "ca_constraint": {"is_ca": false}
      },
      "device-client": {
        "usages": ["digital signature", "client auth"],
        "expiry": "8760h", "ca_constraint": {"is_ca": false}
      }
    }
  }
}

5.3 CRL/OCSP
	•	CRL generation (OpenSSL or CFSSL/step tooling) every 24h:
crlDistributionPoints = http://pki.int.local/crl/int-vpn.crl
	•	OCSP (internal):
authorityInfoAccess = OCSP;URI:http://pki.int.local/ocsp

Gateways and Backend validate OCSP status for peer server certs where applicable (config flags available in rustls/stunnel).

5.4 SIEM Stack
	•	Elastic/Splunk/Graylog are all viable—choose per org. The following assumes Elastic semantics; adapt names if Splunk/Graylog.
	•	Ingestion pipeline:
	•	rsyslog → Logstash (TLS) → Elasticsearch (primary).
	•	Vector → Ingest API → Elasticsearch-B (secondary).
	•	Processors: parse JSON, set @timestamp, enrich GeoIP/ASN, map JA3, map component and action.

5.5 Dashboard Examples (indices)
	•	viw-auth-*, viw-tunnel-*, viw-gw-*, viw-policy-*, viw-admin-*.
	•	Saved visualizations: Auth Success Rate, OTP Failures by ASN, SPA vs TLS correlation, OpenVPN Session Count, Policy Changes Timeline, Gateway Health.

5.6 Compliance Evidence
	•	Store signed monthly exports of critical dashboards and audit log samples in WORM.
	•	Maintain SoA references for ISO 27001 controls, change approvals for cert rotations, pin-roll records.

⸻

6) Failure & Recovery

Scenario	Behavior	Recovery
CA issuance outage	Renewals fail; existing certs continue until expiry.	Failover to secondary CA node; HSM pair failover; emergency extension path (short-term).
HSM failure	Signing stops; no new intermediates/end-entity.	Switch to backup HSM using split-knowledge restore; test every quarter.
OCSP/CRL unreachable	Revocation checks may soft-fail (config-dependent).	Make CRL available on multiple mirrors; deploy OCSP HA; alert on reachability.
SIEM down	Logs buffered locally; queues grow.	Increase buffer watermark; enable secondary path; alert SecOps; verify WORM copy.
Corrupted log chain	Integrity verification fails.	Pull immutable copies; reconstruct from raw sources; open incident & forensics.


⸻

7) Future Extensions
	•	OCSP stapling for Gateway TLS/OVPN if operationally feasible (improves revocation freshness).
	•	ML-assisted anomaly detection (tunnel anomalies, geo-fraud, device risk).
	•	Customer-facing compliance dashboards (evidence export packs).
	•	Keyless TLS for front-door (if adopting cloud WAF with HSM integration).

⸻

8) Configuration Reference (appendix)

8.1 CA Hierarchy (text diagram)

[Offline Root CA]  (air-gapped, M-of-N)
         |
         +--> [Intermediate CA: int-tls] ----> issues: tls-gateway, backend-api
         |
         +--> [Intermediate CA: int-vpn] ----> issues: vpn-server, vpn-client (optional)
         |
         +--> [Intermediate CA: int-device] --> issues: device-desktop, device-mobile

8.2 Example CRL Config (OpenSSL style)

openssl.cnf (fragment)

[ ca ]
default_ca = int_tls

[ int_tls ]
database = /var/lib/pki/int_tls/index.txt
default_crl_days = 1
crlnumber = /var/lib/pki/int_tls/crlnumber
default_md = sha256
private_key = /var/lib/pki/int_tls/private/int_tls.key
certificate = /var/lib/pki/int_tls/certs/int_tls.crt

[ crl_ext ]
authorityKeyIdentifier=keyid:always

CRL generation:

openssl ca -config /etc/pki/openssl.cnf -gencrl -out /var/www/html/crl/int-tls.crl -name int_tls

8.3 Example SIEM Field Mapping (JSON)

viworks_siem_mapping.json

{
  "mappings": {
    "timestamp": "@timestamp",
    "env": "labels.env",
    "site": "labels.site",
    "tenant_id": "labels.tenant",
    "user_id": "subject.user_id",
    "device_id": "subject.device_id",
    "session_id": "subject.session_id",
    "src_ip": "network.client.ip",
    "src_port": "network.client.port",
    "dst_ip": "network.destination.ip",
    "dst_port": "network.destination.port",
    "proto": "network.transport",
    "asn": "network.client.asn",
    "country": "geo.country_iso",
    "component": "app.component",
    "action": "event.action",
    "result": "event.outcome",
    "severity": "event.severity",
    "fwknop_id": "network.fwknop_id",
    "tls_ja3": "tls.client.ja3",
    "ovpn_virtual_ip": "viworks.ovpn.ip",
    "policy_id": "viworks.policy.id",
    "trace_id": "trace.id",
    "cmd": "viworks.cmd",
    "rc": "viworks.rc",
    "bytes_in": "network.bytes_in",
    "bytes_out": "network.bytes_out",
    "duration_ms": "event.duration_ms",
    "error_code": "error.code",
    "error_msg": "error.message"
  }
}


⸻

9) Test Plan

9.1 PKI
	•	Issue cert: Backend requests tls-gateway cert → delivered; stunnel reloads; TLS OK.
	•	Revoke cert: Revoke vpn-server test cert → CRL/OCSP show REVOKED; clients refuse.
	•	Pin-roll: Deploy backup SPKI, update clients with dual pins; rotate to new key; confirm clients accept only new pin after cutover.
	•	Rotation simulation: Advance clock (lab) to near-expiry; verify auto-renew and zero downtime reload.

9.2 SIEM
	•	OTP failure flood: Generate 10 failed verifications from 3 ASNs → correlation alert fires.
	•	SPA replay: Send invalid SPA bursts → DoS rule triggers; dashboard shows SPA without TLS.
	•	TLS downgrade attempt: Client tries TLS 1.2 → stunnel denies; alert on JA3 mismatch.
	•	Log integrity: Attempt to tamper batch file; Merkle verification fails; WORM copy clean.

9.3 WORM/Immutability
	•	Mark monthly evidence bucket Object Lock (compliance mode). Attempt delete/overwrite → denied.
	•	Verify signed manifests against random sample of raw logs.

⸻

10) Risk Register & Open Questions

10.1 Risks

Risk	Impact	Likelihood	Mitigation	Residual
Intermediate CA key compromise	Critical	Low	HSM, strict access, monitoring, rotation	Medium
Pin-roll error bricks clients	High	Low-Med	Dual pins, staged roll, telemetry before flip, rollback plan	Low-Med
CRL/OCSP outage	Med	Med	Multi-mirror CRL, HA OCSP, soft-fail policy with alert	Med
SIEM ingest overload	Med	Med	Dual-path shipping, back-pressure, sampling on non-critical streams	Low-Med
Log integrity not provable	High	Low	Signed batches + WORM; periodic verification jobs	Low
HPKE key misuse	Med	Low	Device key attestation, rotate on unbind, enforce short-lived sealed bundles	Low

10.2 Open Questions
	•	Final selection: Smallstep CA vs CFSSL + HSM driver matrix in prod.
	•	Operational decision on OCSP stapling at Gateway TLS.
	•	SIEM vendor finalization (Elastic vs Splunk vs Graylog) and dashboard pack standardization.

⸻

Why this is implementation-ready
	•	Defines concrete PKI hierarchy, issuance profiles, revocation, HSM usage, SPKI pin-roll and rotation playbooks.
	•	Specifies HPKE integration for sealed bootstrap, tying device keys to PKI identity.
	•	Provides SIEM schema, ingestion paths, dual-path resilience, WORM integrity model, and actionable detections.
	•	Includes configuration snippets (profiles, CRL, mappings) and test cases for PKI, SIEM, and log integrity.
	•	Aligns with the global ViWorkS architecture (SPA → TLS → OpenVPN, device binding, in-memory bootstrap, SSH ForceCommand control, SIEM detections).

End of viworks_pki_siem.md