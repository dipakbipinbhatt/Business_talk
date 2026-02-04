@echo off
echo ===================================================
echo   FIXING MISSING SSL CERTIFICATES IN DOCKER
echo ===================================================
echo.
echo The error logs confirmed that Nginx crashed because it could not find
echo the SSL certificates inside the container.
echo.
echo I have updated 'docker-compose.prod.yml' to MOUNT the certificates
echo from your VPS into the Docker container.
echo.
echo [STEP 1] Saving changes...
git add docker-compose.prod.yml
git commit -m "fix: mount SSL certificates volume in docker-compose"
git push
echo.
echo [STEP 2] VPS COMMANDS
echo ===================================================
echo 1. Connect to VPS:
echo    ssh deepak@68.178.161.128
echo.
echo 2. Update and Restart:
echo    cd Business_talk
echo    git pull
echo    docker-compose -f docker-compose.prod.yml up -d --force-recreate --build frontend
echo.
echo ===================================================
echo This will restart the container with access to the SSL keys.
echo The site should be up within 30 seconds of running the command.
echo.
pause
