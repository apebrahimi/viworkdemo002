Deploy Backend Agent (Replicated Build Process)
 
Fix deployment workflows: update repository URL and secret names #2
Jobs
Run details
Deploy Backend Agent
failed now in 43s

1s
5s
2s
1s
1s
0s
8s
6s
17s
Run appleboy/ssh-action@v0.1.5
/usr/bin/docker run --name a52b789d946c118be413fa380cf376f5b1f17_a64279 --label 4a52b7 --workdir /github/workspace --rm -e "CARGO_TERM_COLOR" -e "INPUT_HOST" -e "INPUT_USERNAME" -e "INPUT_KEY" -e "INPUT_SCRIPT" -e "INPUT_PORT" -e "INPUT_PASSPHRASE" -e "INPUT_PASSWORD" -e "INPUT_SYNC" -e "INPUT_USE_INSECURE_CIPHER" -e "INPUT_CIPHER" -e "INPUT_TIMEOUT" -e "INPUT_COMMAND_TIMEOUT" -e "INPUT_KEY_PATH" -e "INPUT_FINGERPRINT" -e "INPUT_PROXY_HOST" -e "INPUT_PROXY_PORT" -e "INPUT_PROXY_USERNAME" -e "INPUT_PROXY_PASSWORD" -e "INPUT_PROXY_PASSPHRASE" -e "INPUT_PROXY_TIMEOUT" -e "INPUT_PROXY_KEY" -e "INPUT_PROXY_KEY_PATH" -e "INPUT_PROXY_FINGERPRINT" -e "INPUT_PROXY_CIPHER" -e "INPUT_PROXY_USE_INSECURE_CIPHER" -e "INPUT_SCRIPT_STOP" -e "INPUT_ENVS" -e "INPUT_DEBUG" -e "HOME" -e "GITHUB_JOB" -e "GITHUB_REF" -e "GITHUB_SHA" -e "GITHUB_REPOSITORY" -e "GITHUB_REPOSITORY_OWNER" -e "GITHUB_REPOSITORY_OWNER_ID" -e "GITHUB_RUN_ID" -e "GITHUB_RUN_NUMBER" -e "GITHUB_RETENTION_DAYS" -e "GITHUB_RUN_ATTEMPT" -e "GITHUB_ACTOR_ID" -e "GITHUB_ACTOR" -e "GITHUB_WORKFLOW" -e "GITHUB_HEAD_REF" -e "GITHUB_BASE_REF" -e "GITHUB_EVENT_NAME" -e "GITHUB_SERVER_URL" -e "GITHUB_API_URL" -e "GITHUB_GRAPHQL_URL" -e "GITHUB_REF_NAME" -e "GITHUB_REF_PROTECTED" -e "GITHUB_REF_TYPE" -e "GITHUB_WORKFLOW_REF" -e "GITHUB_WORKFLOW_SHA" -e "GITHUB_REPOSITORY_ID" -e "GITHUB_TRIGGERING_ACTOR" -e "GITHUB_WORKSPACE" -e "GITHUB_ACTION" -e "GITHUB_EVENT_PATH" -e "GITHUB_ACTION_REPOSITORY" -e "GITHUB_ACTION_REF" -e "GITHUB_PATH" -e "GITHUB_ENV" -e "GITHUB_STEP_SUMMARY" -e "GITHUB_STATE" -e "GITHUB_OUTPUT" -e "RUNNER_OS" -e "RUNNER_ARCH" -e "RUNNER_NAME" -e "RUNNER_ENVIRONMENT" -e "RUNNER_TOOL_CACHE" -e "RUNNER_TEMP" -e "RUNNER_WORKSPACE" -e "ACTIONS_RUNTIME_URL" -e "ACTIONS_RUNTIME_TOKEN" -e "ACTIONS_CACHE_URL" -e "ACTIONS_RESULTS_URL" -e GITHUB_ACTIONS=true -e CI=true -v "/var/run/docker.sock":"/var/run/docker.sock" -v "/home/runner/work/_temp/_github_home":"/github/home" -v "/home/runner/work/_temp/_github_workflow":"/github/workflow" -v "/home/runner/work/_temp/_runner_file_commands":"/github/file_commands" -v "/home/runner/work/viworksolution/viworksolution":"/github/workspace" 4a52b7:89d946c118be413fa380cf376f5b1f17
======CMD======
# Make binary executable
chmod +x /opt/viworks/deployments/backend-agent/viworks-backend-agent

# Stop current agent process
docker exec viworks-backend-agent-new bash -c "pkill -f viworks-backend-agent" || true

# Wait for process to stop
sleep 5

# Copy binary to container
docker cp /opt/viworks/deployments/backend-agent/viworks-backend-agent viworks-backend-agent-new:/app/

# Copy configuration to container
docker cp /opt/viworks/deployments/backend-agent/config/backend-agent.toml viworks-backend-agent-new:/app/config/

# Start container with new binary
docker exec viworks-backend-agent-new bash -c "cd /app && nohup ./viworks-backend-agent > /dev/null 2>&1 &"

# Wait for startup
sleep 10

# Verify deployment
curl -k https://agent.neuratalent.com/health || {
  echo "Deployment verification failed, rolling back..."
  docker exec viworks-backend-agent-new bash -c "pkill -f viworks-backend-agent"
  if [ -f /opt/viworks/deployments/backend-agent/viworks-backend-agent.backup.$(date +%Y%m%d_%H%M%S) ]; then
    cp /opt/viworks/deployments/backend-agent/viworks-backend-agent.backup.$(date +%Y%m%d_%H%M%S) /opt/viworks/deployments/backend-agent/viworks-backend-agent
    docker exec viworks-backend-agent-new bash -c "cd /app && nohup ./viworks-backend-agent > /dev/null 2>&1 &"
  fi
  exit 1
}

echo "Deployment successful!"

======END======
err: Error response from daemon: cannot overwrite non-directory "/app/viworks-backend-agent" with directory "/app"
err: lstat /opt/viworks/deployments/backend-agent/config: no such file or directory
err:   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
err:                                  Dload  Upload   Total   Spent    Left  Speed
err: 
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
out: Deployment verification failed, rolling back...
err: curl: (7) Failed to connect to agent.neuratalent.com port 443 after 17 ms: Connection refused
2025/09/05 15:41:05 Process exited with status 1
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
out: 
err: 
err: 
out: 
err: 
out: 
err: 
out: 
0s
