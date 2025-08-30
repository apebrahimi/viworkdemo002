use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use uuid::Uuid;

use crate::websocket::messages::WebSocketEvent;

#[derive(Clone)]
pub struct WebSocketSession {
    pub id: String,
    pub user_id: Option<String>,
    pub subscribed_channels: Vec<String>,
}

impl WebSocketSession {
    pub fn new() -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            user_id: None,
            subscribed_channels: Vec::new(),
        }
    }
    
    pub fn subscribe(&mut self, channel: String) {
        if !self.subscribed_channels.contains(&channel) {
            self.subscribed_channels.push(channel);
        }
    }
    
    pub fn unsubscribe(&mut self, channel: &str) {
        self.subscribed_channels.retain(|c| c != channel);
    }
    
    pub fn is_subscribed(&self, channel: &str) -> bool {
        self.subscribed_channels.contains(&channel.to_string())
    }
}

pub struct WebSocketSessionManager {
    sessions: Arc<Mutex<HashMap<String, WebSocketSession>>>,
}

impl WebSocketSessionManager {
    pub fn new() -> Self {
        Self {
            sessions: Arc::new(Mutex::new(HashMap::new())),
        }
    }
    
    pub fn add_session(&self, session: WebSocketSession) {
        if let Ok(mut sessions) = self.sessions.lock() {
            sessions.insert(session.id.clone(), session);
        }
    }
    
    pub fn remove_session(&self, session_id: &str) {
        if let Ok(mut sessions) = self.sessions.lock() {
            sessions.remove(session_id);
        }
    }
    
    pub fn get_session(&self, session_id: &str) -> Option<WebSocketSession> {
        if let Ok(sessions) = self.sessions.lock() {
            sessions.get(session_id).cloned()
        } else {
            None
        }
    }
    
    pub fn broadcast_to_channel(&self, channel: &str, event: WebSocketEvent) {
        if let Ok(sessions) = self.sessions.lock() {
            for session in sessions.values() {
                if session.is_subscribed(channel) {
                    // In a real implementation, you would send the message to the session
                    // For now, we'll just log it
                    log::info!("Broadcasting to session {}: {:?}", session.id, event);
                }
            }
        }
    }
    
    pub fn broadcast_to_all(&self, event: WebSocketEvent) {
        if let Ok(sessions) = self.sessions.lock() {
            for session in sessions.values() {
                // In a real implementation, you would send the message to the session
                log::info!("Broadcasting to all sessions: {:?}", event);
            }
        }
    }
}

impl Clone for WebSocketSessionManager {
    fn clone(&self) -> Self {
        Self {
            sessions: Arc::clone(&self.sessions),
        }
    }
}
