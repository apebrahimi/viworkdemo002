use actix_web::{web, HttpResponse, Result};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use chrono::Utc;

#[derive(Debug, Serialize, Deserialize)]
pub struct SecurityAlert {
    pub id: uuid::Uuid,
    pub severity: String,
    pub title: String,
    pub description: Option<String>,
    pub created_at: chrono::DateTime<Utc>,
    pub is_resolved: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemLog {
    pub id: uuid::Uuid,
    pub level: String,
    pub message: String,
    pub source: String,
    pub created_at: chrono::DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HealthCheckResponse {
    pub status: String,
    pub timestamp: chrono::DateTime<Utc>,
    pub uptime: String,
    pub version: String,
}

pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/monitoring")
            .route("/health", web::get().to(health_check))
            .route("/alerts", web::get().to(get_security_alerts))
            .route("/logs", web::get().to(get_system_logs))
    );
}

pub async fn health_check() -> Result<HttpResponse> {
    let response = HealthCheckResponse {
        status: "healthy".to_string(),
        timestamp: Utc::now(),
        uptime: "0h 0m 0s".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    };
    
    Ok(HttpResponse::Ok().json(response))
}

pub async fn get_security_alerts(
    pool: web::Data<PgPool>,
    query: web::Query<std::collections::HashMap<String, String>>,
) -> Result<HttpResponse> {
    let page = query.get("page").and_then(|p| p.parse::<i64>().ok()).unwrap_or(1);
    let per_page = query.get("per_page").and_then(|p| p.parse::<i64>().ok()).unwrap_or(10);
    let offset = (page - 1) * per_page;

    let alerts_result = sqlx::query!(
        r#"
        SELECT id, severity::text as severity, title, description, created_at, is_resolved 
        FROM security_alerts 
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
        "#,
        per_page,
        offset
    )
    .fetch_all(pool.get_ref())
    .await;

    let total_result = sqlx::query!("SELECT COUNT(*) as count FROM security_alerts")
        .fetch_one(pool.get_ref())
        .await;

    match (alerts_result, total_result) {
        (Ok(alerts), Ok(total)) => {
            let alert_responses: Vec<SecurityAlert> = alerts
                .into_iter()
                .map(|row| SecurityAlert {
                    id: row.id,
                    severity: row.severity.unwrap_or_else(|| "low".to_string()),
                    title: row.title,
                    description: row.description,
                    created_at: row.created_at,
                    is_resolved: row.is_resolved,
                })
                .collect();

            Ok(HttpResponse::Ok().json(serde_json::json!({
                "alerts": alert_responses,
                "total": total.count.unwrap_or(0),
                "page": page,
                "per_page": per_page
            })))
        }
        _ => Ok(HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Failed to fetch security alerts"
        }))),
    }
}

pub async fn get_system_logs(
    pool: web::Data<PgPool>,
    query: web::Query<std::collections::HashMap<String, String>>,
) -> Result<HttpResponse> {
    let page = query.get("page").and_then(|p| p.parse::<i64>().ok()).unwrap_or(1);
    let per_page = query.get("per_page").and_then(|p| p.parse::<i64>().ok()).unwrap_or(10);
    let offset = (page - 1) * per_page;

    // Use audit_logs table instead of system_logs since that's what exists in the schema
    let logs_result = sqlx::query!(
        r#"
        SELECT id, action as level, details::text as message, resource_type as source, created_at 
        FROM audit_logs 
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
        "#,
        per_page,
        offset
    )
    .fetch_all(pool.get_ref())
    .await;

    let total_result = sqlx::query!("SELECT COUNT(*) as count FROM audit_logs")
        .fetch_one(pool.get_ref())
        .await;

    match (logs_result, total_result) {
        (Ok(logs), Ok(total)) => {
            let log_responses: Vec<SystemLog> = logs
                .into_iter()
                .map(|row| SystemLog {
                    id: row.id,
                    level: row.level,
                    message: row.message.unwrap_or_else(|| "No details".to_string()),
                    source: row.source.unwrap_or_else(|| "system".to_string()),
                    created_at: row.created_at,
                })
                .collect();

            Ok(HttpResponse::Ok().json(serde_json::json!({
                "logs": log_responses,
                "total": total.count.unwrap_or(0),
                "page": page,
                "per_page": per_page
            })))
        }
        _ => Ok(HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Failed to fetch system logs"
        }))),
    }
}
