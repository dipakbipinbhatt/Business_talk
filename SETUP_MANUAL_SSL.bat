@echo off
echo ===================================================
echo   MANUAL SSL SETUP INSTRUCTIONS (GoDaddy)
echo ===================================================
echo.
echo I have configured the server to look for certificates in a folder
echo named 'ssl' inside your project directory.
echo.
echo [STEP 1] Saving Configuration
git add docker-compose.prod.yml frontend/nginx.conf
git commit -m "fix: configure manual SSL mount for GoDaddy certs"
git push
echo.
echo [STEP 2] PREPARE YOUR FILES ON VPS
echo.
echo 1. Connect to VPS:
echo    ssh deepak@68.178.161.128
echo.
echo 2. Create the SSL folder:
echo    cd Business_talk
echo    mkdir ssl
echo.
echo 3. UPLOAD your files to this 'ssl' folder using FileZilla/SCP.
echo    You need to upload:
echo      - Your .key file (from when you generated CSR)
echo      - Your .crt file (from GoDaddy zip)
echo      - The bundle file (from GoDaddy zip)
echo.
echo 4. RENAME/COMBINE them to match the configuration:
echo.
echo    # Rename your key file:
echo    mv your_file_name.key ssl/private.key
echo.
echo    # Create the full chain (Domain Cert + Bundle):
echo    cat ssl/your_domain.crt ssl/gd_bundle.crt > ssl/fullchain.crt
echo.
echo    (Replace 'your_domain.crt' and 'gd_bundle.crt' with actual names)
echo.
echo [STEP 3] DEPLOY
echo.
echo    git pull
echo    docker-compose -f docker-compose.prod.yml up -d --force-recreate --build frontend
echo.
echo ===================================================
echo IF NGINX FAILS: Run 'docker logs business_talk_frontend'
echo It usually means the files are named wrong or missing.
echo.
pause
