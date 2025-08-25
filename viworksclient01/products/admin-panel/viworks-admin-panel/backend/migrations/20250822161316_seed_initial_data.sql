-- Seed initial data for ViWorkS Admin Panel
-- This migration adds sample data for testing and demonstration

-- Insert sample VPN servers
INSERT INTO vpn_servers (name, hostname, ip_address, port, location, max_connections) VALUES
('US-East-1', 'vpn-us-east.viworks.ir', '185.231.180.118', 8445, 'United States - East', 200),
('US-West-1', 'vpn-us-west.viworks.ir', '185.231.180.119', 8445, 'United States - West', 150),
('EU-Central-1', 'vpn-eu-central.viworks.ir', '185.231.180.120', 8445, 'Germany - Frankfurt', 180),
('Asia-Pacific-1', 'vpn-ap-southeast.viworks.ir', '185.231.180.121', 8445, 'Singapore', 120);

-- Insert sample ViWorkS clients
INSERT INTO clients (name, platform, version, status, ip_address, last_seen, connection_count) VALUES
('DESKTOP-ABC123', 'windows', '1.0.0', 'online', '192.168.1.100', NOW() - INTERVAL '5 minutes', 45),
('MacBook-Pro-John', 'macos', '1.0.0', 'online', '192.168.1.101', NOW() - INTERVAL '2 minutes', 23),
('Ubuntu-Server-01', 'linux', '1.0.0', 'offline', '192.168.1.102', NOW() - INTERVAL '1 hour', 67),
('Android-Phone-01', 'android', '1.0.0', 'connecting', '192.168.1.103', NOW() - INTERVAL '30 seconds', 12),
('iPhone-Jane', 'ios', '1.0.0', 'online', '192.168.1.104', NOW() - INTERVAL '1 minute', 34),
('DESKTOP-DEF456', 'windows', '1.0.0', 'error', '192.168.1.105', NOW() - INTERVAL '10 minutes', 8);

-- Insert sample connection logs
INSERT INTO connection_logs (client_id, event_type, ip_address, server_location, duration, bytes_sent, bytes_received, details) VALUES
((SELECT id FROM clients WHERE name = 'DESKTOP-ABC123'), 'connect', '192.168.1.100', 'United States - East', INTERVAL '2 hours 15 minutes', 1048576, 2097152, '{"protocol": "OpenVPN", "cipher": "AES-256-GCM"}'),
((SELECT id FROM clients WHERE name = 'MacBook-Pro-John'), 'connect', '192.168.1.101', 'Germany - Frankfurt', INTERVAL '1 hour 30 minutes', 524288, 1048576, '{"protocol": "OpenVPN", "cipher": "AES-256-GCM"}'),
((SELECT id FROM clients WHERE name = 'Ubuntu-Server-01'), 'disconnect', '192.168.1.102', 'United States - West', INTERVAL '45 minutes', 2097152, 4194304, '{"reason": "user_disconnect"}'),
((SELECT id FROM clients WHERE name = 'Android-Phone-01'), 'connect', '192.168.1.103', 'Singapore', INTERVAL '15 minutes', 262144, 524288, '{"protocol": "OpenVPN", "cipher": "AES-256-GCM"}'),
((SELECT id FROM clients WHERE name = 'iPhone-Jane'), 'connect', '192.168.1.104', 'United States - East', INTERVAL '30 minutes', 131072, 262144, '{"protocol": "OpenVPN", "cipher": "AES-256-GCM"}'),
((SELECT id FROM clients WHERE name = 'DESKTOP-DEF456'), 'error', '192.168.1.105', NULL, NULL, 0, 0, '{"error": "authentication_failed", "details": "Invalid credentials"}');

-- Insert sample security alerts
INSERT INTO security_alerts (severity, title, description, client_id, is_resolved) VALUES
('high', 'Multiple failed authentication attempts', 'Client DESKTOP-DEF456 has attempted to connect 5 times with invalid credentials', (SELECT id FROM clients WHERE name = 'DESKTOP-DEF456'), false),
('medium', 'Unusual connection pattern detected', 'Client MacBook-Pro-John connected from a new IP address', (SELECT id FROM clients WHERE name = 'MacBook-Pro-John'), true),
('low', 'Client version outdated', 'Client Ubuntu-Server-01 is running an outdated version (0.9.5)', (SELECT id FROM clients WHERE name = 'Ubuntu-Server-01'), false),
('critical', 'Suspicious network activity', 'Large data transfer detected from client DESKTOP-ABC123', (SELECT id FROM clients WHERE name = 'DESKTOP-ABC123'), false);

-- Insert sample audit logs
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address) VALUES
((SELECT id FROM users WHERE username = 'admin'), 'login', 'user', (SELECT id FROM users WHERE username = 'admin'), '{"method": "password", "success": true}', '192.168.1.50'),
((SELECT id FROM users WHERE username = 'admin'), 'view_clients', 'clients', NULL, '{"filter": "all", "count": 6}', '192.168.1.50'),
((SELECT id FROM users WHERE username = 'admin'), 'view_alerts', 'alerts', NULL, '{"filter": "unresolved", "count": 3}', '192.168.1.50'),
((SELECT id FROM users WHERE username = 'admin'), 'update_client_status', 'client', (SELECT id FROM clients WHERE name = 'DESKTOP-ABC123'), '{"old_status": "connecting", "new_status": "online"}', '192.168.1.50');

-- Update VPN server current connections
UPDATE vpn_servers SET current_connections = 2 WHERE name = 'US-East-1';
UPDATE vpn_servers SET current_connections = 1 WHERE name = 'EU-Central-1';
UPDATE vpn_servers SET current_connections = 1 WHERE name = 'Asia-Pacific-1';
UPDATE vpn_servers SET current_connections = 0 WHERE name = 'US-West-1';
