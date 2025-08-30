# ViWorkS Client Installer
# Run this script as Administrator for best results

param(
    [string]$InstallPath = "$env:ProgramFiles\ViWorkS"
)

Write-Host "ViWorkS Client Installer" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "Warning: Not running as Administrator. Some features may not work properly." -ForegroundColor Yellow
    Write-Host "Consider running this script as Administrator for full functionality." -ForegroundColor Yellow
    Write-Host ""
}

# Create installation directory
Write-Host "Creating installation directory..." -ForegroundColor Yellow
if (-not (Test-Path $InstallPath)) {
    New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
    New-Item -ItemType Directory -Path "$InstallPath\bin" -Force | Out-Null
}

# Copy files
Write-Host "Copying application files..." -ForegroundColor Yellow
Copy-Item "viworks-desktop.exe" "$InstallPath\" -Force
Copy-Item "bin\*" "$InstallPath\bin\" -Force -Recurse
Copy-Item "assets\*" "$InstallPath\" -Force -Recurse -ErrorAction SilentlyContinue

# Create desktop shortcut
Write-Host "Creating desktop shortcut..." -ForegroundColor Yellow
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\ViWorkS Client.lnk")
$Shortcut.TargetPath = "$InstallPath\viworks-desktop.exe"
$Shortcut.WorkingDirectory = $InstallPath
$Shortcut.Description = "ViWorkS VPN Client"
$Shortcut.Save()

# Create start menu shortcut
Write-Host "Creating start menu shortcut..." -ForegroundColor Yellow
$StartMenuPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\ViWorkS"
if (-not (Test-Path $StartMenuPath)) {
    New-Item -ItemType Directory -Path $StartMenuPath -Force | Out-Null
}
$Shortcut = $WshShell.CreateShortcut("$StartMenuPath\ViWorkS Client.lnk")
$Shortcut.TargetPath = "$InstallPath\viworks-desktop.exe"
$Shortcut.WorkingDirectory = $InstallPath
$Shortcut.Description = "ViWorkS VPN Client"
$Shortcut.Save()

# Create uninstaller
$uninstaller = @"
# ViWorkS Client Uninstaller
Write-Host "Uninstalling ViWorkS Client..." -ForegroundColor Yellow

# Remove shortcuts
Remove-Item "$env:USERPROFILE\Desktop\ViWorkS Client.lnk" -ErrorAction SilentlyContinue
Remove-Item "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\ViWorkS" -Recurse -Force -ErrorAction SilentlyContinue

# Remove installation directory
Remove-Item "$InstallPath" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "ViWorkS Client has been uninstalled." -ForegroundColor Green
"@

$uninstaller | Out-File -FilePath "$InstallPath\uninstall.ps1" -Encoding UTF8

Write-Host ""
Write-Host "Installation completed successfully!" -ForegroundColor Green
Write-Host "Installation path: $InstallPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now:" -ForegroundColor Yellow
Write-Host "1. Launch ViWorkS Client from the Desktop shortcut" -ForegroundColor White
Write-Host "2. Or find it in the Start Menu under 'ViWorkS'" -ForegroundColor White
Write-Host "3. Or run: $InstallPath\viworks-desktop.exe" -ForegroundColor White
Write-Host ""
Write-Host "To uninstall, run: $InstallPath\uninstall.ps1" -ForegroundColor Gray
