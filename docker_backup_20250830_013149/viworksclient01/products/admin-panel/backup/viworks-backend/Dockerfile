# Build stage
FROM rust:1.89.0-slim as builder

WORKDIR /app

# Install build dependencies including PostgreSQL and SSL
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy Cargo files first for better caching
COPY Cargo.toml Cargo.lock* ./

# Create a dummy main.rs to build dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs

# Build dependencies
RUN cargo build --release

# Remove dummy main.rs and copy real source
RUN rm src/main.rs
COPY src ./src
COPY migrations ./migrations

# Build the application
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies and debugging tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    strace \
    dumb-init \
    procps \
    netcat-openbsd \
    libpq5 \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables for debugging
ENV RUST_LOG=info RUST_BACKTRACE=1

# Create app directory
WORKDIR /app

# Copy the binary from builder stage
COPY --from=builder /app/target/release/viworks-admin-backend /app/app

# Copy migrations
COPY --from=builder /app/migrations /app/migrations

# Add entrypoint
COPY ops/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Create non-root user
RUN useradd -r -u 10001 appuser && chown -R appuser:appuser /app

# Switch to app user
USER appuser

# Expose port
EXPOSE 8081

# Use dumb-init for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/app/entrypoint.sh", "/app/app"]