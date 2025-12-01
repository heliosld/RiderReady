@echo off
cd /d "%~dp0"
powershell.exe -ExecutionPolicy Bypass -File "add-images.ps1"
pause
