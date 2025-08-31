#!/usr/bin/env sh
set -eu

log() { printf "%s | %s\n" "$(date -u +"%Y-%m-%d %H:%M:%S.%3N")" "$*"; }

log "🩺 Entrypoint starting"
log "UID:GID=$(id -u):$(id -g)  PWD=$(pwd)"
log "ARGS: ${*:-<none>}"

# Log environment variables
for v in HOST PORT RUST_LOG RUST_BACKTRACE DATABASE_URL REDIS_URL JWT_SECRET; do
  eval "value=\${$v:-}"
  [ -n "$value" ] && log "ENV $v=${value:0:20}..." || log "ENV $v=<not set>"
done

# Wait for database to be ready
log "🔍 Waiting for database to be ready..."
for i in {1..30}; do
    if pg_isready -h postgres -p 5432 -U admin >/dev/null 2>&1; then
        log "✅ Database is ready"
        break
    fi
    log "⏳ Waiting for database... ($i/30)"
    sleep 2
done

# Wait for Redis to be ready
log "🔍 Waiting for Redis to be ready..."
for i in {1..30}; do
    if redis-cli -h redis ping >/dev/null 2>&1; then
        log "✅ Redis is ready"
        break
    fi
    log "⏳ Waiting for Redis... ($i/30)"
    sleep 2
done

# Run database migrations if needed
log "🔧 Checking database migrations..."
if [ -d "/app/migrations" ]; then
    log "📋 Running database migrations..."
    # Note: Add migration command here if you have a migration tool
    # Example: /app/migrate up
fi

# Check if binary exists
if [ ! -f "/app/app" ]; then
    log "❌ Error: Application binary not found at /app/app"
    exit 1
fi

log "🚀 Launching app..."
set +e
"$@"
RC=$?
set -e
log "🛑 App exited with code $RC"

# Give the logger a moment to flush
sleep 0.5
exit "$RC"
