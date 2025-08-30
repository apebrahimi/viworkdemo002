Perfect — here’s your drop-in Cursor prompt with Slint swapped to eframe/egui (pure-Rust GUI, no WebView/JS), while preserving all the original security, flow, and hardening. Paste this into Cursor and let it scaffold/adjust the project accordingly.

⸻

ViWorkS Client — Technical Plan & Windows MVP

(Rust + eframe/egui, Pure-Rust GUI, Maximum Security Hardening)

0) What we’re building (high level)

A Windows-first desktop client with a pure-Rust eframe/egui UI (no WebView/JS). Security is absolute.
	•	Login first (mandatory): user must authenticate (username/password; future-proof for 2FA/TOTP) before any other UI.
	•	Bootstrap options: after login, user can
A) enter Server / Key / HMAC and select a local .ovpn, or
B) Fetch from server to securely retrieve them from the Cert Server.
	•	Connect sequence: fwknop SPA → probe TCP 8443 → rewrite/apply OpenVPN config → establish VPN.
	•	Preflight checks: no active tunnel, timezone = Asia/Tehran, network reachable — fail-closed with precise error.
	•	Tray behavior: on success, minimize to tray; allow Disconnect / Show / Logout / Quit.

We write once in Rust and ship Windows first. Linux/macOS builds are future work (see §13).

⸻

1) Hard requirements from the flow
	•	Signed installer → run client.
	•	Preflight (all must pass before SPA):
	1.	No active VPN (detect TAP/Wintun/route).
	2.	Timezone must be Asia/Tehran (Windows “Iran Standard Time”).
	3.	Online network.
	•	Inputs: Server, Key, HMAC, .ovpn (or Fetch).
	•	SPA cmd:
fwknop.exe -A tcp/8443 -s -D <REMOTE_IP> --key-rijndael <KEY> --key-hmac <HMAC> --use-hmac
	•	Port check: verify 8443 opens post-SPA; else fail with guidance.
	•	OpenVPN: load rewritten .ovpn, connect; success → tray; failure → clear error.

⸻

2) Language & framework

Rust + eframe/egui (pure Rust GUI).
Core crates: eframe, egui, tokio (rt/process/fs/time/net/macros/signal), tray-icon, rfd, windows (Win32/DPAPI/WinTrust), regex, anyhow, thiserror, serde/serde_json, reqwest (rustls only), rustls, sha2, ring, x509-parser, zeroize, dirs, tracing/tracing-subscriber.

Security posture: no HTML/JS; no browser IPC boundary; all privileged code in Rust.

⸻

2.1) Authentication & Bootstrap (Cert Server)

Flow
	1.	Login → POST /v1/auth/login → access_token (+ refresh_token).
	•	Store tokens only if “Remember me” → DPAPI with additional entropy.
	•	On failure: precise reason (invalid creds / TLS pin mismatch / unreachable).
	2.	Connect view (only if logged in):
	•	Fetch → GET /v1/client/bootstrap (Bearer) → { server_host, server_port, fwknop_key, fwknop_hmac, ovpn_base, ovpn_auth }.
	•	Manual → user fields + .ovpn.
	3.	Preflight → SPA → Probe 8443 → OpenVPN.

Security
	•	TLS with SPKI pinning (primary + backup pin). Fail-closed, no TOFU.
	•	Keys/HMAC never logged; persisted only on explicit opt-in via DPAPI (+ entropy).
	•	Prefer short-lived SPA keys bound to token; server rotates frequently.

Logout
	•	Clear tokens (DPAPI + memory), zeroize secrets, drop session, go to Login.
	•	Auto-logout on inactivity (default 15 min).

⸻

3) Overall architecture (Windows, pure Rust)

