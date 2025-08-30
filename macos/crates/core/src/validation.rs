use crate::{Result, ViWorksError, MAX_OVPN_SIZE};
use regex::Regex;
use std::net::IpAddr;

lazy_static::lazy_static! {
    static ref HOSTNAME_REGEX: Regex = Regex::new(r"^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$").unwrap();
    static ref IP_REGEX: Regex = Regex::new(r"^(\d{1,3}\.){3}\d{1,3}$").unwrap();
}

pub fn validate_hostname(hostname: &str) -> Result<()> {
    if hostname.is_empty() {
        return Err(ViWorksError::InvalidHostname("Hostname cannot be empty".to_string()));
    }

    if hostname.len() > 253 {
        return Err(ViWorksError::InvalidHostname("Hostname too long".to_string()));
    }

    // Check if it's an IP address
    if IP_REGEX.is_match(hostname) {
        if let Ok(ip) = hostname.parse::<IpAddr>() {
            match ip {
                IpAddr::V4(ipv4) => {
                    if ipv4.is_private() || ipv4.is_loopback() || ipv4.is_link_local() {
                        return Ok(());
                    }
                }
                IpAddr::V6(ipv6) => {
                    if ipv6.is_loopback() || ipv6.is_unspecified() {
                        return Ok(());
                    }
                }
            }
        }
        return Err(ViWorksError::InvalidHostname("Public IP addresses not allowed".to_string()));
    }

    // Validate hostname format
    if !HOSTNAME_REGEX.is_match(hostname) {
        return Err(ViWorksError::InvalidHostname("Invalid hostname format".to_string()));
    }

    Ok(())
}

pub fn validate_port(port: u16) -> Result<()> {
    if port == 0 {
        return Err(ViWorksError::InvalidPort(port));
    }
    Ok(())
}

pub fn validate_key(key: &str) -> Result<()> {
    if key.trim().is_empty() {
        return Err(ViWorksError::EmptyKey);
    }
    Ok(())
}

pub fn validate_hmac(hmac: &str) -> Result<()> {
    if hmac.trim().is_empty() {
        return Err(ViWorksError::EmptyKey);
    }
    Ok(())
}

pub fn validate_ovpn_config(config: &str) -> Result<()> {
    // Check size
    if config.len() > MAX_OVPN_SIZE {
        return Err(ViWorksError::OvpnTooLarge(MAX_OVPN_SIZE));
    }

    // Check for null bytes
    if config.contains('\0') {
        return Err(ViWorksError::OvpnContainsNulls);
    }

    // Check for valid ASCII characters
    if !config.is_ascii() {
        return Err(ViWorksError::OvpnInvalidChars);
    }

    // Basic OpenVPN config validation
    let required_directives = ["client", "proto", "remote"];
    let mut found_required = 0;

    for line in config.lines() {
        let line = line.trim();
        
        // Skip comments and empty lines
        if line.is_empty() || line.starts_with('#') || line.starts_with(';') {
            continue;
        }

        // Check for required directives
        for directive in &required_directives {
            if line.starts_with(directive) {
                found_required += 1;
                break;
            }
        }

        // Validate directive format
        if let Some((directive, _)) = line.split_once(' ') {
            match directive {
                "client" | "server" | "proto" | "remote" | "port" | "dev" | "ca" | "cert" | "key" | "tls-auth" | "tls-crypt" | "auth" | "cipher" | "data-ciphers" | "block-outside-dns" => {
                    // Valid directive
                }
                _ => {
                    // Unknown directive - log but don't fail
                    tracing::warn!("Unknown OpenVPN directive: {}", directive);
                }
            }
        }
    }

    if found_required < 2 {
        return Err(ViWorksError::ConfigInvalid);
    }

    Ok(())
}

pub fn validate_connection_config(config: &crate::ConnectionConfig) -> Result<()> {
    validate_hostname(&config.server_host)?;
    validate_port(config.server_port)?;
    validate_key(config.fwknop_key.as_str())?;
    validate_hmac(config.fwknop_hmac.as_str())?;
    validate_ovpn_config(&config.ovpn_config)?;
    
    if let Some(auth) = &config.ovpn_auth {
        validate_key(auth.username.as_str())?;
        validate_key(auth.password.as_str())?;
    }

    Ok(())
}

pub fn validate_bootstrap_data(data: &crate::BootstrapData) -> Result<()> {
    validate_hostname(&data.server_host)?;
    validate_port(data.server_port)?;
    validate_key(data.fwknop_key.as_str())?;
    validate_hmac(data.fwknop_hmac.as_str())?;
    
    if let Some(auth) = &data.ovpn_auth {
        validate_key(auth.username.as_str())?;
        validate_key(auth.password.as_str())?;
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_hostname() {
        assert!(validate_hostname("example.com").is_ok());
        assert!(validate_hostname("sub.example.com").is_ok());
        assert!(validate_hostname("localhost").is_ok());
        assert!(validate_hostname("192.168.1.1").is_ok());
        assert!(validate_hostname("127.0.0.1").is_ok());
        assert!(validate_hostname("::1").is_ok());
        
        assert!(validate_hostname("").is_err());
        assert!(validate_hostname("8.8.8.8").is_err()); // Public IP
        assert!(validate_hostname("invalid..hostname").is_err());
        assert!(validate_hostname("hostname-with-trailing-dash-").is_err());
    }

    #[test]
    fn test_validate_port() {
        assert!(validate_port(1).is_ok());
        assert!(validate_port(8443).is_ok());
        assert!(validate_port(65535).is_ok());
        assert!(validate_port(0).is_err());
    }

    #[test]
    fn test_validate_key() {
        assert!(validate_key("valid-key").is_ok());
        assert!(validate_key("").is_err());
        assert!(validate_key("   ").is_err());
    }

    #[test]
    fn test_validate_ovpn_config() {
        let valid_config = r#"
client
proto udp
remote server.com 1194
dev tun
ca ca.crt
cert client.crt
key client.key
"#;
        assert!(validate_ovpn_config(valid_config).is_ok());

        let invalid_config = "client\nproto udp\nremote server.com 1194\0";
        assert!(validate_ovpn_config(invalid_config).is_err());

        let large_config = "client\n".repeat(MAX_OVPN_SIZE / 10);
        assert!(validate_ovpn_config(&large_config).is_err());
    }

    #[test]
    fn test_validate_connection_config() {
        let config = crate::ConnectionConfig {
            server_host: "example.com".to_string(),
            server_port: 8443,
            fwknop_key: crate::SecretString::new("test-key".to_string()),
            fwknop_hmac: crate::SecretString::new("test-hmac".to_string()),
            ovpn_config: "client\nproto udp\nremote server.com 1194".to_string(),
            ovpn_auth: None,
            stunnel_enabled: false,
            stunnel_accept: "127.0.0.1:8443".to_string(),
            stunnel_connect: "example.com:443".to_string(),
            stunnel_cert: None,
            skip_spa: false,
        };
        
        assert!(validate_connection_config(&config).is_ok());
    }
}
