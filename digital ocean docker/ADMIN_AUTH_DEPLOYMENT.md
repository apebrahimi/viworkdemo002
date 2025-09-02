# Admin Authentication Deployment Guide

## Overview
This guide explains how to deploy the new simple admin authentication system that replaces the complex user authentication for the admin panel.

## What Changed
- **Admin Panel Auth**: Now uses simple username/password from environment variables
- **Client VPN Auth**: Remains unchanged - still uses backend API at `/api/v1/auth/*`
- **No Backend Changes**: All authentication is handled in the Next.js frontend
- **Cookie-Based**: Uses HttpOnly cookies instead of localStorage tokens

## Deployment Steps

### 1. Set Environment Variables

Copy the example environment file and update credentials:
```bash
cp env.admin.example env.production
```

Edit `env.production` and set secure credentials:
```env
ADMIN_USERNAME=your-secure-username
ADMIN_PASSWORD=your-secure-password-here
ADMIN_SESSION_TTL_SECONDS=28800  # 8 hours
```

### 2. Build and Deploy

```bash
# Build the frontend with new auth
docker-compose build frontend

# Deploy all services
docker-compose up -d

# Check logs
docker-compose logs -f frontend
```

### 3. Test Admin Authentication

1. Navigate to https://admin-viworks.neuratalent.com
2. You should be redirected to `/login`
3. Enter the credentials from `ADMIN_USERNAME` and `ADMIN_PASSWORD`
4. On successful login, you'll be redirected to the admin dashboard
5. The logout button in the header should clear the session

### 4. Verify Client Auth Still Works

The VPN client authentication API should continue working unchanged:
- Endpoint: https://api-viworks.neuratalent.com/api/v1/auth/login
- This uses the backend database and JWT tokens
- Mobile apps and desktop clients use this API

## Security Notes

1. **Change Default Credentials**: Never use default passwords in production
2. **HTTPS Only**: Admin auth cookies are marked as Secure in production
3. **HttpOnly Cookies**: Prevents XSS attacks from accessing session cookies
4. **Path Scoping**: Admin session is scoped to the admin panel only
5. **No Database**: Admin credentials are not stored in database, only in environment

## Rollback Plan

If you need to rollback to the old authentication:

1. Restore the old `AuthContext.tsx` from git
2. Remove `AdminAuthContext.tsx`
3. Remove `src/middleware.ts`
4. Remove `/api/admin/*` routes
5. Rebuild and redeploy

```bash
git checkout main -- frontend/src/contexts/AuthContext.tsx
rm frontend/src/contexts/AdminAuthContext.tsx
rm frontend/src/middleware.ts
rm -rf frontend/src/app/api/admin
docker-compose build frontend
docker-compose up -d frontend
```

## Troubleshooting

### Issue: Cannot login with correct credentials
- Check environment variables are set correctly
- Verify frontend container has access to env vars: `docker exec viworks-frontend env | grep ADMIN`
- Check browser console for errors

### Issue: Logged out immediately after login
- Check cookie settings in browser
- Ensure HTTPS is working properly
- Verify `NODE_ENV=production` is set

### Issue: Client VPN auth not working
- This change should NOT affect client auth
- Check backend is running: `docker-compose ps backend`
- Verify API endpoint: https://api-viworks.neuratalent.com/health

## Support

For issues, check:
1. Frontend logs: `docker-compose logs frontend`
2. Browser DevTools Network tab
3. Cookie storage in browser DevTools
