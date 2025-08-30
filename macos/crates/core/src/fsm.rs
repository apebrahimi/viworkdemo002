use crate::{Result, ViWorksError, ConnectionConfig, AuthTokens};
use serde::{Deserialize, Serialize};
use std::time::{Duration, Instant};
use tracing::{debug, info, warn};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ConnectionState {
    Idle,
    Preflight,
    Authenticated,
    BootstrapManual,
    BootstrapFetch,
    SpaSent,
    PortOpen,
    VpnConnecting,
    Connected,
    Error { error: String, can_retry: bool },
}

#[derive(Debug)]
pub enum ConnectionEvent {
    Login,
    Logout,
    FetchBootstrap,
    ManualConfig(ConnectionConfig),
    PreflightPassed,
    PreflightFailed(ViWorksError),
    SpaSent,
    SpaFailed(ViWorksError),
    PortProbeSuccess,
    PortProbeFailed(ViWorksError),
    VpnStarted,
    VpnConnected,
    VpnFailed(ViWorksError),
    Disconnect,
    Retry,
}

pub struct ConnectionFsm {
    state: ConnectionState,
    auth_tokens: Option<AuthTokens>,
    connection_config: Option<ConnectionConfig>,
    spa_sent_at: Option<Instant>,
    vpn_started_at: Option<Instant>,
    error_count: u32,
    last_error: Option<ViWorksError>,
}

impl ConnectionFsm {
    pub fn new() -> Self {
        Self {
            state: ConnectionState::Idle,
            auth_tokens: None,
            connection_config: None,
            spa_sent_at: None,
            vpn_started_at: None,
            error_count: 0,
            last_error: None,
        }
    }

    pub fn state(&self) -> &ConnectionState {
        &self.state
    }

    pub fn auth_tokens(&self) -> Option<&AuthTokens> {
        self.auth_tokens.as_ref()
    }

    pub fn connection_config(&self) -> Option<&ConnectionConfig> {
        self.connection_config.as_ref()
    }

    pub fn is_connected(&self) -> bool {
        matches!(self.state, ConnectionState::Connected)
    }

    pub fn is_busy(&self) -> bool {
        matches!(
            self.state,
            ConnectionState::Preflight | 
            ConnectionState::BootstrapManual | 
            ConnectionState::BootstrapFetch |
            ConnectionState::SpaSent |
            ConnectionState::PortOpen |
            ConnectionState::VpnConnecting
        )
    }

    pub fn can_disconnect(&self) -> bool {
        matches!(self.state, ConnectionState::Connected)
    }

    pub fn can_retry(&self) -> bool {
        if let ConnectionState::Error { can_retry, .. } = self.state {
            can_retry
        } else {
            false
        }
    }

