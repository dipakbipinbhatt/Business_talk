@echo off
echo ===================================================
echo   FIXING "NGINX SERVICE NOT ACTIVE" ERROR
echo ===================================================
echo.
echo The error "nginx.service is not active" happens because 
echo Nginx is NOT installed on your server directly.
echo It is running inside DOCKER.
echo.
echo INSTEAD of "sudo systemctl reload nginx",
echo YOU MUST RUN THIS COMMAND ON YOUR VPS:
echo.
echo ---------------------------------------------------
echo docker-compose -f docker-compose.prod.yml up -d --build frontend
echo ---------------------------------------------------
echo.
echo This will:
echo 1. Rebuild the frontend container with the new config
echo 2. Restart Nginx inside Docker
echo 3. Apply the fix for the Protocol Error
echo.
echo ===================================================
pause
