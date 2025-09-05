Deploy Backend Agent
failed 2 minutes ago in 20s

3s
6s
2s
2s
Run actions/checkout@v4
Syncing repository: shaiannazari/viworksolution
Getting Git version info
Temporarily overriding HOME='/home/runner/work/_temp/7e788272-45cb-418d-912a-0ba879a04fc8' before making global git config changes
Adding repository directory to the temporary git global config as a safe directory
/usr/bin/git config --global --add safe.directory /home/runner/work/viworksolution/viworksolution
Deleting the contents of '/home/runner/work/viworksolution/viworksolution'
Initializing the repository
Disabling automatic garbage collection
Setting up auth
Fetching the repository
Determining the checkout info
/usr/bin/git sparse-checkout disable
/usr/bin/git config --local --unset-all extensions.worktreeConfig
Checking out the ref
/usr/bin/git log -1 --format=%H
7ef3b23e3b947a783a370ae628ea9926059ef10e
2s
Run actions/download-artifact@v4
Downloading single artifact
Preparing to download the following artifacts:
- viworks-backend-agent-built (ID: 3938464235, Size: 3085217, Expected Digest: sha256:b79334ecb50fe3be1d6876f41f24987f70364eab8264b234c89fff43a61c9b02)
Redirecting to blob download url: https://productionresultssa11.blob.core.windows.net/actions-results/5356af8b-1ebe-4341-bc24-2c6389fd86f0/workflow-job-run-8d126b32-343f-5c75-8fd9-ba79f2d8a859/artifacts/57a731019ee57d09acf9cf9b5b9683b16c74c9f99611ec4b9b398be1bd760532.zip
Starting download of artifact to: /home/runner/work/viworksolution/viworksolution
(node:2157) [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues. Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
SHA256 digest of downloaded artifact is b79334ecb50fe3be1d6876f41f24987f70364eab8264b234c89fff43a61c9b02
Artifact download completed successfully.
Total of 1 artifact(s) downloaded
Download artifact has finished successfully
0s
Run ls -la viworks-backend-agent-built
-rw-r--r-- 1 runner docker 7181976 Sep  5 15:29 viworks-backend-agent-built
viworks-backend-agent-built: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=d72152ca4ee38ebb15bd88d6ba4590c2e3c9c1d0, for GNU/Linux 3.2.0, stripped
Deploying binary size: 7181976 bytes
1s
Run appleboy/scp-action@v0.1.4
/usr/bin/docker run --name a6f384974ff0b5b4dd771b851d32_375970 --label 536036 --workdir /github/workspace --rm -e "CARGO_TERM_COLOR" -e "INPUT_HOST" -e "INPUT_USERNAME" -e "INPUT_KEY" -e "INPUT_SOURCE" -e "INPUT_TARGET" -e "INPUT_STRIP_COMPONENTS" -e "INPUT_PORT" -e "INPUT_PASSWORD" -e "INPUT_TIMEOUT" -e "INPUT_COMMAND_TIMEOUT" -e "INPUT_KEY_PATH" -e "INPUT_PASSPHRASE" -e "INPUT_FINGERPRINT" -e "INPUT_USE_INSECURE_CIPHER" -e "INPUT_RM" -e "INPUT_DEBUG" -e "INPUT_OVERWRITE" -e "INPUT_TAR_DEREFERENCE" -e "INPUT_TAR_TMP_PATH" -e "INPUT_TAR_EXEC" -e "INPUT_PROXY_HOST" -e "INPUT_PROXY_PORT" -e "INPUT_PROXY_USERNAME" -e "INPUT_PROXY_PASSWORD" -e "INPUT_PROXY_PASSPHRASE" -e "INPUT_PROXY_TIMEOUT" -e "INPUT_PROXY_KEY" -e "INPUT_PROXY_KEY_PATH" -e "INPUT_PROXY_FINGERPRINT" -e "INPUT_PROXY_USE_INSECURE_CIPHER" -e "HOME" -e "GITHUB_JOB" -e "GITHUB_REF" -e "GITHUB_SHA" -e "GITHUB_REPOSITORY" -e "GITHUB_REPOSITORY_OWNER" -e "GITHUB_REPOSITORY_OWNER_ID" -e "GITHUB_RUN_ID" -e "GITHUB_RUN_NUMBER" -e "GITHUB_RETENTION_DAYS" -e "GITHUB_RUN_ATTEMPT" -e "GITHUB_ACTOR_ID" -e "GITHUB_ACTOR" -e "GITHUB_WORKFLOW" -e "GITHUB_HEAD_REF" -e "GITHUB_BASE_REF" -e "GITHUB_EVENT_NAME" -e "GITHUB_SERVER_URL" -e "GITHUB_API_URL" -e "GITHUB_GRAPHQL_URL" -e "GITHUB_REF_NAME" -e "GITHUB_REF_PROTECTED" -e "GITHUB_REF_TYPE" -e "GITHUB_WORKFLOW_REF" -e "GITHUB_WORKFLOW_SHA" -e "GITHUB_REPOSITORY_ID" -e "GITHUB_TRIGGERING_ACTOR" -e "GITHUB_WORKSPACE" -e "GITHUB_ACTION" -e "GITHUB_EVENT_PATH" -e "GITHUB_ACTION_REPOSITORY" -e "GITHUB_ACTION_REF" -e "GITHUB_PATH" -e "GITHUB_ENV" -e "GITHUB_STEP_SUMMARY" -e "GITHUB_STATE" -e "GITHUB_OUTPUT" -e "RUNNER_OS" -e "RUNNER_ARCH" -e "RUNNER_NAME" -e "RUNNER_ENVIRONMENT" -e "RUNNER_TOOL_CACHE" -e "RUNNER_TEMP" -e "RUNNER_WORKSPACE" -e "ACTIONS_RUNTIME_URL" -e "ACTIONS_RUNTIME_TOKEN" -e "ACTIONS_CACHE_URL" -e "ACTIONS_RESULTS_URL" -e GITHUB_ACTIONS=true -e CI=true -v "/var/run/docker.sock":"/var/run/docker.sock" -v "/home/runner/work/_temp/_github_home":"/github/home" -v "/home/runner/work/_temp/_github_workflow":"/github/workflow" -v "/home/runner/work/_temp/_runner_file_commands":"/github/file_commands" -v "/home/runner/work/viworksolution/viworksolution":"/github/workspace" 536036:5558a6f384974ff0b5b4dd771b851d32
2025/09/05 15:29:05 Error: can't connect without a private SSH key or password
0s
0s
0s
