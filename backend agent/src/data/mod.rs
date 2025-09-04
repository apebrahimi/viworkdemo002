pub mod models;
pub mod postgres;
pub mod redis;

pub use models::*;
pub use postgres::PostgresClient;
pub use redis::RedisClient;

use crate::config::Config;
use crate::error::BackendAgentResult;
use std::sync::Arc;

#[derive(Clone)]
pub struct DataLayer {
    pub postgres: Arc<PostgresClient>,
    pub redis: Arc<RedisClient>,
}

impl DataLayer {
    pub async fn new(config: &Config) -> BackendAgentResult<Self> {
        let postgres = Arc::new(PostgresClient::new(&config.database).await?);
        let redis = Arc::new(RedisClient::new(&config.redis).await?);

        Ok(Self { postgres, redis })
    }

    pub async fn health_check(&self) -> BackendAgentResult<()> {
        // Check PostgreSQL connection
        self.postgres.health_check().await?;
        
        // Check Redis connection
        self.redis.health_check().await?;
        
        Ok(())
    }

    pub async fn close(&self) -> BackendAgentResult<()> {
        // Close PostgreSQL connections
        self.postgres.close().await?;
        
        // Close Redis connections
        self.redis.close().await?;
        
        Ok(())
    }
}
