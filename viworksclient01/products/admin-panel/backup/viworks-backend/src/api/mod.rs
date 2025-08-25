pub mod auth;
pub mod clients;
pub mod monitoring;
pub mod users;
pub mod sessions;
pub mod health;
pub mod agent;

use actix_web::web;

pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/v1")
            .configure(auth::configure_routes)
            .configure(clients::configure_routes)
            .configure(monitoring::configure_routes)
            .configure(users::configure_routes)
            .configure(sessions::configure_routes)
            .configure(health::configure_routes)
            .configure(agent::configure_routes)
    );
}
