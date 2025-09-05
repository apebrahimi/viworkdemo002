# Build stage
FROM rust:1.89.0-alpine as builder

WORKDIR /app

# Install build dependencies including PostgreSQL and SSL
RUN apk add --no-cache \
    pkgconfig \
    openssl-dev \
    postgresql-dev \
    musl-dev \
    gcc \
    curl

# Add MUSL target for Alpine compatibility
RUN rustup target add x86_64-unknown-linux-musl

# Copy Cargo files first for better caching
COPY Cargo.toml Cargo.lock* ./

# Create a dummy main.rs to build dependencies (since Cargo.toml references main_demo.rs)
RUN mkdir src && echo "fn main() {}" > src/main.rs && echo "fn main() {}" > src/main_demo.rs

# Build dependencies (warm cache)
RUN cargo build --release

# Remove dummy files and copy real source
RUN rm -rf src/*
COPY src ./src
COPY migrations ./migrations

# Security check: Run cargo audit before building
RUN cargo audit || echo "⚠️  Security vulnerabilities detected - review required"

# Security check: Verify no unwanted dependencies
RUN cargo tree | grep -i "mysql\|rsa" && echo "⚠️  WARNING: Unwanted dependencies found" || echo "✅ Dependencies verified"

# Build the application
RUN cargo build --release

# Runtime stage (Alpine)
FROM alpine:3.22

# Install runtime dependencies
RUN apk add --no-cache \
    ca-certificates \
    dumb-init \
    busybox-extras \
    netcat-openbsd \
    wget \
    curl \
    tzdata \
    bash \
    postgresql-client \
    redis

WORKDIR /app

# Copy binary, migrations & entrypoint
COPY --from=builder /app/target/release/viworks-backend /app/app
COPY --from=builder /app/migrations /app/migrations
COPY ops/entrypoint.sh /app/entrypoint.sh

# Create non-root user
RUN adduser -D -u 10001 appuser && \
    chown -R appuser:appuser /app && \
    chmod +x /app/entrypoint.sh

# Set environment variables
ENV RUST_LOG=info \
    RUST_BACKTRACE=1 \
    SSL_CERT_DIR=/etc/ssl/certs \
    HOST=0.0.0.0 \
    PORT=8081 \
    TZ=UTC

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8081/_healthz || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/app/entrypoint.sh", "/app/app"]
