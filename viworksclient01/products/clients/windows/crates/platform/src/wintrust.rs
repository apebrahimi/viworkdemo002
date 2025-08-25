use viworks_core::{Result, ViWorksError};
use std::path::Path;
use sha2::{Sha256, Digest};
use tracing::{info, warn, error};
use windows::core::{PCWSTR, PWSTR};
use windows::Win32::Security::WinTrust::{
    WinVerifyTrust, WINTRUST_ACTION_GENERIC_VERIFY_V2, WINTRUST_DATA, WINTRUST_FILE_INFO,
    WTD_CHOICE_FILE, WTD_UI_NONE, WTD_REVOKE_NONE, WTD_SAFER_FLAG, WTD_USE_DEFAULT_OSVER_CHECK,
    WINTRUST_DATA_STATE_ACTION, WINTRUST_DATA_UICONTEXT
};
use windows::Win32::Foundation::{HWND, HANDLE};
use std::ptr;
use std::ffi::c_void;

pub fn verify_publisher_signature(exe_path: &str) -> Result<()> {
    let path = Path::new(exe_path);
    if !path.exists() {
        return Err(ViWorksError::Internal(format!("File not found: {}", exe_path)));
    }

    // Convert path to wide string
    let wide_path: Vec<u16> = path.to_string_lossy().encode_utf16().chain(std::iter::once(0)).collect();
    
    unsafe {
        let mut file_info = WINTRUST_FILE_INFO {
            cbStruct: std::mem::size_of::<WINTRUST_FILE_INFO>() as u32,
            pcwszFilePath: PCWSTR::from_raw(wide_path.as_ptr()),
            hFile: HANDLE(0),
            pgKnownSubject: ptr::null_mut(),
        };

        let mut trust_data = WINTRUST_DATA {
            cbStruct: std::mem::size_of::<WINTRUST_DATA>() as u32,
            dwUIChoice: WTD_UI_NONE,
            fdwRevocationChecks: WTD_REVOKE_NONE,
            dwUnionChoice: WTD_CHOICE_FILE,
            Anonymous: windows::Win32::Security::WinTrust::WINTRUST_DATA_0 {
                pFile: &mut file_info,
            },
            dwStateAction: WINTRUST_DATA_STATE_ACTION(0),
            dwProvFlags: WTD_SAFER_FLAG | WTD_USE_DEFAULT_OSVER_CHECK,
            dwUIContext: WINTRUST_DATA_UICONTEXT(0),
            pSignatureSettings: ptr::null_mut(),
            hWVTStateData: HANDLE(0),
            pPolicyCallbackData: ptr::null_mut(),
            pSIPClientData: ptr::null_mut(),
            pwszURLReference: PWSTR::null(),
        };

        let mut policy = WINTRUST_ACTION_GENERIC_VERIFY_V2;
        let status = WinVerifyTrust(HWND(0), &mut policy as *mut _, &mut trust_data as *mut _ as *mut c_void);

        if status == 0 {
            info!("Binary signature verification passed for {}", exe_path);
            Ok(())
        } else {
            error!("Binary signature verification failed for {}: {:?}", exe_path, status);
            Err(ViWorksError::SignatureInvalid)
        }
    }
}

pub fn verify_publisher_signature_with_expected_publisher(exe_path: &str, expected_publisher: &str) -> Result<()> {
    // First verify the signature
    verify_publisher_signature(exe_path)?;
    
    // Then extract and verify the publisher
    let publisher = extract_publisher_from_signature(exe_path)?;
    
    if publisher.to_lowercase() == expected_publisher.to_lowercase() {
        info!("Publisher verification passed for {}: {}", exe_path, publisher);
        Ok(())
    } else {
        warn!("Publisher mismatch for {}: expected {}, got {}", exe_path, expected_publisher, publisher);
        Err(ViWorksError::SignatureInvalid)
    }
}

fn extract_publisher_from_signature(exe_path: &str) -> Result<String> {
    // This is a simplified implementation
    // In a full implementation, you would use CryptQueryObject to extract certificate details
    // For now, we'll use a command-line approach to get the publisher
    
    use std::process::Command;
    
    let output = Command::new("powershell")
        .args(&[
            "-Command",
            &format!(
                "Get-AuthenticodeSignature '{}' | Select-Object -ExpandProperty SignerCertificate | Select-Object -ExpandProperty Subject",
                exe_path
            )
        ])
        .output()
        .map_err(|e| ViWorksError::ProcessError(format!("Failed to extract publisher: {}", e)))?;

    if output.status.success() {
        let publisher = String::from_utf8_lossy(&output.stdout).trim().to_string();
        if !publisher.is_empty() {
            Ok(publisher)
        } else {
            Err(ViWorksError::SignatureInvalid)
        }
    } else {
        Err(ViWorksError::SignatureInvalid)
    }
}

