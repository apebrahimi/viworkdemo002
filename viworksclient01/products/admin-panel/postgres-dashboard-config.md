# PostgreSQL Dashboard Deployment Configuration

## Application Details
- **Application Name**: `viworks-postgres`
- **Image**: `postgres:15-alpine`
- **Port Configuration**:
  - Application Port: `5432`
  - Exposed Port: `5432`
  - Access Address: `viworks-postgres-service:5432`

## Environment Variables
```
POSTGRES_DB=viworks_admin
POSTGRES_USER=admin
POSTGRES_PASSWORD=secure_password_production
```

## Storage Configuration
- **Disk Size**: 10GB
- **Mount Path**: `/var/lib/postgresql/data`

## Network Configuration
- **Protocol**: TCP
- **Internal Access**: `viworks-postgres-service:5432`

## Notes
- No domain needed (internal service only)
- Use "بدون دامنه" (No Domain) option
