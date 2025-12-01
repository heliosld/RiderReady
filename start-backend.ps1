# Start RiderReady Backend Server
# Quick script to start just the backend API

Write-Host "=== Starting RiderReady Backend ===" -ForegroundColor Cyan
Write-Host ""

$backendPath = Join-Path $PSScriptRoot "backend"

# Kill any existing process on port 3001
Write-Host "Checking for existing processes on port 3001..." -ForegroundColor Yellow
try {
    $connection = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
    if ($connection) {
        $processId = $connection.OwningProcess
        Write-Host "  Stopping existing process (PID: $processId)" -ForegroundColor Gray
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
} catch {
    # Port is free
}

# Check if .env exists
if (-not (Test-Path (Join-Path $backendPath ".env"))) {
    Write-Host "ERROR: Backend .env file not found!" -ForegroundColor Red
    Write-Host "Run: cd backend; cp .env.example .env" -ForegroundColor Yellow
    Write-Host "Then edit .env and set your DATABASE_PASSWORD" -ForegroundColor Yellow
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path (Join-Path $backendPath "node_modules"))) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    Set-Location $backendPath
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Starting backend server..." -ForegroundColor Green
Write-Host "API will be available at: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Health check: http://localhost:3001/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

Set-Location $backendPath
npm run dev
