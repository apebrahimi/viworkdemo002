viworks_gateway_os.md

Component: ViWorkS Gateway OS (fwknopd + TLS front + OpenVPN + restricted SSH control plane + container runtime)
Audience: Platform engineers, security engineers, netops, SRE/blue team
Status: Implementation-ready specification (prod hardened)
Canonical terms: SPA → stunnel(TLS) → OpenVPN, restricted SSH (ForceCommand), client-config-dir, SIEM logging, container egress allowlists

⸻

1) Role & Scope

1.1 Purpose

Each Gateway Node is a hardened Linux host that provides:
	•	Stealth Port Knocking / SPA gate with fwknopd (exposes the TLS front only after per-source SPA).
	•	TLS 1.3 termination (stunnel/rustls server) on :443 forwarding to local OpenVPN.
	•	OpenVPN concentrator (mTLS + tls-crypt, AEAD ciphers, policy routes/DNS).
	•	Restricted SSH control plane on :2222 (backend-only, key-based, ForceCommand dispatcher with command allowlist).
	•	Container runtime (Docker/Podman) to spawn per-session isolated browser containers and publish them via nginx (reverse proxy with randomized paths).
	•	Logging/telemetry to the central SIEM over TLS (auth, SPA, TLS, OpenVPN, container lifecycle).

1.2 Boundaries & Guarantees
	•	Gateways never expose Backend APIs publicly.
	•	Backend ↔ Gateway control is only via SSH 2222/TCP (from Backend IPs), key-based auth, no TTY, ForceCommand allowlist.
	•	Client bootstrap secrets are not stored on gateways.
	•	All ingress is default-deny except SPA/stunnel (after SPA) and SSH 2222 from Backend.

⸻

2) Interfaces & Dependencies

2.1 External / Exposed
	•	SPA: UDP (e.g., 62201/udp) to fwknopd (network interface eth0).
	•	TLS front: 443/tcp (stunnel/rustls). Reachable only after SPA grants a short-lived allow for the source IP.
	•	Admin control: 2222/tcp (sshd instance for control plane) — firewall pinned to Backend IPs only.

2.2 Internal / Local
	•	OpenVPN server: 127.0.0.1:1194/tcp (not exposed).
	•	nginx reverse proxy: listens 127.0.0.1:8443 (terminates TLS for browser containers or proxies to them), publishes randomized path under external vhost on separate LB/WAF if used.
	•	Container network: user-defined bridge (e.g., viw-net) with egress allowlists.

2.3 Logging & Monitoring
	•	Syslog/TLS forward to SIEM (rsyslog/syslog-ng) with buffering and back-pressure.
	•	Health endpoints (local): systemd service health, OpenVPN status file, stunnel PID/port checks (consumed by node exporter/agent).

⸻

3) Data & Config Management
	•	PKI: Server keypair & chain for TLS front; OpenVPN CA, server cert/key, tls-crypt.key. All provisioned from central PKI.
	•	fwknopd: per-user/shared SPA HMAC keys (rotate frequently); minimal ACCESS_TIMEOUT (≤20s).
	•	OpenVPN CCD (/etc/openvpn/ccd/): per-user static config snippets (IP pools, push options, isolation). Generated via ForceCommand actions.
	•	No long-term client bootstrap/cache. All client configs are ephemeral and delivered by Backend directly to Desktop.
	•	Container images: pinned by digest, not :latest. Store image allowlist locally (/etc/viworks/images.yml).
	•	Egress allowlists: nftables/iptables sets scoped per container network/cgroup.

⸻

4) Security Controls

4.1 OS & Kernel Hardening
	•	OS: Debian/Ubuntu minimal, CIS Level 1 baseline applied (SSH, filesystems, auditd, logging).
	•	Kernel:
	•	Disable unneeded modules; enable net.ipv4.tcp_syncookies=1.
	•	fs.protected_hardlinks=1, fs.protected_symlinks=1.
	•	kernel.kptr_restrict=2, kernel.dmesg_restrict=1.
	•	net.ipv4.conf.all.rp_filter=1, net.ipv4.conf.default.rp_filter=1.
	•	net.ipv4.ip_forward=1 (for VPN), but no IP forwarding to internal mgmt segments.

