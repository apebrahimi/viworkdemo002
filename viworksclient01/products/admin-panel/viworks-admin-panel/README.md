# ViWorkS Admin Panel

A modern, enterprise-grade admin panel for the ViWorkS VPN platform with Persian language support and RTL layout.

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Ports 3000, 8080, 5432, 6379, 5050 available

### Automated Setup
```bash
# Clone the repository and navigate to the admin panel directory
cd viworksclient01/products/admin-panel/viworks-admin-panel

# Run the automated setup script
./setup.sh
```

The setup script will:
- Check Docker installation
- Verify port availability
- Create environment configuration
- Generate SSL certificates
- Build and start all containers
- Wait for services to be ready
- Run database migrations

### Manual Setup
If you prefer manual setup:

1. **Create environment file:**
   ```bash
   cp env.example .env
   ```

2. **Generate SSL certificates:**
   ```bash
   mkdir -p nginx/ssl
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
       -keyout nginx/ssl/key.pem \
       -out nginx/ssl/cert.pem \
       -subj "/C=US/ST=State/L=City/O=ViWorkS/CN=localhost"
   ```

3. **Build and start containers:**
   ```bash
   docker-compose up -d --build
   ```

## 📱 Access Information

Once setup is complete, you can access:

- **Frontend (Admin Panel)**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **pgAdmin (Database)**: http://localhost:5050

### Default Credentials
- **Admin Panel**: admin / admin123
- **pgAdmin**: admin@viworks.com / admin123
- **Database**: admin / secure_password_dev

## 🏗️ Architecture

### Services
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Rust with Actix-web framework
- **Database**: PostgreSQL with SQLx
- **Cache**: Redis
- **Reverse Proxy**: Nginx
- **Database Admin**: pgAdmin

### Features
- ✅ Persian language support with RTL layout
- ✅ JWT authentication with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Real-time monitoring dashboard
- ✅ Client management interface
- ✅ Security monitoring and alerts
- ✅ Audit logging system
- ✅ Responsive design

## 🔧 Management Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Update and restart
docker-compose up -d --build

# Access backend container
docker-compose exec backend sh

# Access database
docker-compose exec postgres psql -U admin -d viworks_admin
```

## 📊 Database Schema

The application includes the following tables:
- `users` - User accounts and authentication
- `clients` - VPN client management
- `sessions` - JWT session management
- `audit_logs` - Security audit trail
- `system_logs` - Application logging

## 🌐 Language Support

The admin panel supports:
- **Persian (فارسی)** - Primary language with RTL layout
- **English** - Secondary language with LTR layout

Language switching is available through the UI language switcher.

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Rate limiting
- CORS protection
- Security headers
- Audit logging
- Session management

## 📈 Monitoring

The admin panel includes:
- Real-time client status monitoring
- Connection statistics
- Security alerts
- System performance metrics
- User activity tracking

## 🚀 Production Deployment

For production deployment:

1. Update environment variables in `.env`
2. Use proper SSL certificates
3. Configure external database if needed
4. Set up monitoring and logging
5. Configure backup strategies

## 📝 Development

### Backend Development
```bash
cd backend
cargo run
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Database Migrations
```bash
cd backend
cargo install sqlx-cli
sqlx migrate run
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for ViWorkS platform.

## 🆘 Support

For support and questions:
- Check the documentation in `/docs`
- Review the troubleshooting guides
- Contact the development team

---

**ViWorkS Admin Panel** - Enterprise VPN Management Solution
