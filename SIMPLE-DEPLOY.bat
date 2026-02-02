@echo off
echo ========================================
echo SIMPLE DEPLOYMENT SCRIPT
echo ========================================
echo.

REM Clean everything
echo Cleaning Docker...
docker-compose down 2>nul
docker system prune -a -f

echo.
echo Building and starting services...
docker-compose up --build -d

echo.
echo Waiting 10 seconds for services to start...
timeout /t 10 /nobreak >nul

echo.
echo Checking status...
docker ps

echo.
echo ========================================
echo DONE!
echo ========================================
echo.
echo Access your app at:
echo   http://localhost:80
echo.
echo View logs:
echo   docker-compose logs -f
echo.
pause
