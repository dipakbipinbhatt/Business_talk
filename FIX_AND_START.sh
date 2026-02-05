#!/bin/bash
echo "🔧 Fixing and starting containers..."
echo ""

cd ~/Business_talk

# Stop everything
echo "1. Stopping containers..."
docker-compose -f docker-compose.prod.yml down

# Rebuild frontend (fixed SSL issue)
echo "2. Rebuilding frontend..."
docker-compose -f docker-compose.prod.yml build --no-cache frontend

# Start all containers
echo "3. Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait
echo "4. Waiting 20 seconds..."
sleep 20

# Check status
echo "5. Container status:"
docker ps

echo ""
echo "6. Testing backend..."
docker logs business-talk-backend --tail 5

echo ""
echo "7. Testing frontend..."
docker logs business-talk-frontend --tail 5

echo ""
echo "8. Configure nginx on host..."
sudo cp nginx.conf /etc/nginx/sites-available/business-talk
sudo ln -sf /etc/nginx/sites-available/business-talk /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

echo ""
echo "✅ DONE!"
echo "Test: http://68.178.161.128"
echo ""
