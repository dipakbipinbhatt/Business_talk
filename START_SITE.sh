#!/bin/bash
echo "=========================================="
echo "🚀 STARTING YOUR SITE"
echo "=========================================="
echo ""

cd ~/Business_talk

echo "Step 1: Cleaning up..."
docker-compose -f docker-compose.prod.yml down
sudo systemctl stop nginx 2>/dev/null || true
sudo fuser -k 80/tcp 2>/dev/null || true
sudo fuser -k 443/tcp 2>/dev/null || true
echo "✅ Cleanup done"
echo ""

echo "Step 2: Starting containers (already built)..."
docker-compose -f docker-compose.prod.yml up -d
echo "✅ Containers starting"
echo ""

echo "Step 3: Waiting 30 seconds for containers..."
for i in {30..1}; do
    printf "\r  %2d seconds..." $i
    sleep 1
done
echo ""
echo "✅ Wait complete"
echo ""

echo "Step 4: Checking status..."
docker ps
echo ""

echo "Step 5: Testing containers..."
echo "Backend:"
curl -s http://127.0.0.1:5000/api/health || echo "Not ready yet"
echo ""
echo "Frontend:"
curl -I http://127.0.0.1:3000 2>&1 | head -3 || echo "Not ready yet"
echo ""

echo "Step 6: Setting up nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/business-talk
sudo ln -sf /etc/nginx/sites-available/business-talk /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl start nginx
echo "✅ Nginx started"
echo ""

echo "Step 7: Opening firewall..."
sudo ufw allow 80/tcp 2>/dev/null || true
sudo ufw allow 443/tcp 2>/dev/null || true
echo "✅ Firewall configured"
echo ""

echo "=========================================="
echo "✅ SITE IS STARTING!"
echo "=========================================="
echo ""
echo "Wait 1 more minute for containers to be fully ready, then test:"
echo "  http://68.178.161.128"
echo "  http://businesstalkwithdeepakbhatt.com"
echo ""
echo "View logs:"
echo "  docker logs business-talk-backend -f"
echo "  docker logs business-talk-frontend -f"
echo ""
