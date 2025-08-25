# ViWorkS Admin Panel - Development Setup Script
# This script automates the setup of the admin panel development environment

param(
    [switch]$SkipDocker,
    [switch]$SkipFrontend,
    [switch]$SkipBackend,
    [string]$ProjectName = "viworks-admin-panel"
)

Write-Host "🚀 ViWorkS Admin Panel - Development Setup" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check prerequisites
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

# Check if Docker is installed
if (-not $SkipDocker) {
    try {
        $dockerVersion = docker --version
        Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Docker not found. Please install Docker Desktop first." -ForegroundColor Red
        Write-Host "   Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Cyan
        exit 1
    }
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js not found. Please install Node.js 20.x LTS first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Cyan
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ npm not found. Please install npm first." -ForegroundColor Red
    exit 1
}

# Create project directory
Write-Host "`n🏗️ Creating project structure..." -ForegroundColor Yellow

if (Test-Path $ProjectName) {
    Write-Host "⚠️  Project directory already exists. Removing..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $ProjectName
}

New-Item -ItemType Directory -Path $ProjectName | Out-Null
Set-Location $ProjectName

# Create project structure
$directories = @(
    "frontend",
    "backend",
    "backend/src",
    "backend/src/controllers",
    "backend/src/middleware",
    "backend/src/models",
    "backend/src/routes",
    "backend/src/services",
    "backend/src/utils",
    "backend/src/types",
    "backend/src/__tests__",
    "backend/prisma",
    "backend/logs",
    "scripts"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "📁 Created: $dir" -ForegroundColor Cyan
}

# Create Docker Compose file
Write-Host "`n🐳 Creating Docker Compose configuration..." -ForegroundColor Yellow

$dockerCompose = @"
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: viworks-admin-postgres
    environment:
      POSTGRES_DB: viworks_admin
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secure_password_dev
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --lc-collate=C --lc-ctype=C"
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - viworks-admin-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d viworks_admin"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: viworks-admin-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - viworks-admin-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # pgAdmin (Database Management)
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: viworks-admin-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@viworks.com
      PGADMIN_DEFAULT_PASSWORD: admin123
      PGADMIN_CONFIG_SERVER_MODE: 'False'
    ports:
      - "5050:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    depends_on:
      - postgres
    networks:
      - viworks-admin-network

volumes:
  postgres_data:
  redis_data:
  pgadmin_data:

networks:
  viworks-admin-network:
    driver: bridge
"@

$dockerCompose | Out-File -FilePath "docker-compose.yml" -Encoding UTF8
Write-Host "✅ Created: docker-compose.yml" -ForegroundColor Green

# Create environment file
Write-Host "`n🔐 Creating environment configuration..." -ForegroundColor Yellow

$envFile = @"
# Database
DATABASE_URL="postgresql://admin:secure_password_dev@localhost:5432/viworks_admin"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="24h"

# Admin Panel
ADMIN_PANEL_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3000"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Security
BCRYPT_ROUNDS="12"
RATE_LIMIT_WINDOW="900000"
RATE_LIMIT_MAX="100"

# Logging
LOG_LEVEL="info"
LOG_FILE="logs/app.log"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:8080"
NEXT_PUBLIC_WS_URL="ws://localhost:8080"
"@

$envFile | Out-File -FilePath ".env.example" -Encoding UTF8
Write-Host "✅ Created: .env.example" -ForegroundColor Green

# Create .env file
Copy-Item ".env.example" ".env"
Write-Host "✅ Created: .env" -ForegroundColor Green

# Create .gitignore
Write-Host "`n📝 Creating .gitignore..." -ForegroundColor Yellow

$gitignore = @"
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
.next/
out/

# Logs
logs/
*.log

# Database
*.db
*.sqlite

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Docker
.dockerignore

# Testing
coverage/
.nyc_output/

# Temporary files
*.tmp
*.temp
"@

$gitignore | Out-File -FilePath ".gitignore" -Encoding UTF8
Write-Host "✅ Created: .gitignore" -ForegroundColor Green

# Start Docker services
if (-not $SkipDocker) {
    Write-Host "`n🐳 Starting Docker services..." -ForegroundColor Yellow
    docker-compose up -d
    
    Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Check if services are running
    $postgresRunning = docker ps --filter "name=viworks-admin-postgres" --format "table {{.Names}}" | Select-String "viworks-admin-postgres"
    $redisRunning = docker ps --filter "name=viworks-admin-redis" --format "table {{.Names}}" | Select-String "viworks-admin-redis"
    
    if ($postgresRunning -and $redisRunning) {
        Write-Host "✅ Docker services are running" -ForegroundColor Green
    } else {
        Write-Host "❌ Some Docker services failed to start" -ForegroundColor Red
        Write-Host "   Check with: docker-compose logs" -ForegroundColor Cyan
    }
}

