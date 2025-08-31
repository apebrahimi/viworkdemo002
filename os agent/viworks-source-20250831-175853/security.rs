use crate::api::CommandRequest;
use crate::config::Config;
use crate::error::{AgentError, AgentResult};
use actix_web::HttpRequest;
use chrono::{DateTime, Utc};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use tracing::{error, info, warn};

#[derive(Debug, Clone)]
pub struct SecurityContext {
    config: Config,
    rate_limits: Arc<RwLock<HashMap<String, RateLimitInfo>>>,
    allowed_clients: Vec<String>,
}

#[derive(Debug, Clone)]
struct RateLimitInfo {
    requests: u32,
    window_start: DateTime<Utc>,
}

impl SecurityContext {
    pub fn new(config: Config) -> Self {
        Self {
            config,
            rate_limits: Arc::new(RwLock::new(HashMap::new())),
            allowed_clients: vec!["127.0.0.1".to_string(), "::1".to_string()],
        }
    }

    pub async fn authenticate_request(&self, req: &HttpRequest) -> AgentResult<()> {
        // Extract client certificate (mocked for now)
        let client_cert = self.extract_client_certificate(req)?;

        // Validate certificate
        self.validate_certificate(&client_cert).await?;

        // Check rate limiting
        self.check_rate_limit(&client_cert).await?;

        Ok(())
    }

    fn extract_client_certificate(&self, _req: &HttpRequest) -> AgentResult<String> {
        // In a real implementation, this would extract the client certificate
        // from the TLS connection or headers
        Ok("mock-client-certificate".to_string())
    }

    async fn validate_certificate(&self, _cert: &str) -> AgentResult<()> {
        // In a real implementation, this would validate the client certificate
        // against the CA and check if it's in the allowed list
        Ok(())
    }

    async fn check_rate_limit(&self, client_id: &str) -> AgentResult<()> {
        let mut rate_limits = self.rate_limits.write().await;
        let now = Utc::now();

        if let Some(limit_info) = rate_limits.get_mut(client_id) {
            // Check if window has expired
            let window_duration =
                chrono::Duration::seconds(self.config.security.rate_limit_window as i64);
            if now.signed_duration_since(limit_info.window_start) > window_duration {
                // Reset window
                limit_info.requests = 1;
                limit_info.window_start = now;
            } else {
                // Check if limit exceeded
                if limit_info.requests >= self.config.security.rate_limit_requests as u32 {
                    return Err(AgentError::RateLimitExceeded);
                }
                limit_info.requests += 1;
            }
        } else {
            // First request from this client
            rate_limits.insert(
                client_id.to_string(),
                RateLimitInfo {
                    requests: 1,
                    window_start: now,
                },
            );
        }

        Ok(())
    }

    pub async fn validate_signature(
        &self,
        _payload: &CommandRequest,
        _signature: &str,
    ) -> AgentResult<()> {
        // In a real implementation, this would validate the request signature
        // using HMAC or digital signatures
        Ok(())
    }

    pub fn is_allowed_ip(&self, ip: &str) -> bool {
        self.config.security.allowed_ips.contains(&ip.to_string())
    }

    pub fn init(_config: &Config) -> AgentResult<()> {
        info!("Security context initialized");
        Ok(())
    }
}
