@echo off
echo Adding banner and updating podcast cards...
echo.

REM Add all changes
git add .

REM Commit changes
git commit -m "Add banner under Business Talk logo and update Podcasts page to use PodcastCard component"

REM Push to GitHub
git push origin main

echo.
echo Done! Changes pushed to GitHub.
pause
