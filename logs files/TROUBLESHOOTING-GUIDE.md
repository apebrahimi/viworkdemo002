# ViWorkS Admin Panel - Troubleshooting Guide

## 🚨 Container Restart Issues - Prevention & Resolution

This guide documents the lessons learned from debugging the backend container restart issue and provides strategies to prevent similar problems in the future.

## 📋 Table of Contents

1. [Root Cause Analysis](#root-cause-analysis)
2. [Prevention Strategies](#prevention-strategies)
3. [Debugging Checklist](#debugging-checklist)
4. [Common Failure Patterns](#common-failure-patterns)
5. [Resolution Steps](#resolution-steps)
6. [Best Practices](#best-practices)
7. [Emergency Procedures](#emergency-procedures)

---

## 🔍 Root Cause Analysis

### The Problem We Encountered

**Symptoms:**
- Container starts and immediately exits
- No logs produced (`docker logs` returns empty)
- Health checks fail
- Container appears to restart continuously
- Docker build succeeds but runtime fails

**Root Cause:**
- **Silent compilation/runtime errors** in Rust applications
- Complex dependencies causing runtime panics
- Application crashing before logging system initializes
- Binary corruption or memory issues

### Why No Logs Were Produced

```rust
// The application crashed before reaching this point
tracing_subscriber::registry()
    .with(tracing_subscriber::EnvFilter::new(...))
    .with(tracing_subscriber::fmt::layer())
    .init(); // ← Never reached due to earlier crash
```

---

## 🛡️ Prevention Strategies

### 1. Start Simple, Add Complexity Gradually

**❌ Don't do this:**
```rust
// Adding complex dependencies all at once
use jsonwebtoken::{encode, decode, Header, Algorithm, Validation, EncodingKey, DecodingKey};
use bcrypt::{hash, verify, DEFAULT_COST};
use lazy_static::lazy_static;
use std::collections::HashMap;
use std::sync::Mutex;
```

**✅ Do this instead:**
```rust
// Start with minimal dependencies
use actix_web::{App, HttpServer, web, HttpResponse};
use serde::{Deserialize, Serialize};

// Add complexity step by step
// Step 1: Basic web server
// Step 2: Add simple authentication
// Step 3: Add database connections
// Step 4: Add complex features
```

### 2. Implement Early Logging

```rust
// Add this at the very beginning of main()
fn main() -> std::io::Result<()> {
    // Initialize basic logging immediately
    env_logger::init();
    log::info!("🚀 Starting application...");
    
    // Then initialize more complex logging
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();
    
    // Rest of your application...
}
```

### 3. Add Panic Hooks

```rust
use std::panic;

fn main() -> std::io::Result<()> {
    // Set up panic hook to catch panics
    panic::set_hook(Box::new(|panic_info| {
        eprintln!("Application panicked: {:?}", panic_info);
        std::process::exit(1);
    }));
    
    // Rest of your application...
}
```

### 4. Test Binaries Locally First

```bash
# Test the binary locally before containerizing
cargo build --release
./target/release/your-app

# If it works locally, then containerize
docker build -t your-app .
```

---

## 🔧 Debugging Checklist

### When a Container Restarts Silently

1. **Check Container Status**
   ```bash
   docker ps -a | grep your-container
   docker logs your-container
   ```

2. **Check if Binary is Executable**
   ```bash
   docker run --rm --entrypoint=/bin/sh your-image -c "ls -la /app/your-binary"
   ```

3. **Test Binary Directly**
   ```bash
   docker run --rm --entrypoint=/app/your-binary your-image
   ```

4. **Check Environment Variables**
   ```bash
   docker run --rm --entrypoint=/bin/sh your-image -c "env"
   ```

5. **Test with Interactive Shell**
   ```bash
   docker run --rm -it --entrypoint=/bin/sh your-image
   # Then manually run your binary
   ```

6. **Check Resource Limits**
   ```bash
   docker stats your-container
   ```

7. **Verify Dependencies**
   ```bash
   # Check if all required files are present
   docker run --rm --entrypoint=/bin/sh your-image -c "ls -la /app/"
   ```

---

## ⚠️ Common Failure Patterns

### 1. Complex Dependencies Pattern

**Symptoms:**
- Build succeeds but runtime fails
- No error messages
- Container exits immediately

**Solution:**
- Remove complex dependencies temporarily
- Implement simple alternatives
- Add dependencies one by one

### 2. Memory/Stack Issues Pattern

**Symptoms:**
- Container starts but crashes under load
- Intermittent failures
- No clear error pattern

**Solution:**
- Increase container memory limits
- Check for infinite loops
- Add memory monitoring

### 3. Environment Variable Issues Pattern

**Symptoms:**
- Container works locally but fails in production
- Different behavior in different environments
- Configuration-related crashes

**Solution:**
- Validate all environment variables
- Provide sensible defaults
- Add configuration validation

### 4. Network/Database Connection Issues Pattern

**Symptoms:**
- Container starts but fails to connect to dependencies
- Timeout errors
- Connection refused errors

**Solution:**
- Add connection retry logic
- Implement health checks
- Use proper dependency ordering

---

## 🚀 Resolution Steps

### Step 1: Immediate Response

```bash
# Stop the problematic container
docker stop your-container
docker rm your-container

# Check what's running
docker ps
```

### Step 2: Create Minimal Working Version

```rust
// Create a minimal main.rs that definitely works
use actix_web::{App, HttpServer, web, HttpResponse};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("🚀 Starting minimal application...");
    
    HttpServer::new(|| {
        App::new()
            .route("/health", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "status": "ok",
                    "message": "Minimal app is running"
                }))
            }))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
```

### Step 3: Test Minimal Version

```bash
# Build and test minimal version
docker build -t your-app:minimal .
docker run -d --name test-container your-app:minimal
docker logs test-container
```

### Step 4: Add Features Incrementally

1. **Add basic logging**
2. **Add simple endpoints**
3. **Add configuration**
4. **Add database connections**
5. **Add complex features**

### Step 5: Validate Each Step

```bash
# After each addition, test thoroughly
curl http://localhost:8080/health
docker logs your-container
```

---

## 📚 Best Practices

### 1. Dockerfile Best Practices

```dockerfile
# Use multi-stage builds
FROM rust:1.70 as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates
WORKDIR /app
COPY --from=builder /app/target/release/your-app .
USER 1000:1000
EXPOSE 8080
CMD ["./your-app"]
```

### 2. Cargo.toml Best Practices

```toml
[dependencies]
# Start with minimal dependencies
actix-web = "4.4"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

# Add complex dependencies only when needed
# jsonwebtoken = "9.0"  # Comment out until needed
# bcrypt = "0.15"       # Comment out until needed
```

### 3. Error Handling Best Practices

```rust
use anyhow::Result;

#[actix_web::main]
async fn main() -> Result<()> {
    // Initialize logging first
    env_logger::init();
    log::info!("Starting application...");
    
    // Validate configuration
    let config = load_config()?;
    
    // Start server with error handling
    HttpServer::new(move || {
        App::new()
            .wrap(actix_web::middleware::Logger::default())
            .app_data(web::Data::new(config.clone()))
            .service(web::scope("/api").configure(configure_routes))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await?;
    
    Ok(())
}
```

### 4. Health Check Best Practices

```rust
async fn health_check() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "timestamp": chrono::Utc::now().to_rfc3339(),
        "version": env!("CARGO_PKG_VERSION")
    }))
}
```

---

## 🆘 Emergency Procedures

### When Everything is Broken

1. **Create a backup of working code**
   ```bash
   git stash
   git checkout -b emergency-fix
   ```

2. **Revert to last known working version**
   ```bash
   git log --oneline
   git checkout <last-working-commit>
   ```

3. **Create minimal working version**
   ```bash
   # Create a simple main.rs that just responds to health checks
   # Build and test it
   docker build -t emergency-backup .
   ```

4. **Document the issue**
   ```bash
   # Create a detailed bug report
   echo "Issue: Container restarting silently" > BUG_REPORT.md
   echo "Date: $(date)" >> BUG_REPORT.md
   echo "Steps to reproduce: ..." >> BUG_REPORT.md
   ```

### Communication Template

```
🚨 EMERGENCY: Container Restart Issue

**Problem:**
- Container [name] is restarting silently
- No logs are being produced
- Health checks are failing

**Current Status:**
- [ ] Identified root cause
- [ ] Created minimal working version
- [ ] Implemented fix
- [ ] Tested solution
- [ ] Deployed fix

**Next Steps:**
1. [Action item 1]
2. [Action item 2]
3. [Action item 3]

**ETA:** [Estimated time to resolution]
```

---

## 📝 Documentation Template

### Bug Report Template

```markdown
## Bug Report: Container Restart Issue

### Summary
Brief description of the issue

### Environment
- Docker version: [version]
- Rust version: [version]
- OS: [OS]
- Container image: [image]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior
What should happen

### Actual Behavior
What actually happened

### Logs
```
[Paste logs here]
```

### Root Cause
What caused the issue

### Solution
How the issue was resolved

### Prevention
How to prevent this in the future
```

---

## 🎯 Key Takeaways

1. **Docker build success ≠ Runtime success**
2. **Start simple, add complexity gradually**
3. **Always test locally before containerizing**
4. **Implement early logging and error handling**
5. **Use health checks and monitoring**
6. **Document everything for future reference**
7. **Have a rollback plan ready**

---

## 📞 Quick Reference Commands

```bash
# Check container status
docker ps -a

# View logs
docker logs container-name

# Test binary directly
docker run --rm --entrypoint=/app/binary image-name

# Check environment
docker run --rm --entrypoint=/bin/sh image-name -c "env"

# Build minimal version
docker build -t minimal-version .

# Health check
curl http://localhost:8080/health

# Emergency stop all containers
docker stop $(docker ps -q)
```

---

**Remember: When in doubt, start simple and build up complexity gradually. It's much easier to debug a simple application than a complex one that's failing silently.**
