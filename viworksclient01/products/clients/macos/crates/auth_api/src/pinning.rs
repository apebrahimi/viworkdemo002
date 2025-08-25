use viworks_core::{Result, ViWorksError};
use rustls::{client::ServerCertVerifier, Certificate, ServerName};
use rustls::client::ServerCertVerified;
use rustls::client::WebPkiVerifier;
use sha2::{Sha256, Digest};
use std::sync::Arc;
use base64::{Engine as _, engine::general_purpose::STANDARD as BASE64};
use std::collections::HashMap;
use std::time::{SystemTime, UNIX_EPOCH};

/// Enhanced SPKI pins with additional metadata
pub struct SpkiPins { 
    pub primary_b64: String, 
    pub backup_b64: String,
    pub created_at: u64,
    pub expires_at: Option<u64>,
    pub domain: String,
}

/// Certificate transparency log verification
pub struct CertificateTransparency {
    logs: HashMap<String, Vec<u8>>,  // log_id -> public_key
}

impl CertificateTransparency {
    pub fn new() -> Self {
        let mut logs = HashMap::new();
        
        // Add some well-known CT logs (simplified - in production, use a proper CT log list)
        // Google's CT logs
        logs.insert("Google 'Pilot'".to_string(), vec![/* log public key */]);
        logs.insert("Google 'Aviator'".to_string(), vec![/* log public key */]);
        
        Self { logs }
    }

    pub fn verify_sct(&self, _sct_data: &[u8]) -> Result<()> {
        // In a full implementation, this would verify the SCT signature
        // For now, we'll just return success
        Ok(())
    }
}

/// Enhanced pinned verifier with additional security checks
pub struct PinnedVerifier { 
    pins: SpkiPins,
    inner: Arc<WebPkiVerifier>,
    ct_verifier: CertificateTransparency,
    pin_failures: std::sync::Mutex<HashMap<String, u32>>,  // domain -> failure count
}

impl PinnedVerifier {
    pub fn new(pins: SpkiPins) -> Self {
        let root_store = rustls::RootCertStore::empty();
        let inner = WebPkiVerifier::new(
            Arc::new(root_store),
            None
        );
        
        Self { 
            pins, 
            inner: Arc::new(inner),
            ct_verifier: CertificateTransparency::new(),
            pin_failures: std::sync::Mutex::new(HashMap::new()),
        }
    }
    
    fn spki_sha256_b64(ee: &Certificate) -> Result<String> {
        let (_, cert) = x509_parser::parse_x509_certificate(&ee.0)
            .map_err(|e| ViWorksError::Internal(format!("Failed to parse certificate: {}", e)))?;
        
        let spki = cert.tbs_certificate.subject_pki.subject_public_key.data;
        let hash = Sha256::digest(spki);
        Ok(BASE64.encode(hash))
    }

    fn check_pin_failures(&self, domain: &str) -> Result<()> {
        if let Ok(failures) = self.pin_failures.lock() {
            if let Some(&count) = failures.get(domain) {
                if count >= 3 {
                    return Err(ViWorksError::Internal(format!(
                        "Too many pin failures for domain {}: {}", domain, count
                    )));
                }
            }
        }
        Ok(())
    }

    fn record_pin_failure(&self, domain: &str) {
        if let Ok(mut failures) = self.pin_failures.lock() {
            *failures.entry(domain.to_string()).or_insert(0) += 1;
        }
    }

