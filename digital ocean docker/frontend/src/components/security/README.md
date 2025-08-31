# Security Components

This directory contains modular components for the Security section of the admin panel. The components have been refactored from a single large file into smaller, reusable components.

## Component Structure

### Core Components

- **SecuritySection** (`../sections/SecuritySection.tsx`) - Main container component that orchestrates all security components
- **SecurityHeader** - Header section with title, description, and refresh button
- **SecurityTabNavigation** - Tab navigation for switching between different security views
- **SecurityOverview** - Overview tab showing stats and status
- **SecurityAlerts** - Alerts tab showing security alerts
- **SecurityIncidents** - Incidents tab showing security incidents
- **FirewallManagement** - Firewall tab showing firewall rules
- **SecurityLogs** - Logs tab showing security logs

### Shared Utilities

- **SecurityUtils** - Shared utility functions for alert icons, colors, and status colors
- **Types** (`../../lib/types/security.ts`) - TypeScript interfaces for security data

## Usage

```tsx
import { SecuritySection } from '@/components/sections/SecuritySection';

// Use in your app
<SecuritySection />
```

## Component Props

### SecurityOverview
```tsx
interface SecurityOverviewProps {
  securityAlerts: SecurityAlert[];
  securityIncidents: SecurityIncident[];
  firewallRules: FirewallRule[];
}
```

### SecurityAlerts
```tsx
interface SecurityAlertsProps {
  securityAlerts: SecurityAlert[];
}
```

### SecurityIncidents
```tsx
interface SecurityIncidentsProps {
  securityIncidents: SecurityIncident[];
}
```

### FirewallManagement
```tsx
interface FirewallManagementProps {
  firewallRules: FirewallRule[];
}
```

## Data Types

### SecurityAlert
```tsx
interface SecurityAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source: string;
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved';
  affected_users?: number;
}
```

### SecurityIncident
```tsx
interface SecurityIncident {
  id: string;
  type: 'brute_force' | 'unauthorized_access' | 'data_breach' | 'malware' | 'ddos';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source_ip: string;
  target_user?: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved';
}
```

### FirewallRule
```tsx
interface FirewallRule {
  id: string;
  name: string;
  action: 'allow' | 'deny';
  protocol: 'tcp' | 'udp' | 'icmp';
  source: string;
  destination: string;
  port?: string;
  enabled: boolean;
  priority: number;
}
```

## Benefits of This Structure

1. **Modularity** - Each component has a single responsibility
2. **Reusability** - Components can be reused in other sections
3. **Maintainability** - Easier to maintain and update individual components
4. **Testability** - Each component can be tested independently
5. **Code Organization** - Clear separation of concerns
6. **Performance** - Only necessary components are rendered based on active tab

## Future Enhancements

- Add loading states for each component
- Implement real API integration
- Add error handling components
- Create more granular sub-components if needed
- Add unit tests for each component
