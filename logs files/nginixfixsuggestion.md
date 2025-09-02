NGINX Crash-Loop – Single-Host Docker (DigitalOcean) — Evidence → Root Cause → Safe Fix

Role: Act as a senior SRE working on a single Linux VM with Docker/Compose only (no Kubernetes, no Swarm).
Principles: Evidence before edits. Minimal, reversible diffs. Security first. Prefer service DNS over container IPs.

Deliverables
	1.	Triage Report (markdown) with exact evidence (logs/configs), ranked hypotheses, and the proved root cause.
	2.	Minimal Fix PR (Nginx config + docker-compose + CI/CD script) with rollback steps.
	3.	Verification Plan (copy/paste commands) + Acceptance Criteria.
	4.	RCA (5-Whys) + “Never Again” guardrails (checks in CI, healthchecks, lints).

⸻

Phase 0 — Stabilize the host (Docker only)
	•	Quarantine the nonessential agent so it stops flapping:

docker compose stop viworks-agent || docker stop viworks-agent || true


	•	Slow the restart churn (temporary in your branch, will be reverted in PR):
	•	In docker-compose.yml for nginx, ensure:

restart: unless-stopped
healthcheck:
  test: ["CMD", "curl", "-fsS", "http://localhost/_health"]
  interval: 20s
  timeout: 3s
  retries: 5
  start_period: 30s


	•	If _health doesn’t exist, we’ll add a trivial location that returns 200 during the fix.

Document what you changed and how to revert.

⸻

Phase 1 — Gather hard evidence (no guesses)

A. Runtime & host

docker info >/dev/null && echo "RUNTIME=Docker"
docker compose version || docker-compose version || true
uname -a; cat /etc/os-release

B. Container + network topology

docker ps --format '{{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
docker network ls
docker inspect nginx --format '{{json .NetworkSettings.Networks}}' | jq
# Show all containers' IPs per network:
docker inspect $(docker ps -q) --format '{{.Name}} {{range .NetworkSettings.Networks}}{{.NetworkID}} {{.IPAddress}}{{end}}'
# Port conflicts on host:
ss -ltnp | grep -E '(:80 |:443 )' || netstat -plnt

C. Compose + CI definitions

# Render fully to see actual networks & env after interpolation:
docker compose config
# Show docker-compose.yml and any env files it references:
sed -n '1,200p' docker-compose.yml; echo '---'; sed -n '200,400p' docker-compose.yml || true
[ -f .env ] && sed -n '1,200p' .env || true
# CI/CD deploy script(s):
git grep -n "docker network create" || true
git grep -n "docker compose up" || true

D. Nginx config & logs

docker logs --tail=500 nginx || true
docker exec -it nginx nginx -t || true
docker exec -it nginx sh -lc 'nginx -T' > /tmp/nginx_full.conf 2>&1 || true
head -n 200 /tmp/nginx_full.conf
# Search for common footguns:
grep -n "location" /tmp/nginx_full.conf | head -n 50 || true
grep -n "@backend_down" /tmp/nginx_full.conf || true

E. Upstream reachability & DNS inside Nginx container
For each upstream/service referenced in config (backend/api/web), test:

docker exec -it nginx sh -lc 'getent hosts <service> || nslookup <service> || true'
docker exec -it nginx sh -lc 'curl -sS -m 3 -I http://<service>:<port> || true'
docker exec -it nginx sh -lc 'curl -sS -m 3 -I https://<service>:<port> || true'

F. Certificates (if TLS terminates in Nginx)

docker exec -it nginx sh -lc 'ls -l /etc/nginx/ssl || true'
docker exec -it nginx sh -lc 'openssl x509 -in /etc/nginx/ssl/fullchain.pem -noout -text | head -n 20 || true'
docker exec -it nginx sh -lc 'openssl rsa -noout -modulus -in /etc/nginx/ssl/privkey.pem | openssl md5 || true'
docker exec -it nginx sh -lc 'openssl x509 -noout -modulus -in /etc/nginx/ssl/cert.pem | openssl md5 || true'

Output requirement: Create an “Evidence Pack” markdown with verbatim outputs for each step above.

⸻

Phase 2 — Diagnose (rank → prove)

Using the evidence, rank and prove (or rule out) these common causes:
	1.	Invalid Nginx syntax (e.g., location defined outside any server {} or stale reference like @backend_down with no matching location). Proof: nginx -t error lines and nginx -T context.
	2.	Network mis-wiring: Nginx not attached to required networks; networks defined as external: true but not created on the host; missing DNS access to upstreams. Proof: docker inspect nginx shows zero/one networks; docker network ls lacks viworks-public/viworks-internal.
	3.	Port conflict on 80/443.
	4.	TLS key/cert mismatch or wrong paths.
	5.	Over-strict healthcheck causing kill-loop (before start-up ready).

