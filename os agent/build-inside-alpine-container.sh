# Extract source code inside container
docker exec viworks-build-temp sh -c "
set -e
cd /tmp
tar -xzf viworks-source-*.tar.gz
cd viworks-source-*

# Install additional dependencies
apk add --no-cache musl-dev openssl-dev

# Build the agent
echo 'Building ViWorkS Gateway Agent...'
cargo build --release

# Check if build was successful
if [ -f 'target/release/viworks-gateway-agent' ]; then
    echo 'Build successful!'
    ls -la target/release/viworks-gateway-agent
    file target/release/viworks-gateway-agent
else
    echo 'Build failed!'
    exit 1
fi

# Copy binary out of container
cp target/release/viworks-gateway-agent /tmp/viworks-agent-alpine
echo 'Binary ready at /tmp/viworks-agent-alpine'
"
