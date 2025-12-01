# RiderReady Database Reset Script
# This script will DROP and recreate the database from scratch

Write-Host "=== RiderReady Database Reset ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "WARNING: This will DELETE ALL DATA in the database!" -ForegroundColor Yellow
Write-Host ""

$confirmation = Read-Host "Are you sure you want to continue? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "Aborted." -ForegroundColor Yellow
    exit 0
}

# Add PostgreSQL to PATH if not already there
$pgPath = "C:\Program Files\PostgreSQL\17\bin"
if ($env:Path -notlike "*$pgPath*") {
    $env:Path += ";$pgPath"
}

Write-Host ""
Write-Host "Step 1: Dropping existing database..." -ForegroundColor Cyan
psql -U postgres -c "DROP DATABASE IF EXISTS riderready_dev;" 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Database dropped" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Could not drop database (it may not exist yet)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 2: Creating fresh database..." -ForegroundColor Cyan
psql -U postgres -c "CREATE DATABASE riderready_dev;" 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to create database" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Database created" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Creating schema..." -ForegroundColor Cyan
$schemaPath = Join-Path $PSScriptRoot "database\schema.sql"
psql -U postgres -d riderready_dev -f $schemaPath 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to create schema" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Schema created" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Inserting vendor data..." -ForegroundColor Cyan
$vendorsPath = Join-Path $PSScriptRoot "database\insert_vendors.sql"
psql -U postgres -d riderready_dev -f $vendorsPath 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARNING] Could not insert vendor data" -ForegroundColor Yellow
} else {
    Write-Host "[OK] Vendor data inserted" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Database Reset Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Database now includes:" -ForegroundColor Cyan
Write-Host "  - Complete schema with all tables" -ForegroundColor Green
Write-Host "  - vendor_locations table for multiple locations per vendor" -ForegroundColor Green
Write-Host "  - 20+ vendor locations with GPS coordinates" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Restart your backend server" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
