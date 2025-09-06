# ViWorkS Makefile

.PHONY: help verify clean build up down logs

help: ## Show this help message
	@echo "ViWorkS Development Commands"
	@echo "=========================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

verify: ## Run verification script to check all services
	@echo "🔍 Running verification script..."
	@cd "digital ocean docker" && ../scripts/dev/verify.sh

build: ## Build all services
	@echo "🔨 Building all services..."
	@cd "digital ocean docker" && docker-compose build

up: ## Start all services
	@echo "🚀 Starting all services..."
	@cd "digital ocean docker" && docker-compose up -d

down: ## Stop all services
	@echo "🛑 Stopping all services..."
	@cd "digital ocean docker" && docker-compose down

logs: ## Show logs from all services
	@echo "📋 Showing logs from all services..."
	@cd "digital ocean docker" && docker-compose logs -f

clean: ## Clean up containers and images
	@echo "🧹 Cleaning up containers and images..."
	@cd "digital ocean docker" && docker-compose down -v --rmi all

restart: down up ## Restart all services

status: ## Show status of all containers
	@echo "📊 Container status:"
	@cd "digital ocean docker" && docker-compose ps
