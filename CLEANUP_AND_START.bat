@echo off
echo ===================================================
echo   CLEANUP AND RESTART (HTTP MODE)
echo ===================================================
echo.
echo FAILURE ANALYSIS:
echo 1. Your server does NOT have SSL certificates in the standard folder.
echo 2. This caused Nginx to crash when we tried to load them.
echo.
echo SOLUTION:
echo I have reverted the configuration to HTTP-ONLY mode.
echo This will allow the site to start immediately so you can access the admin panel.
echo.
echo [STEP 1] Saving Config
git add docker-compose.prod.yml
git commit -m "fix: remove invalid volume mount"
git push
echo.
echo [STEP 2] VPS COMMANDS
echo.
echo ---------------------------------------------------
echo 1. Connect to VPS:
echo    ssh deepak@68.178.161.128
echo.
echo 2. Restart Everything:
echo    cd Business_talk
echo    git pull
echo    docker-compose -f docker-compose.prod.yml up -d --force-recreate --build frontend
echo.
echo ---------------------------------------------------
echo.
echo YOUR SITE WILL BE ONLINE ON PORT 80.
echo If you need HTTPS (Green Lock), tell me "Install SSL" and I will
echo generate NEW certificates for you.
echo.
pause
