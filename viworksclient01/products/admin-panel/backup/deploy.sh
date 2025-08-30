#!/bin/bash

# ViWorkS Admin Panel Deployment Script
# Usage: ./deploy.sh [simple|enterprise|stop|status|logs]

set -e

COMPOSE_FILE="docker-compose.yml"
COMPOSE_FILE_ENTERPRISE="docker-compose-with-db.yml"

function show_help() {
    echo "ViWorkS Admin Panel Deployment Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  simple     - Deploy simple setup (in-memory data, no database)"
    echo "  enterprise - Deploy enterprise setup (with PostgreSQL and Redis)"
    echo "  stop       - Stop all containers"
    echo "  status     - Show container status"
    echo "  logs       - Show logs for all containers"
    echo "  health     - Check health of all services"
    echo "  clean      - Stop and remove all containers and volumes"
    echo "  help       - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 simple     # Start simple setup"
    echo "  $0 enterprise # Start enterprise setup"
    echo "  $0 status     # Check status"
    echo "  $0 logs       # View logs"
}

function deploy_simple() {
    echo "🚀 Deploying ViWorkS Admin Panel (Simple Setup)"
    echo "   - Backend: In-memory data"
    echo "   - Frontend: Next.js"
    echo "   - No database required"
    echo ""
    
    docker-compose -f $COMPOSE_FILE down
    docker-compose -f $COMPOSE_FILE up -d
    
    echo "✅ Simple setup deployed successfully!"
    echo ""
    echo "🌐 Access Information:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:8081"
    echo "   Health:   http://localhost:8081/health"
    echo ""
    echo "🔑 Login Credentials:"
    echo "   Username: admin"
    echo "   Password: admin123"
}

function deploy_enterprise() {
    echo "🚀 Deploying ViWorkS Admin Panel (Enterprise Setup)"
    echo "   - Backend: Rust with database support"
    echo "   - Frontend: Next.js"
    echo "   - Database: PostgreSQL"
    echo "   - Cache: Redis"
    echo ""
    
    # Check if enterprise compose file exists
    if [ ! -f "$COMPOSE_FILE_ENTERPRISE" ]; then
        echo "❌ Enterprise compose file not found: $COMPOSE_FILE_ENTERPRISE"
        echo "   Please ensure the file exists before running enterprise deployment."
        exit 1
    fi
    
    docker-compose -f $COMPOSE_FILE down
    docker-compose -f $COMPOSE_FILE_ENTERPRISE up -d
    
    echo "✅ Enterprise setup deployed successfully!"
    echo ""
    echo "🌐 Access Information:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:8081"
    echo "   Health:   http://localhost:8081/health"
    echo "   Database: localhost:5432 (PostgreSQL)"
    echo "   Cache:    localhost:6379 (Redis)"
    echo ""
    echo "🔑 Login Credentials:"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo ""
    echo "⚠️  Note: Enterprise setup requires database migrations to be run."
    echo "   The backend will need to be updated to support database operations."
}

function stop_services() {
    echo "🛑 Stopping ViWorkS Admin Panel services..."
    docker-compose -f $COMPOSE_FILE down 2>/dev/null || true
    docker-compose -f $COMPOSE_FILE_ENTERPRISE down 2>/dev/null || true
    echo "✅ All services stopped"
}

function show_status() {
    echo "📊 ViWorkS Admin Panel Status"
    echo ""
    docker ps --filter "name=viworks" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "🔍 Health Checks:"
    echo "   Backend:  $(curl -s http://localhost:8081/health 2>/dev/null | jq -r '.status // "unavailable"' 2>/dev/null || echo "unavailable")"
    echo "   Frontend: $(curl -s http://localhost:3000 >/dev/null 2>&1 && echo "healthy" || echo "unavailable")"
}

function show_logs() {
    echo "📋 ViWorkS Admin Panel Logs"
    echo ""
    echo "Backend logs:"
    docker logs viworks-backend-local 2>/dev/null || echo "Backend container not found"
    echo ""
    echo "Frontend logs:"
    docker logs viworks-frontend-local 2>/dev/null || echo "Frontend container not found"
}

function check_health() {
    echo "🏥 ViWorkS Admin Panel Health Check"
    echo ""
    
    # Check backend
    echo "Backend Health:"
    if curl -s http://localhost:8081/health >/dev/null 2>&1; then
        echo "  ✅ Backend is healthy"
        curl -s http://localhost:8081/health | jq '.' 2>/dev/null || curl -s http://localhost:8081/health
    else
        echo "  ❌ Backend is unavailable"
    fi
    
    echo ""
    echo "Frontend Health:"
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        echo "  ✅ Frontend is healthy"
    else
        echo "  ❌ Frontend is unavailable"
    fi
    
    echo ""
    echo "API Endpoints:"
    if curl -s http://localhost:8081/api/v1/admin/users >/dev/null 2>&1; then
        echo "  ✅ API endpoints are working"
    else
        echo "  ❌ API endpoints are unavailable"
    fi
}

function clean_all() {
    echo "🧹 Cleaning up ViWorkS Admin Panel..."
    echo "   This will stop and remove all containers and volumes!"
    echo ""
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose -f $COMPOSE_FILE down -v 2>/dev/null || true
        docker-compose -f $COMPOSE_FILE_ENTERPRISE down -v 2>/dev/null || true
        docker system prune -f
        echo "✅ Cleanup completed"
    else
        echo "❌ Cleanup cancelled"
    fi
}

# Main script logic
case "${1:-help}" in
    simple)
        deploy_simple
        ;;
    enterprise)
        deploy_enterprise
        ;;
    stop)
        stop_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    health)
        check_health
        ;;
    clean)
        clean_all
        ;;
    help|*)
        show_help
        ;;
esac
