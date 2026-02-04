@echo off
echo ===================================================
echo   FINAL FIX: BLOCK QUIC ON FIREWALL
echo ===================================================
echo.
echo If the Admin Panel still shows "ERR_QUIC_PROTOCOL_ERROR",
echo we will block the protocol at the firewall level.
echo.
echo [INSTRUCTIONS]
echo.
echo 1. Login to VPS:
echo    ssh deepak@68.178.161.128
echo.
echo 2. Run this Firewall Command (Blocks the broken protocol):
echo    sudo ufw deny 443/udp
echo.
echo    (If it says "ufw: command not found", skip this step)
echo.
echo 3. Verify Nginx Config (Double Check):
echo    grep "Alt-Svc" Business_talk/frontend/nginx.conf
echo.
echo    It should print: add_header Alt-Svc "";
echo.
echo 4. Restart Container one last time:
echo    cd Business_talk
echo    docker-compose -f docker-compose.prod.yml up -d --force-recreate --build frontend
echo.
echo ===================================================
echo IMPORTANT: TRY OPENING THE SITE IN INCOGNITO MODE!
echo Chrome remembers errors for a long time. Incognito is fresh.
echo ===================================================
pause
