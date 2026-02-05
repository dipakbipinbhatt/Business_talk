@echo off
echo ========================================
echo Docker Status Check
echo ========================================
echo.

echo Checking running containers...
docker-compose ps
echo.

echo ========================================
echo Backend Logs (last 30 lines):
echo ========================================
docker-compose logs --tail=30 backend
echo.

echo ========================================
echo Frontend Logs (last 30 lines):
echo ========================================
docker-compose logs --tail=30 frontend
echo.

echo ========================================
echo Testing Backend API:
echo ========================================
curl -s http://localhost:5000/api/podcasts?limit=1 | head -c 200
echo.
echo.

echo ========================================
echo Testing Frontend:
echo ========================================
curl -s -I http://localhost:5173
echo.

echo ========================================
echo Summary:
echo ========================================
echo If you see:
echo   - Backend: "Server running" and "MongoDB Connected" = GOOD
echo   - Frontend: "nginx/1.29.5" and "200 OK" = GOOD
echo   - API returns JSON = GOOD
echo.
echo If backend shows errors, run: docker-compose restart backend
echo If frontend shows errors, run: docker-compose restart frontend
echo ========================================
pause