viworks-client/
 ├─ apps/desktop_egui          # eframe/egui UI shell (Windows-first)
 │   └─ src/
 │       ├─ main.rs            # process mitigations init (very early)
 │       ├─ app.rs             # egui App: Login, Connect, Status, timers
 │       ├─ tray.rs            # tray-icon wiring
 │       └─ ui_helpers.rs      # masked inputs, log view, banners
 ├─ crates/core                # FSM, config, validation, logging
 ├─ crates/auth_api            # reqwest+rustls, SPKI pinning, DPAPI store
 ├─ crates/spa_fwknop          # fwknop runner, output parsing, timeout
 ├─ crates/vpn_openvpn         # .ovpn rewrite, openvpn process mgmt
 ├─ crates/platform            # Win: DPAPI, timezone, net/tunnel, temp files (ACL)
 ├─ assets/                    # base .ovpn templates, icons
 └─ security/                  # cargo-deny/audit configs; WDAC sample

Principles
	•	Privileged actions live in platform, vpn_openvpn, spa_fwknop, auth_api.
	•	egui UI calls typed methods in core via an internal glue in app.rs.
	•	No shell expansion of input. All validation in core.

⸻

4) Connection lifecycle (FSM)

Idle → Preflight → Authenticated → Bootstrap(Manual|Fetch) → SpaSent → PortOpen → VpnConnecting → Connected → Error → {Disconnect|Logout}
	•	Idle: only Login.
	•	Authenticated: Connect unlocked.
	•	Preflight: net::has_connectivity(), vpn::tunnel_active()==false, time::is_tehran()==true; else Error.
	•	Bootstrap:
	•	Fetch: validate payload (host/port; nonempty keys).
	•	Manual: validate fields, .ovpn size (<1 MB), ASCII-only, no NULs.
	•	SPA: run fwknop (sanitized argv), capture exit/out/err; timeout.
	•	Probe: backoff to <host>:8443 (100ms→6s, max 15s).
	•	VPN: rewrite remote; enforce hardening (see §7.4/§7.5); start OpenVPN; detect “Initialization Sequence Completed”.
	•	Connected: minimize to tray; enable Disconnect.
	•	Disconnect: CTRL_BREAK/SIGTERM; wait; cleanup; delete temp; reset UI.
	•	Logout: always available; nukes secrets; to Idle.

Errors: typed + user-friendly; full (non-secret) detail to logs (see §12).

⸻

5) Windows MVP scope
	•	Login (+ Remember).
	•	Connect: fields, .ovpn picker, Fetch, Connect, status log.
	•	Preflight + precise failures.
	•	SPA via fwknop.exe.
	•	Safe .ovpn rewrite.
	•	OpenVPN + log tail; Connected/Failed UI.
	•	Tray: Show / Disconnect / Logout / Quit.
	•	Logout wipes secrets and returns to Login.

Assumptions
	•	OpenVPN client present or bundled; drivers need admin if installed.
	•	Cert Server offers /v1/auth/login + /v1/client/bootstrap over TLS; we pin SPKI (primary + backup).

⸻

6) Security design (absolute)

6.1 Secrets
	•	Never log username/password/Key/HMAC/tokens; add a redaction layer in logging.
	•	In RAM, wrap with zeroize/secrecy.
	•	Persist tokens only on opt-in via DPAPI with additional entropy (e.g., machine GUID + app salt).

6.2 Process execution (fwknop/OpenVPN)
	•	Absolute paths only, resolved at install time (e.g., C:\Program Files\ViWorkS\bin).
	•	Runtime signature check via WinVerifyTrust against expected publisher CN; then verify SHA-256 matches a pinned hash. Refuse unknown binaries.
	•	No shell. Pass exact argv.
	•	Sanitize environment: Command::env_clear(); set minimal allowlist (SystemRoot, etc.).
	•	Working dir: fixed, non-writable to user (e.g., app bin dir).
	•	Time-limit processes; kill & clean on hang.

6.3 Windows process mitigations (defense-in-depth)
	•	Link flags: ASLR/DEP/High Entropy/CET/CFG (MSVC).
	•	Early init:
	•	SetDefaultDllDirectories(LOAD_LIBRARY_SEARCH_SYSTEM32) + SetDllDirectoryW(L"") → block CWD & PATH DLL search.
	•	SetProcessMitigationPolicy → DisallowDynamicCode = 1, ExtensionPointDisable = 1, DisableNonSystemFonts = 1.
	•	Keep handle inheritance disabled.

