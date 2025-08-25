# 🚀 ViWorkS Live Demo Testing Guide

## 📋 **Quick Start - Test All Components**

### **✅ Services Status**
- **Backend API**: http://localhost:8081 ✅ Running
- **Admin Panel**: http://localhost:3000 ✅ Running
- **Database**: PostgreSQL ✅ Running
- **Cache**: Redis ✅ Running

---

## 🎯 **Step-by-Step Live Demo Testing**

### **1. Admin Panel Testing**

#### **Access Admin Panel**
```bash
# Open in your browser
http://localhost:3000/login
```

#### **Login Credentials**
- **Username**: `admin`
- **Password**: `admin123`

#### **Admin Panel Features to Test**
1. **User Management**
   - Go to "Users" tab
   - Click "Create New User"
   - Fill in: Username, Email, Mobile, Policy Window
   - Enable "Device Binding"
   - Click "Create User"
   - Go to "Pending Users" and activate the user

2. **Session Monitoring**
   - Go to "Sessions" tab
   - View real-time active sessions
   - Monitor connection status
   - Test session termination

3. **Device Management**
   - Go to "Devices" tab
   - View registered devices
   - Approve/reject device binding requests

4. **Audit Logs**
   - Go to "Audit Logs" tab
   - View system events
   - Filter by date/event type
   - Export logs

---

### **2. Mac Client Testing**

#### **Launch Mac Client**
```bash
# Navigate to Mac client directory
cd viworksclient01/products/clients/macos

# Run the demo script
./test-mac-client.sh
```

#### **Mac Client Features to Test**
1. **Login Interface**
   - Enter username: `admin`
   - Enter password: `admin123`
   - Click "Login"

2. **2FA Verification**
   - Enter the 6-digit code from Android app
   - Click "Verify"

3. **Connection Flow**
   - Watch preflight checks
   - Monitor SPA packet sending
   - View stunnel/OpenVPN status
   - See connection establishment

4. **Status Display**
   - View connection status
   - Monitor VPN IP address
   - Check session information

---

### **3. Android App Testing**

#### **Launch Android App**
```bash
# Navigate to Android app directory
cd viworksclient01/products/mobile/android

# Run the demo script
./test-android-custom-backend.sh
```

#### **Android App Features to Test**
1. **Login Interface**
   - Enter username: `admin`
   - Enter password: `admin123`
   - Click "Login"

2. **2FA Code Display**
   - View 6-digit verification code
   - Watch 120-second countdown
   - Test code refresh

3. **Device Registration**
   - Complete device binding workflow
   - View device fingerprint
   - Monitor approval status

4. **Verification System**
   - Generate verification codes
   - Confirm verifications
   - View request history

---

### **4. Complete End-to-End Demo Flow**

#### **Run Complete Demo Test**
```bash
# From the admin panel directory
cd viworksclient01/products/admin-panel/viworks-admin-panel

# Run the complete demo flow
./test-complete-demo-flow.sh
```

#### **Expected Demo Flow**
1. ✅ Admin login
2. ✅ Create new user
3. ✅ Activate user
4. ✅ User login (Android app)
5. ✅ Device registration (Android app)
6. ✅ 2FA initiation (Mac client)
7. ✅ Verification code request (Android app)
8. ✅ 2FA verification (Mac client)
9. ✅ Verification confirmation (Android app)
10. ✅ Client bootstrap (Mac client)
11. ✅ Create VPN user (Gateway agent)
12. ✅ Spawn browser container (Gateway agent)
13. ✅ Admin monitoring data
14. ✅ Terminate session (Admin action)

---

## 🎬 **Live Demo Scenario**

### **Scenario: Complete User Journey**

#### **Step 1: Admin Setup**
1. Open Admin Panel: http://localhost:3000/login
2. Login with: `admin/admin123`
3. Go to "Users" → "Create New User"
4. Create user: `demo_user` with email and mobile
5. Enable device binding
6. Activate the user

#### **Step 2: Mobile Authentication**
1. Launch Android app
2. Login with: `admin/admin123`
3. Complete device registration
4. View 6-digit verification code
5. Note the code for desktop client

#### **Step 3: Desktop Connection**
1. Launch Mac client
2. Login with: `admin/admin123`
3. Enter the 6-digit code from Android app
4. Watch connection establishment
5. Monitor VPN status

