use crate::state::app_state::AppState;
use std::time::Instant;
use tracing::{info, error};

/// Logging functionality for the application
pub trait LoggingHandler {
    fn append_log(&mut self, message: String);
    fn clear_log(&mut self);
    fn set_error(&mut self, error: String);
    fn clear_error(&mut self);
    fn add_diagnostic(&mut self, message: String);
    fn clear_diagnostics(&mut self);
}

impl LoggingHandler for AppState {
    fn append_log(&mut self, message: String) {
        let timestamp = chrono::Local::now().format("%H:%M:%S").to_string();
        self.unified_log.push(format!("[{}] {}", timestamp, message));
        
        // Keep only last 200 log entries
        if self.unified_log.len() > 200 {
            self.unified_log.remove(0);
        }
    }
    
    fn clear_log(&mut self) {
        self.unified_log.clear();
    }
    
    fn set_error(&mut self, error: String) {
        self.error_message = Some(error.clone());
        self.append_log(format!("ERROR: {}", error));
    }
    
    fn clear_error(&mut self) {
        self.error_message = None;
    }
    
    fn add_diagnostic(&mut self, message: String) {
        let timestamp = chrono::Local::now().format("%H:%M:%S").to_string();
        self.connection_diagnostics.push(format!("[{}] {}", timestamp, message));
        
        // Keep only last 50 diagnostic entries
        if self.connection_diagnostics.len() > 50 {
            self.connection_diagnostics.remove(0);
        }
    }
    
    fn clear_diagnostics(&mut self) {
        self.connection_diagnostics.clear();
    }
}

/// Update the last activity timestamp
pub fn update_activity(app_state: &mut AppState) {
    app_state.last_activity = Some(Instant::now());
    app_state.auto_logout_timer = Some(Instant::now());
}
