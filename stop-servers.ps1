# Stop RiderReady Development Servers
# This script stops all Node.js processes

Write-Host "=== Stopping RiderReady Servers ===" -ForegroundColor Cyan
Write-Host ""

# Function to kill process on a specific port
function Stop-ProcessOnPort {
    param([int]$Port)
    
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($connection) {
            $processId = $connection.OwningProcess
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "Stopping process on port $Port (PID: $processId - $($process.ProcessName))" -ForegroundColor Yellow
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Start-Sleep -Milliseconds 500
                Write-Host "  ✓ Stopped" -ForegroundColor Green
            }
        }
    } catch {
        # Silently ignore errors
    }
}

# Stop all Node.js processes first
Write-Host "Stopping all Node.js processes..." -ForegroundColor Yellow
try {
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        $nodeProcesses | ForEach-Object {
            Write-Host "  Stopping Node.js (PID: $($_.Id))" -ForegroundColor Gray
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 2
        Write-Host "  ✓ All Node.js processes stopped" -ForegroundColor Green
    } else {
        Write-Host "  No Node.js processes found" -ForegroundColor Gray
    }
} catch {
    Write-Host "  Could not stop Node.js processes" -ForegroundColor Red
}

Write-Host ""
Write-Host "Checking ports..." -ForegroundColor Yellow
Stop-ProcessOnPort 3001  # Backend API
Stop-ProcessOnPort 3002  # Frontend
Stop-ProcessOnPort 3000  # Default Next.js
Stop-ProcessOnPort 3003

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Green
Write-Host ""
