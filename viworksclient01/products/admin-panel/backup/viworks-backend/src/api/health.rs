use actix_web::{web, HttpResponse, Result};
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::PgPool;
use chrono::Utc;

#[derive(Debug, Serialize, Deserialize)]
pub struct HealthResponse {
    pub status: String,
    pub timestamp: chrono::DateTime<Utc>,
    pub uptime: String,
    pub version: String,
    pub services: ServiceHealth,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ServiceHealth {
    pub database: ServiceStatus,
    pub redis: ServiceStatus,
    pub overall: ServiceStatus,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ServiceStatus {
    pub status: String,
    pub response_time: Option<u64>,
    pub error: Option<String>,
}

pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/health")
            .route("", web::get().to(health_check_simple))
            .route("/full", web::get().to(health_check))
            .route("/system-info", web::get().to(system_info))
    );
}

pub async fn health_check(pool: web::Data<PgPool>) -> Result<HttpResponse> {
    let start_time = std::time::Instant::now();
    let timestamp = Utc::now();

    // Check database health
    let db_start = std::time::Instant::now();
    let db_result = sqlx::query!("SELECT 1 as test")
        .fetch_one(pool.get_ref())
        .await;
    let db_response_time = db_start.elapsed().as_millis() as u64;

    let db_status = match db_result {
        Ok(_) => ServiceStatus {
            status: "healthy".to_string(),
            response_time: Some(db_response_time),
            error: None,
        },
        Err(e) => ServiceStatus {
            status: "unhealthy".to_string(),
            response_time: Some(db_response_time),
            error: Some(e.to_string()),
        },
    };

    // Check Redis health (placeholder - would need Redis client)
    let redis_status = ServiceStatus {
        status: "unknown".to_string(),
        response_time: None,
        error: Some("Redis client not implemented".to_string()),
    };

    // Determine overall status
    let overall_status = if db_status.status == "healthy" {
        "healthy"
    } else {
        "degraded"
    };

    let overall = ServiceStatus {
        status: overall_status.to_string(),
        response_time: Some(start_time.elapsed().as_millis() as u64),
        error: None,
    };

    let health_response = HealthResponse {
        status: overall_status.to_string(),
        timestamp,
        uptime: get_uptime(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        services: ServiceHealth {
            database: db_status,
            redis: redis_status,
            overall,
        },
    };

    let status_code = match overall_status {
        "healthy" => actix_web::http::StatusCode::OK,
        "degraded" => actix_web::http::StatusCode::SERVICE_UNAVAILABLE,
        _ => actix_web::http::StatusCode::INTERNAL_SERVER_ERROR,
    };

    Ok(HttpResponse::build(status_code).json(health_response))
}

pub async fn health_check_simple() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().json(json!({
        "status": "ok",
        "timestamp": Utc::now().to_rfc3339(),
        "version": env!("CARGO_PKG_VERSION")
    })))
}

fn get_uptime() -> String {
    // This is a placeholder - in a real implementation, you'd track the actual start time
    // For now, return a placeholder
    "0h 0m 0s".to_string()
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo {
    pub version: String,
    pub environment: String,
}

pub async fn system_info() -> Result<HttpResponse> {
    let system_info = SystemInfo {
        version: env!("CARGO_PKG_VERSION").to_string(),
        environment: std::env::var("RUST_ENV").unwrap_or_else(|_| "development".to_string()),
    };

    Ok(HttpResponse::Ok().json(system_info))
}
