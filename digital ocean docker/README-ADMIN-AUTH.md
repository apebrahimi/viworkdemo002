# ViWorkS Admin Authentication Separation

This implementation separates the admin authentication realm from the end-user authentication system, providing enhanced security and clear separation of concerns.

## 🏗️ Architecture

### Key Components

1. **Separate Authentication Realms**
   - Admin realm: `/admin/api/*`
   - User realm: `/api/v1/*`

2. **Database Tables**
   - `admin_users` - Separate from `users` table
   - `admin_sessions` - Separate from user sessions
   - `admin_audit_logs` - Comprehensive audit trail

3. **Security Features**
   - IP allowlist enforcement
   - Short session timeouts (15 minutes)
   - HttpOnly secure cookies
   - RBAC with three roles: ADMIN, OPERATOR, AUDITOR

4. **Feature Flag**
   - `ADMIN_REALM_ENFORCED` controls whether separation is active
   - Allows for safe rollout and rollback

## 📦 Files Overview

### Backend (Rust/Actix-Web)

- **Database Migration**
  - `migrations/002_admin_auth_separation.sql` - Adds admin tables

- **Admin Module**
  - `src/admin/mod.rs` - Route configuration
  - `src/admin/auth.rs` - Authentication handlers
  - `src/admin/models.rs` - Data structures
  - `src/admin/jwt.rs` - JWT service for admin tokens
  - `src/admin/middleware.rs` - Auth middleware
  - `src/admin/audit.rs` - Audit logging
  - `src/admin/rbac.rs` - Role-based access control

- **Main Application**
  - `src/main_admin.rs` - Enhanced main with admin support

### Frontend (Next.js/React)

- **Admin Authentication**
  - `src/contexts/AdminAuthContext.tsx` - Admin auth state management
  - `src/lib/admin-api-services.ts` - Admin API client
  - `src/lib/cookie-utils.ts` - Secure cookie handling

- **Admin Pages**
  - `src/app/admin/layout.tsx` - Admin layout with auth provider
  - `src/app/admin/login/page.tsx` - Admin login page
  - `src/app/admin/page.tsx` - Admin dashboard

- **Components**
  - `src/components/AdminProtectedRoute.tsx` - Route protection
  - `src/components/IdleTimeoutIndicator.tsx` - Session timeout warning

### Nginx Configuration

- `nginx/nginx-admin-separated.conf` - Production config with IP restrictions
- `nginx/nginx-local.conf` - Local development config

### Deployment

- `deploy-admin-separation.sh` - Phased deployment script
- `test-admin-separation.sh` - Test script
- `docker-compose.local.yml` - Local testing setup

## 🚀 Deployment Process

### Phase A: Database Migration (No Downtime)

```bash
./deploy-admin-separation.sh
# Select Phase 1
```

### Phase B: Backend Deployment (Feature Flag OFF)

```bash
./deploy-admin-separation.sh
# Select Phase 2
```

### Phase C: Enable Admin Realm

```bash
./deploy-admin-separation.sh
# Select Phase 3
```

### Phase D: Full Production Deployment

```bash
./deploy-admin-separation.sh
# Select Phase 4
```

## 🧪 Testing Locally

1. Start the local environment:

```bash
docker-compose -f docker-compose.local.yml up -d
```

2. Run the test script:

```bash
./test-admin-separation.sh
```

3. Access the admin panel:
   - http://localhost:8080/admin/login

4. Default admin credentials:
   - Username: `admin`
   - Password: `AdminP@ss2024!` (change immediately!)

## ⚠️ Important Notes

1. **IP Allowlist Configuration**
   - Add your office/VPN IPs to `ADMIN_IP_ALLOWLIST`
   - Update nginx config with your specific IPs

2. **JWT Secrets**
   - Generate strong secrets for both realms:
   ```bash
   openssl rand -base64 32  # For ADMIN_JWT_SECRET
   openssl rand -base64 32  # For JWT_SECRET
   ```

3. **Feature Flag**
   - Keep `ADMIN_REALM_ENFORCED=false` during initial deployment
   - Test thoroughly before enabling

## 🔄 Rollback Procedure

If issues arise:

```bash
./deploy-admin-separation.sh
# Select option 5 (Rollback)
```

Or manually:

```bash
# Edit .env.production
ADMIN_REALM_ENFORCED=false

# Restart backend
docker-compose restart backend
```

## 📝 Future Enhancements

1. **MFA Implementation**
   - TOTP-based 2FA
   - Hardware key support

2. **SSO Integration**
   - OIDC/SAML support
   - Role mapping from IdP

## 📚 Additional Documentation

For more detailed information, see:
- [ADMIN_AUTH_SEPARATION_GUIDE.md](./ADMIN_AUTH_SEPARATION_GUIDE.md) - Complete deployment guide
- [SECURITY_MONITORING.md](./backend/SECURITY_MONITORING.md) - Security monitoring setup
