use crate::security_monitoring::SecurityEvent;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

/// Role-Based Access Control (RBAC) roles for admin panel
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum AdminRole {
    Owner,           // Super Admin - Full access
    OrgAdmin,        // Organization Admin - User/Policy management
    SecurityAdmin,   // Security Admin - Security policies and monitoring
    SecurityAnalyst, // Security Analyst - Read/Action on security events
    Helpdesk,        // Helpdesk - Limited user management
    Auditor,         // Auditor - Read-only access to reports
    ApiService,      // API Service - Machine-to-machine access
}

/// User status for admin panel users
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum UserStatus {
    Active,
    Locked,
    Disabled,
    PendingMfa,
}

/// VPN user status
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum VpnUserStatus {
    Active,
    Suspended,
    Revoked,
    Expired,
}

/// Session status
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum SessionStatus {
    Active,
    Disconnected,
    Terminated,
    Quarantined,
}

/// Policy types for access control
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum PolicyType {
    TimeBased,      // Time-based access restrictions
    GeoBased,       // Geographic restrictions
    IpBased,        // IP-based restrictions
    DeviceBased,    // Device binding
    Concurrent,     // Concurrent session limits
    IdleTimeout,    // Idle timeout policies
}

/// Admin panel user
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AdminUser {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub role: AdminRole,
    pub status: UserStatus,
    pub mfa_enabled: bool,
    pub mfa_method: Option<String>,
    pub groups: Vec<String>,
    pub last_login: Option<DateTime<Utc>>,
    pub failed_attempts: u32,
    pub locked_until: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// VPN user identity
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VpnUser {
    pub id: Uuid,
    pub username: String,
    pub email: Option<String>,
    pub status: VpnUserStatus,
    pub policy_id: Option<Uuid>,
    pub groups: Vec<String>,
    pub concurrent_sessions_limit: u32,
    pub idle_timeout_minutes: u32,
    pub last_activity: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// Active session information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    pub id: Uuid,
    pub user_id: Uuid,
    pub username: String,
    pub node_id: String,
    pub client_ip: String,
    pub internal_ip: Option<String>,
    pub status: SessionStatus,
    pub started_at: DateTime<Utc>,
    pub last_activity: DateTime<Utc>,
    pub client_version: String,
    pub user_agent: String,
    pub termination_reason: Option<String>,
}

/// Access policy definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Policy {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub policy_type: PolicyType,
    pub rules: HashMap<String, serde_json::Value>,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// Node/Gateway information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Node {
    pub id: String,
    pub name: String,
    pub hostname: String,
    pub ip_address: String,
    pub status: NodeStatus,
    pub capacity: NodeCapacity,
    pub version: String,
    pub last_health_check: DateTime<Utc>,
}

/// Node status
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum NodeStatus {
    Healthy,
    Warning,
    Critical,
    Offline,
    Maintenance,
}

/// Node capacity information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NodeCapacity {
    pub max_sessions: u32,
    pub current_sessions: u32,
    pub cpu_usage: f64,
    pub memory_usage: f64,
    pub disk_usage: f64,
}

/// Audit event for compliance
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditEvent {
    pub id: Uuid,
    pub timestamp: DateTime<Utc>,
    pub actor_id: Uuid,
    pub actor_username: String,
    pub action: String,
    pub target_type: String,
    pub target_id: Option<String>,
    pub details: HashMap<String, serde_json::Value>,
    pub ip_address: String,
    pub user_agent: String,
    pub result: AuditResult,
    pub hash_chain_prev: Option<String>,
}

/// Audit result
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum AuditResult {
    Success,
    Failure,
    Partial,
}

/// Admin panel statistics
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AdminStats {
    pub total_admin_users: u32,
    pub total_vpn_users: u32,
    pub active_sessions: u32,
    pub total_nodes: u32,
    pub healthy_nodes: u32,
    pub security_alerts: u32,
    pub policies_count: u32,
}

/// Admin panel manager
pub struct AdminPanel {
    users: HashMap<Uuid, AdminUser>,
    vpn_users: HashMap<Uuid, VpnUser>,
    sessions: HashMap<Uuid, Session>,
    policies: HashMap<Uuid, Policy>,
    nodes: HashMap<String, Node>,
    audit_events: Vec<AuditEvent>,
}

impl AdminPanel {
    /// Create a new admin panel instance
    pub fn new() -> Self {
        Self {
            users: HashMap::new(),
            vpn_users: HashMap::new(),
            sessions: HashMap::new(),
            policies: HashMap::new(),
            nodes: HashMap::new(),
            audit_events: Vec::new(),
        }
    }

