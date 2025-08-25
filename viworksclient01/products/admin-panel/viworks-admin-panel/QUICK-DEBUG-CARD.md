# 🚨 Quick Debug Card - Container Restart Issues

## Immediate Actions (5 minutes)

### 1. Check Container Status
```bash
docker ps -a | grep your-container
docker logs your-container
```

### 2. If No Logs, Test Binary Directly
```bash
docker run --rm --entrypoint=/app/your-binary your-image
```

### 3. Check Environment
```bash
docker run --rm --entrypoint=/bin/sh your-image -c "env"
```

### 4. Test with Interactive Shell
```bash
docker run --rm -it --entrypoint=/bin/sh your-image
# Then manually run: ./your-binary
```

## Emergency Fix (10 minutes)

### 1. Create Minimal Working Version
```rust
use actix_web::{App, HttpServer, web, HttpResponse};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("🚀 Starting minimal app...");
    
    HttpServer::new(|| {
        App::new()
            .route("/health", web::get().to(|| async { 
                HttpResponse::Ok().json(serde_json::json!({
                    "status": "ok",
                    "message": "Minimal app running"
                }))
            }))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
```

### 2. Build and Test
```bash
docker build -t emergency-fix .
docker run -d --name test-fix emergency-fix
docker logs test-fix
curl http://localhost:8080/health
```

## Root Cause Checklist

- [ ] **Complex dependencies** (JWT, bcrypt, etc.)
- [ ] **Missing environment variables**
- [ ] **Binary not executable**
- [ ] **Memory/stack issues**
- [ ] **Network connection problems**
- [ ] **Database connection issues**

## Prevention Rules

1. **Start simple** - Minimal dependencies first
2. **Test locally** - Before containerizing
3. **Add logging early** - Before complex features
4. **Incremental development** - One feature at a time
5. **Health checks** - Always implement them

## Quick Commands

```bash
# Stop problematic container
docker stop your-container && docker rm your-container

# Check all containers
docker ps -a

# View recent logs
docker logs --tail 50 your-container

# Test health endpoint
curl -f http://localhost:8080/health

# Emergency stop all
docker stop $(docker ps -q)
```

## Contact Information

- **Full Guide:** `TROUBLESHOOTING-GUIDE.md`
- **Bug Report Template:** See full guide
- **Emergency Procedures:** See full guide

---

**Remember: When in doubt, start simple!**
