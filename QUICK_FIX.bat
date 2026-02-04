@echo off
REM Quick Fix Script for Admin Panel Access
REM This builds the frontend and shows you how to deploy

echo ==========================================
echo ADMIN PANEL FIX - Quick Deploy
echo ==========================================
echo.
echo VPS IP: 68.178.161.128
echo Domain: businesstalkwithdeepakbhatt.com
echo.

REM Build frontend with production config
echo [1/3] Building frontend with VPS configuration...
cd frontend
call npm install --silent
call npm run build
cd ..
echo OK Frontend built!
echo.

REM Commit to Git
echo [2/3] Saving changes to Git...
git add .
git commit -m "fix: configure API URL for GoDaddy VPS"
git push
echo OK Changes saved!
echo.

REM Show deployment instructions
echo [3/3] DEPLOYMENT INSTRUCTIONS
echo ==========================================
echo.
echo The frontend is built and ready!
echo.
echo NOW, SSH into your VPS and run these commands:
echo.
echo   ssh root@68.178.161.128
echo   cd /var/www/business-talk
echo   git pull
echo   cd frontend
echo   npm run build
echo   cd ../backend
echo   pm2 restart business-talk-backend
echo.
echo ==========================================
echo.
echo After running the above commands, test at:
echo   https://businesstalkwithdeepakbhatt.com/admin
echo.
echo Login with:
echo   Email: admin@businesstalk.com
echo   Password: Admin@123
echo.
echo ==========================================
pause
