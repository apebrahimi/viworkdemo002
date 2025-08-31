# Settings Page - User Type Management

## Overview

The Settings page provides comprehensive user type management functionality for the ViWorkS admin panel. It allows administrators to define different user types with specific access controls, time restrictions, location limitations, and resource permissions.

## Features

### 1. User Type Management
- **Create/Edit User Types**: Define custom user types with specific characteristics
- **Visual Color Coding**: Each user type has a unique color for easy identification
- **Status Management**: Enable/disable user types as needed
- **Comprehensive Details**: View all settings and restrictions for each user type

### 2. Access Control Components

#### Time Intervals
- Define when users can access the system
- Set specific hours and days of the week
- Multiple time intervals per user type
- Active/inactive status for each interval

#### Location Restrictions
- **Country-based**: Restrict access by country
- **Region/State**: Limit access to specific regions
- **City-based**: Restrict to specific cities
- **IP Range**: Define allowed IP ranges
- **Coordinates**: Geographic coordinate restrictions
- **Allow/Block Logic**: Whitelist or blacklist approach

#### Resource Access
- **Server Access**: Control access to different servers
- **Database Access**: Manage database permissions
- **API Access**: Control API endpoint access
- **File Access**: Manage file system permissions
- **Network Access**: Control network resource access
- **Permission Levels**: Read, Write, Delete, Execute, Admin

### 3. Security Settings
- **Mobile Verification**: Require mobile app verification
- **Session Limits**: Maximum concurrent sessions per user
- **Session Timeout**: Automatic session expiration
- **Password Policies**: Comprehensive password requirements

### 4. Global Settings
- **Default Session Timeout**: System-wide session duration
- **Login Attempt Limits**: Maximum failed login attempts
- **Account Lockout**: Automatic account lockout duration
- **Password Policy**: Global password requirements

## Component Structure

```
src/
├── types/
│   └── settings.ts                 # TypeScript interfaces
├── components/
│   └── settings/
│       ├── TimeIntervalForm.tsx    # Time restriction management
│       ├── LocationRestrictionForm.tsx # Location control
│       ├── ResourceAccessForm.tsx  # Resource permissions
│       ├── UserTypeForm.tsx        # Main user type form
│       ├── UserTypeList.tsx        # User type overview
│       └── GlobalSettingsForm.tsx  # System-wide settings
└── components/sections/
    └── SettingsSection.tsx         # Main settings page
```

## Usage

### Accessing the Settings Page
1. Navigate to the admin panel
2. Click on "Settings" in the sidebar navigation
3. Choose between "User Types" or "Global Settings"

### Creating a New User Type
1. Go to Settings → User Types
2. Click "Create User Type"
3. Fill in basic information:
   - Name and description
   - Color selection
   - Active status
4. Configure security settings:
   - Mobile verification requirement
   - Session limits and timeout
5. Set up access controls:
   - Time intervals
   - Location restrictions
   - Resource access permissions
6. Click "Save User Type"

### Managing Existing User Types
- **View Details**: Click the eye icon to see all settings
- **Edit**: Click the edit icon to modify settings
- **Delete**: Click the trash icon to remove (with confirmation)
- **Toggle Status**: Use the switch to enable/disable

### Global Settings
1. Go to Settings → Global Settings
2. Configure session settings
3. Set security parameters
4. Define password policies
5. Click "Save Settings"

## Data Structure

### UserType Interface
```typescript
interface UserType {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  requiresMobileVerification: boolean;
  maxConcurrentSessions: number;
  sessionTimeout: number;
  timeIntervals: TimeInterval[];
  locationRestrictions: LocationRestriction[];
  resourceAccess: ResourceAccess[];
  createdAt: string;
  updatedAt: string;
}
```

### TimeInterval Interface
```typescript
interface TimeInterval {
  id: string;
  name: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  isActive: boolean;
}
```

### LocationRestriction Interface
```typescript
interface LocationRestriction {
  id: string;
  name: string;
  type: 'country' | 'region' | 'city' | 'ip_range' | 'coordinates';
  value: string;
  isAllowed: boolean; // true = whitelist, false = blacklist
  isActive: boolean;
}
```

### ResourceAccess Interface
```typescript
interface ResourceAccess {
  id: string;
  name: string;
  type: 'server' | 'database' | 'api' | 'file' | 'network';
  resourceId: string;
  permissions: string[]; // ['read', 'write', 'delete', 'execute', 'admin']
  isActive: boolean;
}
```

## Security Features

### Access Control
- **Time-based**: Restrict access to specific hours and days
- **Location-based**: Geographic and IP-based restrictions
- **Resource-based**: Granular permission control
- **Session-based**: Concurrent session limits and timeouts

### Authentication
- **Mobile Verification**: Optional mobile app verification requirement
- **Password Policies**: Configurable password strength requirements
- **Account Lockout**: Automatic lockout after failed attempts
- **Session Management**: Configurable session timeouts

## Best Practices

### User Type Design
1. **Start with Defaults**: Use the provided default user types as templates
2. **Principle of Least Privilege**: Grant only necessary permissions
3. **Regular Review**: Periodically review and update user type permissions
4. **Documentation**: Maintain clear descriptions for each user type

### Security Configuration
1. **Strong Passwords**: Enable comprehensive password policies
2. **Session Limits**: Set reasonable session timeouts
3. **Location Restrictions**: Use geographic restrictions when appropriate
4. **Mobile Verification**: Enable for high-privilege accounts

### Maintenance
1. **Regular Audits**: Review access controls periodically
2. **Update Policies**: Keep security policies current
3. **Monitor Usage**: Track user type usage and effectiveness
4. **Backup Settings**: Export settings for backup purposes

## Integration

The settings page integrates with the existing admin panel architecture:
- Uses existing UI components (Card, Button, Input, etc.)
- Follows the established design patterns
- Integrates with the sidebar navigation
- Maintains consistent styling and theming

## Future Enhancements

Potential improvements for future versions:
- **Bulk Operations**: Import/export user type configurations
- **Advanced Scheduling**: More complex time-based rules
- **Audit Logging**: Track changes to user types and settings
- **Template System**: Pre-built user type templates
- **API Integration**: Real-time synchronization with backend
- **Advanced Analytics**: Usage statistics and insights
