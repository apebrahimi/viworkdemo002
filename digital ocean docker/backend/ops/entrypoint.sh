#!/usr/bin/env bash
set -eu

log() { printf "%s | %s\n" "$(date -u +"%Y-%m-%d %H:%M:%S.%3N")" "$*"; }

log "🩺 Enhanced Entrypoint starting"
log "UID:GID=$(id -u):$(id -g)  PWD=$(pwd)"
log "ARGS: ${*:-<none>}"

# Log environment variables
for v in HOST PORT RUST_LOG RUST_BACKTRACE DATABASE_URL REDIS_URL JWT_SECRET; do
  eval "value=\${$v:-}"
  [ -n "$value" ] && log "ENV $v=${value:0:20}..." || log "ENV $v=<not set>"
done

# Function to check if a service is ready
check_service_ready() {
    local service_name=$1
    local check_command=$2
    local max_attempts=${3:-30}
    local delay=${4:-2}
    
    log "🔍 Waiting for $service_name to be ready..."
    for i in $(seq 1 $max_attempts); do
        if eval "$check_command" >/dev/null 2>&1; then
            log "✅ $service_name is ready"
            return 0
        fi
        log "⏳ Waiting for $service_name... ($i/$max_attempts)"
        sleep $delay
    done
    log "❌ $service_name failed to become ready after $max_attempts attempts"
    return 1
}

# Wait for database to be ready with better error handling
if ! check_service_ready "database" "pg_isready -h postgres -p 5432 -U admin" 45 3; then
    log "❌ Critical: Database is not accessible. Exiting."
    exit 1
fi

# Wait for Redis to be ready with better error handling
if ! check_service_ready "Redis" "redis-cli -h redis ping" 45 3; then
    log "❌ Critical: Redis is not accessible. Exiting."
    exit 1
fi

# Test database connectivity
log "🔍 Testing database connectivity..."
if ! PGPASSWORD="${POSTGRES_PASSWORD:-viworks_password_2024}" psql -h postgres -p 5432 -U admin -d viworks -c "SELECT 1;" >/dev/null 2>&1; then
    log "❌ Critical: Cannot execute queries on database. Exiting."
    exit 1
fi
log "✅ Database connectivity test passed"

# Run database migrations if needed with better error handling
log "🔧 Checking database migrations..."
if [ -d "/app/migrations" ]; then
    log "📋 Running database migrations..."
    local migration_errors=0
    
    for migration_file in /app/migrations/*.sql; do
        if [ -f "$migration_file" ]; then
            log "📄 Running migration: $(basename "$migration_file")"
            if PGPASSWORD="${POSTGRES_PASSWORD:-viworks_password_2024}" psql -h postgres -p 5432 -U admin -d viworks -f "$migration_file" 2>&1; then
                log "✅ Migration $(basename "$migration_file") completed successfully"
            else
                log "⚠️  Migration $(basename "$migration_file") failed, but continuing..."
                ((migration_errors++))
            fi
        fi
    done
    
    if [ $migration_errors -gt 0 ]; then
        log "⚠️  $migration_errors migration(s) had errors, but continuing..."
    else
        log "✅ All database migrations completed successfully"
    fi
else
    log "ℹ️  No migrations directory found, skipping migrations"
fi

# Check if binary exists
if [ ! -f "/app/app" ]; then
    log "❌ Critical: Application binary not found at /app/app"
    log "🔍 Checking /app directory contents:"
    ls -la /app/ || true
    exit 1
fi

# Verify binary is executable
if [ ! -x "/app/app" ]; then
    log "❌ Critical: Application binary is not executable"
    chmod +x /app/app || {
        log "❌ Failed to make binary executable"
        exit 1
    }
    log "✅ Made binary executable"
fi

log "🚀 Launching application..."
log "📊 Binary size: $(du -h /app/app | cut -f1)"
log "📊 Binary permissions: $(ls -la /app/app)"

# Execute the application in the foreground (replace current process)
exec "$@"

