@echo off
echo ========================================
echo Business Talk - Local Development Setup
echo ========================================
echo.

REM Check if frontend .env.local exists
if not exist "frontend\.env.local" (
    echo Creating frontend\.env.local...
    echo VITE_API_URL=http://localhost:5000/api > frontend\.env.local
    echo ✅ Created frontend\.env.local
) else (
    echo ✅ frontend\.env.local already exists
)

echo.
echo ========================================
echo Testing Database Connection...
echo ========================================
cd backend
call npx tsx src\test-db-connection.ts
cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo 📝 Next Steps:
echo.
echo 1. Start Backend (in one terminal):
echo    cd backend
echo    npm run dev
echo.
echo 2. Start Frontend (in another terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Access the Application:
echo    Frontend: http://localhost:5173
echo    Admin:    http://localhost:5173/admin/login
echo    Backend:  http://localhost:5000
echo.
echo 4. Login Credentials:
echo    Email:    admin@businesstalk.com
echo    Password: Admin@123
echo.
echo 📚 For more help, see TROUBLESHOOTING_DATABASE.md
echo.
pause

