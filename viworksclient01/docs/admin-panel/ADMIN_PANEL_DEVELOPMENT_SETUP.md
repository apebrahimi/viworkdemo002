# 🚀 ViWorkS Admin Panel - Development Setup Guide

## 📋 **PREREQUISITES**

### **Required Software**
- **Docker & Docker Compose** (v20.10+)
- **Node.js** (v20.x LTS)
- **npm** or **yarn** package manager
- **Git** for version control
- **PostgreSQL** (for local development)
- **Redis** (for caching and sessions)

### **Development Environment**
- **VS Code** (recommended)
- **Postman** or **Insomnia** (API testing)
- **pgAdmin** or **DBeaver** (database management)

---

## 🏗️ **PROJECT STRUCTURE**

```
viworks-admin-panel/
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React Components
│   │   ├── lib/            # Utilities
│   │   ├── hooks/          # Custom Hooks
│   │   ├── stores/         # State Management
│   │   └── types/          # TypeScript Types
│   ├── public/             # Static Assets
│   ├── package.json
│   └── next.config.js
├── backend/                 # Node.js API Server
│   ├── src/
│   │   ├── controllers/    # Route Controllers
│   │   ├── middleware/     # Express Middleware
│   │   ├── models/         # Database Models
│   │   ├── routes/         # API Routes
│   │   ├── services/       # Business Logic
│   │   ├── utils/          # Utilities
│   │   └── types/          # TypeScript Types
│   ├── prisma/             # Database Schema
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml       # Development Environment
├── docker-compose.prod.yml  # Production Environment
├── .env.example            # Environment Variables
├── .gitignore
└── README.md
```

---

## 🐳 **DOCKER COMPOSE SETUP**

### **Development Environment**
```yaml
# docker-compose.yml
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
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
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

  # Backend API Server
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: viworks-admin-backend
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://admin:secure_password_dev@postgres:5432/viworks_admin
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-super-secret-jwt-key-dev
      - ADMIN_PANEL_URL=http://localhost:3000
      - CORS_ORIGIN=http://localhost:3000
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - viworks-admin-network
    restart: unless-stopped

  # Frontend Next.js App
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: viworks-admin-frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:8080
      - NEXT_PUBLIC_WS_URL=ws://localhost:8080
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - viworks-admin-network
    restart: unless-stopped

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
```

---

## 🎨 **FRONTEND SETUP (Next.js)**

### **1. Create Next.js Project**
```bash
# Create frontend directory
mkdir frontend
cd frontend

# Initialize Next.js with TypeScript
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install additional dependencies
npm install @headlessui/react @heroicons/react
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs
npm install framer-motion
npm install zustand
npm install @tanstack/react-query
npm install swr
npm install next-auth
npm install @types/node @types/react @types/react-dom
npm install clsx tailwind-merge
npm install recharts
npm install date-fns
npm install zod
npm install react-hook-form @hookform/resolvers
```

### **2. Frontend Configuration**
```typescript
// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### **3. Tailwind CSS Configuration**
```javascript
// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### **4. Base Components Setup**
```typescript
// frontend/src/components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

---

## 🔧 **BACKEND SETUP (Node.js/TypeScript)**

### **1. Initialize Backend Project**
```bash
# Create backend directory
mkdir backend
cd backend

# Initialize package.json
npm init -y

# Install dependencies
npm install express cors helmet morgan dotenv
npm install @prisma/client prisma
npm install bcryptjs jsonwebtoken
npm install express-rate-limit express-validator
npm install winston winston-daily-rotate-file
npm install redis bull
npm install socket.io
npm install multer sharp
npm install nodemailer
npm install crypto-js

# Development dependencies
npm install -D typescript @types/node @types/express
npm install -D @types/cors @types/bcryptjs @types/jsonwebtoken
npm install -D @types/multer @types/nodemailer
npm install -D ts-node nodemon
npm install -D jest @types/jest ts-jest
npm install -D supertest @types/supertest
```

### **2. TypeScript Configuration**
```json
// backend/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts"
  ]
}
```

### **3. Prisma Database Schema**
```prisma
// backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model AdminUser {
  id            String   @id @default(cuid())
  username      String   @unique
  email         String   @unique
  passwordHash  String
  role          AdminRole
  status        UserStatus @default(ACTIVE)
  mfaEnabled    Boolean  @default(false)
  mfaSecret     String?
  mfaMethod     String?
  groups        String[]
  lastLogin     DateTime?
  failedAttempts Int     @default(0)
  lockedUntil   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  auditEvents   AuditEvent[]
  sessions      Session[]

  @@map("admin_users")
}

model VpnUser {
  id                    String        @id @default(cuid())
  username              String        @unique
  email                 String?
  status                VpnUserStatus @default(ACTIVE)
  policyId              String?
  groups                String[]
  concurrentSessionsLimit Int         @default(1)
  idleTimeoutMinutes    Int           @default(30)
  lastActivity          DateTime?
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  sessions              Session[]
  auditEvents           AuditEvent[]

  @@map("vpn_users")
}

model Session {
  id                String        @id @default(cuid())
  userId            String
  username          String
  nodeId            String
  clientIp          String
  internalIp        String?
  status            SessionStatus @default(ACTIVE)
  startedAt         DateTime      @default(now())
  lastActivity      DateTime      @default(now())
  clientVersion     String
  userAgent         String
  terminationReason String?
  adminUserId       String?
  vpnUserId         String?

  adminUser         AdminUser?    @relation(fields: [adminUserId], references: [id])
  vpnUser           VpnUser?      @relation(fields: [vpnUserId], references: [id])

  @@map("sessions")
}

