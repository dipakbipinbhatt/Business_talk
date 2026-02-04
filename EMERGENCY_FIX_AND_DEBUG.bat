@echo off
echo ===================================================
echo   EMERGENCY FIX & DEBUGGING
echo ===================================================
echo.
echo The Nginx container is repeatedly crashing because it cannot find
echo the SSL certificates at the standard path.
echo.
echo I am performing TWO actions:
echo 1. Disabling SSL temporarily so the site starts (on HTTP).
echo 2. Running a command to finding the REAL location of your certificates.
echo.
echo [STEP 1] Pushing Emergency Config
git add frontend/nginx.conf
git commit -m "chore: temporarily disable SSL to stop crash loop"
git push
echo.
echo [STEP 2] VPS INSTRUCTIONS
echo.
echo ---------------------------------------------------
echo 1. Connect to VPS:
echo    ssh deepak@68.178.161.128
echo.
echo 2. Apply Fix and Get Cert Path:
echo    cd Business_talk
echo    git pull
echo    docker-compose -f docker-compose.prod.yml up -d --force-recreate --build frontend
echo.
echo 3. FIND THE CERTIFICATES (Very Important):
echo    Run this command and TELL ME THE OUTPUT:
echo    sudo ls -R /etc/letsencrypt/live/
echo.
echo ---------------------------------------------------
echo.
echo Once you give me the output of Step 3, I will re-enable SSL with the correct path.
echo.
pause
