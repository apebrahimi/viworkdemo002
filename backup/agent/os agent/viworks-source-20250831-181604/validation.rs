use crate::error::AgentResult;
use serde_json::Value;
use std::collections::HashSet;
use tracing::{warn, error};

pub struct InputValidator {
    allowed_commands: HashSet<String>,
    max_input_length: usize,
    forbidden_patterns: Vec<String>,
}

impl InputValidator {
    pub fn new() -> Self {
        let mut allowed_commands = HashSet::new();
        allowed_commands.insert("create_user".to_string());
        allowed_commands.insert("delete_user".to_string());
        allowed_commands.insert("create_vpn".to_string());
        allowed_commands.insert("delete_vpn".to_string());
        allowed_commands.insert("system_status".to_string());
        allowed_commands.insert("health_check".to_string());

        Self {
            allowed_commands,
            max_input_length: 1024,
            forbidden_patterns: vec![
                r"<script".to_string(),
                r"javascript:".to_string(),
                r"on\w+\s*=".to_string(),
                r"union\s+select".to_string(),
                r"drop\s+table".to_string(),
                r"delete\s+from".to_string(),
            ],
        }
    }

    pub fn validate_command(&self, command: &str) -> AgentResult<()> {
        if command.is_empty() {
            return Err(crate::error::AgentError::ValidationError("Command cannot be empty".to_string()));
        }

        if command.len() > self.max_input_length {
            return Err(crate::error::AgentError::ValidationError("Command too long".to_string()));
        }

        if !self.allowed_commands.contains(command) {
            warn!("Invalid command attempted: {}", command);
            return Err(crate::error::AgentError::ValidationError("Invalid command".to_string()));
        }

        Ok(())
    }

    pub fn validate_parameters(&self, params: &Value) -> AgentResult<()> {
        let params_str = params.to_string();
        
        if params_str.len() > self.max_input_length {
            return Err(crate::error::AgentError::ValidationError("Parameters too long".to_string()));
        }

        // Check for forbidden patterns
        for pattern in &self.forbidden_patterns {
            if params_str.to_lowercase().contains(&pattern.to_lowercase()) {
                warn!("Forbidden pattern detected in parameters: {}", pattern);
                return Err(crate::error::AgentError::ValidationError("Forbidden pattern detected".to_string()));
            }
        }

        Ok(())
    }

    pub fn sanitize_string(&self, input: &str) -> String {
        // Basic HTML/script tag removal
        let mut sanitized = input.to_string();
        
        // Remove common HTML tags
        sanitized = sanitized.replace("<script>", "").replace("</script>", "");
        sanitized = sanitized.replace("<", "&lt;").replace(">", "&gt;");
        
        // Remove potential SQL injection patterns
        sanitized = sanitized.replace("'", "''");
        sanitized = sanitized.replace(";", "");
        
        sanitized
    }

    pub fn validate_username(&self, username: &str) -> AgentResult<()> {
        if username.is_empty() {
            return Err(crate::error::AgentError::ValidationError("Username cannot be empty".to_string()));
        }

        if username.len() > 50 {
            return Err(crate::error::AgentError::ValidationError("Username too long".to_string()));
        }

        // Only allow alphanumeric characters, hyphens, and underscores
        if !username.chars().all(|c| c.is_alphanumeric() || c == '-' || c == '_') {
            return Err(crate::error::AgentError::ValidationError("Username contains invalid characters".to_string()));
        }

        Ok(())
    }

    pub fn validate_email(&self, email: &str) -> AgentResult<()> {
        if email.is_empty() {
            return Err(crate::error::AgentError::ValidationError("Email cannot be empty".to_string()));
        }

        // Basic email validation
        if !email.contains('@') || !email.contains('.') {
            return Err(crate::error::AgentError::ValidationError("Invalid email format".to_string()));
        }

        Ok(())
    }
}
