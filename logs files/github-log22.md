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
 
🔐 Implement real database authentication system #8
Jobs
Run details
Annotations
1 error
deploy
failed now in 41s

1s
2s
3s
2s
0s
0s
6s
3s
20s
#53 CACHED

#54 [website deps 3/4] COPY package.json pnpm-lock.yaml* ./
#54 CACHED

#55 [website builder 5/5] RUN npm run build
#55 CACHED

#56 [website runner 8/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#56 CACHED

#57 [backend builder 10/11] COPY migrations ./migrations
#57 DONE 0.1s

#58 [website] exporting to image
#58 exporting layers done
#58 writing image sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a done
#58 naming to docker.io/library/digitaloceandocker-website 0.0s done
#58 DONE 0.1s

#59 [backend builder 11/11] RUN cargo build --release
#59 ...

#60 [website] resolving provenance for metadata file
#60 DONE 0.0s

#59 [backend builder 11/11] RUN cargo build --release
#59 0.720    Compiling viworks-admin-backend v0.1.0 (/app)
#59 1.321 error[E0609]: no field `email` on type `actix_web::web::Json<CreateUserRequest>`
#59 1.321    --> src/main_demo.rs:357:59
#59 1.321     |
#59 1.321 357 |         match create_user_in_db(pool, &req.username, &req.email, &req.password).await {
#59 1.322     |                                                           ^^^^^ unknown field
#59 1.322     |
#59 1.322     = note: available field is: `0`
#59 1.322     = note: available fields are: `username`, `password`
#59 1.322 
#59 1.453 error[E0308]: mismatched types
#59 1.453    --> src/main_demo.rs:481:18
#59 1.453     |
#59 1.453 481 |         message: "Device registered successfully",
#59 1.453     |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^- help: try using a conversion method: `.to_string()`
#59 1.453     |                  |
#59 1.453     |                  expected `String`, found `&str`
#59 1.453 
#59 2.633 Some errors have detailed explanations: E0308, E0609.
#59 2.633 For more information about an error, try `rustc --explain E0308`.
#59 2.654 error: could not compile `viworks-admin-backend` (bin "viworks-backend") due to 2 previous errors
#59 ERROR: process "/bin/sh -c cargo build --release" did not complete successfully: exit code: 101
------
 > [backend builder 11/11] RUN cargo build --release:
1.453    --> src/main_demo.rs:481:18
1.453     |
1.453 481 |         message: "Device registered successfully",
1.453     |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^- help: try using a conversion method: `.to_string()`
1.453     |                  |
1.453     |                  expected `String`, found `&str`
1.453 
2.633 Some errors have detailed explanations: E0308, E0609.
2.633 For more information about an error, try `rustc --explain E0308`.
2.654 error: could not compile `viworks-admin-backend` (bin "viworks-backend") due to 2 previous errors
------
Dockerfile.fixed:33

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
1s
0s