model Policy {
  id          String     @id @default(cuid())
  name        String
  description String
  policyType  PolicyType
  rules       Json
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("policies")
}

model Node {
  id              String     @id @default(cuid())
  name            String
  hostname        String
  ipAddress       String
  status          NodeStatus @default(HEALTHY)
  maxSessions     Int        @default(100)
  currentSessions Int        @default(0)
  cpuUsage        Float      @default(0)
  memoryUsage     Float      @default(0)
  diskUsage       Float      @default(0)
  version         String
  lastHealthCheck DateTime   @default(now())
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt

  @@map("nodes")
}

model AuditEvent {
  id            String      @id @default(cuid())
  timestamp     DateTime    @default(now())
  actorId       String
  actorUsername String
  action        String
  targetType    String
  targetId      String?
  details       Json
  ipAddress     String
  userAgent     String
  result        AuditResult @default(SUCCESS)
  hashChainPrev String?

  adminUserId   String?
  vpnUserId     String?

  adminUser     AdminUser?  @relation(fields: [adminUserId], references: [id])
  vpnUser       VpnUser?    @relation(fields: [vpnUserId], references: [id])

  @@map("audit_events")
}

model SecurityAlert {
  id          String           @id @default(cuid())
  title       String
  description String
  severity    SecuritySeverity
  status      AlertStatus      @default(ACTIVE)
  eventType   String
  source      String
  timestamp   DateTime         @default(now())
  acknowledgedAt DateTime?
  resolvedAt  DateTime?
  metadata    Json
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  @@map("security_alerts")
}

model ApiKey {
  id          String   @id @default(cuid())
  name        String
  key         String   @unique
  permissions String[]
  expiresAt   DateTime?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("api_keys")
}

enum AdminRole {
  OWNER
  ORG_ADMIN
  SECURITY_ADMIN
  SECURITY_ANALYST
  HELPDESK
  AUDITOR
  API_SERVICE
}

enum UserStatus {
  ACTIVE
  LOCKED
  DISABLED
  PENDING_MFA
}

enum VpnUserStatus {
  ACTIVE
  SUSPENDED
  REVOKED
  EXPIRED
}

enum SessionStatus {
  ACTIVE
  DISCONNECTED
  TERMINATED
  QUARANTINED
}

enum PolicyType {
  TIME_BASED
  GEO_BASED
  IP_BASED
  DEVICE_BASED
  CONCURRENT
  IDLE_TIMEOUT
}

enum NodeStatus {
  HEALTHY
  WARNING
  CRITICAL
  OFFLINE
  MAINTENANCE
}

enum AuditResult {
  SUCCESS
  FAILURE
  PARTIAL
}

enum SecuritySeverity {
  INFO
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum AlertStatus {
  ACTIVE
  ACKNOWLEDGED
  RESOLVED
}
```

### **4. Express Server Setup**
```typescript
// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { sessionRoutes } from './routes/sessions';
import { policyRoutes } from './routes/policies';
import { nodeRoutes } from './routes/nodes';
import { securityRoutes } from './routes/security';
import { auditRoutes } from './routes/audit';
import { clientRoutes } from './routes/clients';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/sessions', sessionRoutes);
app.use('/api/v1/policies', policyRoutes);
app.use('/api/v1/nodes', nodeRoutes);
app.use('/api/v1/security', securityRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/clients', clientRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-admin', (data) => {
    socket.join('admin-room');
    console.log('Admin joined room');
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling
app.use(errorHandler);

export { app, server, io };
```

---

## 🚀 **STARTUP SCRIPTS**

### **1. Package.json Scripts**
```json
// backend/package.json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "ts-node src/scripts/seed.ts"
  }
}
```

### **2. Development Startup**
```bash
# Clone the repository
git clone <repository-url>
cd viworks-admin-panel

# Copy environment variables
cp .env.example .env

# Start development environment
docker-compose up -d

# Initialize database
docker-compose exec backend npm run db:generate
docker-compose exec backend npm run db:push
docker-compose exec backend npm run db:seed

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Start development servers
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## 🔐 **ENVIRONMENT VARIABLES**

### **Environment Configuration**
```bash
# .env.example
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
```

---

## 📊 **MONITORING & LOGGING**

### **Winston Logger Configuration**
```typescript
// backend/src/utils/logger.ts
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
```

---

## 🧪 **TESTING SETUP**

### **Jest Configuration**
```javascript
// backend/jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
```

### **Sample Test**
```typescript
// backend/src/__tests__/auth.test.ts
import request from 'supertest';
import { app } from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Routes', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.adminUser.deleteMany();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      // Create test user
      const testUser = await prisma.adminUser.create({
        data: {
          username: 'testadmin',
          email: 'test@example.com',
          passwordHash: '$2b$12$hashedpassword',
          role: 'OWNER'
        }
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'testadmin',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });
});
```

---

## 🎯 **NEXT STEPS**

1. **Set up the development environment** using Docker Compose
2. **Initialize the database** with Prisma schema
3. **Create basic authentication** system
4. **Implement user management** features
5. **Add session monitoring** capabilities
6. **Create the dashboard** UI components
7. **Implement real-time** WebSocket updates
8. **Add security monitoring** features

---

This setup provides a **complete development environment** for the ViWorkS admin panel with all necessary tools, configurations, and best practices for building a secure, scalable enterprise application.
