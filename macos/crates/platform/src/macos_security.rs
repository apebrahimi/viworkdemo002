use viworks_core::{Result, ViWorksError};
use std::path::Path;
use sha2::{Sha256, Digest};
use tracing::{info, warn, error};
use std::process::Command;

pub fn verify_publisher_signature(exe_path: &str) -> Result<()> {
    let path = Path::new(exe_path);
    if !path.exists() {
        return Err(ViWorksError::Internal(format!("File not found: {}", exe_path)));
    }

    // On macOS, we use codesign to verify signatures
    let output = Command::new("codesign")
        .args(&["--verify", "--verbose=4", exe_path])
        .output()
        .map_err(|e| ViWorksError::ProcessError(format!("Failed to verify signature: {}", e)))?;

    if output.status.success() {
        info!("Binary signature verification passed for {}", exe_path);
        Ok(())
    } else {
        let error_output = String::from_utf8_lossy(&output.stderr);
        error!("Binary signature verification failed for {}: {}", exe_path, error_output);
        Err(ViWorksError::SignatureInvalid)
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
    // Use codesign to extract certificate information
    let output = Command::new("codesign")
        .args(&["-d", "--extract-certificates", exe_path])
        .output()
        .map_err(|e| ViWorksError::ProcessError(format!("Failed to extract certificates: {}", e)))?;

    if !output.status.success() {
        return Err(ViWorksError::SignatureInvalid);
    }

    // Use security to get certificate details
    let output = Command::new("security")
        .args(&["find-certificate", "-a", "-c", "Developer ID Application"])
        .output()
        .map_err(|e| ViWorksError::ProcessError(format!("Failed to find certificates: {}", e)))?;

    if output.status.success() {
        let cert_output = String::from_utf8_lossy(&output.stdout);
        // Parse the output to find the publisher
        for line in cert_output.lines() {
            if line.contains("Developer ID Application:") {
                if let Some(publisher) = line.split("Developer ID Application:").nth(1) {
                    let publisher = publisher.trim().to_string();
                    if !publisher.is_empty() {
                        return Ok(publisher);
                    }
                }
            }
        }
    }

    // Fallback: try to get organization from codesign
    let output = Command::new("codesign")
        .args(&["-dvv", exe_path])
        .output()
        .map_err(|e| ViWorksError::ProcessError(format!("Failed to get signature details: {}", e)))?;

    if output.status.success() {
        let details = String::from_utf8_lossy(&output.stdout);
        for line in details.lines() {
            if line.contains("Authority=") {
                if let Some(authority) = line.split("Authority=").nth(1) {
                    let authority = authority.trim().to_string();
                    if !authority.is_empty() {
                        return Ok(authority);
                    }
                }
            }
        }
    }

    Err(ViWorksError::SignatureInvalid)
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
    // On macOS, we can use the Security framework to verify certificates
    // For now, we'll use a command-line approach
    
    use std::io::Write;
    use tempfile::NamedTempFile;
    
    // Write certificate to temporary file
    let mut temp_file = NamedTempFile::new()
        .map_err(|e| ViWorksError::FileSystemError(format!("Failed to create temp file: {}", e)))?;
    
    temp_file.write_all(cert_data)
        .map_err(|e| ViWorksError::FileSystemError(format!("Failed to write cert to temp file: {}", e)))?;
    
    // Use security to verify the certificate
    let output = Command::new("security")
        .args(&["verify-cert", "-c", temp_file.path().to_str().unwrap()])
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
    // On macOS, we can use mdls to get file metadata
    let output = Command::new("mdls")
        .args(&["-name", "kMDItemVersion", exe_path])
        .output()
        .map_err(|e| ViWorksError::ProcessError(format!("Failed to get file version: {}", e)))?;

    if output.status.success() {
        let version_output = String::from_utf8_lossy(&output.stdout);
        // Parse mdls output: kMDItemVersion = "1.0.0"
        for line in version_output.lines() {
            if line.contains("kMDItemVersion") {
                if let Some(version) = line.split("=").nth(1) {
                    let version = version.trim().trim_matches('"').to_string();
                    if !version.is_empty() {
                        return Ok(version);
                    }
                }
            }
        }
    }

    // Fallback: try to get version from codesign
    let output = Command::new("codesign")
        .args(&["-dvv", exe_path])
        .output()
        .map_err(|e| ViWorksError::ProcessError(format!("Failed to get signature details: {}", e)))?;

    if output.status.success() {
        let details = String::from_utf8_lossy(&output.stdout);
        for line in details.lines() {
            if line.contains("Version=") {
                if let Some(version) = line.split("Version=").nth(1) {
                    let version = version.trim().to_string();
                    if !version.is_empty() {
                        return Ok(version);
                    }
                }
            }
        }
    }

    Err(ViWorksError::Internal("Failed to get file version".to_string()))
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
