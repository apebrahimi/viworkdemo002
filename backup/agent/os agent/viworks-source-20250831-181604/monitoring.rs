use crate::config::Config;
use crate::error::{AgentError, AgentResult};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use sysinfo::System;
use tokio::sync::RwLock;
use tracing::{error, info, warn};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemHealth {
    pub cpu_usage_percent: f64,
    pub memory_usage_percent: f64,
    pub disk_usage_percent: f64,
    pub load_average: LoadAverage,
    pub uptime_seconds: u64,
    pub temperature: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoadAverage {
    pub one_minute: f64,
    pub five_minutes: f64,
    pub fifteen_minutes: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServiceStatus {
    pub services: Vec<ServiceInfo>,
    pub timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServiceInfo {
    pub name: String,
    pub status: String,
    pub pid: Option<u32>,
    pub memory_usage: Option<u64>,
    pub cpu_usage: Option<f64>,
}

pub struct SystemMonitor {
    config: Config,
    system: Arc<RwLock<System>>,
}

impl SystemMonitor {
    pub fn new(config: Config) -> Self {
        let mut system = System::new_all();
        system.refresh_all();

        Self {
            config,
            system: Arc::new(RwLock::new(system)),
        }
    }

    pub async fn get_system_health(&self) -> AgentResult<SystemHealth> {
        info!("get_system_health: Starting system health check");
        
        let mut system = self.system.write().await;
        info!("get_system_health: Acquired system lock, refreshing data...");
        system.refresh_all();
        info!("get_system_health: System data refreshed");

        // CPU usage
        let cpu_usage = system.global_cpu_usage() as f64;
        info!("get_system_health: CPU usage: {}%", cpu_usage);

        // Memory usage
        let total_memory = system.total_memory();
        let available_memory = system.available_memory();
        let memory_usage = ((total_memory - available_memory) as f64 / total_memory as f64) * 100.0;
        info!("get_system_health: Memory usage: {}% (total: {}MB, available: {}MB)", 
              memory_usage, total_memory / 1024 / 1024, available_memory / 1024 / 1024);

        // Disk usage - simplified for now
        let disk_usage_percent: f64 = 0.0; // TODO: Implement disk monitoring
        info!("get_system_health: Disk usage: {}% (not implemented)", disk_usage_percent);

        // Load average
        let load_avg = System::load_average();
        info!("get_system_health: Load average - 1m: {}, 5m: {}, 15m: {}", 
              load_avg.one, load_avg.five, load_avg.fifteen);

        let uptime = System::uptime();
        info!("get_system_health: System uptime: {} seconds", uptime);

        let health = SystemHealth {
            cpu_usage_percent: cpu_usage,
            memory_usage_percent: memory_usage,
            disk_usage_percent,
            load_average: LoadAverage {
                one_minute: load_avg.one,
                five_minutes: load_avg.five,
                fifteen_minutes: load_avg.fifteen,
            },
            uptime_seconds: uptime,
            temperature: None, // sysinfo doesn't provide temperature on all systems
        };

        info!("get_system_health: System health object created successfully");
        Ok(health)
    }

    pub async fn get_service_status(&self) -> AgentResult<ServiceStatus> {
        let mut system = self.system.write().await;
        system.refresh_all();

        let mut services = Vec::new();

        // Check for common services
        let service_names = vec!["docker", "sshd", "nginx", "postgres", "redis", "openvpn"];

        for service_name in service_names {
            // This is a simplified check - in a real implementation,
            // you'd use systemd or process monitoring
            let status = if system.processes().values().any(|p| {
                p.name()
                    .to_string_lossy()
                    .to_lowercase()
                    .contains(service_name)
            }) {
                "running".to_string()
            } else {
                "stopped".to_string()
            };

            services.push(ServiceInfo {
                name: service_name.to_string(),
                status,
                pid: None,
                memory_usage: None,
                cpu_usage: None,
            });
        }

        Ok(ServiceStatus {
            services,
            timestamp: chrono::Utc::now().to_rfc3339(),
        })
    }

    pub async fn get_detailed_system_info(&self) -> AgentResult<serde_json::Value> {
        let mut system = self.system.write().await;
        system.refresh_all();

        let total_memory = system.total_memory();
        let available_memory = system.available_memory();
        let load_avg = System::load_average();

        let system_info = serde_json::json!({
            "cpu": {
                "cores": system.cpus().len(),
                "usage_percent": system.global_cpu_usage(),
                "frequency": system.cpus().first().map(|c| c.frequency()).unwrap_or(0),
                "brand": system.cpus().first().map(|c| c.brand().to_string()).unwrap_or_else(|| "unknown".to_string())
            },
            "memory": {
                "total_gb": total_memory / 1024 / 1024 / 1024,
                "used_gb": (total_memory - available_memory) / 1024 / 1024 / 1024,
                "available_gb": available_memory / 1024 / 1024 / 1024,
                "usage_percent": ((total_memory - available_memory) as f64 / total_memory as f64) * 100.0
            },
            "load_average": {
                "one_minute": load_avg.one,
                "five_minutes": load_avg.five,
                "fifteen_minutes": load_avg.fifteen
            },
            "disks": {
                "total_gb": 0,
                "used_gb": 0,
                "available_gb": 0,
                "count": 0
            },
            "network": {
                "interfaces": Vec::<String>::new(),
                "bytes_sent": 0,
                "bytes_received": 0
            },
            "uptime": System::uptime(),
            "hostname": System::host_name().unwrap_or_else(|| "unknown".to_string()),
            "os_name": System::name().unwrap_or_else(|| "unknown".to_string()),
            "os_version": System::os_version().unwrap_or_else(|| "unknown".to_string()),
            "kernel_version": System::kernel_version().unwrap_or_else(|| "unknown".to_string())
        });

        Ok(system_info)
    }

    pub fn init(_config: &Config) -> AgentResult<()> {
        info!("System monitor initialized");
        Ok(())
    }
}
