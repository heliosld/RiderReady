# RiderReady Vendor Locations Setup Script
# Run this script AFTER setup-database.ps1 to add vendor location data

Write-Host "=== RiderReady Vendor Locations Setup ===" -ForegroundColor Cyan
Write-Host ""

# Load database credentials from backend/.env
$envPath = ".\backend\.env"
if (Test-Path $envPath) {
    Write-Host "[OK] Found backend/.env file" -ForegroundColor Green
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^DATABASE_([^=]+)=(.*)$') {
            $key = "db" + $matches[1]
            $value = $matches[2].Trim()
            Set-Variable -Name $key -Value $value -Scope Script
        }
    }
} else {
    Write-Host "[ERROR] backend/.env file not found!" -ForegroundColor Red
    Write-Host "Please create backend\.env with your database credentials" -ForegroundColor Yellow
    exit 1
}

Write-Host "Database: $dbNAME" -ForegroundColor Gray
Write-Host "User: $dbUSER" -ForegroundColor Gray
Write-Host ""

# Set password for psql
$env:PGPASSWORD = $dbPASSWORD

# Check if database exists
Write-Host "Checking database connection..." -ForegroundColor Cyan
$dbCheck = psql -h $dbHOST -p $dbPORT -U $dbUSER -d $dbNAME -c "SELECT 1;" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Cannot connect to database '$dbNAME'" -ForegroundColor Red
    Write-Host $dbCheck -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure you've run setup-db-clean.ps1 first!" -ForegroundColor Yellow
    $env:PGPASSWORD = $null
    exit 1
}

Write-Host "[OK] Connected to database" -ForegroundColor Green
Write-Host ""

# Apply vendor locations schema
Write-Host "Applying vendor locations schema..." -ForegroundColor Cyan
$schemaPath = Join-Path $PSScriptRoot "database\vendor_locations.sql"

if (Test-Path $schemaPath) {
    $result = psql -h $dbHOST -p $dbPORT -U $dbUSER -d $dbNAME -f $schemaPath 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Successfully applied vendor locations schema!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Summary of what was created:" -ForegroundColor Cyan
        Write-Host "  - vendor_locations table" -ForegroundColor White
        Write-Host "  - PRG: 7 locations worldwide" -ForegroundColor White
        Write-Host "  - 4Wall Entertainment: 5 US locations" -ForegroundColor White
        Write-Host "  - Neg Earth: 2 UK locations" -ForegroundColor White
        Write-Host "  - Chameleon Touring Systems: 3 Australian locations" -ForegroundColor White
        Write-Host "  - Volt Lites: 2 US locations" -ForegroundColor White
        Write-Host "  - Barbizon Lighting: single location" -ForegroundColor White
        Write-Host "  - Theatrix Lighting: single location" -ForegroundColor White
        Write-Host ""
        Write-Host "Total: 19 locations across 7 vendors" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next: Start your backend and frontend servers!" -ForegroundColor Cyan
        Write-Host "  Backend: cd backend; npm run dev" -ForegroundColor White
        Write-Host "  Frontend: cd frontend; npm run dev" -ForegroundColor White
    } else {
        Write-Host "[ERROR] Failed to apply schema" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
        $env:PGPASSWORD = $null
        exit 1
    }
} else {
    Write-Host "[ERROR] Schema file not found at: $schemaPath" -ForegroundColor Red
    $env:PGPASSWORD = $null
    exit 1
}

# Clear password
$env:PGPASSWORD = $null

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
