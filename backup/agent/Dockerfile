# Multi-stage build for minimal production image
FROM rust:1.75-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Cargo files
COPY Cargo.toml Cargo.lock ./

# Create dummy main.rs to build dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs

# Build dependencies
RUN cargo build --release

# Remove dummy main.rs and copy actual source
RUN rm src/main.rs
COPY src/ ./src/

# Build the application
RUN cargo build --release

# Production stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Create viworks user
RUN groupadd -r viworks && useradd -r -g viworks viworks

# Create necessary directories
RUN mkdir -p /etc/viworks /var/log/viworks /usr/local/bin

# Copy binary from builder
COPY --from=builder /app/target/release/viworks-gateway-agent /usr/local/bin/

# Copy configuration
COPY agent.toml /etc/viworks/

# Set permissions
RUN chown -R viworks:viworks /etc/viworks /var/log/viworks
RUN chmod +x /usr/local/bin/viworks-gateway-agent

# Switch to viworks user
USER viworks

# Expose port
EXPOSE 8443

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8443/api/v1/health || exit 1

# Run the agent
CMD ["/usr/local/bin/viworks-gateway-agent"]
