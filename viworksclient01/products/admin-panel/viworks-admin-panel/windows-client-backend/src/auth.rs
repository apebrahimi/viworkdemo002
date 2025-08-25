use actix_web::{web, HttpResponse, Result};
use serde_json;
use uuid::Uuid;
use chrono::{Utc, Duration};
use bcrypt::{hash, verify, DEFAULT_COST};
use jsonwebtoken::{encode, decode, Header, EncodingKey, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Mutex;
use tracing::{info, warn, error};
use rand::Rng;

use crate::models::*;

// In-memory storage for demo purposes
lazy_static::lazy_static! {
    // Store users in memory
    static ref USERS: Mutex<HashMap<String, User>> = {
        let mut users = HashMap::new();
        
        // Create demo users with hashed passwords
        let admin_pass = hash("admin123", DEFAULT_COST).unwrap();
        let test_pass = hash("12345", DEFAULT_COST).unwrap();
        
        users.insert("admin".to_string(), User {
            id: Uuid::new_v4(),
            username: "admin".to_string(),
            password_hash: admin_pass,
            role: "admin".to_string(),
            status: "active".to_string(),
        });
        
        users.insert("testuser".to_string(), User {
            id: Uuid::new_v4(),
            username: "testuser".to_string(),
            password_hash: test_pass.clone(),
            role: "user".to_string(),
            status: "active".to_string(),
        });
        
        // Allow any username with password "12345" for demo
        users.insert("demo".to_string(), User {
            id: Uuid::new_v4(),
            username: "demo".to_string(),
            password_hash: test_pass.clone(),
            role: "user".to_string(),
            status: "active".to_string(),
        });
        
        Mutex::new(users)
    };
    
    // Store 2FA codes temporarily
    static ref TWO_FACTOR_CODES: Mutex<HashMap<String, (String, chrono::DateTime<Utc>)>> = 
        Mutex::new(HashMap::new());
        
    // Store active sessions
    static ref SESSIONS: Mutex<HashMap<String, (Uuid, chrono::DateTime<Utc>)>> = 
        Mutex::new(HashMap::new());
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
    iat: usize,
}

const JWT_SECRET: &str = "viworks_secret_key_2024";

fn create_token(user_id: &str) -> anyhow::Result<String> {
    let expiration = Utc::now()
        .checked_add_signed(Duration::hours(24))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        sub: user_id.to_string(),
        exp: expiration,
        iat: Utc::now().timestamp() as usize,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(JWT_SECRET.as_ref()),
    ).map_err(|e| anyhow::anyhow!("Token creation failed: {}", e))
}

pub async fn login(request: web::Json<LoginRequest>) -> Result<HttpResponse> {
    info!("Login attempt for user: {}", request.username);
    
    let username = request.username.clone();
    let password = request.password.clone();
    
    // Check if user exists
    let users = USERS.lock().unwrap();
    let user = if let Some(user) = users.get(&username) {
        user.clone()
    } else {
        // For demo: allow any username with password "12345"
        if password == "12345" {
            User {
                id: Uuid::new_v4(),
                username: username.clone(),
                password_hash: hash("12345", DEFAULT_COST).unwrap(),
                role: "user".to_string(),
                status: "active".to_string(),
            }
        } else {
            warn!("Login failed: User '{}' not found", username);
            return Ok(HttpResponse::Unauthorized().json(LoginResponse {
                success: false,
                message: "Invalid credentials".to_string(),
                requires_2fa: false,
                user_id: None,
            }));
        }
    };
    drop(users);

    // Verify password
    let password_valid = if password == "12345" {
        true // Demo mode
    } else {
        verify(&password, &user.password_hash).unwrap_or(false)
    };

    if !password_valid {
        warn!("Login failed: Invalid password for user '{}'", username);
        return Ok(HttpResponse::Unauthorized().json(LoginResponse {
            success: false,
            message: "Invalid credentials".to_string(),
            requires_2fa: false,
            user_id: None,
        }));
    }

    info!("Login successful for user: {}", username);
    
    Ok(HttpResponse::Ok().json(LoginResponse {
        success: true,
        message: "Login successful, 2FA required".to_string(),
        requires_2fa: true,
        user_id: Some(user.id),
    }))
}

