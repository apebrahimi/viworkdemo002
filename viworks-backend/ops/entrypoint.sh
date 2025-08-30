#!/usr/bin/env sh
set -eu

echo "🩺 Entrypoint starting at $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "UID:GID=$(id -u):$(id -g)  PWD=$(pwd)"
echo "ARGS: ${*:-<none>}"

# Print env that often breaks startups (redact secrets)
echo "ENV SNAPSHOT:"
for v in HOST PORT RUST_LOG RUST_BACKTRACE DATABASE_URL REDIS_URL \
         SSL_CERT_FILE SSL_CERT_DIR RUSTLS_NATIVE_CACERTS \
         SQLX_OFFLINE; do
  if [ -n "${!v-}" ]; then echo "  $v=${!v}"; fi
done

# Sanity checks
if [ -n "${DATABASE_URL-}" ]; then
  echo "⏳ Checking Postgres TCP..."
  POSTGRES_HOST="$(echo "$DATABASE_URL" | sed -n 's#.*://[^@]*@\([^:/]*\).*#\1#p')"
  POSTGRES_PORT="$(echo "$DATABASE_URL" | sed -n 's#.*://[^@]*@[^:/]*:\([0-9]*\).*#\1#p')"
  POSTGRES_PORT="${POSTGRES_PORT:-5432}"
  timeout 3 nc -z "$POSTGRES_HOST" "$POSTGRES_PORT" && echo "✅ Postgres reachable" || echo "❌ Postgres NOT reachable"
fi

if [ -n "${REDIS_URL-}" ]; then
  echo "⏳ Checking Redis TCP..."
  # Fix Redis host extraction to handle auth format: redis://:password@host:port
  REDIS_HOST="$(echo "$REDIS_URL" | sed -n 's#.*://[^@]*@\([^:]*\).*#\1#p')"
  # If no @ found, extract from simple format: redis://host:port
  if [ -z "$REDIS_HOST" ]; then
    REDIS_HOST="$(echo "$REDIS_URL" | sed -n 's#.*://\([^:]*\).*#\1#p')"
  fi
  REDIS_HOST="${REDIS_HOST:-redis}"
  REDIS_PORT="$(echo "$REDIS_URL" | sed -n 's#.*:\([0-9]\{2,5\}\).*#\1#p')"
  REDIS_PORT="${REDIS_PORT:-6379}"
  timeout 3 nc -z "$REDIS_HOST" "$REDIS_PORT" && echo "✅ Redis reachable" || echo "❌ Redis NOT reachable"
fi

echo "🔐 CA certificates:"
[ -d /etc/ssl/certs ] && ls -l /etc/ssl/certs | wc -l || true

# Optional: tiny delay to let logs flush
sleep 0.2

echo "🚀 Launching app..."
exec "$@"
