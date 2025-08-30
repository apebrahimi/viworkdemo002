use actix_web::{web, HttpResponse, Result};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;
use chrono::Utc;

#[derive(Debug, Serialize, Deserialize)]
pub struct SessionResponse {
    pub id: Uuid,
    pub user_id: Uuid,
    pub username: String,
    pub expires_at: chrono::DateTime<Utc>,
    pub created_at: chrono::DateTime<Utc>,
    pub is_revoked: bool,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SessionListResponse {
    pub sessions: Vec<SessionResponse>,
    pub total: i64,
    pub page: i64,
    pub per_page: i64,
}

pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/sessions")
            .route("", web::get().to(list_sessions))
            .route("/{id}", web::get().to(get_session))
            .route("/{id}/revoke", web::post().to(revoke_session))
            .route("/user/{user_id}", web::get().to(get_user_sessions))
            .route("/user/{user_id}/revoke-all", web::post().to(revoke_user_sessions))
            .route("/cleanup", web::post().to(cleanup_expired_sessions))
    );
}

pub async fn list_sessions(
    pool: web::Data<PgPool>,
    query: web::Query<std::collections::HashMap<String, String>>,
) -> Result<HttpResponse> {
    let page = query.get("page").and_then(|p| p.parse::<i64>().ok()).unwrap_or(1);
    let per_page = query.get("per_page").and_then(|p| p.parse::<i64>().ok()).unwrap_or(10);
    let offset = (page - 1) * per_page;

    let sessions_result = sqlx::query!(
        r#"
        SELECT 
            s.id, s.user_id, u.username, s.expires_at, s.created_at, 
            s.is_revoked, s.ip_address::text as ip_address, s.user_agent
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        ORDER BY s.created_at DESC 
        LIMIT $1 OFFSET $2
        "#,
        per_page,
        offset
    )
    .fetch_all(pool.get_ref())
    .await;

    let total_result = sqlx::query!("SELECT COUNT(*) as count FROM user_sessions")
        .fetch_one(pool.get_ref())
        .await;

    match (sessions_result, total_result) {
        (Ok(sessions), Ok(total)) => {
            let session_responses: Vec<SessionResponse> = sessions
                .into_iter()
                .map(|row| SessionResponse {
                    id: row.id,
                    user_id: row.user_id,
                    username: row.username,
                    expires_at: row.expires_at,
                    created_at: row.created_at,
                    is_revoked: row.is_revoked,
                    ip_address: row.ip_address,
                    user_agent: row.user_agent,
                })
                .collect();

            Ok(HttpResponse::Ok().json(SessionListResponse {
                sessions: session_responses,
                total: total.count.unwrap_or(0),
                page,
                per_page,
            }))
        }
        _ => Ok(HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Failed to fetch sessions"
        }))),
    }
}

pub async fn get_session(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse> {
    let session_id = path.into_inner();

    let session_result = sqlx::query!(
        r#"
        SELECT 
            s.id, s.user_id, u.username, s.expires_at, s.created_at, 
            s.is_revoked, s.ip_address::text as ip_address, s.user_agent
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = $1
        "#,
        session_id
    )
    .fetch_optional(pool.get_ref())
    .await;

    match session_result {
        Ok(Some(session)) => {
            let session_response = SessionResponse {
                id: session.id,
                user_id: session.user_id,
                username: session.username,
                expires_at: session.expires_at,
                created_at: session.created_at,
                is_revoked: session.is_revoked,
                ip_address: session.ip_address,
                user_agent: session.user_agent,
            };
            Ok(HttpResponse::Ok().json(session_response))
        }
        Ok(None) => Ok(HttpResponse::NotFound().json(serde_json::json!({
            "error": "Session not found"
        }))),
        _ => Ok(HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Failed to fetch session"
        }))),
    }
}

pub async fn revoke_session(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse> {
    let session_id = path.into_inner();

    let update_result = sqlx::query!(
        "UPDATE user_sessions SET is_revoked = true WHERE id = $1",
        session_id
    )
    .execute(pool.get_ref())
    .await;

    match update_result {
        Ok(result) => {
            if result.rows_affected() > 0 {
                Ok(HttpResponse::Ok().json(serde_json::json!({
                    "message": "Session revoked successfully"
                })))
            } else {
                Ok(HttpResponse::NotFound().json(serde_json::json!({
                    "error": "Session not found"
                })))
            }
        }
        _ => Ok(HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Failed to revoke session"
        }))),
    }
}

pub async fn revoke_user_sessions(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse> {
    let user_id = path.into_inner();

    let update_result = sqlx::query!(
        "UPDATE user_sessions SET is_revoked = true WHERE user_id = $1",
        user_id
    )
    .execute(pool.get_ref())
    .await;

    match update_result {
        Ok(result) => {
            Ok(HttpResponse::Ok().json(serde_json::json!({
                "message": format!("Revoked {} sessions for user", result.rows_affected())
            })))
        }
        _ => Ok(HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Failed to revoke user sessions"
        }))),
    }
}

pub async fn cleanup_expired_sessions(
    pool: web::Data<PgPool>,
) -> Result<HttpResponse> {
    let delete_result = sqlx::query!(
        "DELETE FROM user_sessions WHERE expires_at < $1",
        Utc::now()
    )
    .execute(pool.get_ref())
    .await;

    match delete_result {
        Ok(result) => {
            Ok(HttpResponse::Ok().json(serde_json::json!({
                "message": format!("Cleaned up {} expired sessions", result.rows_affected())
            })))
        }
        _ => Ok(HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Failed to cleanup expired sessions"
        }))),
    }
}

pub async fn get_user_sessions(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    query: web::Query<std::collections::HashMap<String, String>>,
) -> Result<HttpResponse> {
    let user_id = path.into_inner();
    let page = query.get("page").and_then(|p| p.parse::<i64>().ok()).unwrap_or(1);
    let per_page = query.get("per_page").and_then(|p| p.parse::<i64>().ok()).unwrap_or(10);
    let offset = (page - 1) * per_page;

    let sessions_result = sqlx::query!(
        r#"
        SELECT 
            s.id, s.user_id, u.username, s.expires_at, s.created_at, 
            s.is_revoked, s.ip_address::text as ip_address, s.user_agent
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.user_id = $1
        ORDER BY s.created_at DESC 
        LIMIT $2 OFFSET $3
        "#,
        user_id,
        per_page,
        offset
    )
    .fetch_all(pool.get_ref())
    .await;

    let total_result = sqlx::query!(
        "SELECT COUNT(*) as count FROM user_sessions WHERE user_id = $1",
        user_id
    )
    .fetch_one(pool.get_ref())
    .await;

    match (sessions_result, total_result) {
        (Ok(sessions), Ok(total)) => {
            let session_responses: Vec<SessionResponse> = sessions
                .into_iter()
                .map(|row| SessionResponse {
                    id: row.id,
                    user_id: row.user_id,
                    username: row.username,
                    expires_at: row.expires_at,
                    created_at: row.created_at,
                    is_revoked: row.is_revoked,
                    ip_address: row.ip_address,
                    user_agent: row.user_agent,
                })
                .collect();

            Ok(HttpResponse::Ok().json(SessionListResponse {
                sessions: session_responses,
                total: total.count.unwrap_or(0),
                page,
                per_page,
            }))
        }
        _ => Ok(HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Failed to fetch user sessions"
        }))),
    }
}
