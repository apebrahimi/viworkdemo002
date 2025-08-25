# Frontend Dashboard Deployment Configuration

## Application Details
- **Application Name**: `viworks-frontend`
- **Image**: `<your-registry-url>/viworks-frontend:v1`
- **Port Configuration**:
  - Application Port: `3000`
  - Exposed Port: `80`
  - Access Address: `viworks-frontend:80`

## Environment Variables
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://viworks-backend-<your-project-id>-viworks.apps.ir-central1.arvancaas.ir
NEXT_PUBLIC_WS_URL=ws://viworks-backend-<your-project-id>-viworks.apps.ir-central1.arvancaas.ir
```

## Domain Configuration
- **Choose**: "زیردامنه رایگان آروان کلاد" (Free Arvan Cloud Subdomain)
- **Domain**: `viworks-frontend-<your-project-id>-viworks.apps.ir-central1.arvancaas.ir`

## Network Configuration
- **Protocol**: TCP
- **Internal Access**: `viworks-frontend:80`

## Notes
- Replace `<your-registry-url>` with your actual Arvan Cloud registry URL
- Replace `<your-project-id>` with your actual project ID
- The frontend will be accessible at the generated domain
- Make sure the backend is deployed first so the API URLs are correct
