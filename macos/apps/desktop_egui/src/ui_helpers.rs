use egui::{Color32, Ui, Response, Key};
// Remove unused imports
use viworks_core::ConnectionState;

pub fn show_error_banner(ui: &mut Ui, error: &str) {
    ui.add_space(10.0);
    ui.horizontal(|ui| {
        ui.colored_label(Color32::RED, "⚠");
        ui.colored_label(Color32::RED, format!("Error: {}", error));
    });
    ui.add_space(10.0);
}

pub fn show_success_banner(ui: &mut Ui, message: &str) {
    ui.add_space(10.0);
    ui.horizontal(|ui| {
        ui.colored_label(Color32::GREEN, "✓");
        ui.colored_label(Color32::GREEN, message);
    });
    ui.add_space(10.0);
}

pub fn show_info_banner(ui: &mut Ui, message: &str) {
    ui.add_space(10.0);
    ui.horizontal(|ui| {
        ui.colored_label(Color32::BLUE, "ℹ");
        ui.colored_label(Color32::BLUE, message);
    });
    ui.add_space(10.0);
}

pub fn show_warning_banner(ui: &mut Ui, message: &str) {
    ui.add_space(10.0);
    ui.horizontal(|ui| {
        ui.colored_label(Color32::YELLOW, "⚠");
        ui.colored_label(Color32::YELLOW, message);
    });
    ui.add_space(10.0);
}

// Simplified MaskedTextEdit implementation
pub struct MaskedTextEdit<'a> {
    text: &'a mut String,
    placeholder: String,
    password: bool,
}

impl<'a> MaskedTextEdit<'a> {
    pub fn new(text: &'a mut String, placeholder: impl Into<String>) -> Self {
        Self {
            text,
            placeholder: placeholder.into(),
            password: false,
        }
    }
    
    pub fn password(mut self) -> Self {
        self.password = true;
        self
    }
    
    pub fn show(self, ui: &mut Ui) -> Response {
        if self.password {
            ui.add(egui::TextEdit::singleline(self.text).password(true))
        } else {
            ui.text_edit_singleline(self.text)
        }
    }
}

pub fn masked_input(ui: &mut Ui, text: &mut String, _placeholder: &str, password: bool) -> Response {
    // Simplified implementation that uses egui's built-in password masking
    if password {
        ui.add(egui::TextEdit::singleline(text).password(true))
    } else {
        ui.text_edit_singleline(text)
    }
}

pub fn connection_status_indicator(ui: &mut Ui, state: &ConnectionState) {
    ui.horizontal(|ui| {
        let (color, text, icon) = match state {
            ConnectionState::Idle => (Color32::GRAY, "Not Connected", "⭕"),
            ConnectionState::Preflight => (Color32::YELLOW, "Preflight Checks", "⏳"),
            ConnectionState::Authenticated => (Color32::BLUE, "Ready", "🔵"),
            ConnectionState::BootstrapManual | ConnectionState::BootstrapFetch => {
                (Color32::BLUE, "Configuring", "⚙")
            }
            ConnectionState::SpaSent => (Color32::YELLOW, "SPA Sent", "📤"),
            ConnectionState::PortOpen => (Color32::YELLOW, "Port Open", "🔓"),
            ConnectionState::VpnConnecting => (Color32::YELLOW, "Connecting", "🔄"),
            ConnectionState::Connected => (Color32::GREEN, "Connected", "✅"),
            ConnectionState::Error { error: _, can_retry } => {
                if *can_retry {
                    (Color32::YELLOW, "Error (Retry Available)", "⚠")
                } else {
                    (Color32::RED, "Error", "❌")
                }
            }
        };
        
        ui.colored_label(color, icon);
        ui.colored_label(color, text);
    });
}

pub fn progress_bar(ui: &mut Ui, progress: f32, text: &str) {
    ui.horizontal(|ui| {
        ui.label(text);
        ui.add_space(10.0);
        ui.add(egui::ProgressBar::new(progress).show_percentage());
    });
}

pub fn spinning_indicator(ui: &mut Ui, text: &str) {
    let _time = ui.input(|i| i.time);
    // Simplified implementation without animation
    ui.horizontal(|ui| {
        ui.label("⟳");
        ui.label(text);
    });
}

pub fn connection_step_indicator(ui: &mut Ui, current_step: usize, _total_steps: usize, steps: &[&str]) {
    ui.add_space(10.0);
    
    for (i, step) in steps.iter().enumerate() {
        let is_current = i == current_step;
        let is_completed = i < current_step;
        
        let (color, icon) = if is_completed {
            (Color32::GREEN, "✓")
        } else if is_current {
            (Color32::BLUE, "●")
        } else {
            (Color32::GRAY, "○")
        };
        
        ui.horizontal(|ui| {
            ui.colored_label(color, icon);
            ui.colored_label(color, *step);
        });
    }
    
    ui.add_space(10.0);
}

pub fn secure_field(ui: &mut Ui, label: &str, value: &mut String, placeholder: &str) -> Response {
    ui.label(label);
    masked_input(ui, value, placeholder, true)
}

