use actix_web::{web, HttpResponse};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use sqlx::{PgPool, Row};
use anyhow::Result;
use sqlx::types::ipnetwork::IpNetwork;
use chrono::Utc;
use crate::models::Client;

pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/clients")
            .route("", web::get().to(list_clients))
            .route("", web::post().to(create_client))
            .route("/{id}", web::get().to(get_client))
            .route("/{id}", web::put().to(update_client))
            .route("/{id}", web::delete().to(delete_client))
            .route("/{id}/status", web::get().to(get_client_status))
            .route("/{id}/connect", web::post().to(connect_client))
            .route("/{id}/disconnect", web::post().to(disconnect_client))
            .route("/{id}/disconnect-session", web::post().to(disconnect_client_session))
            .route("/{id}/logs", web::post().to(submit_client_log))
    );
}

#[derive(Debug, Deserialize)]
pub struct CreateClientRequest {
    pub name: String,
    pub platform: String,
    pub version: String,
    pub ip_address: Option<String>,
    pub mac_address: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UpdateClientRequest {
    pub name: Option<String>,
    pub platform: Option<String>,
    pub version: Option<String>,
    pub ip_address: Option<String>,
    pub mac_address: Option<String>,
    pub status: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ClientResponse {
    pub id: String,
    pub name: String,
    pub platform: String,
    pub version: String,
    pub ip_address: Option<String>,
    pub mac_address: Option<String>,
    pub status: String,
    pub last_seen: Option<String>,
    pub connection_count: i32,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize)]
pub struct ClientListResponse {
    pub clients: Vec<ClientResponse>,
    pub total: i64,
    pub page: i64,
    pub per_page: i64,
}

#[derive(Debug, Serialize)]
pub struct ClientStatusResponse {
    pub id: String,
    pub name: String,
    pub status: String,
    pub last_seen: Option<String>,
    pub ip_address: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ClientConnectRequest {
    pub username: String,
    pub session_token: String,
    pub client_name: String,
    pub platform: String,
    pub version: String,
    pub ip_address: String,
    pub mac_address: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ClientDisconnectRequest {
    pub username: String,
    pub session_token: String,
    pub client_id: Uuid,
}

#[derive(Debug, Deserialize)]
pub struct ClientLogRequest {
    pub username: String,
    pub session_token: String,
    pub client_id: Uuid,
    pub log_level: String,
    pub message: String,
    pub details: Option<serde_json::Value>,
}

#[derive(Debug, Serialize)]
pub struct ClientConnectResponse {
    pub success: bool,
    pub message: String,
    pub client_id: Option<Uuid>,
}

pub async fn list_clients(
    pool: web::Data<PgPool>,
    query: web::Query<std::collections::HashMap<String, String>>,
) -> Result<HttpResponse, actix_web::Error> {
    let page = query.get("page").and_then(|s| s.parse::<i64>().ok()).unwrap_or(1);
    let per_page = query.get("per_page").and_then(|s| s.parse::<i64>().ok()).unwrap_or(10);
    let offset = (page - 1) * per_page;

    // Get total count
    let total = sqlx::query(
        "SELECT COUNT(*) FROM clients"
    )
    .fetch_one(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?
    .get::<i64, _>(0);

    // Get clients with pagination
    let clients = sqlx::query(
        r#"
        SELECT id, name, platform, version, status::text, ip_address, mac_address::text as mac_address, 
               last_seen, connection_count, created_at, updated_at
        FROM clients 
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
        "#
    )
    .bind(per_page)
    .bind(offset)
    .fetch_all(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    let client_responses: Vec<ClientResponse> = clients
        .into_iter()
        .map(|row| ClientResponse {
            id: row.get::<Uuid, _>("id").to_string(),
            name: row.get::<String, _>("name"),
            platform: row.get::<String, _>("platform"),
            version: row.get::<String, _>("version"),
            ip_address: row.get::<Option<IpNetwork>, _>("ip_address").map(|ip| ip.to_string()),
            mac_address: row.get::<Option<String>, _>("mac_address"),
            status: row.get::<String, _>("status"),
            last_seen: row.get::<Option<chrono::DateTime<Utc>>, _>("last_seen").map(|dt| dt.to_rfc3339()),
            connection_count: row.get::<i32, _>("connection_count"),
            created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
            updated_at: row.get::<chrono::DateTime<Utc>, _>("updated_at").to_rfc3339(),
        })
        .collect();

    Ok(HttpResponse::Ok().json(ClientListResponse {
        clients: client_responses,
        total,
        page,
        per_page,
    }))
}

pub async fn create_client(
    pool: web::Data<PgPool>,
    req: web::Json<CreateClientRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let client_id = Uuid::new_v4();
    
    // Parse IP address if provided
    let ip_address = if let Some(ip_str) = &req.ip_address {
        ip_str.parse::<IpNetwork>().ok()
    } else {
        None
    };

    sqlx::query(
        r#"
        INSERT INTO clients (id, name, platform, version, status, ip_address, mac_address, last_seen)
        VALUES ($1, $2, $3, $4, 'offline'::client_status, $5, $6, NOW())
        "#
    )
    .bind(client_id)
    .bind(&req.name)
    .bind(&req.platform)
    .bind(&req.version)
    .bind(ip_address)
    .bind(&req.mac_address)
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    Ok(HttpResponse::Created().json(serde_json::json!({
        "success": true,
        "message": "Client created successfully",
        "client_id": client_id
    })))
}

pub async fn get_client(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, actix_web::Error> {
    let client_id = path.into_inner();

    let client = sqlx::query(
        r#"
        SELECT id, name, platform, version, status::text, ip_address, mac_address::text as mac_address, 
               last_seen, connection_count, created_at, updated_at
        FROM clients 
        WHERE id = $1
        "#
    )
    .bind(client_id)
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    match client {
        Some(row) => {
            let response = ClientResponse {
                id: row.get::<Uuid, _>("id").to_string(),
                name: row.get::<String, _>("name"),
                platform: row.get::<String, _>("platform"),
                version: row.get::<String, _>("version"),
                ip_address: row.get::<Option<IpNetwork>, _>("ip_address").map(|ip| ip.to_string()),
                mac_address: row.get::<Option<String>, _>("mac_address"),
                status: row.get::<String, _>("status"),
                last_seen: row.get::<Option<chrono::DateTime<Utc>>, _>("last_seen").map(|dt| dt.to_rfc3339()),
                connection_count: row.get::<i32, _>("connection_count"),
                created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
                updated_at: row.get::<chrono::DateTime<Utc>, _>("updated_at").to_rfc3339(),
            };
            Ok(HttpResponse::Ok().json(response))
        }
        None => {
            Ok(HttpResponse::NotFound().json(serde_json::json!({
                "success": false,
                "message": "Client not found"
            })))
        }
    }
}

pub async fn update_client(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    req: web::Json<UpdateClientRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let client_id = path.into_inner();

    // Build dynamic update query
    let mut query_parts = Vec::new();
    let mut bind_values: Vec<Box<dyn sqlx::Encode<'_, sqlx::Postgres> + Send + Sync>> = Vec::new();
    let mut param_count = 1;

    if let Some(name) = &req.name {
        query_parts.push(format!("name = ${}", param_count));
        bind_values.push(Box::new(name.clone()));
        param_count += 1;
    }

    if let Some(platform) = &req.platform {
        query_parts.push(format!("platform = ${}", param_count));
        bind_values.push(Box::new(platform.clone()));
        param_count += 1;
    }

    if let Some(version) = &req.version {
        query_parts.push(format!("version = ${}", param_count));
        bind_values.push(Box::new(version.clone()));
        param_count += 1;
    }

    if let Some(ip_address) = &req.ip_address {
        if let Ok(ip) = ip_address.parse::<IpNetwork>() {
            query_parts.push(format!("ip_address = ${}", param_count));
            bind_values.push(Box::new(ip));
            param_count += 1;
        }
    }

    if let Some(mac_address) = &req.mac_address {
        query_parts.push(format!("mac_address = ${}", param_count));
        bind_values.push(Box::new(mac_address.clone()));
        param_count += 1;
    }

    if let Some(status) = &req.status {
        query_parts.push(format!("status = ${}::client_status", param_count));
        bind_values.push(Box::new(status.clone()));
        param_count += 1;
    }

    if query_parts.is_empty() {
        return Ok(HttpResponse::BadRequest().json(serde_json::json!({
            "success": false,
            "message": "No fields to update"
        })));
    }

    query_parts.push("updated_at = NOW()".to_string());
    query_parts.push(format!("id = ${}", param_count));
    bind_values.push(Box::new(client_id));

    let query = format!(
        "UPDATE clients SET {} WHERE id = ${}",
        query_parts.join(", "),
        param_count
    );

    // Execute the update
    let result = sqlx::query(&query)
        .execute(pool.get_ref())
        .await
        .map_err(|e| {
            eprintln!("Database error: {}", e);
            actix_web::error::ErrorInternalServerError("Database error")
        })?;

    if result.rows_affected() == 0 {
        Ok(HttpResponse::NotFound().json(serde_json::json!({
            "success": false,
            "message": "Client not found"
        })))
    } else {
        Ok(HttpResponse::Ok().json(serde_json::json!({
            "success": true,
            "message": "Client updated successfully"
        })))
    }
}

pub async fn delete_client(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, actix_web::Error> {
    let client_id = path.into_inner();

    let result = sqlx::query(
        "DELETE FROM clients WHERE id = $1"
    )
    .bind(client_id)
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    if result.rows_affected() == 0 {
        Ok(HttpResponse::NotFound().json(serde_json::json!({
            "success": false,
            "message": "Client not found"
        })))
    } else {
        Ok(HttpResponse::Ok().json(serde_json::json!({
            "success": true,
            "message": "Client deleted successfully"
        })))
    }
}

pub async fn get_client_status(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, actix_web::Error> {
    let client_id = path.into_inner();

    let client = sqlx::query(
        r#"
        SELECT id, name, status::text, last_seen, ip_address
        FROM clients 
        WHERE id = $1
        "#
    )
    .bind(client_id)
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    match client {
        Some(row) => {
            let response = ClientStatusResponse {
                id: row.get::<Uuid, _>("id").to_string(),
                name: row.get::<String, _>("name"),
                status: row.get::<String, _>("status"),
                last_seen: row.get::<Option<chrono::DateTime<Utc>>, _>("last_seen").map(|dt| dt.to_rfc3339()),
                ip_address: row.get::<Option<IpNetwork>, _>("ip_address").map(|ip| ip.to_string()),
            };
            Ok(HttpResponse::Ok().json(response))
        }
        None => {
            Ok(HttpResponse::NotFound().json(serde_json::json!({
                "success": false,
                "message": "Client not found"
            })))
        }
    }
}

pub async fn connect_client(
    pool: web::Data<PgPool>,
    req: web::Json<ClientConnectRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let username = req.username.clone();
    let session_token = req.session_token.clone();

    // Validate session
    let session = sqlx::query(
        r#"
        SELECT s.id, s.user_id, s.token_hash, s.expires_at, s.created_at
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE u.username = $1 AND s.token_hash = $2 AND s.expires_at > NOW() AND s.is_revoked = false
        "#
    )
    .bind(&username)
    .bind(&session_token)
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    if session.is_none() {
        return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
            "success": false,
            "message": "Invalid session"
        })));
    }

    let session = session.unwrap();
    let user_id: Uuid = session.get("user_id");

    // Check if client already exists
    let existing_client = sqlx::query(
        r#"
        SELECT id, name, platform, version, status::text, ip_address, mac_address, 
               last_seen, connection_count, total_connection_time, created_at, updated_at
        FROM clients 
        WHERE name = $1
        "#
    )
    .bind(&req.client_name)
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    let client_id = if let Some(client) = existing_client {
        let client_id: Uuid = client.get("id");
        // Update existing client
        let ip_address = req.ip_address.parse::<IpNetwork>().ok();

        sqlx::query(
            r#"
            UPDATE clients 
            SET status = 'online'::client_status, ip_address = $1, mac_address = $2, 
                platform = $3, version = $4, last_seen = NOW(), 
                connection_count = connection_count + 1, updated_at = NOW()
            WHERE id = $5
            "#
        )
        .bind(ip_address)
        .bind(&req.mac_address)
        .bind(&req.platform)
        .bind(&req.version)
        .bind(client_id)
        .execute(pool.get_ref())
        .await
        .map_err(|e| {
            eprintln!("Database error: {}", e);
            actix_web::error::ErrorInternalServerError("Database error")
        })?;

        client_id
    } else {
        // Create new client
        let client_id = Uuid::new_v4();
        let ip_address = req.ip_address.parse::<IpNetwork>().ok();

        sqlx::query(
            r#"
            INSERT INTO clients (id, name, platform, version, status, ip_address, mac_address, last_seen, connection_count)
            VALUES ($1, $2, $3, $4, 'online'::client_status, $5, $6, NOW(), 1)
            "#
        )
        .bind(client_id)
        .bind(&req.client_name)
        .bind(&req.platform)
        .bind(&req.version)
        .bind(ip_address)
        .bind(&req.mac_address)
        .execute(pool.get_ref())
        .await
        .map_err(|e| {
            eprintln!("Database error: {}", e);
            actix_web::error::ErrorInternalServerError("Database error")
        })?;

        client_id
    };

    // Log connection event
    sqlx::query(
        r#"
        INSERT INTO connection_logs (client_id, user_id, event_type, ip_address, details)
        VALUES ($1, $2, 'connect'::connection_event_type, $3, $4)
        "#
    )
    .bind(client_id)
    .bind(user_id)
    .bind(req.ip_address.parse::<IpNetwork>().ok())
    .bind(serde_json::json!({
        "platform": req.platform,
        "version": req.version,
        "mac_address": req.mac_address
    }))
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    Ok(HttpResponse::Ok().json(ClientConnectResponse {
        success: true,
        message: "Client connected successfully".to_string(),
        client_id: Some(client_id),
    }))
}

pub async fn disconnect_client_session(
    pool: web::Data<PgPool>,
    req: web::Json<ClientDisconnectRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let username = req.username.clone();
    let session_token = req.session_token.clone();

    // Validate session
    let session = sqlx::query(
        r#"
        SELECT s.id, s.user_id, s.token_hash, s.expires_at, s.created_at
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE u.username = $1 AND s.token_hash = $2 AND s.expires_at > NOW() AND s.is_revoked = false
        "#
    )
    .bind(&username)
    .bind(&session_token)
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    if session.is_none() {
        return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
            "success": false,
            "message": "Invalid session"
        })));
    }

