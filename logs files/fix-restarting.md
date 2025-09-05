Role: Act as my SRE pair-programmer.
Goal: Eliminate “container restarts with exit code 0 and no logs,” and make services observable and stable by default. Keep changes additive, minimal, and behind env flags when possible. Create a PR named sre/no-restart-guard with small commits per service.

0) Discover & checklist
	1.	Scan repo for Dockerfiles, entrypoints, compose files, and service configs (Nginx, Rust backend, Rust agent, Postgres, Redis).
	2.	Produce a short report in the PR description with:
	•	Each service’s CMD/ENTRYPOINT and whether it daemonizes.
	•	Where logs currently go (stdout/stderr vs files).
	•	Presence/absence of health endpoints and Docker HEALTHCHECK.
	•	Whether PID 1 is the server or a shell script.

1) PID 1 & foreground mode (all services)
	•	Ensure the main server stays in foreground:
	•	Nginx: run with daemon off;.
	•	Rust/Actix apps: HttpServer::run().await must be awaited in main() (no early return).
	•	Add tini (or Docker --init) so PID 1 gets proper signal handling:
	•	Dockerfile: install tini and set ENTRYPOINT ["/sbin/tini","--"].
	•	If using Compose, set init: true too (ok to redundantly use both).

2) Logging to stdout/stderr (no file-only logs)
	•	Nginx: error_log /dev/stderr info; and access_log /dev/stdout main;.
	•	Rust apps: initialize tracing/env_logger early; honor RUST_LOG; log a clear startup line with bind address/port.
	•	Ensure no logger writes only to files; if you keep files, also mirror to stdout/stderr.

3) Health endpoints & Docker HEALTHCHECK
	•	Add a minimal GET /_healthz to backend and agent (200 OK, no DB calls).
	•	Nginx: add location = /_healthz { return 200; }.
	•	Dockerfile:

HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:_HEALTH_PORT/_healthz || exit 1

Replace _HEALTH_PORT per service (e.g., 8081 backend).

	•	Compose: mirror the same healthcheck so docker ps shows (healthy).

4) Entrypoints must exec the server
	•	For any shell entrypoint, enforce:

#!/usr/bin/env sh
set -euo pipefail
echo "[entrypoint] starting: $*"
exec "$@"


	•	Do not run one-shot commands (like nginx -t) and exit; if you validate config, keep it and then exec the server.

5) Nginx run configuration (prevent clean exit)
	•	Dockerfile CMD ["nginx","-g","daemon off;"].
	•	If there’s a pid directive pointing to a non-writable path, fix it or remove it.
	•	Include proxy_read_timeout, WebSocket upgrade headers later (don’t break current routes).

6) Backend & Agent startup
	•	Bind to 0.0.0.0 and await the server future; log:
info!("viworks-backend listening on 0.0.0.0:8081");
info!("viworks-agent listening on 0.0.0.0:<port>");
	•	Add graceful shutdown logs on SIGTERM/SIGINT so stop events are visible.

7) Compose: stable logging & restart policy
	•	Ensure logging driver is json-file (default) with sensible rotation:

logging:
  driver: json-file
  options:
    max-size: "10m"
    max-file: "5"


	•	Set restart policy to unless-stopped (or your preferred).
	•	Add init: true.

8) Debug mode for first run (feature-flagged)
	•	Add env flags (no functional change unless set):
	•	DEBUG_STARTUP=1 → print effective config at startup (ports, TLS mode, routes).
	•	DEBUG_BLOCK=0 (default) → don’t block; if 1, after start print process tree and tail last 100 lines of own stdout—dev only.
	•	Document these in the PR.

9) Quick verification scripts (make targets)

Add a /scripts/dev/verify.sh that:

set -e
docker compose up -d --build
sleep 5
docker ps
curl -sf http://localhost:8081/_healthz || (echo "backend health failed" && exit 1)
curl -sf http://localhost/_healthz || (echo "nginx health failed" && exit 1)
docker logs backend --tail=100
docker logs nginx --tail=100

Add make verify to run this script.

10) Acceptance criteria (automate checks)
	•	Starting containers no longer exit with code 0 immediately.
	•	docker logs <svc> shows a clear startup line.
	•	docker ps reports services as healthy.
	•	Hitting /_healthz on Nginx and backend returns 200.
	•	Stopping the stack shows graceful shutdown logs (no silent exits).

11) Do not change business logic
	•	No refactors to handlers or DB code.
	•	No route renames besides adding /_healthz.
	•	Keep current ports/domains; don’t touch TLS termination yet.

12) Output
	•	Open a PR sre/no-restart-guard with:
	•	The discovery report (Section 0).
	•	Diffs for Dockerfiles, compose, Nginx, backend/agent minimal changes.
	•	A brief README ops/no-restart-guard.md explaining what changed and how to verify.

Proceed. If something is ambiguous, prefer the smallest additive change that achieves foreground mode + stdout logging + healthcheck.