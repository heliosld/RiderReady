# Complete RiderReady Project Setup Script
# This script automates the entire setup process

Write-Host "=== RiderReady Complete Setup ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install Backend Dependencies
Write-Host "Step 1: Installing backend dependencies..." -ForegroundColor Cyan
Set-Location (Join-Path $PSScriptRoot "backend")

if (Test-Path "node_modules") {
    Write-Host "  Backend dependencies already installed" -ForegroundColor Green
} else {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
}

# Step 2: Configure Backend Environment
Write-Host ""
Write-Host "Step 2: Configuring backend environment..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "  ✓ Created .env file from .env.example" -ForegroundColor Green
    Write-Host "  ⚠ Remember to update DATABASE_PASSWORD in backend\.env" -ForegroundColor Yellow
} else {
    Write-Host "  .env already exists" -ForegroundColor Green
}

# Step 3: Install Frontend Dependencies
Write-Host ""
Write-Host "Step 3: Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location (Join-Path $PSScriptRoot "frontend")

if (Test-Path "node_modules") {
    Write-Host "  Frontend dependencies already installed" -ForegroundColor Green
} else {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Frontend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
}

# Step 4: Configure Frontend Environment
Write-Host ""
Write-Host "Step 4: Configuring frontend environment..." -ForegroundColor Cyan
if (-not (Test-Path ".env.local")) {
    Copy-Item ".env.local.example" ".env.local"
    Write-Host "  ✓ Created .env.local file" -ForegroundColor Green
} else {
    Write-Host "  .env.local already exists" -ForegroundColor Green
}

Set-Location $PSScriptRoot

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Set up the database:" -ForegroundColor White
Write-Host "     .\setup-database.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "  2. Update your database password:" -ForegroundColor White
Write-Host "     Edit backend\.env and set DATABASE_PASSWORD" -ForegroundColor Yellow
Write-Host ""
Write-Host "  3. Start development servers:" -ForegroundColor White
Write-Host "     .\start-dev.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "  OR start them manually:" -ForegroundColor White
Write-Host "     Terminal 1: cd backend; npm run dev" -ForegroundColor Yellow
Write-Host "     Terminal 2: cd frontend; npm run dev" -ForegroundColor Yellow
Write-Host ""