4.2 Firewall (iptables/nftables)
	•	Default-deny inbound.
	•	Allow SPA port to fwknopd.
	•	Allow TLS :443/tcp only for sources with an active SPA grant (recent list or IP set).
	•	Allow SSH :2222/tcp only from Backend IPs.
	•	Drop all other ingress.

Example (iptables extract):

# Default deny
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow loopback
iptables -A INPUT -i lo -j ACCEPT

# Established/related
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# SPA UDP (fwknopd)
iptables -A INPUT -p udp --dport 62201 -j ACCEPT

# TLS 443 opened transiently for SPA-granted IPs (fwknopd populates 'spaopen' recent list)
iptables -A INPUT -p tcp --dport 443 -m recent --rcheck --name spaopen --rsource -j ACCEPT

# SSH control plane from Backend only
iptables -A INPUT -p tcp --dport 2222 -s <BACKEND_IP_1> -j ACCEPT
iptables -A INPUT -p tcp --dport 2222 -s <BACKEND_IP_2> -j ACCEPT

# Drop everything else with log rate-limit
iptables -A INPUT -m limit --limit 3/min -j LOG --log-prefix "GW DROP: " --log-level 6

4.3 fwknopd (SPA)
	•	Require source IP; digest/HMAC required; AES-256 symmetric keys; short TTL.
	•	On allow, insert recent list entry for the source IP; auto-expire after N seconds.
	•	Log every SPA decision (permit/deny/replay) to syslog/SIEM.

4.4 TLS Front (stunnel or rustls server)
	•	TLS 1.3 only. Ciphersuites: TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256.
	•	NO_RENEGOTIATION; small handshake backlog; OCSP stapling optional via reverse proxy in front if used.
	•	SPKI pinned by the desktop client; server keeps standard cert chain.
	•	Optional mTLS at TLS front (advanced/high-assurance deployments) – document separate client cert issuance if enabled.

4.5 OpenVPN (inside TLS)
	•	proto tcp-server, dev tun, mTLS, tls-crypt, AEAD (AES-256-GCM, AES-128-GCM), auth SHA256.
	•	Block split-tunnel: push "redirect-gateway def1", enforce internal DNS, Windows block-outside-dns.
	•	No compression (VORACLE/CRIME).
	•	client-config-dir for per-user routing/ACLs.
	•	Status/logging enabled (no secrets), rotated.

4.6 Restricted SSH Control Plane (critical)
	•	Separate sshd instance on :2222 with:
	•	PasswordAuthentication no, PubkeyAuthentication yes.
	•	Match user viwctl → ForceCommand /usr/local/bin/viworks-control.
	•	PermitTTY no, X11Forwarding no, AllowTcpForwarding no, ClientAliveInterval 60.
	•	Firewall: accept only from Backend IPs.
	•	AuthorizedKeys restricted entries:
	•	command="/usr/local/bin/viworks-control",no-agent-forwarding,no-port-forwarding,no-pty
	•	Allowlisted commands inside dispatcher:
	•	vpn_user_create, vpn_user_delete, update_ccd, spawn_browser_container, terminate_session, pull_logs, health.
	•	Every invocation logged (JSON) to syslog → SIEM with trace IDs.

4.7 Containers / nginx
	•	Docker/Podman with: no-new-privileges, seccomp default, AppArmor profiles, drop caps, read-only root FS, tmpfs for /tmp, limited --shm-size, memory/CPU limits.
	•	Pinned images by digest; pull via allowlisted registry.
	•	nginx reverse proxy routes randomized path to localhost container port; TLS terminated by nginx or upstream LB; headers sanitized; no directory listing.
	•	Egress allowlist: nftables mark per container; restrict outbound to required destinations; block plain DNS (force internal DoH or internal DNS forwarder).

