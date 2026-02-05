#!/bin/bash
# EMERGENCY START - Gets site online FAST

echo "🚨 EMERGENCY START - Getting site online NOW..."
echo ""

# Kill everything on ports
echo "1. Killing all processes on ports 80, 443, 5000..."
sudo fuser -k 80/tcp 2>/dev/null
sudo fuser -k 443/tcp 2>/dev/null
sudo fuser -k 5000/tcp 2>/dev/null
sudo systemctl stop nginx 2>/dev/null
echo "✅ Ports cleared"
echo ""

# Clean Docker
echo "2. Cleaning Docker..."
cd ~/Business_talk
docker-compose -f docker-compose.prod.yml down 2>/dev/null
docker stop $(docker ps -aq) 2>/dev/null
echo "✅ Docker cleaned"
echo ""

# Start fresh
echo "3. Starting containers..."
docker-compose -f docker-compose.prod.yml up -d
echo "✅ Containers starting"
echo ""

# Wait
echo "4. Waiting 20 seconds..."
sleep 20
echo "✅ Ready"
echo ""

# Status
echo "5. Status:"
docker ps
echo ""

# Test
echo "6. Testing..."
curl -I http://localhost 2>&1 | head -3
echo ""

echo "=========================================="
echo "✅ DONE!"
echo "=========================================="
echo "Test your site: http://68.178.161.128"
echo ""
echo "View logs:"
echo "  docker logs business-talk-backend -f"
echo "  docker logs business-talk-frontend -f"
echo ""
