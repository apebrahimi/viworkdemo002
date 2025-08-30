use crate::{Result, ViWorksError};
use std::sync::atomic::{AtomicU32, Ordering};
use std::time::{Duration, Instant};
use zeroize::Zeroize;

/// Secure memory allocator for sensitive data
pub struct SecureAllocator;

impl SecureAllocator {
    /// Allocate secure memory that will be zeroized on drop
    pub fn allocate_secure<T: Zeroize>(data: T) -> SecureBox<T> {
        SecureBox::new(data)
    }

    /// Allocate secure memory for bytes
    pub fn allocate_bytes(data: Vec<u8>) -> SecureBytes {
        SecureBytes::new(data)
    }
}

/// Secure box that zeroizes contents on drop
pub struct SecureBox<T: Zeroize> {
    data: T,
}

impl<T: Zeroize> SecureBox<T> {
    pub fn new(data: T) -> Self {
        Self { data }
    }

    pub fn into_inner(mut self) -> T {
        // Create a temporary copy to avoid moving out of Drop
        let data = std::mem::replace(&mut self.data, unsafe { std::mem::zeroed() });
        std::mem::forget(self); // Prevent Drop from being called
        data
    }

    pub fn as_ref(&self) -> &T {
        &self.data
    }

    pub fn as_mut(&mut self) -> &mut T {
        &mut self.data
    }
}

impl<T: Zeroize> Drop for SecureBox<T> {
    fn drop(&mut self) {
        self.data.zeroize();
    }
}

/// Secure bytes container
pub struct SecureBytes {
    data: Vec<u8>,
}

impl SecureBytes {
    pub fn new(data: Vec<u8>) -> Self {
        Self { data }
    }

    pub fn as_slice(&self) -> &[u8] {
        &self.data
    }

    pub fn as_mut_slice(&mut self) -> &mut [u8] {
        &mut self.data
    }

    pub fn into_inner(mut self) -> Vec<u8> {
        // Create a temporary copy to avoid moving out of Drop
        let data = std::mem::replace(&mut self.data, Vec::new());
        std::mem::forget(self); // Prevent Drop from being called
        data
    }
}

impl Zeroize for SecureBytes {
    fn zeroize(&mut self) {
        self.data.zeroize();
    }
}

impl Drop for SecureBytes {
    fn drop(&mut self) {
        self.zeroize();
    }
}

/// Rate limiting for security operations
pub struct RateLimiter {
    attempts: AtomicU32,
    last_attempt: std::sync::Mutex<Option<Instant>>,
    max_attempts: u32,
    lockout_duration: Duration,
}

impl RateLimiter {
    pub fn new(max_attempts: u32, lockout_duration: Duration) -> Self {
        Self {
            attempts: AtomicU32::new(0),
            last_attempt: std::sync::Mutex::new(None),
            max_attempts,
            lockout_duration,
        }
    }

    pub fn check_allowed(&self) -> Result<()> {
        let attempts = self.attempts.load(Ordering::Relaxed);
        
        if attempts >= self.max_attempts {
            if let Ok(last_attempt) = self.last_attempt.lock() {
                if let Some(last) = *last_attempt {
                    if last.elapsed() < self.lockout_duration {
                        return Err(ViWorksError::RateLimitExceeded);
                    } else {
                        // Reset after lockout period
                        self.attempts.store(0, Ordering::Relaxed);
                    }
                }
            }
        }
        
        Ok(())
    }

    pub fn record_attempt(&self) {
        self.attempts.fetch_add(1, Ordering::Relaxed);
        if let Ok(mut last_attempt) = self.last_attempt.lock() {
            *last_attempt = Some(Instant::now());
        }
    }

    pub fn reset(&self) {
        self.attempts.store(0, Ordering::Relaxed);
        if let Ok(mut last_attempt) = self.last_attempt.lock() {
            *last_attempt = None;
        }
    }
}

/// Session management with security controls
pub struct SecureSession {
    created_at: Instant,
    last_activity: Instant,
    timeout: Duration,
    auto_logout: Duration,
}

