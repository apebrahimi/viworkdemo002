#!/bin/bash

echo "🧪 Testing Backend Startup Step by Step"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Please run this from the project root."
    exit 1
fi

echo ""
echo "🔍 Step 1: Checking environment file..."
if [ -f "env.production" ]; then
    echo "✅ env.production found"
    echo "📋 Key variables:"
    grep -E "^(DATABASE_URL|REDIS_URL|JWT_SECRET|HOST|PORT)" env.production
else
    echo "❌ env.production not found"
    exit 1
fi

echo ""
echo "🔍 Step 2: Checking backend source..."
if [ -d "backend/src" ]; then
    echo "✅ Backend source directory found"
    if [ -f "backend/src/main.rs" ]; then
        echo "✅ main.rs found"
    else
        echo "❌ main.rs not found"
        exit 1
    fi
else
    echo "❌ Backend source directory not found"
    exit 1
fi

echo ""
echo "🔍 Step 3: Checking Dockerfile..."
if [ -f "backend/Dockerfile.fixed" ]; then
    echo "✅ Dockerfile.fixed found"
else
    echo "❌ Dockerfile.fixed not found"
    exit 1
fi

echo ""
echo "🔍 Step 4: Testing database connectivity..."
echo "📊 Starting just postgres and redis..."
docker-compose up -d postgres redis

echo "⏳ Waiting for database services to be ready..."
sleep 10

# Check postgres
if docker-compose exec -T postgres pg_isready -U admin -d viworks >/dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL is not ready"
    docker-compose logs postgres | tail -10
fi

# Check redis
if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
    echo "✅ Redis is ready"
else
    echo "❌ Redis is not ready"
    docker-compose logs redis | tail -10
fi

echo ""
echo "🔍 Step 5: Testing backend build..."
echo "📦 Building backend container..."
docker-compose build backend

if [ $? -eq 0 ]; then
    echo "✅ Backend build successful"
else
    echo "❌ Backend build failed"
    exit 1
fi

echo ""
echo "🔍 Step 6: Testing backend startup..."
echo "🚀 Starting backend service..."
docker-compose up -d backend

echo "⏳ Waiting for backend to start..."
sleep 15

# Check backend logs
echo "📋 Backend logs:"
docker-compose logs backend | tail -20

# Check if backend is responding
if curl -f http://localhost:8081/health >/dev/null 2>&1; then
    echo "✅ Backend health endpoint is responding"
else
    echo "❌ Backend health endpoint is not responding"
    echo "🔍 Checking container status:"
    docker-compose ps backend
fi

echo ""
echo "🧹 Cleaning up test containers..."
docker-compose down

echo ""
echo "🎯 Test completed! Check the output above for any issues."
