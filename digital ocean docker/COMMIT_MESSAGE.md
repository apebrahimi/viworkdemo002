feat(auth): Implement admin/user authentication separation

This commit implements a complete separation between admin and end-user authentication realms,
enhancing security and providing clear separation of concerns.

Key changes:
- Add separate admin database tables (admin_users, admin_sessions, admin_audit_logs)
- Create admin API routes under /admin/api/* namespace
- Implement admin authentication with IP allowlist restrictions
- Add RBAC with three roles: ADMIN, OPERATOR, AUDITOR
- Create admin frontend with secure cookie handling and idle timeout
- Add feature flag (ADMIN_REALM_ENFORCED) for safe rollout
- Update nginx configuration with IP restrictions for admin routes
- Add comprehensive deployment scripts and documentation

Security improvements:
- Admin panel restricted to allowlisted IPs
- Short session timeouts (15 minutes)
- HttpOnly secure cookies for admin auth
- Comprehensive audit logging
- Separate JWT signing keys for admin/user realms

Testing:
- Backend and frontend builds verified
- Local testing with docker-compose.local.yml
- Test script for API verification

Deployment:
- Phased deployment strategy with feature flag
- Rollback procedure documented
- Zero-downtime deployment supported

Documentation:
- README-ADMIN-AUTH.md with implementation details
- ADMIN_AUTH_SEPARATION_GUIDE.md with deployment instructions
- Inline code documentation

Resolves: #security-enhancement-123
