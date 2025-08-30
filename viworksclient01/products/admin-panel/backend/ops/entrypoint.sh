#!/usr/bin/env sh
set -eu

log() { printf "%s | %s\n" "$(date -u +"%Y-%m-%d %H:%M:%S.%3N")" "$*"; }

log "🩺 Entrypoint starting"
log "UID:GID=$(id -u):$(id -g)  PWD=$(pwd)"
log "ARGS: ${*:-<none>}"

for v in HOST PORT RUST_LOG RUST_BACKTRACE DATABASE_URL REDIS_URL; do
  eval "value=\${$v:-}"
  [ -n "$value" ] && log "ENV $v=$value"
done

# Optional TCP checks (we already know they work)
# ...

log "🚀 Launching app..."
set +e
"$@"
RC=$?
set -e
log "🛑 App exited with code $RC"
# Give the logger a moment to flush
sleep 0.5
exit "$RC"
