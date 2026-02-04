@echo off
echo ===================================================
echo   FIXING NGINX INSIDE DOCKER
echo ===================================================
echo.
echo Your Nginx is running INSIDE Docker, so 'sudo systemctl reload nginx'
echo does not work because Nginx is not installed on the server.
echo it is inside the container.
echo.
echo I have updated 'frontend/nginx.conf' LOCALLY with the fix:
echo  1. It now redirects IP address to the Domain
echo  2. It now disables QUIC protocol to fix the Chrome error
echo.
echo WE NEED TO PUSH THIS TO THE SERVER AND REBUILD DOCKER.
echo.
echo [STEP 1] Committing changes...
git add frontend/nginx.conf
git commit -m "fix: update nginx config to redirect IP and disable QUIC"
git push
echo.
echo [STEP 2] INSTRUCTIONS FOR VPS
echo ===================================================
echo 1. Connect to VPS:
echo    ssh deepak@68.178.161.128
echo.
echo 2. Go to your project folder:
echo    cd Business_talk
echo.
echo 3. Pull the changes:
echo    git pull
echo.
echo 4. Rebuild the frontend container:
echo    docker-compose up -d --build frontend
echo.
echo    (Note: If you don't use docker-compose, run your build script)
echo.
echo ===================================================
echo After this, access the site at:
echo https://businesstalkwithdeepakbhatt.com/admin
echo.
pause
