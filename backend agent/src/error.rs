use actix_web::{http::StatusCode, HttpResponse, ResponseError};
use serde::{Deserialize, Serialize};
use std::fmt;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum BackendAgentError {
    #[error("Configuration error: {0}")]
    Configuration(String),

    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),

    #[error("Redis error: {0}")]
    Redis(#[from] redis::RedisError),

    #[error("WebSocket error: {0}")]
    WebSocket(String),

    #[error("Authentication error: {0}")]
    Authentication(String),

    #[error("Authorization error: {0}")]
    Authorization(String),

    #[error("Command execution error: {0}")]
    CommandExecution(String),

    #[error("Validation error: {0}")]
    Validation(String),

    #[error("Agent not found: {0}")]
    AgentNotFound(String),

    #[error("Connection error: {0}")]
    Connection(String),

    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),

    #[error("Internal error: {0}")]
    Internal(String),

    #[error("Rate limit exceeded: {0}")]
    RateLimit(String),

    #[error("Timeout error: {0}")]
    Timeout(String),
}

impl ResponseError for BackendAgentError {
    fn status_code(&self) -> StatusCode {
        match self {
            BackendAgentError::Configuration(_) => StatusCode::INTERNAL_SERVER_ERROR,
            BackendAgentError::Database(_) => StatusCode::INTERNAL_SERVER_ERROR,
            BackendAgentError::Redis(_) => StatusCode::INTERNAL_SERVER_ERROR,
            BackendAgentError::WebSocket(_) => StatusCode::BAD_REQUEST,
            BackendAgentError::Authentication(_) => StatusCode::UNAUTHORIZED,
            BackendAgentError::Authorization(_) => StatusCode::FORBIDDEN,
            BackendAgentError::CommandExecution(_) => StatusCode::BAD_REQUEST,
            BackendAgentError::Validation(_) => StatusCode::BAD_REQUEST,
            BackendAgentError::AgentNotFound(_) => StatusCode::NOT_FOUND,
            BackendAgentError::Connection(_) => StatusCode::SERVICE_UNAVAILABLE,
            BackendAgentError::Serialization(_) => StatusCode::BAD_REQUEST,
            BackendAgentError::Internal(_) => StatusCode::INTERNAL_SERVER_ERROR,
            BackendAgentError::RateLimit(_) => StatusCode::TOO_MANY_REQUESTS,
            BackendAgentError::Timeout(_) => StatusCode::REQUEST_TIMEOUT,
        }
    }

    fn error_response(&self) -> HttpResponse {
        let error_response = ErrorResponse {
            error: self.to_string(),
            error_type: self.error_type(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        };

        HttpResponse::build(self.status_code()).json(error_response)
    }
}

impl BackendAgentError {
    fn error_type(&self) -> String {
        match self {
            BackendAgentError::Configuration(_) => "CONFIGURATION_ERROR".to_string(),
            BackendAgentError::Database(_) => "DATABASE_ERROR".to_string(),
            BackendAgentError::Redis(_) => "REDIS_ERROR".to_string(),
            BackendAgentError::WebSocket(_) => "WEBSOCKET_ERROR".to_string(),
            BackendAgentError::Authentication(_) => "AUTHENTICATION_ERROR".to_string(),
            BackendAgentError::Authorization(_) => "AUTHORIZATION_ERROR".to_string(),
            BackendAgentError::CommandExecution(_) => "COMMAND_EXECUTION_ERROR".to_string(),
            BackendAgentError::Validation(_) => "VALIDATION_ERROR".to_string(),
            BackendAgentError::AgentNotFound(_) => "AGENT_NOT_FOUND".to_string(),
            BackendAgentError::Connection(_) => "CONNECTION_ERROR".to_string(),
            BackendAgentError::Serialization(_) => "SERIALIZATION_ERROR".to_string(),
            BackendAgentError::Internal(_) => "INTERNAL_ERROR".to_string(),
            BackendAgentError::RateLimit(_) => "RATE_LIMIT_ERROR".to_string(),
            BackendAgentError::Timeout(_) => "TIMEOUT_ERROR".to_string(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error: String,
    pub error_type: String,
    pub timestamp: String,
}

// Type alias for Result
pub type BackendAgentResult<T> = Result<T, BackendAgentError>;

// Conversion implementations
impl From<std::io::Error> for BackendAgentError {
    fn from(err: std::io::Error) -> Self {
        BackendAgentError::Internal(format!("IO error: {}", err))
    }
}

impl From<tokio::time::error::Elapsed> for BackendAgentError {
    fn from(_: tokio::time::error::Elapsed) -> Self {
        BackendAgentError::Timeout("Operation timed out".to_string())
    }
}

impl From<uuid::Error> for BackendAgentError {
    fn from(err: uuid::Error) -> Self {
        BackendAgentError::Validation(format!("UUID error: {}", err))
    }
}

impl From<chrono::ParseError> for BackendAgentError {
    fn from(err: chrono::ParseError) -> Self {
        BackendAgentError::Validation(format!("Date parsing error: {}", err))
    }
}
