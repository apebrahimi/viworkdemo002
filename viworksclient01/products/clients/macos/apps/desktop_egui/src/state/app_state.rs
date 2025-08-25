use eframe::egui;
use tokio::runtime::Runtime;
use viworks_core::{
    ConnectionFsm, ConnectionConfig, 
    SecretString, AppConfig
};
use viworks_connection_manager::ConnectionManager;
use viworks_auth_api::AuthClient;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use tracing::{warn, error, info};

#[derive(Debug, Clone, PartialEq)]
pub enum LoginState {
    NotLoggedIn,
    LoginInProgress,
    AwaitingTwoFactor,
    LoggedIn,
}

/// Main application state struct that holds all data
pub struct AppState {
    // Core components
    pub fsm: Arc<Mutex<ConnectionFsm>>,
    pub runtime: Arc<Runtime>,
    pub auth_client: AuthClient,
    pub config: AppConfig,
    
    // UI state
    pub username: String,
    pub password: String,
    pub remember_me: bool,
    
    // Authentication state
    pub login_state: LoginState,
    pub two_fa_code: String,
    pub session_token: Option<String>,
    
    // Connection form
    pub server_host: String,
    pub server_port: String,
    pub fwknop_key: String,
    pub fwknop_hmac: String,
    pub ovpn_path: Option<String>,
    
    // OpenVPN Authentication
    pub ovpn_username: String,
    pub ovpn_password: String,
    
    // Stunnel configuration
    pub stunnel_enabled: bool,
    pub stunnel_accept: String,
    pub stunnel_connect: String,
    pub stunnel_cert: String,
    
    // Connection manager
    pub connection_manager: Option<ConnectionManager>,
    
    // Status
    pub unified_log: Vec<String>,
    pub error_message: Option<String>,
    pub is_busy: bool,
    
    // Connection status tracking
    pub spa_status: String,
    pub stunnel_status: String,
    pub vpn_status: String,
    pub port_status: String,
    
    // SPA bypass option
    pub skip_spa: bool,
    
    // Individual check results
    pub timezone_check_result: Option<std::result::Result<(), String>>,
    pub network_check_result: Option<std::result::Result<(), String>>,
    pub tunnel_check_result: Option<std::result::Result<(), String>>,
    pub binary_check_result: Option<std::result::Result<(), String>>,
    
    // Enhanced diagnostics
    pub connection_diagnostics: Vec<String>,
    pub last_connection_attempt: Option<Instant>,
    pub connection_step_status: Option<String>,
    
    // Timers
    pub last_activity: Option<Instant>,
    pub auto_logout_timer: Option<Instant>,
    
    // Async task handles
    pub pending_tasks: Vec<tokio::task::JoinHandle<()>>,
}

impl AppState {
    pub fn new(runtime: Runtime) -> Self {
        let config = AppConfig::load().unwrap_or_default();
        let auth_client = AuthClient::new(config.cert_server_url.clone()).unwrap_or_default();
        
        Self {
            fsm: Arc::new(Mutex::new(ConnectionFsm::new())),
            runtime: Arc::new(runtime),
            auth_client,
            config,
            username: String::new(),
            password: String::new(),
            remember_me: false,
            login_state: LoginState::NotLoggedIn,
            two_fa_code: String::new(),
            session_token: None,
            server_host: "viworks.ir".to_string(),
            server_port: "8445".to_string(),
            fwknop_key: "test_fwknop_key_12345".to_string(),
            fwknop_hmac: "test_fwknop_hmac_12345".to_string(),
            ovpn_path: None,
            ovpn_username: "admin".to_string(),
            ovpn_password: "admin123".to_string(),
            stunnel_enabled: true,
            stunnel_accept: "127.0.0.1:1300".to_string(),
            stunnel_connect: "viworks.ir:8445".to_string(),
            stunnel_cert: "stunnel.pem".to_string(),
            connection_manager: None,
            unified_log: Vec::new(),
            error_message: None,
            is_busy: false,
            
            // Initialize status tracking
            spa_status: "⏳ Pending".to_string(),
            stunnel_status: "⏳ Pending".to_string(),
            vpn_status: "⏳ Pending".to_string(),
            port_status: "⏳ Pending".to_string(),
            
            // Initialize SPA bypass option
            skip_spa: false,
            
            timezone_check_result: None,
            network_check_result: None,
            tunnel_check_result: None,
            binary_check_result: None,
            connection_diagnostics: Vec::new(),
            last_connection_attempt: None,
            connection_step_status: None,
            last_activity: Some(Instant::now()),
            auto_logout_timer: Some(Instant::now()),
            pending_tasks: Vec::new(),
        }
    }
}
