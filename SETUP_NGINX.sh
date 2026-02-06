#!/bin/bash
echo "=========================================="
echo "🌐 SETTING UP NGINX"
echo "=========================================="
echo ""

# Check if containers are running
BACKEND_RUNNING=$(docker ps --filter "name=backend" --format "{{.Names}}" | wc -l)
FRONTEND_RUNNING=$(docker ps --filter "name=frontend" --format "{{.Names}}" | wc -l)

if [ "$BACKEND_RUNNING" -eq 0 ] || [ "$FRONTEND_RUNNING" -eq 0 ]; then
    echo "❌ Containers not running! Run CHECK_AND_FIX.sh first"
    exit 1
fi

echo "✅ Containers are running"
echo ""

echo "1. Copying nginx configuration..."
sudo cp ~/Business_talk/nginx.conf /etc/nginx/sites-available/business-talk

echo "2. Enabling site..."
sudo ln -sf /etc/nginx/sites-available/business-talk /etc/nginx/sites-enabled/business-talk
sudo rm -f /etc/nginx/sites-enabled/default

echo "3. Testing nginx configuration..."
if sudo nginx -t; then
    echo "✅ Nginx config valid"
else
    echo "❌ Nginx config invalid"
    exit 1
fi

echo "4. Starting nginx..."
sudo systemctl enable nginx
sudo systemctl start nginx

echo "5. Checking nginx status..."
if sudo systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx failed to start"
    sudo systemctl status nginx
    exit 1
fi

echo "6. Opening firewall ports..."
sudo ufw allow 80/tcp 2>/dev/null || true
sudo ufw allow 443/tcp 2>/dev/null || true

echo ""
echo "=========================================="
echo "✅ NGINX SETUP COMPLETE!"
echo "=========================================="
echo ""

echo "Testing site..."
sleep 3
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://68.178.161.128 2>/dev/null || echo "000")
echo "HTTP Response: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    echo "🎉 YOUR SITE IS LIVE!"
    echo ""
    echo "Access your site at:"
    echo "  http://68.178.161.128"
    echo "  http://businesstalkwithdeepakbhatt.com"
    echo ""
else
    echo "⚠️  Site returned HTTP $HTTP_CODE"
    echo ""
    echo "Check nginx logs:"
    echo "  sudo tail -50 /var/log/nginx/error.log"
fi
