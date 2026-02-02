@echo off
echo Copying banner file...
copy /Y "logo\bannner.png" "frontend\public\banner.png"
if %ERRORLEVEL% EQU 0 (
    echo Banner copied successfully!
    echo.
    echo Now committing and pushing to GitHub...
    git add .
    git commit -m "Add banner image under Business Talk logo on home page"
    git push origin main
    echo.
    echo Done! Changes pushed to GitHub.
) else (
    echo Failed to copy banner file.
    pause
)
