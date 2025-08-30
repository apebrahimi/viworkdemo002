// Example migration from sqlx to native postgres
// This file demonstrates the migration patterns

use deadpool_postgres::{Pool, PoolError, Runtime};
use tokio_postgres::{NoTls, Row};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

// Before (sqlx):
// use sqlx::{PgPool, postgres::PgPoolOptions};

// After (native postgres):
use postgres::{Client, NoTls as PostgresNoTls};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub created_at: DateTime<Utc>,
}

impl User {
    // Manual row mapping (replaces FromRow derive)
    fn from_row(row: &Row) -> Self {
        User {
            id: row.get("id"),
            username: row.get("username"),
            email: row.get("email"),
            created_at: row.get("created_at"),
        }
    }
}

pub struct Database {
    pub pool: Pool,
}

impl Database {
    pub async fn new(database_url: &str) -> Result<Self, Box<dyn std::error::Error>> {
        // Before (sqlx):
        // let pool = PgPoolOptions::new()
        //     .max_connections(5)
        //     .connect(database_url)
        //     .await?;

        // After (native postgres with deadpool):
        let config = database_url.parse::<tokio_postgres::Config>()?;
        let manager = deadpool_postgres::Manager::new(config, NoTls);
        let pool = Pool::builder(manager)
            .max_size(5)
            .runtime(Runtime::Tokio1)
            .build()?;

        Ok(Database { pool })
    }

    pub async fn get_user(&self, user_id: Uuid) -> Result<Option<User>, PoolError> {
        let client = self.pool.get().await?;
        
        // Before (sqlx):
        // let user = sqlx::query_as!(User, "SELECT * FROM users WHERE id = $1", user_id)
        //     .fetch_optional(&self.pool)
        //     .await?;

        // After (native postgres):
        let rows = client
            .query("SELECT id, username, email, created_at FROM users WHERE id = $1", &[&user_id])
            .await?;

        let user = rows.first().map(User::from_row);
        Ok(user)
    }

    pub async fn create_user(&self, username: &str, email: &str) -> Result<User, PoolError> {
        let client = self.pool.get().await?;
        
        // Before (sqlx):
        // let user = sqlx::query_as!(
        //     User,
        //     "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *",
        //     username,
        //     email
        // )
        // .fetch_one(&self.pool)
        // .await?;

        // After (native postgres):
        let rows = client
            .query(
                "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id, username, email, created_at",
                &[&username, &email]
            )
            .await?;

        let user = User::from_row(&rows[0]);
        Ok(user)
    }

    pub async fn list_users(&self) -> Result<Vec<User>, PoolError> {
        let client = self.pool.get().await?;
        
        // Before (sqlx):
        // let users = sqlx::query_as!(User, "SELECT * FROM users ORDER BY created_at DESC")
        //     .fetch_all(&self.pool)
        //     .await?;

        // After (native postgres):
        let rows = client
            .query("SELECT id, username, email, created_at FROM users ORDER BY created_at DESC", &[])
            .await?;

        let users: Vec<User> = rows.iter().map(User::from_row).collect();
        Ok(users)
    }

    pub async fn update_user(&self, user_id: Uuid, username: &str, email: &str) -> Result<Option<User>, PoolError> {
        let client = self.pool.get().await?;
        
        // Before (sqlx):
        // let user = sqlx::query_as!(
        //     User,
        //     "UPDATE users SET username = $2, email = $3 WHERE id = $1 RETURNING *",
        //     user_id,
        //     username,
        //     email
        // )
        // .fetch_optional(&self.pool)
        // .await?;

        // After (native postgres):
        let rows = client
            .query(
                "UPDATE users SET username = $2, email = $3 WHERE id = $1 RETURNING id, username, email, created_at",
                &[&user_id, &username, &email]
            )
            .await?;

        let user = rows.first().map(User::from_row);
        Ok(user)
    }

    pub async fn delete_user(&self, user_id: Uuid) -> Result<bool, PoolError> {
        let client = self.pool.get().await?;
        
        // Before (sqlx):
        // let result = sqlx::query!("DELETE FROM users WHERE id = $1", user_id)
        //     .execute(&self.pool)
        //     .await?;
        // Ok(result.rows_affected() > 0)

        // After (native postgres):
        let result = client
            .execute("DELETE FROM users WHERE id = $1", &[&user_id])
            .await?;
        Ok(result > 0)
    }

    // Transaction example
    pub async fn create_user_with_session(&self, username: &str, email: &str, session_data: &str) -> Result<User, PoolError> {
        let client = self.pool.get().await?;
        
        // Before (sqlx):
        // let mut tx = self.pool.begin().await?;
        // let user = sqlx::query_as!(
        //     User,
        //     "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *",
        //     username,
        //     email
        // )
        // .fetch_one(&mut tx)
        // .await?;
        // sqlx::query!("INSERT INTO sessions (user_id, data) VALUES ($1, $2)", user.id, session_data)
        //     .execute(&mut tx)
        //     .await?;
        // tx.commit().await?;
        // Ok(user)

        // After (native postgres):
        let tx = client.transaction().await?;
        
        let user_rows = tx
            .query(
                "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id, username, email, created_at",
                &[&username, &email]
            )
            .await?;
        
        let user = User::from_row(&user_rows[0]);
        
        tx.execute(
            "INSERT INTO sessions (user_id, data) VALUES ($1, $2)",
            &[&user.id, &session_data]
        )
        .await?;
        
        tx.commit().await?;
        Ok(user)
    }
}

// Health check example
impl Database {
    pub async fn health_check(&self) -> Result<bool, PoolError> {
        let client = self.pool.get().await?;
        
        // Before (sqlx):
        // let _ = sqlx::query!("SELECT 1").execute(&self.pool).await?;
        
        // After (native postgres):
        let _ = client.query("SELECT 1", &[]).await?;
        Ok(true)
    }
}

// Error handling example
pub type DatabaseResult<T> = Result<T, Box<dyn std::error::Error>>;

impl Database {
    pub async fn safe_get_user(&self, user_id: Uuid) -> DatabaseResult<Option<User>> {
        match self.get_user(user_id).await {
            Ok(user) => Ok(user),
            Err(e) => {
                eprintln!("Database error: {}", e);
                Err(Box::new(e))
            }
        }
    }
}
