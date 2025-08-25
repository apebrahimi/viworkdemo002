use actix_web::{web, HttpResponse};
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, Row};
use uuid::Uuid;
use chrono::Utc;
use bcrypt::{hash, DEFAULT_COST};

#[derive(Debug, Deserialize)]
pub struct CreateUserRequest {
    pub username: String,
    pub email: String,
    pub password: String,
    pub role: String,
    pub is_active: bool,
}

#[derive(Debug, Deserialize)]
pub struct UpdateUserRequest {
    pub username: Option<String>,
    pub email: Option<String>,
    pub role: Option<String>,
    pub is_active: Option<bool>,
}

#[derive(Debug, Serialize)]
pub struct User {
    pub id: String,
    pub username: String,
    pub email: String,
    pub role: String,
    pub is_active: bool,
    pub last_login_at: Option<String>,
    pub failed_login_attempts: i32,
    pub locked_until: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

pub async fn get_users(
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, actix_web::Error> {
    let users = sqlx::query(
        r#"
        SELECT id, username, email, role::text, is_active, last_login_at, 
               failed_login_attempts, locked_until, created_at, updated_at
        FROM users 
        ORDER BY created_at DESC
        "#
    )
    .fetch_all(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    let users: Vec<User> = users
        .into_iter()
        .map(|row| User {
            id: row.get::<Uuid, _>("id").to_string(),
            username: row.get("username"),
            email: row.get("email"),
            role: row.get("role"),
            is_active: row.get("is_active"),
            last_login_at: row.get::<Option<chrono::DateTime<Utc>>, _>("last_login_at")
                .map(|dt| dt.to_rfc3339()),
            failed_login_attempts: row.get("failed_login_attempts"),
            locked_until: row.get::<Option<chrono::DateTime<Utc>>, _>("locked_until")
                .map(|dt| dt.to_rfc3339()),
            created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
            updated_at: row.get::<chrono::DateTime<Utc>, _>("updated_at").to_rfc3339(),
        })
        .collect();

    Ok(HttpResponse::Ok().json(users))
}

pub async fn get_user(
    pool: web::Data<PgPool>,
    path: web::Path<String>,
) -> Result<HttpResponse, actix_web::Error> {
    let user_id = path.into_inner();
    let user_id_uuid = Uuid::parse_str(&user_id)
        .map_err(|_| actix_web::error::ErrorBadRequest("Invalid user ID"))?;

    let user = sqlx::query(
        r#"
        SELECT id, username, email, role::text, is_active, last_login_at, 
               failed_login_attempts, locked_until, created_at, updated_at
        FROM users 
        WHERE id = $1
        "#
    )
    .bind(user_id_uuid)
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    match user {
        Some(row) => {
            let user = User {
                id: row.get::<Uuid, _>("id").to_string(),
                username: row.get("username"),
                email: row.get("email"),
                role: row.get("role"),
                is_active: row.get("is_active"),
                last_login_at: row.get::<Option<chrono::DateTime<Utc>>, _>("last_login_at")
                    .map(|dt| dt.to_rfc3339()),
                failed_login_attempts: row.get("failed_login_attempts"),
                locked_until: row.get::<Option<chrono::DateTime<Utc>>, _>("locked_until")
                    .map(|dt| dt.to_rfc3339()),
                created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
                updated_at: row.get::<chrono::DateTime<Utc>, _>("updated_at").to_rfc3339(),
            };
            Ok(HttpResponse::Ok().json(user))
        }
        None => Ok(HttpResponse::NotFound().json(serde_json::json!({
            "error": "User not found"
        })))
    }
}

pub async fn create_user(
    pool: web::Data<PgPool>,
    user_data: web::Json<CreateUserRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let user_id = Uuid::new_v4();
    let password_hash = hash(&user_data.password, DEFAULT_COST)
        .map_err(|e| {
            eprintln!("Password hashing error: {}", e);
            actix_web::error::ErrorInternalServerError("Password hashing failed")
        })?;

    // Check if username already exists
    let existing_user = sqlx::query("SELECT id FROM users WHERE username = $1")
        .bind(&user_data.username)
        .fetch_optional(pool.get_ref())
        .await
        .map_err(|e| {
            eprintln!("Database error: {}", e);
            actix_web::error::ErrorInternalServerError("Database error")
        })?;

    if existing_user.is_some() {
        return Ok(HttpResponse::Conflict().json(serde_json::json!({
            "error": "Username already exists"
        })));
    }

    // Check if email already exists
    let existing_email = sqlx::query("SELECT id FROM users WHERE email = $1")
        .bind(&user_data.email)
        .fetch_optional(pool.get_ref())
        .await
        .map_err(|e| {
            eprintln!("Database error: {}", e);
            actix_web::error::ErrorInternalServerError("Database error")
        })?;

    if existing_email.is_some() {
        return Ok(HttpResponse::Conflict().json(serde_json::json!({
            "error": "Email already exists"
        })));
    }

    let user = sqlx::query(
        r#"
        INSERT INTO users (id, username, email, password_hash, role, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5::user_role, $6, NOW(), NOW())
        RETURNING id, username, email, role::text, is_active, last_login_at, 
                  failed_login_attempts, locked_until, created_at, updated_at
        "#
    )
    .bind(user_id)
    .bind(&user_data.username)
    .bind(&user_data.email)
    .bind(&password_hash)
    .bind(&user_data.role)
    .bind(user_data.is_active)
    .fetch_one(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    let created_user = User {
        id: user.get::<Uuid, _>("id").to_string(),
        username: user.get("username"),
        email: user.get("email"),
        role: user.get("role"),
        is_active: user.get("is_active"),
        last_login_at: user.get::<Option<chrono::DateTime<Utc>>, _>("last_login_at")
            .map(|dt| dt.to_rfc3339()),
        failed_login_attempts: user.get("failed_login_attempts"),
        locked_until: user.get::<Option<chrono::DateTime<Utc>>, _>("locked_until")
            .map(|dt| dt.to_rfc3339()),
        created_at: user.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
        updated_at: user.get::<chrono::DateTime<Utc>, _>("updated_at").to_rfc3339(),
    };

    Ok(HttpResponse::Created().json(created_user))
}

pub async fn update_user(
    pool: web::Data<PgPool>,
    path: web::Path<String>,
    user_data: web::Json<UpdateUserRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let user_id = path.into_inner();
    let user_id_uuid = Uuid::parse_str(&user_id)
        .map_err(|_| actix_web::error::ErrorBadRequest("Invalid user ID"))?;

    // Check if user exists
    let existing_user = sqlx::query("SELECT id FROM users WHERE id = $1")
        .bind(user_id_uuid)
        .fetch_optional(pool.get_ref())
        .await
        .map_err(|e| {
            eprintln!("Database error: {}", e);
            actix_web::error::ErrorInternalServerError("Database error")
        })?;

    if existing_user.is_none() {
        return Ok(HttpResponse::NotFound().json(serde_json::json!({
            "error": "User not found"
        })));
    }

    // Build dynamic update query
    let mut query_parts = Vec::new();
    let mut param_count = 1;

    if let Some(username) = &user_data.username {
        query_parts.push(format!("username = ${}", param_count));
        param_count += 1;
    }

    if let Some(email) = &user_data.email {
        query_parts.push(format!("email = ${}", param_count));
        param_count += 1;
    }

    if let Some(role) = &user_data.role {
        query_parts.push(format!("role = ${}::user_role", param_count));
        param_count += 1;
    }

    if let Some(is_active) = user_data.is_active {
        query_parts.push(format!("is_active = ${}", param_count));
        param_count += 1;
    }

    if query_parts.is_empty() {
        return Ok(HttpResponse::BadRequest().json(serde_json::json!({
            "error": "No fields to update"
        })));
    }

    query_parts.push("updated_at = NOW()".to_string());

    let query = format!(
        r#"
        UPDATE users 
        SET {}
        WHERE id = ${}
        RETURNING id, username, email, role::text, is_active, last_login_at, 
                  failed_login_attempts, locked_until, created_at, updated_at
        "#,
        query_parts.join(", "),
        param_count
    );

    let mut query_builder = sqlx::query(&query);
    
    if let Some(username) = &user_data.username {
        query_builder = query_builder.bind(username);
    }
    if let Some(email) = &user_data.email {
        query_builder = query_builder.bind(email);
    }
    if let Some(role) = &user_data.role {
        query_builder = query_builder.bind(role);
    }
    if let Some(is_active) = user_data.is_active {
        query_builder = query_builder.bind(is_active);
    }
    
    query_builder = query_builder.bind(user_id_uuid);

    let user = query_builder
        .fetch_one(pool.get_ref())
        .await
        .map_err(|e| {
            eprintln!("Database error: {}", e);
            actix_web::error::ErrorInternalServerError("Database error")
        })?;

    let updated_user = User {
        id: user.get::<Uuid, _>("id").to_string(),
        username: user.get("username"),
        email: user.get("email"),
        role: user.get("role"),
        is_active: user.get("is_active"),
        last_login_at: user.get::<Option<chrono::DateTime<Utc>>, _>("last_login_at")
            .map(|dt| dt.to_rfc3339()),
        failed_login_attempts: user.get("failed_login_attempts"),
        locked_until: user.get::<Option<chrono::DateTime<Utc>>, _>("locked_until")
            .map(|dt| dt.to_rfc3339()),
        created_at: user.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
        updated_at: user.get::<chrono::DateTime<Utc>, _>("updated_at").to_rfc3339(),
    };

    Ok(HttpResponse::Ok().json(updated_user))
}

pub async fn delete_user(
    pool: web::Data<PgPool>,
    path: web::Path<String>,
) -> Result<HttpResponse, actix_web::Error> {
    let user_id = path.into_inner();
    let user_id_uuid = Uuid::parse_str(&user_id)
        .map_err(|_| actix_web::error::ErrorBadRequest("Invalid user ID"))?;

    // Check if user exists
    let existing_user = sqlx::query("SELECT id FROM users WHERE id = $1")
        .bind(user_id_uuid)
        .fetch_optional(pool.get_ref())
        .await
        .map_err(|e| {
            eprintln!("Database error: {}", e);
            actix_web::error::ErrorInternalServerError("Database error")
        })?;

    if existing_user.is_none() {
        return Ok(HttpResponse::NotFound().json(serde_json::json!({
            "error": "User not found"
        })));
    }

    // Delete user
    sqlx::query("DELETE FROM users WHERE id = $1")
        .bind(user_id_uuid)
        .execute(pool.get_ref())
        .await
        .map_err(|e| {
            eprintln!("Database error: {}", e);
            actix_web::error::ErrorInternalServerError("Database error")
        })?;

    Ok(HttpResponse::NoContent().finish())
}

pub async fn unlock_user(
    pool: web::Data<PgPool>,
    path: web::Path<String>,
) -> Result<HttpResponse, actix_web::Error> {
    let user_id = path.into_inner();
    let user_id_uuid = Uuid::parse_str(&user_id)
        .map_err(|_| actix_web::error::ErrorBadRequest("Invalid user ID"))?;

    sqlx::query(
        r#"
        UPDATE users 
        SET failed_login_attempts = 0, locked_until = NULL, updated_at = NOW()
        WHERE id = $1
        "#
    )
    .bind(user_id_uuid)
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": "User unlocked successfully"
    })))
}

