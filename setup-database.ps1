# RiderReady Database Setup Script
# Run this script to set up the PostgreSQL database

Write-Host "=== RiderReady Database Setup ===" -ForegroundColor Cyan
Write-Host ""

# Add PostgreSQL to PATH if not already there
$pgPath = "C:\Program Files\PostgreSQL\17\bin"
if ($env:Path -notlike "*$pgPath*") {
    $env:Path += ";$pgPath"
    Write-Host "Added PostgreSQL to PATH" -ForegroundColor Green
}

# Check if psql is available
try {
    $version = psql --version
    Write-Host "PostgreSQL found: $version" -ForegroundColor Green
} catch {
    Write-Host "ERROR: PostgreSQL not found. Please install PostgreSQL 14+ from postgresql.org" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "You will be prompted for your PostgreSQL 'postgres' user password twice:" -ForegroundColor Yellow
Write-Host "  1. To create the database" -ForegroundColor Yellow
Write-Host "  2. To run the schema" -ForegroundColor Yellow
Write-Host ""

# Create database
Write-Host "Step 1: Creating database..." -ForegroundColor Cyan
$createResult = psql -U postgres -c "CREATE DATABASE riderready_dev;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Database 'riderready_dev' created successfully!" -ForegroundColor Green
} elseif ($createResult -like "*already exists*") {
    Write-Host "[OK] Database 'riderready_dev' already exists" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Failed to create database" -ForegroundColor Red
    Write-Host $createResult -ForegroundColor Red
    exit 1
}

Write-Host ""

# Run schema
Write-Host "Step 2: Running schema..." -ForegroundColor Cyan
$schemaPath = Join-Path $PSScriptRoot "database\schema.sql"

if (Test-Path $schemaPath) {
    psql -U postgres -d riderready_dev -f $schemaPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Database schema created successfully!" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Failed to create schema" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[ERROR] Schema file not found at: $schemaPath" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Insert vendor data
Write-Host "Step 3: Inserting vendor location data..." -ForegroundColor Cyan
$vendorsPath = Join-Path $PSScriptRoot "database\insert_vendors.sql"

if (Test-Path $vendorsPath) {
    psql -U postgres -d riderready_dev -f $vendorsPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Vendor locations inserted successfully!" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Could not insert vendor data (this is optional)" -ForegroundColor Yellow
    }
} else {
    Write-Host "[SKIP] Vendor data file not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Database Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Database includes:" -ForegroundColor Cyan
Write-Host "  - 19 vendor locations across 5 major rental companies" -ForegroundColor Green
Write-Host "  - GPS coordinates for interactive maps" -ForegroundColor Green
Write-Host "  - Full address and contact information" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Update DATABASE_PASSWORD in backend\.env to match your postgres password" -ForegroundColor White
Write-Host "  2. In backend folder run: npm install" -ForegroundColor White
Write-Host "  3. In backend folder run: npm run dev" -ForegroundColor White
Write-Host "  4. In frontend folder run: npm install" -ForegroundColor White
Write-Host "  5. In frontend folder run: npm run dev" -ForegroundColor White
Write-Host ""
