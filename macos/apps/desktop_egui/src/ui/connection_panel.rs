use eframe::egui::{self, Context, Ui};
use crate::state::app_state::AppState;
use crate::handlers::logging::LoggingHandler;
use crate::handlers::connection::ConnectionHandler;
use crate::handlers::diagnostics::DiagnosticsHandler;
use viworks_core::ConnectionState;
use std::sync::Arc;

/// Connection panel UI rendering
pub fn render_connection_panel(app_state: &mut AppState, ctx: &Context, state: &ConnectionState) {
    egui::CentralPanel::default().show(ctx, |ui| {
        // Header with status
        ui.horizontal(|ui| {
            ui.heading("🔗 ViWorkS Connection Manager");
            ui.add_space(20.0);
            
            // Overall status indicator
            let (status_text, status_color) = match state {
                ConnectionState::Connected => ("✅ Connected", egui::Color32::GREEN),
                ConnectionState::VpnConnecting => ("🔄 Connecting", egui::Color32::from_rgb(255, 140, 0)),
                ConnectionState::PortOpen => ("🔓 Port Open", egui::Color32::from_rgb(0, 191, 255)),
                ConnectionState::SpaSent => ("📤 SPA Sent", egui::Color32::from_rgb(255, 215, 0)),
                _ => ("✅ Ready to connect", egui::Color32::GREEN),
            };
            
            ui.colored_label(status_color, status_text);
        });
        
        // Connection mode banner
        ui.add_space(5.0);
        ui.colored_label(
            egui::Color32::from_rgb(0, 100, 200),
            "🔐 SPA → Stunnel → OpenVPN CONNECTION FLOW"
        );
        
        ui.add_space(20.0);
        
        // Three-section vertical layout
        ui.vertical(|ui| {
            ui.set_enabled(!app_state.is_busy);
            
            // Section 1: Configuration (Top 1/3)
            ui.group(|ui| {
                ui.heading("⚙️ Configuration");
                ui.add_space(10.0);
                
                // Two-column layout within configuration section
                ui.horizontal(|ui| {
                    // Left column - Server and SPA config
                    ui.vertical(|ui| {
                        // Server Configuration
                        ui.group(|ui| {
                            ui.heading("🌐 Server Configuration");
                            ui.add_space(5.0);
                            
                            ui.label("Server Host:");
                            ui.text_edit_singleline(&mut app_state.server_host);
                            
                            ui.label("Server Port:");
                            ui.text_edit_singleline(&mut app_state.server_port);
                        });
                        
                        ui.add_space(10.0);
                        
                        // SPA Configuration
                        ui.group(|ui| {
                            ui.heading("🔑 SPA Configuration");
                            ui.add_space(5.0);
                            
                            ui.horizontal(|ui| {
                                ui.checkbox(&mut app_state.skip_spa, "⏭️ Skip SPA");
                                if ui.button("ℹ️").clicked() {
                                    app_state.append_log("ℹ️ Skip SPA: Bypasses firewall authorization".to_string());
                                }
                            });
                            
                            if !app_state.skip_spa {
                                ui.label("SPA Key:");
                                ui.add(egui::TextEdit::singleline(&mut app_state.fwknop_key).password(true));
                                
                                ui.label("SPA HMAC:");
                                ui.add(egui::TextEdit::singleline(&mut app_state.fwknop_hmac).password(true));
                            }
                        });
                    });
                    
                    ui.add_space(15.0);
                    
                    // Right column - Stunnel and OpenVPN config
                    ui.vertical(|ui| {
                        // Stunnel Configuration
                        ui.group(|ui| {
                            ui.heading("🔐 Stunnel Configuration");
                            ui.add_space(5.0);
                            
                            ui.checkbox(&mut app_state.stunnel_enabled, "Enable Stunnel");
                            
                            if app_state.stunnel_enabled {
                                ui.label("Accept Address:");
                                ui.text_edit_singleline(&mut app_state.stunnel_accept);
                                
                                ui.label("Connect Address:");
                                ui.text_edit_singleline(&mut app_state.stunnel_connect);
                                
                                ui.horizontal(|ui| {
                                    ui.label("Certificate:");
                                    let mut cert_text = app_state.stunnel_cert.clone();
                                    ui.text_edit_singleline(&mut cert_text);
                                    
                                    if ui.button("📁").clicked() {
                                        if let Some(path) = rfd::FileDialog::new()
                                            .add_filter("Certificate Files", &["pem", "crt", "cer", "p12", "pfx"])
                                            .add_filter("All Files", &["*"])
                                            .pick_file() 
                                        {
                                            let path_str = path.to_string_lossy().to_string();
                                            app_state.stunnel_cert = path_str.clone();
                                            app_state.append_log(format!("📁 Selected certificate: {}", path_str));
                                        }
                                    }
                                });
                            }
                        });
                        
                        ui.add_space(10.0);
                        
                        // OpenVPN Configuration
                        ui.group(|ui| {
                            ui.heading("🔒 OpenVPN Configuration");
                            ui.add_space(5.0);
                            
                            ui.horizontal(|ui| {
                                ui.label("OVPN File:");
                                let mut ovpn_text = match &app_state.ovpn_path {
                                    Some(path) => path.clone(),
                                    None => "Default config".to_string(),
                                };
                                ui.text_edit_singleline(&mut ovpn_text);
                                
                                if ui.button("📁").clicked() {
                                    if let Some(path) = rfd::FileDialog::new()
                                        .add_filter("OpenVPN Config", &["ovpn"])
                                        .add_filter("All Files", &["*"])
                                        .pick_file() 
                                    {
                                        let path_str = path.to_string_lossy().to_string();
                                        app_state.ovpn_path = Some(path_str.clone());
                                        app_state.append_log(format!("📁 Selected OVPN: {}", path_str));
                                    }
                                }
                            });
                            
                            ui.label("Username:");
                            ui.text_edit_singleline(&mut app_state.ovpn_username);
                            
                            ui.label("Password:");
                            ui.add(egui::TextEdit::singleline(&mut app_state.ovpn_password).password(true));
                        });
                    });
                });
            });
            
            ui.add_space(15.0);
            
            // Section 2: Status and Actions (Middle 1/3)
            ui.horizontal(|ui| {
                // Status panel (left side)
                ui.vertical(|ui| {
                    ui.group(|ui| {
                        ui.heading("📊 Connection Status");
                        ui.add_space(10.0);
                        
                        // Get colors for status indicators
                        let (spa_status, spa_color) = if matches!(state, ConnectionState::SpaSent | ConnectionState::PortOpen | ConnectionState::VpnConnecting | ConnectionState::Connected) {
                            ("✅ Connected", egui::Color32::GREEN)
                        } else if app_state.skip_spa {
                            ("⏭️ Skipped", egui::Color32::from_rgb(255, 140, 0))
                        } else {
                            ("⏳ Pending", egui::Color32::GRAY)
                        };
                        
                        let (port_status, port_color) = if matches!(state, ConnectionState::PortOpen | ConnectionState::VpnConnecting | ConnectionState::Connected) {
                            ("✅ Open", egui::Color32::GREEN)
                        } else {
                            ("⏳ Pending", egui::Color32::GRAY)
                        };
                        
                        let (stunnel_status, stunnel_color) = if matches!(state, ConnectionState::Connected) {
                            ("✅ Active", egui::Color32::GREEN)
                        } else if matches!(state, ConnectionState::VpnConnecting) {
                            ("🔄 Connecting", egui::Color32::from_rgb(255, 140, 0))
                        } else {
                            ("⏳ Pending", egui::Color32::GRAY)
                        };
                        
                        let (vpn_status, vpn_color) = if matches!(state, ConnectionState::Connected) {
                            ("✅ Connected", egui::Color32::GREEN)
                        } else if matches!(state, ConnectionState::VpnConnecting) {
                            ("🔄 Connecting", egui::Color32::from_rgb(255, 140, 0))
                        } else {
                            ("⏳ Pending", egui::Color32::GRAY)
                        };
                        
                        ui.horizontal(|ui| {
                            ui.colored_label(spa_color, "📤 SPA:");
                            ui.colored_label(spa_color, &app_state.spa_status);
                        });
                        
                        ui.horizontal(|ui| {
                            ui.colored_label(port_color, "🔓 Port 8443:");
                            ui.colored_label(port_color, &app_state.port_status);
                        });
                        
                        ui.horizontal(|ui| {
                            ui.colored_label(stunnel_color, "🔐 Stunnel:");
                            ui.colored_label(stunnel_color, &app_state.stunnel_status);
                        });
                        
                        ui.horizontal(|ui| {
                            ui.colored_label(vpn_color, "🔒 OpenVPN:");
                            ui.colored_label(vpn_color, &app_state.vpn_status);
                        });
                        
                        if app_state.stunnel_enabled {
                            ui.horizontal(|ui| {
                                let stunnel_color = if app_state.stunnel_status.contains("✅") {
                                    egui::Color32::GREEN
                                } else if app_state.stunnel_status.contains("🔄") {
                                    egui::Color32::from_rgb(255, 140, 0)
                                } else if app_state.stunnel_status.contains("❌") {
                                    egui::Color32::RED
                                } else {
                                    egui::Color32::GRAY
                                };
                                ui.colored_label(stunnel_color, "🔐 Stunnel:");
                                ui.colored_label(stunnel_color, &app_state.stunnel_status);
                            });
                        }
                    });
                });
                
                ui.add_space(15.0);
                
                // Actions panel (right side)
                ui.vertical(|ui| {
                    ui.group(|ui| {
                        ui.heading("🚀 Connection Actions");
                        ui.add_space(10.0);
                        
                        ui.horizontal(|ui| {
                            if ui.button("📋 Load Test Config").clicked() && !app_state.is_busy {
                                app_state.load_test_config();
                            }
                            
                            if ui.button("🚀 Connect").clicked() && !app_state.is_busy {
                                app_state.connect_direct();
                            }
                        });
                        
                        ui.horizontal(|ui| {
                            if ui.button("🔍 Run Diagnostics").clicked() && !app_state.is_busy {
                                app_state.append_log("🔍 Starting diagnostics...".to_string());
                                DiagnosticsHandler::test_connection_diagnostics(app_state);
                                app_state.append_log("✅ Diagnostics completed".to_string());
                            }
                            
                            if ui.button("🧪 Test All Checks").clicked() && !app_state.is_busy {
                                DiagnosticsHandler::test_all_checks(app_state);
                            }
                        });
                        
                        ui.horizontal(|ui| {
                            if ui.button("🔌 Disconnect").clicked() && !app_state.is_busy {
                                app_state.disconnect();
                            }
                        });
                    });
                });
            });
            
            ui.add_space(15.0);
            
            // Section 3: Activity Log (Bottom 1/3)
            ui.group(|ui| {
                ui.heading("📋 Activity Log");
                ui.add_space(5.0);
                
                // Log controls
                ui.horizontal(|ui| {
                    if ui.button("🗑️ Clear").clicked() {
                        app_state.clear_log();
                    }
                    
                    if ui.button("📋 Copy").clicked() {
                        let log_text = app_state.unified_log.join("\n");
                        ui.output_mut(|o| o.copied_text = log_text);
                    }
                    
                    ui.label(format!("📊 {} entries", app_state.unified_log.len()));
                });
                
                ui.add_space(5.0);
                
                // Scrollable log area
                egui::ScrollArea::vertical()
                    .max_height(200.0)
                    .show(ui, |ui| {
                        if app_state.unified_log.is_empty() {
                            ui.centered_and_justified(|ui| {
                                ui.label("📝 No activity logged yet...");
                                ui.label("Start a connection to see detailed logs");
                            });
                        } else {
                            for (index, log_entry) in app_state.unified_log.iter().enumerate() {
                                ui.horizontal(|ui| {
                                    ui.label(format!("{:04}", index + 1));
                                    if log_entry.contains("✅") {
                                        ui.colored_label(egui::Color32::GREEN, log_entry);
                                    } else if log_entry.contains("❌") || log_entry.contains("💥") {
                                        ui.colored_label(egui::Color32::RED, log_entry);
                                    } else if log_entry.contains("🔄") || log_entry.contains("⏳") {
                                        ui.colored_label(egui::Color32::from_rgb(255, 140, 0), log_entry);
                                    } else if log_entry.contains("🔑") || log_entry.contains("🔐") || log_entry.contains("🔒") {
                                        ui.colored_label(egui::Color32::from_rgb(0, 191, 255), log_entry);
                                    } else {
                                        ui.label(log_entry);
                                    }
                                });
                            }
                        }
                    });
            });
        });
    });
}
