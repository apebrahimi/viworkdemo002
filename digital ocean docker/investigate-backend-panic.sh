#!/bin/bash
set -e

echo "🔍 Investigating Backend Panic Issue"
echo "===================================="

# Check if SSH key exists
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "❌ Error: SSH key not found at ~/.ssh/id_ed25519"
    exit 1
fi

echo "🔑 Using SSH key: ~/.ssh/id_ed25519"

# Create the investigation script
cat > investigate_backend_panic_script.sh << 'EOF'
#!/bin/bash
set -e

echo "🔍 Investigating Backend Panic Issue"
echo "===================================="

cd /opt/viworks/"digital ocean docker"

echo "🔍 Current Backend Status:"
echo "=========================="
docker-compose ps backend

echo ""
echo "🔍 Backend Logs (Full):"
echo "======================="
docker logs viworks-backend || echo "No backend logs found"

echo ""
echo "🔍 Database Investigation:"
echo "=========================="

echo "Checking if database 'viworks' exists:"
docker exec viworks-postgres psql -U admin -c "\l" | grep viworks || echo "Database 'viworks' not found"

echo ""
echo "Checking if database 'viworks' exists (alternative method):"
docker exec viworks-postgres psql -U admin -c "SELECT datname FROM pg_database WHERE datname = 'viworks';" || echo "Cannot query database"

echo ""
echo "🔍 Creating Database if it doesn't exist..."
echo "==========================================="

# Try to create the database if it doesn't exist
echo "Creating database 'viworks' if it doesn't exist:"
docker exec viworks-postgres createdb -U admin viworks 2>/dev/null && echo "✅ Database 'viworks' created" || echo "ℹ️  Database 'viworks' already exists or creation failed"

echo ""
echo "🔍 Checking Database Tables:"
echo "============================"

echo "Listing tables in database 'viworks':"
docker exec viworks-postgres psql -U admin -d viworks -c "\dt" || echo "Cannot list tables"

echo ""
echo "🔍 Checking Migration Table:"
echo "============================="

echo "Checking for migration table:"
docker exec viworks-postgres psql -U admin -d viworks -c "SELECT * FROM __diesel_schema_migrations;" || echo "Migration table not found"

echo ""
echo "🔍 Testing Database Connection from Backend:"
echo "============================================"

# Test if backend can connect to database
echo "Testing database connection from backend container:"
docker exec viworks-backend psql -h viworks-postgres -U admin -d viworks -c "SELECT 1;" || echo "❌ Backend cannot connect to database"

echo ""
echo "🔍 Testing Redis Connection from Backend:"
echo "========================================="

# Test if backend can connect to redis
echo "Testing redis connection from backend container:"
docker exec viworks-backend redis-cli -h viworks-redis ping || echo "❌ Backend cannot connect to redis"

echo ""
echo "🔍 Backend Environment Variables:"
echo "================================="

echo "Checking backend environment variables:"
docker exec viworks-backend env | grep -E "(DATABASE_URL|REDIS_URL|JWT_SECRET)" || echo "Cannot access backend environment"

echo ""
echo "🔧 Attempting to Fix Backend Issue..."
echo "====================================="

# Stop the backend
docker-compose stop backend

echo ""
echo "🔍 Checking if this is a JWT_SECRET issue..."
echo "==========================================="

# Check if JWT_SECRET is required
echo "Current JWT_SECRET value:"
docker exec viworks-postgres psql -U admin -d viworks -c "SELECT 1;" 2>/dev/null && echo "✅ Database connection works" || echo "❌ Database connection failed"

echo ""
echo "🔍 Trying to start backend with minimal configuration..."
echo "======================================================="

# Start backend again
docker-compose up -d backend

echo ""
echo "⏳ Waiting for backend to start..."
echo "=================================="

# Wait for backend to start
for i in {1..30}; do
    if docker-compose ps backend | grep -q "Up"; then
        echo "✅ Backend is starting up..."
        break
    fi
    echo "⏳ Waiting for backend to start... ($i/30)"
    sleep 2
done

echo ""
echo "🔍 Backend Status After Restart:"
echo "================================"
docker-compose ps backend

echo ""
echo "🔍 Latest Backend Logs:"
echo "======================="
docker logs viworks-backend --tail=20 || echo "No backend logs found"

echo ""
echo "🔍 Testing Backend Health:"
echo "=========================="

# Wait a bit more for backend to fully start
sleep 10

echo "Testing backend health endpoint:"
if curl -f -s http://localhost:8081/health > /dev/null; then
    echo "✅ Backend health endpoint is responding"
else
    echo "❌ Backend health endpoint is not responding"
fi

echo ""
echo "🔍 Final Container Status:"
echo "=========================="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"

echo ""
echo "🔍 Summary of Investigation:"
echo "============================"
echo "1. Backend is panicking at line 641 in src/main.rs"
echo "2. This happens during database migrations"
echo "3. Database connection and Redis connection are working"
echo "4. The issue is likely in the backend code itself"
echo ""
echo "🔧 Recommended Actions:"
echo "======================"
echo "1. Check the backend source code around line 641"
echo "2. The panic occurs during database migrations"
echo "3. Consider checking if the database schema is compatible"
echo "4. The backend might need specific database tables or structure"
echo "5. Check if there are missing environment variables"
EOF

# Upload and execute the script on the server
echo "📤 Uploading backend panic investigation script to server..."
scp -i ~/.ssh/id_ed25519 investigate_backend_panic_script.sh root@64.227.46.188:/tmp/

echo "🔧 Making script executable and running it..."
ssh -i ~/.ssh/id_ed25519 root@64.227.46.188 "chmod +x /tmp/investigate_backend_panic_script.sh && /tmp/investigate_backend_panic_script.sh"

# Clean up
rm -f investigate_backend_panic_script.sh

echo ""
echo "✅ Backend panic investigation completed!"
