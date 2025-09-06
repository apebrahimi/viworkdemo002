# SRE: No-Restart-Guard Implementation

## Discovery Report

### Service Analysis

| Service | CMD/ENTRYPOINT | Daemonizes? | Logs Location | Health Endpoint | PID 1 |
|---------|----------------|-------------|---------------|-----------------|-------|
| **nginx** | `nginx -g daemon off;` | ❌ No | `/var/log/nginx/*.log` (files only) | `/_health` | nginx |
| **backend** | `dumb-init -- /app/entrypoint.sh /app/app` | ❌ No | stdout/stderr | `/_healthz` | dumb-init → entrypoint → app |
| **frontend** | `dumb-init -- node server.js` | ❌ No | stdout/stderr | None | dumb-init → node |
| **postgres** | `postgres` | ❌ No | stdout/stderr | Built-in | postgres |
| **redis** | `redis-server` | ❌ No | stdout/stderr | Built-in | redis |

### Issues Identified

1. **Nginx**: Logs only to files, not stdout/stderr
2. **Backend**: Has health endpoint but may be hanging after startup
3. **Frontend**: No health endpoint
4. **All services**: Missing proper signal handling in some cases

## Implementation Plan

### 1. Fix Nginx Logging
- Redirect logs to stdout/stderr
- Keep file logs as backup

### 2. Add Health Endpoints
- Frontend: Add `/_healthz` endpoint
- Backend: Ensure `/_healthz` works properly

### 3. Improve Signal Handling
- Ensure all services use proper init system
- Add graceful shutdown logging

### 4. Add Debug Mode
- Environment flags for startup debugging
- Better error reporting

## Verification

After implementation:
- [ ] All containers start without immediate exit
- [ ] All services show clear startup logs
- [ ] Health endpoints return 200 OK
- [ ] Graceful shutdown logs visible
- [ ] No silent exits

## Files Modified

- `digital ocean docker/nginx/nginx.conf` - Logging to stdout/stderr
- `digital ocean docker/backend/src/main_demo.rs` - Health endpoint and logging
- `digital ocean docker/frontend/` - Health endpoint
- `digital ocean docker/docker-compose.yml` - Health checks
- `scripts/dev/verify.sh` - Verification script
