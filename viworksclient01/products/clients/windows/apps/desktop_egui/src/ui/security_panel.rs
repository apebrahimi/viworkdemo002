use eframe::egui::{self, Context, Color32, RichText};
use viworks_core::{SecurityDashboard, SecurityAlert, ThreatLevel, SecuritySeverity, AlertStatus};
use std::sync::Arc;

pub struct SecurityPanel {
    dashboard: Arc<SecurityDashboard>,
    auto_refresh: bool,
    show_resolved: bool,
    filter_severity: Option<SecuritySeverity>,
}

impl SecurityPanel {
    pub fn new(dashboard: Arc<SecurityDashboard>) -> Self {
        Self {
            dashboard,
            auto_refresh: true,
            show_resolved: false,
            filter_severity: None,
        }
    }

    pub fn show(&mut self, ctx: &Context) {
        egui::Window::new("🔒 Security Monitoring Dashboard")
            .default_width(800.0)
            .default_height(600.0)
            .resizable(true)
            .show(ctx, |ui| {
                self.show_header(ui);
                ui.separator();
                self.show_metrics(ui);
                ui.separator();
                self.show_threat_level(ui);
                ui.separator();
                self.show_alerts(ui);
            });
    }

    fn show_header(&mut self, ui: &mut egui::Ui) {
        ui.horizontal(|ui| {
            ui.heading("🛡️ Security Status");
            
            ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                if ui.button("🔄 Refresh").clicked() {
                    // Refresh data
                    if let Ok(metrics) = self.dashboard.get_metrics() {
                        tracing::info!("Security dashboard refreshed");
                    }
                }
                
                ui.checkbox(&mut self.auto_refresh, "Auto-refresh");
                
                if ui.button("📊 Generate Report").clicked() {
                    if let Ok(report) = self.dashboard.generate_report() {
                        tracing::info!("Security report generated: {} total alerts", report.total_alerts);
                        // In a real implementation, you would save the report to file
                    }
                }
            });
        });
    }

    fn show_metrics(&self, ui: &mut egui::Ui) {
        if let Ok(metrics) = self.dashboard.get_metrics() {
            ui.label(RichText::new("📈 Security Metrics").size(16.0).strong());
            
            egui::Grid::new("security_metrics")
                .num_columns(4)
                .spacing([20.0, 10.0])
                .show(ui, |ui| {
                    // First row
                    self.metric_card(ui, "Total Events", &metrics.total_events.to_string(), Color32::BLUE);
                    self.metric_card(ui, "Active Alerts", &metrics.active_alerts.to_string(), Color32::from_rgb(255, 165, 0));
                    self.metric_card(ui, "Resolved Alerts", &metrics.resolved_alerts.to_string(), Color32::GREEN);
                    self.metric_card(ui, "Uptime", &format!("{}s", metrics.uptime_seconds), Color32::GRAY);
                    ui.end_row();
                    
                    // Second row - average response time
                    let response_time = if metrics.average_response_time > 0.0 {
                        format!("{:.1}ms", metrics.average_response_time)
                    } else {
                        "N/A".to_string()
                    };
                    self.metric_card(ui, "Avg Response", &response_time, Color32::from_rgb(128, 0, 128));
                    
                    // Show top event types
                    if let Some((top_event, count)) = metrics.events_by_type.iter().max_by_key(|(_, &v)| v) {
                        self.metric_card(ui, "Top Event", &format!("{}: {}", top_event, count), Color32::DARK_BLUE);
                    } else {
                        self.metric_card(ui, "Top Event", "None", Color32::DARK_GRAY);
                    }
                    
                    ui.end_row();
                });
        }
    }

    fn metric_card(&self, ui: &mut egui::Ui, title: &str, value: &str, color: Color32) {
        egui::Frame::none()
            .fill(color.gamma_multiply(0.1))
            .stroke(egui::Stroke::new(1.0, color))
            .rounding(egui::Rounding::same(5.0))
            .inner_margin(egui::Margin::same(10.0))
            .show(ui, |ui| {
                ui.vertical_centered(|ui| {
                    ui.label(RichText::new(value).size(20.0).strong().color(color));
                    ui.label(RichText::new(title).size(12.0).color(Color32::GRAY));
                });
            });
    }

    fn show_threat_level(&self, ui: &mut egui::Ui) {
        if let Ok(metrics) = self.dashboard.get_metrics() {
            ui.label(RichText::new("🎯 Threat Level Assessment").size(16.0).strong());
            
            let (color, emoji) = match metrics.threat_level {
                ThreatLevel::Green => (Color32::GREEN, "🟢"),
                ThreatLevel::Yellow => (Color32::YELLOW, "🟡"),
                ThreatLevel::Orange => (Color32::from_rgb(255, 165, 0), "🟠"),
                ThreatLevel::Red => (Color32::RED, "🔴"),
                ThreatLevel::Critical => (Color32::DARK_RED, "🚨"),
            };
            
            egui::Frame::none()
                .fill(color.gamma_multiply(0.1))
                .stroke(egui::Stroke::new(2.0, color))
                .rounding(egui::Rounding::same(8.0))
                .inner_margin(egui::Margin::same(15.0))
                .show(ui, |ui| {
                    ui.horizontal(|ui| {
                        ui.label(RichText::new(emoji).size(30.0));
                        ui.vertical(|ui| {
                            ui.label(RichText::new(format!("{:?}", metrics.threat_level))
                                .size(20.0)
                                .strong()
                                .color(color));
                            ui.label(self.get_threat_description(&metrics.threat_level));
                        });
                    });
                });
        }
    }

    fn get_threat_description(&self, threat_level: &ThreatLevel) -> &'static str {
        match threat_level {
            ThreatLevel::Green => "All systems secure. No threats detected.",
            ThreatLevel::Yellow => "Low-level security events detected. Monitoring continues.",
            ThreatLevel::Orange => "Medium-risk security events require attention.",
            ThreatLevel::Red => "High-risk security threats detected. Immediate review recommended.",
            ThreatLevel::Critical => "Critical security threats detected. Immediate action required!",
        }
    }

    fn show_alerts(&mut self, ui: &mut egui::Ui) {
        ui.label(RichText::new("🚨 Security Alerts").size(16.0).strong());
        
        // Alert controls
        ui.horizontal(|ui| {
            ui.checkbox(&mut self.show_resolved, "Show resolved alerts");
            
            ui.label("Filter by severity:");
            egui::ComboBox::from_label("")
                .selected_text(format!("{:?}", self.filter_severity.as_ref().unwrap_or(&SecuritySeverity::Info)))
                .show_ui(ui, |ui| {
                    ui.selectable_value(&mut self.filter_severity, None, "All");
                    ui.selectable_value(&mut self.filter_severity, Some(SecuritySeverity::Critical), "Critical");
                    ui.selectable_value(&mut self.filter_severity, Some(SecuritySeverity::High), "High");
                    ui.selectable_value(&mut self.filter_severity, Some(SecuritySeverity::Medium), "Medium");
                    ui.selectable_value(&mut self.filter_severity, Some(SecuritySeverity::Low), "Low");
                    ui.selectable_value(&mut self.filter_severity, Some(SecuritySeverity::Info), "Info");
                });
        });
        
        ui.separator();
        
        // Show alerts
        egui::ScrollArea::vertical()
            .max_height(300.0)
            .show(ui, |ui| {
                if let Ok(alerts) = if self.show_resolved {
                    self.dashboard.get_all_alerts()
                } else {
                    self.dashboard.get_active_alerts()
                } {
                    let filtered_alerts: Vec<_> = alerts.iter()
                        .filter(|alert| {
                            if let Some(ref filter_sev) = self.filter_severity {
                                std::mem::discriminant(&alert.severity) == std::mem::discriminant(filter_sev)
                            } else {
                                true
                            }
                        })
                        .collect();
                    
                    if filtered_alerts.is_empty() {
                        ui.label("No alerts match the current filter criteria.");
                        return;
                    }
                    
                    for alert in filtered_alerts {
                        self.show_alert_card(ui, alert);
                        ui.separator();
                    }
                } else {
                    ui.label("Error loading alerts.");
                }
            });
    }

    fn show_alert_card(&self, ui: &mut egui::Ui, alert: &SecurityAlert) {
        let (severity_color, severity_emoji) = match alert.severity {
            SecuritySeverity::Critical => (Color32::DARK_RED, "🚨"),
            SecuritySeverity::High => (Color32::RED, "⚠️"),
            SecuritySeverity::Medium => (Color32::from_rgb(255, 165, 0), "📢"),
            SecuritySeverity::Low => (Color32::YELLOW, "📝"),
            SecuritySeverity::Info => (Color32::BLUE, "ℹ️"),
        };
        
        let status_color = match alert.status {
            AlertStatus::Active => Color32::RED,
            AlertStatus::Acknowledged => Color32::YELLOW,
            AlertStatus::Investigating => Color32::BLUE,
            AlertStatus::Resolved => Color32::GREEN,
            AlertStatus::FalsePositive => Color32::GRAY,
        };
        
        egui::Frame::none()
            .fill(severity_color.gamma_multiply(0.05))
            .stroke(egui::Stroke::new(1.0, severity_color))
            .rounding(egui::Rounding::same(5.0))
            .inner_margin(egui::Margin::same(10.0))
            .show(ui, |ui| {
                ui.horizontal(|ui| {
                    ui.label(RichText::new(severity_emoji).size(20.0));
                    
                    ui.vertical(|ui| {
                        ui.horizontal(|ui| {
                            ui.label(RichText::new(&alert.message).strong());
                            ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                                ui.label(RichText::new(format!("{:?}", alert.status))
                                    .small()
                                    .color(status_color));
                            });
                        });
                        
                        ui.horizontal(|ui| {
                            ui.label(RichText::new(format!("Type: {:?}", alert.alert_type)).small());
                            ui.label(RichText::new(format!("Source: {}", alert.source)).small());
                            ui.label(RichText::new(format!("ID: {}", &alert.id[..8])).small());
                        });
                        
                        if let Some(response_time) = alert.response_time {
                            ui.label(RichText::new(format!("Response time: {:?}", response_time)).small().color(Color32::GREEN));
                        }
                    });
                    
                    ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                        if matches!(alert.status, AlertStatus::Active) {
                            if ui.button("✅ Acknowledge").clicked() {
                                let _ = self.dashboard.acknowledge_alert(&alert.id);
                            }
                            if ui.button("✔️ Resolve").clicked() {
                                let response_time = std::time::Duration::from_secs(30); // Placeholder
                                let _ = self.dashboard.resolve_alert(&alert.id, response_time);
                            }
                        }
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
