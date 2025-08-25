# ViWorkS Admin Panel Backend

A robust, secure backend API for the ViWorkS Admin Panel built with Rust, Actix-web, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete CRUD operations for users with role management
- **Client Management**: Manage ViWorkS clients with connection tracking
- **Session Management**: Track and manage user sessions
- **Security Monitoring**: Real-time security alerts and audit logging
- **Health Monitoring**: Comprehensive health checks and system status
- **Database Integration**: PostgreSQL with SQLx for type-safe database operations
- **Caching**: Redis integration for session and data caching
- **Docker Support**: Complete containerization with Docker and Docker Compose

## 🛠️ Technology Stack

- **Language**: Rust 1.75+
- **Web Framework**: Actix-web 4.x
- **Database**: PostgreSQL 15+
- **ORM**: SQLx
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Caching**: Redis
- **Containerization**: Docker & Docker Compose
- **Logging**: tracing & tracing-subscriber

## 📋 Prerequisites

- Rust 1.75 or higher
- PostgreSQL 15 or higher
- Redis 7 or higher
- Docker & Docker Compose (for containerized deployment)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd viworks-admin-panel/backend
   ```

2. **Start the services**:
   ```bash
   docker-compose up -d
   ```

3. **Access the API**:
   - API Base URL: `http://localhost:8080/api/v1`
   - Health Check: `http://localhost:8080/api/v1/health`

### Option 2: Local Development

1. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database and Redis credentials
   ```

2. **Set up the database**:
   ```bash
   # Create database
   createdb viworks_admin
   
   # Run migrations
   sqlx migrate run
   
   # Seed initial data
   psql -d viworks_admin -f migrations/seed_data.sql
   ```

3. **Start Redis**:
   ```bash
   redis-server
   ```

4. **Run the application**:
   ```bash
   cargo run
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/viworks_admin` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `RUST_ENV` | Environment (development/production) | `development` |
| `RUST_LOG` | Log level | `info` |
| `HOST` | Server host | `127.0.0.1` |
| `PORT` | Server port | `8080` |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-jwt-key` |
| `JWT_EXPIRATION` | JWT token expiration (seconds) | `3600` |
| `BCRYPT_COST` | Password hashing cost | `12` |
| `MAX_LOGIN_ATTEMPTS` | Maximum failed login attempts | `5` |
| `SESSION_TIMEOUT_MINUTES` | Session timeout | `60` |

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/v1/auth/login`
Authenticate user with username and password.

**Request Body**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response**:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@viworks.local",
    "role": "owner"
  }
}
```

#### POST `/api/v1/auth/logout`
Logout user and invalidate session.

#### POST `/api/v1/auth/request-2fa`
Request 2FA code for user.

#### POST `/api/v1/auth/validate-2fa`
Validate 2FA code.

### User Management Endpoints

#### GET `/api/v1/users`
List all users with pagination.

**Query Parameters**:
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10)

#### POST `/api/v1/users`
Create a new user.

**Request Body**:
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "role": "auditor",
  "is_active": true
}
```

#### GET `/api/v1/users/{id}`
Get user details by ID.

#### PUT `/api/v1/users/{id}`
Update user information.

#### DELETE `/api/v1/users/{id}`
Delete user.

#### POST `/api/v1/users/{id}/unlock`
Unlock a locked user account.

#### POST `/api/v1/users/{id}/reset-password`
Reset user password (generates new password).

### Client Management Endpoints

#### GET `/api/v1/clients`
List all clients with pagination.

#### POST `/api/v1/clients`
Create a new client.

#### GET `/api/v1/clients/{id}`
Get client details.

#### PUT `/api/v1/clients/{id}`
Update client information.

#### DELETE `/api/v1/clients/{id}`
Delete client.

#### GET `/api/v1/clients/{id}/status`
Get client connection status.

#### POST `/api/v1/clients/{id}/connect`
Connect a client.

#### POST `/api/v1/clients/{id}/disconnect`
Disconnect a client.

### Session Management Endpoints

#### GET `/api/v1/sessions`
List all active sessions.

#### GET `/api/v1/sessions/{id}`
Get session details.

#### POST `/api/v1/sessions/{id}/revoke`
Revoke a specific session.

#### GET `/api/v1/sessions/user/{user_id}`
Get all sessions for a specific user.

#### POST `/api/v1/sessions/user/{user_id}/revoke-all`
Revoke all sessions for a user.

#### POST `/api/v1/sessions/cleanup`
Clean up expired sessions.

### Monitoring Endpoints

#### GET `/api/v1/monitoring/health`
Get system health status.

#### GET `/api/v1/monitoring/alerts`
List security alerts.

#### GET `/api/v1/monitoring/logs`
List system logs.

### Health Check Endpoints

#### GET `/api/v1/health`
Simple health check.

#### GET `/api/v1/health/full`
Comprehensive health check with service status.

#### GET `/api/v1/health/system-info`
Get system information.

## 🧪 Testing

### Run Tests
```bash
# Run all tests
cargo test

