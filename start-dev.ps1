# Quick Start Script for RiderReady Development
# This script helps you get both backend and frontend running

Write-Host "=== RiderReady Quick Start ===" -ForegroundColor Cyan
Write-Host ""

$backendPath = Join-Path $PSScriptRoot "backend"
$frontendPath = Join-Path $PSScriptRoot "frontend"

# Kill any existing processes on ports
Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow
try {
    $connection3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
    if ($connection3001) {
        Stop-Process -Id $connection3001.OwningProcess -Force -ErrorAction SilentlyContinue
    }
    $connection3002 = Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue
    if ($connection3002) {
        Stop-Process -Id $connection3002.OwningProcess -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
} catch {
    # Ports are free
}

# Check if node_modules exist
$backendModules = Test-Path (Join-Path $backendPath "node_modules")
$frontendModules = Test-Path (Join-Path $frontendPath "node_modules")

# Check if .env files exist
$backendEnv = Test-Path (Join-Path $backendPath ".env")
$frontendEnv = Test-Path (Join-Path $frontendPath ".env.local")

Write-Host "Pre-flight checks:" -ForegroundColor Yellow

# Backend checks
if (-not $backendModules) {
    Write-Host "  ✗ Backend dependencies not installed" -ForegroundColor Red
    Write-Host "    Run: cd backend; npm install" -ForegroundColor Yellow
    $needsSetup = $true
} else {
    Write-Host "  ✓ Backend dependencies installed" -ForegroundColor Green
}

if (-not $backendEnv) {
    Write-Host "  ✗ Backend .env not configured" -ForegroundColor Red
    Write-Host "    Run: cd backend; cp .env.example .env" -ForegroundColor Yellow
    $needsSetup = $true
} else {
    Write-Host "  ✓ Backend .env configured" -ForegroundColor Green
}

# Frontend checks
if (-not $frontendModules) {
    Write-Host "  ✗ Frontend dependencies not installed" -ForegroundColor Red
    Write-Host "    Run: cd frontend; npm install" -ForegroundColor Yellow
    $needsSetup = $true
} else {
    Write-Host "  ✓ Frontend dependencies installed" -ForegroundColor Green
}

if (-not $frontendEnv) {
    Write-Host "  ✗ Frontend .env.local not configured" -ForegroundColor Red
    Write-Host "    Run: cd frontend; cp .env.local.example .env.local" -ForegroundColor Yellow
    $needsSetup = $true
} else {
    Write-Host "  ✓ Frontend .env.local configured" -ForegroundColor Green
}

Write-Host ""

if ($needsSetup) {
    Write-Host "Please complete the setup steps above before running the servers." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or run the automated setup:" -ForegroundColor Cyan
    Write-Host "  .\setup-project.ps1" -ForegroundColor White
    exit 1
}

Write-Host "Starting development servers..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3002" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening separate terminal windows..." -ForegroundColor Yellow
Write-Host "Close those windows to stop the servers" -ForegroundColor Yellow
Write-Host ""

# Start backend in new terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Server' -ForegroundColor Green; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend in new terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Frontend Server' -ForegroundColor Green; npm run dev -- -p 3002"

Write-Host "Servers are starting in separate windows..." -ForegroundColor Green
Write-Host "This window can be closed." -ForegroundColor Gray
