# Build stage
FROM rust:1.82-slim as builder

WORKDIR /app

# Copy files
COPY Cargo.toml ./
COPY src ./src

# Build the application
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install minimal runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the binary
COPY --from=builder /app/target/release/viworks-admin-backend /app/viworks-admin-backend

# Make it executable
RUN chmod +x /app/viworks-admin-backend

# Expose port
EXPOSE 8081

# Run the binary
CMD ["/app/viworks-admin-backend"]