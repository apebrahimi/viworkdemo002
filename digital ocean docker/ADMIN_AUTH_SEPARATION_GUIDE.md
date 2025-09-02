# ViWorkS Admin Authentication Separation - Deployment Guide

## 🎯 Overview

This guide covers the implementation and deployment of separated authentication realms for admin and end-user access in the ViWorkS platform. The separation ensures that admin panel access is completely isolated from user authentication, with network-level restrictions and enhanced security.

## 🏗️ Architecture

### Authentication Realms

1. **Admin Realm** (`/admin/api/*`)
   - Separate JWT signing keys
   - Separate session management
   - IP allowlist enforcement
   - Short session timeouts (15 minutes)
   - Comprehensive audit logging
   - RBAC with three roles: ADMIN, OPERATOR, AUDITOR

2. **User Realm** (`/api/v1/*`)
   - Existing authentication system
   - Mobile/Desktop client support
   - OTP-based 2FA
   - Device binding

### Security Layers

```
Internet → Nginx (SSL/IP Filter) → Backend (Auth Middleware) → Database (Separate Tables)
```

## 📋 Pre-Deployment Checklist

- [ ] Database backup completed
- [ ] Current configuration backed up
- [ ] Admin IP addresses identified
- [ ] JWT secrets generated (32+ characters)
- [ ] SSL certificates valid
- [ ] Docker and Docker Compose installed
- [ ] DigitalOcean firewall rules reviewed

## 🚀 Deployment Phases

### Phase A: Database Migration (No Downtime)

```bash
# Run the deployment script
./deploy-admin-separation.sh

# Select Phase 1
# This adds admin tables without affecting existing data
```

**What happens:**
- Creates `admin_users` table
- Creates `admin_sessions` table
- Creates `admin_audit_logs` table
- Seeds default admin account
- No impact on existing users

### Phase B: Backend Deployment (Feature Flag OFF)

```bash
# Run Phase 2
./deploy-admin-separation.sh

# This deploys new code but keeps legacy auth active
```

**What happens:**
- New backend with admin modules deployed
- Feature flag `ADMIN_REALM_ENFORCED=false`
- Legacy authentication still active
- No user-facing changes

### Phase C: Enable Admin Realm (Gradual Rollout)

```bash
# Run Phase 3
./deploy-admin-separation.sh

# Enables admin separation with IP restrictions
```

**What happens:**
- Feature flag `ADMIN_REALM_ENFORCED=true`
- Admin panel IP restricted
- Admin API requires separate authentication
- User authentication unchanged

### Phase D: Full Production Deployment

```bash
# Run Phase 4 after testing
./deploy-admin-separation.sh
```

## 🔐 Security Configuration

### Environment Variables

```env
# Admin JWT Configuration (MUST be different from user JWT!)
ADMIN_JWT_SECRET=<generate-with-openssl-rand-base64-32>
ADMIN_JWT_EXPIRATION=900  # 15 minutes
ADMIN_SESSION_TIMEOUT=900  # 15 minutes idle timeout

# IP Allowlist (comma-separated CIDR ranges)
ADMIN_IP_ALLOWLIST=10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,YOUR_OFFICE_IP/32

# Feature Flag
ADMIN_REALM_ENFORCED=false  # Set to true when ready
```

### Nginx IP Restrictions

Edit `nginx/nginx-admin-separated.conf`:

```nginx
geo $admin_allowed {
    default 0;
    10.0.0.0/8 1;        # Private networks
    172.16.0.0/12 1;
    192.168.0.0/16 1;
    YOUR_OFFICE_IP/32 1;  # Add your specific IPs
    YOUR_VPN_SUBNET/24 1;
}
```

### Default Admin Credentials

⚠️ **CHANGE IMMEDIATELY AFTER DEPLOYMENT**

```
Username: admin
Password: AdminP@ss2024!
Email: admin@viworks.local
```

## 🔄 Rollback Procedure

If issues arise, rollback is immediate:

```bash
# Option 1: Use deployment script
./deploy-admin-separation.sh
# Select option 5 (Rollback)

# Option 2: Manual rollback
sed -i 's/ADMIN_REALM_ENFORCED=true/ADMIN_REALM_ENFORCED=false/' .env.production
docker-compose up -d backend
```

## 📊 Monitoring & Verification

### Health Checks

