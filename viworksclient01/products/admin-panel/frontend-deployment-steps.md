# Frontend Deployment Steps

## Go to Arvan Cloud Dashboard
1. Navigate to: **Container** → **Create Application** (ساخت اپلیکیشن)

## Application Configuration
- **Application Name**: `viworks-frontend`
- **Image**: `registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-frontend:v1`

## Port Configuration
- **Application Port**: `3000`
- **Exposed Port**: `80`
- **Access Address**: `viworks-frontend:80`

## Environment Variables
Add these environment variables:
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://viworks-backend-ea209f2500-viworks.apps.ir-central1.arvancaas.ir
NEXT_PUBLIC_WS_URL=ws://viworks-backend-ea209f2500-viworks.apps.ir-central1.arvancaas.ir
```

## Domain Configuration
- **Choose**: "زیردامنه رایگان آروان کلاد" (Free Arvan Cloud Subdomain)
- **Domain**: Will be `viworks-frontend-ea209f2500-viworks.apps.ir-central1.arvancaas.ir`

## Deploy
Click "Create Application" or "ساخت اپلیکیشن"

## Note
Make sure the backend is fully deployed and accessible before deploying the frontend.
