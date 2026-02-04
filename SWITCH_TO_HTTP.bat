@echo off
echo ===================================================
echo   FIXING ADMIN PANEL (HTTP MODE)
echo ===================================================
echo.
echo The Admin Panel was trying to reach the Secure API (HTTPS),
echo but your server only supports Insecure (HTTP) right now.
echo.
echo I have updated the configuration to use HTTP for the API.
echo.
echo [STEP 1] Saving Config
git add frontend/.env.production
git commit -m "fix: switch API to HTTP to match server configuration"
git push
echo.
echo [STEP 2] VPS COMMANDS
echo.
echo ---------------------------------------------------
echo 1. Connect to VPS:
echo    ssh deepak@68.178.161.128
echo.
echo 2. Rebuild Frontend:
echo    cd Business_talk
echo    git pull
echo    docker-compose -f docker-compose.prod.yml up -d --build frontend
echo.
echo ---------------------------------------------------
echo.
echo After this, the Admin Panel will work (but stay "Not Secure").
echo.
pause