    let session = session.unwrap();
    let user_id: Uuid = session.get("user_id");

    // Update client status to offline
    let result = sqlx::query(
        r#"
        UPDATE clients 
        SET status = 'offline'::client_status, updated_at = NOW()
        WHERE id = $1
        "#
    )
    .bind(req.client_id)
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    if result.rows_affected() == 0 {
        return Ok(HttpResponse::NotFound().json(serde_json::json!({
            "success": false,
            "message": "Client not found"
        })));
    }

    // Log disconnection event
    sqlx::query(
        r#"
        INSERT INTO connection_logs (client_id, user_id, event_type, details)
        VALUES ($1, $2, 'disconnect'::connection_event_type, $3)
        "#
    )
    .bind(req.client_id)
    .bind(user_id)
    .bind(serde_json::json!({
        "disconnected_by": "admin_panel",
        "timestamp": chrono::Utc::now()
    }))
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    Ok(HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Client disconnected successfully"
    })))
}

pub async fn disconnect_client(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, actix_web::Error> {
    let client_id = path.into_inner();

    let result = sqlx::query(
        r#"
        UPDATE clients 
        SET status = 'offline'::client_status, updated_at = NOW()
        WHERE id = $1
        "#
    )
    .bind(client_id)
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    if result.rows_affected() == 0 {
        Ok(HttpResponse::NotFound().json(serde_json::json!({
            "success": false,
            "message": "Client not found"
        })))
    } else {
        Ok(HttpResponse::Ok().json(serde_json::json!({
            "success": true,
            "message": "Client disconnected successfully"
        })))
    }
}

pub async fn submit_client_log(
    pool: web::Data<PgPool>,
    req: web::Json<ClientLogRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let username = req.username.clone();
    let session_token = req.session_token.clone();

    // Validate session
    let session = sqlx::query(
        r#"
        SELECT s.id, s.user_id, s.token_hash, s.expires_at, s.created_at
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE u.username = $1 AND s.token_hash = $2 AND s.expires_at > NOW() AND s.is_revoked = false
        "#
    )
    .bind(&username)
    .bind(&session_token)
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    if session.is_none() {
        return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
            "success": false,
            "message": "Invalid session"
        })));
    }

    let session = session.unwrap();
    let user_id: Uuid = session.get("user_id");

    // Log the client event
    sqlx::query(
        r#"
        INSERT INTO connection_logs (client_id, user_id, event_type, details)
        VALUES ($1, $2, $3::connection_event_type, $4)
        "#
    )
    .bind(req.client_id)
    .bind(user_id)
    .bind(&req.log_level)
    .bind(serde_json::json!({
        "message": req.message,
        "details": req.details,
        "timestamp": chrono::Utc::now()
    }))
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    Ok(HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "message": "Log submitted successfully"
    })))
}
