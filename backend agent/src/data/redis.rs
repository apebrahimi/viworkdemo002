use crate::config::RedisConfig;
use crate::error::BackendAgentError;
use redis::{Client, aio::ConnectionManager, RedisResult};
use std::time::Duration;
use tracing::{error, info};

pub struct RedisClient {
    pub client: Client,
    pub manager: ConnectionManager,
    pub config: RedisConfig,
}

impl RedisClient {
    pub async fn new(config: &RedisConfig) -> Result<Self, BackendAgentError> {
        info!("Initializing Redis connection...");

        let client = Client::open(config.url.as_str())
            .map_err(|e| {
                error!("Failed to create Redis client: {}", e);
                BackendAgentError::Redis(e)
            })?;

        let manager = ConnectionManager::new(client.clone())
            .await
            .map_err(|e| {
                error!("Failed to create Redis connection manager: {}", e);
                BackendAgentError::Redis(e)
            })?;

        info!("Redis connection initialized successfully");

        // Test the connection
        let mut conn = manager.clone();
        let _: () = redis::cmd("PING")
            .query_async(&mut conn)
            .await
            .map_err(|e| {
                error!("Failed to test Redis connection: {}", e);
                BackendAgentError::Redis(e)
            })?;

        info!("Redis connection test successful");

        Ok(Self {
            client,
            manager,
            config: config.clone(),
        })
    }

    pub async fn health_check(&self) -> Result<(), BackendAgentError> {
        let mut conn = self.manager.clone();
        let _: () = redis::cmd("PING")
            .query_async(&mut conn)
            .await
            .map_err(|e| {
                error!("Redis health check failed: {}", e);
                BackendAgentError::Redis(e)
            })?;

        Ok(())
    }

    pub async fn close(&self) -> Result<(), BackendAgentError> {
        info!("Closing Redis connection...");
        // Redis connections are automatically closed when dropped
        info!("Redis connection closed");
        Ok(())
    }

    pub fn get_manager(&self) -> &ConnectionManager {
        &self.manager
    }

    // ============================================================================
    // Basic Redis Operations
    // ============================================================================

    pub async fn set(&self, key: &str, value: &str, ttl: Option<Duration>) -> Result<(), BackendAgentError> {
        let mut conn = self.manager.clone();
        
        if let Some(ttl) = ttl {
            redis::cmd("SETEX")
                .arg(key)
                .arg(ttl.as_secs())
                .arg(value)
                .query_async::<_, ()>(&mut conn)
                .await
                .map_err(|e| {
                    error!("Failed to set Redis key {}: {}", key, e);
                    BackendAgentError::Redis(e)
                })?;
        } else {
            redis::cmd("SET")
                .arg(key)
                .arg(value)
                .query_async::<_, ()>(&mut conn)
                .await
                .map_err(|e| {
                    error!("Failed to set Redis key {}: {}", key, e);
                    BackendAgentError::Redis(e)
                })?;
        }

        Ok(())
    }

    pub async fn get(&self, key: &str) -> Result<Option<String>, BackendAgentError> {
        let mut conn = self.manager.clone();
        
        let result: RedisResult<Option<String>> = redis::cmd("GET")
            .arg(key)
            .query_async(&mut conn)
            .await;

        match result {
            Ok(value) => Ok(value),
            Err(e) => {
                error!("Failed to get Redis key {}: {}", key, e);
                Err(BackendAgentError::Redis(e))
            }
        }
    }

    pub async fn del(&self, key: &str) -> Result<(), BackendAgentError> {
        let mut conn = self.manager.clone();
        
        redis::cmd("DEL")
            .arg(key)
            .query_async::<_, ()>(&mut conn)
            .await
            .map_err(|e| {
                error!("Failed to delete Redis key {}: {}", key, e);
                BackendAgentError::Redis(e)
            })?;

        Ok(())
    }

    pub async fn exists(&self, key: &str) -> Result<bool, BackendAgentError> {
        let mut conn = self.manager.clone();
        
        let result: i32 = redis::cmd("EXISTS")
            .arg(key)
            .query_async(&mut conn)
            .await
            .map_err(|e| {
                error!("Failed to check Redis key {}: {}", key, e);
                BackendAgentError::Redis(e)
            })?;

        Ok(result > 0)
    }

    // ============================================================================
    // Hash Operations
    // ============================================================================

