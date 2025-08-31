#!/bin/bash

# ViWorkS Gateway Agent Build Script

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

print_status "Building ViWorkS Gateway Agent..."

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    print_error "Rust is not installed. Please install Rust first."
    print_status "Visit https://rustup.rs/ for installation instructions."
    exit 1
fi

# Check Rust version
RUST_VERSION=$(rustc --version | cut -d' ' -f2)
print_status "Rust version: $RUST_VERSION"

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

# Build release version
print_status "Building release version..."
cargo build --release

# Check binary size
BINARY_SIZE=$(du -h target/release/viworks-gateway-agent | cut -f1)
print_success "Build completed successfully!"
print_status "Binary size: $BINARY_SIZE"
print_status "Binary location: target/release/viworks-gateway-agent"

# Check if Docker is available for container build
if command -v docker &> /dev/null; then
    print_status "Docker found. Building container image..."
    
    # Build Docker image
    docker build -t viworks-gateway-agent:latest .
    
    # Check image size
    IMAGE_SIZE=$(docker images viworks-gateway-agent:latest --format "table {{.Size}}" | tail -n 1)
    print_success "Docker image built successfully!"
    print_status "Image size: $IMAGE_SIZE"
    print_status "Image name: viworks-gateway-agent:latest"
else
    print_warning "Docker not found. Skipping container build."
fi

# Create installation script
print_status "Creating installation script..."
cat > install.sh << 'EOF'
#!/bin/bash

# ViWorkS Gateway Agent Installation Script

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

print_status "Installing ViWorkS Gateway Agent..."

# Create directories
print_status "Creating directories..."
mkdir -p /usr/local/bin
mkdir -p /etc/viworks
mkdir -p /var/log/viworks

# Copy binary
print_status "Installing binary..."
cp target/release/viworks-gateway-agent /usr/local/bin/
chmod +x /usr/local/bin/viworks-gateway-agent

# Copy configuration
print_status "Installing configuration..."
cp agent.toml /etc/viworks/

# Create systemd service
print_status "Creating systemd service..."
cat > /etc/systemd/system/viworks-agent.service << 'SERVICE_EOF'
[Unit]
Description=ViWorkS Gateway Agent
After=network.target docker.service
Wants=docker.service

[Service]
Type=simple
User=viworks
Group=viworks
ExecStart=/usr/local/bin/viworks-gateway-agent
Restart=always
RestartSec=10
Environment=RUST_LOG=info
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICE_EOF

# Create viworks user if it doesn't exist
if ! id "viworks" &>/dev/null; then
    print_status "Creating viworks user..."
    useradd -r -s /bin/false -d /var/lib/viworks viworks
fi

# Set permissions
print_status "Setting permissions..."
chown -R viworks:viworks /etc/viworks /var/log/viworks

# Reload systemd
print_status "Reloading systemd..."
systemctl daemon-reload

# Enable service
print_status "Enabling service..."
systemctl enable viworks-agent

print_success "Installation completed!"
print_status "To start the service: sudo systemctl start viworks-agent"
print_status "To check status: sudo systemctl status viworks-agent"
print_status "To view logs: sudo journalctl -u viworks-agent -f"
EOF

chmod +x install.sh
print_success "Installation script created: install.sh"

# Create uninstall script
print_status "Creating uninstall script..."
cat > uninstall.sh << 'EOF'
#!/bin/bash

# ViWorkS Gateway Agent Uninstallation Script

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

print_status "Uninstalling ViWorkS Gateway Agent..."

# Stop and disable service
print_status "Stopping service..."
systemctl stop viworks-agent 2>/dev/null || true
systemctl disable viworks-agent 2>/dev/null || true

# Remove systemd service
print_status "Removing systemd service..."
rm -f /etc/systemd/system/viworks-agent.service

# Remove binary
print_status "Removing binary..."
rm -f /usr/local/bin/viworks-gateway-agent

# Remove configuration (ask user)
read -p "Remove configuration files? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Removing configuration..."
    rm -rf /etc/viworks
fi

# Remove logs (ask user)
read -p "Remove log files? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Removing logs..."
    rm -rf /var/log/viworks
fi

# Remove user (ask user)
read -p "Remove viworks user? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Removing viworks user..."
    userdel viworks 2>/dev/null || true
fi

# Reload systemd
print_status "Reloading systemd..."
systemctl daemon-reload

print_success "Uninstallation completed!"
EOF

chmod +x uninstall.sh
print_success "Uninstall script created: uninstall.sh"

print_success "Build process completed successfully!"
print_status "Next steps:"
print_status "1. Run './install.sh' to install the agent"
print_status "2. Configure certificates in /etc/viworks/"
print_status "3. Start the service with 'sudo systemctl start viworks-agent'"
