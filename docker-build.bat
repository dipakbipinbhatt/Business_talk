@echo off
REM Docker Build Script for Business Talk (Windows)
REM This script handles all Docker build errors and provides clear feedback

echo ========================================
echo Business Talk - Docker Build Script
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)
echo [OK] Docker is installed

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)
echo [OK] Docker is running

REM Clean up old containers and images
echo.
echo [INFO] Cleaning up old containers and images...
docker-compose down 2>nul
docker system prune -f
echo [OK] Cleanup complete

REM Check if .env file exists
if not exist ".env" (
    echo [WARNING] .env file not found
    if exist "docker.env.example" (
        echo [INFO] Creating .env from example...
        copy docker.env.example .env
        echo [WARNING] Please edit .env file with your actual credentials
    ) else (
        echo [ERROR] .env file is required. Please create it.
        pause
        exit /b 1
    )
)
echo [OK] .env file exists

REM Build backend
echo.
echo [INFO] Building backend service...
docker build -t business-talk-backend ./backend
if errorlevel 1 (
    echo [ERROR] Backend build failed
    echo [INFO] Trying without cache...
    docker build --no-cache -t business-talk-backend ./backend
    if errorlevel 1 (
        echo [ERROR] Backend build failed completely
        echo [INFO] Checking package-lock.json...
        if not exist "backend\package-lock.json" (
            echo [WARNING] package-lock.json not found. Generating...
            cd backend
            call npm install
            cd ..
            echo [INFO] Retrying build...
            docker build -t business-talk-backend ./backend
        ) else (
            echo [ERROR] Please check backend/Dockerfile and package.json
            pause
            exit /b 1
        )
    )
)
echo [OK] Backend built successfully

REM Build frontend
echo.
echo [INFO] Building frontend service...
docker build -t business-talk-frontend ./frontend
if errorlevel 1 (
    echo [ERROR] Frontend build failed
    echo [INFO] Trying without cache...
    docker build --no-cache -t business-talk-frontend ./frontend
    if errorlevel 1 (
        echo [ERROR] Frontend build failed completely
        echo [INFO] Checking package-lock.json...
        if not exist "frontend\package-lock.json" (
            echo [WARNING] package-lock.json not found. Generating...
            cd frontend
            call npm install
            cd ..
            echo [INFO] Retrying build...
            docker build -t business-talk-frontend ./frontend
        ) else (
            echo [ERROR] Please check frontend/Dockerfile and package.json
            pause
            exit /b 1
        )
    )
)
echo [OK] Frontend built successfully

REM Start services
echo.
echo [INFO] Starting services with docker-compose...
docker-compose up -d
if errorlevel 1 (
    echo [ERROR] Failed to start services
    pause
    exit /b 1
)
echo [OK] Services started successfully

REM Wait for services to be ready
echo.
echo [INFO] Waiting for services to be ready...
timeout /t 5 /nobreak >nul

REM Show running containers
echo.
echo [INFO] Running containers:
docker ps

echo.
echo ========================================
echo [SUCCESS] Build and deployment complete!
echo ========================================
echo.
echo Access your application:
echo   Frontend: http://localhost:80
echo   Backend:  http://localhost:5000
echo.
echo View logs:
echo   docker-compose logs -f
echo.
echo Stop services:
echo   docker-compose down
echo.
pause
