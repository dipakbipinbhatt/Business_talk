@echo off
REM Quick Fix Script for MongoDB Atlas Cluster Issue (Windows)
REM Run this locally to test the fix before deploying to EC2

echo.
echo ========================================
echo MongoDB Atlas Cluster Fix (Local Test)
echo ========================================
echo.

REM Step 1: Check if backend/.env exists
echo Step 1: Checking backend/.env...
if exist "backend\.env" (
    echo [OK] backend\.env exists
) else (
    echo [INFO] backend\.env does not exist, will copy from root
    if exist ".env" (
        copy ".env" "backend\.env" >nul
        echo [OK] Copied .env to backend\.env
    ) else (
        echo [ERROR] No .env file found in root directory
        echo Please create .env file with MongoDB credentials
        pause
        exit /b 1
    )
)
echo.

REM Step 2: Verify MongoDB credentials
echo Step 2: Verifying MongoDB credentials...
findstr /C:"MONGO_PUBLIC_KEY" "backend\.env" >nul
if %errorlevel% equ 0 (
    echo [OK] MONGO_PUBLIC_KEY found
) else (
    echo [ERROR] MONGO_PUBLIC_KEY missing
)

findstr /C:"MONGO_PRIVATE_KEY" "backend\.env" >nul
if %errorlevel% equ 0 (
    echo [OK] MONGO_PRIVATE_KEY found
) else (
    echo [ERROR] MONGO_PRIVATE_KEY missing
)

findstr /C:"MONGO_PROJECT_ID" "backend\.env" >nul
if %errorlevel% equ 0 (
    echo [OK] MONGO_PROJECT_ID found
) else (
    echo [ERROR] MONGO_PROJECT_ID missing
)
echo.

REM Step 3: Install dependencies
echo Step 3: Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed
    cd ..
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Step 4: Build backend
echo Step 4: Building backend...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed
    cd ..
    pause
    exit /b 1
)
echo [OK] Backend built successfully
cd ..
echo.

REM Step 5: Test with verification script
echo Step 5: Running verification script...
if exist "verify-mongodb-credentials.js" (
    node verify-mongodb-credentials.js
) else (
    echo [SKIP] verify-mongodb-credentials.js not found
)
echo.

echo ========================================
echo Fix Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start backend: cd backend ^&^& npm run dev
echo 2. Open admin dashboard in browser
echo 3. Check MongoDB Atlas Cluster section
echo.
echo To deploy to EC2:
echo 1. Commit changes: git add . ^&^& git commit -m "Fix MongoDB cluster credentials"
echo 2. Push to GitHub: git push origin main
echo 3. SSH to EC2 and run: bash fix-ec2-mongodb.sh
echo.
pause
