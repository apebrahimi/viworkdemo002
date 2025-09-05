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
 
🔧 CRITICAL FIX: Resolve container restart issue following fix-restart… #4
Jobs
Run details
Annotations
1 error
deploy
failed now in 34s

0s
2s
2s
2s
0s
0s
4s
2s
19s
#60 1.014     |
#60 1.014 221 | async fn device_bind_request(req: web::Json<DeviceBindRequest>) -> HttpResponse {
#60 1.015     |                              ^^^ help: if this is intentional, prefix it with an underscore: `_req`
#60 1.015     |
#60 1.015     = note: `#[warn(unused_variables)]` on by default
#60 1.015 
#60 1.021 warning: unused variable: `req`
#60 1.021    --> src/main_demo.rs:229:27
#60 1.022     |
#60 1.022 229 | async fn client_bootstrap(req: web::Json<ClientBootstrapRequest>, http_req: actix_web::HttpRequest) -> HttpResponse {
#60 1.022     |                           ^^^ help: if this is intentional, prefix it with an underscore: `_req`
#60 1.022 
#60 1.027 warning: unused variable: `req`
#60 1.027    --> src/main_demo.rs:267:22
#60 1.027     |
#60 1.027 267 | async fn create_user(req: web::Json<CreateUserRequest>) -> HttpResponse {
#60 1.027     |                      ^^^ help: if this is intentional, prefix it with an underscore: `_req`
#60 1.027 
#60 1.033 warning: unused variable: `req`
#60 1.033    --> src/main_demo.rs:274:26
#60 1.033     |
#60 1.033 274 | async fn spawn_container(req: web::Json<SpawnContainerRequest>) -> HttpResponse {
#60 1.033     |                          ^^^ help: if this is intentional, prefix it with an underscore: `_req`
#60 1.033 
#60 1.038 warning: unused variable: `req`
#60 1.038    --> src/main_demo.rs:287:28
#60 1.038     |
#60 1.038 287 | async fn terminate_session(req: web::Json<TerminateSessionRequest>) -> HttpResponse {
#60 1.038     |                            ^^^ help: if this is intentional, prefix it with an underscore: `_req`
#60 1.039 
#60 1.645 error[E0382]: borrow of moved value: `host`
#60 1.646    --> src/main_demo.rs:491:61
#60 1.647     |
#60 1.647 361 |     let host = std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
#60 1.648     |         ---- move occurs because `host` has type `std::string::String`, which does not implement the `Copy` trait
#60 1.648 ...
#60 1.648 485 |     .bind((host, port))?;
#60 1.649     |            ---- value moved here
#60 1.649 ...
#60 1.649 491 |     log::info!("✅ ViWorkS Backend is now running on {}:{}", host, port);
#60 1.650     |                                                              ^^^^ value borrowed here after move
#60 1.650     |
#60 1.650     = note: this error originates in the macro `$crate::__private_api::format_args` which comes from the expansion of the macro `log::info` (in Nightly builds, run with -Z macro-backtrace for more info)
#60 1.651 
#60 1.729 For more information about this error, try `rustc --explain E0382`.
Dockerfile.fixed:33
#60 1.747 warning: `viworks-admin-backend` (bin "viworks-backend") generated 5 warnings
#60 1.748 error: could not compile `viworks-admin-backend` (bin "viworks-backend") due to 1 previous error; 5 warnings emitted
#60 ERROR: process "/bin/sh -c cargo build --release" did not complete successfully: exit code: 101
------
 > [backend builder 11/11] RUN cargo build --release:
1.033     |                          ^^^ help: if this is intentional, prefix it with an underscore: `_req`
1.033 
1.038 warning: unused variable: `req`
1.038    --> src/main_demo.rs:287:28
1.038     |
1.038 287 | async fn terminate_session(req: web::Json<TerminateSessionRequest>) -> HttpResponse {
1.038     |                            ^^^ help: if this is intentional, prefix it with an underscore: `_req`
1.039 
: `viworks-admin-backend` (bin "viworks-backend") generated 5 warnings
1.748 error: could not compile `viworks-admin-backend` (bin "viworks-backend") due to 1 previous error; 5 warnings emitted
------

--------------------

  31 |     

  32 |     # Build the application

  33 | >>> RUN cargo build --release

  34 |     

  35 |     # Runtime stage (Alpine)

--------------------

target backend: failed to solve: process "/bin/sh -c cargo build --release" did not complete successfully: exit code: 101

Error: Process completed with exit code 1.
0s
0s
0s
0s
