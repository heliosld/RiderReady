@echo off
cd /d "%~dp0"
powershell.exe -ExecutionPolicy Bypass -File "start-backend.ps1"
pause
