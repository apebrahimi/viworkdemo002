# Build stage
FROM rust:1.89.0-alpine as builder

WORKDIR /app

# Install build dependencies including PostgreSQL and SSL
RUN apk add --no-cache \
    pkgconfig \
    openssl-dev \
    postgresql-dev \
    musl-dev \
    gcc

# Add MUSL target for Alpine compatibility
RUN rustup target add x86_64-unknown-linux-musl

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

# Build the application (force rebuild by cleaning and rebuilding)
RUN cargo clean && cargo build --release

# Runtime stage (Alpine)
FROM alpine:3.22
RUN apk add --no-cache ca-certificates dumb-init busybox-extras netcat-openbsd wget curl tzdata
WORKDIR /app

# Copy binary & entrypoint (adjust binary name if different)
COPY --from=builder /app/target/release/viworks-admin-backend /app/app
COPY --from=builder /app/migrations /app/migrations
COPY ops/entrypoint.sh /app/entrypoint.sh
RUN adduser -D -u 10001 appuser && chown -R appuser:appuser /app && chmod +x /app/entrypoint.sh

ENV RUST_LOG=info RUST_BACKTRACE=1 SSL_CERT_DIR=/etc/ssl/certs HOST=0.0.0.0 PORT=8081
USER appuser
EXPOSE 8081
ENTRYPOINT ["/usr/bin/dumb-init","--"]
CMD ["/app/entrypoint.sh","/app/app"]
