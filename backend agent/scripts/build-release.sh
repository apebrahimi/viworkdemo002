#!/bin/bash

# ViWorkS Backend Agent - Release Build Script
# This script builds optimized release binaries for different platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}🚀 ViWorkS Backend Agent - Release Build Script${NC}"
echo "=================================================="

# Check if we're in the right directory
if [[ ! -f "$PROJECT_DIR/Cargo.toml" ]]; then
    echo -e "${RED}❌ Error: Cargo.toml not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Function to build for a specific target
build_target() {
    local target=$1
    local target_name=$2
    
    echo -e "${YELLOW}🔨 Building for $target_name...${NC}"
    
    # Install target if not already installed
    if ! rustup target list --installed | grep -q "$target"; then
        echo "Installing target $target..."
        rustup target add "$target"
    fi
    
    # Build for target
    cargo build --release --target "$target"
    
    # Create output directory
    local output_dir="$PROJECT_DIR/release/$target_name"
    mkdir -p "$output_dir"
    
    # Copy binary
    local binary_name="viworks-backend-agent"
    if [[ "$target" == *"windows"* ]]; then
        binary_name="${binary_name}.exe"
    fi
    
    cp "$PROJECT_DIR/target/$target/release/$binary_name" "$output_dir/"
    
    # Strip binary (reduce size)
    if command -v strip >/dev/null 2>&1; then
        echo "Stripping binary..."
        strip "$output_dir/$binary_name"
    fi
    
    # Get binary size
    local size=$(du -h "$output_dir/$binary_name" | cut -f1)
    echo -e "${GREEN}✅ Built $target_name successfully (Size: $size)${NC}"
}

# Function to create deployment package
create_package() {
    local target_name=$1
    local package_dir="$PROJECT_DIR/release/$target_name-package"
    
    echo -e "${YELLOW}📦 Creating deployment package for $target_name...${NC}"
    
    # Create package directory
    rm -rf "$package_dir"
    mkdir -p "$package_dir"
    
    # Copy binary
    cp "$PROJECT_DIR/release/$target_name/viworks-backend-agent"* "$package_dir/"
    
    # Copy configuration files
    cp "$PROJECT_DIR/config/backend-agent.toml" "$package_dir/"
    cp "$PROJECT_DIR/env.example" "$package_dir/"
    
    # Copy scripts
    mkdir -p "$package_dir/scripts"
    cp "$PROJECT_DIR/scripts/"*.sh "$package_dir/scripts/" 2>/dev/null || true
    
    # Copy documentation
    cp "$PROJECT_DIR/README.md" "$package_dir/" 2>/dev/null || true
    
    # Create installation script
    cat > "$package_dir/install.sh" << 'EOF'
#!/bin/bash

# ViWorkS Backend Agent Installation Script

set -e

echo "🚀 Installing ViWorkS Backend Agent..."

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
else
    echo "❌ Unsupported operating system: $OSTYPE"
    exit 1
fi

# Detect architecture
ARCH=$(uname -m)
case $ARCH in
    x86_64) ARCH="x86_64" ;;
    aarch64) ARCH="aarch64" ;;
    armv7l) ARCH="armv7" ;;
    *) echo "❌ Unsupported architecture: $ARCH"; exit 1 ;;
esac

echo "📋 OS: $OS, Architecture: $ARCH"

# Create installation directory
INSTALL_DIR="/usr/local/bin"
CONFIG_DIR="/etc/viworks-backend-agent"
SERVICE_DIR="/etc/systemd/system"

echo "📁 Creating directories..."
sudo mkdir -p "$CONFIG_DIR"
sudo mkdir -p "$SERVICE_DIR"

# Copy binary
echo "📦 Installing binary..."
sudo cp viworks-backend-agent* "$INSTALL_DIR/"
sudo chmod +x "$INSTALL_DIR/viworks-backend-agent"*

# Copy configuration
echo "⚙️ Installing configuration..."
sudo cp backend-agent.toml "$CONFIG_DIR/"
sudo cp env.example "$CONFIG_DIR/"

