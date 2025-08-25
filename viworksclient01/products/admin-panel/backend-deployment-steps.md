# Backend Deployment Steps

## Go to Arvan Cloud Dashboard
1. Navigate to: **Container** → **Create Application** (ساخت اپلیکیشن)

## Application Configuration
- **Application Name**: `viworks-backend`
- **Image**: `registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-backend:v1`

## Port Configuration
- **Application Port**: `8081`
- **Exposed Port**: `80`
- **Access Address**: `viworks-backend:80`

## Environment Variables
Add these environment variables:
```
DATABASE_URL=postgresql://admin:secure_password_production@viworks-postgres-service:5432/viworks_admin
REDIS_URL=redis://viworks-redis-service:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=production
LOG_LEVEL=info
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
CORS_ORIGIN=http://viworks-backend-ea209f2500-viworks.apps.ir-central1.arvancaas.ir
ADMIN_PANEL_URL=http://viworks-backend-ea209f2500-viworks.apps.ir-central1.arvancaas.ir
```

## Domain Configuration
- **Choose**: "زیردامنه رایگان آروان کلاد" (Free Arvan Cloud Subdomain)
- **Domain**: Will be `viworks-backend-ea209f2500-viworks.apps.ir-central1.arvancaas.ir`

## Deploy
Click "Create Application" or "ساخت اپلیکیشن"

## Note
Wait for this to be fully deployed before deploying the frontend.
