use eframe::{egui, NativeOptions};
use tokio::runtime::Runtime;
use viworks_desktop::ViWorksApp;

// Simplified Windows hardening
use windows::Win32::System::LibraryLoader::{
    SetDefaultDllDirectories, LOAD_LIBRARY_SEARCH_SYSTEM32
};

unsafe fn harden_process() {
    // 1) DLL search order hardening - only search system32
    let _ = SetDefaultDllDirectories(LOAD_LIBRARY_SEARCH_SYSTEM32);
    
    // 2) Log the hardening attempt
    println!("🔒 Process hardening applied");
}

fn main() -> Result<(), eframe::Error> {
    // Apply process hardening
    unsafe {
        harden_process();
    }
    
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