impl SecureSession {
    pub fn new(timeout: Duration, auto_logout: Duration) -> Self {
        let now = Instant::now();
        Self {
            created_at: now,
            last_activity: now,
            timeout,
            auto_logout,
        }
    }

    pub fn update_activity(&mut self) {
        self.last_activity = Instant::now();
    }

    pub fn is_valid(&self) -> bool {
        let now = Instant::now();
        now.duration_since(self.created_at) < self.timeout
    }

    pub fn is_active(&self) -> bool {
        let now = Instant::now();
        now.duration_since(self.last_activity) < self.auto_logout
    }

    pub fn remaining_time(&self) -> Duration {
        let now = Instant::now();
        let session_remaining = self.timeout.saturating_sub(now.duration_since(self.created_at));
        let activity_remaining = self.auto_logout.saturating_sub(now.duration_since(self.last_activity));
        session_remaining.min(activity_remaining)
    }
}

/// Secure random number generator
pub struct SecureRandom;

impl SecureRandom {
    /// Generate cryptographically secure random bytes
    pub fn random_bytes(len: usize) -> Result<Vec<u8>> {
        use ring::rand::{SecureRandom, SystemRandom};
        
        let rng = SystemRandom::new();
        let mut bytes = vec![0u8; len];
        
        rng.fill(&mut bytes)
            .map_err(|e| ViWorksError::Internal(format!("Failed to generate random bytes: {}", e)))?;
        
        Ok(bytes)
    }

    /// Generate a secure random string
    pub fn random_string(len: usize) -> Result<String> {
        use base64::{Engine as _, engine::general_purpose::URL_SAFE_NO_PAD};
        
        let bytes = Self::random_bytes(len)?;
        Ok(URL_SAFE_NO_PAD.encode(bytes))
    }

    /// Generate a secure UUID
    pub fn random_uuid() -> Result<uuid::Uuid> {
        let bytes = Self::random_bytes(16)?;
        let mut uuid_bytes = [0u8; 16];
        uuid_bytes.copy_from_slice(&bytes[..16]);
        
        Ok(uuid::Uuid::from_bytes(uuid_bytes))
    }
}

/// Input sanitization utilities
pub struct InputSanitizer;

impl InputSanitizer {
    /// Sanitize hostname input
    pub fn sanitize_hostname(input: &str) -> Result<String> {
        let sanitized = input.trim().to_lowercase();
        
        // Remove any potentially dangerous characters
        let sanitized = sanitized
            .chars()
            .filter(|c| c.is_alphanumeric() || *c == '.' || *c == '-')
            .collect::<String>();
        
        if sanitized.is_empty() {
            return Err(ViWorksError::InvalidHostname("Empty hostname after sanitization".to_string()));
        }
        
        Ok(sanitized)
    }

    /// Sanitize file path input
    pub fn sanitize_path(input: &str) -> Result<String> {
        let sanitized = input.trim();
        
        // Check for path traversal attempts
        if sanitized.contains("..") || sanitized.contains("\\") {
            return Err(ViWorksError::InvalidPath("Path traversal attempt detected".to_string()));
        }
        
        // Remove any potentially dangerous characters
        let sanitized = sanitized
            .chars()
            .filter(|c| c.is_alphanumeric() || *c == '.' || *c == '/' || *c == '_' || *c == '-')
            .collect::<String>();
        
        if sanitized.is_empty() {
            return Err(ViWorksError::InvalidPath("Empty path after sanitization".to_string()));
        }
        
        Ok(sanitized)
    }

    /// Sanitize command line arguments
    pub fn sanitize_args(args: &[String]) -> Result<Vec<String>> {
        let mut sanitized = Vec::new();
        
        for arg in args {
            let clean = arg.trim();
            
            // Check for potentially dangerous patterns
            if clean.contains("..") || clean.contains("|") || clean.contains(";") || clean.contains("&") {
                return Err(ViWorksError::InvalidInput("Dangerous characters in argument".to_string()));
            }
            
            sanitized.push(clean.to_string());
        }
        
        Ok(sanitized)
    }
}

/// Security audit logging
pub struct SecurityAudit;

impl SecurityAudit {
    /// Log security event
    pub fn log_event(event_type: &str, details: &str, severity: SecuritySeverity) {
        use tracing::{info, warn, error};
        
        let message = format!("SECURITY [{}] {}: {}", severity, event_type, details);
        
        match severity {
            SecuritySeverity::Info => info!("{}", message),
            SecuritySeverity::Warning => warn!("{}", message),
            SecuritySeverity::Error => error!("{}", message),
            SecuritySeverity::Critical => error!("{}", message),
        }
    }

    /// Log authentication attempt
    pub fn log_auth_attempt(username: &str, success: bool, ip: Option<&str>) {
        let details = format!(
            "Auth attempt for user '{}' from IP '{}' - {}",
            username,
            ip.unwrap_or("unknown"),
            if success { "SUCCESS" } else { "FAILED" }
        );
        
        Self::log_event(
            "AUTH_ATTEMPT",
            &details,
            if success { SecuritySeverity::Info } else { SecuritySeverity::Warning }
        );
    }

    /// Log configuration change
    pub fn log_config_change(change_type: &str, details: &str) {
        Self::log_event("CONFIG_CHANGE", &format!("{}: {}", change_type, details), SecuritySeverity::Info);
    }

    /// Log security violation
    pub fn log_violation(violation_type: &str, details: &str) {
        Self::log_event("SECURITY_VIOLATION", &format!("{}: {}", violation_type, details), SecuritySeverity::Error);
    }
}

/// Security severity levels
#[derive(Debug, Clone, Copy)]
pub enum SecuritySeverity {
    Info,
    Warning,
    Error,
    Critical,
}

impl std::fmt::Display for SecuritySeverity {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            SecuritySeverity::Info => write!(f, "INFO"),
            SecuritySeverity::Warning => write!(f, "WARN"),
            SecuritySeverity::Error => write!(f, "ERROR"),
            SecuritySeverity::Critical => write!(f, "CRITICAL"),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rate_limiter() {
        let limiter = RateLimiter::new(3, Duration::from_secs(1));
        
        // Should allow first 3 attempts
        assert!(limiter.check_allowed().is_ok());
        limiter.record_attempt();
        
        assert!(limiter.check_allowed().is_ok());
        limiter.record_attempt();
        
        assert!(limiter.check_allowed().is_ok());
        limiter.record_attempt();
        
        // 4th attempt should be blocked
        assert!(limiter.check_allowed().is_err());
    }

    #[test]
    fn test_input_sanitizer() {
        // Test hostname sanitization
        assert!(InputSanitizer::sanitize_hostname("example.com").is_ok());
        assert!(InputSanitizer::sanitize_hostname("  EXAMPLE.COM  ").is_ok());
        assert!(InputSanitizer::sanitize_hostname("").is_err());
        
        // Test path sanitization
        assert!(InputSanitizer::sanitize_path("config.json").is_ok());
        assert!(InputSanitizer::sanitize_path("../config.json").is_err());
        assert!(InputSanitizer::sanitize_path("config|.json").is_err());
    }

    #[test]
    fn test_secure_random() {
        // Test random bytes
        let bytes = SecureRandom::random_bytes(32).unwrap();
        assert_eq!(bytes.len(), 32);
        
        // Test random string
        let string = SecureRandom::random_string(16).unwrap();
        assert_eq!(string.len(), 22); // Base64 encoded
        
        // Test UUID
        let uuid = SecureRandom::random_uuid().unwrap();
        assert!(uuid != uuid::Uuid::nil());
    }

    #[test]
    fn test_secure_session() {
        let mut session = SecureSession::new(
            Duration::from_secs(3600),
            Duration::from_secs(900)
        );
        
        assert!(session.is_valid());
        assert!(session.is_active());
        
        session.update_activity();
        assert!(session.is_active());
    }
}
