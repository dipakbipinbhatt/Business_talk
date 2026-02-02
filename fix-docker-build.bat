@echo off
echo ========================================
echo Docker Build Fix - Complete Cleanup
echo ========================================
echo.

echo [STEP 1] Stopping all containers...
docker-compose down
docker stop business-talk-backend business-talk-frontend 2>nul
docker rm business-talk-backend business-talk-frontend 2>nul

echo [STEP 2] Removing old images...
docker rmi business-talk-backend business-talk-frontend 2>nul

echo [STEP 3] Cleaning Docker cache...
docker builder prune -f
docker system prune -f

echo [STEP 4] Verifying files exist...
if not exist "backend\Dockerfile" (
    echo [ERROR] backend\Dockerfile not found!
    pause
    exit /b 1
)
echo [OK] backend\Dockerfile exists

if not exist "frontend\Dockerfile" (
    echo [ERROR] frontend\Dockerfile not found!
    pause
    exit /b 1
)
echo [OK] frontend\Dockerfile exists

if not exist "frontend\nginx.conf" (
    echo [ERROR] frontend\nginx.conf not found!
    pause
    exit /b 1
)
echo [OK] frontend\nginx.conf exists

if not exist "backend\package.json" (
    echo [ERROR] backend\package.json not found!
    pause
    exit /b 1
)
echo [OK] backend\package.json exists

if not exist "frontend\package.json" (
    echo [ERROR] frontend\package.json not found!
    pause
    exit /b 1
)
echo [OK] frontend\package.json exists

echo.
echo [STEP 5] Building backend (this may take a few minutes)...
docker build -t business-talk-backend ./backend
if errorlevel 1 (
    echo [ERROR] Backend build failed!
    echo.
    echo Trying to diagnose the issue...
    echo.
    echo Checking backend directory contents:
    dir backend
    echo.
    pause
    exit /b 1
)
echo [OK] Backend built successfully!

echo.
echo [STEP 6] Building frontend (this may take a few minutes)...
docker build -t business-talk-frontend ./frontend
if errorlevel 1 (
    echo [ERROR] Frontend build failed!
    echo.
    echo Trying to diagnose the issue...
    echo.
    echo Checking frontend directory contents:
    dir frontend
    echo.
    pause
    exit /b 1
)
echo [OK] Frontend built successfully!

echo.
echo [STEP 7] Starting services...
docker-compose up -d
if errorlevel 1 (
    echo [ERROR] Failed to start services!
    pause
    exit /b 1
)

echo.
echo [STEP 8] Waiting for services to start...
timeout /t 5 /nobreak >nul

echo.
echo [STEP 9] Checking container status...
docker ps

echo.
echo ========================================
echo [SUCCESS] Build completed successfully!
echo ========================================
echo.
echo Your application is running:
echo   Frontend: http://localhost:80
echo   Backend:  http://localhost:5000
echo.
echo To view logs:
echo   docker-compose logs -f
echo.
echo To stop:
echo   docker-compose down
echo.
pause
