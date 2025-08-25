use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation, errors::Error as JwtError};
use serde::{Deserialize, Serialize};
use chrono::{Duration, Utc};
use uuid::Uuid;
use crate::config::AppConfig;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // User ID
    pub username: String,
    pub role: String,
    pub exp: i64, // Expiration time
    pub iat: i64, // Issued at
    pub jti: String, // JWT ID for token tracking
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenResponse {
    pub access_token: String,
    pub token_type: String,
    pub expires_in: i64,
    pub refresh_token: Option<String>,
}

pub struct JwtService {
    encoding_key: EncodingKey,
    decoding_key: DecodingKey,
    expiration: i64,
}

impl JwtService {
    pub fn new(config: &AppConfig) -> Self {
        let encoding_key = EncodingKey::from_secret(config.jwt_secret.as_ref());
        let decoding_key = DecodingKey::from_secret(config.jwt_secret.as_ref());
        
        Self {
            encoding_key,
            decoding_key,
            expiration: config.jwt_expiration as i64,
        }
    }
    
    pub fn generate_token(&self, user_id: Uuid, username: &str, role: &str) -> Result<String, JwtError> {
        let now = Utc::now();
        let expires_at = now + Duration::seconds(self.expiration);
        
        let claims = Claims {
            sub: user_id.to_string(),
            username: username.to_string(),
            role: role.to_string(),
            exp: expires_at.timestamp(),
            iat: now.timestamp(),
            jti: Uuid::new_v4().to_string(),
        };
        
        encode(&Header::default(), &claims, &self.encoding_key)
    }
    
    pub fn validate_token(&self, token: &str) -> Result<Claims, JwtError> {
        let token_data = decode::<Claims>(
            token,
            &self.decoding_key,
            &Validation::default()
        )?;
        
        Ok(token_data.claims)
    }
    
    pub fn generate_refresh_token(&self, user_id: Uuid) -> Result<String, JwtError> {
        let now = Utc::now();
        let expires_at = now + Duration::days(30); // 30 days for refresh token
        
        let claims = Claims {
            sub: user_id.to_string(),
            username: "".to_string(), // Not needed for refresh token
            role: "".to_string(), // Not needed for refresh token
            exp: expires_at.timestamp(),
            iat: now.timestamp(),
            jti: Uuid::new_v4().to_string(),
        };
        
        encode(&Header::default(), &claims, &self.encoding_key)
    }
    
    pub fn create_token_response(&self, user_id: Uuid, username: &str, role: &str) -> Result<TokenResponse, JwtError> {
        let access_token = self.generate_token(user_id, username, role)?;
        let refresh_token = self.generate_refresh_token(user_id)?;
        
        Ok(TokenResponse {
            access_token,
            token_type: "Bearer".to_string(),
            expires_in: self.expiration,
            refresh_token: Some(refresh_token),
        })
    }
}
