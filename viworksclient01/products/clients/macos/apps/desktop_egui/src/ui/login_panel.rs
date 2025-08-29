use eframe::egui;
use std::sync::Arc;
use tracing::{info, error};
use viworks_core::SecretString;
use crate::state::app_state::{AppState, LoginState};
use crate::handlers::logging::LoggingHandler;
use crate::handlers::connection::ConnectionHandler;

pub fn render_login_panel(app_state: &mut AppState, ui: &mut egui::Ui) {
    match app_state.login_state {
        LoginState::NotLoggedIn => render_login_form(app_state, ui),
        LoginState::LoginInProgress => render_login_progress(app_state, ui),
        LoginState::AwaitingTwoFactor => render_2fa_screen(app_state, ui),
        LoginState::LoggedIn => render_logged_in_screen(app_state, ui),
    }
}

fn render_login_form(app_state: &mut AppState, ui: &mut egui::Ui) {
    ui.heading("🔐 ViWorkS Client Login");
    ui.add_space(20.0);
    
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
    
    // Error message display
    if let Some(error_msg) = &app_state.error_message {
        ui.colored_label(egui::Color32::from_rgb(255, 0, 0), format!("❌ {}", error_msg));
        ui.add_space(10.0);
    }
    
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
                device_id: "macos-client-device".to_string(),
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
                            // Log success and return
                            info!("2FA code requested successfully: {}", code);
                        }
                        Err(e) => {
                            error!("2FA request failed: {:?}", e);
                        }
                    }
                }
                Err(e) => {
                    error!("Login failed: {:?}", e);
                    // If macOS auth fails, trigger Android auth
                    info!("Triggering Android app authentication as fallback");
                }
            }
        });
        
        app_state.pending_tasks.push(handle);
        app_state.is_busy = true;
    }
}

fn render_login_progress(app_state: &mut AppState, ui: &mut egui::Ui) {
    ui.heading("🔄 Authenticating...");
    ui.add_space(20.0);
    
    // Check if Android auth is required
    if app_state.show_android_auth {
        ui.colored_label(egui::Color32::from_rgb(255, 165, 0), 
            "📱 Android App Authentication Required");
        ui.add_space(15.0);
        
        ui.label("macOS authentication failed. Please use your Android app to authenticate.");
        ui.add_space(10.0);
        
        // Show a loading spinner
        ui.add(egui::widgets::Spinner::new());
        ui.add_space(20.0);
        
        // Transition to 2FA screen with Android auth
        app_state.login_state = LoginState::AwaitingTwoFactor;
        return;
    }
    
    ui.label("Please wait while we authenticate your credentials...");
    ui.add_space(10.0);
    
    // Show a loading spinner
    ui.add(egui::widgets::Spinner::new());
    ui.add_space(20.0);
    
    // Check if we have a result from the async task
    // Check for completed tasks (handled in main app loop)
    
    // If login was successful, transition to 2FA
    if app_state.login_state == LoginState::AwaitingTwoFactor {
        app_state.append_log("✅ Login successful, 2FA required".to_string());
    }
}

