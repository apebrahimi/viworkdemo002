use eframe::egui::{self, Context, Ui};
use crate::state::app_state::AppState;
use crate::handlers::logging::LoggingHandler;
use crate::handlers::connection::ConnectionHandler;
use std::sync::Arc;
use viworks_core::ConnectionEvent;

/// Error panel UI rendering
pub fn render_error_panel(app_state: &mut AppState, ctx: &Context, error: &str, can_retry: bool) {
    egui::CentralPanel::default().show(ctx, |ui| {
        ui.vertical_centered(|ui| {
            ui.add_space(50.0);
            
            // Error container
            ui.group(|ui| {
                ui.heading("❌ Connection Error");
                ui.add_space(20.0);
                
                // Error message
                ui.colored_label(egui::Color32::RED, "Error Details:");
                ui.label(error);
                ui.add_space(20.0);
                
                // Action buttons
                ui.horizontal(|ui| {
                    if can_retry {
                        if ui.button("🔄 Retry").clicked() {
                            let fsm = Arc::clone(&app_state.fsm);
                            
                            app_state.spawn_async_task(async move {
                                let mut fsm = fsm.lock().unwrap();
                                fsm.handle_event(ConnectionEvent::Retry)?;
                                Ok::<(), viworks_core::ViWorksError>(())
                            });
                        }
                    }
                    
                    if ui.button("🔙 Back to Login").clicked() {
                        app_state.handle_logout_sync();
                    }
                });
            });
        });
    });
}
