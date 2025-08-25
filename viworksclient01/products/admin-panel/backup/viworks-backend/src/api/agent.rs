use actix_web::{web, HttpResponse};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

#[derive(Debug, Deserialize)]
pub struct CreateUserRequest {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct SpawnContainerRequest {
    pub username: String,
    pub session_id: String,
}

#[derive(Debug, Deserialize)]
pub struct TerminateSessionRequest {
    pub session_id: String,
}

#[derive(Debug, Serialize)]
pub struct CreateUserResponse {
    pub ok: bool,
    pub message: String,
}

#[derive(Debug, Serialize)]
pub struct SpawnContainerResponse {
    pub url: String,
    pub port: u16,
    pub container_id: String,
}

#[derive(Debug, Serialize)]
pub struct TerminateSessionResponse {
    pub terminated: bool,
    pub message: String,
}

// Mock Gateway Agent endpoints for demo purposes
pub async fn create_user(
    pool: web::Data<PgPool>,
    req: web::Json<CreateUserRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let username = req.username.clone();
    let _password = req.password.clone();
    
    // For demo purposes, simulate VPN user creation
    // In production, this would call the actual Gateway Agent
    
    // Log the action
    let _ = sqlx::query!(
        r#"
        INSERT INTO audit_logs (action, resource_type, resource_id, details, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        "#,
        "VPN_USER_CREATED",
        "user",
        username,
        serde_json::json!({
            "username": username,
            "action": "vpn_user_created",
            "timestamp": chrono::Utc::now().to_rfc3339()
        })
    )
    .execute(pool.get_ref())
    .await;
    
    Ok(HttpResponse::Ok().json(CreateUserResponse {
        ok: true,
        message: "VPN user created successfully".to_string(),
    }))
}

pub async fn spawn_container(
    pool: web::Data<PgPool>,
    req: web::Json<SpawnContainerRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let username = req.username.clone();
    let session_id = req.session_id.clone();
    
    // Generate random path and port for demo
    let random_path = generate_random_path();
    let port = 5801; // In production, this would be dynamically assigned
    let container_id = format!("firefox-{}", port);
    
    // For demo purposes, simulate container spawning
    // In production, this would call Docker API via Gateway Agent
    
    // Log the action
    let _ = sqlx::query!(
        r#"
        INSERT INTO audit_logs (action, resource_type, resource_id, details, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        "#,
        "CONTAINER_SPAWNED",
        "session",
        session_id,
        serde_json::json!({
            "username": username,
            "session_id": session_id,
            "container_id": container_id,
            "port": port,
            "url_path": random_path,
            "timestamp": chrono::Utc::now().to_rfc3339()
        })
    )
    .execute(pool.get_ref())
    .await;
    
    let url = format!("https://gw.example.com/{}/", random_path);
    
    Ok(HttpResponse::Ok().json(SpawnContainerResponse {
        url,
        port,
        container_id,
    }))
}

pub async fn terminate_session(
    pool: web::Data<PgPool>,
    req: web::Json<TerminateSessionRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let session_id = req.session_id.clone();
    
    // For demo purposes, simulate session termination
    // In production, this would call the Gateway Agent to stop containers and VPN sessions
    
    // Log the action
    let _ = sqlx::query!(
        r#"
        INSERT INTO audit_logs (action, resource_type, resource_id, details, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        "#,
        "SESSION_TERMINATED_BY_ADMIN",
        "session",
        session_id,
        serde_json::json!({
            "session_id": session_id,
            "action": "session_terminated",
            "terminated_by": "admin",
            "timestamp": chrono::Utc::now().to_rfc3339()
        })
    )
    .execute(pool.get_ref())
    .await;
    
    Ok(HttpResponse::Ok().json(TerminateSessionResponse {
        terminated: true,
        message: "Session terminated successfully".to_string(),
    }))
}

fn generate_random_path() -> String {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    const CHARSET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    (0..32)
        .map(|_| {
            let idx = rng.gen_range(0..CHARSET.len());
            CHARSET[idx] as char
        })
        .collect()
}

pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/agent")
            .route("/user/create", web::post().to(create_user))
            .route("/container/spawn", web::post().to(spawn_container))
            .route("/session/terminate", web::post().to(terminate_session))
    );
}
