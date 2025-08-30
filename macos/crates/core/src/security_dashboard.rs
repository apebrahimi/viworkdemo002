use crate::{Result, ViWorksError};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use serde::{Deserialize, Serialize};

/// Real-time security dashboard for monitoring and visualization
#[derive(Debug, Clone)]
pub struct SecurityDashboard {
    metrics: Arc<Mutex<SecurityMetrics>>,
    alerts: Arc<Mutex<Vec<SecurityAlert>>>,
    config: SecurityDashboardConfig,
    start_time: Instant,
}

/// Security metrics for dashboard display
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecurityMetrics {
    pub total_events: u64,
    pub events_by_type: HashMap<String, u64>,
    pub events_by_severity: HashMap<String, u64>,
    pub active_alerts: u64,
    pub resolved_alerts: u64,
    pub average_response_time: f64,
    pub threat_level: ThreatLevel,
    pub uptime_seconds: u64,
    pub last_updated: u64,
}

/// Security alert for real-time monitoring
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecurityAlert {
    pub id: String,
    pub alert_type: SecurityAlertType,
    pub severity: SecuritySeverity,
    pub message: String,
    pub timestamp: u64,
    pub source: String,
    pub status: AlertStatus,
    pub response_time: Option<Duration>,
    pub metadata: HashMap<String, String>,
}

/// Types of security alerts
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SecurityAlertType {
    AuthenticationFailure,
    RateLimitExceeded,
    InvalidInput,
    CertificatePinMismatch,
    ProcessAnomalyDetected,
    NetworkAnomalyDetected,
    MemoryIntegrityViolation,
    UnauthorizedAccess,
    ConfigurationChange,
    SystemIntegrity,
}

/// Security severity levels
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum SecuritySeverity {
    Info,
    Low,
    Medium,
    High,
    Critical,
}

/// Alert status tracking
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum AlertStatus {
    Active,
    Acknowledged,
    Investigating,
    Resolved,
    FalsePositive,
}

/// Overall threat level assessment
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ThreatLevel {
    Green,    // No threats detected
    Yellow,   // Low risk threats
    Orange,   // Medium risk threats
    Red,      // High risk threats
    Critical, // Critical threats requiring immediate action
}

/// Dashboard configuration
#[derive(Debug, Clone)]
pub struct SecurityDashboardConfig {
    pub max_alerts: usize,
    pub alert_retention: Duration,
    pub metrics_update_interval: Duration,
    pub auto_refresh: bool,
    pub threat_escalation_enabled: bool,
}

impl Default for SecurityDashboardConfig {
    fn default() -> Self {
        Self {
            max_alerts: 1000,
            alert_retention: Duration::from_secs(24 * 60 * 60), // 24 hours
            metrics_update_interval: Duration::from_secs(30),
            auto_refresh: true,
            threat_escalation_enabled: true,
        }
    }
}

impl SecurityDashboard {
    /// Create a new security dashboard
    pub fn new(config: SecurityDashboardConfig) -> Self {
        Self {
            metrics: Arc::new(Mutex::new(SecurityMetrics::default())),
            alerts: Arc::new(Mutex::new(Vec::new())),
            config,
            start_time: Instant::now(),
        }
    }

    /// Add a security event to the dashboard
    pub fn add_event(&self, event_type: &str, severity: SecuritySeverity) -> Result<()> {
        let mut metrics = self.metrics.lock().map_err(|e| {
            ViWorksError::Internal(format!("Failed to lock metrics: {}", e))
        })?;

        metrics.total_events += 1;
        *metrics.events_by_type.entry(event_type.to_string()).or_insert(0) += 1;
        *metrics.events_by_severity.entry(format!("{:?}", severity)).or_insert(0) += 1;
        metrics.last_updated = chrono::Utc::now().timestamp() as u64;
        metrics.uptime_seconds = self.start_time.elapsed().as_secs();

        // Update threat level based on recent events
        self.update_threat_level(&mut metrics)?;

        Ok(())
    }

