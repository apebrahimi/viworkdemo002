#!/bin/bash

# ViWorkS Gateway Agent - Alpine Linux Build Script
# This script builds the agent specifically for Alpine Linux

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "Cargo.toml" ]; then
    print_error "Cargo.toml not found. Please run this script from the agent directory."
    exit 1
fi

print_status "Building ViWorkS Gateway Agent for Alpine Linux..."

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    print_error "Rust is not installed. Please install Rust first."
    print_status "Visit https://rustup.rs/ for installation instructions."
    exit 1
fi

# Check Rust version
RUST_VERSION=$(rustc --version | cut -d' ' -f2)
print_status "Rust version: $RUST_VERSION"

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Clean previous builds
print_status "Cleaning previous builds..."
cargo clean

# Check dependencies
print_status "Checking dependencies..."
cargo check

# Run tests
print_status "Running tests..."
cargo test

# Format code
print_status "Formatting code..."
cargo fmt

# Lint code
print_status "Linting code..."
cargo clippy -- -D warnings

# Build for Alpine Linux using Docker
print_status "Building for Alpine Linux using Docker..."

# Create Alpine build Dockerfile
cat > Dockerfile.alpine-build << 'EOF'
FROM rust:1.75-alpine

# Install build dependencies
RUN apk update && apk add --no-cache \
    build-base \
    pkgconfig \
    openssl-dev \
    musl-dev \
    ca-certificates \
    && rm -rf /var/cache/apk/*

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

# Create a minimal runtime image
FROM alpine:latest

# Install runtime dependencies
RUN apk update && apk add --no-cache \
    ca-certificates \
    libssl3 \
    && rm -rf /var/cache/apk/*

# Create viworks user
RUN addgroup -g 1000 viworks && \
    adduser -D -s /bin/bash -u 1000 -G viworks viworks

# Create necessary directories
RUN mkdir -p /etc/viworks /var/log/viworks /usr/local/bin

# Copy binary from builder
COPY --from=0 /app/target/release/viworks-gateway-agent /usr/local/bin/

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
    CMD wget --no-verbose --tries=1 --spider http://localhost:8443/api/v1/health || exit 1

# Run the agent
CMD ["/usr/local/bin/viworks-gateway-agent"]
EOF

# Build Docker image for Alpine
print_status "Building Alpine Docker image..."
docker build -f Dockerfile.alpine-build -t viworks-gateway-agent:alpine .

# Check image size
IMAGE_SIZE=$(docker images viworks-gateway-agent:alpine --format "table {{.Size}}" | tail -n 1)
print_success "Alpine Docker image built successfully!"
print_status "Image size: $IMAGE_SIZE"
print_status "Image name: viworks-gateway-agent:alpine"

# Extract binary from Docker image for standalone use
print_status "Extracting binary from Docker image..."
docker create --name temp-container viworks-gateway-agent:alpine
docker cp temp-container:/usr/local/bin/viworks-gateway-agent ./viworks-gateway-agent-alpine
docker rm temp-container

# Make binary executable
chmod +x ./viworks-gateway-agent-alpine

# Check binary size
BINARY_SIZE=$(du -h ./viworks-gateway-agent-alpine | cut -f1)
print_success "Alpine binary extracted successfully!"
print_status "Binary size: $BINARY_SIZE"
print_status "Binary location: ./viworks-gateway-agent-alpine"

# Create Alpine installation script
print_status "Creating Alpine installation script..."
cat > install-alpine.sh << 'EOF'
#!/bin/bash

# ViWorkS Gateway Agent Alpine Linux Installation Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

print_status "Installing ViWorkS Gateway Agent on Alpine Linux..."

# Install required packages
print_status "Installing required packages..."
apk update
apk add --no-cache ca-certificates libssl3

# Create directories
print_status "Creating directories..."
mkdir -p /usr/local/bin
mkdir -p /etc/viworks
mkdir -p /var/log/viworks

# Copy binary
print_status "Installing binary..."
cp viworks-gateway-agent-alpine /usr/local/bin/viworks-gateway-agent
chmod +x /usr/local/bin/viworks-gateway-agent

# Copy configuration
print_status "Installing configuration..."
cp agent.toml /etc/viworks/

# Create viworks user if it doesn't exist
if ! id "viworks" &>/dev/null; then
    print_status "Creating viworks user..."
    addgroup -g 1000 viworks
    adduser -D -s /bin/bash -u 1000 -G viworks viworks
fi

# Set permissions
print_status "Setting permissions..."
chown -R viworks:viworks /etc/viworks /var/log/viworks

# Create OpenRC service
print_status "Creating OpenRC service..."
cat > /etc/init.d/viworks-agent << 'SERVICE_EOF'
#!/sbin/openrc-run

name="ViWorkS Gateway Agent"
description="ViWorkS Gateway Agent Service"
command="/usr/local/bin/viworks-gateway-agent"
command_background=true
pidfile="/var/run/viworks-agent.pid"
user="viworks"
group="viworks"
depend() {
    need net
    after firewall
}
SERVICE_EOF

chmod +x /etc/init.d/viworks-agent

# Add to default runlevel
print_status "Adding service to default runlevel..."
rc-update add viworks-agent default

print_success "Installation completed!"
print_status "To start the service: rc-service viworks-agent start"
print_status "To check status: rc-service viworks-agent status"
print_status "To view logs: tail -f /var/log/viworks/agent.log"
EOF

chmod +x install-alpine.sh
print_success "Alpine installation script created: install-alpine.sh"

# Create Docker Compose file for Alpine
print_status "Creating Docker Compose file for Alpine..."
cat > docker-compose.alpine.yml << 'EOF'
version: '3.8'

services:
  viworks-agent:
    image: viworks-gateway-agent:alpine
    container_name: viworks-gateway-agent
    restart: unless-stopped
    ports:
      - "8443:8443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /etc/viworks:/etc/viworks:ro
      - /var/log/viworks:/var/log/viworks
    environment:
      - RUST_LOG=info
    networks:
      - viworks-network

networks:
  viworks-network:
    driver: bridge
EOF

print_success "Docker Compose file created: docker-compose.alpine.yml"

# Create test script for Alpine
print_status "Creating Alpine test script..."
cat > test-alpine.sh << 'EOF'
#!/bin/bash

# Test script for Alpine Linux deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Testing ViWorkS Gateway Agent on Alpine Linux..."

# Test Docker container
print_status "Testing Docker container..."
docker run -d --name test-viworks-agent \
    -p 8443:8443 \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    viworks-gateway-agent:alpine

# Wait for container to start
sleep 5

# Test health endpoint
print_status "Testing health endpoint..."
if curl -f http://localhost:8443/api/v1/health >/dev/null 2>&1; then
    print_success "Health endpoint is working!"
else
    print_error "Health endpoint failed!"
fi

# Test status endpoint
print_status "Testing status endpoint..."
if curl -f http://localhost:8443/api/v1/status >/dev/null 2>&1; then
    print_success "Status endpoint is working!"
else
    print_error "Status endpoint failed!"
fi

# Clean up
print_status "Cleaning up test container..."
docker stop test-viworks-agent
docker rm test-viworks-agent

print_success "Alpine Linux test completed successfully!"
EOF

chmod +x test-alpine.sh
print_success "Alpine test script created: test-alpine.sh"

print_success "Alpine Linux build process completed successfully!"
print_status "Next steps:"
print_status "1. Run './test-alpine.sh' to test the Alpine build"
print_status "2. Use 'docker-compose -f docker-compose.alpine.yml up -d' to run in Docker"
print_status "3. Copy 'viworks-gateway-agent-alpine' to your Alpine system and run './install-alpine.sh'"
print_status "4. Configure certificates in /etc/viworks/"
print_status "5. Start the service with 'rc-service viworks-agent start'"
