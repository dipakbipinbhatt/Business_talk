@echo off
echo ===================================================
echo   FIXING "FAILED TO LOAD PODCAST" / IP ISSUE
echo ===================================================
echo.
echo The error happens because you are accessing the site via IP:
echo http://68.178.161.128
echo.
echo But the system requires the SECURE DOMAIN:
echo https://businesstalkwithdeepakbhatt.com
echo.
echo I have updated 'nginx.conf' to AUTOMATICALLY redirect the IP
echo to the secure domain, so you can never make this mistake again.
echo.
echo [INSTRUCTIONS]
echo.
echo 1. Connect to your VPS:
echo    ssh root@68.178.161.128
echo.
echo 2. Open the Nginx configuration file:
echo    nano /etc/nginx/sites-available/business-talk
echo.
echo 3. DELETE everything (Hold Ctrl+K until empty)
echo.
echo 4. COPY & PASTE the new content of 'nginx.conf'
echo    (I will open it in Notepad for you now)
echo.
echo 5. Save and Exit (Ctrl+O, Enter, Ctrl+X)
echo.
echo 6. Restart Nginx:
echo    systemctl restart nginx
echo.
echo ===================================================
echo Opening nginx.conf...
notepad nginx.conf
pause
