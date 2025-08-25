# ViWorkS Admin Panel - Database Setup Script
# This script helps set up PostgreSQL database for development

Write-Host "🔧 ViWorkS Admin Panel - Database Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if PostgreSQL is installed
Write-Host "Checking PostgreSQL installation..." -ForegroundColor Yellow
try {
    $psqlVersion = psql --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL found: $psqlVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ PostgreSQL not found. Please install PostgreSQL first." -ForegroundColor Red
        Write-Host "Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ PostgreSQL not found. Please install PostgreSQL first." -ForegroundColor Red
    Write-Host "Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}

# Database configuration
$DB_NAME = "viworks_admin"
$DB_USER = "viworks_admin"
$DB_PASSWORD = "viworks_password_2024"
$DB_HOST = "localhost"
$DB_PORT = "5432"

Write-Host "Setting up database configuration..." -ForegroundColor Yellow
Write-Host "Database Name: $DB_NAME" -ForegroundColor White
Write-Host "Database User: $DB_USER" -ForegroundColor White
Write-Host "Database Host: $DB_HOST" -ForegroundColor White
Write-Host "Database Port: $DB_PORT" -ForegroundColor White

# Create database and user
Write-Host "Creating database and user..." -ForegroundColor Yellow

# Create user (if not exists)
$createUserSQL = @"
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
    END IF;
END
\$\$;
"@

echo $createUserSQL | psql -h $DB_HOST -p $DB_PORT -U postgres -d postgres

# Create database (if not exists)
$createDBSQL = @"
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec
"@

echo $createDBSQL | psql -h $DB_HOST -p $DB_PORT -U postgres -d postgres

# Grant privileges
$grantSQL = @"
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
GRANT ALL ON SCHEMA public TO $DB_USER;
"@

echo $grantSQL | psql -h $DB_HOST -p $DB_PORT -U postgres -d $DB_NAME

Write-Host "✅ Database and user created successfully!" -ForegroundColor Green

# Create .env file with database configuration
Write-Host "Creating .env file..." -ForegroundColor Yellow

$envContent = @"
# ViWorkS Admin Panel Backend Configuration

# Server Configuration
HOST=127.0.0.1
PORT=8080

# Database Configuration
DATABASE_URL=postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:$DB_PORT/$DB_NAME

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Security Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-at-least-32-characters-long
JWT_EXPIRATION=3600
BCRYPT_COST=12

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Logging Configuration
LOG_LEVEL=info
RUST_LOG=info

# Admin Panel Configuration
ADMIN_PANEL_URL=http://localhost:3000
API_BASE_URL=http://localhost:8080

# ViWorkS Integration
VIWORKS_API_URL=https://viworks.ir/api
VIWORKS_API_KEY=your-viworks-api-key-here

# Development Configuration
ENVIRONMENT=development
DEBUG=true
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8
Write-Host "✅ .env file created successfully!" -ForegroundColor Green

# Run migrations
Write-Host "Running database migrations..." -ForegroundColor Yellow

# Set environment variable for SQLx
$env:DATABASE_URL = "postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:$DB_PORT/$DB_NAME"

# Run migrations
cargo sqlx migrate run

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database migrations completed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Database migrations failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Database setup completed successfully!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Database URL: postgresql://$DB_USER@$DB_HOST`:$DB_PORT/$DB_NAME" -ForegroundColor White
Write-Host "Default admin user: admin / admin123" -ForegroundColor Yellow
Write-Host "Remember to change the default password!" -ForegroundColor Red
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start the backend server: cargo run" -ForegroundColor White
Write-Host "2. Start the frontend server: cd ../frontend && npm run dev" -ForegroundColor White
Write-Host "3. Access the admin panel at: http://localhost:3000" -ForegroundColor White
