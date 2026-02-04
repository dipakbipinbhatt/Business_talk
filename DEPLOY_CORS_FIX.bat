@echo off
REM Quick Fix for CORS / IP Access
REM This rebuilds the backend to allow access from 68.178.161.128

echo ==========================================
echo CORS FIX DEPLOYMENT
echo ==========================================
echo.
echo I have updated the backend code to explicitly allow your VPS IP.
echo Now we need to deploy this change.
echo.

REM Commit to Git
echo [1/2] Saving changes to Git...
git add .
git commit -m "fix: allow VPS IP in CORS whitelist"
git push
echo OK Changes saved!
echo.

REM Instructions
echo [2/2] DEPLOYMENT INSTRUCTIONS
echo ==========================================
echo.
echo Now, SSH into your VPS and run:
echo.
echo   ssh root@68.178.161.128
echo   cd /var/www/business-talk/backend
echo   git pull
echo   npm run build
echo   pm2 restart business-talk-backend
echo.
echo ==========================================
echo After this, you can access the API even from the IP address.
echo BUT you should still use the domain name for best results.
echo.
pause
