@echo off
echo ===================================================
echo   GENERATING NEW SSL CERTIFICATES
echo ===================================================
echo.
echo Since your server is missing the SSL certificates, we must
echo generate new ones using Certbot.
echo.
echo [INSTRUCTIONS]
echo.
echo 1. Connect to VPS:
echo    ssh deepak@68.178.161.128
echo.
echo 2. Stop the running site (Free up Port 80):
echo    cd Business_talk
echo    docker-compose -f docker-compose.prod.yml stop frontend
echo.
echo 3. Install Certbot (if missing):
echo    sudo apt update
echo    sudo apt install -y certbot
echo.
echo 4. GENERATE THE CERTIFICATES (Copy-Paste this exact command):
echo.
echo    sudo certbot certonly --standalone -d businesstalkwithdeepakbhatt.com -d www.businesstalkwithdeepakbhatt.com --non-interactive --agree-tos -m admin@businesstalkwithdeepakbhatt.com
echo.
echo 5. VERIFY:
echo    If successful, it will say "Congratulations!" and show the path:
echo    /etc/letsencrypt/live/businesstalkwithdeepakbhatt.com/fullchain.pem
echo.
echo ===================================================
echo AFTER YOU SEE "Congratulations!", TELL ME.
echo I will then enable HTTPS in the code.
echo.
pause
