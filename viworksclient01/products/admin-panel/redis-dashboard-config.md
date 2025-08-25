# Redis Dashboard Deployment Configuration

## Application Details
- **Application Name**: `viworks-redis`
- **Image**: `redis:7-alpine`
- **Port Configuration**:
  - Application Port: `6379`
  - Exposed Port: `6379`
  - Access Address: `viworks-redis-service:6379`

## Environment Variables
```
# No environment variables needed for basic Redis setup
```

## Storage Configuration
- **Disk Size**: 5GB
- **Mount Path**: `/data`

## Network Configuration
- **Protocol**: TCP
- **Internal Access**: `viworks-redis-service:6379`

## Notes
- No domain needed (internal service only)
- Use "بدون دامنه" (No Domain) option
