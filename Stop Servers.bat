@echo off
cd /d "%~dp0"
powershell.exe -ExecutionPolicy Bypass -File "stop-servers.ps1"
pause
