use crate::config::Config as AgentConfig;
use crate::error::{AgentError, AgentResult};
use bollard::container::{CreateContainerOptions, StopContainerOptions};
use bollard::models::PortBinding;
use bollard::Docker;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use tracing::{error, info, warn};

#[derive(Debug, Clone, serde::Serialize)]
pub struct ContainerInfo {
    pub id: String,
    pub name: String,
    pub status: String,
    pub username: String,
    pub session_id: String,
    pub port: Option<u16>,
    pub created_at: String,
}

pub struct DockerManager {
    config: AgentConfig,
    docker: Docker,
    containers: Arc<RwLock<HashMap<String, ContainerInfo>>>,
    next_port: Arc<RwLock<u16>>,
}

impl DockerManager {
    pub async fn new(config: AgentConfig) -> AgentResult<Self> {
        let docker = Docker::connect_with_local_defaults()
            .map_err(|e| AgentError::DockerError(format!("Failed to connect to Docker: {}", e)))?;

        let next_port = config.containers.port_range_start;

        Ok(Self {
            config,
            docker,
            containers: Arc::new(RwLock::new(HashMap::new())),
            next_port: Arc::new(RwLock::new(next_port)),
        })
    }

    pub async fn spawn_container(&self, username: &str, session_id: &str) -> AgentResult<String> {
        let container_name = format!("viworks-{}-{}", username, session_id);

        // Get next available port
        let port = {
            let mut next_port = self.next_port.write().await;
            let current_port = *next_port;
            *next_port = if current_port >= self.config.containers.port_range_end {
                self.config.containers.port_range_start
            } else {
                current_port + 1
            };
            current_port
        };

        info!("Spawning container: {} on port {}", container_name, port);

        // Create container configuration
        let container_config = bollard::container::Config {
            image: Some(self.config.containers.base_image.clone()),
            cmd: Some(vec![
                "tail".to_string(),
                "-f".to_string(),
                "/dev/null".to_string(),
            ]),
            env: Some(vec![
                format!("USERNAME={}", username),
                format!("SESSION_ID={}", session_id),
            ]),
            hostname: Some(container_name.clone()),
            exposed_ports: Some(HashMap::from([("8080/tcp".to_string(), HashMap::new())])),
            host_config: Some(bollard::models::HostConfig {
                port_bindings: Some(HashMap::from([(
                    "8080/tcp".to_string(),
                    Some(vec![PortBinding {
                        host_ip: Some("127.0.0.1".to_string()),
                        host_port: Some(port.to_string()),
                    }]),
                )])),
                memory: Some(512 * 1024 * 1024), // 512MB
                cpu_shares: Some(512),
                network_mode: Some(self.config.containers.network_mode.clone()),
                ..Default::default()
            }),
            ..Default::default()
        };

        // Create container
        let create_options = CreateContainerOptions {
            name: &container_name,
            platform: None,
        };

        let create_result = self
            .docker
            .create_container(Some(create_options), container_config)
            .await
            .map_err(|e| AgentError::DockerError(format!("Failed to create container: {}", e)))?;

        let container_id = create_result.id;

        // Start container
        self.docker
            .start_container::<String>(&container_id, None)
            .await
            .map_err(|e| AgentError::DockerError(format!("Failed to start container: {}", e)))?;

        // Store container info
        let container_info = ContainerInfo {
            id: container_id.clone(),
            name: container_name,
            status: "running".to_string(),
            username: username.to_string(),
            session_id: session_id.to_string(),
            port: Some(port),
            created_at: chrono::Utc::now().to_rfc3339(),
        };

        {
            let mut containers = self.containers.write().await;
            containers.insert(container_id.clone(), container_info);
        }

        info!(
            "Container spawned successfully: {} on port {}",
            container_id, port
        );

        Ok(container_id)
    }

    pub async fn stop_container(&self, container_id: &str) -> AgentResult<()> {
        info!("Stopping container: {}", container_id);

        // Stop container
        let stop_options = StopContainerOptions {
            t: 10, // 10 second timeout
        };

        self.docker
            .stop_container(container_id, Some(stop_options))
            .await
            .map_err(|e| AgentError::DockerError(format!("Failed to stop container: {}", e)))?;

        // Remove container info
        {
            let mut containers = self.containers.write().await;
            containers.remove(container_id);
        }

        info!("Container stopped successfully: {}", container_id);

        Ok(())
    }

    pub async fn list_containers(&self) -> AgentResult<Vec<ContainerInfo>> {
        let containers = self.containers.read().await;
        Ok(containers.values().cloned().collect())
    }

    pub async fn get_container_info(
        &self,
        container_id: &str,
    ) -> AgentResult<Option<ContainerInfo>> {
        let containers = self.containers.read().await;
        Ok(containers.get(container_id).cloned())
    }

    pub async fn stop_user_containers(&self, username: &str) -> AgentResult<usize> {
        let mut stopped_count = 0;
        let containers = self.containers.read().await;

        let containers_to_stop: Vec<String> = containers
            .values()
            .filter(|info| info.username == username)
            .map(|info| info.id.clone())
            .collect();

        drop(containers); // Release read lock

        for container_id in containers_to_stop {
            if let Err(e) = self.stop_container(&container_id).await {
                error!("Failed to stop container {}: {}", container_id, e);
            } else {
                stopped_count += 1;
            }
        }

        Ok(stopped_count)
    }

    pub async fn cleanup_stopped_containers(&self) -> AgentResult<usize> {
        let mut cleaned_count = 0;

        // List all containers (including stopped ones)
        let containers = self
            .docker
            .list_containers(Some(bollard::container::ListContainersOptions::<String> {
                all: true,
                ..Default::default()
            }))
            .await
            .map_err(|e| AgentError::DockerError(format!("Failed to list containers: {}", e)))?;

        for container in containers {
            if let Some(names) = container.names {
                if names.iter().any(|name| name.starts_with("/viworks-")) {
                    if let Some(state) = container.state {
                        if state == "exited" || state == "dead" {
                            if let Some(id) = container.id {
                                if let Err(e) = self.docker.remove_container(&id, None).await {
                                    error!("Failed to remove stopped container {}: {}", id, e);
                                } else {
                                    cleaned_count += 1;
                                }
                            }
                        }
                    }
                }
            }
        }

        Ok(cleaned_count)
    }

    pub fn init(_config: &AgentConfig) -> AgentResult<()> {
        info!("Docker manager initialized");
        Ok(())
    }
}
