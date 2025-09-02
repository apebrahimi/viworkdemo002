// Admin middleware - Authentication and authorization for admin realm
use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    Error, HttpMessage, HttpResponse,
    web::Data,
};
use futures_util::future::LocalBoxFuture;
use std::future::{ready, Ready};
use std::rc::Rc;
use sqlx::PgPool;
use uuid::Uuid;
use chrono::Utc;
use serde_json::json;

use crate::admin::jwt::AdminJwtService;
use crate::admin::models::AdminRole;

// ============================================================================
// ADMIN AUTH MIDDLEWARE
// ============================================================================

pub struct AdminAuthMiddleware;

impl AdminAuthMiddleware {
    pub fn new() -> Self {
        Self
    }
}

impl<S, B> Transform<S, ServiceRequest> for AdminAuthMiddleware
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = AdminAuthMiddlewareService<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(AdminAuthMiddlewareService {
            service: Rc::new(service),
        }))
    }
}

pub struct AdminAuthMiddlewareService<S> {
    service: Rc<S>,
}

impl<S, B> Service<ServiceRequest> for AdminAuthMiddlewareService<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let service = Rc::clone(&self.service);

        Box::pin(async move {
            // Extract token from Authorization header
            let token = req.headers()
                .get("Authorization")
                .and_then(|h| h.to_str().ok())
                .and_then(|h| {
                    if h.starts_with("Bearer ") {
                        Some(h[7..].to_string())
                    } else {
                        None
                    }
                });

            let token = match token {
                Some(t) => t,
                None => {
                    return Ok(ServiceResponse::new(
                        req.into_parts().0,
                        HttpResponse::Unauthorized().json(json!({
                            "success": false,
                            "message": "No authorization token provided"
                        }))
                    ));
                }
            };

            // Validate token
            let jwt_service = match AdminJwtService::new() {
                Ok(s) => s,
                Err(_) => {
                    return Ok(ServiceResponse::new(
                        req.into_parts().0,
                        HttpResponse::InternalServerError().json(json!({
                            "success": false,
                            "message": "Configuration error"
                        }))
                    ));
                }
            };

            let claims = match jwt_service.validate_token(&token) {
                Ok(c) => c,
                Err(_) => {
                    return Ok(ServiceResponse::new(
                        req.into_parts().0,
                        HttpResponse::Unauthorized().json(json!({
                            "success": false,
                            "message": "Invalid or expired token"
                        }))
                    ));
                }
            };

            // Check if session is still valid in database
            if let Some(pool) = req.app_data::<Data<PgPool>>() {
                let session_valid = sqlx::query_scalar::<_, bool>(
                    r#"
                    SELECT EXISTS(
                        SELECT 1 FROM admin_sessions 
                        WHERE id = $1::uuid 
                        AND admin_user_id = $2::uuid
                        AND token_hash = $3
                        AND is_revoked = false 
                        AND idle_expires_at > NOW()
                    )
                    "#
                )
                .bind(Uuid::parse_str(&claims.session_id).unwrap_or_default())
                .bind(Uuid::parse_str(&claims.sub).unwrap_or_default())
                .bind(&token)
                .fetch_one(pool.get_ref())
                .await
                .unwrap_or(false);

                if !session_valid {
                    return Ok(ServiceResponse::new(
                        req.into_parts().0,
                        HttpResponse::Unauthorized().json(json!({
                            "success": false,
                            "message": "Session expired or revoked"
                        }))
                    ));
                }

                // Update last activity time
                let _ = sqlx::query(
                    "UPDATE admin_sessions SET last_activity_at = NOW() WHERE id = $1::uuid"
                )
                .bind(Uuid::parse_str(&claims.session_id).unwrap_or_default())
                .execute(pool.get_ref())
                .await;
            }

            // Store claims in request extensions for later use
            req.extensions_mut().insert(claims);

            // Continue to the actual handler
            let res = service.call(req).await?;
            Ok(res)
        })
    }
}

// ============================================================================
// ADMIN AUDIT MIDDLEWARE
// ============================================================================

pub struct AdminAuditMiddleware;

impl AdminAuditMiddleware {
    pub fn new() -> Self {
        Self
    }
}

impl<S, B> Transform<S, ServiceRequest> for AdminAuditMiddleware
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = AdminAuditMiddlewareService<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(AdminAuditMiddlewareService {
            service: Rc::new(service),
        }))
    }
}

pub struct AdminAuditMiddlewareService<S> {
    service: Rc<S>,
}

impl<S, B> Service<ServiceRequest> for AdminAuditMiddlewareService<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let service = Rc::clone(&self.service);
        
        Box::pin(async move {
            // Extract admin user ID from claims if available
            let admin_user_id = req.extensions()
                .get::<crate::admin::models::AdminClaims>()
                .and_then(|claims| Uuid::parse_str(&claims.sub).ok());

            let method = req.method().to_string();
            let path = req.path().to_string();
            let client_ip = get_client_ip(&req);
            let user_agent = req.headers()
                .get("User-Agent")
                .and_then(|h| h.to_str().ok())
                .map(|s| s.to_string());

            // Call the actual handler
            let res = service.call(req).await?;

            // Log the action (if we have a database connection)
            if let Some(pool) = res.request().app_data::<Data<PgPool>>() {
                let status_code = res.status().as_u16();
                let success = status_code >= 200 && status_code < 300;
                
                let _ = sqlx::query(
                    r#"
                    INSERT INTO admin_audit_logs (
                        admin_user_id, action, target_type, details, 
                        ip_address, user_agent, success, created_at
                    ) VALUES ($1, $2, $3, $4, $5::inet, $6, $7, NOW())
                    "#
                )
                .bind(admin_user_id)
                .bind(format!("{} {}", method, path))
                .bind("api_request")
                .bind(json!({"status_code": status_code}))
                .bind(&client_ip)
                .bind(user_agent)
                .bind(success)
                .execute(pool.get_ref())
                .await;
            }

            Ok(res)
        })
    }
}

// ============================================================================
// IP ALLOWLIST MIDDLEWARE
// ============================================================================

pub struct IpAllowlistMiddleware {
    allowlist: Vec<String>,
}

impl IpAllowlistMiddleware {
    pub fn new(allowlist: Vec<String>) -> Self {
        Self { allowlist }
    }
}

impl<S, B> Transform<S, ServiceRequest> for IpAllowlistMiddleware
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = IpAllowlistMiddlewareService<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(IpAllowlistMiddlewareService {
            service: Rc::new(service),
            allowlist: self.allowlist.clone(),
        }))
    }
}

pub struct IpAllowlistMiddlewareService<S> {
    service: Rc<S>,
    allowlist: Vec<String>,
}

impl<S, B> Service<ServiceRequest> for IpAllowlistMiddlewareService<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let service = Rc::clone(&self.service);
        let allowlist = self.allowlist.clone();

        Box::pin(async move {
            let client_ip = get_client_ip(&req);
            
            if !crate::admin::jwt::is_ip_allowed(&client_ip, &allowlist) {
                return Ok(ServiceResponse::new(
                    req.into_parts().0,
                    HttpResponse::Forbidden().json(json!({
                        "success": false,
                        "message": "Access denied from this IP address"
                    }))
                ));
            }

            let res = service.call(req).await?;
            Ok(res)
        })
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

fn get_client_ip(req: &ServiceRequest) -> String {
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
