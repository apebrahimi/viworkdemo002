use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey, errors::Error as JwtError};
use serde::{Deserialize, Serialize};
use chrono::{Utc, Duration};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // user_id
    pub role: String,
    pub exp: i64,    // expiration time
    pub iat: i64,    // issued at
}

pub fn create_token(user_id: &str, role: &str) -> Result<String, JwtError> {
    let expiration = Utc::now()
        .checked_add_signed(Duration::hours(24))
        .expect("valid timestamp")
        .timestamp();

    let claims = Claims {
        sub: user_id.to_string(),
        role: role.to_string(),
        exp: expiration,
        iat: Utc::now().timestamp(),
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret("your-super-secret-jwt-key-change-this-in-production".as_ref())
    )
}

pub fn verify_token(token: &str) -> Result<Claims, JwtError> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret("your-super-secret-jwt-key-change-this-in-production".as_ref()),
        &Validation::default()
    )?;

    Ok(token_data.claims)
}
