# Run Project Jatayu (AeroReady AI) - Start Both Servers
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Launching Project Jatayu (AeroReady AI) Full System...   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\run_backend.ps1"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\run_frontend.ps1"
Start-Sleep -Seconds 2

Start-Process "http://127.0.0.1:5173"
Write-Host "System launched. Dashboard accessible at http://127.0.0.1:5173" -ForegroundColor Green
