# Run ViWorkS Desktop with detailed logging
Write-Host "🚀 Starting ViWorkS Desktop with detailed logging..." -ForegroundColor Cyan

# Set environment variables for detailed logging
$env:RUST_LOG = "info"
$env:RUST_BACKTRACE = "1"

# Run the application
Write-Host "📋 Logging Level: INFO" -ForegroundColor Yellow
Write-Host "🔍 All connection details will be shown in the console" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Cyan

# Run the application
.\target\debug\viworks-desktop.exe
