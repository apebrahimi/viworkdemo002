# 🤖 Cursor AI - Quick Reference Guide

## 📋 **PROJECT OVERVIEW**

**Project**: ViWorkS Admin Panel
**Goal**: Secure, containerized admin panel for VPN client management
**Backend**: Rust (Actix-web + Tokio + SQLx)
**Frontend**: Next.js 14 + TypeScript
**Architecture**: Zero-knowledge, enterprise-grade security

---

## 📚 **KEY FILES TO REFERENCE**

### **📖 Master Documents**
- `MASTER_PLAN.md` - Complete implementation plan with all phases
- `PROGRESS_TRACKER.md` - Current progress and next actions
- `admin-panel-plan` - Original functional requirements

### **🔧 Technical Documents**
- `ADMIN_PANEL_ARCHITECTURE_PLAN.md` - System architecture
- `CLIENT_INTEGRATION_PROTOCOL.md` - Client communication
- `BACKEND_HOSTING_RECOMMENDATIONS.md` - Deployment options

---

## 🚀 **HOW TO CONTINUE THE PROJECT**

### **Step 1: Check Current Status**
1. Read `PROGRESS_TRACKER.md` to see current phase
2. Check `MASTER_PLAN.md` for detailed phase information
3. Identify next immediate actions

### **Step 2: Execute Next Tasks**
1. Follow the specific tasks listed in the current phase
2. Reference technical documents for implementation details
3. Update progress as you complete tasks

### **Step 3: Update Progress**
1. Update `PROGRESS_TRACKER.md` with completed tasks
2. Mark tasks with ✅ when done
3. Update timestamps and progress percentages

---

## 🎯 **CURRENT STATUS (as of 2025-08-22)**

**Phase**: 2 of 6 (Development Environment Setup)
**Progress**: 15%
**Next Action**: Initialize Rust backend project

### **Immediate Next Steps**
1. Initialize Rust project in `backend/` directory
2. Set up Cargo.toml with dependencies
3. Initialize Next.js project in `frontend/` directory
4. Configure development environment

---

## 🛠️ **TECHNOLOGY STACK**

### **Backend (Rust)**
```toml
# Key dependencies for Cargo.toml
actix-web = "4.4"
tokio = { version = "1.0", features = ["full"] }
sqlx = { version = "0.7", features = ["runtime-tokio-rustls", "postgres"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
redis = { version = "0.23", features = ["tokio-comp"] }
jsonwebtoken = "9.2"
argon2 = "0.5"
ring = "0.17"
```

### **Frontend (Next.js)**
```json
// Key dependencies for package.json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.3.0",
  "@headlessui/react": "^1.7.0",
  "socket.io-client": "^4.7.0"
}
```

---

## 📁 **PROJECT STRUCTURE**

```
viworks-admin-panel/
├── backend/                 # Rust backend
│   ├── src/
│   ├── Cargo.toml
│   └── migrations/
├── frontend/               # Next.js frontend
│   ├── src/
│   ├── package.json
│   └── next.config.js
├── shared/                 # Shared types/utilities
├── docs/                   # Documentation
├── docker/                 # Containerization
├── MASTER_PLAN.md         # Master implementation plan
├── PROGRESS_TRACKER.md    # Progress tracking
└── CURSOR_GUIDE.md        # This file
```

---

## 🔐 **SECURITY REQUIREMENTS**

### **Zero-Knowledge Architecture**
- Client data encrypted before transmission
- Server never sees raw client data
- Digital signatures for all communications
- Certificate-based authentication

### **Script Execution Security**
- Script validation and sandboxing
- Digital signature verification
- Resource limits and timeouts
- Rollback capabilities

### **Communication Security**
- mTLS for all connections
- Rate limiting and DDoS protection
- Input validation and sanitization
- Comprehensive audit logging

---

## 📝 **COMMON COMMANDS**

### **Rust Backend**
```bash
# Initialize project
cargo init --name viworks-admin-backend

# Add dependencies
cargo add actix-web tokio sqlx serde

# Run development server
cargo run

# Run tests
cargo test

# Build for production
cargo build --release
```

### **Next.js Frontend**
```bash
# Initialize project
npx create-next-app@latest . --typescript --tailwind --eslint

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### **Database**
```bash
# Run migrations
sqlx migrate run

# Create new migration
sqlx migrate add migration_name
```

---

## 🎯 **SUCCESS CRITERIA**

### **Phase 2 Success Criteria**
- [ ] Rust backend compiles and runs
- [ ] Next.js frontend builds successfully
- [ ] Database connection established
- [ ] Development environment fully functional
- [ ] Basic API endpoints responding

### **Overall Project Success**
- [ ] Zero-knowledge architecture implemented
- [ ] Real-time client monitoring working
- [ ] Secure script execution functional
- [ ] Enterprise-grade security achieved
- [ ] Containerized deployment successful

---

## 📞 **WHEN TO REFERENCE OTHER DOCUMENTS**

### **For Architecture Decisions**
- `ADMIN_PANEL_ARCHITECTURE_PLAN.md`

### **For Client Communication**
- `CLIENT_INTEGRATION_PROTOCOL.md`

### **For Deployment Options**
- `BACKEND_HOSTING_RECOMMENDATIONS.md`

### **For Containerization**
- `CONTAINER_DEPLOYMENT_GUIDE.md`

### **For Original Requirements**
- `admin-panel-plan`

---

## 🚨 **IMPORTANT NOTES**

1. **Security First**: All implementations must prioritize security
2. **Zero-Knowledge**: Client data must be encrypted before transmission
3. **Type Safety**: Use Rust's type system for compile-time guarantees
4. **Real-time**: Implement WebSocket for live updates
5. **Audit Logging**: Log all operations for compliance

---

**Ready to continue with Phase 2 implementation! 🚀**

**Remember**: Always update `PROGRESS_TRACKER.md` when completing tasks!
