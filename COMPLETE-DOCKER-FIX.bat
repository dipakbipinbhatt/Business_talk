@echo off
echo ============================================================
echo COMPLETE DOCKER FIX - Solving nginx.conf Error
echo ============================================================
echo.

echo [STEP 1] Stopping ALL Docker containers...
docker stop $(docker ps -aq) 2>nul
docker-compose down -v 2>nul

echo [STEP 2] Removing ALL Docker images and cache...
docker system prune -a -f --volumes
docker builder prune -a -f

echo [STEP 3] Verifying project structure...
echo.
echo Checking backend files:
if exist "backend\Dockerfile" (echo   [OK] backend\Dockerfile) else (echo   [ERROR] backend\Dockerfile MISSING & pause & exit /b 1)
if exist "backend\package.json" (echo   [OK] backend\package.json) else (echo   [ERROR] backend\package.json MISSING & pause & exit /b 1)
if exist "backend\tsconfig.json" (echo   [OK] backend\tsconfig.json) else (echo   [ERROR] backend\tsconfig.json MISSING & pause & exit /b 1)
if exist "backend\src" (echo   [OK] backend\src directory) else (echo   [ERROR] backend\src MISSING & pause & exit /b 1)

echo.
echo Checking frontend files:
if exist "frontend\Dockerfile" (echo   [OK] frontend\Dockerfile) else (echo   [ERROR] frontend\Dockerfile MISSING & pause & exit /b 1)
if exist "frontend\package.json" (echo   [OK] frontend\package.json) else (echo   [ERROR] frontend\package.json MISSING & pause & exit /b 1)
if exist "frontend\nginx.conf" (echo   [OK] frontend\nginx.conf) else (echo   [ERROR] frontend\nginx.conf MISSING & pause & exit /b 1)

echo.
echo [STEP 4] Building BACKEND only (from backend directory)...
cd backend
docker build -t business-talk-backend -f Dockerfile .
if errorlevel 1 (
    echo.
    echo [ERROR] Backend build failed!
    echo.
    echo Showing backend directory contents:
    dir
    echo.
    cd ..
    pause
    exit /b 1
)
cd ..
echo [SUCCESS] Backend built!

echo.
echo [STEP 5] Building FRONTEND only (from frontend directory)...
cd frontend
docker build -t business-talk-frontend -f Dockerfile .
if errorlevel 1 (
    echo.
    echo [ERROR] Frontend build failed!
    echo.
    echo Showing frontend directory contents:
    dir
    echo.
    cd ..
    pause
    exit /b 1
)
cd ..
echo [SUCCESS] Frontend built!

echo.
echo [STEP 6] Starting services with docker-compose...
docker-compose up -d
if errorlevel 1 (
    echo [ERROR] Failed to start services
    pause
    exit /b 1
)

echo.
echo [STEP 7] Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo [STEP 8] Checking running containers...
docker ps

echo.
echo [STEP 9] Checking logs for errors...
echo.
echo === Backend Logs ===
docker logs business-talk-backend --tail 20
echo.
echo === Frontend Logs ===
docker logs business-talk-frontend --tail 20

echo.
echo ============================================================
echo [SUCCESS] Deployment Complete!
echo ============================================================
echo.
echo Your application is running at:
echo   Frontend: http://localhost:80
echo   Backend:  http://localhost:5000
echo.
echo Useful commands:
echo   View logs:        docker-compose logs -f
echo   Stop services:    docker-compose down
echo   Restart:          docker-compose restart
echo   View containers:  docker ps
echo.
pause
