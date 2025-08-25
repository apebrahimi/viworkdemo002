# ViWorkS Client Development Guide

This guide provides comprehensive information for developing and contributing to the ViWorkS Client project.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Development Environment Setup](#development-environment-setup)
3. [Project Structure](#project-structure)
4. [Building and Testing](#building-and-testing)
5. [Security Guidelines](#security-guidelines)
6. [Code Style and Standards](#code-style-and-standards)
7. [Architecture Overview](#architecture-overview)
8. [Debugging and Troubleshooting](#debugging-and-troubleshooting)
9. [Contributing Guidelines](#contributing-guidelines)
10. [Release Process](#release-process)

## Project Overview

The ViWorkS Client is a secure Windows desktop VPN client built with Rust and eframe/egui. It provides:

- **Secure Authentication**: SPKI certificate pinning and Windows DPAPI token storage
- **VPN Integration**: OpenVPN with hardening and fwknop SPA support
- **Process Hardening**: Windows security mitigations and binary verification
- **Pure Rust GUI**: eframe/egui interface without WebView dependencies

### Key Technologies

- **Rust**: Core language and ecosystem
- **eframe/egui**: Pure Rust GUI framework
- **tokio**: Async runtime for networking and I/O
- **Windows API**: Native Windows integration
- **OpenVPN**: VPN protocol implementation
- **fwknop**: Single Packet Authorization

## Development Environment Setup

### Prerequisites

1. **Rust Toolchain**
   ```bash
   # Install Rust via rustup
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # Install MSVC toolchain for Windows
   rustup target add x86_64-pc-windows-msvc
   ```

2. **Windows Development Tools**
   - Visual Studio 2019/2022 with C++ build tools
   - Windows 10/11 SDK
   - .NET Framework 4.8 or later

3. **Additional Tools**
   ```bash
   # Install development tools
   cargo install cargo-audit
   cargo install cargo-deny
   cargo install cargo-watch
   cargo install cargo-tarpaulin  # For code coverage
   ```

### IDE Setup

**Recommended: Visual Studio Code with Rust extensions**

1. Install VS Code extensions:
   - `rust-analyzer` - Rust language server
   - `crates` - Cargo.toml dependency management
   - `CodeLLDB` - Debugging support
   - `Even Better TOML` - TOML file support

2. Configure settings:
   ```json
   {
     "rust-analyzer.checkOnSave.command": "clippy",
     "rust-analyzer.cargo.buildScripts.enable": true,
     "rust-analyzer.procMacro.enable": true
   }
   ```

## Project Structure

```
viworks-client/
├── apps/
│   └── desktop_egui/          # Main desktop application
│       ├── src/
│       │   ├── main.rs        # Application entry point
│       │   ├── app.rs         # Main application logic
│       │   ├── tray.rs        # System tray integration
│       │   └── ui_helpers.rs  # UI utility functions
│       └── Cargo.toml
├── crates/
│   ├── core/                  # Core business logic
│   │   ├── src/
│   │   │   ├── lib.rs         # Core types and constants
│   │   │   ├── fsm.rs         # Connection state machine
│   │   │   ├── errors.rs      # Error definitions
│   │   │   ├── config.rs      # Configuration management
│   │   │   ├── validation.rs  # Input validation
│   │   │   └── logging.rs     # Logging setup
│   │   └── Cargo.toml
│   ├── auth_api/              # Authentication API client
│   ├── platform/              # Windows-specific functionality
│   ├── spa_fwknop/            # fwknop SPA integration
│   └── vpn_openvpn/           # OpenVPN integration
├── assets/                    # Application assets
├── security/                  # Security configuration
├── build.ps1                  # Build script
└── README.md
```

### Crate Responsibilities

- **core**: Business logic, FSM, validation, configuration
- **auth_api**: HTTP client, certificate pinning, token storage
- **platform**: Windows-specific utilities, process hardening
- **spa_fwknop**: fwknop integration and port probing
- **vpn_openvpn**: OpenVPN configuration and process management
- **desktop_egui**: GUI application and user interface

## Building and Testing

### Quick Start

```bash
# Clone the repository
git clone https://github.com/viworks/viworks-client.git
cd viworks-client

# Build in debug mode
cargo build

# Run the application
cargo run -p viworks-desktop

# Run tests
cargo test

# Build in release mode
cargo build --release
```

### Using the Build Script

The project includes a PowerShell build script with comprehensive checks:

```powershell
# Basic debug build
.\build.ps1

# Release build with all checks
.\build.ps1 -Release -Test -Audit -Deny

# Clean build
.\build.ps1 -Clean -Release

# Show help
.\build.ps1 -Help
```

### Testing

```bash
# Run all tests
cargo test

# Run tests for specific crate
cargo test -p viworks-core

# Run tests with coverage
cargo tarpaulin --out Html

# Run integration tests
cargo test --test integration

# Run security audit
cargo audit

# Run dependency analysis
cargo deny check
```

### Continuous Integration

The project uses GitHub Actions for CI/CD:

- **Build**: Compiles on Windows, Linux, macOS
- **Test**: Runs unit and integration tests
- **Security**: Runs cargo audit and cargo deny
- **Code Quality**: Runs clippy and formatting checks

## Security Guidelines

### Code Security

1. **No Hardcoded Secrets**
   - Never commit passwords, keys, or tokens
   - Use environment variables or secure storage
   - Validate all inputs and sanitize outputs

2. **Memory Safety**
   - Use `zeroize` for sensitive data
   - Implement proper `Drop` traits
   - Avoid `unsafe` code unless absolutely necessary

3. **Error Handling**
   - Use proper error types with `thiserror`
   - Don't expose sensitive information in error messages
   - Log errors appropriately without secrets

4. **Input Validation**
   - Validate all user inputs
   - Use the validation module in `core`
   - Sanitize file paths and network data

### Security Features

1. **Certificate Pinning**
   ```rust
   // Use SPKI pinning for all API calls
   let pins = SpkiPins {
       primary_b64: "primary_pin".to_string(),
       backup_b64: "backup_pin".to_string(),
   };
   let client = create_pinned_client(pins)?;
   ```

2. **Secure Token Storage**
   ```rust
   // Store tokens with DPAPI
   store_tokens(&tokens)?;
   
   // Load tokens securely
   let tokens = load_tokens()?;
   ```

3. **Binary Verification**
   ```rust
   // Verify binary signatures and hashes
   verify_binary_integrity(
       "path/to/binary.exe",
       "expected_publisher",
       "expected_hash"
   )?;
   ```

### Security Testing

```bash
# Run security audit
cargo audit

# Check for vulnerabilities
cargo audit --deny warnings

# Analyze dependencies
cargo deny check

# Check for unsafe code
cargo clippy -- -D clippy::unsafe_code
```

## Code Style and Standards

### Rust Conventions

1. **Formatting**
   ```bash
   # Format code
   cargo fmt
   
   # Check formatting
   cargo fmt --check
   ```

2. **Linting**
   ```bash
   # Run clippy
   cargo clippy
   
   # Run clippy with all warnings
   cargo clippy -- -W clippy::all
   ```

3. **Documentation**
   ```rust
   /// Function documentation
   /// 
   /// # Arguments
   /// * `input` - Description of input
   /// 
   /// # Returns
   /// Description of return value
   /// 
   /// # Errors
   /// Description of possible errors
   pub fn example_function(input: &str) -> Result<String> {
       // Implementation
   }
   ```

### Error Handling

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum MyError {
    #[error("Invalid input: {0}")]
    InvalidInput(String),
    
    #[error("Network error: {0}")]
    Network(#[from] std::io::Error),
}

pub type Result<T> = std::result::Result<T, MyError>;
```

### Logging

```rust
use tracing::{info, warn, error, debug};

// Use appropriate log levels
debug!("Debug information");
info!("General information");
warn!("Warning message");
error!("Error message");

// Don't log sensitive data
info!("User {} logged in", username); // OK
error!("Password: {}", password);     // BAD
```

## Architecture Overview

### State Machine (FSM)

The application uses a finite state machine for connection management:

```rust
pub enum ConnectionState {
    Idle,
    Preflight,
    Authenticated,
    BootstrapManual,
    BootstrapFetch,
    SpaSent,
    PortOpen,
    VpnConnecting,
    Connected,
    Error { error: String, can_retry: bool },
}
```

### Event-Driven Architecture

```rust
pub enum ConnectionEvent {
    Login,
    Logout,
    FetchBootstrap,
    ManualConfig(ConnectionConfig),
    PreflightPassed,
    PreflightFailed(ViWorksError),
    // ... more events
}
```

### Async Task Management

```rust
// Spawn async tasks
let handle = tokio::spawn(async move {
    // Async work
    result.await
});

// Wait for completion
let result = handle.await?;
```

## Debugging and Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clean and rebuild
   cargo clean
   cargo build
   
   # Check toolchain
   rustup show
   rustup update
   ```

2. **Runtime Errors**
   ```bash
   # Enable debug logging
   RUST_LOG=debug cargo run
   
   # Check logs
   tail -f %LOCALAPPDATA%\ViWorkS\logs\viworks-*.log
   ```

3. **Permission Issues**
   - Run as Administrator for VPN operations
   - Check Windows security policies
   - Verify binary signatures

### Debugging Tools

1. **VS Code Debugging**
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Debug ViWorkS",
         "type": "lldb",
         "request": "launch",
         "program": "${workspaceFolder}/target/debug/viworks-desktop.exe",
         "args": [],
         "cwd": "${workspaceFolder}"
       }
     ]
   }
   ```

2. **Logging Configuration**
   ```rust
   // Enable detailed logging
   tracing_subscriber::fmt()
       .with_max_level(tracing::Level::DEBUG)
       .init();
   ```

## Contributing Guidelines

### Development Workflow

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/viworks-client.git
   cd viworks-client
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow code style guidelines
   - Add tests for new functionality
   - Update documentation

4. **Test Changes**
   ```bash
   cargo test
   cargo clippy
   cargo fmt --check
   cargo audit
   ```

5. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Provide clear description
   - Include tests and documentation
   - Address review comments

### Commit Message Format

Use conventional commits:

```
type(scope): description

feat(auth): add two-factor authentication
fix(vpn): resolve connection timeout issue
docs(readme): update installation instructions
test(core): add unit tests for FSM
refactor(ui): improve error handling
```

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Security considerations addressed
- [ ] Error handling is appropriate
- [ ] Logging is implemented correctly
- [ ] No hardcoded secrets
- [ ] Performance impact considered

## Release Process

### Version Management

1. **Update Version**
   ```toml
   # Cargo.toml
   [package]
   version = "1.0.0"
   ```

2. **Create Release Branch**
   ```bash
   git checkout -b release/v1.0.0
   ```

3. **Build Release**
   ```powershell
   .\build.ps1 -Release -Test -Audit -Deny
   ```

4. **Create Tag**
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

### Release Checklist

- [ ] All tests passing
- [ ] Security audit clean
- [ ] Documentation updated
- [ ] Version numbers updated
- [ ] Release notes prepared
- [ ] Binary signatures verified
- [ ] Installer created and tested
- [ ] Release published

### Distribution

1. **Create Installer**
   ```powershell
   # Use WiX or NSIS to create MSI
   # Sign the installer with code signing certificate
   ```

2. **Upload Assets**
   - Upload to GitHub Releases
   - Update download links
   - Notify users

3. **Monitor**
   - Monitor for issues
   - Collect feedback
   - Plan next release

## Additional Resources

- [Rust Book](https://doc.rust-lang.org/book/)
- [eframe/egui Documentation](https://docs.rs/eframe)
- [Tokio Documentation](https://tokio.rs/)
- [Windows API Documentation](https://docs.microsoft.com/en-us/windows/win32/)
- [OpenVPN Documentation](https://openvpn.net/community-resources/)
- [fwknop Documentation](https://www.cipherdyne.org/fwknop/)

## Support

For development support:

- **Issues**: [GitHub Issues](https://github.com/viworks/viworks-client/issues)
- **Discussions**: [GitHub Discussions](https://github.com/viworks/viworks-client/discussions)
- **Security**: security@viworks.local
- **Documentation**: [Project Wiki](https://github.com/viworks/viworks-client/wiki)
