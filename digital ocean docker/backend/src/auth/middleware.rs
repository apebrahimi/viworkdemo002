use actix_web::{
    dev::{ServiceRequest, ServiceResponse},
    http::header::{self, HeaderValue},
    web::Data,
    Error,
};
use futures_util::future::{ready, LocalBoxFuture, Ready};
use std::future::Future;
use std::pin::Pin;
use crate::auth::jwt::JwtService;
use crate::config::AppConfig;

pub struct AuthMiddleware;

impl AuthMiddleware {
    pub fn new() -> Self {
        Self
    }
}

pub struct RoleMiddleware {
    required_role: String,
}

impl RoleMiddleware {
    pub fn new(required_role: String) -> Self {
        Self { required_role }
    }
}

pub fn get_claims_from_request(req: &ServiceRequest) -> Option<String> {
    req.headers()
        .get(header::AUTHORIZATION)
        .and_then(|auth_header| {
            auth_header
                .to_str()
                .ok()
                .and_then(|auth_str| {
                    if auth_str.starts_with("Bearer ") {
                        Some(auth_str[7..].to_string())
                    } else {
                        None
                    }
                })
        })
}
