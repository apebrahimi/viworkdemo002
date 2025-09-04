use crate::config::Config;
use crate::error::BackendAgentResult;
use actix_web::{dev::ServiceRequest, Error, HttpMessage};
use actix_web_httpauth::extractors::bearer::{BearerAuth, Config as BearerConfig};
use actix_web_httpauth::extractors::AuthenticationError;
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tracing::{debug, error, info, warn};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // Subject (user ID)
    pub iat: usize,  // Issued at
    pub exp: usize,  // Expiration
    pub role: String, // User role
}

impl Claims {
    pub fn new(user_id: String, role: String, expires_in: Duration) -> Self {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("Time went backwards")
            .as_secs() as usize;

        Self {
            sub: user_id,
            iat: now,
            exp: now + expires_in.as_secs() as usize,
            role,
        }
    }
}

pub struct AuthService {
    encoding_key: EncodingKey,
    decoding_key: DecodingKey,
    validation: Validation,
}

impl AuthService {
    pub fn new(secret: &str) -> Self {
        let encoding_key = EncodingKey::from_secret(secret.as_ref());
        let decoding_key = DecodingKey::from_secret(secret.as_ref());
        let mut validation = Validation::new(Algorithm::HS256);
        validation.set_required_spec_claims(&["exp", "sub", "iat"]);

        Self {
            encoding_key,
            decoding_key,
            validation,
        }
    }

    /// Generate a JWT token
    pub fn generate_token(&self, claims: Claims) -> BackendAgentResult<String> {
        let header = Header::new(Algorithm::HS256);
        
        encode(&header, &claims, &self.encoding_key)
            .map_err(|e| crate::error::BackendAgentError::Internal(format!("Failed to generate token: {}", e)))
    }

    /// Validate a JWT token
    pub fn validate_token(&self, token: &str) -> BackendAgentResult<Claims> {
        decode::<Claims>(token, &self.decoding_key, &self.validation)
            .map(|token_data| token_data.claims)
            .map_err(|e| crate::error::BackendAgentError::Authorization(format!("Invalid token: {}", e)))
    }

    /// Check if user has required role
    pub fn check_role(&self, claims: &Claims, required_role: &str) -> bool {
        claims.role == required_role || claims.role == "admin"
    }
}

/// JWT authentication validator for actix-web
pub async fn jwt_validator(
    req: ServiceRequest,
    credentials: BearerAuth,
) -> Result<ServiceRequest, (Error, ServiceRequest)> {
    // Extract config first to avoid ownership issues
    let config = match req.app_data::<actix_web::web::Data<Config>>() {
        Some(config) => config,
        None => {
            error!("Config not found in app data");
            return Err((
                AuthenticationError::from(BearerConfig::default()).into(),
                req,
            ));
        }
    };

    let auth_service = AuthService::new(&config.security.jwt_secret);

    match auth_service.validate_token(credentials.token()) {
        Ok(claims) => {
            debug!("JWT validation successful for user: {}", claims.sub);
            
            // Store claims in request extensions
            let mut req = req;
            req.extensions_mut().insert(claims);
            Ok(req)
        }
        Err(e) => {
            warn!("JWT validation failed: {}", e);
            Err((
                AuthenticationError::from(BearerConfig::default()).into(),
                req,
            ))
        }
    }
}

/// Extract claims from request
pub fn get_claims(req: &actix_web::HttpRequest) -> Option<Claims> {
    req.extensions().get::<Claims>().cloned()
}

/// Check if user has admin role
pub fn require_admin_role(claims: &Claims) -> BackendAgentResult<()> {
    if claims.role != "admin" {
        return Err(crate::error::BackendAgentError::Authorization(
            "Admin role required".to_string(),
        ));
    }
    Ok(())
}

/// Check if user has operator role (or admin)
pub fn require_operator_role(claims: &Claims) -> BackendAgentResult<()> {
    if claims.role != "operator" && claims.role != "admin" {
        return Err(crate::error::BackendAgentError::Authorization(
            "Operator or admin role required".to_string(),
        ));
    }
    Ok(())
}

/// Check if user has viewer role (or higher)
pub fn require_viewer_role(claims: &Claims) -> BackendAgentResult<()> {
    if claims.role != "viewer" && claims.role != "operator" && claims.role != "admin" {
        return Err(crate::error::BackendAgentError::Authorization(
            "Viewer, operator, or admin role required".to_string(),
        ));
    }
    Ok(())
}
