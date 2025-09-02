// Admin RBAC (Role-Based Access Control)
use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    Error, HttpMessage, HttpResponse,
};
use futures_util::future::LocalBoxFuture;
use std::future::{ready, Ready};
use std::rc::Rc;
use serde_json::json;

use crate::admin::models::{AdminClaims, AdminRole};

pub struct RequireRole {
    required_role: String,
}

impl RequireRole {
    pub fn new(role: &str) -> Self {
        Self {
            required_role: role.to_string(),
        }
    }
}

impl<S, B> Transform<S, ServiceRequest> for RequireRole
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = RequireRoleService<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(RequireRoleService {
            service: Rc::new(service),
            required_role: self.required_role.clone(),
        }))
    }
}

pub struct RequireRoleService<S> {
    service: Rc<S>,
    required_role: String,
}

impl<S, B> Service<ServiceRequest> for RequireRoleService<S>
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
        let required_role = self.required_role.clone();

        Box::pin(async move {
            // Get claims from request extensions (set by AdminAuthMiddleware)
            let claims = req.extensions()
                .get::<AdminClaims>()
                .cloned();

            let claims = match claims {
                Some(c) => c,
                None => {
                    return Ok(ServiceResponse::new(
                        req.into_parts().0,
                        HttpResponse::Unauthorized().json(json!({
                            "success": false,
                            "message": "Authentication required"
                        }))
                    ));
                }
            };

            // Check if user has required role
            let user_role = AdminRole::from_str(&claims.role);
            let required = AdminRole::from_str(&required_role);

            let has_permission = match (user_role, required) {
                (Some(AdminRole::Admin), _) => true, // Admin has all permissions
                (Some(user), Some(req)) => {
                    match req {
                        AdminRole::Admin => user == AdminRole::Admin,
                        AdminRole::Operator => matches!(user, AdminRole::Admin | AdminRole::Operator),
                        AdminRole::Auditor => true, // All roles can do auditor actions
                    }
                }
                _ => false,
            };

            if !has_permission {
                return Ok(ServiceResponse::new(
                    req.into_parts().0,
                    HttpResponse::Forbidden().json(json!({
                        "success": false,
                        "message": format!("Insufficient permissions. Required role: {}", required_role)
                    }))
                ));
            }

            let res = service.call(req).await?;
            Ok(res)
        })
    }
}

pub struct RequirePermission {
    resource: String,
    action: String,
}

impl RequirePermission {
    pub fn new(resource: &str, action: &str) -> Self {
        Self {
            resource: resource.to_string(),
            action: action.to_string(),
        }
    }
}

impl<S, B> Transform<S, ServiceRequest> for RequirePermission
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = RequirePermissionService<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(RequirePermissionService {
            service: Rc::new(service),
            resource: self.resource.clone(),
            action: self.action.clone(),
        }))
    }
}

pub struct RequirePermissionService<S> {
    service: Rc<S>,
    resource: String,
    action: String,
}

impl<S, B> Service<ServiceRequest> for RequirePermissionService<S>
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
        let resource = self.resource.clone();
        let action = self.action.clone();

        Box::pin(async move {
            // Get claims from request extensions
            let claims = req.extensions()
                .get::<AdminClaims>()
                .cloned();

            let claims = match claims {
                Some(c) => c,
                None => {
                    return Ok(ServiceResponse::new(
                        req.into_parts().0,
                        HttpResponse::Unauthorized().json(json!({
                            "success": false,
                            "message": "Authentication required"
                        }))
                    ));
                }
            };

            // Check if user role has permission for this resource and action
            let user_role = AdminRole::from_str(&claims.role);
            
            let has_permission = match user_role {
                Some(role) => role.has_permission(&resource, &action),
                None => false,
            };

            if !has_permission {
                return Ok(ServiceResponse::new(
                    req.into_parts().0,
                    HttpResponse::Forbidden().json(json!({
                        "success": false,
                        "message": format!("Permission denied for {} on {}", action, resource)
                    }))
                ));
            }

            let res = service.call(req).await?;
            Ok(res)
        })
    }
}