#### **Step 4: Admin Monitoring**
1. Return to Admin Panel
2. Go to "Sessions" tab
3. View active session in real-time
4. Monitor connection status
5. Test session termination

---

## 🛠️ **Individual Component Testing**

### **Backend API Testing**
```bash
# Test all endpoints
curl -s http://localhost:8081/health | jq

# Test authentication
curl -s -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq

# Test user creation
curl -s -X POST http://localhost:8081/api/v1/admin/users/create \
  -H "Content-Type: application/json" \
  -d '{"username":"test_user","email":"test@company.com","mobile":"09123456789","policy_window":"09:00-17:00","device_binding":true}' | jq
```

### **Frontend Testing**
```bash
# Check frontend status
curl -s http://localhost:3000 | head -20

# Test admin panel login
# Open http://localhost:3000/login in browser
```

### **Database Testing**
```bash
# Check database connection
docker exec viworks-admin-postgres psql -U viworks_admin -d viworks_admin -c "SELECT COUNT(*) FROM users;"
```

---

## 📊 **Monitoring & Debugging**

### **Service Logs**
```bash
# Backend logs
docker logs viworks-admin-backend

# Frontend logs
docker logs viworks-admin-frontend

# Database logs
docker logs viworks-admin-postgres

# Redis logs
docker logs viworks-admin-redis
```

### **Health Checks**
```bash
# Backend health
curl http://localhost:8081/health

# Frontend health
curl http://localhost:3000

# Database health
docker exec viworks-admin-postgres pg_isready -U viworks_admin
```

### **Performance Monitoring**
```bash
# Check container resources
docker stats

# Check network connectivity
docker network ls
docker network inspect viworks-admin-network
```

---

## 🎯 **Troubleshooting**

### **Common Issues**

#### **Service Not Starting**
```bash
# Restart all services
docker-compose down
docker-compose up -d

# Check logs
docker-compose logs
```

#### **Port Conflicts**
```bash
# Check port usage
lsof -i :8081
lsof -i :3000

# Kill conflicting processes
sudo kill -9 <PID>
```

#### **Database Issues**
```bash
# Reset database
docker-compose down -v
docker-compose up -d

# Check database connection
docker exec viworks-admin-postgres psql -U viworks_admin -d viworks_admin -c "\dt"
```

#### **Frontend Issues**
```bash
# Clear browser cache
# Or use incognito mode

# Check frontend build
docker exec viworks-admin-frontend npm run build
```

---

## 🎉 **Success Criteria**

### **✅ All Components Working**
- [ ] Admin Panel accessible at http://localhost:3000
- [ ] Backend API responding at http://localhost:8081
- [ ] Mac client launching and connecting
- [ ] Android app displaying verification codes
- [ ] Complete demo flow executing successfully

### **✅ Demo Features Working**
- [ ] User creation and activation
- [ ] Device binding and approval
- [ ] 2FA verification flow
- [ ] Real-time session monitoring
- [ ] Audit logging and export
- [ ] Session termination

### **✅ Integration Working**
- [ ] All components using same backend
- [ ] Real-time data synchronization
- [ ] Cross-platform authentication
- [ ] Complete end-to-end workflow

---

## 🚀 **Next Steps**

### **For Live Demo**
1. **Prepare Environment**: Ensure all services running
2. **Test Components**: Verify each component individually
3. **Run Complete Flow**: Execute end-to-end demo
4. **Practice Demo**: Rehearse the demo scenario
5. **Prepare Backup**: Have alternative scenarios ready

### **For Production**
1. **Security Review**: Audit security configurations
2. **Performance Testing**: Load test the system
3. **Documentation**: Complete user and admin guides
4. **Deployment**: Prepare production deployment
5. **Monitoring**: Set up production monitoring

---

## 📞 **Support**

### **Getting Help**
- **Logs**: Check service logs for errors
- **Health Checks**: Verify service status
- **Documentation**: Review implementation guides
- **Testing**: Run individual component tests

### **Contact Information**
- **Technical Issues**: Check logs and health endpoints
- **Demo Questions**: Review demo scripts and guides
- **System Issues**: Restart services and check configurations

---

*This guide provides complete instructions for testing the ViWorkS demo system in action.*
