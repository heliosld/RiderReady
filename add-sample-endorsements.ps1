#!/usr/bin/env pwsh

Write-Host "Adding sample endorsement data to RiderReady database..." -ForegroundColor Cyan

$env:PGPASSWORD = "mypassword123"
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

# Run the sample endorsements SQL
Write-Host "`nInserting sample endorsement data..." -ForegroundColor Yellow
& $psqlPath -h localhost -p 5432 -U postgres -d riderready_dev -f "database\insert_sample_endorsements.sql"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSample endorsement data added successfully!" -ForegroundColor Green
} else {
    Write-Host "`nError adding sample endorsement data." -ForegroundColor Red
    exit 1
}
