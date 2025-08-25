use std::sync::Arc;
use tokio::time::{Duration, interval};
use crate::websocket::{WebSocketEvent, WebSocketSessionManager};

pub struct RealtimeService {
    session_manager: Arc<WebSocketSessionManager>,
}

impl RealtimeService {
    pub fn new(session_manager: Arc<WebSocketSessionManager>) -> Self {
        Self {
            session_manager,
        }
    }
    
    pub async fn start_monitoring(&self) {
        let session_manager = Arc::clone(&self.session_manager);
        
        // Start system metrics monitoring
        tokio::spawn(async move {
            let mut interval = interval(Duration::from_secs(30));
            
            loop {
                interval.tick().await;
                
                // Simulate system metrics
                let cpu_usage = rand::random::<f64>() * 100.0;
                let memory_usage = 60.0 + (rand::random::<f64>() * 20.0);
                let disk_usage = 45.0 + (rand::random::<f64>() * 15.0);
                
                let event = WebSocketEvent::system_metrics(cpu_usage, memory_usage, disk_usage);
                session_manager.broadcast_to_channel("system_metrics", event);
                
                log::info!("Broadcasted system metrics: CPU={:.1}%, Memory={:.1}%, Disk={:.1}%", 
                    cpu_usage, memory_usage, disk_usage);
            }
        });
        
        // Start security monitoring
        let session_manager = Arc::clone(&self.session_manager);
        tokio::spawn(async move {
            let mut interval = interval(Duration::from_secs(60));
            
            loop {
                interval.tick().await;
                
                // Simulate security events
                let events = vec![
                    ("failed_login", "Multiple failed login attempts detected"),
                    ("suspicious_activity", "Unusual network activity detected"),
                    ("system_alert", "High CPU usage detected"),
                    ("connection_drop", "Client connection lost"),
                ];
                
                let random_event = events[rand::random::<usize>() % events.len()];
                let event = WebSocketEvent::security_event(
                    random_event.0.to_string(),
                    random_event.1.to_string(),
                );
                
                session_manager.broadcast_to_channel("security_alerts", event);
                log::info!("Broadcasted security event: {} - {}", random_event.0, random_event.1);
            }
        });
        
        // Start client status monitoring
        let session_manager = Arc::clone(&self.session_manager);
        tokio::spawn(async move {
            let mut interval = interval(Duration::from_secs(45));
            
            loop {
                interval.tick().await;
                
                // Simulate client status updates
                let client_ids = vec!["client-001", "client-002", "client-003", "client-004"];
                let statuses = vec!["connected", "disconnected", "connecting", "error"];
                
                let random_client = client_ids[rand::random::<usize>() % client_ids.len()];
                let random_status = statuses[rand::random::<usize>() % statuses.len()];
                
                let event = WebSocketEvent::client_update(
                    random_client.to_string(),
                    random_status.to_string(),
                );
                
                session_manager.broadcast_to_channel("client_updates", event);
                log::info!("Broadcasted client update: {} - {}", random_client, random_status);
            }
        });
    }
    
    pub fn broadcast_alert(&self, alert_id: String, severity: String, title: String) {
        let event = WebSocketEvent::alert_update(alert_id, severity, title);
        self.session_manager.broadcast_to_channel("security_alerts", event);
    }
    
    pub fn broadcast_client_update(&self, client_id: String, status: String) {
        let event = WebSocketEvent::client_update(client_id, status);
        self.session_manager.broadcast_to_channel("client_updates", event);
    }
    
    pub fn broadcast_system_metrics(&self, cpu: f64, memory: f64, disk: f64) {
        let event = WebSocketEvent::system_metrics(cpu, memory, disk);
        self.session_manager.broadcast_to_channel("system_metrics", event);
    }
}
