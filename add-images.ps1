# Image Helper Script for RiderReady
# This script helps you add images to the database

Write-Host "=== RiderReady Image Helper ===" -ForegroundColor Cyan
Write-Host ""

$imageDir = Join-Path $PSScriptRoot "frontend\public\images\fixtures"

# Check if image directory exists
if (-not (Test-Path $imageDir)) {
    Write-Host "Creating image directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $imageDir -Force | Out-Null
}

Write-Host "Image directory: $imageDir" -ForegroundColor Green
Write-Host ""

Write-Host "Quick Guide:" -ForegroundColor Yellow
Write-Host "1. Place fixture images in: frontend\public\images\fixtures\" -ForegroundColor White
Write-Host "2. Name format: manufacturer-fixture-name.jpg" -ForegroundColor White
Write-Host "   Example: robe-pointe.jpg, martin-mac-aura.jpg" -ForegroundColor White
Write-Host ""
Write-Host "3. Update database with:" -ForegroundColor White
Write-Host "   UPDATE fixtures SET primary_image_url = '/images/fixtures/your-image.jpg'" -ForegroundColor Gray
Write-Host "   WHERE slug = 'your-fixture-slug';" -ForegroundColor Gray
Write-Host ""

# List current images
$images = Get-ChildItem -Path $imageDir -File -ErrorAction SilentlyContinue | Where-Object { $_.Extension -match '\.(jpg|jpeg|png|webp)$' }

if ($images.Count -gt 0) {
    Write-Host "Current images ($($images.Count)):" -ForegroundColor Cyan
    foreach ($img in $images) {
        $url = "/images/fixtures/$($img.Name)"
        $size = [math]::Round($img.Length / 1KB, 2)
        Write-Host "  - $($img.Name)" -ForegroundColor Green -NoNewline
        Write-Host " ($size KB)" -ForegroundColor Gray
        Write-Host "    URL: $url" -ForegroundColor DarkGray
    }
} else {
    Write-Host "No images found yet. Add some fixture images to get started!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Image sources:" -ForegroundColor Cyan
Write-Host "  • Manufacturer websites (official product pages)" -ForegroundColor White
Write-Host "  • Rental house catalogs (PRG, 4Wall, etc.)" -ForegroundColor White
Write-Host "  • PLASA/LDI show photos" -ForegroundColor White
Write-Host ""

# Offer to open the directory
Write-Host "Press any key to open the images folder, or Ctrl+C to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process explorer.exe $imageDir