6.4 Network & TLS
	•	reqwest + rustls only (default-features = false).
	•	SPKI pinning with primary + backup; fail-closed; no redirects to new hosts.
	•	Short connect/read timeouts; no proxy by default (unless explicitly configured).
	•	Use OsRng for any randomness.

6.5 OpenVPN hardening
	•	Prefer Wintun; add block-outside-dns on Windows.
	•	Strong suite: data-ciphers AES-256-GCM:AES-128-GCM, auth SHA256; keep CBC/SHA1 only if legacy.
	•	Use tls-crypt (prefer over tls-auth).
	•	If using mgmt: bind 127.0.0.1, random high port, password required, and limit commands.
	•	Optionally pull-filter ignore unwanted directives from server.

6.6 Filesystem & temp files
	•	App data under %LOCALAPPDATA%\ViWorkS\… with restrictive ACLs.
	•	Temp .ovpn / optional auth-user-pass written with create_new(true) + tight ACLs; delete on success/error.
	•	Canonicalize paths; deny UNC and user-writable executable locations; avoid following reparse points/symlinks.

6.7 UI & UX safety
	•	egui only; no remote content.
	•	Secret fields masked; clipboard disabled; no paste echo.
	•	Auto-logout on inactivity (default 15 min), configurable.
	•	Login gate enforced; Disconnect always available once connected.

6.8 Build & supply-chain
	•	Code-sign binaries (prefer EV).
	•	CI: cargo audit, cargo-deny, optional cargo vet; lockfiles committed.
	•	Pin versions; minimize deps. Optional SBOM via cargo auditable.

6.9 Logging & privacy
	•	tracing with key redaction; rotate logs in per-user app data; no PII.
	•	Don’t emit secrets in errors; tech details only in logs.

6.10 Enterprise policies (optional)
	•	Provide WDAC/AppLocker templates to allow only your signed client, openvpn.exe, fwknop.exe.
	•	Validate ASR rule compatibility.

⸻

7) Implementation details (Windows)

7.1 Preflight
	•	Active tunnel: detect TAP/Wintun via GetAdaptersAddresses(); check routes (e.g., 10.8.0.0/24).
	•	Timezone: GetTimeZoneInformation (“Iran Standard Time”); block mismatch.
	•	Connectivity: quick DNS + TCP probe with short timeouts.

7.2 SPA (fwknop)
	•	Cmd: fwknop.exe -A tcp/8443 -s -D <ip> --key-rijndael <key> --key-hmac <hmac> --use-hmac.
	•	Spawn hidden, sanitized argv, env_clear, fixed CWD, timeout, capture out/err.

7.3 Port probe
	•	Exponential backoff until success or 15s max.

7.4 .ovpn rewrite (safe)
	•	Load into memory; size limit (<1 MB), ASCII only, no NUL.
	•	Replace first ^\s*remote\s+\S+(\s+\d+)?\s*$ with remote {HOST} {PORT}; if missing, insert after proto.
	•	Ensure/insert hardening lines if missing:
	•	block-outside-dns (Win)
	•	data-ciphers AES-256-GCM:AES-128-GCM
	•	auth SHA256
	•	tls-crypt (if available)
	•	Write to private temp path with create_new(true); never overwrite original.

7.5 OpenVPN launch
	•	openvpn.exe --config <temp.ovpn> --verb 3 (+ --auth-user-pass if needed; write short-lived file with tight ACLs).
	•	Optional mgmt: --management 127.0.0.1 <random_port> --management-query-passwords and set a password (not logged).
	•	Parse stdout for “Initialization Sequence Completed”.
	•	Disconnect: CTRL_BREAK/SIGTERM; timeout; kill; remove routes/tun if orphaned.

