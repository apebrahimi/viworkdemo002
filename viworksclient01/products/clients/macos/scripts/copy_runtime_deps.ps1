# Copy Runtime Dependencies Script
# This script copies all required runtime dependencies to the target directory
# so the client executable can run properly during development and testing

param(
    [string]$Target = "debug",  # debug or release
    [switch]$Help
)

if ($Help) {
    Write-Host "Copy Runtime Dependencies Script"
    Write-Host "Usage: .\copy_runtime_deps.ps1 [options]"
    Write-Host "Options:"
    Write-Host "  -Target <mode>    Target mode: debug (default) or release"
    Write-Host "  -Help             Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\copy_runtime_deps.ps1              # Copy to debug target"
    Write-Host "  .\copy_runtime_deps.ps1 -Target release  # Copy to release target"
    exit 0
}

Write-Host "Copy Runtime Dependencies Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Validate target mode
if ($Target -notin @("debug", "release")) {
    Write-Host "Invalid target mode: $Target" -ForegroundColor Red
    Write-Host "   Valid options: debug, release" -ForegroundColor Yellow
    exit 1
}

Write-Host "Target Mode: $Target" -ForegroundColor Yellow

# Define paths
$binaries_dir = "binaries"
$target_dir = "target\$Target"

# Check if binaries directory exists
if (-not (Test-Path $binaries_dir)) {
    Write-Host "Binaries directory not found: $binaries_dir" -ForegroundColor Red
    Write-Host "   Please ensure all runtime dependencies are in the binaries folder" -ForegroundColor Yellow
    exit 1
}

# Check if target directory exists
if (-not (Test-Path $target_dir)) {
    Write-Host "Target directory not found: $target_dir" -ForegroundColor Red
    Write-Host "   Please build the project first using: cargo build --$Target" -ForegroundColor Yellow
    exit 1
}

# Copy all files from binaries to target directory
Write-Host "Copying runtime dependencies..." -ForegroundColor Yellow

try {
    # Get list of files to copy
    $files = Get-ChildItem $binaries_dir -File
    $fileCount = $files.Count
    
    Write-Host "   Found $fileCount files to copy" -ForegroundColor Blue
    
    # Copy each file
    foreach ($file in $files) {
        $source = $file.FullName
        $destination = Join-Path $target_dir $file.Name
        
        Copy-Item $source $destination -Force
        Write-Host "   $($file.Name)" -ForegroundColor Green
    }
    
    Write-Host "Successfully copied $fileCount runtime dependencies to: $target_dir" -ForegroundColor Green
    
    # Show what was copied
    Write-Host ""
    Write-Host "Runtime dependencies in ${target_dir}:" -ForegroundColor Cyan
    $copiedFiles = Get-ChildItem $target_dir -File | Where-Object { $_.Name -match "\.(exe|dll|pem|cnf|conf)$" }
    foreach ($file in $copiedFiles) {
        $size = [math]::Round($file.Length / 1KB, 1)
        Write-Host "   $($file.Name) ($size KB)" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "The client executable can now run properly!" -ForegroundColor Green
    Write-Host "You can test it by running: $target_dir\viworks-desktop.exe" -ForegroundColor Cyan
    
} catch {
    Write-Host "Failed to copy runtime dependencies!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
