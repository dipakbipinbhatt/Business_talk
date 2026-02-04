@echo off
echo ===================================================
echo   FIXING "ERR_QUIC_PROTOCOL_ERROR" ON VPS
echo ===================================================
echo.
echo The error is caused by the server trying to use the QUIC protocol
echo but the firewall blocking it. We need to update Nginx config.
echo.
echo I have created a file 'nginx.conf' with the fix.
echo.
echo [INSTRUCTIONS]
echo.
echo 1. Connect to your VPS:
echo    ssh root@68.178.161.128
echo.
echo 2. Open the Nginx configuration file:
echo    nano /etc/nginx/sites-available/business-talk
echo.
echo 3. DELETE everything in that file.
echo.
echo 4. COPY & PASTE the content of the 'nginx.conf' file
echo    (I will open it for you in Notepad now)
echo.
echo 5. Save and Exit (Ctrl+O, Enter, Ctrl+X)
echo.
echo 6. Test and Restart Nginx:
echo    nginx -t
echo    systemctl restart nginx
echo.
echo ===================================================
echo Opening nginx.conf in Notepad...
notepad nginx.conf
echo.
echo After updating Nginx, try accessing the admin panel again.
echo.
echo IMPORTANT: If the error persists effectively immediately,
echo open CHROME in INCOGNITO MODE to test, as Chrome caches
echo the QUIC protocol heavily.
echo.
pause