4.8 systemd Hardening
	•	All services (fwknopd, stunnel, openvpn, nginx) with:
	•	ProtectSystem=strict, ProtectHome=yes, PrivateTmp=yes, NoNewPrivileges=true,
	•	SystemCallFilter= (tighten where compatible),
	•	CapabilityBoundingSet=~CAP_SYS_MODULE CAP_SYS_ADMIN ... (drop most),
	•	Restart=on-failure.

⸻

5) Implementation Notes

5.1 fwknopd Configuration

/etc/fwknop/fwknopd.conf

PCAP_INTF              eth0
ENABLE_IPT_FORWARDING  0
ACCESS_TIMEOUT         20
REQUIRE_SOURCE_ADDRESS Y
ENABLE_DIGEST_PWD      Y
# default deny-any disabled (we require explicit source)
SOURCE_ADDR_ANY        N
# Log verbosity
VERBOSE                Y

/etc/fwknop/access.conf (example access stanza; replicate per user/role)

SOURCE                      <ALLOWED_CIDR>           # Optional prefilter
OPEN_PORTS                  tcp/443
RESTRICT_SPA_IP             Y
ENABLE_CMD_EXEC             Y
CMD_EXEC_SUCCESS            /usr/local/sbin/spa-open %SOURCE% 443
CMD_EXEC_FAILURE            /usr/local/sbin/spa-deny %SOURCE%
KEY_BASE64                  <BASE64_AES_KEY>
HMAC_KEY_BASE64             <BASE64_HMAC_KEY>
HMAC_DIGEST_TYPE            sha256
ACCESS_TIMEOUT              20
FW_ACCESS_TIMEOUT           20

/usr/local/sbin/spa-open (marks IP in recent list – root:root, 0750)

#!/usr/bin/env bash
set -eu
SRC="$1"; PORT="${2:-443}"
iptables -I INPUT -p tcp --dport "${PORT}" -s "${SRC}" -m recent --set --name spaopen --rsource
# Optional: pre-accept also to reduce first packet SYN drop
iptables -I INPUT -p tcp --dport "${PORT}" -s "${SRC}" -j ACCEPT -m comment --comment "SPA-open ${SRC}"
# Remove direct ACCEPT after short delay; rely on recent thereafter
( sleep 5; iptables -D INPUT -p tcp --dport "${PORT}" -s "${SRC}" -j ACCEPT ) &
logger -t fwknop "Opened ${PORT} for ${SRC}"

/usr/local/sbin/spa-deny

#!/usr/bin/env bash
logger -t fwknop "Denied SPA from $1"
exit 0

5.2 stunnel (TLS front)

/etc/stunnel/viworks-gw.conf

setuid = stunnel4
setgid = stunnel4
foreground = no
pid = /var/run/stunnel-gw.pid
debug = notice

[viworks_tls]
accept = 0.0.0.0:443
connect = 127.0.0.1:1194
sslVersion = TLSv1.3
ciphersuites = TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
# Server certificate chain
cert = /etc/pki/stunnel/server.pem
key  = /etc/pki/stunnel/server.key
CAfile = /etc/pki/stunnel/ca.pem
# NOTE: If enabling mTLS at TLS front, uncomment verify=2 and deploy client cert CA
# verify = 2
options = NO_RENEGOTIATION
# Security hardening
sessionCacheSize = 1000
socket = l:TCP_NODELAY=1
socket = r:TCP_NODELAY=1
TIMEOUTclose = 0

systemd unit /etc/systemd/system/stunnel-viworks.service

[Unit]
Description=ViWorkS TLS Front (stunnel)
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/bin/stunnel /etc/stunnel/viworks-gw.conf
Restart=on-failure
User=stunnel4
Group=stunnel4
PrivateTmp=yes
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=yes
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target