# Run tests with output
cargo test -- --nocapture

# Run specific test
cargo test test_health_endpoint
```

### Test Coverage
```bash
# Install cargo-tarpaulin
cargo install cargo-tarpaulin

# Generate coverage report
cargo tarpaulin --out Html
```

## 🐳 Docker Commands

### Build Image
```bash
docker build -t viworks-admin-backend .
```

### Run Container
```bash
docker run -p 8080:8080 --env-file .env viworks-admin-backend
```

### Docker Compose Commands
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Remove volumes (WARNING: This will delete all data)
docker-compose down -v
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with configurable cost
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions system
- **Session Management**: Secure session handling with expiration
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries with SQLx
- **CORS Configuration**: Configurable cross-origin resource sharing

## 📊 Database Schema

The application uses the following main tables:

- **users**: User accounts and authentication
- **clients**: ViWorkS client devices
- **user_sessions**: Active user sessions
- **security_alerts**: Security monitoring alerts
- **audit_logs**: System audit trail
- **connection_logs**: Client connection history
- **vpn_servers**: VPN server configuration
- **system_settings**: Application configuration

## 🔧 Development

### Project Structure
```
src/
├── main.rs              # Application entry point
├── api/                 # API endpoints
│   ├── auth.rs         # Authentication endpoints
│   ├── users.rs        # User management
│   ├── clients.rs      # Client management
│   ├── sessions.rs     # Session management
│   ├── monitoring.rs   # Monitoring endpoints
│   └── health.rs       # Health check endpoints
├── models.rs           # Database models
├── config.rs           # Configuration management
├── database.rs         # Database connection
├── auth/               # Authentication logic
└── utils/              # Utility functions
```

### Adding New Endpoints

1. Create a new module in `src/api/`
2. Implement the endpoint handlers
3. Add route configuration in the module
4. Register the module in `src/api/mod.rs`

### Database Migrations

```bash
# Create new migration
sqlx migrate add migration_name

# Run migrations
sqlx migrate run

# Revert migration
sqlx migrate revert
```

## 🚀 Deployment

### Production Deployment

1. **Set up production environment**:
   ```bash
   export RUST_ENV=production
   export DATABASE_URL=postgresql://user:pass@host:5432/db
   export JWT_SECRET=your-production-secret
   ```

2. **Build for production**:
   ```bash
   cargo build --release
   ```

3. **Run migrations**:
   ```bash
   sqlx migrate run
   ```

4. **Start the application**:
   ```bash
   ./target/release/viworks-admin-backend
   ```

### Docker Production Deployment

1. **Build production image**:
   ```bash
   docker build -t viworks-admin-backend:latest .
   ```

2. **Deploy with Docker Compose**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

## 📝 Logging

The application uses structured logging with the following levels:
- `error`: Error conditions
- `warn`: Warning conditions
- `info`: General information
- `debug`: Debug information
- `trace`: Trace information

### Log Configuration
```bash
# Set log level
export RUST_LOG=info

# Set specific module log levels
export RUST_LOG=viworks_admin_backend=debug,sqlx=warn
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Complete API implementation
- Docker support
- Comprehensive testing
- Production-ready deployment