7.6 eframe/egui UI behavior
	•	Login panel: username/password/remember; error banner; spinner; blocks until login success.
	•	Connect panel: fields, picker, Fetch, Connect, status log & step badges (Preflight → SPA → Port → VPN), Disconnect when connected.
	•	App shell: handles view switching; top menu/commands: Logout, About; integrates tray (see §9).
	•	All controls disabled during operations.

⸻

8) eframe/egui UI structure
	•	Single EguiApp struct with fields:
is_logged_in: bool, busy: bool, can_disconnect: bool, status_log: Vec<String>, form fields, timers.
	•	Methods: login(), logout(), fetch(), connect_manual(), disconnect(), append_log().
	•	Render two panels based on is_logged_in.
	•	Use channels/async tasks (tokio) for long ops; update UI on completion.
	•	Optional: SetWindowDisplayAffinity(WDA_EXCLUDEFROMCAPTURE) for anti-screen-capture.

⸻

9) System tray (pure Rust)

Use tray-icon in apps/desktop_egui/src/tray.rs:
	•	Menu: Show, Disconnect (only when connected), Logout, Quit.
	•	Left-click: show/focus window.
	•	Menu events → app channels → core.

⸻

10) Packaging & distribution (Windows)
	•	Installer: cargo-wix (MSI) or NSIS; code sign.
	•	Install binaries under C:\Program Files\ViWorkS\bin\.
	•	If bundling OpenVPN: include drivers (admin); else detect installed path.
	•	Auto-update disabled by default; release via new signed MSIs.

⸻

11) Cursor tasks (step-by-step)
	1.	Scaffold eframe/egui shell (apps/desktop_egui):
	•	Cargo.toml add:
	•	eframe, egui, tokio (features: rt-multi-thread,process,time,fs,net,macros,signal),
	•	tray-icon, rfd, tracing, tracing-subscriber, dirs, anyhow, thiserror,
	•	reqwest = { version = "0.11", default-features = false, features = ["rustls-tls","json","http2"] },
	•	rustls = "0.22", x509-parser = "0.16", sha2 = "0.10", ring = "0.17", zeroize = "1",
	•	windows = { version = "0.58", features = ["Win32_Security_WinTrust","Win32_Security_Cryptography","Win32_System_LibraryLoader","Win32_System_Threading","Win32_System_Diagnostics_Debug"] },
	•	regex.
	•	src/main.rs: early process hardening (see Appendix A), start tokio runtime, run eframe::run_native with EguiApp.
	•	src/app.rs: implement EguiApp with Login/Connect panels, status log, step badges, auto-logout timer.
	•	src/tray.rs: tray setup + menu event handling.
	•	src/ui_helpers.rs: masked inputs, log viewer, banners/toasts.
	2.	Core FSM (crates/core): states/events per §4; validation for host/port/keys/ovpn (size/ASCII/no-NUL); typed errors per §12.
	3.	Auth API (crates/auth_api):
	•	reqwest client w/ rustls, no redirects, strict timeouts.
	•	SPKI pinning (primary + backup) custom verifier; fail-closed.
	•	DPAPI token store with additional entropy; zeroize on drop.
	4.	Platform (Windows) (crates/platform):
	•	DPAPI helpers; timezone check; connectivity; tunnel detection; secure temp file create with create_new(true) + ACLs; canonicalize and deny UNC.
	•	Binary verification helpers (WinVerifyTrust + SHA-256).
	5.	Binary verification helper (crates/platform or crates/wintrust):
	•	verify_publisher_signature(exe_path, expected_publisher_cn) -> Result<()> (WinVerifyTrust).
	•	sha256_file(exe_path) -> [u8; 32]; compare to pinned hash.
	•	Enforce both checks before running fwknop.exe / openvpn.exe.
	6.	SPA crate (crates/spa_fwknop):
	•	Resolve absolute path; verify signature + hash; spawn with env_clear(), fixed CWD, sanitized argv, timeout.
	7.	OpenVPN crate (crates/vpn_openvpn):
	•	.ovpn loader + safe remote rewrite; insert hardening directives if missing (see §7.4).
	•	Resolve absolute path; verify signature + hash; start with env cleared; optional mgmt on 127.0.0.1:<random> with password.
	•	Detect “Initialization Sequence Completed”; implement clean Disconnect.
	8.	UI wiring (apps/desktop_egui/src/app.rs):
	•	Drive step badges + log; disable controls during operations; implement auto-logout timer.
	9.	Tray (tray.rs): menu + events; reflect connected state.
	10.	Logging: tracing config with redaction middleware for keys/HMAC/tokens; rotating file appender in per-user app data.
	11.	CI & security (/security): add cargo-audit + cargo-deny configs; pin crate versions; optionally cargo auditable.
	12.	Build: produce a signed Windows MSI (WiX); verify manual QA in §17.