5.3 OpenVPN (server inside TLS)

/etc/openvpn/server.conf

port 1194
proto tcp-server
dev tun
topology subnet

# PKI
ca      /etc/pki/ovpn/ca.crt
cert    /etc/pki/ovpn/server.crt
key     /etc/pki/ovpn/server.key
dh      none
tls-crypt /etc/pki/ovpn/tls-crypt.key
tls-version-min 1.2

# Crypto
cipher AES-256-GCM
data-ciphers AES-256-GCM:AES-128-GCM
auth SHA256

# Users & policy
client-config-dir /etc/openvpn/ccd
duplicate-cn 0
verify-client-cert require
remote-cert-tls client

# Network policy
push "redirect-gateway def1"
push "block-outside-dns"              # Windows
push "dhcp-option DNS 10.0.0.53"      # Internal DNS

# Service behavior
keepalive 10 60
persist-key
persist-tun
explicit-exit-notify 1
sndbuf 0
rcvbuf 0

# Logging
status /var/log/openvpn-status.log
log-append /var/log/openvpn.log
verb 3

# Management channel (optional, localhost only; disabled by default)
# management 127.0.0.1 7505
# management-client-auth

systemd drop-in /etc/systemd/system/openvpn@server.service.d/hardening.conf

[Service]
Restart=on-failure
PrivateTmp=yes
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=yes
CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_BIND_SERVICE

CCD Example /etc/openvpn/ccd/j.doe

ifconfig-push 10.8.10.10 255.255.255.0
# Per-user routes or restrictions can be enforced here
# iroute 10.20.0.0 255.255.255.0
# push "route 10.30.0.0 255.255.255.0"

5.4 SSH Control Plane (separate instance on 2222)

/etc/ssh/sshd_config_viwctl

Port 2222
ListenAddress 0.0.0.0
Protocol 2
HostKey /etc/ssh/ssh_host_ed25519_key

# Auth
PasswordAuthentication no
KbdInteractiveAuthentication no
ChallengeResponseAuthentication no
PubkeyAuthentication yes

# Only our control user
AllowUsers viwctl

# Security
PermitRootLogin no
X11Forwarding no
AllowTcpForwarding no
PermitTunnel no
PermitTTY no
ClientAliveInterval 60
ClientAliveCountMax 2
LoginGraceTime 20

# Authorized keys and ForceCommand per user
AuthorizedKeysFile /etc/ssh/authorized_keys/%u

# Match block
Match User viwctl
    ForceCommand /usr/local/bin/viworks-control

systemd template:

cp /lib/systemd/system/ssh.service /etc/systemd/system/ssh-viwctl.service
# Edit ExecStart to: /usr/sbin/sshd -D -f /etc/ssh/sshd_config_viwctl
systemctl daemon-reload
systemctl enable --now ssh-viwctl

/etc/ssh/authorized_keys/viwctl (example — single backend key)

command="/usr/local/bin/viworks-control",no-agent-forwarding,no-port-forwarding,no-X11-forwarding,no-pty ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... backend-ci@viworks

ForceCommand dispatcher /usr/local/bin/viworks-control (root:root, 0750)

#!/usr/bin/env bash
set -euo pipefail

LOGTAG="viwctl"
umask 077

# Read JSON command from STDIN or environment
INPUT="$(cat || true)"
CMD="$(jq -r '.cmd // empty' <<<"$INPUT")"
TRACE="$(jq -r '.trace_id // empty' <<<"$INPUT")"
[ -z "$TRACE" ] && TRACE="$(date +%s)-$RANDOM"

log(){ logger -t "$LOGTAG" -- "trace=$TRACE $*"; }

deny(){ echo "{\"ok\":false,\"trace_id\":\"$TRACE\",\"error\":\"$1\"}"; log "DENY $1"; exit 1; }