pub fn verify_file_hash(file_path: &Path, expected_hash: &str) -> Result<()> {
    let actual_hash = sha256_file(file_path)?;
    let actual_hash_hex = hex::encode(actual_hash);
    
    if actual_hash_hex.to_lowercase() == expected_hash.to_lowercase() {
        info!("File hash verification passed for {}: {}", file_path.display(), actual_hash_hex);
        Ok(())
    } else {
        warn!("File hash mismatch for {}: expected {}, got {}", 
            file_path.display(), expected_hash, actual_hash_hex);
        Err(ViWorksError::HashMismatch)
    }
}

pub fn sha256_file(path: &Path) -> Result<[u8; 32]> {
    let mut hasher = Sha256::new();
    let mut f = std::fs::File::open(path)
        .map_err(|e| ViWorksError::FileSystemError(format!("Failed to open file: {}", e)))?;
    
    std::io::copy(&mut f, &mut hasher)
        .map_err(|e| ViWorksError::FileSystemError(format!("Failed to read file: {}", e)))?;
    
    let out = hasher.finalize();
    let mut arr = [0u8; 32]; 
    arr.copy_from_slice(&out); 
    Ok(arr)
}

pub fn verify_binary_integrity(exe_path: &str, expected_publisher: &str, expected_hash: &str) -> Result<()> {
    let path = Path::new(exe_path);
    
    // Check if file exists
    if !path.exists() {
        return Err(ViWorksError::Internal(format!("Binary not found: {}", exe_path)));
    }
    
    // Verify signature and publisher
    verify_publisher_signature_with_expected_publisher(exe_path, expected_publisher)?;
    
    // Verify hash
    verify_file_hash(path, expected_hash)?;
    
    info!("Binary integrity verification passed for {}", exe_path);
    Ok(())
}

pub fn verify_certificate_chain(cert_data: &[u8]) -> Result<()> {
    // This would typically use Windows CryptoAPI to verify the certificate chain
    // For now, we'll use a simplified approach
    
    use std::process::Command;
    use std::io::Write;
    use tempfile::NamedTempFile;
    
    // Write certificate to temporary file
    let mut temp_file = NamedTempFile::new()
        .map_err(|e| ViWorksError::FileSystemError(format!("Failed to create temp file: {}", e)))?;
    
    temp_file.write_all(cert_data)
        .map_err(|e| ViWorksError::FileSystemError(format!("Failed to write cert to temp file: {}", e)))?;
    
    // Use certutil to verify the certificate
    let output = Command::new("certutil")
        .args(&["-verify", temp_file.path().to_str().unwrap()])
        .output()
        .map_err(|e| ViWorksError::ProcessError(format!("Failed to verify certificate: {}", e)))?;
    
    if output.status.success() {
        info!("Certificate chain verification passed");
        Ok(())
    } else {
        let error_output = String::from_utf8_lossy(&output.stderr);
        error!("Certificate chain verification failed: {}", error_output);
        Err(ViWorksError::Internal("Certificate chain verification failed".to_string()))
    }
}

pub fn get_file_version_info(exe_path: &str) -> Result<String> {
    use std::process::Command;
    
    let output = Command::new("powershell")
        .args(&[
            "-Command",
            &format!(
                "[System.Diagnostics.FileVersionInfo]::GetVersionInfo('{}').FileVersion",
                exe_path
            )
        ])
        .output()
        .map_err(|e| ViWorksError::ProcessError(format!("Failed to get file version: {}", e)))?;

    if output.status.success() {
        let version = String::from_utf8_lossy(&output.stdout).trim().to_string();
        if !version.is_empty() {
            Ok(version)
        } else {
            Err(ViWorksError::Internal("Failed to extract file version".to_string()))
        }
    } else {
        Err(ViWorksError::Internal("Failed to get file version".to_string()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;
    
    #[test]
    fn test_sha256_file() {
        // Create a temporary file for testing
        let temp_dir = std::env::temp_dir();
        let test_file = temp_dir.join("test_hash.txt");
        
        // Write some test data
        std::fs::write(&test_file, "Hello, World!").unwrap();
        
        // Calculate hash
        let hash = sha256_file(&test_file).unwrap();
        let hash_hex = hex::encode(hash);
        
        // Expected SHA256 hash of "Hello, World!"
        let expected = "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f";
        
        assert_eq!(hash_hex, expected);
        
        // Clean up
        let _ = std::fs::remove_file(test_file);
    }
    
    #[test]
    fn test_verify_file_hash() {
        let temp_dir = std::env::temp_dir();
        let test_file = temp_dir.join("test_verify.txt");
        
        // Write test data
        std::fs::write(&test_file, "Test data").unwrap();
        
        // Calculate expected hash
        let hash = sha256_file(&test_file).unwrap();
        let hash_hex = hex::encode(hash);
        
        // Verify with correct hash
        assert!(verify_file_hash(&test_file, &hash_hex).is_ok());
        
        // Verify with incorrect hash
        assert!(verify_file_hash(&test_file, "incorrect_hash").is_err());
        
        // Clean up
        let _ = std::fs::remove_file(test_file);
    }
}
