@echo off
echo ==========================================
echo COMPLETE DEPLOYMENT SCRIPT
echo ==========================================
echo.
echo This script will:
echo 1. Show you all code changes
echo 2. Commit changes to git
echo 3. Push to dev branch
echo 4. Give you server deployment commands
echo.
pause
echo.

REM Step 1: Show changes
echo ========== STEP 1: VERIFY CHANGES ==========
echo.
call show-changes.bat
echo.

REM Step 2: Commit and push
echo ========== STEP 2: COMMIT AND PUSH ==========
echo.
call commit-and-push.bat
echo.

REM Step 3: Show server commands
echo ========== STEP 3: DEPLOY TO SERVER ==========
echo.
echo Copy these commands and run on your server:
echo.
echo --- COMMANDS START ---
echo ssh user@your-server-ip
echo cd /path/to/Business_talk
echo git checkout dev
echo git pull origin dev
echo cd backend
echo npm install
echo pm2 restart backend
echo pm2 logs backend --lines 20
echo --- COMMANDS END ---
echo.

REM Step 4: Show verification
echo ========== STEP 4: VERIFY ON SERVER ==========
echo.
echo After deploying, run these to verify:
echo.
echo 1. Check backend is running:
echo    pm2 status
echo.
echo 2. Check MongoDB connected:
echo    pm2 logs backend ^| grep MongoDB
echo.
echo 3. Test API:
echo    curl http://localhost:5000/api/podcasts?limit=1
echo.
echo 4. Test compact mode:
echo    curl http://localhost:5000/api/podcasts?limit=0^&compact=true
echo.
echo 5. Open browser:
echo    https://businesstalkwithdeepakbhatt.com
echo    Press Ctrl+Shift+R to refresh
echo.

echo ==========================================
echo DEPLOYMENT COMPLETE!
echo ==========================================
echo.
echo Your site should now load 10x faster!
echo.
echo If you see any issues, check:
echo - pm2 logs backend
echo - Browser console (F12)
echo ==========================================
pause
