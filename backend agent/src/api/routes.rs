use crate::api::auth::jwt_validator;
use crate::api::handlers;
use actix_web::{web, HttpResponse};
use actix_web_httpauth::middleware::HttpAuthentication;

pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    // Health check endpoint (no authentication required)
    cfg.route("/health", web::get().to(handlers::health_check));

    // API v1 routes with authentication
    cfg.service(
        web::scope("/api/v1")
            .wrap(HttpAuthentication::bearer(jwt_validator))
            .service(
                web::scope("/agents")
                    .route("", web::get().to(handlers::list_agents))
                    .route("/{agent_id}", web::get().to(handlers::get_agent))
                    .route("/site/{site}", web::get().to(handlers::get_agents_by_site))
                    .route(
                        "/{agent_id}/status/{status}",
                        web::put().to(handlers::update_agent_status),
                    ),
            )
            .service(
                web::scope("/commands")
                    .route("", web::post().to(handlers::create_command))
                    .route("", web::get().to(handlers::list_commands))
                    .route("/{correlation_id}", web::get().to(handlers::get_command))
                    .route(
                        "/{correlation_id}/retry",
                        web::post().to(handlers::retry_command),
                    )
                    .route(
                        "/{correlation_id}/cancel",
                        web::post().to(handlers::cancel_command),
                    ),
            )
            .service(
                web::scope("/telemetry")
                    .route("/{agent_id}", web::get().to(handlers::get_agent_telemetry))
                    .route(
                        "/{agent_id}/history",
                        web::get().to(handlers::get_agent_telemetry_history),
                    ),
            )
            .route("/statistics", web::get().to(handlers::get_statistics)),
    );

    // WebSocket endpoint for agent connections (no JWT auth - uses agent auth)
    cfg.route("/ws/agent", web::get().to(websocket_handler));
}

/// WebSocket handler for agent connections
async fn websocket_handler() -> HttpResponse {
    // This is a placeholder - the actual WebSocket handling is done by AgentManager
    // In a production system, we'd integrate this with the AgentManager
    HttpResponse::Ok().json(serde_json::json!({
        "message": "WebSocket endpoint - connect via AgentManager on configured port"
    }))
}
