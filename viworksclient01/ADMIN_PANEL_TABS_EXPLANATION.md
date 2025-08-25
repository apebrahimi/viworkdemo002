# ViWorkS Admin Panel - Frontend Tabs Explanation

## 🎯 **Overview**

The ViWorkS Admin Panel is a comprehensive web-based management interface built with Next.js and TypeScript. It provides centralized control over the entire ViWorkS VPN platform through 9 main tabs, each designed for specific administrative functions.

---

## 📊 **Tab 1: Dashboard (داشبورد)**

### **Purpose**
The main overview and control center of the admin panel, providing real-time insights into system health, performance, and key metrics.

### **Key Features**
- **Welcome Section**: Personalized greeting with system status
- **Real-time Statistics Cards**:
  - Active Clients (with connection percentage)
  - VPN Servers (with change indicators)
  - Security Alerts (with severity levels)
  - Total Users (with growth metrics)
- **System Metrics Display**:
  - CPU Usage monitoring
  - Memory utilization
  - Network activity
  - Storage capacity
- **Activity Feed**: Live system events and user activities
- **Quick Actions**: Fast access to common administrative tasks

### **Functionality**
- **Real-time Updates**: Live data refresh from backend APIs
- **Interactive Metrics**: Clickable cards for detailed views
- **Persian Language Support**: Full RTL layout with Persian text
- **Responsive Design**: Works on desktop and mobile devices
- **Theme Support**: Dark/light mode compatibility

### **Data Sources**
- `useHealth()` - System health status
- `useClients()` - Client connection data
- `useUsers()` - User management data
- `useSecurityAlerts()` - Security incident data
- `useSystemMetrics()` - Performance metrics

---

## 📱 **Tab 2: Clients (کلاینت‌ها)**

### **Purpose**
Comprehensive management of VPN client connections, including monitoring, configuration, and troubleshooting.

### **Key Features**
- **Client List Management**:
  - Add new clients
  - Edit existing configurations
  - Delete inactive clients
  - Bulk operations
- **Real-time Status Monitoring**:
  - Online/Offline status indicators
  - Connection quality metrics
  - Bandwidth usage tracking
  - Session duration
- **Advanced Filtering**:
  - Search by name, IP, or MAC address
  - Filter by connection status
  - Sort by various criteria
- **Client Actions**:
  - Connect/Disconnect clients
  - View detailed logs
  - Download configuration files
  - Force reconnection

### **Functionality**
- **Status Indicators**: Color-coded status badges (green=online, gray=offline, yellow=connecting, red=error)
- **Search & Filter**: Real-time search with multiple filter options
- **Modal Dialogs**: Add/Edit client forms with validation
- **API Integration**: Full CRUD operations via REST API
- **Real-time Updates**: Live status updates via WebSocket

### **Data Management**
- **Client Information**: Name, IP address, MAC address, status
- **Connection Details**: Protocol, encryption, bandwidth
- **Session Data**: Login time, duration, activity
- **Configuration Files**: OpenVPN configs, certificates

---

## 👥 **Tab 3: Users (کاربران)**

### **Purpose**
User account management, role assignment, and permission control for the VPN platform.

### **Current Status**
🔄 **Under Development** - Basic structure implemented, full functionality pending

### **Planned Features**
- **User Management**:
  - Create new user accounts
  - Edit user profiles and permissions
  - Delete inactive users
  - Bulk user operations
- **Role-Based Access Control (RBAC)**:
  - Admin roles
  - User roles
  - Custom permission sets
  - Role assignment
- **User Authentication**:
  - Password management
  - Multi-factor authentication setup
  - Session management
  - Account lockout policies

### **Future Functionality**
- **User Profiles**: Personal information, preferences
- **Permission Management**: Granular access controls
- **Authentication History**: Login attempts, success/failure
- **Account Policies**: Password requirements, session limits

---

## 📱 **Tab 4: Devices (دستگاه‌ها)**

### **Purpose**
Management of user devices that connect to the VPN, including mobile devices, desktops, and tablets.

### **Key Features**
- **Device Registration**:
  - Automatic device detection
  - Manual device addition
  - Device type classification
- **Device Information Display**:
  - Device ID and model
  - Operating system details
  - App version information
  - Manufacturer details
- **Device Status Management**:
  - Active/Inactive status
  - Last used timestamp
  - Creation date
  - Usage statistics
- **Device Controls**:
  - Activate/Deactivate devices
  - Remove devices
  - View device logs

### **Functionality**
- **OS Detection**: Automatic operating system identification
- **Status Badges**: Visual indicators for device status
- **Date Formatting**: Localized date/time display
- **API Integration**: Full device management via REST API
- **Real-time Updates**: Live device status changes