# Setup Frontend
if (-not $SkipFrontend) {
    Write-Host "`n🎨 Setting up Next.js frontend..." -ForegroundColor Yellow
    Set-Location frontend
    
    # Initialize Next.js project
    npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
    
    # Install additional dependencies
    Write-Host "📦 Installing additional frontend dependencies..." -ForegroundColor Yellow
    npm install @headlessui/react @heroicons/react
    npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs
    npm install framer-motion zustand @tanstack/react-query swr
    npm install next-auth clsx tailwind-merge recharts date-fns
    npm install zod react-hook-form @hookform/resolvers
    
    Write-Host "✅ Frontend setup completed" -ForegroundColor Green
    Set-Location ..
}

# Setup Backend
if (-not $SkipBackend) {
    Write-Host "`n🔧 Setting up Node.js backend..." -ForegroundColor Yellow
    Set-Location backend
    
    # Initialize package.json
    npm init -y
    
    # Install dependencies
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    npm install express cors helmet morgan dotenv
    npm install @prisma/client prisma
    npm install bcryptjs jsonwebtoken express-rate-limit express-validator
    npm install winston winston-daily-rotate-file redis bull
    npm install socket.io multer sharp nodemailer crypto-js
    
    # Install dev dependencies
    npm install -D typescript @types/node @types/express
    npm install -D @types/cors @types/bcryptjs @types/jsonwebtoken
    npm install -D @types/multer @types/nodemailer ts-node nodemon
    npm install -D jest @types/jest ts-jest supertest @types/supertest
    
    Write-Host "✅ Backend setup completed" -ForegroundColor Green
    Set-Location ..
}

# Create README
Write-Host "`n📖 Creating README..." -ForegroundColor Yellow

$readme = @"
# ViWorkS Admin Panel

Enterprise-grade administrative interface for ViWorkS VPN infrastructure.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20.x LTS
- npm or yarn

### Development Setup

1. **Start Docker services:**
   ```bash
   docker-compose up -d
   ```

2. **Setup environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Initialize database:**
   ```bash
   cd backend
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Start development servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - pgAdmin: http://localhost:5050

## 📚 Documentation

- [Architecture Plan](ADMIN_PANEL_ARCHITECTURE_PLAN.md)
- [Client Integration Protocol](CLIENT_INTEGRATION_PROTOCOL.md)
- [Development Setup](ADMIN_PANEL_DEVELOPMENT_SETUP.md)

## 🔐 Security

This admin panel implements enterprise-grade security features:
- Zero-knowledge architecture
- mTLS communication
- Role-based access control (RBAC)
- Multi-factor authentication (MFA)
- Immutable audit trails

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express and TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Real-time**: WebSocket with Socket.io
- **Security**: JWT, bcrypt, rate limiting

## 📊 Features

- User management (Admin & VPN users)
- Session monitoring and control
- Policy management
- Security monitoring and alerts
- Real-time dashboard
- Audit logging
- SIEM integration
- Compliance reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.
"@

$readme | Out-File -FilePath "README.md" -Encoding UTF8
Write-Host "✅ Created: README.md" -ForegroundColor Green

# Final instructions
Write-Host "`n🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Review and edit .env file with your configuration" -ForegroundColor Cyan
Write-Host "2. Start Docker services: docker-compose up -d" -ForegroundColor Cyan
Write-Host "3. Initialize database: cd backend; npm run db:generate; npm run db:push" -ForegroundColor Cyan
Write-Host "4. Start development servers:" -ForegroundColor Cyan
Write-Host "   - Backend: cd backend; npm run dev" -ForegroundColor Cyan
Write-Host "   - Frontend: cd frontend; npm run dev" -ForegroundColor Cyan

Write-Host "`n🌐 Access URLs:" -ForegroundColor Yellow
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "- Backend API: http://localhost:8080" -ForegroundColor Cyan
Write-Host "- pgAdmin: http://localhost:5050 (admin@viworks.com / admin123)" -ForegroundColor Cyan

Write-Host "`n📚 Documentation:" -ForegroundColor Yellow
Write-Host "- Architecture Plan: ADMIN_PANEL_ARCHITECTURE_PLAN.md" -ForegroundColor Cyan
Write-Host "- Client Integration: CLIENT_INTEGRATION_PROTOCOL.md" -ForegroundColor Cyan
Write-Host "- Development Setup: ADMIN_PANEL_DEVELOPMENT_SETUP.md" -ForegroundColor Cyan

Write-Host "`n🚀 Happy coding!" -ForegroundColor Green
