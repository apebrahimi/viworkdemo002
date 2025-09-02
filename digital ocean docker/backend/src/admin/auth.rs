// Admin authentication handlers
use actix_web::{web, HttpRequest, HttpResponse};
use sqlx::PgPool;
use uuid::Uuid;
use chrono::{Utc, Duration};
use crate::admin::models::*;
use crate::admin::jwt::{AdminJwtService, hash_password, verify_password, is_ip_allowed};
use crate::admin::audit::log_admin_action;
use serde_json::json;

// Get client IP from request
fn get_client_ip(req: &HttpRequest) -> String {
    // Check X-Real-IP header first (from nginx)
    if let Some(real_ip) = req.headers().get("X-Real-IP") {
        if let Ok(ip_str) = real_ip.to_str() {
            return ip_str.to_string();
        }
    }
    
    // Check X-Forwarded-For
    if let Some(forwarded) = req.headers().get("X-Forwarded-For") {
        if let Ok(forwarded_str) = forwarded.to_str() {
            if let Some(first_ip) = forwarded_str.split(',').next() {
                return first_ip.trim().to_string();
            }
        }
    }
    
    // Fall back to peer address
    req.peer_addr()
        .map(|addr| addr.ip().to_string())
        .unwrap_or_else(|| "unknown".to_string())
}

