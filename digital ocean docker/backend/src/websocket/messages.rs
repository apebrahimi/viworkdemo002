use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum WebSocketMessage {
    // Client messages
    Connect { user_id: String },
    Disconnect,
    Subscribe { channel: String },
    Unsubscribe { channel: String },
    
    // Server messages
    Connected { session_id: String },
    Disconnected,
    Error { message: String },
    
    // Real-time updates
    ClientUpdate { client_id: String, status: String },
    AlertUpdate { alert_id: String, severity: String },
    SystemMetrics { cpu: f64, memory: f64, disk: f64 },
    UserActivity { user_id: String, action: String },
    SecurityEvent { event_type: String, details: String },
    
    // Heartbeat
    Ping,
    Pong,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WebSocketEvent {
    pub event_type: String,
    pub data: serde_json::Value,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

impl WebSocketEvent {
    pub fn new(event_type: String, data: serde_json::Value) -> Self {
        Self {
            event_type,
            data,
            timestamp: chrono::Utc::now(),
        }
    }
    
    pub fn client_update(client_id: String, status: String) -> Self {
        Self::new(
            "client_update".to_string(),
            serde_json::json!({
                "client_id": client_id,
                "status": status,
                "timestamp": chrono::Utc::now()
            })
        )
    }
    
    pub fn alert_update(alert_id: String, severity: String, title: String) -> Self {
        Self::new(
            "alert_update".to_string(),
            serde_json::json!({
                "alert_id": alert_id,
                "severity": severity,
                "title": title,
                "timestamp": chrono::Utc::now()
            })
        )
    }
    
    pub fn system_metrics(cpu: f64, memory: f64, disk: f64) -> Self {
        Self::new(
            "system_metrics".to_string(),
            serde_json::json!({
                "cpu_usage": cpu,
                "memory_usage": memory,
                "disk_usage": disk,
                "timestamp": chrono::Utc::now()
            })
        )
    }
    
    pub fn security_event(event_type: String, details: String) -> Self {
        Self::new(
            "security_event".to_string(),
            serde_json::json!({
                "event_type": event_type,
                "details": details,
                "timestamp": chrono::Utc::now()
            })
        )
    }
}