# Create systemd service
echo "🔧 Creating systemd service..."
sudo tee "$SERVICE_DIR/viworks-backend-agent.service" > /dev/null << 'SERVICE_EOF'
[Unit]
Description=ViWorkS Backend Agent
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=viworks
Group=viworks
WorkingDirectory=/etc/viworks-backend-agent
ExecStart=/usr/local/bin/viworks-backend-agent
Restart=always
RestartSec=5
Environment=RUST_LOG=info
EnvironmentFile=/etc/viworks-backend-agent/.env

[Install]
WantedBy=multi-user.target
SERVICE_EOF

# Create viworks user if it doesn't exist
if ! id "viworks" &>/dev/null; then
    echo "👤 Creating viworks user..."
    sudo useradd -r -s /bin/false -d /etc/viworks-backend-agent viworks
fi

# Set permissions
echo "🔐 Setting permissions..."
sudo chown -R viworks:viworks "$CONFIG_DIR"
sudo chmod 750 "$CONFIG_DIR"

echo "✅ Installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Copy your .env file to $CONFIG_DIR/"
echo "2. Update configuration in $CONFIG_DIR/backend-agent.toml"
echo "3. Start the service: sudo systemctl start viworks-backend-agent"
echo "4. Enable auto-start: sudo systemctl enable viworks-backend-agent"
echo "5. Check status: sudo systemctl status viworks-backend-agent"
EOF

    chmod +x "$package_dir/install.sh"
    
    # Create archive
    cd "$PROJECT_DIR/release"
    tar -czf "$target_name-package.tar.gz" "$target_name-package"
    
    echo -e "${GREEN}✅ Package created: $target_name-package.tar.gz${NC}"
}

# Main build process
echo -e "${BLUE}🔧 Starting build process...${NC}"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
cargo clean

# Update dependencies
echo "📦 Updating dependencies..."
cargo update

# Build for current platform
echo -e "${YELLOW}🔨 Building for current platform...${NC}"
cargo build --release

# Get current target
CURRENT_TARGET=$(rustc --print target-triple)
CURRENT_TARGET_NAME=$(echo "$CURRENT_TARGET" | sed 's/-/_/g')

# Copy current platform binary
mkdir -p "$PROJECT_DIR/release/$CURRENT_TARGET_NAME"
cp "$PROJECT_DIR/target/release/viworks-backend-agent"* "$PROJECT_DIR/release/$CURRENT_TARGET_NAME/" 2>/dev/null || true

# Build for common targets
echo -e "${BLUE}🌍 Building for multiple platforms...${NC}"

# Linux targets
build_target "x86_64-unknown-linux-gnu" "linux_x86_64"
build_target "aarch64-unknown-linux-gnu" "linux_aarch64"

# Alpine Linux (musl)
build_target "x86_64-unknown-linux-musl" "alpine_x86_64"
build_target "aarch64-unknown-linux-musl" "alpine_aarch64"

# macOS targets
build_target "x86_64-apple-darwin" "macos_x86_64"
build_target "aarch64-apple-darwin" "macos_aarch64"

# Create deployment packages
echo -e "${BLUE}📦 Creating deployment packages...${NC}"
create_package "linux_x86_64"
create_package "linux_aarch64"
create_package "alpine_x86_64"
create_package "alpine_aarch64"

# Show build summary
echo ""
echo -e "${GREEN}🎉 Build completed successfully!${NC}"
echo "=================================================="
echo "📁 Release binaries created in: $PROJECT_DIR/release/"
echo ""
echo "📦 Available packages:"
ls -la "$PROJECT_DIR/release/"*.tar.gz 2>/dev/null || echo "No packages found"
echo ""
echo "🚀 Ready for deployment!"

# Show binary sizes
echo ""
echo "📊 Binary sizes:"
for dir in "$PROJECT_DIR/release"/*/; do
    if [[ -d "$dir" ]]; then
        dirname=$(basename "$dir")
        if [[ -f "$dir/viworks-backend-agent" ]]; then
            size=$(du -h "$dir/viworks-backend-agent" | cut -f1)
            echo "  $dirname: $size"
        fi
    fi
done
