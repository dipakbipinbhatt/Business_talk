#!/bin/bash
echo "=========================================="
echo "COMPLETE SITE FIX - businesstalkwithdeepakbhatt.com"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ SUCCESS${NC}"
    else
        echo -e "${RED}❌ FAILED${NC}"
    fi
}

echo "STEP 1: Checking current status..."
echo "===================================="
echo ""

echo "1.1 Checking nginx status..."
sudo systemctl status nginx --no-pager | grep Active
echo ""

echo "1.2 Checking backend (PM2) status..."
pm2 list
echo ""

echo "1.3 Checking what's listening on ports..."
echo "Port 80:"
sudo lsof -i :80 2>/dev/null || echo "Nothing listening"
echo ""
echo "Port 443:"
sudo lsof -i :443 2>/dev/null || echo "Nothing listening"
echo ""
echo "Port 5000 (backend):"
sudo lsof -i :5000 2>/dev/null || echo "Nothing listening"
echo ""

echo "1.4 Checking frontend files..."
if [ -d "/var/www/business-talk/frontend" ]; then
    echo "Frontend directory exists"
    ls -la /var/www/business-talk/frontend/ | head -10
else
    echo -e "${RED}Frontend directory NOT FOUND!${NC}"
fi
echo ""

echo ""
echo "STEP 2: Fixing the issues..."
echo "===================================="
echo ""

echo "2.1 Stopping Docker containers (if running)..."
cd ~/Business_talk
docker-compose down 2>/dev/null
print_status

echo "2.2 Checking nginx configuration..."
sudo nginx -t
if [ $? -ne 0 ]; then
    echo -e "${RED}Nginx config has errors! Fixing...${NC}"
    # Copy the correct nginx config
    sudo cp ~/Business_talk/nginx.conf /etc/nginx/sites-available/business-talk
    sudo ln -sf /etc/nginx/sites-available/business-talk /etc/nginx/sites-enabled/business-talk
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t
fi
print_status

echo "2.3 Building frontend..."
cd ~/Business_talk/frontend
npm install
npm run build
print_status

echo "2.4 Deploying frontend files..."
sudo mkdir -p /var/www/business-talk/frontend
sudo cp -r dist/* /var/www/business-talk/frontend/
sudo chown -R www-data:www-data /var/www/business-talk/
print_status

echo "2.5 Starting/Restarting nginx..."
sudo systemctl restart nginx
print_status

echo "2.6 Building backend..."
cd ~/Business_talk/backend
npm install
npm run build
print_status

echo "2.7 Starting/Restarting backend with PM2..."
pm2 delete backend 2>/dev/null
pm2 start dist/index.js --name backend
pm2 save
print_status

echo ""
echo "STEP 3: Verification..."
echo "===================================="
echo ""

sleep 3

echo "3.1 Testing nginx..."
sudo systemctl status nginx --no-pager | grep Active
print_status

echo "3.2 Testing backend API..."
curl -s http://localhost:5000/api/health | head -5
print_status

echo "3.3 Testing frontend (HTTP)..."
curl -I http://localhost 2>&1 | head -5
print_status

echo "3.4 Testing HTTPS..."
curl -I https://localhost 2>&1 | head -5
print_status

echo ""
echo "=========================================="
echo "FINAL STATUS"
echo "=========================================="
echo ""

echo "Services Status:"
echo "----------------"
echo -n "Nginx: "
sudo systemctl is-active nginx
echo -n "Backend: "
pm2 list | grep backend | grep online > /dev/null && echo "online" || echo "offline"
echo ""

echo "Ports Listening:"
echo "----------------"
sudo netstat -tlnp | grep -E ':(80|443|5000)' | awk '{print $4, $7}' || sudo ss -tlnp | grep -E ':(80|443|5000)'
echo ""

echo "Frontend Files:"
echo "---------------"
ls -lh /var/www/business-talk/frontend/index.html 2>/dev/null || echo "index.html NOT FOUND!"
echo ""

echo "=========================================="
echo "FIX COMPLETE!"
echo "=========================================="
echo ""
echo "Your site should now be accessible at:"
echo "  https://businesstalkwithdeepakbhatt.com"
echo ""
echo "If still not working, check:"
echo "  1. Firewall: sudo ufw status"
echo "  2. DNS: ping businesstalkwithdeepakbhatt.com"
echo "  3. SSL certs: sudo certbot certificates"
echo "  4. Nginx logs: sudo tail -50 /var/log/nginx/error.log"
echo "  5. Backend logs: pm2 logs backend --lines 50"
echo ""
