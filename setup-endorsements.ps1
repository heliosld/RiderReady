# Setup Vendor Endorsements System
# Run this script to add the endorsements feature to the database

Write-Host "Setting up Vendor Endorsements System..." -ForegroundColor Cyan

# Load environment variables
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+?)\s*=\s*(.+?)\s*$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
        }
    }
}

$dbHost = if ($env:DB_HOST) { $env:DB_HOST } else { "localhost" }
$dbPort = if ($env:DB_PORT) { $env:DB_PORT } else { "5432" }
$dbName = if ($env:DB_NAME) { $env:DB_NAME } else { "riderready_dev" }
$dbUser = if ($env:DB_USER) { $env:DB_USER } else { "postgres" }

Write-Host "`nDatabase Configuration:" -ForegroundColor Yellow
Write-Host "  Host: $dbHost"
Write-Host "  Port: $dbPort"
Write-Host "  Database: $dbName"
Write-Host "  User: $dbUser"
Write-Host ""

# Run the endorsements schema
Write-Host "Creating endorsement tables and seed data..." -ForegroundColor Green
$env:PGPASSWORD = $env:DB_PASSWORD
psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -f "database\vendor_endorsements.sql"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Vendor Endorsements System setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "The following has been added:" -ForegroundColor Cyan
    Write-Host "  • endorsement_categories table with 20 predefined categories"
    Write-Host "  • vendor_endorsements table to track vote counts"
    Write-Host "  • endorsement_votes table to prevent duplicate voting"
    Write-Host "  • Automatic triggers to update vote counts"
    Write-Host ""
    Write-Host "Categories include strengths like:" -ForegroundColor Yellow
    Write-Host "  - Inventory Depth, Customer Service, Equipment Condition"
    Write-Host "  - Fast Turnaround, Competitive Pricing, Technical Expertise"
    Write-Host ""
    Write-Host "And weaknesses like:" -ForegroundColor Yellow
    Write-Host "  - Limited Inventory, Poor Communication, Equipment Issues"
    Write-Host "  - Slow Response, High Prices, Delivery Problems"
    Write-Host ""
} else {
    Write-Host "`n❌ Failed to setup endorsements system" -ForegroundColor Red
    Write-Host "Check the error messages above for details" -ForegroundColor Yellow
    exit 1
}
