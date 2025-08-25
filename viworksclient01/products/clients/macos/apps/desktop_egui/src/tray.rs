use std::sync::{Arc, Mutex};
use std::sync::mpsc::{channel, Sender, Receiver};
use viworks_core::{ConnectionState, ConnectionFsm};
use tracing::{info, warn};

#[derive(Debug, Clone)]
pub enum TrayEvent {
    Show,
    Disconnect,
    Logout,
    Quit,
}

pub struct SystemTray {
    event_sender: Sender<TrayEvent>,
    event_receiver: Receiver<TrayEvent>,
    fsm: Arc<Mutex<ConnectionFsm>>,
}

impl SystemTray {
    pub fn new(fsm: Arc<Mutex<ConnectionFsm>>) -> Result<Self, Box<dyn std::error::Error>> {
        let (event_sender, event_receiver) = channel();
        
        Ok(SystemTray {
            event_sender,
            event_receiver,
            fsm,
        })
    }
    
    pub fn update_menu_state(&self) -> Result<(), Box<dyn std::error::Error>> {
        let fsm = self.fsm.lock().unwrap();
        let state = fsm.state();
        
        // Log the state change for debugging
        let tooltip = match state {
            ConnectionState::Idle => "ViWorkS Client - Not logged in",
            ConnectionState::Preflight => "ViWorkS Client - Running preflight checks",
            ConnectionState::Authenticated => "ViWorkS Client - Ready to connect",
            ConnectionState::BootstrapManual | ConnectionState::BootstrapFetch => "ViWorkS Client - Configuring",
            ConnectionState::SpaSent => "ViWorkS Client - SPA sent",
            ConnectionState::PortOpen => "ViWorkS Client - Port open",
            ConnectionState::VpnConnecting => "ViWorkS Client - Connecting to VPN",
            ConnectionState::Connected => "ViWorkS Client - Connected",
            ConnectionState::Error { .. } => "ViWorkS Client - Error"
        };
        
        info!("Tray tooltip: {}", tooltip);
        
        Ok(())
    }
    
    pub fn try_receive_event(&self) -> Option<TrayEvent> {
        self.event_receiver.try_recv().ok()
    }
    
    pub fn show_notification(&self, title: &str, message: &str) -> Result<(), Box<dyn std::error::Error>> {
        // On macOS, we can use the osascript to show notifications
        let script = format!(
            "display notification \"{}\" with title \"{}\"",
            message.replace("\"", "\\\""),
            title.replace("\"", "\\\"")
        );
        
        let output = std::process::Command::new("osascript")
            .args(&["-e", &script])
            .output();
            
        match output {
            Ok(_) => info!("Notification sent: {} - {}", title, message),
            Err(e) => {
                warn!("Failed to send notification: {}", e);
                // Fallback to console output
                info!("Notification: {} - {}", title, message);
            }
        }
        
        Ok(())
    }
    
    pub fn set_icon(&self, _icon_data: &[u8]) -> Result<(), Box<dyn std::error::Error>> {
        info!("Icon would be updated");
        Ok(())
    }
    
    pub fn hide(&self) -> Result<(), Box<dyn std::error::Error>> {
        info!("Tray icon hide requested");
        Ok(())
    }
    
    pub fn show(&self) -> Result<(), Box<dyn std::error::Error>> {
        info!("Tray icon show requested");
        Ok(())
    }
}

impl Drop for SystemTray {
    fn drop(&mut self) {
        info!("System tray dropped");
    }
}

// Default implementation for when tray is not available
impl Default for SystemTray {
    fn default() -> Self {
        let (event_sender, event_receiver) = channel();
        let fsm = Arc::new(Mutex::new(viworks_core::ConnectionFsm::new()));
        
        SystemTray {
            event_sender,
            event_receiver,
            fsm,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_tray_event_creation() {
        let events = vec![
            TrayEvent::Show,
            TrayEvent::Disconnect,
            TrayEvent::Logout,
            TrayEvent::Quit,
        ];
        
        for event in events {
            match event {
                TrayEvent::Show => assert!(true),
                TrayEvent::Disconnect => assert!(true),
                TrayEvent::Logout => assert!(true),
                TrayEvent::Quit => assert!(true),
            }
        }
    }
}
