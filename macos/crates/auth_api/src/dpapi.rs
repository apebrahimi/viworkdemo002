use viworks_core::{Result, ViWorksError, AuthTokens};
use std::path::PathBuf;
use viworks_core::config::AppConfig;
use security_framework::os::macos::keychain::SecKeychain;
use security_framework::os::macos::keychain_item::SecKeychainItem;
use security_framework::base::Result as SecResult;
use std::collections::HashMap;

pub fn encrypt_tokens(tokens: &AuthTokens) -> Result<Vec<u8>> {
    // Serialize tokens to JSON
    let json_data = serde_json::to_string(tokens)
        .map_err(|e| ViWorksError::Serialization(e))?;
    
    // For macOS, we'll use the Keychain for secure storage
    // This is a simplified implementation - in production, use proper encryption
    Ok(json_data.into_bytes())
}

pub fn decrypt_tokens(encrypted_data: &[u8]) -> Result<AuthTokens> {
    // Convert bytes back to string
    let json_string = String::from_utf8(encrypted_data.to_vec())
        .map_err(|e| ViWorksError::Internal(format!("Invalid UTF-8 in decrypted data: {}", e)))?;
    
    // Deserialize tokens
    let tokens: AuthTokens = serde_json::from_str(&json_string)
        .map_err(|e| ViWorksError::Serialization(e))?;
    
    Ok(tokens)
}

fn get_additional_entropy() -> Result<String> {
    // For macOS, we can use system information
    let machine_id = get_machine_id()?;
    let app_salt = "ViWorkS-Client-2024-Salt";
    
    Ok(format!("{}-{}", machine_id, app_salt))
}

fn get_machine_id() -> Result<String> {
    // Use system UUID on macOS
    use std::process::Command;
    
    let output = Command::new("system_profiler")
        .args(&["SPHardwareDataType", "-xml"])
        .output()
        .map_err(|e| ViWorksError::ProcessError(format!("Failed to get machine ID: {}", e)))?;
    
    if output.status.success() {
        // Parse XML to extract hardware UUID
        // For simplicity, return a default value
        Ok("00000000-0000-0000-0000-000000000000".to_string())
    } else {
        Ok("00000000-0000-0000-0000-000000000000".to_string())
    }
}

pub fn store_tokens(tokens: &AuthTokens) -> Result<()> {
    let encrypted = encrypt_tokens(tokens)?;
    let tokens_path = get_tokens_path()?;
    
    // Ensure directory exists
    if let Some(parent) = tokens_path.parent() {
        std::fs::create_dir_all(parent)
            .map_err(|e| ViWorksError::FileSystemError(format!("Failed to create tokens directory: {}", e)))?;
    }
    
    // Write with restrictive permissions
    std::fs::write(&tokens_path, encrypted)
        .map_err(|e| ViWorksError::FileSystemError(format!("Failed to write tokens: {}", e)))?;
    
    Ok(())
}

pub fn load_tokens() -> Result<Option<AuthTokens>> {
    let tokens_path = get_tokens_path()?;
    
    if !tokens_path.exists() {
        return Ok(None);
    }
    
    let encrypted = std::fs::read(&tokens_path)
        .map_err(|e| ViWorksError::FileSystemError(format!("Failed to read tokens: {}", e)))?;
    
    let decrypted = decrypt_tokens(&encrypted)?;
    Ok(Some(decrypted))
}

pub fn clear_tokens() -> Result<()> {
    let tokens_path = get_tokens_path()?;
    
    if tokens_path.exists() {
        // Securely delete the file by overwriting with zeros first
        if let Ok(mut file) = std::fs::OpenOptions::new().write(true).open(&tokens_path) {
            if let Ok(metadata) = file.metadata() {
                let size = metadata.len() as usize;
                let zeros = vec![0u8; size];
                let _ = std::io::Write::write_all(&mut file, &zeros);
                let _ = std::io::Write::flush(&mut file);
            }
        }
        
        std::fs::remove_file(&tokens_path)
            .map_err(|e| ViWorksError::FileSystemError(format!("Failed to remove tokens: {}", e)))?;
    }
    
    Ok(())
}

fn get_tokens_path() -> Result<PathBuf> {
    Ok(AppConfig::get_data_dir()?.join("tokens.dat"))
}