pub async fn request_2fa_code(request: web::Json<TwoFactorRequest>) -> Result<HttpResponse> {
    let username = request.username.clone();
    
    info!("2FA code requested for user: {}", username);
    
    // Generate 6-digit code
    let mut rng = rand::thread_rng();
    let code: String = (0..6).map(|_| rng.gen_range(0..10).to_string()).collect();
    
    // Store code with 5-minute expiration
    let expires_at = Utc::now() + Duration::minutes(5);
    {
        let mut codes = TWO_FACTOR_CODES.lock().unwrap();
        codes.insert(username.clone(), (code.clone(), expires_at));
    }
    
    info!("2FA code generated for user {}: {}", username, code);
    
    Ok(HttpResponse::Ok().json(TwoFactorCodeResponse {
        success: true,
        message: "2FA code sent to Android app".to_string(),
        code: Some(code), // For testing - remove in production
    }))
}

pub async fn validate_2fa_code(request: web::Json<ValidateCodeRequest>) -> Result<HttpResponse> {
    let username = request.username.clone();
    let code = request.code.clone();
    
    info!("2FA validation attempt for user: {} with code: {}", username, code);
    
    // Get stored code
    let stored_data = {
        let codes = TWO_FACTOR_CODES.lock().unwrap();
        codes.get(&username).cloned()
    };

    match stored_data {
        Some((stored_code, expires_at)) => {
            // Check if code is expired
            if Utc::now() > expires_at {
                // Remove expired code
                let mut codes = TWO_FACTOR_CODES.lock().unwrap();
                codes.remove(&username);
                
                warn!("2FA code expired for user: {}", username);
                return Ok(HttpResponse::Unauthorized().json(TwoFactorResponse {
                    success: false,
                    message: "2FA code expired".to_string(),
                    session_token: None,
                    user_id: None,
                }));
            }

            // Check if code matches
            if code == stored_code {
                // Get user
                let users = USERS.lock().unwrap();
                let user = if let Some(user) = users.get(&username) {
                    user.clone()
                } else {
                    // Create demo user
                    User {
                        id: Uuid::new_v4(),
                        username: username.clone(),
                        password_hash: String::new(),
                        role: "user".to_string(),
                        status: "active".to_string(),
                    }
                };
                drop(users);

                // Create session token
                let session_token = create_token(&user.id.to_string())
                    .map_err(|_| actix_web::error::ErrorInternalServerError("Token creation failed"))?;

                // Store session
                let expires_at = Utc::now() + Duration::hours(24);
                {
                    let mut sessions = SESSIONS.lock().unwrap();
                    sessions.insert(session_token.clone(), (user.id, expires_at));
                }

                // Remove used code
                {
                    let mut codes = TWO_FACTOR_CODES.lock().unwrap();
                    codes.remove(&username);
                }

                info!("2FA validation successful for user: {}", username);

                Ok(HttpResponse::Ok().json(TwoFactorResponse {
                    success: true,
                    message: "2FA validation successful".to_string(),
                    session_token: Some(session_token),
                    user_id: Some(user.id),
                }))
            } else {
                warn!("2FA validation failed: Invalid code for user {}", username);
                Ok(HttpResponse::Unauthorized().json(TwoFactorResponse {
                    success: false,
                    message: "Invalid 2FA code".to_string(),
                    session_token: None,
                    user_id: None,
                }))
            }
        }
        None => {
            warn!("No 2FA code found for user: {}", username);
            Ok(HttpResponse::Unauthorized().json(TwoFactorResponse {
                success: false,
                message: "No 2FA code found for user".to_string(),
                session_token: None,
                user_id: None,
            }))
        }
    }
}