    /// Create a new admin user
    pub fn create_admin_user(
        &mut self,
        username: String,
        email: String,
        role: AdminRole,
    ) -> Result<Uuid, String> {
        let user_id = Uuid::new_v4();
        let now = Utc::now();
        
        let user = AdminUser {
            id: user_id,
            username: username.clone(),
            email,
            role,
            status: UserStatus::Active,
            mfa_enabled: false,
            mfa_method: None,
            groups: Vec::new(),
            last_login: None,
            failed_attempts: 0,
            locked_until: None,
            created_at: now,
            updated_at: now,
        };

        self.users.insert(user_id, user);
        
        // Log audit event
        self.log_audit_event(
            user_id,
            "create_admin_user",
            "AdminUser",
            Some(username),
            HashMap::new(),
            "127.0.0.1",
            "AdminPanel",
            AuditResult::Success,
        );

        Ok(user_id)
    }

    /// Create a new VPN user
    pub fn create_vpn_user(
        &mut self,
        username: String,
        email: Option<String>,
        policy_id: Option<Uuid>,
    ) -> Result<Uuid, String> {
        let user_id = Uuid::new_v4();
        let now = Utc::now();
        
        let vpn_user = VpnUser {
            id: user_id,
            username: username.clone(),
            email,
            status: VpnUserStatus::Active,
            policy_id,
            groups: Vec::new(),
            concurrent_sessions_limit: 1,
            idle_timeout_minutes: 30,
            last_activity: None,
            created_at: now,
            updated_at: now,
        };

        self.vpn_users.insert(user_id, vpn_user);
        
        // Log audit event
        self.log_audit_event(
            user_id,
            "create_vpn_user",
            "VpnUser",
            Some(username),
            HashMap::new(),
            "127.0.0.1",
            "AdminPanel",
            AuditResult::Success,
        );

        Ok(user_id)
    }

    /// Get admin panel statistics
    pub fn get_stats(&self) -> AdminStats {
        let healthy_nodes = self.nodes.values()
            .filter(|node| node.status == NodeStatus::Healthy)
            .count() as u32;

        AdminStats {
            total_admin_users: self.users.len() as u32,
            total_vpn_users: self.vpn_users.len() as u32,
            active_sessions: self.sessions.values()
                .filter(|session| session.status == SessionStatus::Active)
                .count() as u32,
            total_nodes: self.nodes.len() as u32,
            healthy_nodes,
            security_alerts: 0, // TODO: Integrate with security monitoring
            policies_count: self.policies.len() as u32,
        }
    }

    /// Get all active sessions
    pub fn get_active_sessions(&self) -> Vec<&Session> {
        self.sessions.values()
            .filter(|session| session.status == SessionStatus::Active)
            .collect()
    }

    /// Terminate a session
    pub fn terminate_session(
        &mut self,
        session_id: Uuid,
        reason: String,
        actor_id: Uuid,
    ) -> Result<(), String> {
        if let Some(session) = self.sessions.get_mut(&session_id) {
            session.status = SessionStatus::Terminated;
            session.termination_reason = Some(reason.clone());
            
            // Log audit event
            self.log_audit_event(
                actor_id,
                "terminate_session",
                "Session",
                Some(session_id.to_string()),
                {
                    let mut details = HashMap::new();
                    details.insert("reason".to_string(), serde_json::Value::String(reason));
                    details.insert("username".to_string(), serde_json::Value::String(session.username.clone()));
                    details
                },
                "127.0.0.1",
                "AdminPanel",
                AuditResult::Success,
            );
            
            Ok(())
        } else {
            Err("Session not found".to_string())
        }
    }

    /// Quarantine a user
    pub fn quarantine_user(
        &mut self,
        user_id: Uuid,
        reason: String,
        actor_id: Uuid,
    ) -> Result<(), String> {
        // Terminate all active sessions for the user
        for session in self.sessions.values_mut() {
            if session.user_id == user_id && session.status == SessionStatus::Active {
                session.status = SessionStatus::Quarantined;
                session.termination_reason = Some("User quarantined".to_string());
            }
        }

        // Update VPN user status
        if let Some(vpn_user) = self.vpn_users.get_mut(&user_id) {
            vpn_user.status = VpnUserStatus::Suspended;
            vpn_user.updated_at = Utc::now();
        }

        // Log audit event
        self.log_audit_event(
            actor_id,
            "quarantine_user",
            "VpnUser",
            Some(user_id.to_string()),
            {
                let mut details = HashMap::new();
                details.insert("reason".to_string(), serde_json::Value::String(reason));
                details
            },
            "127.0.0.1",
            "AdminPanel",
            AuditResult::Success,
        );

        Ok(())
    }

