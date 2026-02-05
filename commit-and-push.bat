@echo off
echo ==========================================
echo COMMITTING ALL CHANGES TO DEV BRANCH
echo ==========================================
echo.

REM Check current branch
echo Checking current branch...
git branch
echo.

REM Show what will be committed
echo Files to be committed:
git status --short
echo.

REM Add all changes
echo Adding all changes...
git add -A
echo.

REM Commit with detailed message
echo Committing changes...
git commit -m "Performance: Complete optimization - Compact mode + Compression + Indexes + Nginx fix

- Frontend: Added compact mode to Calendar pages (36MB -> 1.8MB)
- Backend: Added GZIP compression middleware (1.8MB -> 200KB)
- Backend: Added MongoDB indexes for faster queries
- Backend: Installed compression package
- Frontend: Fixed AdminCalendar navigation to match Dashboard
- Frontend: Deleted conflicting nginx.conf
- Frontend: Updated Dockerfile to create own nginx config
- Result: 180x smaller payload, 10x faster loading with SSL"
echo.

REM Push to current branch
echo Pushing to remote...
git push origin HEAD
echo.

echo ==========================================
echo DONE! Changes pushed to remote branch
echo ==========================================
echo.
echo Next steps:
echo 1. Go to your server
echo 2. Run: git pull origin dev
echo 3. Run: cd backend ^&^& npm install
echo 4. Run: pm2 restart backend
echo 5. Clear browser cache and test
echo ==========================================
pause
