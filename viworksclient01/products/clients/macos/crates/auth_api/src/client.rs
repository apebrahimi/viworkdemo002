use viworks_core::{Result, ViWorksError, LoginRequest, LoginResponse, BootstrapData, AuthTokens, SecretString};
use reqwest::Client;
use chrono::{Utc, Duration as ChronoDuration};
use tracing::{info, warn, error};

#[derive(Clone)]
pub struct AuthClient {
    client: Client,
    base_url: String,
    access_token: Option<SecretString>,
}

impl AuthClient {
    pub fn new(base_url: String) -> Result<Self> {
        let client = Client::builder()
            .timeout(std::time::Duration::from_secs(30))
            .build()
            .map_err(|e| ViWorksError::Internal(format!("Failed to create HTTP client: {}", e)))?;

        Ok(Self { 
            client, 
            base_url,
            access_token: None,
        })
    }

    pub fn with_token(mut self, token: SecretString) -> Self {
        self.access_token = Some(token);
        self
    }

    pub async fn login(&self, request: LoginRequest) -> Result<LoginResponse> {
        info!("Attempting login for user: {}", request.username);
        
        let url = format!("{}/api/v1/auth/login", self.base_url);
        
        let login_request = serde_json::json!({
            "username": request.username,
            "password": request.password.as_str(),
            "device_id": request.device_id,
            "client_version": request.client_version
        });
        
        let response = self.client
            .post(&url)
            .json(&login_request)
            .send()
            .await
            .map_err(|e| {
                error!("Login request failed: {}", e);
                ViWorksError::ServerUnreachable(e.to_string())
            })?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            warn!("Login failed with status {}: {}", status, error_text);
            return Err(ViWorksError::InvalidCredentials);
        }

        let login_response: serde_json::Value = response.json()
            .await
            .map_err(|e| {
                error!("Failed to parse login response: {}", e);
                ViWorksError::Internal(format!("Failed to parse response: {}", e))
            })?;

