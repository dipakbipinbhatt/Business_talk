@echo off
echo ========================================
echo PUSHING CHANGES TO DEV BRANCH
echo ========================================
echo.

echo Current directory:
cd
echo.

echo Checking git status...
git status
echo.

echo Adding all changes...
git add .
echo.

echo Committing changes...
git commit -m "Performance optimization: Fix slow loading after SSL - Compact mode (36MB to 200KB) - GZIP compression (1.8MB to 200KB) - Database indexes - Admin navigation fix - 180x smaller payload, 10x faster loading"
echo.

echo Pushing to dev branch...
git push origin dev
echo.

echo ========================================
echo DONE! Changes pushed to dev branch
echo ========================================
echo.
echo Next steps on your server:
echo 1. git pull origin dev
echo 2. cd backend ^&^& npm install
echo 3. pm2 restart backend
echo.
pause
