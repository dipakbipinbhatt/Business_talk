@echo off
echo ========================================
echo Building Frontend Only
echo ========================================
echo.

echo Cleaning old frontend images...
docker stop business-talk-frontend 2>nul
docker rm business-talk-frontend 2>nul
docker rmi business-talk-frontend 2>nul

echo.
echo Building frontend image...
cd frontend
docker build -t business-talk-frontend .
if errorlevel 1 (
    echo.
    echo [ERROR] Build failed!
    echo.
    echo Checking files in frontend directory:
    dir
    echo.
    echo Checking if nginx.conf exists:
    if exist nginx.conf (
        echo [OK] nginx.conf found
    ) else (
        echo [ERROR] nginx.conf NOT found!
    )
    echo.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Frontend built successfully!
echo.
echo To run the frontend:
echo   docker run -p 80:80 business-talk-frontend
echo.
pause
