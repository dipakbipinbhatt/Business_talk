#!/bin/bash
# QUICK FIX - Run this to get your site back online

echo "🚀 Quick Fix - Getting your site back online..."
echo ""

# Stop Docker (not needed for production)
docker-compose down 2>/dev/null

# Build and deploy frontend
cd ~/Business_talk/frontend
echo "📦 Building frontend..."
npm run build
sudo mkdir -p /var/www/business-talk/frontend
sudo cp -r dist/* /var/www/business-talk/frontend/
sudo chown -R www-data:www-data /var/www/business-talk/

# Restart nginx
echo "🔄 Restarting nginx..."
sudo systemctl restart nginx

# Build and restart backend
cd ~/Business_talk/backend
echo "📦 Building backend..."
npm run build
echo "🔄 Restarting backend..."
pm2 restart backend 2>/dev/null || pm2 start dist/index.js --name backend

echo ""
echo "✅ Done! Testing..."
sleep 2

# Test
echo ""
echo "Nginx: $(sudo systemctl is-active nginx)"
echo "Backend: $(pm2 list | grep backend | grep -o 'online\|stopped\|errored')"
echo ""
echo "🌐 Your site: https://businesstalkwithdeepakbhatt.com"
echo ""
