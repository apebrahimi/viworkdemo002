#!/usr/bin/env bash
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
    # Use psql to run migrations
    for migration_file in /app/migrations/*.sql; do
        if [ -f "$migration_file" ]; then
            log "📄 Running migration: $(basename "$migration_file")"
            PGPASSWORD="${POSTGRES_PASSWORD:-viworks_password_2024}" psql -h postgres -p 5432 -U admin -d viworks -f "$migration_file" || {
                log "⚠️  Migration $(basename "$migration_file") failed, but continuing..."
            }
        fi
    done
    log "✅ Database migrations completed"
fi

# Check if binary exists
if [ ! -f "/app/app" ]; then
    log "❌ Error: Application binary not found at /app/app"
    exit 1
fi

log "🚀 Launching app..."
# Execute the application in the foreground (replace current process)
exec "$@"
