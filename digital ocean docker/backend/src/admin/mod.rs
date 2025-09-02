// Admin module - Separate authentication realm for admin panel
pub mod auth;
pub mod middleware;
pub mod models;
pub mod jwt;
pub mod audit;
pub mod rbac;

use actix_web::web;

pub fn configure_admin_routes(cfg: &mut web::ServiceConfig) {
    // Admin API routes under /admin/api
    cfg.service(
        web::scope("/admin/api")
            // Health check (no auth required for monitoring)
            .route("/health", web::get().to(health_check))
            // Auth routes (no auth middleware)
            .service(
                web::scope("/auth")
                    .route("/login", web::post().to(auth::admin_login))
                    .route("/logout", web::post().to(auth::admin_logout))
                    .route("/refresh", web::post().to(auth::admin_refresh_token))
                    .route("/me", web::get().to(auth::get_current_admin))
            )
            // Protected routes (require admin auth)
            .service(
                web::scope("")
                    .wrap(middleware::AdminAuthMiddleware::new())
                    .wrap(middleware::AdminAuditMiddleware::new())
                    // User management
                    .service(
                        web::scope("/users")
                            .route("", web::get().to(list_users))
                            .route("", web::post().to(create_user))
                            .route("/{id}", web::get().to(get_user))
                            .route("/{id}", web::put().to(update_user))
                            .route("/{id}", web::delete().to(delete_user))
                    )
                    // Session management
                    .service(
                        web::scope("/sessions")
                            .route("", web::get().to(list_sessions))
                            .route("/{id}/terminate", web::post().to(terminate_session))
                    )
                    // Audit logs
                    .service(
                        web::scope("/audit")
                            .route("", web::get().to(list_audit_logs))
                            .route("/export", web::get().to(export_audit_logs))
                    )
                    // Admin user management (ADMIN role only)
                    .service(
                        web::scope("/admins")
                            .wrap(rbac::RequireRole::new("ADMIN"))
                            .route("", web::get().to(list_admin_users))
                            .route("", web::post().to(create_admin_user))
                            .route("/{id}", web::put().to(update_admin_user))
                            .route("/{id}", web::delete().to(delete_admin_user))
                    )
            )
    );
}

use actix_web::HttpResponse;
use serde_json::json;

async fn health_check() -> HttpResponse {
    HttpResponse::Ok().json(json!({
        "status": "healthy",
        "service": "admin-api",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}

// Placeholder handlers - will be implemented in separate files
async fn list_users() -> HttpResponse {
    HttpResponse::Ok().json(json!({"message": "List users"}))
}

async fn create_user() -> HttpResponse {
    HttpResponse::Ok().json(json!({"message": "Create user"}))
}

async fn get_user() -> HttpResponse {
    HttpResponse::Ok().json(json!({"message": "Get user"}))
}

async fn update_user() -> HttpResponse {
    HttpResponse::Ok().json(json!({"message": "Update user"}))
}

async fn delete_user() -> HttpResponse {
    HttpResponse::Ok().json(json!({"message": "Delete user"}))
}

async fn list_sessions() -> HttpResponse {
    HttpResponse::Ok().json(json!({"message": "List sessions"}))
}

async fn terminate_session() -> HttpResponse {
    HttpResponse::Ok().json(json!({"message": "Terminate session"}))
}

async fn list_audit_logs() -> HttpResponse {
    HttpResponse::Ok().json(json!({"message": "List audit logs"}))
}

async fn export_audit_logs() -> HttpResponse {
    HttpResponse::Ok().json(json!({"message": "Export audit logs"}))
}

async fn list_admin_users() -> HttpResponse {
    HttpResponse::Ok().json(json!({"message": "List admin users"}))
}

async fn create_admin_user() -> HttpResponse {
    HttpResponse::Ok().json(json!({"message": "Create admin user"}))
}

async fn update_admin_user() -> HttpResponse {
    HttpResponse::Ok().json(json!({"message": "Update admin user"}))
}

async fn delete_admin_user() -> HttpResponse {
    HttpResponse::Ok().json(json!({"message": "Delete admin user"}))
}
