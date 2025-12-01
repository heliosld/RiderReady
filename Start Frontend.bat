@echo off
cd /d "%~dp0"
powershell.exe -ExecutionPolicy Bypass -File "start-frontend.ps1"
pause
