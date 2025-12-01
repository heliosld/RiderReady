@echo off
cd /d "%~dp0"
powershell.exe -ExecutionPolicy Bypass -File "start-dev.ps1"
pause