```bash
# Backend health
curl https://api-viworks.neuratalent.com/health

# Admin API health (requires allowed IP)
curl https://api-viworks.neuratalent.com/admin/api/health

# Check feature flag status
curl https://api-viworks.neuratalent.com/health | jq .admin_realm_enabled
```

### Audit Logs

```bash
# View admin access logs
docker-compose exec nginx tail -f /var/log/nginx/admin-access.log

# View admin API logs
docker-compose exec nginx tail -f /var/log/nginx/admin-api.log

# Query audit events in database
docker-compose exec postgres psql -U postgres -d viworks_admin -c \
  "SELECT * FROM admin_audit_logs ORDER BY created_at DESC LIMIT 10;"
```

### Testing Admin Access

```bash
# Test from allowed IP
curl -X POST https://api-viworks.neuratalent.com/admin/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"AdminP@ss2024!"}'

# Test from non-allowed IP (should fail)
curl -X POST https://api-viworks.neuratalent.com/admin/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: 8.8.8.8" \
  -d '{"username":"admin","password":"AdminP@ss2024!"}'
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Admin login returns 403 Forbidden
- **Cause**: IP not in allowlist
- **Solution**: Add your IP to `ADMIN_IP_ALLOWLIST` and nginx config

#### 2. Feature flag not taking effect
- **Cause**: Database flag overriding environment
- **Solution**: Update database flag:
```sql
UPDATE feature_flags SET enabled = true WHERE name = 'ADMIN_REALM_ENFORCED';
```

#### 3. Session expires too quickly
- **Cause**: Idle timeout too short
- **Solution**: Increase `ADMIN_SESSION_TIMEOUT` in environment

#### 4. Cannot access admin panel
- **Cause**: nginx IP restriction
- **Solution**: Check nginx logs and verify IP allowlist

### Debug Commands

```bash
# Check current configuration
docker-compose exec backend env | grep ADMIN

# View backend logs
docker-compose logs -f backend

# Check nginx configuration
docker-compose exec nginx nginx -T | grep admin_allowed

# Database connection test
docker-compose exec backend psql $DATABASE_URL -c "SELECT 1"

# List admin users
docker-compose exec postgres psql -U postgres -d viworks_admin -c \
  "SELECT username, role, is_active, last_login_at FROM admin_users;"
```

## 📈 Post-Deployment Tasks

1. **Change default admin password**
```bash
# Use the admin panel or API to change password
curl -X POST https://api-viworks.neuratalent.com/admin/api/auth/change-password \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"current_password":"AdminP@ss2024!","new_password":"<new-strong-password>"}'
```

2. **Create additional admin users**
```bash
# Create operator user
curl -X POST https://api-viworks.neuratalent.com/admin/api/admins \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username":"operator1",
    "email":"operator@company.com",
    "password":"<strong-password>",
    "role":"OPERATOR"
  }'
```

3. **Configure monitoring alerts**
- Set up alerts for failed admin login attempts
- Monitor admin session creation/termination
- Track privilege escalation events

4. **Review audit logs regularly**
```sql
-- Daily admin activity summary
SELECT 
  DATE(created_at) as date,
  action,
  COUNT(*) as count,
  COUNT(DISTINCT admin_user_id) as unique_admins
FROM admin_audit_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at), action
ORDER BY date DESC, count DESC;
```

## 🔮 Future Enhancements

### Phase 2: MFA Implementation
- TOTP-based 2FA for admin accounts
- Hardware key support (FIDO2/WebAuthn)
- Backup codes

### Phase 3: SSO Integration
- OIDC/SAML support
- Active Directory integration
- Role mapping from IdP

### Phase 4: Advanced Security
- Client certificate authentication (mTLS)
- Geo-fencing
- Behavioral analytics
- Session recording

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review audit logs for error details
3. Contact the DevOps team with:
   - Error messages
   - Timestamp of issue
   - IP address attempting access
   - Relevant log excerpts

## 📝 Change Log

| Date | Version | Changes |
|------|---------|---------|
| 2024-01-XX | 1.0.0 | Initial admin/user auth separation |
| TBD | 1.1.0 | MFA implementation |
| TBD | 1.2.0 | SSO integration |

---

**Security Notice**: This document contains sensitive configuration details. Ensure it's stored securely and not committed to public repositories with actual IP addresses or secrets.
