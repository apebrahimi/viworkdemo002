// Admin JWT service - Separate JWT handling for admin realm
use jsonwebtoken::{encode, decode, Header, Algorithm, Validation, EncodingKey, DecodingKey};
use chrono::{Utc, Duration};
use uuid::Uuid;
use anyhow::{Result, Context};
use crate::admin::models::AdminClaims;
use std::env;

pub struct AdminJwtService {
    secret: String,
    issuer: String,
    audience: String,
    expiration_seconds: i64,
}

impl AdminJwtService {
    pub fn new() -> Result<Self> {
        let secret = env::var("ADMIN_JWT_SECRET")
            .unwrap_or_else(|_| "admin-secret-key-change-in-production-minimum-32-chars".to_string());
        
        if secret.len() < 32 {
            anyhow::bail!("ADMIN_JWT_SECRET must be at least 32 characters");
        }

        let expiration_seconds = env::var("ADMIN_JWT_EXPIRATION")
            .unwrap_or_else(|_| "900".to_string()) // 15 minutes default
            .parse::<i64>()
            .context("Invalid ADMIN_JWT_EXPIRATION")?;

        Ok(Self {
            secret,
            issuer: "viworks-admin".to_string(),
            audience: "admin-panel".to_string(),
            expiration_seconds,
        })
    }

    pub fn generate_token(
        &self,
        admin_user_id: &Uuid,
        username: &str,
        role: &str,
        session_id: &Uuid,
    ) -> Result<String> {
        let now = Utc::now();
        let expiration = now + Duration::seconds(self.expiration_seconds);

        let claims = AdminClaims {
            sub: admin_user_id.to_string(),
            username: username.to_string(),
            role: role.to_string(),
            session_id: session_id.to_string(),
            iss: self.issuer.clone(),
            aud: self.audience.clone(),
            exp: expiration.timestamp(),
            iat: now.timestamp(),
            nbf: now.timestamp(),
        };

        let token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.secret.as_bytes()),
        )
        .context("Failed to encode admin JWT")?;

        Ok(token)
    }

    pub fn generate_refresh_token(&self) -> String {
        // Generate a random refresh token
        Uuid::new_v4().to_string()
    }

    pub fn validate_token(&self, token: &str) -> Result<AdminClaims> {
        let mut validation = Validation::new(Algorithm::HS256);
        validation.set_issuer(&[self.issuer.clone()]);
        validation.set_audience(&[self.audience.clone()]);
        validation.validate_exp = true;
        validation.validate_nbf = true;

        let token_data = decode::<AdminClaims>(
            token,
            &DecodingKey::from_secret(self.secret.as_bytes()),
            &validation,
        )
        .context("Failed to decode admin JWT")?;

        Ok(token_data.claims)
    }

    pub fn extract_token_from_header(auth_header: &str) -> Option<String> {
        if auth_header.starts_with("Bearer ") {
            Some(auth_header[7..].to_string())
        } else {
            None
        }
    }
}

// Utility functions for password hashing
use bcrypt::{hash, verify, DEFAULT_COST};

pub fn hash_password(password: &str) -> Result<String> {
    let cost = env::var("BCRYPT_COST")
        .unwrap_or_else(|_| "12".to_string())
        .parse::<u32>()
        .unwrap_or(DEFAULT_COST);

    hash(password, cost).context("Failed to hash password")
}

pub fn verify_password(password: &str, hash: &str) -> Result<bool> {
    verify(password, hash).context("Failed to verify password")
}

// IP validation utilities
use std::net::IpAddr;
use ipnetwork::IpNetwork;

pub fn is_ip_allowed(client_ip: &str, allowlist: &[String]) -> bool {
    // If allowlist is empty, allow all (for initial setup)
    if allowlist.is_empty() {
        return true;
    }

    let client_addr = match client_ip.parse::<IpAddr>() {
        Ok(addr) => addr,
        Err(_) => return false,
    };

    for cidr in allowlist {
        if let Ok(network) = cidr.parse::<IpNetwork>() {
            if network.contains(client_addr) {
                return true;
            }
        }
    }

    false
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_ip_allowlist() {
        let allowlist = vec![
            "192.168.1.0/24".to_string(),
            "10.0.0.0/8".to_string(),
        ];

        assert!(is_ip_allowed("192.168.1.100", &allowlist));
        assert!(is_ip_allowed("10.1.2.3", &allowlist));
        assert!(!is_ip_allowed("8.8.8.8", &allowlist));
        assert!(is_ip_allowed("127.0.0.1", &[])); // Empty allowlist allows all
    }

    #[test]
    fn test_password_hashing() {
        let password = "TestPassword123!";
        let hash = hash_password(password).unwrap();
        assert!(verify_password(password, &hash).unwrap());
        assert!(!verify_password("WrongPassword", &hash).unwrap());
    }
}