        if login_response["success"].as_bool() == Some(true) {
            if login_response["requires_2fa"].as_bool() == Some(true) {
                info!("Login successful for user: {}, 2FA required", request.username);
                
                // For compatibility with the existing flow, return mock tokens
                // The real session token will be obtained after 2FA validation
                Ok(LoginResponse {
                    access_token: SecretString::new("temp_token_awaiting_2fa".to_string()),
                    refresh_token: SecretString::new("temp_refresh_token".to_string()),
                    expires_in: 300, // 5 minutes for 2FA window
                })
            } else {
                error!("Unexpected login response: 2FA not required");
                Err(ViWorksError::Internal("Invalid server response".to_string()))
            }
        } else {
            let message = login_response["message"].as_str().unwrap_or("Login failed");
            warn!("Login failed: {}", message);
            Err(ViWorksError::InvalidCredentials)
        }
    }

    pub async fn request_2fa_code(&self, username: &str) -> Result<String> {
        info!("Requesting 2FA code for user: {}", username);
        
        let url = format!("{}/api/v1/auth/request-2fa", self.base_url);
        
        let request = serde_json::json!({
            "username": username
        });
        
        let response = self.client
            .post(&url)
            .json(&request)
            .send()
            .await
            .map_err(|e| {
                error!("2FA request failed: {}", e);
                ViWorksError::ServerUnreachable(e.to_string())
            })?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            error!("2FA request failed with status {}: {}", status, error_text);
            return Err(ViWorksError::ServerError(format!("HTTP {}", status)));
        }

        let response_json: serde_json::Value = response.json()
            .await
            .map_err(|e| {
                error!("Failed to parse 2FA response: {}", e);
                ViWorksError::Internal(format!("Failed to parse response: {}", e))
            })?;

        if response_json["success"].as_bool() == Some(true) {
            // For development, return the code that was generated
            // In production, this wouldn't be returned
            if let Some(code) = response_json["code"].as_str() {
                info!("2FA code generated: {}", code);
                Ok(code.to_string())
            } else {
                info!("2FA code sent to Android app (code not returned in production mode)");
                Ok("Check Android app for code".to_string())
            }
        } else {
            let message = response_json["message"].as_str().unwrap_or("2FA request failed");
            error!("2FA request failed: {}", message);
            Err(ViWorksError::Internal(message.to_string()))
        }
    }

    pub async fn validate_2fa_code(&self, username: &str, code: &str) -> Result<SecretString> {
        info!("Validating 2FA code for user: {}", username);
        
        let url = format!("{}/api/v1/auth/validate-2fa", self.base_url);
        
        let request = serde_json::json!({
            "username": username,
            "code": code
        });
        
        let response = self.client
            .post(&url)
            .json(&request)
            .send()
            .await
            .map_err(|e| {
                error!("2FA validation failed: {}", e);
                ViWorksError::ServerUnreachable(e.to_string())
            })?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            error!("2FA validation failed with status {}: {}", status, error_text);
            return Err(ViWorksError::Unauthorized);
        }

        let response_json: serde_json::Value = response.json()
            .await
            .map_err(|e| {
                error!("Failed to parse 2FA validation response: {}", e);
                ViWorksError::Internal(format!("Failed to parse response: {}", e))
            })?;

        if response_json["success"].as_bool() == Some(true) {
            if let Some(session_token) = response_json["session_token"].as_str() {
                info!("2FA validation successful, session token obtained");
                Ok(SecretString::new(session_token.to_string()))
            } else {
                error!("2FA validation response missing session token");
                Err(ViWorksError::Internal("Missing session token".to_string()))
            }
        } else {
            let message = response_json["message"].as_str().unwrap_or("2FA validation failed");
            warn!("2FA validation failed: {}", message);
            Err(ViWorksError::Unauthorized)
        }
    }

    pub async fn bootstrap(&self, username: &str, session_token: &str) -> Result<BootstrapData> {
        info!("Fetching bootstrap data for user: {}", username);
        
        let url = format!("{}/api/v1/auth/connection-configs", self.base_url);
        
        let response = self.client
            .get(&url)
            .header("Authorization", format!("Bearer {}", session_token))
            .query(&[("username", username)])
            .send()
            .await
            .map_err(|e| {
                error!("Bootstrap request failed: {}", e);
                ViWorksError::ServerUnreachable(e.to_string())
            })?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            error!("Bootstrap failed with status {}: {}", status, error_text);
            return Err(ViWorksError::Unauthorized);
        }

        let response_json: serde_json::Value = response.json()
            .await
            .map_err(|e| {
                error!("Failed to parse bootstrap response: {}", e);
                ViWorksError::Internal(format!("Failed to parse response: {}", e))
            })?;

        if response_json["success"].as_bool() == Some(true) {
            let server_ip = response_json["server_ip"].as_str().unwrap_or("127.0.0.1").to_string();
            let server_port = response_json["server_port"].as_u64().unwrap_or(1194) as u16;
            let fwknop_key = response_json["spa_config"].as_str().unwrap_or("").to_string();
            let fwknop_hmac = response_json["spa_config"].as_str().unwrap_or("").to_string();
            let ovpn_base = response_json["openvpn_config"].as_str().unwrap_or("").to_string();
            
            info!("Bootstrap data retrieved successfully for user: {}", username);
            
            Ok(BootstrapData {
                server_host: server_ip,
                server_port,
                fwknop_key: SecretString::new(fwknop_key),
                fwknop_hmac: SecretString::new(fwknop_hmac),
                ovpn_base,
                ovpn_auth: None,
            })
        } else {
            let message = response_json["message"].as_str().unwrap_or("Bootstrap failed");
            error!("Bootstrap failed: {}", message);
            Err(ViWorksError::Internal(message.to_string()))
        }
    }

    // Device Management Methods
    pub async fn register_device(&self, user_id: &str, device_id: &str, device_info: DeviceInfo) -> Result<DeviceRegistrationResponse> {
        info!("Registering device for user: {}", user_id);
        
        let url = format!("{}/api/v1/auth/register-device", self.base_url);
        
        let request = serde_json::json!({
            "user_id": user_id,
            "device_id": device_id,
            "fcm_token": null, // Not implemented yet
            "device_info": {
                "model": device_info.model,
                "os": device_info.os,
                "app_version": device_info.app_version,
                "manufacturer": device_info.manufacturer,
                "device_name": device_info.device_name
            }
        });
        
        let response = self.client
            .post(&url)
            .json(&request)
            .send()
            .await
            .map_err(|e| {
                error!("Device registration failed: {}", e);
                ViWorksError::ServerUnreachable(e.to_string())
            })?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            error!("Device registration failed with status {}: {}", status, error_text);
            return Err(ViWorksError::ServerError(format!("HTTP {}", status)));
        }

        let response_json: serde_json::Value = response.json()
            .await
            .map_err(|e| {
                error!("Failed to parse device registration response: {}", e);
                ViWorksError::Internal(format!("Failed to parse response: {}", e))
            })?;

        if response_json["success"].as_bool() == Some(true) {
            info!("Device registered successfully for user: {}", user_id);
            Ok(DeviceRegistrationResponse {
                success: true,
                message: response_json["message"].as_str().unwrap_or("Device registered").to_string(),
                device_registered: response_json["device_registered"].as_bool().unwrap_or(true),
                device_id: response_json["device_id"].as_str().map(|s| s.to_string()),
            })
        } else {
            let message = response_json["message"].as_str().unwrap_or("Device registration failed");
            error!("Device registration failed: {}", message);
            Err(ViWorksError::Internal(message.to_string()))
        }
    }

    pub async fn request_verification_code(&self, request_id: &str, device_id: &str) -> Result<DeviceVerificationResponse> {
        info!("Requesting verification code for device: {}", device_id);
        
        let url = format!("{}/api/v1/auth/verification-code", self.base_url);
        
        let request = serde_json::json!({
            "request_id": request_id,
            "device_id": device_id,
            "location": null, // Not implemented yet
            "network_info": null, // Not implemented yet
            "device_integrity_token": null // Not implemented yet
        });
        
        let response = self.client
            .post(&url)
            .json(&request)
            .send()
            .await
            .map_err(|e| {
                error!("Verification code request failed: {}", e);
                ViWorksError::ServerUnreachable(e.to_string())
            })?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            error!("Verification code request failed with status {}: {}", status, error_text);
            return Err(ViWorksError::ServerError(format!("HTTP {}", status)));
        }

        let response_json: serde_json::Value = response.json()
            .await
            .map_err(|e| {
                error!("Failed to parse verification code response: {}", e);
                ViWorksError::Internal(format!("Failed to parse response: {}", e))
            })?;

        if response_json["success"].as_bool() == Some(true) {
            info!("Verification code generated successfully for device: {}", device_id);
            Ok(DeviceVerificationResponse {
                success: true,
                code: response_json["code"].as_str().map(|s| s.to_string()),
                expires_at: response_json["expires_at"].as_i64(),
                message: response_json["message"].as_str().unwrap_or("Verification code generated").to_string(),
            })
        } else {
            let message = response_json["message"].as_str().unwrap_or("Verification code request failed");
            error!("Verification code request failed: {}", message);
            Err(ViWorksError::Internal(message.to_string()))
        }
    }

    pub async fn list_devices(&self, session_token: &str) -> Result<DeviceListResponse> {
        info!("Fetching device list");
        
        let url = format!("{}/api/v1/auth/devices", self.base_url);
        
        let response = self.client
            .get(&url)
            .header("Authorization", format!("Bearer {}", session_token))
            .send()
            .await
            .map_err(|e| {
                error!("Device list request failed: {}", e);
                ViWorksError::ServerUnreachable(e.to_string())
            })?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            error!("Device list failed with status {}: {}", status, error_text);
            return Err(ViWorksError::Unauthorized);
        }

        let response_json: serde_json::Value = response.json()
            .await
            .map_err(|e| {
                error!("Failed to parse device list response: {}", e);
                ViWorksError::Internal(format!("Failed to parse response: {}", e))
            })?;

        if response_json["success"].as_bool() == Some(true) {
            info!("Device list retrieved successfully");
            
            let devices = if let Some(devices_array) = response_json["devices"].as_array() {
                devices_array
                    .iter()
                    .filter_map(|device| {
                        let device_obj = device.as_object()?;
                        let id = device_obj["id"].as_str()?;
                        let device_id = device_obj["device_id"].as_str()?;
                        let model = device_obj["model"].as_str()?;
                        let os = device_obj["os"].as_str()?;
                        let app_version = device_obj["app_version"].as_str()?;
                        let created_at = device_obj["created_at"].as_str()?;
                        let is_active = device_obj["is_active"].as_bool()?;
                        
                        Some(Device {
                            id: id.to_string(),
                            device_id: device_id.to_string(),
                            model: model.to_string(),
                            os: os.to_string(),
                            app_version: app_version.to_string(),
                            manufacturer: device_obj["manufacturer"].as_str().map(|s| s.to_string()),
                            device_name: device_obj["device_name"].as_str().map(|s| s.to_string()),
                            last_used_at: device_obj["last_used_at"].as_str().map(|s| s.to_string()),
                            created_at: created_at.to_string(),
                            is_active: is_active,
                        })
                    })
                    .collect()
            } else {
                Vec::new()
            };
            
            Ok(DeviceListResponse {
                success: true,
                devices,
            })
        } else {
            let message = response_json["message"].as_str().unwrap_or("Device list failed");
            error!("Device list failed: {}", message);
            Err(ViWorksError::Internal(message.to_string()))
        }
    }
}

// Device Management Types
#[derive(Debug, Clone)]
pub struct DeviceInfo {
    pub model: String,
    pub os: String,
    pub app_version: String,
    pub manufacturer: Option<String>,
    pub device_name: Option<String>,
}

#[derive(Debug, Clone)]
pub struct DeviceRegistrationResponse {
    pub success: bool,
    pub message: String,
    pub device_registered: bool,
    pub device_id: Option<String>,
}

#[derive(Debug, Clone)]
pub struct DeviceVerificationResponse {
    pub success: bool,
    pub code: Option<String>,
    pub expires_at: Option<i64>,
    pub message: String,
}

#[derive(Debug, Clone)]
pub struct DeviceListResponse {
    pub success: bool,
    pub devices: Vec<Device>,
}

#[derive(Debug, Clone)]
pub struct Device {
    pub id: String,
    pub device_id: String,
    pub model: String,
    pub os: String,
    pub app_version: String,
    pub manufacturer: Option<String>,
    pub device_name: Option<String>,
    pub last_used_at: Option<String>,
    pub created_at: String,
    pub is_active: bool,
}

impl Default for AuthClient {
    fn default() -> Self {
        Self::new("http://localhost:8080".to_string()).unwrap()
    }
}