    /// Log audit event
    fn log_audit_event(
        &mut self,
        actor_id: Uuid,
        action: &str,
        target_type: &str,
        target_id: Option<String>,
        details: HashMap<String, serde_json::Value>,
        ip_address: &str,
        user_agent: &str,
        result: AuditResult,
    ) {
        let event = AuditEvent {
            id: Uuid::new_v4(),
            timestamp: Utc::now(),
            actor_id,
            actor_username: "admin".to_string(), // TODO: Get from context
            action: action.to_string(),
            target_type: target_type.to_string(),
            target_id,
            details,
            ip_address: ip_address.to_string(),
            user_agent: user_agent.to_string(),
            result,
            hash_chain_prev: None, // TODO: Implement hash chain
        };

        self.audit_events.push(event);
    }

    /// Get audit events with filtering
    pub fn get_audit_events(
        &self,
        limit: Option<usize>,
        actor_id: Option<Uuid>,
        action: Option<String>,
    ) -> Vec<&AuditEvent> {
        let mut events: Vec<&AuditEvent> = self.audit_events.iter().collect();
        
        // Sort by timestamp (newest first)
        events.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
        
        // Apply filters
        if let Some(actor) = actor_id {
            events.retain(|event| event.actor_id == actor);
        }
        
        if let Some(action_filter) = action {
            events.retain(|event| event.action == action_filter);
        }
        
        // Apply limit
        if let Some(limit_count) = limit {
            events.truncate(limit_count);
        }
        
        events
    }

    /// Check if user has permission for action
    pub fn has_permission(&self, user_id: Uuid, action: &str) -> bool {
        if let Some(user) = self.users.get(&user_id) {
            match user.role {
                AdminRole::Owner => true, // Owner has all permissions
                AdminRole::OrgAdmin => {
                    matches!(action, 
                        "create_admin_user" | "create_vpn_user" | "manage_policies" |
                        "view_sessions" | "terminate_session" | "view_reports"
                    )
                },
                AdminRole::SecurityAdmin => {
                    matches!(action,
                        "manage_security_policies" | "quarantine_user" | "view_security_events" |
                        "manage_mfa" | "view_audit_logs"
                    )
                },
                AdminRole::SecurityAnalyst => {
                    matches!(action,
                        "view_sessions" | "terminate_session" | "view_security_events" |
                        "acknowledge_alerts"
                    )
                },
                AdminRole::Helpdesk => {
                    matches!(action,
                        "reset_user_password" | "view_connection_status" | "view_basic_reports"
                    )
                },
                AdminRole::Auditor => {
                    matches!(action,
                        "view_reports" | "view_audit_logs" | "export_data"
                    )
                },
                AdminRole::ApiService => {
                    matches!(action,
                        "api_read" | "api_write" | "api_metrics"
                    )
                },
            }
        } else {
            false
        }
    }
}

impl Default for AdminPanel {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_admin_user() {
        let mut panel = AdminPanel::new();
        let user_id = panel.create_admin_user(
            "admin".to_string(),
            "admin@example.com".to_string(),
            AdminRole::Owner,
        ).unwrap();

        assert!(panel.users.contains_key(&user_id));
        assert_eq!(panel.users.len(), 1);
    }

    #[test]
    fn test_create_vpn_user() {
        let mut panel = AdminPanel::new();
        let vpn_user_id = panel.create_vpn_user(
            "vpnuser".to_string(),
            Some("vpn@example.com".to_string()),
            None,
        ).unwrap();

        assert!(panel.vpn_users.contains_key(&vpn_user_id));
        assert_eq!(panel.vpn_users.len(), 1);
    }

    #[test]
    fn test_permissions() {
        let mut panel = AdminPanel::new();
        let owner_id = panel.create_admin_user(
            "owner".to_string(),
            "owner@example.com".to_string(),
            AdminRole::Owner,
        ).unwrap();

        let analyst_id = panel.create_admin_user(
            "analyst".to_string(),
            "analyst@example.com".to_string(),
            AdminRole::SecurityAnalyst,
        ).unwrap();

        assert!(panel.has_permission(owner_id, "any_action"));
        assert!(panel.has_permission(analyst_id, "view_sessions"));
        assert!(!panel.has_permission(analyst_id, "create_admin_user"));
    }
}
