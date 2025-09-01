#!/usr/bin/env bash
set -eu

log() { printf "%s | %s\n" "$(date -u +"%Y-%m-%d %H:%M:%S.%3N")" "$*"; }

log "🩺 Simple Entrypoint starting (no migrations)"
log "UID:GID=$(id -u):$(id -g)  PWD=$(pwd)"
log "ARGS: ${*:-<none>}"

# Log environment variables
for v in HOST PORT RUST_LOG RUST_BACKTRACE; do
  eval "value=\${$v:-}"
  [ -n "$value" ] && log "ENV $v=${value:0:20}..." || log "ENV $v=<not set>"
done

# Check if binary exists
if [ ! -f "/app/app" ]; then
    log "❌ Error: Application binary not found at /app/app"
    exit 1
fi

log "🚀 Launching simple app (no database dependencies)..."
# Execute the application in the foreground (replace current process)
exec "$@"
