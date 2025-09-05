use actix_web::{http::StatusCode, HttpResponse, ResponseError};
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AgentError {
    #[error("Invalid parameters: {0}")]
    InvalidParameters(String),

    #[error("User not found: {0}")]
    UserNotFound(String),

    #[error("User already exists: {0}")]
    UserAlreadyExists(String),

    #[error("Session not found: {0}")]
    SessionNotFound(String),

    #[error("Container not found: {0}")]
    ContainerNotFound(String),

    #[error("Command execution failed: {0}")]
    CommandExecutionFailed(String),

    #[error("Docker error: {0}")]
    DockerError(String),

    #[error("Configuration error: {0}")]
    ConfigurationError(String),

    #[error("Authentication failed: {0}")]
    AuthenticationFailed(String),

    #[error("Authorization failed: {0}")]
    AuthorizationFailed(String),

    #[error("Rate limit exceeded")]
    RateLimitExceeded,

    #[error("Timeout: {0}")]
    Timeout(String),

    #[error("Insufficient resources: {0}")]
    InsufficientResources(String),

    #[error("Internal error: {0}")]
    InternalError(String),

    #[error("Connection error: {0}")]
    ConnectionError(String),

    #[error("Serialization error: {0}")]
    SerializationError(#[from] serde_json::Error),

    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),

    #[error("System error: {0}")]
    SystemError(String),
}

impl ResponseError for AgentError {
    fn error_response(&self) -> HttpResponse {
        let (status_code, error_code, message) = match self {
            AgentError::InvalidParameters(msg) => {
                (StatusCode::BAD_REQUEST, "INVALID_PARAMETERS", msg)
            }
            AgentError::UserNotFound(user) => (StatusCode::NOT_FOUND, "USER_NOT_FOUND", user),
            AgentError::UserAlreadyExists(user) => {
                (StatusCode::CONFLICT, "USER_ALREADY_EXISTS", user)
            }
            AgentError::SessionNotFound(session) => {
                (StatusCode::NOT_FOUND, "SESSION_NOT_FOUND", session)
            }
            AgentError::ContainerNotFound(container) => {
                (StatusCode::NOT_FOUND, "CONTAINER_NOT_FOUND", container)
            }
            AgentError::CommandExecutionFailed(msg) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "COMMAND_EXECUTION_FAILED",
                msg,
            ),
            AgentError::DockerError(msg) => {
                (StatusCode::INTERNAL_SERVER_ERROR, "DOCKER_ERROR", msg)
            }
            AgentError::ConfigurationError(msg) => {
                (StatusCode::INTERNAL_SERVER_ERROR, "CONFIGURATION_ERROR", msg)
            }
            AgentError::AuthenticationFailed(msg) => {
                (StatusCode::UNAUTHORIZED, "AUTHENTICATION_FAILED", msg)
            }
            AgentError::AuthorizationFailed(msg) => {
                (StatusCode::FORBIDDEN, "AUTHORIZATION_FAILED", msg)
            }
            AgentError::RateLimitExceeded => (
                StatusCode::TOO_MANY_REQUESTS,
                "RATE_LIMIT_EXCEEDED",
                &"Rate limit exceeded".to_string(),
            ),
            AgentError::Timeout(operation) => (StatusCode::REQUEST_TIMEOUT, "TIMEOUT", operation),
            AgentError::InsufficientResources(msg) => (
                StatusCode::SERVICE_UNAVAILABLE,
                "INSUFFICIENT_RESOURCES",
                msg,
            ),
            AgentError::InternalError(msg) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "INTERNAL_ERROR",
                msg,
            ),
            AgentError::ConnectionError(msg) => (
                StatusCode::SERVICE_UNAVAILABLE,
                "CONNECTION_ERROR",
                msg,
            ),
            AgentError::SerializationError(e) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "SERIALIZATION_ERROR",
                &e.to_string(),
            ),
            AgentError::IoError(e) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "IO_ERROR",
                &e.to_string(),
            ),
            AgentError::SystemError(msg) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "SYSTEM_ERROR",
                msg,
            ),
        };

        let error_response = serde_json::json!({
            "error": {
                "code": error_code,
                "message": message,
                "timestamp": chrono::Utc::now().to_rfc3339()
            }
        });

        HttpResponse::build(status_code)
            .content_type("application/json")
            .json(error_response)
    }
}

impl From<AgentError> for std::io::Error {
    fn from(err: AgentError) -> Self {
        std::io::Error::new(std::io::ErrorKind::Other, err.to_string())
    }
}

pub type AgentResult<T> = Result<T, AgentError>;

impl AgentError {
    pub fn validation_error(message: String) -> Self {
        AgentError::InternalError(format!("Validation error: {}", message))
    }

    pub fn security_error(message: String) -> Self {
        AgentError::InternalError(format!("Security error: {}", message))
    }

    pub fn rate_limit_error(message: String) -> Self {
        AgentError::InternalError(format!("Rate limit error: {}", message))
    }
}
