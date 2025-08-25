# Fast Development Build Script
# This script provides quick builds for development and testing

param(
    [switch]$Clean,
    [switch]$Release,
    [switch]$Help
)

if ($Help) {
    Write-Host "Fast Development Build Script"
    Write-Host "Usage: .\dev_build.ps1 [options]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Clean     Clean build (removes target directory)"
    Write-Host "  -Release   Build in release mode (slower but optimized)"
    Write-Host "  -Help      Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\dev_build.ps1              # Fast debug build"
    Write-Host "  .\dev_build.ps1 -Clean       # Clean debug build"
    Write-Host "  .\dev_build.ps1 -Release     # Release build"
    exit 0
}

$ErrorActionPreference = "Stop"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

Write-ColorOutput "🚀 Fast Development Build Script" "Cyan"
Write-ColorOutput "=========================================" "Cyan"

# Set build mode
$build_mode = if ($Release) { "release" } else { "debug" }
Write-ColorOutput "Build Mode: $build_mode" "Yellow"

# Clean if requested
if ($Clean) {
    Write-ColorOutput "🧹 Cleaning previous build artifacts..." "Yellow"
    if (Test-Path "target") {
        Remove-Item -Recurse -Force "target"
        Write-ColorOutput "✅ Target directory removed" "Green"
    }
}

# Set environment variables for faster builds
$env:CARGO_INCREMENTAL = "1"
$env:RUSTFLAGS = "-C debuginfo=0"

if (-not $Release) {
    # For debug builds, disable some optimizations for speed
    $env:RUSTFLAGS += " -C opt-level=0"
}

Write-ColorOutput "⚡ Building with optimizations for speed..." "Yellow"

# Build only the main application
$build_cmd = "cargo build"
if ($Release) {
    $build_cmd += " --release"
}
$build_cmd += " -p viworks-desktop"

Write-ColorOutput "🔨 Executing: $build_cmd" "Yellow"
$start_time = Get-Date

try {
    Invoke-Expression $build_cmd
    
    $end_time = Get-Date
    $duration = $end_time - $start_time
    
    Write-ColorOutput "✅ Build completed successfully!" "Green"
    Write-ColorOutput "⏱️  Build time: $($duration.TotalSeconds.ToString('F1')) seconds" "Green"
    
    # Show executable location
    $exe_path = if ($Release) { "target\release\viworks-desktop.exe" } else { "target\debug\viworks-desktop.exe" }
    if (Test-Path $exe_path) {
        $size = (Get-Item $exe_path).Length / 1MB
        Write-ColorOutput "📁 Executable: $exe_path ($($size.ToString('F1')) MB)" "Green"
        Write-ColorOutput "🚀 Ready to run!" "Green"
    }
    
} catch {
    Write-ColorOutput "❌ Build failed!" "Red"
    Write-ColorOutput "Error: $($_.Exception.Message)" "Red"
    exit 1
}
