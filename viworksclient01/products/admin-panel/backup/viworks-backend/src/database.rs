use sqlx::{PgPool, postgres::PgPoolOptions};
use redis::{Client as RedisClient, aio::ConnectionManager};
use std::time::Duration;
use anyhow::Result;

#[derive(Clone)]
pub struct Database {
    pub postgres: PgPool,
    pub redis: ConnectionManager,
}

impl Database {
    pub async fn new() -> Result<Self> {
        // Get database URLs from environment
        let database_url = std::env::var("DATABASE_URL")
            .unwrap_or_else(|_| "postgresql://viworks_user:secure_password_change_me@localhost:5432/viworks_admin".to_string());
        
        let redis_url = std::env::var("REDIS_URL")
            .unwrap_or_else(|_| "redis://:secure_redis_password@localhost:6379".to_string());

        // Create PostgreSQL connection pool
        let postgres = PgPoolOptions::new()
            .max_connections(20)
            .acquire_timeout(Duration::from_secs(30))
            .connect(&database_url)
            .await?;

        // Create Redis connection
        let redis_client = RedisClient::open(redis_url)?;
        let redis = ConnectionManager::new(redis_client).await?;

        // Test connections
        sqlx::query("SELECT 1").execute(&postgres).await?;
        let mut redis_conn = redis.clone();
        let _: () = redis::cmd("PING").query_async(&mut redis_conn).await?;

        println!("✅ Database connections established successfully");

        Ok(Database { postgres, redis })
    }

    pub async fn run_migrations(&self) -> Result<()> {
        println!("🔄 Running database migrations...");
        
        // Split the migration file into individual statements
        let migration_sql = include_str!("../migrations/001_initial_schema.sql");
        let statements: Vec<&str> = migration_sql
            .split(';')
            .map(|s| s.trim())
            .filter(|s| !s.is_empty() && !s.starts_with("--"))
            .collect();
        
        // First pass: Create extensions
        for statement in &statements {
            if !statement.trim().is_empty() {
                let first_line = statement.lines().next().unwrap_or("").trim();
                if first_line.starts_with("CREATE EXTENSION") {
                    match sqlx::query(statement).execute(&self.postgres).await {
                        Ok(_) => println!("✅ Executed: {}", first_line),
                        Err(e) => {
                            if e.to_string().contains("already exists") {
                                println!("✅ Skipped (already exists): {}", first_line);
                            } else {
                                println!("❌ Failed: {} - Error: {}", first_line, e);
                                return Err(e.into());
                            }
                        }
                    }
                }
            }
        }
        
        // Second pass: Create types
        for statement in &statements {
            if !statement.trim().is_empty() {
                let first_line = statement.lines().next().unwrap_or("").trim();
                if first_line.starts_with("CREATE TYPE") {
                    match sqlx::query(statement).execute(&self.postgres).await {
                        Ok(_) => println!("✅ Executed: {}", first_line),
                        Err(e) => {
                            if e.to_string().contains("already exists") {
                                println!("✅ Skipped (already exists): {}", first_line);
                            } else {
                                println!("❌ Failed: {} - Error: {}", first_line, e);
                                return Err(e.into());
                            }
                        }
                    }
                }
            }
        }
        
        // Third pass: Create tables
        for statement in &statements {
            if !statement.trim().is_empty() {
                let first_line = statement.lines().next().unwrap_or("").trim();
                if first_line.starts_with("CREATE TABLE") {
                    match sqlx::query(statement).execute(&self.postgres).await {
                        Ok(_) => println!("✅ Executed: {}", first_line),
                        Err(e) => {
                            if e.to_string().contains("already exists") {
                                println!("✅ Skipped (already exists): {}", first_line);
                            } else {
                                println!("❌ Failed: {} - Error: {}", first_line, e);
                                return Err(e.into());
                            }
                        }
                    }
                }
            }
        }
        
        // Fourth pass: Create functions
        for statement in &statements {
            if !statement.trim().is_empty() {
                let first_line = statement.lines().next().unwrap_or("").trim();
                if first_line.starts_with("CREATE OR REPLACE FUNCTION") {
                    match sqlx::query(statement).execute(&self.postgres).await {
                        Ok(_) => println!("✅ Executed: {}", first_line),
                        Err(e) => {
                            println!("❌ Failed: {} - Error: {}", first_line, e);
                            return Err(e.into());
                        }
                    }
                }
            }
        }
        
        // Fifth pass: Create triggers (after tables and functions exist)
        for statement in &statements {
            if !statement.trim().is_empty() {
                let first_line = statement.lines().next().unwrap_or("").trim();
                if first_line.starts_with("CREATE TRIGGER") {
                    match sqlx::query(statement).execute(&self.postgres).await {
                        Ok(_) => println!("✅ Executed: {}", first_line),
                        Err(e) => {
                            if e.to_string().contains("already exists") {
                                println!("✅ Skipped (already exists): {}", first_line);
                            } else if e.to_string().contains("does not exist") {
                                println!("⚠️  Skipped (table/function not ready): {}", first_line);
                            } else {
                                println!("❌ Failed: {} - Error: {}", first_line, e);
                                return Err(e.into());
                            }
                        }
                    }
                }
            }
        }
        
        // Sixth pass: Create indexes (after tables exist)
        for statement in &statements {
            if !statement.trim().is_empty() {
                let first_line = statement.lines().next().unwrap_or("").trim();
                if first_line.starts_with("CREATE INDEX") {
                    match sqlx::query(statement).execute(&self.postgres).await {
                        Ok(_) => println!("✅ Executed: {}", first_line),
                        Err(e) => {
                            if e.to_string().contains("already exists") {
                                println!("✅ Skipped (already exists): {}", first_line);
                            } else if e.to_string().contains("does not exist") {
                                println!("⚠️  Skipped (table not ready): {}", first_line);
                            } else {
                                println!("❌ Failed: {} - Error: {}", first_line, e);
                                return Err(e.into());
                            }
                        }
                    }
                }
            }
        }
        
        // Seventh pass: Insert data (after all schema is ready)
        for statement in &statements {
            if !statement.trim().is_empty() {
                let first_line = statement.lines().next().unwrap_or("").trim();
                if first_line.starts_with("INSERT INTO") {
                    match sqlx::query(statement).execute(&self.postgres).await {
                        Ok(_) => println!("✅ Executed: {}", first_line),
                        Err(e) => {
                            if e.to_string().contains("duplicate key") || e.to_string().contains("already exists") {
                                println!("✅ Skipped (already exists): {}", first_line);
                            } else if e.to_string().contains("does not exist") {
                                println!("⚠️  Skipped (table not ready): {}", first_line);
                            } else {
                                println!("❌ Failed: {} - Error: {}", first_line, e);
                                return Err(e.into());
                            }
                        }
                    }
                }
            }
        }

        println!("✅ Database migrations completed successfully");
        Ok(())
    }

    pub async fn health_check(&self) -> Result<bool> {
        // Check PostgreSQL
        match sqlx::query("SELECT 1").execute(&self.postgres).await {
            Ok(_) => {},
            Err(e) => {
                eprintln!("❌ PostgreSQL health check failed: {}", e);
                return Ok(false);
            }
        }

        // Check Redis
        let mut redis_conn = self.redis.clone();
        match redis::cmd("PING").query_async::<_, ()>(&mut redis_conn).await {
            Ok(_) => {},
            Err(e) => {
                eprintln!("❌ Redis health check failed: {}", e);
                return Ok(false);
            }
        }

        Ok(true)
    }
}