pub fn file_picker_button(ui: &mut Ui, label: &str, file_path: &mut Option<String>, filter: &[&str]) -> Response {
    ui.horizontal(|ui| {
        let response = ui.button(label);
        
        if response.clicked() {
            if let Some(path) = rfd::FileDialog::new()
                .add_filter("Files", filter)
                .pick_file() {
                *file_path = Some(path.to_string_lossy().to_string());
            }
        }
        
        if let Some(ref path) = file_path {
            ui.label(format!("Selected: {}", path));
        }
        
        response
    }).response
}

pub fn status_log_viewer(ui: &mut Ui, logs: &[String], max_height: f32) {
    ui.label("Status Log:");
    egui::ScrollArea::vertical().max_height(max_height).show(ui, |ui| {
        for log_entry in logs {
            ui.label(log_entry);
        }
    });
}

pub fn confirmation_dialog(ui: &mut Ui, title: &str, message: &str) -> Option<bool> {
    let mut result = None;
    
    egui::Window::new(title)
        .collapsible(false)
        .resizable(false)
        .show(ui.ctx(), |ui| {
            ui.label(message);
            ui.add_space(20.0);
            
            ui.horizontal(|ui| {
                if ui.button("Yes").clicked() {
                    result = Some(true);
                }
                if ui.button("No").clicked() {
                    result = Some(false);
                }
            });
        });
    
    result
}

pub fn settings_panel(ui: &mut Ui, remember_me: &mut bool, auto_logout_timeout: &mut u64) {
    ui.heading("Settings");
    ui.add_space(10.0);
    
    ui.checkbox(remember_me, "Remember me");
    ui.add_space(5.0);
    
    ui.label("Auto-logout timeout (minutes):");
    ui.add(egui::DragValue::new(auto_logout_timeout)
        .clamp_range(1..=60)
        .speed(1.0));
    
    ui.add_space(10.0);
}

pub fn about_panel(ui: &mut Ui) {
    ui.heading("About ViWorkS Client");
    ui.add_space(10.0);
    
    ui.label("Version: 1.0.0");
    ui.label("A secure Windows VPN client");
    ui.label("Built with Rust and eframe/egui");
    
    ui.add_space(20.0);
    
    ui.label("Security Features:");
    ui.label("• SPKI Certificate Pinning");
    ui.label("• Windows DPAPI Token Storage");
    ui.label("• Binary Signature Verification");
    ui.label("• Process Hardening");
    ui.label("• Secure Memory Management");
}

pub fn keyboard_shortcuts_help(ui: &mut Ui) {
    ui.heading("Keyboard Shortcuts");
    ui.add_space(10.0);
    
    ui.horizontal(|ui| {
        ui.label("Esc");
        ui.label("Logout");
    });
    
    ui.horizontal(|ui| {
        ui.label("Ctrl+Q");
        ui.label("Quit");
    });
    
    ui.horizontal(|ui| {
        ui.label("Ctrl+D");
        ui.label("Disconnect");
    });
    
    ui.horizontal(|ui| {
        ui.label("Ctrl+S");
        ui.label("Show/Hide");
    });
}

pub fn handle_keyboard_shortcuts(ui: &mut Ui, _ctx: &egui::Context) -> Vec<KeyboardAction> {
    let mut actions = Vec::new();
    
    if ui.input(|i| i.key_pressed(Key::Escape)) {
        actions.push(KeyboardAction::Logout);
    }
    
    if ui.input(|i| i.key_pressed(Key::Q) && i.modifiers.ctrl) {
        actions.push(KeyboardAction::Quit);
    }
    
    if ui.input(|i| i.key_pressed(Key::D) && i.modifiers.ctrl) {
        actions.push(KeyboardAction::Disconnect);
    }
    
    if ui.input(|i| i.key_pressed(Key::S) && i.modifiers.ctrl) {
        actions.push(KeyboardAction::ToggleVisibility);
    }
    
    actions
}

#[derive(Debug, Clone)]
pub enum KeyboardAction {
    Logout,
    Quit,
    Disconnect,
    ToggleVisibility,
}

pub fn create_theme_colors() -> egui::Visuals {
    let mut visuals = egui::Visuals::dark();
    
    // Custom color scheme
    visuals.widgets.noninteractive.bg_fill = Color32::from_rgb(40, 40, 40);
    visuals.widgets.inactive.bg_fill = Color32::from_rgb(60, 60, 60);
    visuals.widgets.hovered.bg_fill = Color32::from_rgb(80, 80, 80);
    visuals.widgets.active.bg_fill = Color32::from_rgb(100, 100, 100);
    
    visuals.faint_bg_color = Color32::from_rgb(30, 30, 30);
    visuals.extreme_bg_color = Color32::from_rgb(20, 20, 20);
    
    visuals
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_keyboard_action_creation() {
        let actions = vec![
            KeyboardAction::Logout,
            KeyboardAction::Quit,
            KeyboardAction::Disconnect,
            KeyboardAction::ToggleVisibility,
        ];
        
        for action in actions {
            match action {
                KeyboardAction::Logout => assert!(true),
                KeyboardAction::Quit => assert!(true),
                KeyboardAction::Disconnect => assert!(true),
                KeyboardAction::ToggleVisibility => assert!(true),
            }
        }
    }
}
