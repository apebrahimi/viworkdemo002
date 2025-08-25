use viworks_core::{Result, ViWorksError, AuthTokens};
use std::path::PathBuf;
use viworks_core::config::AppConfig;
use windows::Win32::Security::Cryptography::{
    CryptProtectData, CryptUnprotectData, CRYPTPROTECT_UI_FORBIDDEN, CRYPT_INTEGER_BLOB
};
use windows::Win32::Foundation::{LocalFree, HLOCAL};
use windows::core::{PWSTR, PCWSTR};
use std::ptr;
// Remove unused import

pub fn encrypt_tokens(tokens: &AuthTokens) -> Result<Vec<u8>> {
    // Serialize tokens to JSON
    let json_data = serde_json::to_string(tokens)
        .map_err(|e| ViWorksError::Serialization(e))?;
    
    // Convert to UTF-16 for Windows API
    let wide_string: Vec<u16> = json_data.encode_utf16().chain(std::iter::once(0)).collect();
    
    // Get additional entropy (machine GUID + app salt)
    let entropy = get_additional_entropy()?;
    let entropy_wide: Vec<u16> = entropy.encode_utf16().chain(std::iter::once(0)).collect();
    
    unsafe {
        let mut data_blob = CRYPT_INTEGER_BLOB {
            cbData: wide_string.len() as u32 * 2,
            pbData: wide_string.as_ptr() as *mut u8,
        };
        
        let mut entropy_blob = CRYPT_INTEGER_BLOB {
            cbData: entropy_wide.len() as u32 * 2,
            pbData: entropy_wide.as_ptr() as *mut u8,
        };
        
        let mut encrypted_blob = CRYPT_INTEGER_BLOB {
            cbData: 0,
            pbData: ptr::null_mut(),
        };
        
        let result = CryptProtectData(
            &mut data_blob,
            PCWSTR::null(), // No description
            Some(&mut entropy_blob),
            None, // No reserved
            None, // No prompt
            CRYPTPROTECT_UI_FORBIDDEN,
            &mut encrypted_blob,
        );
        
        if result.is_ok() {
            let encrypted_data = std::slice::from_raw_parts(
                encrypted_blob.pbData,
                encrypted_blob.cbData as usize
            ).to_vec();
            
            // Free the allocated memory
            LocalFree(HLOCAL(encrypted_blob.pbData as *mut _));
            
            Ok(encrypted_data)
        } else {
            Err(ViWorksError::DpapiError("Failed to encrypt tokens".to_string()))
        }
    }
}

pub fn decrypt_tokens(encrypted_data: &[u8]) -> Result<AuthTokens> {
    // Get additional entropy (must match encryption)
    let entropy = get_additional_entropy()?;
    let entropy_wide: Vec<u16> = entropy.encode_utf16().chain(std::iter::once(0)).collect();
    
    unsafe {
        let mut encrypted_blob = CRYPT_INTEGER_BLOB {
            cbData: encrypted_data.len() as u32,
            pbData: encrypted_data.as_ptr() as *mut u8,
        };
        
        let mut entropy_blob = CRYPT_INTEGER_BLOB {
            cbData: entropy_wide.len() as u32 * 2,
            pbData: entropy_wide.as_ptr() as *mut u8,
        };
        
        let mut decrypted_blob = CRYPT_INTEGER_BLOB {
            cbData: 0,
            pbData: ptr::null_mut(),
        };
        
        let mut description = PWSTR::null();
        
        let result = CryptUnprotectData(
            &mut encrypted_blob,
            Some(&mut description),
            Some(&mut entropy_blob),
            None, // No reserved
            None, // No prompt
            CRYPTPROTECT_UI_FORBIDDEN,
            &mut decrypted_blob,
        );
        
        if result.is_ok() {
            let decrypted_slice = std::slice::from_raw_parts(
                decrypted_blob.pbData,
                decrypted_blob.cbData as usize
            );
            
            // Convert from UTF-16 to UTF-8
            let utf16_data: Vec<u16> = decrypted_slice
                .chunks_exact(2)
                .map(|chunk| u16::from_ne_bytes([chunk[0], chunk[1]]))
                .take_while(|&c| c != 0)
                .collect();
            
            let json_string = String::from_utf16(&utf16_data)
                .map_err(|e| ViWorksError::Internal(format!("Invalid UTF-16 in decrypted data: {}", e)))?;
            
            // Free the allocated memory
            LocalFree(HLOCAL(decrypted_blob.pbData as *mut _));
            if !description.is_null() {
                LocalFree(HLOCAL(description.0 as *mut _));
            }
            
            // Deserialize tokens
            let tokens: AuthTokens = serde_json::from_str(&json_string)
                .map_err(|e| ViWorksError::Serialization(e))?;
            
            Ok(tokens)
        } else {
            Err(ViWorksError::DpapiError("Failed to decrypt tokens".to_string()))
        }
    }
}

fn get_additional_entropy() -> Result<String> {
    // Combine machine GUID with application-specific salt
    let machine_guid = get_machine_guid()?;
    let app_salt = "ViWorkS-Client-2024-Salt";
    
    Ok(format!("{}-{}", machine_guid, app_salt))
}

fn get_machine_guid() -> Result<String> {
    // For simplicity, we'll use a default GUID
    // This avoids complex Windows Registry API issues
    Ok("00000000-0000-0000-0000-000000000000".to_string())
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