pub async fn reset_user_password(
    pool: web::Data<PgPool>,
    path: web::Path<String>,
) -> Result<HttpResponse, actix_web::Error> {
    let user_id = path.into_inner();
    let user_id_uuid = Uuid::parse_str(&user_id)
        .map_err(|_| actix_web::error::ErrorBadRequest("Invalid user ID"))?;

    // Generate a random password
    let new_password = generate_random_password();
    let password_hash = hash(&new_password, DEFAULT_COST)
        .map_err(|e| {
            eprintln!("Password hashing error: {}", e);
            actix_web::error::ErrorInternalServerError("Password hashing failed")
        })?;

    sqlx::query(
        r#"
        UPDATE users 
        SET password_hash = $1, failed_login_attempts = 0, locked_until = NULL, updated_at = NOW()
        WHERE id = $2
        "#
    )
    .bind(&password_hash)
    .bind(user_id_uuid)
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": "Password reset successfully",
        "new_password": new_password
    })))
}

fn generate_random_password() -> String {
    use rand::Rng;
    const CHARSET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const PASSWORD_LEN: usize = 12;
    
    let mut rng = rand::thread_rng();
    (0..PASSWORD_LEN)
        .map(|_| {
            let idx = rng.gen_range(0..CHARSET.len());
            CHARSET[idx] as char
        })
        .collect()
}

pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/users")
            .route("", web::get().to(get_users))
            .route("", web::post().to(create_user))
            .route("/{id}", web::get().to(get_user))
            .route("/{id}", web::put().to(update_user))
            .route("/{id}", web::delete().to(delete_user))
            .route("/{id}/unlock", web::post().to(unlock_user))
            .route("/{id}/reset-password", web::post().to(reset_user_password))
    );
}
