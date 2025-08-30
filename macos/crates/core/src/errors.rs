use thiserror::Error;

#[derive(Error, Debug)]
pub enum ViWorksError {
    // Authentication errors
    #[error("Invalid credentials")]
    InvalidCredentials,
    
    #[error("Server unreachable: {0}")]
    ServerUnreachable(String),
    
    #[error("TLS pin mismatch")]
    TlsPinMismatch,
    
    #[error("Authentication timeout")]
    AuthTimeout,
    
    #[error("Unauthorized access")]
    Unauthorized,
    
    #[error("Bootstrap data missing")]
    BootstrapMissing,
    
    #[error("Server error: {0}")]
    ServerError(String),
    
    // Preflight errors
    #[error("Active VPN tunnel detected")]
    TunnelActive,
    
    #[error("Wrong timezone - must be Asia/Tehran")]
    WrongTimezone,
    
    #[error("No network connectivity")]
    Offline,
    
    // SPA errors
    #[error("fwknop binary not found")]
    FwknopNotFound,
    
    #[error("Invalid binary signature")]
    SignatureInvalid,
    
    #[error("Binary hash mismatch")]
    HashMismatch,
    
    #[error("Invalid arguments for fwknop")]
    ArgsRejected,
    
    #[error("SPA timeout")]
    SpaTimeout,
    
    #[error("SPA denied by server")]
    SpaDenied,
    
    // Port probe errors
    #[error("Port 8443 probe timed out")]
    PortProbeTimedOut,
    
    // OpenVPN errors
    #[error("OpenVPN binary not found")]
    OpenVpnNotFound,
    
    #[error("Invalid OpenVPN configuration")]
    ConfigInvalid,
    
    #[error("OpenVPN authentication failed")]
    AuthFailed,
    
    #[error("OpenVPN handshake failed")]
    HandshakeFailed,
    
    #[error("OpenVPN unexpected exit")]
    UnexpectedExit,
    
    // Validation errors
    #[error("Invalid hostname: {0}")]
    InvalidHostname(String),
    
    #[error("Invalid port number: {0}")]
    InvalidPort(u16),
    
    #[error("Empty key or HMAC")]
    EmptyKey,
    
    #[error("OVPN file too large (max {0} bytes)")]
    OvpnTooLarge(usize),
    
    #[error("OVPN file contains invalid characters")]
    OvpnInvalidChars,
    
    #[error("OVPN file contains null bytes")]
    OvpnContainsNulls,
    
    // Security errors
    #[error("Rate limit exceeded")]
    RateLimitExceeded,
    
    #[error("Invalid path: {0}")]
    InvalidPath(String),
    
    #[error("Invalid input: {0}")]
    InvalidInput(String),
    
    // Platform errors
    #[error("DPAPI error: {0}")]
    DpapiError(String),
    
    #[error("File system error: {0}")]
    FileSystemError(String),
    
    #[error("Process execution error: {0}")]
    ProcessError(String),
    
    #[error("Network error: {0}")]
    NetworkError(String),
    
    // Internal errors
    #[error("Internal error: {0}")]
    Internal(String),
    
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),
    
    #[error("Regex error: {0}")]
    Regex(#[from] regex::Error),
}

pub type Result<T> = std::result::Result<T, ViWorksError>;

impl From<anyhow::Error> for ViWorksError {
    fn from(err: anyhow::Error) -> Self {
        ViWorksError::Internal(err.to_string())
    }
}
