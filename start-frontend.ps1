# Start RiderReady Frontend
# Quick script to start just the frontend

Write-Host "=== Starting RiderReady Frontend ===" -ForegroundColor Cyan
Write-Host ""

$frontendPath = Join-Path $PSScriptRoot "frontend"

# Kill any existing process on port 3002
Write-Host "Checking for existing processes on port 3002..." -ForegroundColor Yellow
try {
    $connection = Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue
    if ($connection) {
        $processId = $connection.OwningProcess
        Write-Host "  Stopping existing process (PID: $processId)" -ForegroundColor Gray
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
} catch {
    # Port is free
}

# Check if .env.local exists
if (-not (Test-Path (Join-Path $frontendPath ".env.local"))) {
    Write-Host "ERROR: Frontend .env.local file not found!" -ForegroundColor Red
    Write-Host "Run: cd frontend; cp .env.local.example .env.local" -ForegroundColor Yellow
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path (Join-Path $frontendPath "node_modules"))) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    Set-Location $frontendPath
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Starting frontend server..." -ForegroundColor Green
Write-Host "App will be available at: http://localhost:3002" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

Set-Location $frontendPath
npm run dev -- -p 3002