    /// Add a security alert
    pub fn add_alert(&self, alert_type: SecurityAlertType, severity: SecuritySeverity, 
                     message: String, source: String) -> Result<String> {
        let alert_id = uuid::Uuid::new_v4().to_string();
        let alert = SecurityAlert {
            id: alert_id.clone(),
            alert_type,
            severity: severity.clone(),
            message,
            timestamp: chrono::Utc::now().timestamp() as u64,
            source,
            status: AlertStatus::Active,
            response_time: None,
            metadata: HashMap::new(),
        };

        let mut alerts = self.alerts.lock().map_err(|e| {
            ViWorksError::Internal(format!("Failed to lock alerts: {}", e))
        })?;

        // Log the alert before moving it
        match severity {
            SecuritySeverity::Critical => tracing::error!("🚨 CRITICAL SECURITY ALERT: {} (ID: {})", alert.message, alert_id),
            SecuritySeverity::High => tracing::warn!("⚠️ HIGH SECURITY ALERT: {} (ID: {})", alert.message, alert_id),
            SecuritySeverity::Medium => tracing::warn!("📢 MEDIUM SECURITY ALERT: {} (ID: {})", alert.message, alert_id),
            SecuritySeverity::Low => tracing::info!("📝 LOW SECURITY ALERT: {} (ID: {})", alert.message, alert_id),
            SecuritySeverity::Info => tracing::info!("ℹ️ SECURITY INFO: {} (ID: {})", alert.message, alert_id),
        }

        alerts.push(alert);

        // Maintain max alerts limit
        if alerts.len() > self.config.max_alerts {
            alerts.remove(0);
        }

        // Update metrics
        let mut metrics = self.metrics.lock().map_err(|e| {
            ViWorksError::Internal(format!("Failed to lock metrics: {}", e))
        })?;
        metrics.active_alerts += 1;

        Ok(alert_id)
    }

    /// Acknowledge an alert
    pub fn acknowledge_alert(&self, alert_id: &str) -> Result<()> {
        let mut alerts = self.alerts.lock().map_err(|e| {
            ViWorksError::Internal(format!("Failed to lock alerts: {}", e))
        })?;

        if let Some(alert) = alerts.iter_mut().find(|a| a.id == alert_id) {
            alert.status = AlertStatus::Acknowledged;
            tracing::info!("✅ Security alert acknowledged: {}", alert_id);
        }

        Ok(())
    }

    /// Resolve an alert
    pub fn resolve_alert(&self, alert_id: &str, response_time: Duration) -> Result<()> {
        let mut alerts = self.alerts.lock().map_err(|e| {
            ViWorksError::Internal(format!("Failed to lock alerts: {}", e))
        })?;

        if let Some(alert) = alerts.iter_mut().find(|a| a.id == alert_id) {
            alert.status = AlertStatus::Resolved;
            alert.response_time = Some(response_time);

            // Update metrics
            let mut metrics = self.metrics.lock().map_err(|e| {
                ViWorksError::Internal(format!("Failed to lock metrics: {}", e))
            })?;
            metrics.active_alerts = metrics.active_alerts.saturating_sub(1);
            metrics.resolved_alerts += 1;

            // Update average response time
            let response_ms = response_time.as_millis() as f64;
            if metrics.average_response_time == 0.0 {
                metrics.average_response_time = response_ms;
            } else {
                metrics.average_response_time = (metrics.average_response_time + response_ms) / 2.0;
            }

            tracing::info!("✅ Security alert resolved: {} (Response time: {:?})", alert_id, response_time);
        }

        Ok(())
    }

    /// Get current security metrics
    pub fn get_metrics(&self) -> Result<SecurityMetrics> {
        let metrics = self.metrics.lock().map_err(|e| {
            ViWorksError::Internal(format!("Failed to lock metrics: {}", e))
        })?;
        Ok(metrics.clone())
    }