    pub fn handle_event(&mut self, event: ConnectionEvent) -> Result<()> {
        debug!("FSM event: {:?} in state: {:?}", event, self.state);
        
        // Extract error strings for logging before moving the event
        let error_string = match &event {
            ConnectionEvent::PreflightFailed(e) => Some(e.to_string()),
            ConnectionEvent::SpaFailed(e) => Some(e.to_string()),
            ConnectionEvent::PortProbeFailed(e) => Some(e.to_string()),
            ConnectionEvent::VpnFailed(e) => Some(e.to_string()),
            _ => None,
        };
        
        match (&self.state, event) {
            // Idle state transitions
            (ConnectionState::Idle, ConnectionEvent::Login) => {
                self.state = ConnectionState::Preflight;
                info!("Starting preflight checks");
                Ok(())
            }

            // Preflight state transitions
            (ConnectionState::Preflight, ConnectionEvent::PreflightPassed) => {
                self.state = ConnectionState::Authenticated;
                info!("Preflight passed, ready for connection");
                Ok(())
            }
            (ConnectionState::Preflight, ConnectionEvent::PreflightFailed(error)) => {
                let error_string = error_string.unwrap_or_else(|| error.to_string());
                self.state = ConnectionState::Error {
                    error: error_string.clone(),
                    can_retry: true,
                };
                self.last_error = Some(error);
                warn!("Preflight failed: {}", error_string);
                Ok(())
            }

            // Authenticated state transitions
            (ConnectionState::Authenticated, ConnectionEvent::FetchBootstrap) => {
                self.state = ConnectionState::BootstrapFetch;
                info!("Fetching bootstrap data");
                Ok(())
            }
            (ConnectionState::Authenticated, ConnectionEvent::ManualConfig(config)) => {
                self.connection_config = Some(config);
                self.state = ConnectionState::BootstrapManual;
                info!("Manual configuration set");
                Ok(())
            }
            (ConnectionState::Authenticated, ConnectionEvent::Logout) => {
                self.reset_to_idle();
                info!("Logged out");
                Ok(())
            }

            // Bootstrap state transitions
            (ConnectionState::BootstrapFetch, ConnectionEvent::ManualConfig(config)) => {
                self.connection_config = Some(config);
                self.state = ConnectionState::SpaSent;
                self.spa_sent_at = Some(Instant::now());
                info!("SPA sent");
                Ok(())
            }
            (ConnectionState::BootstrapManual, ConnectionEvent::SpaSent) => {
                self.state = ConnectionState::SpaSent;
                self.spa_sent_at = Some(Instant::now());
                info!("SPA sent");
                Ok(())
            }

            // SPA state transitions
            (ConnectionState::SpaSent, ConnectionEvent::SpaFailed(error)) => {
                let error_string = error_string.unwrap_or_else(|| error.to_string());
                self.state = ConnectionState::Error {
                    error: error_string.clone(),
                    can_retry: true,
                };
                self.last_error = Some(error);
                warn!("SPA failed: {}", error_string);
                Ok(())
            }
            (ConnectionState::SpaSent, ConnectionEvent::PortProbeSuccess) => {
                self.state = ConnectionState::PortOpen;
                info!("Port 8443 is open");
                Ok(())
            }
            (ConnectionState::SpaSent, ConnectionEvent::PortProbeFailed(error)) => {
                let error_string = error_string.unwrap_or_else(|| error.to_string());
                self.state = ConnectionState::Error {
                    error: error_string.clone(),
                    can_retry: true,
                };
                self.last_error = Some(error);
                warn!("Port probe failed: {}", error_string);
                Ok(())
            }

            // Port open state transitions
            (ConnectionState::PortOpen, ConnectionEvent::VpnStarted) => {
                self.state = ConnectionState::VpnConnecting;
                self.vpn_started_at = Some(Instant::now());
                info!("OpenVPN started");
                Ok(())
            }

            // VPN connecting state transitions
            (ConnectionState::VpnConnecting, ConnectionEvent::VpnConnected) => {
                self.state = ConnectionState::Connected;
                info!("VPN connected successfully");
                Ok(())
            }
            (ConnectionState::VpnConnecting, ConnectionEvent::VpnFailed(error)) => {
                let error_string = error_string.unwrap_or_else(|| error.to_string());
                self.state = ConnectionState::Error {
                    error: error_string.clone(),
                    can_retry: true,
                };
                self.last_error = Some(error);
                warn!("VPN connection failed: {}", error_string);
                Ok(())
            }

            // Connected state transitions
            (ConnectionState::Connected, ConnectionEvent::Disconnect) => {
                self.reset_to_authenticated();
                info!("VPN disconnected");
                Ok(())
            }
            (ConnectionState::Connected, ConnectionEvent::Logout) => {
                self.reset_to_idle();
                info!("Logged out");
                Ok(())
            }

            // Error state transitions
            (ConnectionState::Error { .. }, ConnectionEvent::Retry) => {
                if let Some(error) = &self.last_error {
                    match error {
                        ViWorksError::TunnelActive | 
                        ViWorksError::WrongTimezone | 
                        ViWorksError::Offline => {
                            self.state = ConnectionState::Preflight;
                            info!("Retrying preflight");
                        }
                        ViWorksError::SpaDenied | 
                        ViWorksError::SpaTimeout => {
                            self.state = ConnectionState::SpaSent;
                            self.spa_sent_at = Some(Instant::now());
                            info!("Retrying SPA");
                        }
                        ViWorksError::PortProbeTimedOut => {
                            self.state = ConnectionState::SpaSent;
                            info!("Retrying port probe");
                        }
                        ViWorksError::AuthFailed | 
                        ViWorksError::HandshakeFailed => {
                            self.state = ConnectionState::VpnConnecting;
                            self.vpn_started_at = Some(Instant::now());
                            info!("Retrying VPN connection");
                        }
                        _ => {
                            self.state = ConnectionState::Authenticated;
                            info!("Retrying from authenticated state");
                        }
                    }
                }
                Ok(())
            }
            (ConnectionState::Error { .. }, ConnectionEvent::Logout) => {
                self.reset_to_idle();
                info!("Logged out from error state");
                Ok(())
            }

            // Invalid transitions
            _ => {
                warn!("Invalid event in state {:?}", self.state);
                Err(ViWorksError::Internal(format!(
                    "Invalid event in state {:?}",
                    self.state
                )))
            }
        }
    }

    pub fn set_auth_tokens(&mut self, tokens: AuthTokens) {
        self.auth_tokens = Some(tokens);
    }

    pub fn clear_auth_tokens(&mut self) {
        self.auth_tokens = None;
    }

    pub fn get_spa_timeout(&self) -> Option<Duration> {
        self.spa_sent_at.map(|sent_at| {
            let elapsed = sent_at.elapsed();
            if elapsed > crate::SPA_TIMEOUT {
                Duration::ZERO
            } else {
                crate::SPA_TIMEOUT - elapsed
            }
        })
    }

    pub fn get_vpn_timeout(&self) -> Option<Duration> {
        self.vpn_started_at.map(|started_at| {
            let elapsed = started_at.elapsed();
            if elapsed > crate::VPN_TIMEOUT {
                Duration::ZERO
            } else {
                crate::VPN_TIMEOUT - elapsed
            }
        })
    }

    fn reset_to_idle(&mut self) {
        self.state = ConnectionState::Idle;
        self.auth_tokens = None;
        self.connection_config = None;
        self.spa_sent_at = None;
        self.vpn_started_at = None;
        self.error_count = 0;
        self.last_error = None;
    }

    pub fn reset_to_authenticated(&mut self) {
        self.state = ConnectionState::Authenticated;
        self.connection_config = None;
        self.spa_sent_at = None;
        self.vpn_started_at = None;
        self.error_count = 0;
        self.last_error = None;
    }
}

impl Default for ConnectionFsm {
    fn default() -> Self {
        Self::new()
    }
}