Crate features to keep surface minimal
	•	reqwest = { default-features = false, features = ["rustls-tls","json"] }
	•	tokio = { version = "1", features = ["rt-multi-thread","process","time","fs","net","macros","signal"] }
	•	Avoid native-tls, gzip, etc., unless required.

⸻

12) Error model & UX

Typed errors + exact messages:
	•	Login: InvalidCredentials, ServerUnreachable, TlsPinMismatch, Timeout.
	•	Preflight: TunnelActive, WrongTimezone, Offline.
	•	Fetch: Unauthorized, BootstrapMissing, ServerError.
	•	SPA: FwknopNotFound, SignatureInvalid, HashMismatch, ArgsRejected, Timeout, Denied.
	•	PortProbe: TimedOut.
	•	OpenVPN: BinaryNotFound, SignatureInvalid, HashMismatch, ConfigInvalid, AuthFailed, HandshakeFailed, UnexpectedExit.

UX rules
	•	Show progress steps; disable controls during operations.
	•	Clear error banners (no secrets).
	•	Logout always available; Disconnect visible only when connected.

⸻

13) Roadmap: Linux & macOS
	•	Key store: libsecret (Linux), Keychain (macOS).
	•	SPA: POSIX fwknop.
	•	OpenVPN: distro pkg (Linux) / notarized app (macOS).
	•	Packaging: .deb/AppImage; notarized .app.
	•	Still no WebView.

⸻

14) Risks & mitigations
	•	Drivers/admin (OpenVPN): detect installed first; admin prompts only when needed.
	•	SPA timing: backoff + explicit timeouts.
	•	Config drift: multiple templates in /assets.
	•	Key exposure: default no persistence; DPAPI opt-in; zeroize on logout.

⸻

15) What we need
	•	Decide bundling vs preinstalled OpenVPN; expected publisher CN + pinned SHA-256 for both openvpn.exe and fwknop.exe.
	•	Base .ovpn templates for /assets.
	•	Cert Server hostname + primary/backup SPKI pins; final JSON for /v1/auth/login and /v1/client/bootstrap.

⸻

16) Cert Server API (proposed)

Login — POST /v1/auth/login
{"username":"...","password":"...","device_id":"<UUID>","client_version":"x.y.z"}
→ {"access_token":"...","refresh_token":"...","expires_in":900}

Bootstrap — GET /v1/client/bootstrap (Bearer)
→ {"server_host":"viworks.local","server_port":8443,"fwknop_key":"...","fwknop_hmac":"...","ovpn_base":"<file>","ovpn_auth":{"type":"user-pass"|"static","username":"...","password":"..."}}

Security: HTTPS with SPKI pinning (primary + backup), strict timeouts, no redirects.
Tokens persisted only on opt-in via DPAPI (+ entropy). SPA keys ephemeral.

⸻

17) Acceptance criteria
	•	Login gate enforced; Connect view hidden until authenticated.
	•	Preflight blocks with precise reasons; Retry works.
	•	Fetch fills fields; Manual works.
	•	Connect executes SPA → Probe → OpenVPN; success minimizes to tray.
	•	Disconnect cleanly stops VPN, removes temp, resets UI.
	•	Logout wipes secrets (DPAPI + memory), returns to Login.
	•	Binary signature + hash verification enforced before running fwknop.exe/openvpn.exe.
	•	SPKI pinning enforced (primary + backup).
	•	No secrets in logs; DPAPI used for opt-in storage; files have tight perms.
	•	Build outputs a signed MSI; app launches, no external browser.

