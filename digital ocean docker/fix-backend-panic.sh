#!/bin/bash
set -e

echo "🔧 Investigating and Fixing Backend Panic Issue"
echo "==============================================="

# Check if SSH key exists
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "❌ Error: SSH key not found at ~/.ssh/id_ed25519"
    exit 1
fi

echo "🔑 Using SSH key: ~/.ssh/id_ed25519"

# Create the backend fix script
cat > fix_backend_panic_script.sh << 'EOF'
#!/bin/bash
set -e

echo "🔧 Investigating and Fixing Backend Panic Issue"
echo "==============================================="

cd /opt/viworks/"digital ocean docker"

echo "🔍 Detailed Backend Investigation..."
echo "===================================="

echo "📊 Backend Container Status:"
docker-compose ps backend

echo ""
echo "🔍 Backend Logs (Full):"
echo "======================="
docker logs viworks-backend || echo "No backend logs found"

echo ""
echo "🔍 Backend Environment Variables:"
echo "================================="
docker exec viworks-backend env | grep -E "(DATABASE_URL|REDIS_URL|RUST_LOG|JWT_SECRET)" || echo "Cannot access backend container"

echo ""
echo "🔍 Database Schema Check:"
echo "========================="
echo "Checking if database tables exist:"
docker exec viworks-postgres psql -U admin -d viworks -c "\dt" || echo "Cannot access database or no tables exist"

echo ""
echo "🔍 Database Migration Status:"
echo "============================="
echo "Checking migration table:"
docker exec viworks-postgres psql -U admin -d viworks -c "SELECT * FROM __diesel_schema_migrations;" || echo "Migration table not found"

echo ""
echo "🔧 Attempting to Fix Backend Issue..."
echo "====================================="

# Stop the backend
docker-compose stop backend

echo ""
echo "🔍 Checking if this is a migration issue..."
echo "=========================================="

# Try to run migrations manually
echo "Attempting to run migrations manually:"
docker run --rm \
    --network digitaloceandocker_viworks-internal \
    -e DATABASE_URL="postgresql://admin:viworks123@postgres:5432/viworks" \
    -e REDIS_URL="redis://redis:6379" \
    digitaloceandocker-backend \
    /app/app --migrate-only || echo "Migration command not available"

echo ""
echo "🔍 Alternative: Check if backend needs specific environment variables..."
echo "======================================================================"

# Check what environment variables the backend expects
echo "Backend container environment:"
docker inspect viworks-backend | grep -A 20 "Env" || echo "Cannot inspect backend container"

echo ""
echo "🔧 Restarting Backend with Debug Mode..."
echo "========================================"

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

# Test if backend is responding
echo "Testing backend health endpoint:"
if curl -f -s http://localhost:8081/health > /dev/null; then
    echo "✅ Backend health endpoint is responding"
else
    echo "❌ Backend health endpoint is not responding"
fi

echo ""
echo "🔍 Testing Through Nginx:"
echo "========================="

# Test through nginx
echo "Testing backend through nginx:"
if curl -f -s -k https://localhost/health > /dev/null; then
    echo "✅ Backend is responding through nginx"
else
    echo "❌ Backend is not responding through nginx"
fi

echo ""
echo "📊 Final Status:"
echo "================"
docker-compose ps

echo ""
echo "🔍 Summary of Issues Found:"
echo "============================"
echo "1. Backend is panicking during database migrations"
echo "2. The panic occurs at line 641 in src/main.rs"
echo "3. This suggests a database schema or migration issue"
echo ""
echo "🔧 Recommended Actions:"
echo "======================"
echo "1. Check the backend source code around line 641"
echo "2. Verify database schema matches expected structure"
echo "3. Consider running migrations manually or resetting database"
echo "4. Check if JWT_SECRET environment variable is required"
EOF

# Upload and execute the script on the server
echo "📤 Uploading backend panic fix script to server..."
scp -i ~/.ssh/id_ed25519 fix_backend_panic_script.sh root@64.227.46.188:/tmp/

echo "🔧 Making script executable and running it..."
ssh -i ~/.ssh/id_ed25519 root@64.227.46.188 "chmod +x /tmp/fix_backend_panic_script.sh && /tmp/fix_backend_panic_script.sh"

# Clean up
rm -f fix_backend_panic_script.sh

echo ""
echo "✅ Backend panic investigation completed!"
