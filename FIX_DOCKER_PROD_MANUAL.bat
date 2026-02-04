@echo off
echo ===================================================
echo   MANUAL FIX FOR DOCKER NGINX (SAFE MODE)
echo ===================================================
echo.
echo Since your server configuration might have SSL settings I cannot see,
echo it is safest to EDIT the file on the server rather than overwriting it.
echo.
echo [INSTRUCTIONS]
echo.
echo 1. Login to VPS:
echo    ssh deepak@68.178.161.128
echo.
echo 2. Edit the frontend Nginx config:
echo    nano Business_talk/frontend/nginx.conf
echo.
echo 3. ADD these lines inside the 'server {' block:
echo.
echo    # FIX: Disable QUIC
echo    add_header Alt-Svc "";
echo    add_header X-Protocol-Fixed "True";
echo.
echo    # FIX: Redirect IP to Domain (Add near top)
echo    if ($host = "68.178.161.128") {
echo        return 301 https://businesstalkwithdeepakbhatt.com$request_uri;
echo    }
echo.
echo 4. Save and Exit (Ctrl+O, Enter, Ctrl+X)
echo.
echo 5. Rebuild the container:
echo    cd Business_talk
echo    docker-compose -f docker-compose.prod.yml up -d --build frontend
echo.
echo ===================================================
pause
