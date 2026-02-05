#!/bin/bash
echo "=========================================="
echo "🚀 DEPLOYING WITH DOCKER + NGINX"
echo "=========================================="
echo ""

# Stop everything
echo "1. Stopping all services..."
docker-compose -f docker-compose.prod.yml down
sudo systemctl stop nginx

# Start Docker containers
echo "2. Starting Docker containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for containers
echo "3. Waiting for containers to start..."
sleep 20

# Configure nginx
echo "4. Configuring nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/business-talk
sudo ln -sf /etc/nginx/sites-available/business-talk /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t

# Start nginx
echo "5. Starting nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Configure firewall
echo "6. Configuring firewall..."
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

echo ""
echo "=========================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "Container status:"
docker ps
echo ""
echo "Test your site:"
echo "  http://68.178.161.128"
echo "  https://businesstalkwithdeepakbhatt.com"
echo ""
