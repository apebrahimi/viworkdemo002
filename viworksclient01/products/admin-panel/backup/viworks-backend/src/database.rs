use sqlx::{PgPool, postgres::PgPoolOptions};
use tracing::{info, error};

pub async fn init_database(database_url: &str) -> Result<PgPool, sqlx::Error> {
    info!("Connecting to database...");
    
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await?;
    
    info!("Database connection established successfully");
    
    // Run migrations
    match sqlx::migrate!("./migrations").run(&pool).await {
        Ok(_) => info!("Database migrations completed successfully"),
        Err(e) => {
            error!("Failed to run migrations: {}", e);
            // Continue anyway as the database might already be up to date
        }
    }
    
    Ok(pool)
}

pub async fn init_redis(redis_url: &str) -> Result<redis::Client, redis::RedisError> {
    info!("Connecting to Redis...");
    
    let client = redis::Client::open(redis_url)?;
    
    // Test the connection
    let mut con = client.get_async_connection().await?;
    let _: () = redis::cmd("PING").query_async(&mut con).await?;
    
    info!("Redis connection established successfully");
    Ok(client)
}
