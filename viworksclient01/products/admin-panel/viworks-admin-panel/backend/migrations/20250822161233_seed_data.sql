-- Seed data for ViWorkS Admin Panel
-- This script should be run after the initial schema migration

-- Insert additional admin users (password: admin123)
-- The password hash is generated using bcrypt with cost 12
INSERT INTO users (username, email, password_hash, role, is_active, created_at, updated_at) VALUES
('security_admin', 'security@viworks.local', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', 'security_admin', true, NOW(), NOW()),
('analyst', 'analyst@viworks.local', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', 'security_analyst', true, NOW(), NOW())
;

-- Insert sample VPN servers
INSERT INTO vpn_servers (name, hostname, ip_address, port, location, is_active, max_connections) VALUES
('US-East-1', 'vpn-us-east.viworks.local', '10.0.1.1', 1194, 'US East', true, 100),
('US-West-1', 'vpn-us-west.viworks.local', '10.0.2.1', 1194, 'US West', true, 100),
('EU-Central-1', 'vpn-eu-central.viworks.local', '10.0.3.1', 1194, 'Europe Central', true, 100),
('AP-Southeast-1', 'vpn-ap-southeast.viworks.local', '10.0.4.1', 1194, 'Asia Pacific Southeast', true, 100)
;

-- Insert sample clients for testing
INSERT INTO clients (name, platform, version, status, ip_address, mac_address, connection_count) VALUES
('Test-Windows-Client', 'windows', '1.0.0', 'offline', '192.168.1.100', '00:11:22:33:44:55', 0),
('Test-Linux-Client', 'linux', '1.0.0', 'offline', '192.168.1.101', '00:11:22:33:44:56', 0),
('Test-MacOS-Client', 'macos', '1.0.0', 'offline', '192.168.1.102', '00:11:22:33:44:57', 0),
('Test-Android-Client', 'android', '1.0.0', 'offline', '192.168.1.103', '00:11:22:33:44:58', 0)
;

-- Insert sample security alerts
INSERT INTO security_alerts (severity, title, description, is_resolved, created_at, updated_at) VALUES
('high', 'Multiple failed login attempts detected', 'User admin has failed to login 5 times in the last 10 minutes', false, NOW(), NOW()),
('medium', 'Unusual connection pattern detected', 'Client Test-Windows-Client connected from an unusual location', false, NOW(), NOW()),
('low', 'System maintenance scheduled', 'Scheduled maintenance window starting in 2 hours', true, NOW(), NOW()),
('critical', 'VPN server down', 'VPN server US-East-1 is not responding to health checks', false, NOW(), NOW());

-- Insert sample audit logs
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address, user_agent, created_at) VALUES
((SELECT id FROM users WHERE username = 'admin' LIMIT 1), 'user_login', 'user', (SELECT id FROM users WHERE username = 'admin' LIMIT 1), '{"success": true, "method": "password"}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW()),
((SELECT id FROM users WHERE username = 'admin' LIMIT 1), 'user_created', 'user', (SELECT id FROM users WHERE username = 'security_admin' LIMIT 1), '{"username": "security_admin", "role": "security_admin"}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW()),
((SELECT id FROM users WHERE username = 'admin' LIMIT 1), 'client_created', 'client', (SELECT id FROM clients WHERE name = 'Test-Windows-Client' LIMIT 1), '{"name": "Test-Windows-Client", "platform": "windows"}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW()),
((SELECT id FROM users WHERE username = 'admin' LIMIT 1), 'system_setting_updated', 'system_setting', NULL, '{"key": "session_timeout_minutes", "old_value": "30", "new_value": "60"}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW());