use bcrypt::{hash, verify, DEFAULT_COST, BcryptError};
use anyhow::{Result, anyhow};

pub struct PasswordService {
    cost: u32,
}

impl PasswordService {
    pub fn new(cost: u32) -> Self {
        Self { cost }
    }
    
    pub fn hash_password(&self, password: &str) -> Result<String, BcryptError> {
        hash(password, self.cost)
    }
    
    pub fn verify_password(&self, password: &str, hash: &str) -> Result<bool, BcryptError> {
        verify(password, hash)
    }
    
    pub fn validate_password_strength(&self, password: &str) -> Result<(), anyhow::Error> {
        if password.len() < 8 {
            return Err(anyhow!("Password must be at least 8 characters long"));
        }
        
        if password.len() > 128 {
            return Err(anyhow!("Password must be less than 128 characters"));
        }
        
        // Check for at least one uppercase letter
        if !password.chars().any(|c| c.is_uppercase()) {
            return Err(anyhow!("Password must contain at least one uppercase letter"));
        }
        
        // Check for at least one lowercase letter
        if !password.chars().any(|c| c.is_lowercase()) {
            return Err(anyhow!("Password must contain at least one lowercase letter"));
        }
        
        // Check for at least one digit
        if !password.chars().any(|c| c.is_numeric()) {
            return Err(anyhow!("Password must contain at least one digit"));
        }
        
        // Check for at least one special character
        let special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
        if !password.chars().any(|c| special_chars.contains(c)) {
            return Err(anyhow!("Password must contain at least one special character"));
        }
        
        Ok(())
    }
    
    pub fn generate_secure_password() -> String {
        use rand::{thread_rng, Rng};
        use rand::distributions::Alphanumeric;
        
        let mut rng = thread_rng();
        let password: String = (0..16)
            .map(|_| rng.sample(Alphanumeric) as char)
            .collect();
        
        // Ensure password meets requirements
        let mut secure_password = password;
        secure_password.push_str("A1!"); // Add required characters
        
        secure_password
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_password_hashing() {
        let service = PasswordService::new(DEFAULT_COST);
        let password = "test_password_123!";
        
        let hash = service.hash_password(password).unwrap();
        assert!(service.verify_password(password, &hash).unwrap());
        assert!(!service.verify_password("wrong_password", &hash).unwrap());
    }
    
    #[test]
    fn test_password_validation() {
        let service = PasswordService::new(DEFAULT_COST);
        
        // Valid password
        assert!(service.validate_password_strength("SecurePass123!").is_ok());
        
        // Too short
        assert!(service.validate_password_strength("Short1!").is_err());
        
        // No uppercase
        assert!(service.validate_password_strength("lowercase123!").is_err());
        
        // No lowercase
        assert!(service.validate_password_strength("UPPERCASE123!").is_err());
        
        // No digit
        assert!(service.validate_password_strength("NoDigits!").is_err());
        
        // No special character
        assert!(service.validate_password_strength("NoSpecial123").is_err());
    }
}
