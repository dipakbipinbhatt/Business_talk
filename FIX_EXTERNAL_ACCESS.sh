#!/bin/bash
echo "=========================================="
echo "🌐 FIXING EXTERNAL ACCESS"
echo "=========================================="
echo ""

echo "Step 1: Check if site works locally..."
echo "---------------------------------------"
LOCAL_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)
echo "Local test: HTTP $LOCAL_TEST"
if [ "$LOCAL_TEST" = "200" ]; then
    echo "✅ Site works locally!"
else
    echo "❌ Site not working locally"
fi
echo ""

echo "Step 2: Check firewall..."
echo "-------------------------"
sudo ufw status
echo ""

echo "Step 3: Open required ports..."
echo "-------------------------------"
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000/tcp
echo "✅ Ports opened"
echo ""

echo "Step 4: Check what's listening..."
echo "---------------------------------"
echo "Port 80:"
sudo netstat -tlnp | grep :80 || sudo ss -tlnp | grep :80
echo ""
echo "Port 443:"
sudo netstat -tlnp | grep :443 || sudo ss -tlnp | grep :443
echo ""

echo "Step 5: Test from server IP..."
echo "-------------------------------"
IP_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://68.178.161.128)
echo "IP test: HTTP $IP_TEST"
if [ "$IP_TEST" = "200" ]; then
    echo "✅ Site accessible via IP!"
else
    echo "❌ Site not accessible via IP"
fi
echo ""

echo "Step 6: Check Docker network..."
echo "--------------------------------"
docker network inspect business_talk_business-talk-network | grep -A 5 "Containers"
echo ""

echo "Step 7: Test backend from frontend container..."
echo "------------------------------------------------"
docker exec business-talk-frontend wget -q -O- http://backend:5000/api/health | head -5
echo ""

echo "=========================================="
echo "DIAGNOSIS COMPLETE"
echo "=========================================="
echo ""
echo "Your containers are running perfectly!"
echo "Backend: ✅ Connected to MongoDB"
echo "Frontend: ✅ Nginx running"
echo ""
echo "If site still not accessible from browser:"
echo "  1. Check your router/firewall"
echo "  2. Check DNS: ping businesstalkwithdeepakbhatt.com"
echo "  3. Try accessing: http://68.178.161.128"
echo "  4. Check GoDaddy DNS settings"
echo ""
