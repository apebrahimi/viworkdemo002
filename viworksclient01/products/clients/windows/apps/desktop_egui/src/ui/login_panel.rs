use eframe::egui::{self, Context, Ui};
use crate::state::app_state::{AppState, LoginState};
use crate::handlers::logging::LoggingHandler;
use crate::handlers::connection::ConnectionHandler;
use viworks_core::{ConnectionEvent, Result};
use std::sync::Arc;
use tracing::info;

/// Login panel UI rendering
pub fn render_login_panel(app_state: &mut AppState, ctx: &Context) {
    egui::CentralPanel::default().show(ctx, |ui| {
        // Center the login form
        ui.vertical_centered(|ui| {
            ui.add_space(50.0);
            
            // Main login container
            ui.group(|ui| {
                match app_state.login_state {
                    LoginState::NotLoggedIn | LoginState::LoginInProgress => {
                        render_login_screen(app_state, ui);
                    }
                    LoginState::AwaitingTwoFactor => {
                        render_2fa_screen(app_state, ui);
                    }
                    LoginState::LoggedIn => {
                        // This shouldn't happen as the UI should switch to connection screen
                        ui.label("✅ Authentication successful!");
                    }
                }
            });
            
            ui.add_space(20.0);
            
            // Version info
            ui.label("ViWorkS Client v1.0.0");
        });
    });
}

fn render_login_screen(app_state: &mut AppState, ui: &mut egui::Ui) {
    ui.heading("🔐 ViWorkS Client Login");
    ui.add_space(20.0);
    
    // Backend connection status
    ui.colored_label(egui::Color32::from_rgb(0, 255, 0), "🌐 Connected to Backend API (localhost:8080)");
    ui.colored_label(egui::Color32::from_rgb(255, 165, 0), "Use 'testuser' with password '12345' or any username with '12345'");
    ui.add_space(15.0);
    
    // Username field
    ui.label("Username:");
    ui.text_edit_singleline(&mut app_state.username);
    ui.add_space(10.0);
    
    // Password field
    ui.label("Password:");
    ui.add(egui::TextEdit::singleline(&mut app_state.password).password(true));
    ui.add_space(10.0);
    
    // Remember me checkbox
    ui.checkbox(&mut app_state.remember_me, "Remember me");
    ui.add_space(20.0);
    
    // Login button  
    let login_enabled = app_state.login_state == LoginState::NotLoggedIn && !app_state.is_busy;
    if ui.add_enabled(login_enabled, egui::Button::new("🚀 Login")).clicked() {
        // Validate inputs immediately
        if app_state.username.is_empty() {
            app_state.append_log("❌ Username is required".to_string());
            return;
        }
        if app_state.password.is_empty() {
            app_state.append_log("❌ Password is required".to_string());
            return;
        }
        
        let auth_client = app_state.auth_client.clone();
        let username = app_state.username.clone();
        let password = app_state.password.clone();
        
        app_state.clear_error();
        app_state.append_log(format!("🔐 Attempting login for user: {}", username));
        app_state.login_state = LoginState::LoginInProgress;
        
        let handle = app_state.runtime.spawn(async move {
            // Create login request
            let login_request = viworks_core::LoginRequest {
                username: username.clone(),
                password: viworks_core::SecretString::new(password),
                device_id: "windows-client-device".to_string(),
                client_version: "1.0.0".to_string(),
            };
            
            // Call backend login API
            match auth_client.login(login_request).await {
                Ok(_) => {
                    info!("Login successful, requesting 2FA code...");
                    
                    // Request 2FA code
                    match auth_client.request_2fa_code(&username).await {
                        Ok(code) => {
                            info!("2FA code requested successfully: {}", code);
                            Ok(("login_success".to_string(), code))
                        }
                        Err(e) => {
                            Err(format!("2FA request failed: {:?}", e))
                        }
                    }
                }
                Err(e) => {
                    Err(format!("Login failed: {:?}", e))
                }
            }
        });
        
        app_state.pending_tasks.push(handle);
        app_state.is_busy = true;
    }
}

fn render_2fa_screen(app_state: &mut AppState, ui: &mut egui::Ui) {
    ui.heading("🔐 Two-Factor Authentication");
    ui.add_space(20.0);
    
    ui.colored_label(egui::Color32::from_rgb(0, 255, 0), 
        format!("📱 2FA code has been sent to your Android app for user: {}", app_state.username));
    ui.add_space(15.0);
    
    ui.label("Enter the 6-digit code from your Android app:");
    ui.text_edit_singleline(&mut app_state.two_fa_code);
    ui.add_space(20.0);
    
    ui.horizontal(|ui| {
        // Validate button
        if ui.button("✅ Validate Code").clicked() && !app_state.is_busy {
            let auth_client = app_state.auth_client.clone();
            let username = app_state.username.clone();
            let code = app_state.two_fa_code.clone();
            let fsm = Arc::clone(&app_state.fsm);
            
            app_state.spawn_async_task(async move {
                if code.is_empty() {
                    return Err(viworks_core::ViWorksError::Internal("2FA code is required".to_string()));
                }
                
                // Validate 2FA code
                let session_token = auth_client.validate_2fa_code(&username, &code).await?;
                
                info!("2FA validation successful, fetching connection configs...");
                
                // Get connection configurations
                let bootstrap_data = auth_client.bootstrap(&username, session_token.as_str()).await?;
                
                info!("Connection configurations retrieved successfully");
                
                // Create auth tokens for compatibility
                let tokens = viworks_auth_api::AuthTokens {
                    access_token: session_token.clone(),
                    refresh_token: viworks_core::SecretString::new("refresh_token".to_string()),
                    expires_at: chrono::Utc::now() + chrono::Duration::hours(24),
                };
                
                // Update FSM
                {
                    let mut fsm = fsm.lock().unwrap();
                    fsm.set_auth_tokens(tokens);
                    fsm.handle_event(viworks_core::ConnectionEvent::Login)?;
                }
                
                Ok::<(), viworks_core::ViWorksError>(())
            });
        }
        
        // Back button
        if ui.button("⬅ Back to Login").clicked() {
            app_state.login_state = LoginState::NotLoggedIn;
            app_state.two_fa_code.clear();
            app_state.session_token = None;
        }
    });
}
