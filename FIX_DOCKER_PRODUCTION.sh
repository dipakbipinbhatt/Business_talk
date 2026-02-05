#!/bin/bash
echo "=========================================="
echo "FIXING DOCKER PRODUCTION SETUP"
echo "=========================================="
echo ""

echo "Step 1: Stop nginx on host (it's blocking port 80)..."
echo "------------------------------------------------------"
sudo systemctl stop nginx
sudo systemctl disable nginx
echo "✅ Nginx stopped"
echo ""

echo "Step 2: Stop any existing containers..."
echo "----------------------------------------"
cd ~/Business_talk
docker-compose -f docker-compose.prod.yml down
echo "✅ Containers stopped"
echo ""

echo "Step 3: Start containers with production config..."
echo "---------------------------------------------------"
docker-compose -f docker-compose.prod.yml up -d
echo "✅ Containers starting..."
echo ""

echo "Step 4: Wait for containers to be ready..."
echo "-------------------------------------------"
sleep 10
echo ""

echo "Step 5: Check container status..."
echo "----------------------------------"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "Step 6: Test backend..."
echo "-----------------------"
sleep 3
curl -s http://localhost:5000/api/health | head -5
echo ""

echo "Step 7: Test frontend..."
echo "------------------------"
curl -I http://localhost 2>&1 | head -5
echo ""

echo "Step 8: Check container logs..."
echo "--------------------------------"
echo "Backend logs:"
docker logs business-talk-backend --tail 10
echo ""
echo "Frontend logs:"
docker logs business-talk-frontend --tail 10
echo ""

echo "=========================================="
echo "SETUP COMPLETE!"
echo "=========================================="
echo ""
echo "Your site should now be accessible at:"
echo "  http://68.178.161.128"
echo "  http://businesstalkwithdeepakbhatt.com"
echo ""
echo "Note: You'll need to set up SSL with Certbot for HTTPS"
echo ""
echo "To view logs:"
echo "  docker logs business-talk-backend -f"
echo "  docker logs business-talk-frontend -f"
echo ""