// Admin login handler
pub async fn admin_login(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    login_data: web::Json<AdminLoginRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    // Validate request
    if let Err(e) = login_data.validate() {
        return Ok(HttpResponse::BadRequest().json(json!({
            "success": false,
            "message": e
        })));
    }

    let client_ip = get_client_ip(&req);
    let user_agent = req.headers()
        .get("User-Agent")
        .and_then(|h| h.to_str().ok())
        .unwrap_or("unknown")
        .to_string();

    // Check if admin realm is enforced
    let enforce_admin_realm = sqlx::query_scalar::<_, bool>(
        "SELECT enabled FROM feature_flags WHERE name = 'ADMIN_REALM_ENFORCED'"
    )
    .fetch_optional(pool.get_ref())
    .await
    .unwrap_or(Some(false))
    .unwrap_or(false);

    if !enforce_admin_realm {
        // Feature flag is off, use legacy auth (redirect to old auth)
        return Ok(HttpResponse::TemporaryRedirect()
            .append_header(("Location", "/api/v1/auth/login"))
            .json(json!({
                "success": false,
                "message": "Admin realm not yet enabled, using legacy auth"
            })));
    }

    // Fetch admin user
    let admin_user = sqlx::query_as::<_, AdminUser>(
        r#"
        SELECT * FROM admin_users 
        WHERE username = $1 AND is_active = true
        "#
    )
    .bind(&login_data.username)
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    let admin_user = match admin_user {
        Some(user) => user,
        None => {
            // Log failed login attempt
            log_admin_action(
                pool.get_ref(),
                None,
                "admin_login_failed",
                Some("admin_user"),
                Some(&login_data.username),
                json!({"reason": "user_not_found"}),
                Some(&client_ip),
                Some(&user_agent),
                false,
                Some("Admin user not found"),
            ).await;

            return Ok(HttpResponse::Unauthorized().json(json!({
                "success": false,
                "message": "Invalid credentials"
            })));
        }
    };

    // Check if account is locked
    if let Some(locked_until) = admin_user.locked_until {
        if locked_until > Utc::now() {
            log_admin_action(
                pool.get_ref(),
                Some(admin_user.id),
                "admin_login_failed",
                Some("admin_user"),
                Some(&admin_user.id.to_string()),
                json!({"reason": "account_locked"}),
                Some(&client_ip),
                Some(&user_agent),
                false,
                Some("Account is locked"),
            ).await;

            return Ok(HttpResponse::Unauthorized().json(json!({
                "success": false,
                "message": "Account is locked. Please try again later."
            })));
        }
    }

    // Check IP allowlist if required
    if admin_user.require_ip_allowlist {
        let allowlist = admin_user.ip_allowlist.clone().unwrap_or_default();
        if !is_ip_allowed(&client_ip, &allowlist) {
            log_admin_action(
                pool.get_ref(),
                Some(admin_user.id),
                "admin_login_failed",
                Some("admin_user"),
                Some(&admin_user.id.to_string()),
                json!({"reason": "ip_not_allowed", "client_ip": client_ip}),
                Some(&client_ip),
                Some(&user_agent),
                false,
                Some("IP address not in allowlist"),
            ).await;

            return Ok(HttpResponse::Forbidden().json(json!({
                "success": false,
                "message": "Access denied from this IP address"
            })));
        }
    }

    // Verify password
    let password_valid = verify_password(&login_data.password, &admin_user.password_hash)
        .unwrap_or(false);

    if !password_valid {
        // Increment failed login attempts
        let new_attempts = admin_user.failed_login_attempts + 1;
        let locked_until = if new_attempts >= 5 {
            Some(Utc::now() + Duration::minutes(30))
        } else {
            None
        };

        sqlx::query(
            r#"
            UPDATE admin_users 
            SET failed_login_attempts = $1, locked_until = $2, updated_at = NOW()
            WHERE id = $3
            "#
        )
        .bind(new_attempts)
        .bind(locked_until)
        .bind(admin_user.id)
        .execute(pool.get_ref())
        .await
        .map_err(|e| {
            eprintln!("Failed to update login attempts: {}", e);
            actix_web::error::ErrorInternalServerError("Database error")
        })?;

        log_admin_action(
            pool.get_ref(),
            Some(admin_user.id),
            "admin_login_failed",
            Some("admin_user"),
            Some(&admin_user.id.to_string()),
            json!({"reason": "invalid_password", "attempts": new_attempts}),
            Some(&client_ip),
            Some(&user_agent),
            false,
            Some("Invalid password"),
        ).await;

        return Ok(HttpResponse::Unauthorized().json(json!({
            "success": false,
            "message": "Invalid credentials"
        })));
    }

    // Check if MFA is required (future implementation)
    if admin_user.mfa_enabled && login_data.otp_code.is_none() {
        return Ok(HttpResponse::Ok().json(AdminLoginResponse {
            success: false,
            message: "MFA code required".to_string(),
            admin: None,
            session: None,
            requires_mfa: true,
        }));
    }

    // Reset failed login attempts
    sqlx::query(
        r#"
        UPDATE admin_users 
        SET failed_login_attempts = 0, last_login_at = NOW(), updated_at = NOW()
        WHERE id = $1
        "#
    )
    .bind(admin_user.id)
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Failed to update login info: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    // Create session
    let session_id = Uuid::new_v4();
    let jwt_service = AdminJwtService::new()
        .map_err(|e| {
            eprintln!("Failed to create JWT service: {}", e);
            actix_web::error::ErrorInternalServerError("Configuration error")
        })?;

    let token = jwt_service.generate_token(
        &admin_user.id,
        &admin_user.username,
        &admin_user.role,
        &session_id,
    ).map_err(|e| {
        eprintln!("Failed to generate token: {}", e);
        actix_web::error::ErrorInternalServerError("Token generation failed")
    })?;

    let refresh_token = jwt_service.generate_refresh_token();
    
    // Calculate expiration times
    let session_timeout_minutes = admin_user.session_timeout_minutes as i64;
    let expires_at = Utc::now() + Duration::minutes(15); // Token expiration
    let idle_expires_at = Utc::now() + Duration::minutes(session_timeout_minutes);

    // Store session in database
    sqlx::query(
        r#"
        INSERT INTO admin_sessions (
            id, admin_user_id, token_hash, refresh_token_hash, 
            expires_at, idle_expires_at, ip_address, user_agent,
            created_at, last_activity_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7::inet, $8, NOW(), NOW())
        "#
    )
    .bind(session_id)
    .bind(admin_user.id)
    .bind(&token)
    .bind(&refresh_token)
    .bind(expires_at)
    .bind(idle_expires_at)
    .bind(&client_ip)
    .bind(&user_agent)
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Failed to create session: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    // Log successful login
    log_admin_action(
        pool.get_ref(),
        Some(admin_user.id),
        "admin_login_success",
        Some("admin_session"),
        Some(&session_id.to_string()),
        json!({"ip": client_ip, "user_agent": user_agent}),
        Some(&client_ip),
        Some(&user_agent),
        true,
        None,
    ).await;

    // Prepare response
    let response = AdminLoginResponse {
        success: true,
        message: "Login successful".to_string(),
        admin: Some(AdminUserInfo {
            id: admin_user.id.to_string(),
            username: admin_user.username,
            email: admin_user.email,
            role: admin_user.role,
            is_active: admin_user.is_active,
            last_login_at: admin_user.last_login_at.map(|dt| dt.to_rfc3339()),
            session_timeout_minutes: admin_user.session_timeout_minutes,
        }),
        session: Some(AdminSessionInfo {
            token,
            refresh_token,
            expires_at: expires_at.to_rfc3339(),
            idle_timeout_seconds: (session_timeout_minutes * 60) as i32,
        }),
        requires_mfa: false,
    };

    Ok(HttpResponse::Ok().json(response))
}