fn render_2fa_screen(app_state: &mut AppState, ui: &mut egui::Ui) {
    ui.heading("🔐 Two-Factor Authentication");
    ui.add_space(20.0);
    
    // Show Android app authentication section
    if app_state.show_android_auth {
        ui.colored_label(egui::Color32::from_rgb(255, 165, 0), 
            "📱 Android App Authentication Required");
        ui.add_space(15.0);
        
        ui.label("Please enter the authentication code from your Android app:");
        ui.add_space(10.0);
        
        // Android auth code input
        ui.horizontal(|ui| {
            ui.label("🔑 Auth Code:");
            ui.text_edit_singleline(&mut app_state.android_auth_code);
        });
        ui.add_space(15.0);
        
        // Show attempts counter
        if app_state.auth_code_attempts > 0 {
            ui.colored_label(egui::Color32::from_rgb(255, 140, 0), 
                format!("⚠️ Attempts: {}", app_state.auth_code_attempts));
            ui.add_space(10.0);
        }
        
        ui.horizontal(|ui| {
            // Validate Android auth code button
            if ui.button("✅ Validate Android Code").clicked() && !app_state.is_busy {
                if app_state.android_auth_code.is_empty() {
                    app_state.append_log("❌ Android authentication code is required".to_string());
                    return;
                }
                
                app_state.auth_code_attempts += 1;
                app_state.append_log(format!("🔐 Validating Android auth code (attempt {})", app_state.auth_code_attempts));
                
                // TODO: Implement Android auth code validation
                // For now, simulate validation
                if app_state.android_auth_code == "123456" {
                    app_state.handle_android_auth_success();
                } else {
                    app_state.append_log("❌ Invalid Android authentication code".to_string());
                    app_state.android_auth_code.clear();
                }
            }
            
            // Skip Android auth button
            if ui.button("⏭️ Skip Android Auth").clicked() {
                app_state.append_log("⚠️ Skipping Android authentication - proceeding with connection setup".to_string());
                app_state.clear_android_auth();
                app_state.handle_android_auth_success();
            }
        });
        
        ui.add_space(20.0);
        ui.separator();
        ui.add_space(20.0);
    }
    
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
            app_state.android_auth_code.clear();
            app_state.session_token = None;
            app_state.show_android_auth = false;
            app_state.auth_code_attempts = 0;
        }
    });
    
    // Device registration section
    ui.add_space(30.0);
    ui.separator();
    ui.add_space(10.0);
    
    ui.heading("📱 Device Management");
    ui.add_space(10.0);
    
    ui.label("Register this device for enhanced security:");
    ui.add_space(10.0);
    
    if ui.button("🔧 Register Device").clicked() && !app_state.is_busy {
        let auth_client = app_state.auth_client.clone();
        let username = app_state.username.clone();
        
        app_state.spawn_async_task(async move {
            // Get device information
            let device_info = viworks_auth_api::DeviceInfo {
                model: "MacBook Pro".to_string(),
                os: "macOS".to_string(),
                app_version: "1.0.0".to_string(),
                manufacturer: Some("Apple".to_string()),
                device_name: Some("MacOS Client".to_string()),
            };
            
            // Register device (using a demo user ID for now)
            let user_id = "demo-user-id";
            let device_id = "macos-client-device";
            
            match auth_client.register_device(user_id, device_id, device_info).await {
                Ok(response) => {
                    info!("Device registration successful: {}", response.message);
                }
                Err(e) => {
                    error!("Device registration failed: {:?}", e);
                }
            }
            
            Ok::<(), viworks_core::ViWorksError>(())
        });
    }
    
    ui.add_space(10.0);
    
    if ui.button("📋 List Registered Devices").clicked() && !app_state.is_busy {
        let auth_client = app_state.auth_client.clone();
        
        app_state.spawn_async_task(async move {
            // For demo purposes, use a mock session token
            let session_token = "demo-session-token";
            
            match auth_client.list_devices(session_token).await {
                Ok(response) => {
                    info!("Found {} registered devices", response.devices.len());
                    for device in response.devices {
                        info!("Device: {} ({}) - {}", device.model, device.device_id, device.os);
                    }
                }
                Err(e) => {
                    error!("Failed to list devices: {:?}", e);
                }
            }
            
            Ok::<(), viworks_core::ViWorksError>(())
        });
    }
}

fn render_logged_in_screen(app_state: &mut AppState, ui: &mut egui::Ui) {
    ui.heading("✅ Successfully Logged In");
    ui.add_space(20.0);
    
    ui.colored_label(egui::Color32::from_rgb(0, 255, 0), 
        format!("Welcome, {}!", app_state.username));
    ui.add_space(15.0);
    
    ui.label("You are now authenticated and ready to connect.");
    ui.add_space(20.0);
    
    // Connection status
    ui.heading("🔗 Connection Status");
    ui.add_space(10.0);
    
    ui.label(format!("SPA Status: {}", app_state.spa_status));
    ui.label(format!("Stunnel Status: {}", app_state.stunnel_status));
    ui.label(format!("VPN Status: {}", app_state.vpn_status));
    ui.label(format!("Port Status: {}", app_state.port_status));
    
    ui.add_space(20.0);
    
    // Connection controls
    ui.heading("🎛️ Connection Controls");
    ui.add_space(10.0);
    
    ui.horizontal(|ui| {
        if ui.button("🔌 Connect").clicked() {
            app_state.append_log("🔄 Initiating connection...".to_string());
            // TODO: Implement connection logic
        }
        
        if ui.button("🔌 Disconnect").clicked() {
            app_state.append_log("🔄 Disconnecting...".to_string());
            // TODO: Implement disconnection logic
        }
    });
    
    ui.add_space(20.0);
    
    // Logout button
    if ui.button("🚪 Logout").clicked() {
        app_state.login_state = LoginState::NotLoggedIn;
        app_state.username.clear();
        app_state.password.clear();
        app_state.two_fa_code.clear();
        app_state.session_token = None;
        app_state.append_log("👋 Logged out successfully".to_string());
    }
}
