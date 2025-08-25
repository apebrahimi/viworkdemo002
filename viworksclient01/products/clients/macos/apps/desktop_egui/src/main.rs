use eframe::{egui, NativeOptions};
use tokio::runtime::Runtime;
use viworks_desktop::ViWorksApp;

// macOS process hardening
fn harden_process() {
    // 1) Set restrictive umask for file permissions
    unsafe {
        libc::umask(0o077); // Only owner can read/write/execute
    }
    
    // 2) Log the hardening attempt
    println!("🔒 Process hardening applied (macOS)");
}

fn main() -> Result<(), eframe::Error> {
    // Apply process hardening
    harden_process();
    
    // Initialize logging
    tracing_subscriber::fmt()
        .with_env_filter("info")
        .init();
    
    // Create runtime
    let runtime = Runtime::new().expect("Failed to create Tokio runtime");
    
    // Configure native options
    let options = NativeOptions {
        viewport: egui::ViewportBuilder::default()
            .with_inner_size([800.0, 600.0])
            .with_min_inner_size([600.0, 400.0]),
        ..Default::default()
    };
    
    // Run the app
    eframe::run_native(
        "ViWorkS Client",
        options,
        Box::new(|cc| Box::new(ViWorksApp::new(cc, runtime))),
    )
}