### **Device Types Supported**
- **Mobile**: Android, iOS devices
- **Desktop**: Windows, macOS, Linux
- **Tablets**: iPad, Android tablets
- **Other**: IoT devices, embedded systems

---

## 📈 **Tab 5: Monitoring (نظارت)**

### **Purpose**
Real-time system monitoring, performance tracking, and alert management.

### **Current Status**
🔄 **Under Development** - Basic structure implemented, full functionality pending

### **Planned Features**
- **System Performance Monitoring**:
  - CPU usage tracking
  - Memory utilization
  - Network bandwidth
  - Disk space monitoring
- **Real-time Alerts**:
  - Performance threshold alerts
  - System health notifications
  - Resource usage warnings
- **Performance Analytics**:
  - Historical data charts
  - Trend analysis
  - Capacity planning
- **System Health Dashboard**:
  - Overall system status
  - Component health indicators
  - Maintenance schedules

### **Future Functionality**
- **Custom Dashboards**: Configurable monitoring views
- **Alert Rules**: Customizable alert thresholds
- **Performance Reports**: Scheduled performance reports
- **Capacity Planning**: Resource usage predictions

---

## 🛡️ **Tab 6: Security (امنیت)**

### **Purpose**
Comprehensive security management, threat detection, and incident response for the VPN platform.

### **Key Features**
- **Security Overview**:
  - Threat level assessment
  - Security metrics dashboard
  - Real-time security status
- **Security Alerts Management**:
  - Critical, High, Medium, Low severity alerts
  - Alert investigation workflow
  - Alert resolution tracking
- **Security Incidents**:
  - Brute force attack detection
  - Unauthorized access attempts
  - Data breach monitoring
  - Malware detection
  - DDoS attack protection
- **Firewall Management**:
  - Firewall rule configuration
  - Allow/Deny rules
  - Protocol filtering (TCP/UDP/ICMP)
  - Port management
  - Priority-based rule ordering

### **Functionality**
- **Real-time Threat Detection**: Live security monitoring
- **Alert Classification**: Automatic severity assessment
- **Incident Response**: Workflow for security incidents
- **Firewall Configuration**: Visual firewall rule management
- **Security Logs**: Comprehensive security event logging

### **Security Features**
- **Multi-factor Authentication**: Hardware-backed security
- **Device Integrity Checks**: Anti-tamper protection
- **Network Traffic Analysis**: Suspicious activity detection
- **Access Control**: Role-based security policies
- **Audit Logging**: Complete security audit trail

---

## 🌐 **Tab 7: Servers (سرورها)**

### **Purpose**
Management of VPN servers, their configurations, and performance monitoring.

### **Key Features**
- **Server Overview**:
  - Server status monitoring
  - Performance metrics
  - Connection statistics
- **VPN Server Management**:
  - OpenVPN server configuration
  - Stunnel server settings
  - PSA (Port-knocking) server management
- **Server Configuration**:
  - Configuration file management
  - Version control
  - Active/inactive configurations
- **Server Monitoring**:
  - Real-time performance metrics
  - Resource usage tracking
  - Connection monitoring
- **Server Logs**:
  - Server-specific log viewing
  - Error tracking
  - Performance analysis

### **Functionality**
- **Server Types**: OpenVPN, Stunnel, PSA servers
- **Status Monitoring**: Online/Offline/Maintenance/Error states
- **Performance Tracking**: CPU, Memory, Network, Disk usage
- **Configuration Management**: Version-controlled configs
- **Geographic Distribution**: Server location management

### **Server Information**
- **Basic Details**: Name, IP address, port, location
- **Performance Metrics**: Load, connections, uptime
- **Security Settings**: SSL status, encryption protocols
- **Network Information**: Bandwidth, latency, packet loss

---

## 🗄️ **Tab 8: Database (پایگاه داده)**

### **Purpose**
Database administration, monitoring, and maintenance for the ViWorkS platform.

### **Key Features**
- **Database Overview**:
  - Database health monitoring
  - Performance metrics
  - Connection statistics
- **Database Management**:
  - PostgreSQL database administration
  - Redis cache management
  - Database version tracking
- **Backup Management**:
  - Automated backup scheduling
  - Manual backup creation
  - Backup restoration
  - Backup verification
- **Query Monitoring**:
  - SQL query performance
  - Query execution time
  - Query optimization
- **Database Monitoring**:
  - Real-time performance metrics
  - Connection pool monitoring
  - Storage usage tracking