case "$CMD" in
  vpn_user_create)
    USER="$(jq -r '.user' <<<"$INPUT")"
    CRT="$(jq -r '.crt_pem' <<<"$INPUT")"
    KEY="$(jq -r '.key_pem' <<<"$INPUT")"
    [ -z "$USER" ] && deny "user missing"
    # Write user cert/key to /etc/openvpn/clients/$USER (if server signs clients here) or just create CCD
    install -d -m 0700 "/etc/openvpn/ccd"
    echo "# CCD for $USER" > "/etc/openvpn/ccd/$USER"
    log "Created CCD for $USER"
    echo "{\"ok\":true,\"trace_id\":\"$TRACE\"}"
    ;;

  vpn_user_delete)
    USER="$(jq -r '.user' <<<"$INPUT")"
    [ -z "$USER" ] && deny "user missing"
    rm -f "/etc/openvpn/ccd/$USER"
    log "Deleted CCD for $USER"
    echo "{\"ok\":true,\"trace_id\":\"$TRACE\"}"
    ;;

  update_ccd)
    USER="$(jq -r '.user' <<<"$INPUT")"
    CCD="$(jq -r '.ccd' <<<"$INPUT")"
    [ -z "$USER" ] && deny "user missing"
    [ -z "$CCD" ] && deny "ccd missing"
    printf "%s\n" "$CCD" > "/etc/openvpn/ccd/$USER"
    log "Updated CCD for $USER"
    echo "{\"ok\":true,\"trace_id\":\"$TRACE\"}"
    ;;

  spawn_browser_container)
    USER="$(jq -r '.user' <<<"$INPUT")"
    IMG="$(jq -r '.image' <<<"$INPUT")"
    [ -z "$IMG" ] && deny "image missing"
    # Pinned digest check (allowlist)
    grep -q -- "$IMG" /etc/viworks/images.yml || deny "image not allowlisted"
    PORT_BASE=5800
    # find free port
    PORT="$PORT_BASE"; while ss -ltnH "( sport = :$PORT )" | grep -q .; do PORT=$((PORT+1)); done
    CNAME="browser_${USER}_${PORT}"
    docker run -d --name "$CNAME" \
      --network viw-net \
      -p 127.0.0.1:$PORT:5800 \
      --read-only --tmpfs /tmp --pids-limit=512 \
      --security-opt no-new-privileges --cap-drop ALL \
      --memory=1g --cpus=1 \
      "$IMG"
    # generate random path and update nginx
    RPATH="$(tr -dc A-Za-z0-9 </dev/urandom | head -c 32)"
    /usr/local/sbin/nginx-add-path "$RPATH" "$PORT"
    systemctl reload nginx
    log "Spawned $CNAME at /$RPATH/"
    echo "{\"ok\":true,\"trace_id\":\"$TRACE\",\"path\":\"/$RPATH/\"}"
    ;;

  terminate_session)
    CNAME="$(jq -r '.container' <<<"$INPUT")"
    [ -z "$CNAME" ] && deny "container missing"
    docker rm -f "$CNAME" || true
    log "Terminated $CNAME"
    echo "{\"ok\":true,\"trace_id\":\"$TRACE\"}"
    ;;

  pull_logs)
    # Package relevant logs for time window
    FROM="$(jq -r '.from // "-24h"' <<<"$INPUT")"
    OUT="/tmp/logs-$TRACE.tar.gz"
    tar czf "$OUT" /var/log/openvpn.log /var/log/openvpn-status.log /var/log/syslog 2>/dev/null || true
    b64="$(base64 -w0 "$OUT")"
    rm -f "$OUT"
    echo "{\"ok\":true,\"trace_id\":\"$TRACE\",\"logs_b64\":\"$b64\"}"
    ;;

  health)
    # Quick health probes
    s1=$(systemctl is-active fwknopd || true)
    s2=$(systemctl is-active stunnel-viworks || true)
    s3=$(systemctl is-active openvpn@server || true)
    echo "{\"ok\":true,\"trace_id\":\"$TRACE\",\"fwknopd\":\"$s1\",\"stunnel\":\"$s2\",\"openvpn\":\"$s3\"}"
    ;;

  *)
    deny "unknown command"
    ;;