// Admin logout handler
pub async fn admin_logout(
    pool: web::Data<PgPool>,
    req: HttpRequest,
) -> Result<HttpResponse, actix_web::Error> {
    let client_ip = get_client_ip(&req);
    let user_agent = req.headers()
        .get("User-Agent")
        .and_then(|h| h.to_str().ok())
        .unwrap_or("unknown")
        .to_string();

    // Extract token from Authorization header
    let token = req.headers()
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .and_then(|h| AdminJwtService::extract_token_from_header(h));

    if let Some(token) = token {
        // Revoke session
        let result = sqlx::query(
            r#"
            UPDATE admin_sessions 
            SET is_revoked = true, revoked_at = NOW(), revoked_reason = 'User logout'
            WHERE token_hash = $1 AND is_revoked = false
            RETURNING admin_user_id
            "#
        )
        .bind(&token)
        .fetch_optional(pool.get_ref())
        .await;

        if let Ok(Some(row)) = result {
            let admin_user_id: Uuid = row.try_get("admin_user_id").unwrap_or_default();
            
            log_admin_action(
                pool.get_ref(),
                Some(admin_user_id),
                "admin_logout",
                Some("admin_session"),
                Some(&token),
                json!({"ip": client_ip}),
                Some(&client_ip),
                Some(&user_agent),
                true,
                None,
            ).await;
        }
    }

    Ok(HttpResponse::Ok().json(json!({
        "success": true,
        "message": "Logged out successfully"
    })))
}

// Admin refresh token handler
pub async fn admin_refresh_token(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    refresh_data: web::Json<AdminRefreshRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let client_ip = get_client_ip(&req);

    // Find session by refresh token
    let session = sqlx::query(
        r#"
        SELECT s.*, u.username, u.role 
        FROM admin_sessions s
        JOIN admin_users u ON s.admin_user_id = u.id
        WHERE s.refresh_token_hash = $1 
        AND s.is_revoked = false 
        AND s.idle_expires_at > NOW()
        "#
    )
    .bind(&refresh_data.refresh_token)
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    let session = match session {
        Some(row) => row,
        None => {
            return Ok(HttpResponse::Unauthorized().json(AdminRefreshResponse {
                success: false,
                message: "Invalid or expired refresh token".to_string(),
                token: None,
                refresh_token: None,
                expires_at: None,
            }));
        }
    };

    let admin_user_id: Uuid = session.try_get("admin_user_id").unwrap();
    let username: String = session.try_get("username").unwrap();
    let role: String = session.try_get("role").unwrap();
    let session_id: Uuid = session.try_get("id").unwrap();

    // Generate new tokens
    let jwt_service = AdminJwtService::new()
        .map_err(|_| actix_web::error::ErrorInternalServerError("Configuration error"))?;

    let new_token = jwt_service.generate_token(
        &admin_user_id,
        &username,
        &role,
        &session_id,
    ).map_err(|_| actix_web::error::ErrorInternalServerError("Token generation failed"))?;

    let new_refresh_token = jwt_service.generate_refresh_token();
    let expires_at = Utc::now() + Duration::minutes(15);

    // Update session with new tokens
    sqlx::query(
        r#"
        UPDATE admin_sessions 
        SET token_hash = $1, refresh_token_hash = $2, 
            expires_at = $3, last_activity_at = NOW()
        WHERE id = $4
        "#
    )
    .bind(&new_token)
    .bind(&new_refresh_token)
    .bind(expires_at)
    .bind(session_id)
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Failed to update session: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    Ok(HttpResponse::Ok().json(AdminRefreshResponse {
        success: true,
        message: "Token refreshed successfully".to_string(),
        token: Some(new_token),
        refresh_token: Some(new_refresh_token),
        expires_at: Some(expires_at.to_rfc3339()),
    }))
}

// Get current admin user
pub async fn get_current_admin(
    pool: web::Data<PgPool>,
    req: HttpRequest,
) -> Result<HttpResponse, actix_web::Error> {
    // Extract token from Authorization header
    let token = req.headers()
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .and_then(|h| AdminJwtService::extract_token_from_header(h));

    let token = match token {
        Some(t) => t,
        None => {
            return Ok(HttpResponse::Unauthorized().json(json!({
                "success": false,
                "message": "No authorization token provided"
            })));
        }
    };

    // Validate token
    let jwt_service = AdminJwtService::new()
        .map_err(|_| actix_web::error::ErrorInternalServerError("Configuration error"))?;

    let claims = jwt_service.validate_token(&token)
        .map_err(|_| actix_web::error::ErrorUnauthorized("Invalid token"))?;

    // Fetch admin user
    let admin_user = sqlx::query_as::<_, AdminUser>(
        "SELECT * FROM admin_users WHERE id = $1::uuid AND is_active = true"
    )
    .bind(Uuid::parse_str(&claims.sub).unwrap())
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    match admin_user {
        Some(user) => {
            Ok(HttpResponse::Ok().json(AdminUserInfo {
                id: user.id.to_string(),
                username: user.username,
                email: user.email,
                role: user.role,
                is_active: user.is_active,
                last_login_at: user.last_login_at.map(|dt| dt.to_rfc3339()),
                session_timeout_minutes: user.session_timeout_minutes,
            }))
        }
        None => {
            Ok(HttpResponse::NotFound().json(json!({
                "success": false,
                "message": "Admin user not found"
            })))
        }
    }
}
