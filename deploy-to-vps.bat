@echo off
REM Business Talk - GoDaddy VPS Deployment Script (Windows)
REM This script builds and prepares files for VPS deployment

echo ==========================================
echo Business Talk - VPS Deployment (Windows)
echo ==========================================
echo.

REM Configuration
set VPS_IP=68.178.161.128
set DOMAIN=businesstalkwithdeepakbhatt.com
set VPS_USER=root

echo Target VPS: %VPS_IP%
echo Domain: %DOMAIN%
echo.

REM Step 1: Build Frontend
echo [1/5] Building frontend...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build frontend
    pause
    exit /b 1
)
cd ..
echo OK Frontend built successfully
echo.

REM Step 2: Build Backend
echo [2/5] Building backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build backend
    pause
    exit /b 1
)
cd ..
echo OK Backend built successfully
echo.

REM Step 3: Create deployment instructions
echo [3/5] Creating deployment package...
echo.
echo The following files need to be uploaded to your VPS:
echo.
echo   1. frontend/dist/*  --^>  /var/www/business-talk/frontend/
echo   2. backend/dist/*   --^>  /var/www/business-talk/backend/dist/
echo   3. backend/package.json  --^>  /var/www/business-talk/backend/
echo   4. backend/.env     --^>  /var/www/business-talk/backend/
echo.

REM Step 4: Git commit
echo [4/5] Committing changes to Git...
git add .
git commit -m "fix: configure for GoDaddy VPS deployment"
git push
echo OK Changes pushed to Git
echo.

REM Step 5: Instructions
echo [5/5] Next Steps - Manual Deployment
echo ==========================================
echo.
echo OPTION 1: Deploy via SSH (Recommended)
echo ----------------------------------------
echo 1. Open Git Bash or WSL terminal
echo 2. Run: bash deploy-to-vps.sh
echo 3. Enter your VPS password when prompted
echo.
echo OPTION 2: Deploy via FTP/SFTP
echo ----------------------------------------
echo 1. Connect to %VPS_IP% using FileZilla or WinSCP
echo 2. Upload frontend/dist/* to /var/www/business-talk/frontend/
echo 3. Upload backend files to /var/www/business-talk/backend/
echo 4. SSH into VPS and run:
echo    cd /var/www/business-talk/backend
echo    npm install --production
echo    pm2 restart business-talk-backend
echo.
echo OPTION 3: Deploy via Git Pull on VPS
echo ----------------------------------------
echo 1. SSH into your VPS: ssh %VPS_USER%@%VPS_IP%
echo 2. Run the following commands:
echo.
echo    cd /var/www/business-talk
echo    git pull
echo    cd frontend
echo    npm install
echo    npm run build
echo    cd ../backend
echo    npm install
echo    npm run build
echo    pm2 restart business-talk-backend
echo.
echo ==========================================
echo.
echo After deployment, test at:
echo   - https://%DOMAIN%/admin
echo.
echo Admin Login:
echo   - Email: admin@businesstalk.com
echo   - Password: Admin@123
echo.
pause
