# ViWorkS Client Distribution Package Creator
# This script creates a standalone distribution package for clients

param(
    [string]$Version = "1.0.0",
    [string]$OutputDir = "dist"
)

Write-Host "Creating ViWorkS Client Distribution Package v$Version" -ForegroundColor Green

# Create output directory
if (Test-Path $OutputDir) {
    Remove-Item $OutputDir -Recurse -Force
}
New-Item -ItemType Directory -Path $OutputDir | Out-Null

# Create subdirectories
New-Item -ItemType Directory -Path "$OutputDir\bin" | Out-Null
New-Item -ItemType Directory -Path "$OutputDir\assets" | Out-Null

# Copy main executable
Write-Host "Copying main executable..." -ForegroundColor Yellow
Copy-Item "target\release\viworks-desktop.exe" "$OutputDir\viworks-desktop.exe"

# Copy required binary files
Write-Host "Copying required binaries..." -ForegroundColor Yellow
if (Test-Path "binaries") {
    Copy-Item "binaries\*" "$OutputDir\bin\" -Force
    Write-Host "  Copied all binaries from binaries\ folder" -ForegroundColor Cyan
} else {
    # Fallback to individual files if binaries folder doesn't exist
    Copy-Item "fwknop.exe" "$OutputDir\bin\fwknop.exe" -ErrorAction SilentlyContinue
    Copy-Item "openvpn.exe" "$OutputDir\bin\openvpn.exe" -ErrorAction SilentlyContinue
    Copy-Item "stunnel.exe" "$OutputDir\bin\stunnel.exe" -ErrorAction SilentlyContinue
    Write-Host "  Copied individual binary files" -ForegroundColor Cyan
}

# Copy assets
Write-Host "Copying assets..." -ForegroundColor Yellow
Copy-Item "assets\*.ico" "$OutputDir\assets\" -ErrorAction SilentlyContinue

# Copy installer script
Write-Host "Copying installer..." -ForegroundColor Yellow
Copy-Item "install.ps1" "$OutputDir\install.ps1" -ErrorAction SilentlyContinue

# Create README file
$readme = @"
# ViWorkS Client v$Version

## Installation Instructions

### Option 1: Quick Start (Portable)
1. Extract all files to a folder on your computer
2. Run `viworks-desktop.exe` to start the application
3. The application will automatically find required binaries in the `bin` folder

### Option 2: Full Installation (Recommended)
1. Extract all files to a folder on your computer
2. Right-click on `install.ps1` and select "Run with PowerShell"
3. Or open PowerShell as Administrator and run: `.\install.ps1`
4. The installer will create shortcuts and install to Program Files

## Required Files

- `viworks-desktop.exe` - Main application
- `bin\fwknop.exe` - Single Packet Authorization tool
- `bin\openvpn.exe` - OpenVPN client
- `bin\stunnel.exe` - SSL/TLS tunneling tool

## System Requirements

- Windows 10 or later
- Internet connection for VPN connectivity
- Administrator privileges may be required for VPN operations

## Usage

1. Launch the application
2. Enter your connection details (server, keys, etc.)
3. Click "Connect" to establish VPN connection
4. Use the test buttons to verify system compatibility

## Support

For technical support, contact your system administrator.

## Version Information

- Version: $Version
- Build Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
- Platform: Windows x64
"@

$readme | Out-File -FilePath "$OutputDir\README.txt" -Encoding UTF8

# Create version file
$versionInfo = @{
    version = $Version
    buildDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    platform = "Windows x64"
} | ConvertTo-Json

$versionInfo | Out-File -FilePath "$OutputDir\version.json" -Encoding UTF8

# Create batch file for easy launching
$batchContent = @"
@echo off
echo Starting ViWorkS Client...
echo.
echo If you encounter any issues, please check the README.txt file
echo.
start "" "viworks-desktop.exe"
"@

$batchContent | Out-File -FilePath "$OutputDir\start-viworks.bat" -Encoding ASCII

# Create ZIP package
$zipName = "ViWorkS-Client-v$Version-Windows-x64.zip"
Write-Host "Creating ZIP package: $zipName" -ForegroundColor Yellow

# Remove existing ZIP if it exists
if (Test-Path $zipName) {
    Remove-Item $zipName -Force
}

# Use PowerShell to create ZIP (requires .NET Framework 4.5+)
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($OutputDir, $zipName)

Write-Host "Distribution package created successfully!" -ForegroundColor Green
Write-Host "Package: $zipName" -ForegroundColor Cyan
Write-Host "Size: $((Get-Item $zipName).Length / 1MB) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files included:" -ForegroundColor Yellow
Get-ChildItem $OutputDir -Recurse | ForEach-Object { Write-Host "  $($_.FullName.Replace($OutputDir, ''))" }