    pub async fn hset(&self, key: &str, field: &str, value: &str) -> Result<(), BackendAgentError> {
        let mut conn = self.manager.clone();
        
        redis::cmd("HSET")
            .arg(key)
            .arg(field)
            .arg(value)
            .query_async::<_, ()>(&mut conn)
            .await
            .map_err(|e| {
                error!("Failed to hset Redis key {} field {}: {}", key, field, e);
                BackendAgentError::Redis(e)
            })?;

        Ok(())
    }

    pub async fn hget(&self, key: &str, field: &str) -> Result<Option<String>, BackendAgentError> {
        let mut conn = self.manager.clone();
        
        let result: RedisResult<Option<String>> = redis::cmd("HGET")
            .arg(key)
            .arg(field)
            .query_async(&mut conn)
            .await;

        match result {
            Ok(value) => Ok(value),
            Err(e) => {
                error!("Failed to hget Redis key {} field {}: {}", key, field, e);
                Err(BackendAgentError::Redis(e))
            }
        }
    }

    pub async fn hgetall(&self, key: &str) -> Result<Vec<(String, String)>, BackendAgentError> {
        let mut conn = self.manager.clone();
        
        let result: Vec<(String, String)> = redis::cmd("HGETALL")
            .arg(key)
            .query_async(&mut conn)
            .await
            .map_err(|e| {
                error!("Failed to hgetall Redis key {}: {}", key, e);
                BackendAgentError::Redis(e)
            })?;

        Ok(result)
    }

    // ============================================================================
    // List Operations
    // ============================================================================

    pub async fn lpush(&self, key: &str, value: &str) -> Result<(), BackendAgentError> {
        let mut conn = self.manager.clone();
        
        redis::cmd("LPUSH")
            .arg(key)
            .arg(value)
            .query_async::<_, ()>(&mut conn)
            .await
            .map_err(|e| {
                error!("Failed to lpush Redis key {}: {}", key, e);
                BackendAgentError::Redis(e)
            })?;

        Ok(())
    }

    pub async fn rpop(&self, key: &str) -> Result<Option<String>, BackendAgentError> {
        let mut conn = self.manager.clone();
        
        let result: RedisResult<Option<String>> = redis::cmd("RPOP")
            .arg(key)
            .query_async(&mut conn)
            .await;

        match result {
            Ok(value) => Ok(value),
            Err(e) => {
                error!("Failed to rpop Redis key {}: {}", key, e);
                Err(BackendAgentError::Redis(e))
            }
        }
    }

    // ============================================================================
    // Set Operations
    // ============================================================================

    pub async fn sadd(&self, key: &str, member: &str) -> Result<(), BackendAgentError> {
        let mut conn = self.manager.clone();
        
        redis::cmd("SADD")
            .arg(key)
            .arg(member)
            .query_async::<_, ()>(&mut conn)
            .await
            .map_err(|e| {
                error!("Failed to sadd Redis key {}: {}", key, e);
                BackendAgentError::Redis(e)
            })?;

        Ok(())
    }

    pub async fn smembers(&self, key: &str) -> Result<Vec<String>, BackendAgentError> {
        let mut conn = self.manager.clone();
        
        let result: Vec<String> = redis::cmd("SMEMBERS")
            .arg(key)
            .query_async(&mut conn)
            .await
            .map_err(|e| {
                error!("Failed to smembers Redis key {}: {}", key, e);
                BackendAgentError::Redis(e)
            })?;

        Ok(result)
    }

    // ============================================================================
    // Expiration Operations
    // ============================================================================

    pub async fn expire(&self, key: &str, seconds: u64) -> Result<bool, BackendAgentError> {
        let mut conn = self.manager.clone();
        
        let result: i32 = redis::cmd("EXPIRE")
            .arg(key)
            .arg(seconds)
            .query_async(&mut conn)
            .await
            .map_err(|e| {
                error!("Failed to expire Redis key {}: {}", key, e);
                BackendAgentError::Redis(e)
            })?;

        Ok(result > 0)
    }

    pub async fn ttl(&self, key: &str) -> Result<i64, BackendAgentError> {
        let mut conn = self.manager.clone();
        
        let result: i64 = redis::cmd("TTL")
            .arg(key)
            .query_async(&mut conn)
            .await
            .map_err(|e| {
                error!("Failed to get TTL for Redis key {}: {}", key, e);
                BackendAgentError::Redis(e)
            })?;

        Ok(result)
    }
}
