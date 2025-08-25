use eframe::{egui, CreationContext, Frame};
use tokio::runtime::Runtime;
use viworks_core::ConnectionState;
use std::time::Duration;
use tracing::{info, error};
use egui::Context;

// Import our new modular components

use crate::state::AppState;
use crate::handlers::{LoggingHandler, DiagnosticsHandler, ConnectionHandler};
use crate::ui::{render_login_panel, render_error_panel, render_connection_panel, SecurityPanel};

pub struct ViWorksApp {
    state: AppState,
    security_panel: SecurityPanel,
    show_security_dashboard: bool,
}

impl ViWorksApp {
    pub fn new(cc: &CreationContext<'_>, runtime: Runtime) -> Self {
        Self {
            state: AppState::new(runtime),
            security_panel: SecurityPanel::default(),
            show_security_dashboard: false,
        }
    }
}

impl eframe::App for ViWorksApp {
    fn update(&mut self, ctx: &Context, _frame: &mut Frame) {
        // Handle auto-logout timer
        if let Some(last_activity) = self.state.last_activity {
            if last_activity.elapsed() > Duration::from_secs(self.state.config.auto_logout_timeout) {
                self.state.handle_logout_sync();
                return;
            }
        }

        // Clean up completed tasks and update busy state
        let completed_count = self.state.pending_tasks.len();
        self.state.pending_tasks.retain(|handle| !handle.is_finished());
        let remaining_count = self.state.pending_tasks.len();
        
        if completed_count > remaining_count {
            self.state.is_busy = false;
            self.state.append_log("Operation completed".to_string());
        }

        // Get current state without holding the lock
        let current_state = {
            let fsm = self.state.fsm.lock().unwrap();
            fsm.state().clone()
        };

        // Top menu bar for security dashboard
        egui::TopBottomPanel::top("top_panel").show(ctx, |ui| {
            egui::menu::bar(ui, |ui| {
                ui.menu_button("🛡️ Security", |ui| {
                    if ui.button("📊 Security Dashboard").clicked() {
                        self.show_security_dashboard = !self.show_security_dashboard;
                        ui.close_menu();
                    }
                    if ui.button("🔒 Generate Security Report").clicked() {
                        // Generate security report
                        ui.close_menu();
                    }
                });
                
                ui.menu_button("🔧 Tools", |ui| {
                    if ui.button("📋 View Logs").clicked() {
                        ui.close_menu();
                    }
                    if ui.button("⚙️ Settings").clicked() {
                        ui.close_menu();
                    }
                });
                
                ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                    ui.label("ViWorkS Client v1.0.0");
                });
            });
        });

        // Show security dashboard if requested
        if self.show_security_dashboard {
            self.security_panel.show(ctx);
        }

        // Update UI based on FSM state
        egui::CentralPanel::default().show(ctx, |ui| {
            match current_state {
                ConnectionState::Idle => {
                    render_login_panel(&mut self.state, ctx);
                }
                ConnectionState::Error { error, can_retry } => {
                    render_error_panel(&mut self.state, ctx, &error, can_retry);
                }
                _ => {
                    render_connection_panel(&mut self.state, ctx, &current_state);
                }
            }
        });

        // Handle UI interactions
        if ctx.input(|i| i.key_pressed(egui::Key::Escape)) {
            self.state.handle_logout_sync();
        }
        
        // Handle F12 for security dashboard toggle
        if ctx.input(|i| i.key_pressed(egui::Key::F12)) {
            self.show_security_dashboard = !self.show_security_dashboard;
        }
    }
}
