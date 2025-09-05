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
 
🔧 Fix Docker build issue with main_demo.rs #2
Jobs
Run details
deploy
failed now in 6m 56s

1s
2s
3s
3s
0s
0s
6s
3s
6m 34s
#56 355.5    Compiling reqwest v0.11.27
#56 355.9    Compiling jsonwebtoken v9.3.1
#56 359.6    Compiling sqlx v0.8.6
#56 359.7    Compiling bcrypt v0.15.1
#56 360.2    Compiling actix-web-actors v4.3.1+deprecated
#56 362.1    Compiling actix-cors v0.7.1
#56 371.7    Compiling viworks-admin-backend v0.1.0 (/app)
#56 371.7 error: couldn't read `src/main_demo.rs`: No such file or directory (os error 2)
#56 371.7 
#56 371.7 error: could not compile `viworks-admin-backend` (bin "viworks-backend") due to 1 previous error
#56 371.7 warning: build failed, waiting for other jobs to finish...
#56 ERROR: process "/bin/sh -c cargo build --release" did not complete successfully: exit code: 101
------
 > [backend builder  7/11] RUN cargo build --release:
355.9    Compiling jsonwebtoken v9.3.1
359.6    Compiling sqlx v0.8.6
359.7    Compiling bcrypt v0.15.1
360.2    Compiling actix-web-actors v4.3.1+deprecated
362.1    Compiling actix-cors v0.7.1
371.7    Compiling viworks-admin-backend v0.1.0 (/app)
371.7 error: couldn't read `src/main_demo.rs`: No such file or directory (os error 2)
371.7 
371.7 error: could not compile `viworks-admin-backend` (bin "viworks-backend") due to 1 previous error
371.7 warning: build failed, waiting for other jobs to finish...
------
Dockerfile.fixed:25
--------------------
  23 |     
  24 |     # Build dependencies (warm cache)
  25 | >>> RUN cargo build --release
  26 |     
  27 |     # Remove dummy main.rs and copy real source
--------------------
target backend: failed to solve: process "/bin/sh -c cargo build --release" did not complete successfully: exit code: 101
Error: Process completed with exit code 1.
0s
0s
Run if [ failure == 'success' ]; then
❌ Deployment failed. Check the logs above for details.
🔧 Manual troubleshooting may be required on the server.
🔍 Run './check-backend-status.sh' on the server for diagnostics.
1s
Post job cleanup.
/usr/bin/git version
git version 2.51.0
Temporarily overriding HOME='/home/runner/work/_temp/94281e32-2f50-4e35-9fc3-3c6a5562e77c' before making global git config changes
Adding repository directory to the temporary git global config as a safe directory
/usr/bin/git config --global --add safe.directory /home/runner/work/viworksolution/viworksolution
/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
http.https://github.com/.extraheader
/usr/bin/git config --local --unset-all http.https://github.com/.extraheader
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
0s
