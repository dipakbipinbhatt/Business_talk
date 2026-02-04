@echo off
echo ===================================================
echo   RESTORING SSL & FIXING PORT 443
echo ===================================================
echo.
echo I found the issue: My previous fix configured Port 80 (HTTP)
echo but was missing the SSL configuration for Port 443 (HTTPS).
echo.
echo I have now updated 'nginx.conf' to include:
echo 1. SSL/HTTPS Configuration (Port 443)
echo 2. The QUIC Protocol Fix (Alt-Svc: "")
echo 3. The IP Redirect Fix
echo.
echo [STEP 1] Saving changes to Git
git add frontend/nginx.conf
git commit -m "fix: restore SSL config and disable QUIC on port 443"
git push
echo.
echo [STEP 2] VPS INSTRUCTIONS
echo ===================================================
echo 1. Connect to VPS:
echo    ssh deepak@68.178.161.128
echo.
echo 2. Pull and Rebuild:
echo    cd Business_talk
echo    git pull
echo    docker-compose -f docker-compose.prod.yml up -d --build frontend
echo.
echo 3. Verify logs (Optional, if it still fails):
echo    docker logs business_talk_frontend
echo.
echo ===================================================
echo After this, the site should load perfectly on HTTPS.
echo.
pause