    /// Get active alerts
    pub fn get_active_alerts(&self) -> Result<Vec<SecurityAlert>> {
        let alerts = self.alerts.lock().map_err(|e| {
            ViWorksError::Internal(format!("Failed to lock alerts: {}", e))
        })?;
        
        Ok(alerts.iter()
            .filter(|a| matches!(a.status, AlertStatus::Active | AlertStatus::Acknowledged | AlertStatus::Investigating))
            .cloned()
            .collect())
    }

    /// Get all alerts (for historical view)
    pub fn get_all_alerts(&self) -> Result<Vec<SecurityAlert>> {
        let alerts = self.alerts.lock().map_err(|e| {
            ViWorksError::Internal(format!("Failed to lock alerts: {}", e))
        })?;
        Ok(alerts.clone())
    }

    /// Update threat level based on current metrics
    fn update_threat_level(&self, metrics: &mut SecurityMetrics) -> Result<()> {
        let critical_alerts = self.get_active_alerts()?
            .iter()
            .filter(|a| matches!(a.severity, SecuritySeverity::Critical))
            .count();

        let high_alerts = self.get_active_alerts()?
            .iter()
            .filter(|a| matches!(a.severity, SecuritySeverity::High))
            .count();

        let medium_alerts = self.get_active_alerts()?
            .iter()
            .filter(|a| matches!(a.severity, SecuritySeverity::Medium))
            .count();

        // Calculate threat level
        metrics.threat_level = if critical_alerts > 0 {
            ThreatLevel::Critical
        } else if high_alerts >= 3 {
            ThreatLevel::Red
        } else if high_alerts > 0 || medium_alerts >= 5 {
            ThreatLevel::Orange
        } else if medium_alerts > 0 {
            ThreatLevel::Yellow
        } else {
            ThreatLevel::Green
        };

        Ok(())
    }

    /// Clean up old alerts based on retention policy
    pub fn cleanup_old_alerts(&self) -> Result<()> {
        let mut alerts = self.alerts.lock().map_err(|e| {
            ViWorksError::Internal(format!("Failed to lock alerts: {}", e))
        })?;

        let cutoff_time = chrono::Utc::now().timestamp() as u64 - self.config.alert_retention.as_secs();
        
        let initial_count = alerts.len();
        alerts.retain(|alert| {
            // Keep active alerts regardless of age, remove old resolved alerts
            match alert.status {
                AlertStatus::Active | AlertStatus::Acknowledged | AlertStatus::Investigating => true,
                AlertStatus::Resolved | AlertStatus::FalsePositive => alert.timestamp > cutoff_time,
            }
        });

        let removed_count = initial_count - alerts.len();
        if removed_count > 0 {
            tracing::info!("🧹 Cleaned up {} old security alerts", removed_count);
        }

        Ok(())
    }

    /// Generate security report
    pub fn generate_report(&self) -> Result<SecurityReport> {
        let metrics = self.get_metrics()?;
        let alerts = self.get_all_alerts()?;

        let report = SecurityReport {
            timestamp: chrono::Utc::now().timestamp() as u64,
            metrics: metrics.clone(),
            total_alerts: alerts.len(),
            critical_alerts: alerts.iter().filter(|a| matches!(a.severity, SecuritySeverity::Critical)).count(),
            high_alerts: alerts.iter().filter(|a| matches!(a.severity, SecuritySeverity::High)).count(),
            medium_alerts: alerts.iter().filter(|a| matches!(a.severity, SecuritySeverity::Medium)).count(),
            low_alerts: alerts.iter().filter(|a| matches!(a.severity, SecuritySeverity::Low)).count(),
            uptime: Duration::from_secs(metrics.uptime_seconds),
            threat_level: metrics.threat_level,
        };

        Ok(report)
    }
}

/// Security report for compliance and analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecurityReport {
    pub timestamp: u64,
    pub metrics: SecurityMetrics,
    pub total_alerts: usize,
    pub critical_alerts: usize,
    pub high_alerts: usize,
    pub medium_alerts: usize,
    pub low_alerts: usize,
    pub uptime: Duration,
    pub threat_level: ThreatLevel,
}

