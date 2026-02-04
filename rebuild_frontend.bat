@echo off
echo ========================================
echo Business Talk - Frontend Rebuild Script
echo ========================================
echo.

cd frontend

echo [1/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/5] Building frontend with production environment...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build frontend
    pause
    exit /b 1
)

echo.
echo [3/5] Build completed successfully!
echo The dist folder is ready for deployment.
echo.
echo [4/5] Next steps:
echo - Upload the 'dist' folder to your hosting service
echo - Or if using Docker/EC2, rebuild the Docker container
echo - Or if using Render/Netlify/Vercel, push to GitHub
echo.
echo [5/5] Committing changes to Git...
cd ..
git add .
git commit -m "fix: add production environment config for API URL"
git push

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo The frontend has been rebuilt with the correct API URL.
echo.
echo Backend API: https://bussiness-talk-backend.onrender.com/api
echo Frontend URL: https://businesstalkwithdeepakbhatt.com
echo.
echo After deploying, test the admin panel at:
echo https://businesstalkwithdeepakbhatt.com/admin
echo.
pause
