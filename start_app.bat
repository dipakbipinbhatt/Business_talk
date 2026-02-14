@echo off
echo ===========================================
echo Starting Business Talk Application
echo ===========================================

echo Starting Backend Server...
start "Business Talk Backend" cmd /k "cd backend && npm run dev"

echo Starting Frontend Dev Server...
start "Business Talk Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Application started!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo.
echo Please wait a moment for the servers to initialize.
pause
