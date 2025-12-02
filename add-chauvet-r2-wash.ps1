# Add Chauvet R2 Wash fixture to database

Write-Host "`nAdding Chauvet R2 Wash to database..." -ForegroundColor Cyan

# Load .env file
$envFile = ".\backend\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^DATABASE_([^=]+)=(.*)$') {
            $key = "DATABASE_" + $matches[1]
            $value = $matches[2].Trim()
            Set-Variable -Name $key -Value $value -Scope Script
        }
    }
} else {
    Write-Host "[ERROR] backend/.env file not found" -ForegroundColor Red
    exit 1
}

# Set password environment variable for psql
$env:PGPASSWORD = $DATABASE_PASSWORD

$sql = @"
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, color_temperature_kelvin, cri_rating,
    total_lumens, beam_angle_min, beam_angle_max, zoom_type,
    color_mixing_type,
    frost, iris, shutter_strobe,
    dmx_channels_min, dmx_channels_max, rdm_support,
    pan_range_degrees, tilt_range_degrees, pan_tilt_16bit
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'chauvet'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-wash'),
    'R2 Wash', 'R2 Wash', 'chauvet-r2-wash',
    'Compact RGBW LED wash with exceptional color rendering and versatile zoom range',
    2018,
    9.5, 20.9, 293, 410, 193,
    350, '100-240V', 'PowerCON',
    'LED', 6500, 90,
    10000, 10.0, 60.0, 'Linear',
    'RGBW',
    TRUE, TRUE, TRUE,
    18, 46, TRUE,
    540, 270, TRUE
) ON CONFLICT (slug) DO NOTHING;
"@

$result = psql -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER -d $DATABASE_NAME -c $sql 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] Chauvet R2 Wash added successfully!" -ForegroundColor Green
    
    # Verify the fixture was added
    Write-Host "`nVerifying fixture..." -ForegroundColor Yellow
    $verify = psql -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER -d $DATABASE_NAME -c "SELECT name, slug FROM fixtures WHERE slug = 'chauvet-r2-wash';" 2>&1
    Write-Host $verify
} else {
    Write-Host "`n[ERROR] Failed to add fixture" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
    exit 1
}
