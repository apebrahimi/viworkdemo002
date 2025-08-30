# Fast Development Build Script
param(
    [switch]$Clean,
    [switch]$Release,
    [switch]$Help
)

if ($Help) {
    Write-Host "Fast Development Build Script"
    Write-Host "Usage: .\fast_build.ps1 [options]"
    Write-Host "Options: -Clean, -Release, -Help"
    exit 0
}

Write-Host "Fast Development Build Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Set build mode
$build_mode = if ($Release) { "release" } else { "debug" }
Write-Host "Build Mode: $build_mode" -ForegroundColor Yellow

# Clean if requested
if ($Clean) {
    Write-Host "Cleaning previous build artifacts..." -ForegroundColor Yellow
    if (Test-Path "target") {
        Remove-Item -Recurse -Force "target"
        Write-Host "✅ Target directory removed" -ForegroundColor Green
    }
}

# Set environment variables for faster builds
$env:CARGO_INCREMENTAL = "1"
$env:RUSTFLAGS = "-C debuginfo=0"

if (-not $Release) {
    $env:RUSTFLAGS += " -C opt-level=0"
}

Write-Host "Building with optimizations for speed..." -ForegroundColor Yellow

# Build only the main application
$build_cmd = "cargo build"
if ($Release) {
    $build_cmd += " --release"
}
$build_cmd += " -p viworks-desktop"

Write-Host "Executing: $build_cmd" -ForegroundColor Yellow
$start_time = Get-Date

try {
    Invoke-Expression $build_cmd
    
    $end_time = Get-Date
    $duration = $end_time - $start_time
    
    Write-Host "Build completed successfully!" -ForegroundColor Green
    Write-Host "Build time: $($duration.TotalSeconds.ToString('F1')) seconds" -ForegroundColor Green
    
    # Show executable location
    $exe_path = if ($Release) { "target\release\viworks-desktop.exe" } else { "target\debug\viworks-desktop.exe" }
    if (Test-Path $exe_path) {
        $size = (Get-Item $exe_path).Length / 1MB
        Write-Host "Executable: $exe_path ($($size.ToString('F1')) MB)" -ForegroundColor Green
        
        # Copy runtime dependencies to the same directory as the executable
        Write-Host "Copying runtime dependencies..." -ForegroundColor Yellow
        $exe_dir = Split-Path $exe_path -Parent
        $binaries_dir = "binaries"
        
        if (Test-Path $binaries_dir) {
            # Copy all files from binaries directory to executable directory
            Copy-Item "$binaries_dir\*" $exe_dir -Force
            Write-Host "Runtime dependencies copied to: $exe_dir" -ForegroundColor Green
        } else {
            Write-Host "Binaries directory not found: $binaries_dir" -ForegroundColor Yellow
            Write-Host "   Make sure all required DLLs and executables are in the binaries folder" -ForegroundColor Yellow
        }
        
        Write-Host "Ready to run!" -ForegroundColor Green
        Write-Host "You can now run: $exe_path" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Build failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
