-- ViWorkS Admin Panel - Admin Authentication Separation
-- Migration: 002_admin_auth_separation.sql
-- Description: Adds admin-specific authentication tables and audit logging
-- This migration is ADDITIVE ONLY - no breaking changes to existing tables

-- ============================================================================
-- ADMIN AUTHENTICATION TABLES
-- ============================================================================

-- Admin users table (completely separate from regular users)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'OPERATOR' CHECK (role IN ('ADMIN', 'OPERATOR', 'AUDITOR')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    ip_allowlist TEXT[], -- Array of CIDR ranges
    session_timeout_minutes INTEGER DEFAULT 15,
    require_ip_allowlist BOOLEAN DEFAULT true,
    mfa_enabled BOOLEAN DEFAULT false, -- For future MFA implementation
    mfa_secret VARCHAR(255) -- For future TOTP implementation
);

-- Admin sessions table (separate from user sessions)
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    refresh_token_hash VARCHAR(255) UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    idle_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_revoked BOOLEAN DEFAULT false,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_reason TEXT
);

-- Admin audit logs table (comprehensive logging)
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50), -- 'user', 'session', 'policy', 'system', etc.
    target_id VARCHAR(255),
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin role permissions table (for RBAC)
CREATE TABLE IF NOT EXISTS admin_role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(50) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role, resource, action)
);

-- Admin password reset tokens
CREATE TABLE IF NOT EXISTS admin_password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_hash ON admin_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_is_revoked ON admin_sessions(is_revoked);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_user_id ON admin_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON admin_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target_type ON admin_audit_logs(target_type);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update trigger for admin_users
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DEFAULT RBAC PERMISSIONS
-- ============================================================================

-- Admin role permissions (full access)
INSERT INTO admin_role_permissions (role, resource, action) VALUES
    ('ADMIN', 'users', 'create'),
    ('ADMIN', 'users', 'read'),
    ('ADMIN', 'users', 'update'),
    ('ADMIN', 'users', 'delete'),
    ('ADMIN', 'sessions', 'read'),
    ('ADMIN', 'sessions', 'terminate'),
    ('ADMIN', 'policies', 'create'),
    ('ADMIN', 'policies', 'read'),
    ('ADMIN', 'policies', 'update'),
    ('ADMIN', 'policies', 'delete'),
    ('ADMIN', 'audit', 'read'),
    ('ADMIN', 'system', 'manage'),
    ('ADMIN', 'admin_users', 'create'),
    ('ADMIN', 'admin_users', 'read'),
    ('ADMIN', 'admin_users', 'update'),
    ('ADMIN', 'admin_users', 'delete');

-- Operator role permissions (limited management)
INSERT INTO admin_role_permissions (role, resource, action) VALUES
    ('OPERATOR', 'users', 'create'),
    ('OPERATOR', 'users', 'read'),
    ('OPERATOR', 'users', 'update'),
    ('OPERATOR', 'sessions', 'read'),
    ('OPERATOR', 'sessions', 'terminate'),
    ('OPERATOR', 'policies', 'read'),
    ('OPERATOR', 'audit', 'read');

-- Auditor role permissions (read-only)
INSERT INTO admin_role_permissions (role, resource, action) VALUES
    ('AUDITOR', 'users', 'read'),
    ('AUDITOR', 'sessions', 'read'),
    ('AUDITOR', 'policies', 'read'),
    ('AUDITOR', 'audit', 'read'),
    ('AUDITOR', 'admin_users', 'read');

-- ============================================================================
-- SEED INITIAL ADMIN USER
-- ============================================================================

-- Create break-glass admin account
-- Password: AdminP@ss2024! (CHANGE THIS IMMEDIATELY)
-- bcrypt hash generated with cost 12
INSERT INTO admin_users (
    username, 
    email, 
    password_hash, 
    role, 
    is_active,
    ip_allowlist,
    session_timeout_minutes,
    require_ip_allowlist
) VALUES (
    'admin',
    'admin@viworks.local',
    '$2b$12$K3XjCGFPX7pLRV7M3Q9Xm.YJqXhMzRqvGXoKpLKJqRHXHZDGKFWPy', -- AdminP@ss2024!
    'ADMIN',
    true,
    ARRAY['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '127.0.0.1/32'],
    15,
    false -- Initially disabled for testing, enable in production
) ON CONFLICT (username) DO NOTHING;

-- ============================================================================
-- FEATURE FLAG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    enabled BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add admin realm feature flag
INSERT INTO feature_flags (name, enabled, description) VALUES
    ('ADMIN_REALM_ENFORCED', false, 'Enable separated admin authentication realm')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE admin_users IS 'Separate authentication table for admin panel users';
COMMENT ON TABLE admin_sessions IS 'Active sessions for admin users with idle timeout tracking';
COMMENT ON TABLE admin_audit_logs IS 'Comprehensive audit trail for all admin actions';
COMMENT ON TABLE admin_role_permissions IS 'RBAC permission matrix for admin roles';
COMMENT ON COLUMN admin_users.role IS 'Admin role: ADMIN (full access), OPERATOR (limited management), AUDITOR (read-only)';
COMMENT ON COLUMN admin_users.ip_allowlist IS 'CIDR ranges from which this admin can login';
COMMENT ON COLUMN admin_sessions.idle_expires_at IS 'Session expires if no activity before this time';
