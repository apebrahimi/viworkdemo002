# ViWorkS macOS Client

This is the macOS version of the ViWorkS VPN client with SPA (Single Packet Authorization) authentication.

## Prerequisites

### Required Software
- **Rust** (latest stable version) - [Install via rustup.rs](https://rustup.rs/)
- **Xcode Command Line Tools** - Install with: `xcode-select --install`

### Optional Software
- **Homebrew** - For easier dependency management: [Install Homebrew](https://brew.sh/)

### Dependencies
The following binaries should be available in your PATH or installed:
- `fwknop` - For SPA authentication
- `openvpn` - For VPN connections

You can install these via Homebrew:
```bash
brew install fwknop openvpn
```

## Quick Start

### 1. Build the Application
```bash
# Development build (recommended for testing)
./scripts/dev_build.sh

# Fast build (if already built)
./scripts/fast_build.sh
```

### 2. Run the Application
```bash
# Normal run
./scripts/run_app.sh

# Run with detailed logging
./scripts/run_with_logs.sh

# Test connection functionality
./scripts/test_connection.sh
```

### 3. Manual Build and Run
```bash
# Build the workspace
cargo build --workspace

# Build just the desktop app
cargo build --package viworks-desktop

# Run directly
./target/debug/viworks-desktop

# Run with logging
RUST_LOG=debug ./target/debug/viworks-desktop
```

## Project Structure

```
macos/
├── apps/
│   └── desktop_egui/          # Main desktop application
├── crates/
│   ├── auth_api/              # Authentication API client
│   ├── connection_manager/    # Connection management
│   ├── core/                  # Core functionality and state management
│   ├── platform/              # macOS-specific platform code
│   ├── spa_fwknop/           # SPA/FWKNOP integration
│   ├── stunnel/              # SSL/TLS tunneling
│   └── vpn_openvpn/          # OpenVPN integration
├── scripts/                   # Build and run scripts
└── security/                  # Security configuration
```

## macOS-Specific Features

### Security Framework Integration
- Uses macOS Security Framework for certificate verification
- Leverages `codesign` for binary signature verification
- Integrates with macOS Keychain for secure storage

### System Integration
- Native macOS tray icon support
- System notifications via `osascript`
- Proper macOS app lifecycle management

### Platform Checks
- macOS version verification (requires 10.15+)
- Timezone validation
- Network interface detection using `ifconfig`
- Binary signature verification using `codesign`

## Development

### Environment Variables
- `RUST_LOG` - Set logging level (debug, info, warn, error)
- `RUST_BACKTRACE` - Enable backtraces for debugging

### Common Commands
```bash
# Clean build
cargo clean && cargo build

# Run tests
cargo test

# Check for issues
cargo check
cargo clippy

# Update dependencies
cargo update
```

### Debugging
```bash
# Run with maximum logging
RUST_LOG=trace RUST_BACKTRACE=1 ./target/debug/viworks-desktop

# Check system requirements
./scripts/dev_build.sh  # Includes dependency checks
```

## Troubleshooting

### Common Issues

1. **Xcode Command Line Tools not found**
   ```bash
   xcode-select --install
   ```

2. **Permission denied on scripts**
   ```bash
   chmod +x scripts/*.sh
   ```

3. **Missing dependencies**
   ```bash
   brew install fwknop openvpn
   ```

4. **Build errors**
   ```bash
   cargo clean
   cargo update
   cargo build
   ```

### Log Files
The application logs to stdout/stderr. For persistent logging, redirect output:
```bash
./target/debug/viworks-desktop > viworks.log 2>&1
```

## Security Notes

- The application requires appropriate permissions for network access
- VPN connections may require administrator privileges
- Binary signature verification is performed for security
- Timezone restrictions may apply based on security policies

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the logs with `RUST_LOG=debug`
3. Ensure all prerequisites are installed
4. Verify macOS version compatibility (10.15+)