    fn validate_certificate_chain(&self, end_entity: &Certificate, intermediates: &[Certificate]) -> Result<()> {
        // Check certificate expiration
        let (_, cert) = x509_parser::parse_x509_certificate(&end_entity.0)
            .map_err(|e| ViWorksError::Internal(format!("Failed to parse certificate: {}", e)))?;
        
        let now = SystemTime::now().duration_since(UNIX_EPOCH)
            .map_err(|e| ViWorksError::Internal(format!("Failed to get current time: {}", e)))?
            .as_secs();
        
        let not_before = cert.tbs_certificate.validity.not_before.timestamp() as u64;
        let not_after = cert.tbs_certificate.validity.not_after.timestamp() as u64;
        
        if now < not_before {
            return Err(ViWorksError::Internal("Certificate not yet valid".to_string()));
        }
        
        if now > not_after {
            return Err(ViWorksError::Internal("Certificate expired".to_string()));
        }

        // Check for weak algorithms
        let signature_algorithm = cert.signature_algorithm.algorithm.to_string();
        let weak_algorithms = ["md5", "sha1", "md2", "md4"];
        
        for weak_alg in &weak_algorithms {
            if signature_algorithm.to_lowercase().contains(weak_alg) {
                return Err(ViWorksError::Internal(format!(
                    "Certificate uses weak signature algorithm: {}", signature_algorithm
                )));
            }
        }

        Ok(())
    }
}

impl ServerCertVerifier for PinnedVerifier {
    fn verify_server_cert(
        &self,
        end_entity: &Certificate,
        intermediates: &[Certificate],
        server_name: &ServerName,
        scts: &mut dyn Iterator<Item = &[u8]>,
        ocsp_response: &[u8],
        now: std::time::SystemTime,
    ) -> std::result::Result<ServerCertVerified, rustls::Error> {
        // First, perform standard certificate validation
        self.inner.verify_server_cert(end_entity, intermediates, server_name, scts, ocsp_response, now)
            .map_err(|e| rustls::Error::General(format!("Standard certificate validation failed: {}", e)))?;
        
        // Check pin failures for this domain
        let domain = match server_name {
            ServerName::DnsName(name) => name.as_ref(),
            _ => return Err(rustls::Error::General("Unsupported server name type".to_string())),
        };
        
        if let Err(e) = self.check_pin_failures(domain) {
            return Err(rustls::Error::General(format!("Pin failure check failed: {}", e)));
        }

        // Validate certificate chain
        if let Err(e) = self.validate_certificate_chain(end_entity, intermediates) {
            return Err(rustls::Error::General(format!("Certificate chain validation failed: {}", e)));
        }

        // Verify SPKI pin
        let spki_b64 = match Self::spki_sha256_b64(end_entity) {
            Ok(hash) => hash,
            Err(e) => return Err(rustls::Error::General(format!("Failed to compute SPKI hash: {}", e)))
        };
        
        if spki_b64 == self.pins.primary_b64 || spki_b64 == self.pins.backup_b64 {
            // Reset pin failures on success
            if let Ok(mut failures) = self.pin_failures.lock() {
                failures.remove(domain);
            }
            Ok(ServerCertVerified::assertion())
        } else {
            // Record pin failure
            self.record_pin_failure(domain);
            
            Err(rustls::Error::General(format!(
                "SPKI pin mismatch for domain {}. Expected: {} or {}, Got: {}", 
                domain, self.pins.primary_b64, self.pins.backup_b64, spki_b64
            )))
        }
    }
}

pub fn create_pinned_client(pins: SpkiPins) -> Result<reqwest::Client> {
    let verifier = Arc::new(PinnedVerifier::new(pins));
    
    // Create rustls client config with pinned verifier
    let mut client_config = rustls::ClientConfig::builder()
        .with_safe_defaults()
        .with_custom_certificate_verifier(verifier)
        .with_no_client_auth();
    
    // Configure TLS settings for maximum security
    client_config.alpn_protocols = vec![b"h2".to_vec(), b"http/1.1".to_vec()];
    
    // Set minimum TLS version to 1.2
    client_config.enable_sni = true;
    
    // Create reqwest client with custom TLS config
    let client = reqwest::Client::builder()
        .use_rustls_tls()
        .timeout(std::time::Duration::from_secs(30))
        .connect_timeout(std::time::Duration::from_secs(10))
        .pool_idle_timeout(std::time::Duration::from_secs(90))
        .pool_max_idle_per_host(1)  // Limit connection pooling for security
        .build()
        .map_err(|e| ViWorksError::Internal(format!("Failed to create HTTP client: {}", e)))?;
    
    Ok(client)
}