⸻

Appendix A — Early Windows hardening (put at top of main)

// apps/desktop_egui/src/main.rs

use windows::Win32::System::LibraryLoader::{
    SetDefaultDllDirectories, SetDllDirectoryW, LOAD_LIBRARY_SEARCH_SYSTEM32
};
use windows::Win32::System::Threading::SetProcessMitigationPolicy;
use windows::Win32::System::Diagnostics::Debug::{
    PROCESS_MITIGATION_DYNAMIC_CODE_POLICY,
    PROCESS_MITIGATION_EXTENSION_POINT_DISABLE_POLICY,
    PROCESS_MITIGATION_FONT_DISABLE_POLICY
};

unsafe fn harden_process() {
    // 1) DLL search: system32 only; remove CWD
    SetDefaultDllDirectories(LOAD_LIBRARY_SEARCH_SYSTEM32);
    let _ = SetDllDirectoryW(windows::w!(""));

    // 2) Disallow dynamic code / extension points / non-system fonts
    let dyn_code = PROCESS_MITIGATION_DYNAMIC_CODE_POLICY { Flags: 0, ProhibitDynamicCode: 1, ..Default::default() };
    let _ = SetProcessMitigationPolicy(0x00000002,
        &dyn_code as *const _ as _, std::mem::size_of::<PROCESS_MITIGATION_DYNAMIC_CODE_POLICY>() as _);

    let ext = PROCESS_MITIGATION_EXTENSION_POINT_DISABLE_POLICY { Flags: 0, DisableExtensionPoints: 1, ..Default::default() };
    let _ = SetProcessMitigationPolicy(0x00000008,
        &ext as *const _ as _, std::mem::size_of::<PROCESS_MITIGATION_EXTENSION_POINT_DISABLE_POLICY>() as _);

    let fonts = PROCESS_MITIGATION_FONT_DISABLE_POLICY { Flags: 0, DisableNonSystemFonts: 1, AuditNonSystemFontLoading: 0 };
    let _ = SetProcessMitigationPolicy(0x00000010,
        &fonts as *const _ as _, std::mem::size_of::<PROCESS_MITIGATION_FONT_DISABLE_POLICY>() as _);
}

fn main() {
    unsafe { harden_process(); }
    // … start eframe/egui app
}

Appendix B — SPKI pinning (reqwest + rustls)

// crates/auth_api/src/pinning.rs
use rustls::{client::ServerCertVerifier, pki_types::CertificateDer, ServerName};
use sha2::{Sha256, Digest};
use std::sync::Arc;

pub struct SpkiPins { pub primary_b64: String, pub backup_b64: String }
pub struct PinnedVerifier { pins: SpkiPins, inner: Arc<rustls::client::WebPkiVerifier> }

impl PinnedVerifier {
    pub fn new(pins: SpkiPins) -> Self {
        let inner = rustls::client::WebPkiVerifier::builder(Arc::new(rustls::RootCertStore::empty())).build();
        Self { pins, inner }
    }
    fn spki_sha256_b64(ee: &CertificateDer<'_>) -> String {
        let (_, cert) = x509_parser::parse_x509_certificate(ee).unwrap();
        let spki = cert.tbs_certificate.subject_pki.subject_public_key.data;
        base64::encode(Sha256::digest(spki))
    }
}