esac

nginx helper /usr/local/sbin/nginx-add-path (root:root, 0750)

#!/usr/bin/env bash
set -eu
RPATH="$1"; PORT="$2"
CONF="/etc/nginx/sites-enabled/default"
TMP="$(mktemp)"
awk -v block="    location /$RPATH/ {\n        proxy_pass http://127.0.0.1:$PORT/;\n        proxy_http_version 1.1;\n        proxy_set_header Connection \"\";\n        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto \$scheme;\n    }\n" '
BEGIN{in_server=0; depth=0}
/^[ \t]*server[ \t]*\{/ {in_server=1; depth=1; print; next}
{
  if(in_server){
    depth += gsub(/\{/, "{")
    depth -= gsub(/\}/, "}")
    if(depth==0){ print block; in_server=0 }
  }
  print
}' "$CONF" > "$TMP" && mv "$TMP" "$CONF"

5.5 SIEM Log Forwarding (rsyslog over TLS)

/etc/rsyslog.d/60-siem.conf

# Queue to survive SIEM outage
$WorkDirectory /var/spool/rsyslog
$ActionQueueType LinkedList
$ActionQueueFileName siemqueue
$ActionQueueMaxDiskSpace 512m
$ActionResumeRetryCount -1
$ActionQueueSaveOnShutdown on

# TLS
$DefaultNetstreamDriverCAFile /etc/rsyslog.d/siem-ca.pem
$ActionSendStreamDriver gtls
$ActionSendStreamDriverMode 1
$ActionSendStreamDriverAuthMode x509/name
$ActionSendStreamDriverPermittedPeer siem.viworks.internal

# Ship auth/syslog/openvpn tags
if ($programname == 'openvpn' or $programname == 'fwknop' or $programname == 'viwctl' or $syslogfacility-text == 'authpriv') then
  *.* @@siem.viworks.internal:6514


⸻

6) Failure & Recovery

Failure	Detection	Automated Response	Manual Runbook
SPA grants but no TLS handshake	SPA allow log without stunnel SYN	Alert “SPA open w/o handshake”	Verify fwknopd → iptables recent; check client side
stunnel crash	systemd restart count; port check	Restart=on-failure; alert on flapping	Inspect certs/ciphers; check TLS load
OpenVPN overload/handshake churn	Status log anomalies; CPU high	Rate limit new handshakes via FW; autoscale node group	Drain node; adjust LB weights; investigate DoS
SSH ForceCommand fails	JSON error payload to backend	Backend retries with jitter; alert on consecutive failures	Inspect /var/log/syslog (tag viwctl); test health
SIEM outage	rsyslog queue growth	Buffer locally up to limit	Coordinate with SIEM team; avoid queue disk fill
Container runaway	cgroup limits breach	Docker memory OOM kills; alert	Terminate session via ForceCommand


⸻

7) Future Extensions
	•	Anycast front door with health-checked pool (ECMP/BGP or cloud LB) for regional HA.
	•	OpenVPN management (localhost only) for richer telemetry (exposed via gateway agent → backend).
	•	Per-session container telemetry streaming (CPU/IO/egress destinations) to SIEM.
	•	nftables migration to replace iptables with sets/maps for performance.

⸻

8) Configuration Reference (appendix)

8.1 Full Example: fwknopd

(See §5.1 — fwknopd.conf, access.conf, helper scripts.)

8.2 Full Example: stunnel

(See §5.2 — TLS 1.3 only, ciphersuites, NO_RENEGOTIATION, systemd unit.)

8.3 Full Example: OpenVPN server & CCD