impl Default for SecurityMetrics {
    fn default() -> Self {
        Self {
            total_events: 0,
            events_by_type: HashMap::new(),
            events_by_severity: HashMap::new(),
            active_alerts: 0,
            resolved_alerts: 0,
            average_response_time: 0.0,
            threat_level: ThreatLevel::Green,
            uptime_seconds: 0,
            last_updated: chrono::Utc::now().timestamp() as u64,
        }
    }
}

impl std::fmt::Display for ThreatLevel {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ThreatLevel::Green => write!(f, "🟢 GREEN"),
            ThreatLevel::Yellow => write!(f, "🟡 YELLOW"),
            ThreatLevel::Orange => write!(f, "🟠 ORANGE"),
            ThreatLevel::Red => write!(f, "🔴 RED"),
            ThreatLevel::Critical => write!(f, "🚨 CRITICAL"),
        }
    }
}

impl std::fmt::Display for SecuritySeverity {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            SecuritySeverity::Info => write!(f, "ℹ️ INFO"),
            SecuritySeverity::Low => write!(f, "📝 LOW"),
            SecuritySeverity::Medium => write!(f, "📢 MEDIUM"),
            SecuritySeverity::High => write!(f, "⚠️ HIGH"),
            SecuritySeverity::Critical => write!(f, "🚨 CRITICAL"),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_dashboard_creation() {
        let config = SecurityDashboardConfig::default();
        let dashboard = SecurityDashboard::new(config);
        
        let metrics = dashboard.get_metrics().unwrap();
        assert_eq!(metrics.total_events, 0);
        assert_eq!(metrics.active_alerts, 0);
    }

    #[test]
    fn test_add_event() {
        let config = SecurityDashboardConfig::default();
        let dashboard = SecurityDashboard::new(config);
        
        dashboard.add_event("test_event", SecuritySeverity::Medium).unwrap();
        
        let metrics = dashboard.get_metrics().unwrap();
        assert_eq!(metrics.total_events, 1);
        assert_eq!(metrics.events_by_type.get("test_event"), Some(&1));
    }

    #[test]
    fn test_add_alert() {
        let config = SecurityDashboardConfig::default();
        let dashboard = SecurityDashboard::new(config);
        
        let alert_id = dashboard.add_alert(
            SecurityAlertType::AuthenticationFailure,
            SecuritySeverity::High,
            "Test alert".to_string(),
            "test_source".to_string()
        ).unwrap();
        
        let alerts = dashboard.get_active_alerts().unwrap();
        assert_eq!(alerts.len(), 1);
        assert_eq!(alerts[0].id, alert_id);
        
        let metrics = dashboard.get_metrics().unwrap();
        assert_eq!(metrics.active_alerts, 1);
    }

    #[test]
    fn test_resolve_alert() {
        let config = SecurityDashboardConfig::default();
        let dashboard = SecurityDashboard::new(config);
        
        let alert_id = dashboard.add_alert(
            SecurityAlertType::AuthenticationFailure,
            SecuritySeverity::High,
            "Test alert".to_string(),
            "test_source".to_string()
        ).unwrap();
        
        dashboard.resolve_alert(&alert_id, Duration::from_secs(30)).unwrap();
        
        let metrics = dashboard.get_metrics().unwrap();
        assert_eq!(metrics.active_alerts, 0);
        assert_eq!(metrics.resolved_alerts, 1);
        assert!(metrics.average_response_time > 0.0);
    }

    #[test]
    fn test_threat_level_escalation() {
        let config = SecurityDashboardConfig::default();
        let dashboard = SecurityDashboard::new(config);
        
        // Add a critical alert
        dashboard.add_alert(
            SecurityAlertType::SystemIntegrity,
            SecuritySeverity::Critical,
            "Critical security breach".to_string(),
            "system".to_string()
        ).unwrap();
        
        let metrics = dashboard.get_metrics().unwrap();
        assert!(matches!(metrics.threat_level, ThreatLevel::Critical));
    }
}
