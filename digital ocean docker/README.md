# ViWorks Clean Docker Setup

This is a clean, organized setup for the ViWorks platform with all necessary files for deployment.

## Structure

```
digital ocean docker/
├── frontend/          # Next.js frontend application
├── backend/           # Rust backend with WebSocket support
├── nginx/            # Nginx configuration for reverse proxy
├── docker-compose.yml # Main orchestration file
├── env.production    # Environment variables
└── README.md         # This file
```

## Services

- **Frontend**: Next.js application running on port 3000
- **Backend**: Rust API with WebSocket support running on port 8081
- **PostgreSQL**: Database running on port 5432
- **Redis**: Cache running on port 6379
- **Nginx**: Reverse proxy (host-level, not containerized)

## Features

- ✅ WebSocket support for real-time communication
- ✅ JSON health endpoints
- ✅ CORS configured for all subdomains
- ✅ SSL/TLS support via Nginx
- ✅ Database and cache services
- ✅ Clean, organized structure

## Deployment

1. Copy this entire folder to your DigitalOcean droplet
2. Run `docker-compose up -d` to start all services
3. Configure Nginx on the host for SSL and subdomain routing
4. Access the application at your configured subdomains

## Subdomains

- `viworks.neuratalent.com` - Main application
- `admin-viworks.neuratalent.com` - Admin panel
- `api-viworks.neuratalent.com` - API endpoints
- `app-viworks.neuratalent.com` - Frontend application
