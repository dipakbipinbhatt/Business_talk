@echo off
echo ========================================
echo Building Backend Only
echo ========================================
echo.

echo Cleaning old backend images...
docker stop business-talk-backend 2>nul
docker rm business-talk-backend 2>nul
docker rmi business-talk-backend 2>nul

echo.
echo Building backend image...
cd backend
docker build -t business-talk-backend .
if errorlevel 1 (
    echo.
    echo [ERROR] Build failed!
    echo.
    echo Checking files in backend directory:
    dir
    echo.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Backend built successfully!
echo.
echo To run the backend:
echo   docker run -p 5000:5000 -e MONGODB_URI="your_uri" business-talk-backend
echo.
pause
