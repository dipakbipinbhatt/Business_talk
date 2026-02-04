@echo off
REM Sync Environment Variables Script
REM This script syncs the root .env file to frontend and backend

echo ==========================================
echo Environment Variables Sync
echo ==========================================
echo.

if not exist .env (
    echo ERROR: Root .env file not found!
    echo Please create .env file in the root directory first.
    pause
    exit /b 1
)

echo Reading master configuration from root .env...
echo.

REM Create backend .env
echo [1/3] Syncing to backend/.env...
(
    echo # MongoDB Configuration
    findstr /B "MONGODB_URI=" .env
    echo.
    echo # JWT Configuration
    findstr /B "JWT_SECRET=" .env
    findstr /B "JWT_EXPIRES_IN=" .env
    findstr /B "JWT_REFRESH_SECRET=" .env
    findstr /B "JWT_REFRESH_EXPIRES_IN=" .env
    echo.
    echo # Server Configuration
    findstr /B "PORT=" .env
    findstr /B "NODE_ENV=" .env
    echo.
    echo # CORS Configuration
    findstr /B "FRONTEND_URL=" .env
    echo.
    echo # Admin Configuration
    findstr /B "ADMIN_EMAIL=" .env
    findstr /B "ADMIN_PASSWORD=" .env
    echo.
    echo # Render Configuration
    findstr /B "RENDER_API_KEY=" .env
    findstr /B "RENDER_FRONTEND_SERVICE_ID=" .env
    findstr /B "RENDER_BACKEND_SERVICE_ID=" .env
    echo.
    echo # MongoDB Atlas API ^(for cluster monitoring^)
    findstr /B "MONGO_PUBLIC_KEY=" .env
    findstr /B "MONGO_PRIVATE_KEY=" .env
    findstr /B "MONGO_PROJECT_ID=" .env
) > backend\.env
echo OK Backend configuration updated
echo.

REM Create frontend .env.production
echo [2/3] Syncing to frontend/.env.production...
(
    echo # Production Environment Variables
    echo # Backend API URL - Points to the GoDaddy VPS backend
    echo # Using the domain instead of IP for better SSL support
    findstr /B "VITE_API_URL=" .env
) > frontend\.env.production
echo OK Frontend production configuration updated
echo.

REM Create frontend .env (for local development)
echo [3/3] Syncing to frontend/.env...
(
    echo # Development Environment Variables
    echo # For local development, use the proxy configured in vite.config.ts
    echo # The proxy will forward /api requests to http://localhost:5000
    echo # Leave this empty or comment out to use the proxy
    echo # VITE_API_URL=/api
) > frontend\.env
echo OK Frontend development configuration updated
echo.

echo ==========================================
echo Sync Complete!
echo ==========================================
echo.
echo Configuration files updated:
echo   - backend/.env
echo   - frontend/.env.production
echo   - frontend/.env
echo.
echo Current configuration:
findstr /B "DOMAIN=" .env
findstr /B "VPS_IP=" .env
findstr /B "VITE_API_URL=" .env
findstr /B "FRONTEND_URL=" .env
findstr /B "NODE_ENV=" .env
echo.
echo You can now build and deploy your application.
echo.
pause
