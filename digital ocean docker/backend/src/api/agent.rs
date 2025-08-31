use actix_web::{web, HttpResponse};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use reqwest::Client;
use tracing::{info, error};

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

// Gateway Agent integration endpoints
pub async fn create_user(
    pool: web::Data<PgPool>,
    req: web::Json<CreateUserRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let username = req.username.clone();
    let password = req.password.clone();
    
    info!("Creating VPN user: {}", username);
    
    // Call the Gateway Agent to create the VPN user
    let client = Client::new();
    let gateway_agent_url = std::env::var("GATEWAY_AGENT_URL")
        .unwrap_or_else(|_| "http://localhost:8443".to_string());
    
    let command_request = serde_json::json!({
        "command": "openvpn_create",
        "params": {
            "username": username,
            "password": password
        }
    });
    
    match client
        .post(&format!("{}/api/v1/command", gateway_agent_url))
        .json(&command_request)
        .send()
        .await
    {
        Ok(response) => {
            if response.status().is_success() {
                info!("VPN user created successfully via Gateway Agent: {}", username);
                
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
                        "gateway_agent": true,
                        "timestamp": chrono::Utc::now().to_rfc3339()
                    })
                )
                .execute(pool.get_ref())
                .await;
                
                Ok(HttpResponse::Ok().json(CreateUserResponse {
                    ok: true,
                    message: "VPN user created successfully via Gateway Agent".to_string(),
                }))
            } else {
                error!("Gateway Agent returned error status: {}", response.status());
                Ok(HttpResponse::InternalServerError().json(CreateUserResponse {
                    ok: false,
                    message: "Failed to create VPN user via Gateway Agent".to_string(),
                }))
            }
        }
        Err(e) => {
            error!("Failed to call Gateway Agent: {}", e);
            Ok(HttpResponse::InternalServerError().json(CreateUserResponse {
                ok: false,
                message: format!("Failed to connect to Gateway Agent: {}", e),
            }))
        }
    }
}

pub async fn spawn_container(
    pool: web::Data<PgPool>,
    req: web::Json<SpawnContainerRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let username = req.username.clone();
    let session_id = req.session_id.clone();
    
    info!("Spawning container for user: {}, session: {}", username, session_id);
    
    // Call the Gateway Agent to spawn a container
    let client = Client::new();
    let gateway_agent_url = std::env::var("GATEWAY_AGENT_URL")
        .unwrap_or_else(|_| "http://localhost:8443".to_string());
    
    let command_request = serde_json::json!({
        "command": "docker_spawn",
        "params": {
            "username": username,
            "session_id": session_id,
            "image": "viworks/chrome:latest"
        }
    });
    
    match client
        .post(&format!("{}/api/v1/command", gateway_agent_url))
        .json(&command_request)
        .send()
        .await
    {
        Ok(response) => {
            if response.status().is_success() {
                let response_data: serde_json::Value = response.json().await
                    .unwrap_or_else(|_| serde_json::json!({"error": "Failed to parse response"}));
                
                info!("Container spawned successfully via Gateway Agent: {}", session_id);
                
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
                        "gateway_agent": true,
                        "response": response_data,
                        "timestamp": chrono::Utc::now().to_rfc3339()
                    })
                )
                .execute(pool.get_ref())
                .await;
                
                // Extract container info from response
                let container_id = response_data["container_id"].as_str().unwrap_or("unknown");
                let port = response_data["port"].as_u64().unwrap_or(5801) as u16;
                let url = response_data["url"].as_str().unwrap_or("https://gw.example.com/");
                
                Ok(HttpResponse::Ok().json(SpawnContainerResponse {
                    url: url.to_string(),
                    port,
                    container_id: container_id.to_string(),
                }))
            } else {
                error!("Gateway Agent returned error status: {}", response.status());
                Ok(HttpResponse::InternalServerError().json(SpawnContainerResponse {
                    url: "".to_string(),
                    port: 0,
                    container_id: "".to_string(),
                }))
            }
        }
        Err(e) => {
            error!("Failed to call Gateway Agent: {}", e);
            Ok(HttpResponse::InternalServerError().json(SpawnContainerResponse {
                url: "".to_string(),
                port: 0,
                container_id: "".to_string(),
            }))
        }
    }
}

pub async fn terminate_session(
    pool: web::Data<PgPool>,
    req: web::Json<TerminateSessionRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let session_id = req.session_id.clone();
    
    info!("Terminating session: {}", session_id);
    
    // Call the Gateway Agent to terminate the session
    let client = Client::new();
    let gateway_agent_url = std::env::var("GATEWAY_AGENT_URL")
        .unwrap_or_else(|_| "http://localhost:8443".to_string());
    
    let command_request = serde_json::json!({
        "command": "session_terminate",
        "params": {
            "session_id": session_id
        }
    });
    
    match client
        .post(&format!("{}/api/v1/command", gateway_agent_url))
        .json(&command_request)
        .send()
        .await
    {
        Ok(response) => {
            if response.status().is_success() {
                info!("Session terminated successfully via Gateway Agent: {}", session_id);
                
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
                        "gateway_agent": true,
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
