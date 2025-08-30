# Simple script to run the ViWorkS desktop application
param(
    [switch]$Release,
    [switch]$Help
)

if ($Help) {
    Write-Host "Run ViWorkS Desktop Application"
    Write-Host "Usage: .\run_app.ps1 [options]"
    Write-Host "Options:"
    Write-Host "  -Release    Run release version instead of debug"
    Write-Host "  -Help       Show this help message"
    exit 0
}

Write-Host "🚀 Starting ViWorkS Desktop Application..." -ForegroundColor Cyan

# Determine target mode
$target_mode = if ($Release) { "release" } else { "debug" }
$target_dir = "target\$target_mode"

Write-Host "Target Mode: $target_mode" -ForegroundColor Yellow

# Check if executable exists
$exe_path = "$target_dir\viworks-desktop.exe"
if (-not (Test-Path $exe_path)) {
    Write-Host "❌ Executable not found: $exe_path" -ForegroundColor Red
    Write-Host "   Please build the project first using: cargo build --$target_mode" -ForegroundColor Yellow
    exit 1
}

# Ensure runtime dependencies are copied
Write-Host "📦 Ensuring runtime dependencies are available..." -ForegroundColor Yellow
$binaries_dir = "binaries"

if (Test-Path $binaries_dir) {
    # Copy dependencies if they don't exist in target directory
    $missing_deps = @()
    $required_files = @("fwknop.exe", "openvpn.exe", "stunnel.exe", "libcrypto-3-x64.dll", "libssl-3-x64.dll")
    
    foreach ($file in $required_files) {
        $target_file = "$target_dir\$file"
        if (-not (Test-Path $target_file)) {
            $missing_deps += $file
        }
    }
    
    if ($missing_deps.Count -gt 0) {
        Write-Host "   Copying missing dependencies..." -ForegroundColor Blue
        Copy-Item "$binaries_dir\*" $target_dir -Force
        Write-Host "   ✅ Runtime dependencies copied" -ForegroundColor Green
    } else {
        Write-Host "   ✅ All runtime dependencies already present" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Binaries directory not found: $binaries_dir" -ForegroundColor Yellow
    Write-Host "   Make sure all required DLLs and executables are available" -ForegroundColor Yellow
}

# Change to the target directory where the executable and binaries are located
Set-Location $target_dir

# Run the application
Write-Host "📁 Running from: $(Get-Location)" -ForegroundColor Yellow
Write-Host "🔧 Executable: viworks-desktop.exe" -ForegroundColor Yellow

try {
    .\viworks-desktop.exe
} catch {
    Write-Host "❌ Failed to start application: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
