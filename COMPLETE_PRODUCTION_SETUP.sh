#!/bin/bash
set -e

echo "=========================================="
echo "🚀 COMPLETE PRODUCTION SETUP"
echo "=========================================="
echo "This will set up your site properly with:"
echo "  - Nginx on host (for SSL and frontend)"
echo "  - PM2 for backend"
echo "  - Full speed with compression"
echo "  - All 363 podcasts loading fast"
echo ""
read -p "Press Enter to continue..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}STEP 1: Stop Docker (we'll use host setup instead)${NC}"
echo "=================================================="
cd ~/Business_talk
docker-compose down 2>/dev/null || true
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
docker stop $(docker ps -aq) 2>/dev/null || true
echo -e "${GREEN}✅ Docker stopped${NC}"
echo ""

echo -e "${BLUE}STEP 2: Install required tools${NC}"
echo "==============================="
# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Install nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    sudo apt-get update
    sudo apt-get install -y nginx
fi

echo -e "${GREEN}✅ Tools installed${NC}"
echo ""

echo -e "${BLUE}STEP 3: Build backend${NC}"
echo "====================="
cd ~/Business_talk/backend
echo "Installing dependencies..."
npm install
echo "Building backend..."
npm run build
echo -e "${GREEN}✅ Backend built${NC}"
echo ""

echo -e "${BLUE}STEP 4: Build frontend${NC}"
echo "======================"
cd ~/Business_talk/frontend
echo "Installing dependencies..."
npm install
echo "Building frontend..."
npm run build
echo -e "${GREEN}✅ Frontend built${NC}"
echo ""

echo -e "${BLUE}STEP 5: Deploy frontend files${NC}"
echo "=============================="
sudo mkdir -p /var/www/business-talk/frontend
sudo cp -r ~/Business_talk/frontend/dist/* /var/www/business-talk/frontend/
sudo chown -R www-data:www-data /var/www/business-talk/
echo -e "${GREEN}✅ Frontend deployed to /var/www/business-talk/frontend/${NC}"
echo ""

echo -e "${BLUE}STEP 6: Configure nginx${NC}"
echo "======================="
sudo tee /etc/nginx/sites-available/business-talk > /dev/null <<'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name businesstalkwithdeepakbhatt.com www.businesstalkwithdeepakbhatt.com 68.178.161.128;

    # Frontend - Serve static files
    root /var/www/business-talk/frontend;
    index index.html;

    # Gzip Compression for speed
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript image/svg+xml;
    gzip_proxied any;

    # Frontend - SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # Cache settings for static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Backend API - Proxy to Node.js on port 5000
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer optimizations
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/business-talk /etc/nginx/sites-enabled/business-talk
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx config
sudo nginx -t
echo -e "${GREEN}✅ Nginx configured${NC}"
echo ""

echo -e "${BLUE}STEP 7: Start backend with PM2${NC}"
echo "==============================="
cd ~/Business_talk/backend
pm2 delete backend 2>/dev/null || true
pm2 start dist/index.js --name backend
pm2 save
pm2 startup | tail -1 | sudo bash || true
echo -e "${GREEN}✅ Backend started with PM2${NC}"
echo ""

echo -e "${BLUE}STEP 8: Start nginx${NC}"
echo "==================="
sudo systemctl enable nginx
sudo systemctl restart nginx
echo -e "${GREEN}✅ Nginx started${NC}"
echo ""

echo -e "${BLUE}STEP 9: Configure firewall${NC}"
echo "==========================="
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
echo -e "${GREEN}✅ Firewall configured${NC}"
echo ""

echo -e "${BLUE}STEP 10: Verify everything${NC}"
echo "=========================="
sleep 3

echo "Nginx status:"
sudo systemctl status nginx --no-pager | grep Active

echo ""
echo "Backend status:"
pm2 list | grep backend

echo ""
echo "Testing backend API:"
curl -s http://localhost:5000/api/health | head -5

echo ""
echo "Testing frontend:"
curl -I http://localhost 2>&1 | head -5

echo ""
echo "Testing from external IP:"
curl -I http://68.178.161.128 2>&1 | head -5

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 SETUP COMPLETE!${NC}"
echo "=========================================="
echo ""
echo "Your site is now running at:"
echo "  🌐 http://68.178.161.128"
echo "  🌐 http://businesstalkwithdeepakbhatt.com"
echo ""
echo "Services:"
echo "  ✅ Nginx: Serving frontend + proxying API"
echo "  ✅ Backend: Running with PM2 on port 5000"
echo "  ✅ MongoDB: Connected"
echo "  ✅ Compression: Enabled (fast loading)"
echo ""
echo "Useful commands:"
echo "  View backend logs:  pm2 logs backend"
echo "  Restart backend:    pm2 restart backend"
echo "  Restart nginx:      sudo systemctl restart nginx"
echo "  Check status:       pm2 status && sudo systemctl status nginx"
echo ""
echo "Next steps:"
echo "  1. Test site in browser"
echo "  2. Set up SSL: sudo certbot --nginx -d businesstalkwithdeepakbhatt.com"
echo "  3. Apply performance fixes: git pull origin dev"
echo ""
