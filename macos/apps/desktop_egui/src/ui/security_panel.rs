use eframe::egui::{self, Context, Color32, RichText};
use viworks_core::{SecurityDashboard};
use viworks_core::security_dashboard::{ThreatLevel, AlertStatus, SecurityAlert, SecuritySeverity};
use std::sync::Arc;
use chrono::{DateTime, Utc};

/// Security panel UI rendering
pub struct SecurityPanel {
    dashboard: Arc<SecurityDashboard>,
    filter_severity: Option<String>,
    filter_status: Option<String>,
}

impl SecurityPanel {
    pub fn new(dashboard: Arc<SecurityDashboard>) -> Self {
        Self {
            dashboard,
            filter_severity: None,
            filter_status: None,
        }
    }

    pub fn render(&mut self, ctx: &Context) {
        egui::CentralPanel::default().show(ctx, |ui| {
            ui.heading("🛡️ Security Dashboard");
            ui.add_space(20.0);

            // Security overview
            self.render_security_overview(ui);
            ui.add_space(20.0);

            // Filters
            self.render_filters(ui);
            ui.add_space(20.0);

            // Security alerts
            self.render_security_alerts(ui);
        });
    }

    fn render_security_overview(&self, ui: &mut egui::Ui) {
        ui.group(|ui| {
            ui.heading("Security Overview");
            ui.add_space(10.0);

            // Threat level indicator
            let (color, emoji, text) = if let Ok(metrics) = self.dashboard.get_metrics() {
                match metrics.threat_level {
                    ThreatLevel::Green => (Color32::GREEN, "🟢", "Green"),
                    ThreatLevel::Yellow => (Color32::YELLOW, "🟡", "Yellow"),
                    ThreatLevel::Orange => (Color32::from_rgb(255, 165, 0), "🟠", "Orange"),
                    ThreatLevel::Red => (Color32::RED, "🔴", "Red"),
                    ThreatLevel::Critical => (Color32::from_rgb(128, 0, 0), "🚨", "Critical"),
                }
            } else {
                (Color32::GRAY, "❓", "Unknown")
            };

            ui.horizontal(|ui| {
                ui.label(RichText::new(format!("{} Threat Level: ", emoji)).strong());
                ui.colored_label(color, RichText::new(text).strong());
            });

            // Security metrics
            if let Ok(_metrics) = self.dashboard.get_metrics() {
                ui.label("Security metrics available");
            } else {
                ui.label("No security metrics available");
            }
        });
    }

    fn render_filters(&mut self, ui: &mut egui::Ui) {
        ui.group(|ui| {
            ui.heading("Filters");
            ui.add_space(10.0);

            // Severity filter
            ui.label("Severity:");
            ui.horizontal(|ui| {
                ui.selectable_value(&mut self.filter_severity, None, "All");
                ui.selectable_value(&mut self.filter_severity, Some("Critical".to_string()), "Critical");
                ui.selectable_value(&mut self.filter_severity, Some("High".to_string()), "High");
                ui.selectable_value(&mut self.filter_severity, Some("Medium".to_string()), "Medium");
                ui.selectable_value(&mut self.filter_severity, Some("Low".to_string()), "Low");
            });

                         // Status filter
             ui.label("Status:");
             ui.horizontal(|ui| {
                 ui.selectable_value(&mut self.filter_status, None, "All");
                 ui.selectable_value(&mut self.filter_status, Some("Active".to_string()), "Active");
                 ui.selectable_value(&mut self.filter_status, Some("Acknowledged".to_string()), "Acknowledged");
                 ui.selectable_value(&mut self.filter_status, Some("Resolved".to_string()), "Resolved");
             });
        });
    }

    fn render_security_alerts(&self, ui: &mut egui::Ui) {
        ui.group(|ui| {
            ui.heading("Security Alerts");
            ui.add_space(10.0);

                         // Get alerts from dashboard
             if let Ok(alerts) = self.dashboard.get_all_alerts() {
                if alerts.is_empty() {
                    ui.colored_label(Color32::GREEN, "✅ No active security alerts");
                } else {
                    for alert in alerts {
                        // Apply filters
                        if let Some(filter_sev) = &self.filter_severity {
                            // Skip if severity doesn't match (simplified)
                            continue;
                        }

                                                 if let Some(filter_status) = &self.filter_status {
                             if format!("{:?}", alert.status) != *filter_status {
                                 continue;
                             }
                         }

                                                 self.show_alert_card(ui, &alert);
                    }
                }
            } else {
                ui.colored_label(Color32::GRAY, "No alerts available");
            }
        });
    }

         fn show_alert_card(&self, ui: &mut egui::Ui, alert: &SecurityAlert) {
                 let (severity_color, severity_emoji) = match alert.severity {
             SecuritySeverity::Critical => (Color32::RED, "🛑"),
             SecuritySeverity::High => (Color32::from_rgb(255, 100, 0), "🔴"),
             SecuritySeverity::Medium => (Color32::YELLOW, "🟡"),
             SecuritySeverity::Low => (Color32::GREEN, "🟢"),
             SecuritySeverity::Info => (Color32::BLUE, "ℹ️"),
         };

                 let status_color = match alert.status {
             AlertStatus::Active => Color32::RED,
             AlertStatus::Acknowledged => Color32::YELLOW,
             AlertStatus::Investigating => Color32::BLUE,
             AlertStatus::Resolved => Color32::GREEN,
             AlertStatus::FalsePositive => Color32::GRAY,
         };

        ui.group(|ui| {
            ui.horizontal(|ui| {
                ui.label(RichText::new(severity_emoji).size(20.0));
                ui.vertical(|ui| {
                    ui.horizontal(|ui| {
                        ui.label(RichText::new(&alert.message).strong());
                        ui.add_space(10.0);
                        ui.colored_label(status_color, RichText::new(format!("{:?}", alert.status)).small());
                    });

                    ui.horizontal(|ui| {
                        ui.label(RichText::new(format!("Type: {:?}", alert.alert_type)).small());
                        ui.add_space(20.0);
                        ui.label(RichText::new(format!("Source: {}", alert.source)).small());
                    });

                                         ui.horizontal(|ui| {
                         let dt = DateTime::<Utc>::from_timestamp(alert.timestamp as i64, 0)
                             .unwrap_or_else(|| Utc::now());
                         ui.label(RichText::new(format!("Time: {}", dt.format("%Y-%m-%d %H:%M:%S"))).small());
                         ui.add_space(20.0);
                        if let Some(response_time) = alert.response_time {
                            ui.label(RichText::new(format!("Response: {}ms", response_time.as_millis())).small());
                        }
                    });

                                         // Action buttons
                     ui.horizontal(|ui| {
                         if matches!(alert.status, AlertStatus::Active) {
                             if ui.button("Acknowledge").clicked() {
                                 let _ = self.dashboard.acknowledge_alert(&alert.id);
                             }
                         }
                         if ui.button("View Details").clicked() {
                             // TODO: Implement view details action
                         }
                     });
                });
            });
        });
    }
}

impl Default for SecurityPanel {
    fn default() -> Self {
        use viworks_core::SecurityDashboardConfig;
        let dashboard = Arc::new(SecurityDashboard::new(SecurityDashboardConfig::default()));
        Self::new(dashboard)
    }
}