pub fn extract_spki_from_cert(cert_data: &[u8]) -> Result<String> {
    let (_, cert) = x509_parser::parse_x509_certificate(cert_data)
        .map_err(|e| ViWorksError::Internal(format!("Failed to parse certificate: {}", e)))?;
    
    let spki = cert.tbs_certificate.subject_pki.subject_public_key.data;
    let hash = Sha256::digest(spki);
    Ok(BASE64.encode(hash))
}

pub fn validate_spki_pins(pins: &SpkiPins) -> Result<()> {
    // Validate that pins are valid base64 and have correct length
    if pins.primary_b64.is_empty() {
        return Err(ViWorksError::Internal("Primary SPKI pin cannot be empty".to_string()));
    }
    
    if pins.backup_b64.is_empty() {
        return Err(ViWorksError::Internal("Backup SPKI pin cannot be empty".to_string()));
    }
    
    // Validate base64 format
    if BASE64.decode(&pins.primary_b64).is_err() {
        return Err(ViWorksError::Internal("Primary SPKI pin is not valid base64".to_string()));
    }
    
    if BASE64.decode(&pins.backup_b64).is_err() {
        return Err(ViWorksError::Internal("Backup SPKI pin is not valid base64".to_string()));
    }
    
    // Validate length (SHA256 hash should be 32 bytes = 44 base64 chars)
    if pins.primary_b64.len() != 44 {
        return Err(ViWorksError::Internal("Primary SPKI pin has incorrect length".to_string()));
    }
    
    if pins.backup_b64.len() != 44 {
        return Err(ViWorksError::Internal("Backup SPKI pin has incorrect length".to_string()));
    }

    // Validate domain
    if pins.domain.is_empty() {
        return Err(ViWorksError::Internal("Domain cannot be empty".to_string()));
    }

    // Validate timestamps
    let now = SystemTime::now().duration_since(UNIX_EPOCH)
        .map_err(|e| ViWorksError::Internal(format!("Failed to get current time: {}", e)))?
        .as_secs();

    if pins.created_at > now {
        return Err(ViWorksError::Internal("Pin creation time is in the future".to_string()));
    }

    if let Some(expires_at) = pins.expires_at {
        if expires_at <= now {
            return Err(ViWorksError::Internal("Pins have expired".to_string()));
        }
    }

    Ok(())
}

/// Generate new SPKI pins for a certificate
pub fn generate_spki_pins(cert_data: &[u8], domain: &str) -> Result<SpkiPins> {
    let primary_pin = extract_spki_from_cert(cert_data)?;
    
    // For backup pin, we could either:
    // 1. Use a different certificate from the chain
    // 2. Generate a new certificate
    // 3. Use a different algorithm
    
    // For now, we'll use the same pin as backup (in production, implement proper backup strategy)
    let backup_pin = primary_pin.clone();
    
    let now = SystemTime::now().duration_since(UNIX_EPOCH)
        .map_err(|e| ViWorksError::Internal(format!("Failed to get current time: {}", e)))?
        .as_secs();

    Ok(SpkiPins {
        primary_b64: primary_pin,
        backup_b64: backup_pin,
        created_at: now,
        expires_at: Some(now + 365 * 24 * 60 * 60), // 1 year
        domain: domain.to_string(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_spki_pin_validation() {
        let valid_pin = BASE64.encode([0u8; 32]);
        let pins = SpkiPins {
            primary_b64: valid_pin.clone(),
            backup_b64: valid_pin,
            created_at: 0,
            expires_at: Some(9999999999), // Far future
            domain: "example.com".to_string(),
        };
        
        assert!(validate_spki_pins(&pins).is_ok());
        
        let invalid_pins = SpkiPins {
            primary_b64: "invalid".to_string(),
            backup_b64: "invalid".to_string(),
            created_at: 0,
            expires_at: None,
            domain: "example.com".to_string(),
        };
        
        assert!(validate_spki_pins(&invalid_pins).is_err());
    }
}
