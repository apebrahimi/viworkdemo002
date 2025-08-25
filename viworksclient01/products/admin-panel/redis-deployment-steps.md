# Redis Deployment Steps

## Go to Arvan Cloud Dashboard
1. Navigate to: **Container** → **Create Application** (ساخت اپلیکیشن)

## Application Configuration
- **Application Name**: `viworks-redis`
- **Image**: `redis:7-alpine`

## Port Configuration
- **Application Port**: `6379`
- **Exposed Port**: `6379`
- **Access Address**: `viworks-redis-service:6379`

## Environment Variables
No environment variables needed for basic Redis setup.

## Storage Configuration
- **Disk Size**: 5GB
- **Mount Path**: `/data`

## Domain Configuration
- **Choose**: "بدون دامنه" (No Domain) - This is an internal service

## Deploy
Click "Create Application" or "ساخت اپلیکیشن"