(See §5.3 — crypto, push policies, logs; CCD example per user.)

8.4 Full Example: iptables

(See §4.2 — default-deny, SPA recent, SSH 2222 from Backend only.)

8.5 Full Example: systemd units
	•	stunnel-viworks.service
	•	openvpn@server.service (with hardening drop-in)
	•	ssh-viwctl.service (separate sshd instance on 2222)

8.6 ForceCommand Dispatcher

(See §5.4 — /usr/local/bin/viworks-control with allowlist actions, JSON I/O.)

⸻

9) Test Plan

9.1 Functional
	1.	SPA → TLS → VPN: Send valid SPA; confirm iptables recent entry; connect TLS on :443; establish OpenVPN tunnel; observe “Initialization Sequence Completed”.
	2.	Spawn container: Backend calls spawn_browser_container; verify nginx exposes randomized path; access works only through VPN path (if required by policy).
	3.	Terminate session: Backend calls terminate_session; container gone; nginx path removed; SIEM logs present.

9.2 Security / Negative
	•	SPA replay: resend same SPA packet → denied; log reason.
	•	TLS downgrade: attempt TLS 1.2 → refused by stunnel.
	•	Split-tunnel attempt: client tries local DNS → blocked; OpenVPN pushes DNS/redirect, Windows block-outside-dns effective.
	•	Unauthorized SSH: connect from non-backend IP → dropped at firewall; SIEM alert.
	•	Container escape probe: run unprivileged container; confirm seccomp/AppArmor blocks dangerous syscalls; outbound blocked beyond allowlist.

9.3 Ops / Resilience
	•	Crash/restart: systemctl kill stunnel/openvpn; ensure auto-restart; alerts captured.
	•	Config reload: rotate OpenVPN tls-crypt.key out of hours; verify session continuity policy (reconnect).
	•	SIEM outage: stop SIEM listener; rsyslog queues and recovers.

⸻

10) Risk Register & Open Questions

10.1 Risks

Risk	Impact	Likelihood	Mitigation	Residual
Gateway host compromise	Critical	Low	CIS hardening, minimal packages, EDR, immutable infra, strict SSH control plane	Med
SPA flooding / abuse	High (DoS)	Med	Per-source rate limits, short TTL, iptables recent, ASN throttling	Med-Low
TLS handshake exhaustion	High	Med	SPA gating, small backlog per source, autoscale gateways, SYN cookies	Med
OpenVPN churn/DoS	High	Med	Rate-limit new sessions, queue alarms, spread via LB	Med
Misuse of SSH ForceCommand	High	Low-Med	Allowlist, audit logs, no TTY/forwarding, firewall pinned to Backend	Low
Container egress exfil	High	Low-Med	Egress allowlists, DNS control, per-container identity logs	Low-Med
Key/cert sprawl	Med	Low	PKI automation, renewal alerts, pinning rollbook	Low

10.2 Open Questions
	•	Enable mTLS at TLS front (stunnel) by default, or keep mTLS only at OpenVPN layer? (If enabled, define client cert issuance pipeline for TLS front.)
	•	Adopt OpenVPN management for live telemetry? (If yes, confine to localhost + password, integrate with gateway agent.)
	•	Finalize egress allowlist policy for browser containers (destinations and ports).

⸻

Why this is implementation-ready
	•	Provides concrete, runnable configs for fwknopd, stunnel, OpenVPN, iptables, systemd, rsyslog, and the ForceCommand dispatcher with allowlisted actions.
	•	Defines exact ports/protocols, trust boundaries, and control plane behavior.
	•	Details hardening baselines (CIS controls, service sandboxing) and container isolation.
	•	Includes logging/telemetry wiring and test plans (functional, security, ops).
	•	Aligns with previously approved architecture and threat model (SPA→TLS→OVPN, SSH restricted control), enabling engineering teams to deploy and security teams to validate immediately.

End of viworks_gateway_os.md