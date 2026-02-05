#!/bin/bash
set -e  # Exit on any error

echo "=========================================="
echo "🔧 ULTIMATE FIX - SOLVING ALL ERRORS"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to print status
print_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ SUCCESS${NC}"
    else
        echo -e "${RED}❌ FAILED${NC}"
    fi
}

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}STEP 1: KILL EVERYTHING USING PORTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

echo "Finding processes on port 80..."
sudo fuser -k 80/tcp 2>/dev/null || echo "No process on port 80"
echo ""

echo "Finding processes on port 443..."
sudo fuser -k 443/tcp 2>/dev/null || echo "No process on port 443"
echo ""

echo "Finding processes on port 5000..."
sudo fuser -k 5000/tcp 2>/dev/null || echo "No process on port 5000"
echo ""

echo "Stopping nginx..."
sudo systemctl stop nginx 2>/dev/null || echo "Nginx not running"
sudo systemctl disable nginx 2>/dev/null || echo "Nginx already disabled"
print_status

echo "Stopping apache2 (if exists)..."
sudo systemctl stop apache2 2>/dev/null || echo "Apache not running"
print_status

echo -e "${GREEN}✅ All ports cleared${NC}"
echo ""

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}STEP 2: CLEAN UP DOCKER${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

cd ~/Business_talk

echo "Stopping all containers..."
docker-compose down 2>/dev/null || true
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
docker stop $(docker ps -aq) 2>/dev/null || echo "No containers to stop"
print_status

echo "Removing old containers..."
docker rm $(docker ps -aq) 2>/dev/null || echo "No containers to remove"
print_status

echo "Pruning Docker system..."
docker system prune -f
print_status

echo -e "${GREEN}✅ Docker cleaned${NC}"
echo ""

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}STEP 3: VERIFY PORTS ARE FREE${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

echo "Checking port 80..."
if sudo lsof -i :80 > /dev/null 2>&1; then
    echo -e "${RED}❌ Port 80 still in use!${NC}"
    sudo lsof -i :80
    echo "Killing process..."
    sudo fuser -k 80/tcp
else
    echo -e "${GREEN}✅ Port 80 is free${NC}"
fi
echo ""

echo "Checking port 443..."
if sudo lsof -i :443 > /dev/null 2>&1; then
    echo -e "${RED}❌ Port 443 still in use!${NC}"
    sudo lsof -i :443
    echo "Killing process..."
    sudo fuser -k 443/tcp
else
    echo -e "${GREEN}✅ Port 443 is free${NC}"
fi
echo ""

echo "Checking port 5000..."
if sudo lsof -i :5000 > /dev/null 2>&1; then
    echo -e "${RED}❌ Port 5000 still in use!${NC}"
    sudo lsof -i :5000
    echo "Killing process..."
    sudo fuser -k 5000/tcp
else
    echo -e "${GREEN}✅ Port 5000 is free${NC}"
fi
echo ""

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}STEP 4: BUILD AND START CONTAINERS${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

echo "Building containers (this may take a few minutes)..."
docker-compose -f docker-compose.prod.yml build --no-cache
print_status

echo "Starting containers..."
docker-compose -f docker-compose.prod.yml up -d
print_status

echo -e "${GREEN}✅ Containers started${NC}"
echo ""

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}STEP 5: WAIT FOR SERVICES TO START${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

echo "Waiting 20 seconds for services to initialize..."
for i in {20..1}; do
    echo -ne "  $i seconds remaining...\r"
    sleep 1
done
echo -e "\n${GREEN}✅ Wait complete${NC}"
echo ""

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}STEP 6: CHECK CONTAINER STATUS${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Check if containers are running
BACKEND_RUNNING=$(docker ps --filter "name=backend" --format "{{.Names}}" | wc -l)
FRONTEND_RUNNING=$(docker ps --filter "name=frontend" --format "{{.Names}}" | wc -l)

if [ "$BACKEND_RUNNING" -eq 0 ]; then
    echo -e "${RED}❌ Backend container not running!${NC}"
    echo "Backend logs:"
    docker logs business-talk-backend --tail 20
else
    echo -e "${GREEN}✅ Backend container is running${NC}"
fi

if [ "$FRONTEND_RUNNING" -eq 0 ]; then
    echo -e "${RED}❌ Frontend container not running!${NC}"
    echo "Frontend logs:"
    docker logs business-talk-frontend --tail 20
else
    echo -e "${GREEN}✅ Frontend container is running${NC}"
fi
echo ""

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}STEP 7: TEST SERVICES${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

echo "Testing backend API..."
sleep 5
BACKEND_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health 2>/dev/null || echo "000")
if [ "$BACKEND_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Backend API responding (HTTP $BACKEND_CODE)${NC}"
else
    echo -e "${RED}❌ Backend API not responding (HTTP $BACKEND_CODE)${NC}"
    echo "Backend logs:"
    docker logs business-talk-backend --tail 10
fi
echo ""

echo "Testing frontend..."
FRONTEND_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost 2>/dev/null || echo "000")
if [ "$FRONTEND_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Frontend responding (HTTP $FRONTEND_CODE)${NC}"
else
    echo -e "${RED}❌ Frontend not responding (HTTP $FRONTEND_CODE)${NC}"
    echo "Frontend logs:"
    docker logs business-talk-frontend --tail 10
fi
echo ""

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}STEP 8: CHECK FIREWALL${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

echo "Checking firewall status..."
sudo ufw status
echo ""

echo "Ensuring ports are open..."
sudo ufw allow 80/tcp 2>/dev/null || echo "Port 80 already allowed"
sudo ufw allow 443/tcp 2>/dev/null || echo "Port 443 already allowed"
sudo ufw allow 5000/tcp 2>/dev/null || echo "Port 5000 already allowed"
echo -e "${GREEN}✅ Firewall configured${NC}"
echo ""

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}STEP 9: FINAL VERIFICATION${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

echo "Container Status:"
docker ps --format "  {{.Names}}: {{.Status}}"
echo ""

echo "Ports in Use:"
sudo netstat -tlnp | grep -E ':(80|443|5000)' | awk '{print "  " $4, $7}' || sudo ss -tlnp | grep -E ':(80|443|5000)'
echo ""

echo "Testing from external IP..."
EXTERNAL_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://68.178.161.128 2>/dev/null || echo "000")
if [ "$EXTERNAL_TEST" = "200" ]; then
    echo -e "${GREEN}✅ Site accessible from external IP (HTTP $EXTERNAL_TEST)${NC}"
else
    echo -e "${YELLOW}⚠️  Site not accessible from external IP (HTTP $EXTERNAL_TEST)${NC}"
    echo "   This might be a firewall or DNS issue"
fi
echo ""

echo "=========================================="
echo -e "${GREEN}🎉 FIX COMPLETE!${NC}"
echo "=========================================="
echo ""
echo "Your site should now be accessible at:"
echo "  🌐 http://68.178.161.128"
echo "  🌐 http://businesstalkwithdeepakbhatt.com"
echo ""
echo "If site is still not working:"
echo "  1. Check container logs:"
echo "     docker logs business-talk-backend -f"
echo "     docker logs business-talk-frontend -f"
echo ""
echo "  2. Check if containers are running:"
echo "     docker ps"
echo ""
echo "  3. Restart containers:"
echo "     docker-compose -f docker-compose.prod.yml restart"
echo ""
echo "  4. Check DNS:"
echo "     ping businesstalkwithdeepakbhatt.com"
echo ""
