# Run Project Jatayu (AeroReady AI) - Frontend Server
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting Project Jatayu (AeroReady AI) Frontend Server... " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

Set-Location -Path "$PSScriptRoot\frontend"
npm run dev -- --host 127.0.0.1 --port 5173
