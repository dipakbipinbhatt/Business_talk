#!/bin/bash
echo "=========================================="
echo "🔍 CHECKING DEPLOYMENT STATUS"
echo "=========================================="
echo ""

cd ~/Business_talk

echo "1. Container Status:"
echo "===================="
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "2. Checking what went wrong..."
echo "=============================="

# Check if frontend container exists but stopped
FRONTEND_STATUS=$(docker ps -a --filter "name=frontend" --format "{{.Status}}")
echo "Frontend status: $FRONTEND_STATUS"
echo ""

if echo "$FRONTEND_STATUS" | grep -q "Exited"; then
    echo "❌ Frontend container exited! Checking logs..."
    docker logs business-talk-frontend --tail 30
    echo ""
fi

# Check if backend is running
BACKEND_STATUS=$(docker ps --filter "name=backend" --format "{{.Status}}")
if [ -z "$BACKEND_STATUS" ]; then
    echo "❌ Backend container not running! Checking logs..."
    docker logs business-talk-backend --tail 30
    echo ""
else
    echo "✅ Backend is running"
    echo ""
fi

echo "3. Checking port conflicts..."
echo "============================="
echo "Port 80:"
sudo lsof -i :80 2>/dev/null || echo "Free"
echo ""
echo "Port 443:"
sudo lsof -i :443 2>/dev/null || echo "Free"
echo ""
echo "Port 3000:"
sudo lsof -i :3000 2>/dev/null || echo "Free"
echo ""
echo "Port 5000:"
sudo lsof -i :5000 2>/dev/null || echo "Free"
echo ""

echo "4. Applying fix..."
echo "=================="

# Stop nginx if running
echo "Stopping nginx..."
sudo systemctl stop nginx 2>/dev/null || true

# Kill any process on ports
echo "Freeing ports..."
sudo fuser -k 80/tcp 2>/dev/null || true
sudo fuser -k 443/tcp 2>/dev/null || true
sudo fuser -k 3000/tcp 2>/dev/null || true

# Remove stopped containers
echo "Removing stopped containers..."
docker-compose -f docker-compose.prod.yml down

# Start fresh
echo "Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "5. Waiting 20 seconds..."
sleep 20

echo ""
echo "6. Final status:"
echo "================"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "7. Testing containers..."
echo "========================"
echo "Backend:"
curl -s http://127.0.0.1:5000/api/health | head -5 || echo "Not responding"
echo ""
echo "Frontend:"
curl -I http://127.0.0.1:3000 2>&1 | head -5 || echo "Not responding"
echo ""

echo "8. Checking logs..."
echo "==================="
echo "Backend (last 5 lines):"
docker logs business-talk-backend --tail 5
echo ""
echo "Frontend (last 5 lines):"
docker logs business-talk-frontend --tail 5
echo ""

echo "=========================================="
echo "DIAGNOSIS COMPLETE"
echo "=========================================="
echo ""

# Check if both containers are running
BACKEND_RUNNING=$(docker ps --filter "name=backend" --format "{{.Names}}" | wc -l)
FRONTEND_RUNNING=$(docker ps --filter "name=frontend" --format "{{.Names}}" | wc -l)

if [ "$BACKEND_RUNNING" -eq 1 ] && [ "$FRONTEND_RUNNING" -eq 1 ]; then
    echo "✅ Both containers are running!"
    echo ""
    echo "Now run: sudo bash SETUP_NGINX.sh"
else
    echo "❌ Containers not running properly"
    echo ""
    echo "Run this to see full logs:"
    echo "  docker logs business-talk-backend"
    echo "  docker logs business-talk-frontend"
fi
echo ""