### **Functionality**
- **Database Types**: PostgreSQL (primary), Redis (caching)
- **Health Monitoring**: Online/Offline/Maintenance states
- **Performance Metrics**: Connections, queries, storage
- **Backup Management**: Full and incremental backups
- **Query Analysis**: Performance optimization tools

### **Database Operations**
- **Connection Management**: Active connections monitoring
- **Storage Analysis**: Database size and growth tracking
- **Performance Optimization**: Query performance analysis
- **Maintenance Tasks**: Regular maintenance scheduling

---

## 📋 **Tab 9: Logs (گزارش‌ها)**

### **Purpose**
Comprehensive logging and log analysis for system events, user activities, and security incidents.

### **Key Features**
- **Live Log Viewing**:
  - Real-time log streaming
  - Log level filtering
  - Source-based filtering
- **Log Search & Analysis**:
  - Advanced search functionality
  - Date range filtering
  - User/IP filtering
  - Log pattern analysis
- **Log Categories**:
  - System logs
  - Authentication logs
  - VPN connection logs
  - Database logs
  - Security logs
  - Network logs
- **Log Management**:
  - Log archiving
  - Log retention policies
  - Log export functionality
  - Log analysis tools

### **Functionality**
- **Log Levels**: Info, Warning, Error, Debug, Critical
- **Real-time Streaming**: Live log updates
- **Advanced Filtering**: Multiple filter criteria
- **Search Capabilities**: Full-text search with regex support
- **Export Options**: CSV, JSON, XML export formats

### **Log Sources**
- **System Events**: Operating system events
- **Authentication**: Login/logout events
- **VPN Activity**: Connection/disconnection events
- **Database Operations**: Query execution logs
- **Security Events**: Security incidents and alerts
- **Network Activity**: Network traffic and routing

---

## 🎨 **User Interface Features**

### **Design System**
- **Modern UI**: Clean, professional interface design
- **Responsive Layout**: Works on all screen sizes
- **Dark/Light Themes**: User-selectable themes
- **RTL Support**: Full Persian language support with right-to-left layout

### **Navigation**
- **Sidebar Navigation**: Collapsible sidebar with tab switching
- **Breadcrumb Navigation**: Clear navigation hierarchy
- **Quick Actions**: Fast access to common functions
- **Keyboard Shortcuts**: Power user keyboard navigation

### **Interactive Elements**
- **Real-time Updates**: Live data without page refresh
- **Modal Dialogs**: Inline forms and confirmations
- **Toast Notifications**: User feedback and alerts
- **Loading States**: Visual feedback during operations

### **Data Visualization**
- **Charts & Graphs**: Performance and analytics visualization
- **Status Indicators**: Color-coded status badges
- **Progress Bars**: Operation progress tracking
- **Metrics Cards**: Key performance indicators

---

## 🔧 **Technical Implementation**

### **Frontend Technologies**
- **Next.js 14**: React framework with SSR/SSG
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: Data fetching and caching
- **Zustand**: State management

### **API Integration**
- **REST APIs**: Backend communication
- **WebSocket**: Real-time updates
- **Error Handling**: Comprehensive error management
- **Loading States**: User experience optimization

### **Security Features**
- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Input Validation**: Client-side validation
- **XSS Protection**: Security best practices

### **Performance Optimization**
- **Code Splitting**: Lazy loading of components
- **Caching**: Intelligent data caching
- **Optimization**: Bundle size optimization
- **Monitoring**: Performance monitoring

---

## 🚀 **Future Enhancements**

### **Planned Features**
- **Advanced Analytics**: Machine learning-powered insights
- **Custom Dashboards**: User-configurable dashboards
- **API Documentation**: Built-in API documentation
- **Mobile App**: Native mobile admin application

### **Integration Capabilities**
- **SIEM Integration**: Security information and event management
- **Third-party Tools**: Integration with external tools
- **Webhook Support**: Event-driven integrations
- **API Extensions**: Custom API endpoints

### **Enterprise Features**
- **Multi-tenancy**: Multi-tenant architecture support
- **SSO Integration**: Single sign-on capabilities
- **Advanced Reporting**: Custom report generation
- **Compliance Tools**: Regulatory compliance features

---

## 📞 **Support & Documentation**

### **Help Resources**
- **Inline Help**: Context-sensitive help tooltips
- **Documentation**: Comprehensive user documentation
- **Video Tutorials**: Step-by-step video guides
- **FAQ Section**: Frequently asked questions

### **Technical Support**
- **Error Reporting**: Built-in error reporting
- **Debug Tools**: Development debugging tools
- **Log Analysis**: Advanced log analysis capabilities
- **Performance Monitoring**: System performance tracking

---

**Last Updated**: 2024-12-19
**Document Version**: 1.0
**Admin Panel Version**: Development

