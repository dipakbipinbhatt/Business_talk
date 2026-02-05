@echo off
echo ==========================================
echo AUTOMATIC FIX SCRIPT
echo ==========================================
echo.

REM Step 1: Pull latest code
echo Pulling latest code from GitHub...
git pull origin main
if %errorlevel% neq 0 (
    echo ERROR: Git pull failed
    pause
    exit /b 1
)
echo OK: Code updated
echo.

REM Step 2: Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo OK: Dependencies installed
echo.

REM Step 3: Kill any node processes on port 5000
echo Stopping old backend...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    taskkill /F /PID %%a 2>nul
)
echo OK: Old processes stopped
echo.

REM Step 4: Start backend
echo Starting backend...
cd backend
start /B npm run dev
cd ..
echo OK: Backend starting...
echo.

REM Step 5: Wait for backend to start
echo Waiting for backend to start...
timeout /t 10 /nobreak >nul
echo.

REM Step 6: Test backend API
echo Testing backend API...
curl -s http://localhost:5000/api/podcasts?limit=1 >nul 2>&1
if %errorlevel% equ 0 (
    echo OK: Backend API is responding!
) else (
    echo ERROR: Backend API not responding
    echo Check if backend started correctly
    pause
    exit /b 1
)
echo.

REM Step 7: Test compact mode
echo Testing compact mode...
curl -w "Time: %%{time_total}s\n" http://localhost:5000/api/podcasts?limit=0^&compact=true
echo.

echo ==========================================
echo FIX COMPLETE!
echo ==========================================
echo.
echo Summary:
echo   - Code updated from GitHub
echo   - Dependencies installed
echo   - Backend restarted
echo   - API responding
echo.
echo Next steps:
echo   1. Open: https://businesstalkwithdeepakbhatt.com
echo   2. Press Ctrl+Shift+R to refresh
echo   3. Site should load fast now!
echo.
echo ==========================================
pause
