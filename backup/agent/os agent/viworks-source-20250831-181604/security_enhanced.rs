use crate::error::AgentResult;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use tracing::{info, warn, error};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub username: String,
    pub roles: Vec<String>,
    pub permissions: Vec<String>,
    pub is_active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecurityPolicy {
    pub require_authentication: bool,
    pub require_authorization: bool,
    pub allowed_ips: Vec<String>,
    pub max_failed_attempts: u32,
    pub session_timeout_seconds: u64,
}

pub struct EnhancedSecurityContext {
    users: Arc<RwLock<HashMap<String, User>>>,
    policy: SecurityPolicy,
    failed_attempts: Arc<RwLock<HashMap<String, u32>>>,
}

impl EnhancedSecurityContext {
    pub fn new(policy: SecurityPolicy) -> Self {
        Self {
            users: Arc::new(RwLock::new(HashMap::new())),
            policy,
            failed_attempts: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    pub async fn authenticate(&self, username: &str, password: &str) -> AgentResult<Option<User>> {
        // Implement proper authentication logic here
        // This is a placeholder - replace with actual authentication
        let users = self.users.read().await;
        if let Some(user) = users.get(username) {
            if user.is_active {
                info!("User {} authenticated successfully", username);
                Ok(Some(user.clone()))
            } else {
                warn!("User {} is inactive", username);
                Ok(None)
            }
        } else {
            warn!("Authentication failed for user {}", username);
            Ok(None)
        }
    }

    pub async fn authorize(&self, user: &User, resource: &str, action: &str) -> AgentResult<bool> {
        // Implement proper authorization logic here
        // This is a placeholder - replace with actual authorization
        let required_permission = format!("{}:{}", resource, action);
        
        if user.permissions.contains(&required_permission) {
            info!("User {} authorized for {}:{}", user.username, resource, action);
            Ok(true)
        } else {
            warn!("User {} not authorized for {}:{}", user.username, resource, action);
            Ok(false)
        }
    }

    pub async fn is_ip_allowed(&self, ip: &str) -> bool {
        if !self.policy.require_authentication {
            return true;
        }
        
        self.policy.allowed_ips.contains(&ip.to_string())
    }

    pub async fn record_failed_attempt(&self, ip: &str) {
        let mut attempts = self.failed_attempts.write().await;
        let count = attempts.entry(ip.to_string()).or_insert(0);
        *count += 1;
        
        if *count >= self.policy.max_failed_attempts {
            warn!("IP {} blocked due to too many failed attempts", ip);
        }
    }

    pub async fn is_ip_blocked(&self, ip: &str) -> bool {
        let attempts = self.failed_attempts.read().await;
        attempts.get(ip).map_or(false, |&count| count >= self.policy.max_failed_attempts)
    }
}