pub async fn get_connection_configs(request: web::Json<GetConfigsRequest>) -> Result<HttpResponse> {
    let username = request.username.clone();
    let session_token = request.session_token.clone();
    
    info!("Connection config requested by user: {}", username);
    
    // Verify session
    let session_valid = {
        let sessions = SESSIONS.lock().unwrap();
        sessions.get(&session_token)
            .map(|(_, expires_at)| Utc::now() < *expires_at)
            .unwrap_or(false)
    };

    if !session_valid {
        warn!("Invalid session for config request from user: {}", username);
        return Ok(HttpResponse::Unauthorized().json(ConfigsResponse {
            success: false,
            message: "Invalid session".to_string(),
            stunnel_config: None,
            openvpn_config: None,
            spa_config: None,
            server_ip: None,
            server_port: None,
        }));
    }

    // Generate configurations for the actual VPN server
    let server_ip = "viworks.ir".to_string();
    let stunnel_port = 8445;
    let openvpn_port = 1194;
    let spa_port = 2222;

    let stunnel_config = format!(
        r#"pid = /var/run/stunnel.pid
[openvpn]
accept = 127.0.0.1:1300
connect = {}:{}
cert = stunnel.pem
"#,
        server_ip, stunnel_port
    );

    let openvpn_config = format!(
        r#"dev tun
proto tcp
remote 127.0.0.1 1300
cipher AES-128-CBC
data-ciphers AES-128-CBC
auth SHA1
resolv-retry infinite
nobind
persist-key
persist-tun
client
verb 3
auth-user-pass
block-outside-dns

<ca>
-----BEGIN CERTIFICATE-----
MIIDpjCCAo6gAwIBAgIBADANBgkqhkiG9w0BAQsFADBSMRUwEwYDVQQDDAxjMzVl
N2UwYzhhYjcxFTATBgNVBAoMDGMzNWU3ZTBjOGFiNzEVMBMGA1UECwwMYzM1ZTdl
MGM4YWI3MQswCQYDVQQGEwJVUzAeFw0yNTA4MTkxNDQ5NDJaFw0zNzEyMzExNDQ5
NDJaMFIxFTATBgNVBAMMDGMzNWU3ZTBjOGFiNzEVMBMGA1UECgwMYzM1ZTdlMGM4
YWI3MRUwEwYDVQQLDAxjMzVlN2UwYzhhYjcxCzAJBgNVBAYTAlVTMIIBIjANBgkq
hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAonA2g2QfpkMGABSkDzm6nyUVLFG3TlRL
Ap8wWSnyBmRVTbPrfd6hi5hUCnq5x5xtKUYDmcNiffvLyDYrJITzNxSyAioJPkud
eqoQTkjZszk4OiZUj3ee1UtDIzumaYlCDJx9l9CIWJaGWiYwGwtoYky3gT1ilGvW
JzVjlf6uaK+hE3KtvKEkGPmKnqwPllRjoJ6AcCMGoSLwvFhYR4uuXAEKxjac8l8l
FFzQ/MiAV6rF7kKD3GRLNEgZFnl5yIZg5EpiRbL2Yj/OV1xibIGeiYZrm+XCoeZn
xRmcQBskU1e/vCTu2kKjrAkCP0bRTXRICP+Q5K+qHkacXFdC1YPLcwIDAQABo4GG
MIGDMA8GA1UdEwEB/wQFMAMBAf8wCwYDVR0PBAQDAgH2MGMGA1UdJQRcMFoGCCsG
AQUFBwMBBggrBgEFBQcDAgYIKwYBBQUHAwMGCCsGAQUFBwMEBggrBgEFBQcDBQYI
KwYBBQUHAwYGCCsGAQUFBwMHBggrBgEFBQcDCAYIKwYBBQUHAwkwDQYJKoZIhvcN
AQELBQADggEBAGldFcEbc2sk8jFciTj+espW0o32Fd66HEJRQ83F0GmKQaAPE6H3
nphzSaoVD4Uan3EgTE5pnEgCs8tYeG1GgvorLRHY3h9TNP3JLyAMyJIU+mxjjQdq
hUvf40rsZy3iYdt2fbD4OP/AFmURN8JbW7BiA+xC8a1/eCk3DCR/UMmEKiHsZrEu
gFPHch4o7WrlSKSDxoYB4Ev0zSq9cHUApHyLRtCpZp6GCZLEetPYOGxkOhbCxtxE
tvfCzuHZAXmYFdn2p3WYXkHScPgqO1W3IJ9hBLtgk/Yu933E1DEy7r8uvX+c5jbt
q4lBKehVYhoVwkktqde7PzeT8i/W3X9KRUI=
-----END CERTIFICATE-----
</ca>
"#
    );

    let spa_config = format!(
        r#"server_ip={}
server_port={}
fwknop_key=test_fwknop_key_12345
fwknop_hmac=test_fwknop_hmac_12345
protocol=tcp
"#,
        server_ip, spa_port
    );

    info!("Connection config provided to user: {}", username);

    Ok(HttpResponse::Ok().json(ConfigsResponse {
        success: true,
        message: "Connection configurations retrieved successfully".to_string(),
        stunnel_config: Some(stunnel_config),
        openvpn_config: Some(openvpn_config),
        spa_config: Some(spa_config),
        server_ip: Some(server_ip),
        server_port: Some(stunnel_port),
    }))
}

pub async fn logout(request: web::Json<serde_json::Value>) -> Result<HttpResponse> {
    // Extract session token from request
    if let Some(session_token) = request.get("session_token").and_then(|v| v.as_str()) {
        let mut sessions = SESSIONS.lock().unwrap();
        if sessions.remove(session_token).is_some() {
            info!("User logged out successfully");
        }
    }

    Ok(HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Logged out successfully"
    })))
}
