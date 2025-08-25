# PostgreSQL Deployment Steps

## Go to Arvan Cloud Dashboard
1. Navigate to: **Container** → **Create Application** (ساخت اپلیکیشن)

## Application Configuration
- **Application Name**: `viworks-postgres`
- **Image**: `postgres:15-alpine`

## Port Configuration
- **Application Port**: `5432`
- **Exposed Port**: `5432`
- **Access Address**: `viworks-postgres-service:5432`

## Environment Variables
Add these environment variables:
```
POSTGRES_DB=viworks_admin
POSTGRES_USER=admin
POSTGRES_PASSWORD=secure_password_production
```

## Storage Configuration
- **Disk Size**: 10GB
- **Mount Path**: `/var/lib/postgresql/data`

## Domain Configuration
- **Choose**: "بدون دامنه" (No Domain) - This is an internal service

## Deploy
Click "Create Application" or "ساخت اپلیکیشن"
