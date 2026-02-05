#!/bin/bash
echo "=========================================="
echo "FRONTEND CONTAINER STATUS CHECK"
echo "=========================================="
echo ""

echo "1. Docker Containers Status:"
echo "----------------------------"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "2. Frontend Container Logs (last 20 lines):"
echo "--------------------------------------------"
docker logs frontend --tail 20
echo ""

echo "3. Test Frontend HTTP Response:"
echo "--------------------------------"
curl -I http://localhost:3000 2>&1 | head -10
echo ""

echo "4. Test Backend API:"
echo "--------------------"
curl -I http://localhost:5000/api/health 2>&1 | head -10
echo ""

echo "5. Check if Frontend is Serving Files:"
echo "---------------------------------------"
docker exec frontend ls -la /usr/share/nginx/html/ | head -10
echo ""

echo "6. Check Nginx Config:"
echo "----------------------"
docker exec frontend cat /etc/nginx/conf.d/default.conf
echo ""

echo "=========================================="
echo "DIAGNOSIS COMPLETE"
echo "=========================================="
echo ""
echo "If you see:"
echo "  ✅ HTTP/1.1 200 OK - Frontend is working!"
echo "  ✅ index.html in /usr/share/nginx/html/ - Files are there!"
echo "  ❌ Connection refused - Container not accessible"
echo "  ❌ No such file - Build files missing"
echo ""
