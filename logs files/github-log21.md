Skip to content
Navigation Menu
shaiannazari
viworksolution
 
Type / to search
Code
Issues
Pull requests
Actions
Projects
Security
Insights
Settings
Deploy ViWorks with Authentication Backend
🔧 Fix Rust compilation errors #5
Jobs
Run details
deploy
Started 5m 23s ago

1s
2s
3s
2s
0s
0s
6s
2s
4m 52s
✅ Services are starting up...
🔍 Checking individual service health...
🔍 Checking postgres health...
✅ postgres is healthy
🔍 Checking redis health...
✅ redis is healthy
🔍 Checking backend health...
✅ backend is healthy
🔍 Checking frontend health...
✅ frontend is healthy
🔍 Checking nginx health...
✅ nginx is healthy
📊 Checking service status...
NAME               IMAGE                         COMMAND                  SERVICE    CREATED         STATUS                                  PORTS
viworks-backend    digitaloceandocker-backend    "/usr/bin/dumb-init …"   backend    8 seconds ago   Restarting (1) Less than a second ago   
viworks-frontend   digitaloceandocker-frontend   "dumb-init -- node s…"   frontend   8 seconds ago   Up 1 second (health: starting)          
viworks-nginx      nginx:alpine                  "/docker-entrypoint.…"   nginx      8 seconds ago   Up 1 second (health: starting)          0.0.0.0:80->80/tcp, [::]:80->80/tcp, 0.0.0.0:443->443/tcp, [::]:443->443/tcp
viworks-postgres   postgres:15-alpine            "docker-entrypoint.s…"   postgres   9 seconds ago   Up 7 seconds (healthy)                  
viworks-redis      redis:7-alpine                "docker-entrypoint.s…"   redis      9 seconds ago   Up 7 seconds (healthy)                  
viworks-website    digitaloceandocker-website    "docker-entrypoint.s…"   website    9 seconds ago   Up 7 seconds (healthy)                  
🧪 Testing endpoints through nginx proxy...
Testing http://localhost:3000...
⏳ http://localhost:3000 not ready yet... (1/10)
⏳ http://localhost:3000 not ready yet... (2/10)
⏳ http://localhost:3000 not ready yet... (3/10)
⏳ http://localhost:3000 not ready yet... (4/10)
⏳ http://localhost:3000 not ready yet... (5/10)
⏳ http://localhost:3000 not ready yet... (6/10)
⏳ http://localhost:3000 not ready yet... (7/10)
⏳ http://localhost:3000 not ready yet... (8/10)
⏳ http://localhost:3000 not ready yet... (9/10)
⏳ http://localhost:3000 not ready yet... (10/10)
Testing http://localhost:8081/health...
⏳ http://localhost:8081/health not ready yet... (1/10)
⏳ http://localhost:8081/health not ready yet... (2/10)
⏳ http://localhost:8081/health not ready yet... (3/10)
⏳ http://localhost:8081/health not ready yet... (4/10)
⏳ http://localhost:8081/health not ready yet... (5/10)
⏳ http://localhost:8081/health not ready yet... (6/10)
⏳ http://localhost:8081/health not ready yet... (7/10)
⏳ http://localhost:8081/health not ready yet... (8/10)
⏳ http://localhost:8081/health not ready yet... (9/10)
⏳ http://localhost:8081/health not ready yet... (10/10)
🧪 Testing nginx proxy endpoints...
Testing nginx proxy...
⏳ Nginx not ready yet... (1/10)
⏳ Nginx not ready yet... (2/10)
⏳ Nginx not ready yet... (3/10)
⏳ Nginx not ready yet... (4/10)
⏳ Nginx not ready yet... (5/10)
⏳ Nginx not ready yet... (6/10)
⏳ Nginx not ready yet... (7/10)
⏳ Nginx not ready yet... (8/10)
⏳ Nginx not ready yet... (9/10)
⏳ Nginx not ready yet... (10/10)
🔍 Running backend-specific tests...
Testing database connection...
Error response from daemon: Container 2838dff84bf3efa5c19fa959f54a87fffe73012329eb6292bf5a3df6c609f3ab is restarting, wait until the container is running
❌ Database connection failed
Testing Redis connection...
Error response from daemon: Container 2838dff84bf3efa5c19fa959f54a87fffe73012329eb6292bf5a3df6c609f3ab is restarting, wait until the container is running
❌ Redis connection failed
Testing backend API endpoints...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
❌ Backend health check failed
🔐 Testing authentication endpoints...
Testing login endpoint...
❌ Auth endpoint test failed
Testing 2FA endpoint...
❌ 2FA endpoint test failed
📊 Checking resource usage...
curl: (7) Failed to connect to localhost port 8081 after 0 ms: Connection refused
No viworks containers found
📋 Recent logs (last 20 lines each):
Backend logs:
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:158: ERROR:  relation "idx_desktop_devices_user_id" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:159: ERROR:  relation "idx_mobile_devices_user_id" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:160: ERROR:  relation "idx_otp_challenges_user_id" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:161: ERROR:  relation "idx_otp_challenges_expires_at" already exists
viworks-backend  | CREATE FUNCTION
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:173: ERROR:  trigger "update_users_updated_at" for relation "users" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:174: ERROR:  trigger "update_policies_updated_at" for relation "policies" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:184: ERROR:  duplicate key value violates unique constraint "users_username_key"
viworks-backend  | DETAIL:  Key (username)=(admin) already exists.
viworks-backend  | INSERT 0 1
viworks-backend  | 2025-09-05 22:28:43. | ✅ Migration 001_initial_schema.sql completed successfully
viworks-backend  | 2025-09-05 22:28:43. | ✅ All database migrations completed successfully
viworks-backend  | 2025-09-05 22:28:43. | 🚀 Launching application...
viworks-backend  | 2025-09-05 22:28:43. | 📊 Binary size: 6.6M
viworks-backend  | 2025-09-05 22:28:43. | 📊 Binary permissions: -rwxr-xr-x    1 appuser  appuser    6937120 Sep  5 22:26 /app/app
viworks-backend  | [2025-09-05T22:28:43Z INFO  viworks_backend] 🚀 Starting ViWorkS Admin Panel Backend (Demo Mode)
viworks-backend  | [2025-09-05T22:28:43Z INFO  viworks_backend] 🔧 Environment: HOST=0.0.0.0, PORT=8081
viworks-backend  | 🚨 Application panicked: PanicHookInfo { payload: Any { .. }, location: Location { file: "/usr/local/cargo/registry/src/index.crates.io-1949cf8c6b5b557f/tracing-subscriber-0.3.20/src/util.rs", line: 91, column: 14 }, can_unwind: true, force_no_backtrace: false }
viworks-backend  | 🚨 Location: Some(Location { file: "/usr/local/cargo/registry/src/index.crates.io-1949cf8c6b5b557f/tracing-subscriber-0.3.20/src/util.rs", line: 91, column: 14 })
viworks-backend  | 🚨 Payload: None
PostgreSQL logs:
viworks-postgres  | 2025-09-05 22:28:43.404 UTC [156] ERROR:  relation "idx_mobile_devices_user_id" already exists
14s
