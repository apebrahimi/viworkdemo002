# Backend Dashboard Deployment Configuration

## Application Details
- **Application Name**: `viworks-backend`
- **Image**: `<your-registry-url>/viworks-backend:v1`
- **Port Configuration**:
  - Application Port: `8081`
  - Exposed Port: `80`
  - Access Address: `viworks-backend:80`

## Environment Variables
```
DATABASE_URL=postgresql://admin:secure_password_production@viworks-postgres-service:5432/viworks_admin
REDIS_URL=redis://viworks-redis-service:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=production
LOG_LEVEL=info
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
CORS_ORIGIN=http://viworks-backend-<your-project-id>-viworks.apps.ir-central1.arvancaas.ir
ADMIN_PANEL_URL=http://viworks-backend-<your-project-id>-viworks.apps.ir-central1.arvancaas.ir
```

## Domain Configuration
- **Choose**: "زیردامنه رایگان آروان کلاد" (Free Arvan Cloud Subdomain)
- **Domain**: `viworks-backend-<your-project-id>-viworks.apps.ir-central1.arvancaas.ir`

## Network Configuration
- **Protocol**: TCP
- **Internal Access**: `viworks-backend:80`

## Notes
- Replace `<your-registry-url>` with your actual Arvan Cloud registry URL
- Replace `<your-project-id>` with your actual project ID
- The backend will be accessible at the generated domain
