# Update Vendors Script
# This script adds the new vendors to your existing database

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "RiderReady - Update Vendors" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Get password from .env file
$envFile = Get-Content ".\backend\.env"
$password = ($envFile | Where-Object { $_ -match "^DATABASE_PASSWORD=" }) -replace "DATABASE_PASSWORD=", ""

if ([string]::IsNullOrWhiteSpace($password)) {
    Write-Host "Error: Could not find DATABASE_PASSWORD in backend\.env" -ForegroundColor Red
    exit 1
}

Write-Host "Found password in .env file" -ForegroundColor Green
Write-Host ""

# Set the password for psql
$env:PGPASSWORD = $password

# Path to PostgreSQL (adjust if needed)
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

if (-not (Test-Path $psqlPath)) {
    # Try to find psql in PATH
    $psqlPath = (Get-Command psql -ErrorAction SilentlyContinue).Source
    if (-not $psqlPath) {
        Write-Host "Error: Could not find psql.exe" -ForegroundColor Red
        Write-Host "Please install PostgreSQL or update the path in this script" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "Using psql at: $psqlPath" -ForegroundColor Green
Write-Host ""

# Test connection
Write-Host "Testing database connection..." -ForegroundColor Yellow
$testResult = & $psqlPath -U postgres -h localhost -d riderready_dev -c "SELECT COUNT(*) FROM vendors;" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Could not connect to database" -ForegroundColor Red
    Write-Host "Error details: $testResult" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "  1. PostgreSQL is running" -ForegroundColor Yellow
    Write-Host "  2. Password in backend\.env is correct" -ForegroundColor Yellow
    Write-Host "  3. Database 'riderready_dev' exists" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Connected to database successfully!" -ForegroundColor Green
Write-Host ""

# Run the vendor insert script
Write-Host "Adding new vendors and locations..." -ForegroundColor Yellow
$insertResult = & $psqlPath -U postgres -h localhost -d riderready_dev -f ".\database\insert_vendors.sql" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error running insert script: $insertResult" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ Vendors updated successfully!" -ForegroundColor Green
Write-Host ""

# Show final count
Write-Host "Checking final vendor count..." -ForegroundColor Yellow
& $psqlPath -U postgres -h localhost -d riderready_dev -c "SELECT COUNT(*) as total_vendors FROM vendors; SELECT COUNT(*) as total_locations FROM vendor_locations;"

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Update complete!" -ForegroundColor Green
Write-Host "Restart your backend server to see the changes." -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Cyan
