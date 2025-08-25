# Test Connection Manager Logs
Write-Host "🔍 Testing Connection Manager Logs..." -ForegroundColor Cyan

# Set logging environment
$env:RUST_LOG = "info"

# Run a simple test to see connection manager output
Write-Host "📋 This will show the detailed connection logs:" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Cyan

# Run the application and capture output
$output = & .\target\debug\viworks-desktop.exe 2>&1

# Display the output
Write-Host $output -ForegroundColor White