Select the single most likely root cause, with exact lines from logs/configs that prove it.

⸻

Phase 3 — Minimal, safe fix (produce a PR)

Make the smallest set of changes that solve the proved cause(s). Two focused areas expected here based on prior findings:

A) Nginx config fixes (syntax + fallback)
	•	Ensure all location directives are inside a server block.
	•	If @backend_down is referenced, either:
	•	Re-introduce it inside the correct server:

location @backend_down {
  return 502 "Upstream temporarily unavailable";
}


	•	Or remove all references to @backend_down and use explicit error_page/try_files fallback.

	•	Add a tiny health endpoint (if missing) to stabilize healthchecks:

location = /_health { return 200 "ok\n"; }


	•	After edits:

docker exec -it nginx nginx -t



B) Docker networking fixes (no Kubernetes)

Problem pattern you saw: docker-compose.yml marks networks as external: true, but they don’t exist on the droplet; result: Nginx gets no IP / no DNS.

Pick one minimal strategy and implement consistently:

Option 1 — Keep networks external (prefer if your CI already expects this):
	•	Ensure CI and/or a pre-deploy script creates them idempotently:

docker network create viworks-public || true
docker network create viworks-internal || true


	•	In docker-compose.yml, keep:

networks:
  viworks-public:
    external: true
    name: viworks-public
  viworks-internal:
    external: true
    name: viworks-internal


	•	Ensure nginx attaches to both:

services:
  nginx:
    networks:
      - viworks-public
      - viworks-internal



Option 2 — Manage networks inside Compose (simpler locally):
	•	Remove external: true and let Compose create them with stable names:

networks:
  viworks-public:
    name: viworks-public
    driver: bridge
  viworks-internal:
    name: viworks-internal
    driver: bridge


	•	Ensure nginx attaches to both (as above).
	•	Update CI to stop pre-creating networks.

Important: Upstreams in Nginx must use service DNS names (Compose provides DNS) instead of container IPs. If Nginx resolves dynamic upstreams at runtime, add:

resolver 127.0.0.11 valid=30s ipv6=off;

C) Disable the flapping agent (until needed)

In docker-compose.yml, either remove the service or gate it behind a profile:

services:
  viworks-agent:
    profiles: ["disabled"]

Deploy without that profile:

docker compose --profile "" up -d

D) PR contents & rollback
	•	Diffs:
	•	nginx.conf (move/repair location blocks, add /_health, remove/define @backend_down, optional resolver).
	•	docker-compose.yml (networks attached to nginx, fix external vs managed networks, profiles: ["disabled"] for agent).
	•	CI/CD deploy script (create external networks if Option 1).
	•	Commit message (example):

fix(nginx): move stray location into server; add /_health; attach nginx to public+internal networks; make networks idempotent in CI


	•	Rollback: git revert <commit>; restore previous compose; docker compose up -d.

⸻

Verification Plan (run after applying PR)

# 1) Compose renders without errors
docker compose config

# 2) Networks exist and nginx is attached to both
docker network ls
docker inspect nginx --format '{{json .NetworkSettings.Networks}}' | jq

# 3) Nginx syntax & health
docker exec -it nginx nginx -t
docker logs --tail=200 nginx
curl -I http://localhost/_health

# 4) Ports live (no conflicts)
ss -ltnp | grep -E '(:80 |:443 )' || netstat -plnt

# 5) End-to-end
curl -I http://localhost
# If TLS:
openssl s_client -connect <your-domain>:443 -servername <your-domain> -brief </dev/null

Acceptance Criteria
	•	nginx -t is clean (no errors/warnings).
	•	nginx container shows two networks: viworks-public and viworks-internal.
	•	Healthcheck at /_health returns 200.
	•	No restart loop; 0 restarts across ≥60 minutes (docker ps shows healthy).
	•	Requests to expected routes return 200/301/302 as designed.

⸻

RCA & “Never Again” guardrails (add to repo/CI)
	•	RCA (5-Whys) with exact lines proving the issue (stray location + missing networks).
	•	CI jobs:
	1.	docker compose config must succeed.
	2.	Lint Nginx: build minimal nginx image, mount config, run nginx -t.
	3.	Pre-deploy step (if using external networks):

docker network create viworks-public || true
docker network create viworks-internal || true


	4.	Smoke test after deploy: curl -fsS http://localhost/_health.

	•	Policy: no hard-coded container IPs in Nginx; use service DNS.
	•	Docs: short runbook for adding a new upstream (DNS name, health route, timeout/retry policy).

⸻

