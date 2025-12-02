@echo off
echo Adding sample endorsement data to RiderReady database...
powershell -ExecutionPolicy Bypass -File add-sample-endorsements.ps1
pause
