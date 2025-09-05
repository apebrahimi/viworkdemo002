# ViWorkS Backend Agent - Complete Architecture Documentation

**Date:** September 5, 2025  
**Version:** 1.0  
**Scope:** Complete analysis of Backend Agent architecture, services, and components

## Executive Summary

The ViWorkS Backend Agent is a sophisticated Rust-based microservice that serves as the central command and control hub for the ViWorkS platform. It manages Gateway Agent connections, processes commands, handles telemetry, and provides a comprehensive REST API for system administration.

## Architecture Overview

The Backend Agent follows a modular, service-oriented architecture with the following key components:

```
┌─────────────────────────────────────────────────────────────┐
│                    Backend Agent                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   HTTP API  │  │ WebSocket   │  │  Telemetry  │        │
│  │   Server    │  │   Server    │  │  Processor  │        │
│  │  (Port 8080)│  │ (Port 8081) │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │    Agent    │  │  Command    │  │    Data     │        │
│  │  Manager    │  │   Engine    │  │   Layer     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ PostgreSQL  │  │    Redis    │  │   Agent     │        │
│  │  Database   │  │    Cache    │  │  Registry   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## Core Services and Components

### 1. Agent Manager (`src/agent/manager.rs`)

**Purpose:** Central hub for managing Gateway Agent connections and lifecycle.

**Key Responsibilities:**
- WebSocket server management (Port 8081)
- Agent connection lifecycle (connect/disconnect)
- Command routing to specific agents
- Agent health monitoring
- Connection authentication and authorization

**Critical Issue Identified:** The WebSocket server is **NOT STARTING** in the current implementation. The `AgentManager::run_server_loop()` method is never called in `main.rs`.

**Key Methods:**
- `start()` - Initialize the agent manager
- `run_server_loop()` - **MISSING** - Should start WebSocket server on port 8081
- `register_agent()` - Register new agent connections
- `send_command_to_agent()` - Route commands to specific agents
- `get_agent()` - Retrieve agent information
- `list_agents()` - List all connected agents

### 2. Agent Registry (`src/agent/registry.rs`)

**Purpose:** In-memory registry for tracking connected agents and their metadata.

**Key Features:**
- Thread-safe agent tracking using `DashMap`
- Agent status management (Online/Offline/Degraded/Maintenance)
- Connection mapping (agent_id ↔ connection_id)
- Agent statistics and analytics
- Stale agent cleanup

**Data Structures:**
- `agents: DashMap<String, AgentInfo>` - Agent metadata
- `connections: DashMap<String, String>` - Agent to connection mapping
- `connection_agents: DashMap<String, String>` - Connection to agent mapping

### 3. Command Engine (`src/command/engine.rs`)

**Purpose:** Central command processing and execution orchestration.

**Key Responsibilities:**
- Command validation and schema checking
- Command queuing with priority support
- Concurrent command execution (semaphore-based)
- Command result processing
- Retry logic and failure handling
- Command history and analytics

**Architecture:**
- **Command Queue:** Priority-based queue with BinaryHeap
- **Command Executor:** Validates and routes commands to agents
- **Concurrency Control:** Semaphore-based limiting
- **State Management:** Pending → Executing → Completed/Failed

**Command States:**
- `Pending` - Queued for execution
- `Executing` - Currently being processed
- `Completed` - Successfully executed
- `Failed` - Execution failed
- `Cancelled` - Manually cancelled

### 4. Command Queue (`src/command/queue.rs`)

**Purpose:** Thread-safe command queuing system with priority support.

**Key Features:**
- Priority-based queuing (High/Normal/Low)
- FIFO ordering within same priority
- Command state tracking across multiple queues
- Retry mechanism with exponential backoff
- Queue statistics and monitoring

**Queue Structure:**
- `pending: DashMap<String, QueuedCommand>` - Waiting for execution
- `executing: DashMap<String, QueuedCommand>` - Currently executing
- `completed: DashMap<String, QueuedCommand>` - Successfully completed
- `failed: DashMap<String, QueuedCommand>` - Failed executions

### 5. Telemetry Processor (`src/telemetry/processor.rs`)

**Purpose:** Process and analyze telemetry data from Gateway Agents.

**Key Responsibilities:**
- Telemetry message processing
- Data storage and persistence
- Analytics and trend analysis
- Telemetry history management
- Background cleanup tasks

**Components:**
- **TelemetryStorage:** Persist telemetry data
- **TelemetryAnalytics:** Process and analyze data
- **Background Tasks:** Cleanup and analytics processing

### 6. HTTP API Server (`src/api/`)

**Purpose:** RESTful API for system administration and monitoring.

**Key Endpoints:**
- `GET /health` - Health check
- `GET /agents` - List all agents
- `GET /agents/{id}` - Get specific agent
- `POST /commands` - Submit new command
- `GET /commands/{id}` - Get command status
- `GET /telemetry/{agent_id}` - Get agent telemetry
- `GET /statistics` - System statistics

**Authentication:**
- JWT-based authentication
- Role-based access control (Admin/Operator/Viewer)
- Request validation and authorization

### 7. Data Layer (`src/data/`)

**Purpose:** Abstraction layer for data persistence and caching.

**Components:**
- **PostgreSQL Client:** Primary database operations
- **Redis Client:** Caching and session management
- **Data Models:** Type-safe data structures

**Database Schema:**
- `agents` - Agent registration and metadata
- `commands` - Command history and status
- `telemetry` - Telemetry data storage
- `audit_logs` - Security and operation logs

## Configuration

### Main Configuration (`src/config.rs`)

**Key Configuration Sections:**
- **Server:** HTTP and WebSocket server settings
- **Database:** PostgreSQL connection parameters
- **Redis:** Cache configuration
- **Security:** JWT secrets and authentication
- **Command:** Command processing limits and timeouts
- **Telemetry:** Data retention and processing settings

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `LOG_LEVEL` - Logging verbosity

## Critical Issues Identified

### 1. **P0 - WebSocket Server Not Starting**
**Location:** `src/main.rs:68-75`
**Issue:** The `AgentManager::run_server_loop()` method is never called, so the WebSocket server on port 8081 never starts.
**Impact:** Gateway Agents cannot connect to the Backend Agent.
**Fix Required:** Add WebSocket server startup in main.rs.

### 2. **P1 - Port Configuration Mismatch**
**Issue:** Nginx is configured to proxy to port 8080, but WebSocket server should be on port 8081.
**Impact:** WebSocket connections fail through Nginx.
**Fix Required:** Update Nginx configuration to proxy to port 8081.

### 3. **P2 - Missing Background Task Management**
**Issue:** Command and telemetry background tasks are not properly managed in main.rs.
**Impact:** Commands may not be processed and telemetry may not be cleaned up.
**Fix Required:** Add proper background task lifecycle management.

## Service Dependencies

### Internal Dependencies
```
main.rs
├── AgentManager (depends on DataLayer, Config)
├── CommandEngine (depends on AgentManager, DataLayer)
├── TelemetryProcessor (depends on DataLayer)
├── HTTP API Server (depends on all above)
└── DataLayer (PostgreSQL + Redis)
```

### External Dependencies
- **PostgreSQL:** Primary data storage
- **Redis:** Caching and session management
- **Nginx:** Reverse proxy and SSL termination

## Performance Characteristics

### Concurrency
- **Command Execution:** Semaphore-limited concurrent execution
- **Agent Connections:** Thread-safe connection management
- **Database Operations:** Connection pooling
- **Telemetry Processing:** Async message processing

### Scalability
- **Horizontal:** Multiple Backend Agent instances possible
- **Vertical:** CPU and memory scaling supported
- **Database:** Connection pooling and query optimization
- **Caching:** Redis-based caching layer

## Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Request signature validation
- Rate limiting and throttling

### Data Protection
- Encrypted database connections
- Secure credential storage
- Audit logging for all operations
- Input validation and sanitization

## Monitoring and Observability

### Metrics
- Agent connection counts
- Command execution statistics
- Telemetry processing rates
- System health indicators

### Logging
- Structured logging with tracing
- Request/response logging
- Error tracking and alerting
- Performance monitoring

## Deployment Architecture

### Container Configuration
- **Base Image:** Rust Alpine Linux
- **Ports:** 8080 (HTTP), 8081 (WebSocket)
- **Health Checks:** HTTP endpoint monitoring
- **Resource Limits:** CPU and memory constraints

### Environment Requirements
- **PostgreSQL:** 12+ with connection pooling
- **Redis:** 6+ for caching
- **Nginx:** 1.18+ for reverse proxy
- **SSL/TLS:** Valid certificates for HTTPS/WSS

## Troubleshooting Guide

### Common Issues
1. **WebSocket Connection Failures**
   - Check if WebSocket server is running on port 8081
   - Verify Nginx proxy configuration
   - Check SSL certificate validity

2. **Command Processing Issues**
   - Verify Command Engine is started
   - Check database connectivity
   - Review command queue status

3. **Agent Registration Problems**
   - Check Agent Registry status
   - Verify agent authentication
   - Review connection logs

### Debug Commands
```bash
# Check WebSocket server status
docker exec viworks-backend-agent-new netstat -tlnp | grep 8081

# Test WebSocket connection
curl -vk https://agent.neuratalent.com/ws/agent \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Version: 13"

# Check agent registry
curl -H "Authorization: Bearer <token>" \
  https://agent.neuratalent.com/agents
```

## Future Enhancements

### Planned Features
- **High Availability:** Multi-instance deployment
- **Load Balancing:** Agent connection distribution
- **Advanced Analytics:** Machine learning insights
- **Plugin System:** Extensible command handlers

### Performance Optimizations
- **Connection Pooling:** Enhanced database connections
- **Caching Strategy:** Advanced Redis usage
- **Async Processing:** Improved concurrency
- **Resource Management:** Better memory usage

---

**Note:** This documentation is based on the current codebase analysis. The critical WebSocket server issue must be resolved before the system can function properly.