impl ServerCertVerifier for PinnedVerifier {
    fn verify_server_cert(
        &self,
        end_entity: &CertificateDer<'_>,
        intermediates: &[CertificateDer<'_>],
        server_name: &ServerName,
        ocsp: &[u8],
        now: std::time::SystemTime,
    ) -> Result<rustls::client::ServerCertVerified, rustls::Error> {
        self.inner.verify_server_cert(end_entity, intermediates, server_name, ocsp, now)?;
        let spki_b64 = Self::spki_sha256_b64(end_entity);
        if spki_b64 == self.pins.primary_b64 || spki_b64 == self.pins.backup_b64 {
            Ok(rustls::client::ServerCertVerified::assertion())
        } else {
            Err(rustls::Error::General("SPKI pin mismatch".into()))
        }
    }
}

Appendix C — WinVerifyTrust + hash check before launching binaries

// crates/platform/src/wintrust.rs
use windows::core::PCWSTR;
use windows::Win32::Security::WinTrust::*;
use std::{ffi::OsStr, os::windows::ffi::OsStrExt, path::Path};

fn to_wstr(s: &str) -> Vec<u16> { OsStr::new(s).encode_wide().chain(std::iter::once(0)).collect() }

pub fn verify_publisher_signature(exe_path: &str) -> anyhow::Result<()> {
    let file = WINTRUST_FILE_INFO {
        cbStruct: std::mem::size_of::<WINTRUST_FILE_INFO>() as u32,
        pcwszFilePath: PCWSTR(to_wstr(exe_path).as_ptr()),
        ..Default::default()
    };
    let data = WINTRUST_DATA {
        cbStruct: std::mem::size_of::<WINTRUST_DATA>() as u32,
        dwUIChoice: WTD_UI_NONE,
        fdwRevocationChecks: WTD_REVOKE_NONE,
        dwUnionChoice: WTD_CHOICE_FILE,
        Anonymous: WINTRUST_DATA_0 { pFile: &file },
        dwStateAction: 0,
        dwProvFlags: WTD_SAFER_FLAG | WTD_USE_DEFAULT_OSVER_CHECK,
        ..Default::default()
    };
    let policy = WINTRUST_ACTION_GENERIC_VERIFY_V2;
    let status = unsafe { WinVerifyTrust(HWND(0), &policy, &data as *const _ as _) };
    if status.is_ok() { Ok(()) } else { anyhow::bail!("Signature verification failed") }
}

pub fn sha256_file(path: &Path) -> anyhow::Result<[u8;32]> {
    use sha2::{Sha256, Digest};
    let mut hasher = Sha256::new();
    let mut f = std::fs::File::open(path)?;
    std::io::copy(&mut f, &mut hasher)?;
    let out = hasher.finalize();
    let mut arr = [0u8;32]; arr.copy_from_slice(&out); Ok(arr)
}

Appendix D — Child process spawn (absolute path, env cleared)

use std::process::Command;
pub fn spawn_hardened(abs_exe: &str, args: &[&str], cwd: &str) -> std::io::Result<std::process::Child> {
    assert!(abs_exe.starts_with(r"C:\Program Files\")); // policy
    Command::new(abs_exe)
        .args(args)
        .env_clear()
        .current_dir(cwd)
        .spawn()
}

Appendix E — Safe .ovpn rewrite & insertion of hardening lines

use regex::Regex;
pub fn harden_and_rewrite(cfg: &str, host: &str, port: u16) -> String {
    let mut out = cfg.to_string();
    let re_remote = Regex::new(r"(?m)^\s*remote\s+\S+(\s+\d+)?\s*$").unwrap();
    let repl = format!("remote {} {}", host, port);
    out = if re_remote.is_match(&out) { re_remote.replace(&out, repl.as_str()).into_owned() }
          else {
              let re_proto = Regex::new(r"(?m)^\s*proto\s+\S+\s*$").unwrap();
              if let Some(m) = re_proto.find(&out) { let (a,b)=out.split_at(m.end()); format!("{}\n{}\n{}", a, repl, b) }
              else { format!("{}\n{}", repl, out) }
          };
    for line in ["block-outside-dns",
                 "data-ciphers AES-256-GCM:AES-128-GCM",
                 "auth SHA256"] {
        if !out.lines().any(|l| l.trim().eq_ignore_ascii_case(line)) {
            out.push('\n'); out.push_str(line);
        }
    }
    out
}

End of prompt.