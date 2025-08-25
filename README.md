# ViWorks Platform

A comprehensive cybersecurity platform providing secure remote access solutions with advanced client applications and administrative tools.

## 🚀 Project Overview

ViWorks is a complete cybersecurity platform that includes:

- **Admin Panel**: Web-based management interface for monitoring and controlling client connections
- **Desktop Clients**: Native applications for macOS and Windows with secure VPN connectivity
- **Mobile Application**: Android app for mobile device management and authentication
- **Backend Services**: Rust-based API server with real-time WebSocket communication

## 📁 Project Structure

```
source code/
├── viworksclient01/                    # Main project directory
│   ├── docs/                          # Documentation and guides
│   │   ├── admin-panel/               # Admin panel documentation
│   │   ├── deployment/                # Deployment guides
│   │   ├── guides/                    # Development and troubleshooting guides
│   │   ├── mobile/                    # Mobile app documentation
│   │   ├── platform/                  # Platform architecture docs
│   │   └── requirements/              # Project requirements
│   └── products/                      # Product implementations
│       ├── admin-panel/               # Admin panel application
│       │   ├── backend/               # Rust backend API
│       │   ├── frontend/              # Next.js React frontend
│       │   └── nginx/                 # Web server configuration
│       ├── clients/                   # Desktop client applications
│       │   ├── macos/                 # macOS client (Rust/egui)
│       │   └── windows/               # Windows client (Rust/egui)
│       ├── mobile/                    # Mobile applications
│       │   └── android/               # Android app (Kotlin)
│       ├── services/                  # Backend services
│       └── shared/                    # Shared configurations
├── package.json                       # Node.js dependencies
└── .gitignore                         # Git ignore rules
```

## 🛠️ Technology Stack

### Backend
- **Rust** - High-performance backend API
- **PostgreSQL** - Database
- **WebSocket** - Real-time communication
- **JWT** - Authentication

### Frontend
- **Next.js** - React framework for admin panel
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Styling
- **TanStack Query** - Data fetching

### Desktop Clients
- **Rust** - Core application logic
- **egui** - Cross-platform GUI framework
- **OpenVPN** - VPN connectivity
- **fwknop** - Single Packet Authorization

### Mobile
- **Kotlin** - Android development
- **Jetpack Compose** - Modern UI framework
- **Firebase** - Push notifications

## 🚀 Quick Start

### Prerequisites
- Rust (latest stable)
- Node.js (18+)
- Docker & Docker Compose
- PostgreSQL

### Admin Panel Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/apebrahimi/viworkdemo002.git
   cd viworkdemo002
   ```

2. **Start the admin panel**
   ```bash
   cd viworksclient01/products/admin-panel/viworks-admin-panel
   docker-compose up -d
   ```

3. **Access the admin panel**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

### Desktop Client Setup

#### macOS
```bash
cd viworksclient01/products/clients/macos
cargo build --release
```

#### Windows
```bash
cd viworksclient01/products/clients/windows
cargo build --release
```

### Mobile App Setup

```bash
cd viworksclient01/products/mobile/android
./gradlew assembleDebug
```

## 📚 Documentation

- [Admin Panel Architecture](viworksclient01/docs/admin-panel/ADMIN_PANEL_ARCHITECTURE_PLAN.md)
- [Deployment Guide](viworksclient01/docs/deployment/CONTAINER_DEPLOYMENT_GUIDE.md)
- [Client Integration Protocol](viworksclient01/docs/guides/CLIENT_INTEGRATION_PROTOCOL.md)
- [Troubleshooting Guide](viworksclient01/docs/guides/CLIENT_TROUBLESHOOTING_GUIDE.md)

## 🔧 Development

### Backend Development
```bash
cd viworksclient01/products/admin-panel/viworks-admin-panel/backend
cargo run
```

### Frontend Development
```bash
cd viworksclient01/products/admin-panel/viworks-admin-panel/frontend
npm install
npm run dev
```

### Testing
```bash
# Backend tests
cd viworksclient01/products/admin-panel/viworks-admin-panel/backend
cargo test

# Frontend tests
cd viworksclient01/products/admin-panel/viworks-admin-panel/frontend
npm test
```

## 🐳 Docker Deployment

The project includes comprehensive Docker support for easy deployment:

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Development deployment
docker-compose -f docker-compose.dev.yml up -d
```

## 🔒 Security Features

- **Single Packet Authorization (SPA)** - Zero-trust network access
- **Certificate Pinning** - Prevents MITM attacks
- **Device Integrity Checking** - Ensures secure device state
- **Real-time Monitoring** - Live connection tracking
- **Audit Logging** - Comprehensive security logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions:
- Check the [troubleshooting guide](viworksclient01/docs/guides/CLIENT_TROUBLESHOOTING_GUIDE.md)
- Review the [documentation](viworksclient01/docs/)
- Open an issue on GitHub

---

**ViWorks Platform** - Secure, scalable, and enterprise-ready cybersecurity solution.
