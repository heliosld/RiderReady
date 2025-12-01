# Simple Database Connection Test for RiderReady

Write-Host "`nRiderReady - Database Connection Test" -ForegroundColor Cyan
Write-Host "======================================`n" -ForegroundColor Cyan

# Load .env file
$envFile = ".\backend\.env"
if (Test-Path $envFile) {
    Write-Host "[OK] Found backend/.env file" -ForegroundColor Green
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^DATABASE_([^=]+)=(.*)$') {
            $key = "DATABASE_" + $matches[1]
            $value = $matches[2].Trim()
            Write-Host "  $key = $value" -ForegroundColor Gray
            Set-Variable -Name $key -Value $value -Scope Script
        }
    }
} else {
    Write-Host "[ERROR] backend/.env file not found" -ForegroundColor Red
    exit 1
}

Write-Host "`nTesting PostgreSQL connection...`n" -ForegroundColor Yellow

# Set password environment variable for psql
$env:PGPASSWORD = $DATABASE_PASSWORD

# Test connection
Write-Host "Command: psql -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER -d postgres -c 'SELECT version();'" -ForegroundColor Gray
$result = psql -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER -d postgres -c "SELECT version();" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[OK] Successfully connected to PostgreSQL!" -ForegroundColor Green
    Write-Host $result -ForegroundColor Gray
    
    # Check if database exists
    Write-Host "`nChecking if database '$DATABASE_NAME' exists..." -ForegroundColor Yellow
    $dbCheck = psql -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER -d postgres -t -c "SELECT COUNT(*) FROM pg_database WHERE datname='$DATABASE_NAME';" 2>&1
    
    if ($dbCheck -match "1") {
        Write-Host "[OK] Database '$DATABASE_NAME' exists" -ForegroundColor Green
        
        # Check tables
        Write-Host "`nChecking for required tables..." -ForegroundColor Yellow
        $tableCheck = psql -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER -d $DATABASE_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_name IN ('fixtures', 'manufacturers', 'vendors');" 2>&1
        
        if ($tableCheck -match "(\d+)") {
            $count = [int]$matches[1]
            if ($count -eq 3) {
                Write-Host "[OK] All main tables exist (fixtures, manufacturers, vendors)" -ForegroundColor Green
                
                # Check vendor_locations
                $locCheck = psql -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER -d $DATABASE_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_name='vendor_locations';" 2>&1
                if ($locCheck -match "1") {
                    Write-Host "[OK] vendor_locations table exists" -ForegroundColor Green
                } else {
                    Write-Host "[INFO] vendor_locations table not found - run setup-vendor-locations.ps1" -ForegroundColor Yellow
                }
            } else {
                Write-Host "[WARNING] Only $count of 3 main tables found" -ForegroundColor Yellow
                Write-Host "Run: .\setup-database.ps1" -ForegroundColor Cyan
            }
        }
    } else {
        Write-Host "[WARNING] Database '$DATABASE_NAME' does not exist" -ForegroundColor Yellow
        Write-Host "`nCreating database..." -ForegroundColor Cyan
        psql -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER -d postgres -c "CREATE DATABASE $DATABASE_NAME;" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Database created successfully!" -ForegroundColor Green
            Write-Host "`nNext step: Run .\setup-database.ps1 to create tables" -ForegroundColor Cyan
        }
    }
} else {
    Write-Host "`n[ERROR] Failed to connect to PostgreSQL!" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
    Write-Host "`nPossible solutions:" -ForegroundColor Yellow
    Write-Host "1. Check if PostgreSQL is running" -ForegroundColor White
    Write-Host "2. Verify password in backend/.env matches PostgreSQL" -ForegroundColor White
    Write-Host "3. Reset PostgreSQL password: psql -U postgres" -ForegroundColor White
    Write-Host "   Then: ALTER USER postgres PASSWORD 'mypassword123';" -ForegroundColor Gray
}

# Clear password
$env:PGPASSWORD = $null

Write-Host "`n======================================`n" -ForegroundColor Cyan
