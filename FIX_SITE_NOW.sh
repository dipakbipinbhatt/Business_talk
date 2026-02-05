#!/bin/bash
echo "=========================================="
echo "FIXING SITE - STEP BY STEP"
echo "=========================================="
echo ""

# Function to check if command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo "✅ SUCCESS"
    else
        echo "❌ FAILED"
    fi
    echo ""
}

echo "1. Checking current status..."
echo "------------------------------"
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "2. Stopping Docker containers..."
echo "---------------------------------"
docker-compose down
check_status

echo "3. Checking nginx on host..."
echo "----------------------------"
sudo systemctl status nginx --no-pager | grep Active
echo ""

echo "4. Checking what's using port 80 and 443..."
echo "--------------------------------------------"
echo "Port 80:"
sudo lsof -i :80 || echo "Nothing on port 80"
echo ""
echo "Port 443:"
sudo lsof -i :443 || echo "Nothing on port 443"
echo ""

echo "5. Starting nginx on host (for SSL)..."
echo "---------------------------------------"
sudo systemctl start nginx
check_status

echo "6. Checking nginx configuration..."
echo "----------------------------------"
sudo nginx -t
check_status

echo "7. Reloading nginx..."
echo "---------------------"
sudo systemctl reload nginx
check_status

echo "8. Checking if backend is running with PM2..."
echo "----------------------------------------------"
pm2 list
echo ""

echo "9. Starting backend if not running..."
echo "-------------------------------------"
cd ~/Business_talk/backend
pm2 start dist/index.js --name backend 2>/dev/null || pm2 restart backend
check_status

echo "10. Testing backend API..."
echo "--------------------------"
curl -I http://localhost:5000/api/health 2>&1 | head -5
echo ""

echo "11. Testing frontend (nginx)..."
echo "--------------------------------"
curl -I http://localhost 2>&1 | head -5
echo ""

echo "12. Testing HTTPS..."
echo "--------------------"
curl -I https://localhost 2>&1 | head -5
echo ""

echo "=========================================="
echo "FINAL STATUS CHECK"
echo "=========================================="
echo ""

echo "Nginx status:"
sudo systemctl status nginx --no-pager | grep Active
echo ""

echo "Backend status:"
pm2 list | grep backend
echo ""

echo "Ports in use:"
sudo netstat -tlnp | grep -E ':(80|443|5000)' || sudo ss -tlnp | grep -E ':(80|443|5000)'
echo ""

echo "=========================================="
echo "FIX COMPLETE!"
echo "=========================================="
echo ""
echo "Test your site now:"
echo "  http://businesstalkwithdeepakbhatt.com"
echo "  https://businesstalkwithdeepakbhatt.com"
echo ""
echo "If still not working, check:"
echo "  1. DNS: ping businesstalkwithdeepakbhatt.com"
echo "  2. Firewall: sudo ufw status"
echo "  3. Nginx logs: sudo tail -50 /var/log/nginx/error.log"
echo "  4. Backend logs: pm2 logs backend --lines 50"
echo ""
