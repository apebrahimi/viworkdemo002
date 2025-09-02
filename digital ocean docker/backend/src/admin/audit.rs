// Admin audit logging
use sqlx::PgPool;
use uuid::Uuid;
use serde_json::Value;

pub async fn log_admin_action(
    pool: &PgPool,
    admin_user_id: Option<Uuid>,
    action: &str,
    target_type: Option<&str>,
    target_id: Option<&str>,
    details: Value,
    ip_address: Option<&str>,
    user_agent: Option<&str>,
    success: bool,
    error_message: Option<&str>,
) {
    let result = sqlx::query(
        r#"
        INSERT INTO admin_audit_logs (
            admin_user_id, action, target_type, target_id, details,
            ip_address, user_agent, success, error_message, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6::inet, $7, $8, $9, NOW())
        "#
    )
    .bind(admin_user_id)
    .bind(action)
    .bind(target_type)
    .bind(target_id)
    .bind(details)
    .bind(ip_address)
    .bind(user_agent)
    .bind(success)
    .bind(error_message)
    .execute(pool)
    .await;

    if let Err(e) = result {
        eprintln!("Failed to log admin action: {}", e);
    }
}
