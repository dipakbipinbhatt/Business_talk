#!/bin/bash
echo "=========================================="
echo "🚀 PERFECT FIX - GETTING SITE ONLINE"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}STEP 1: Stop nginx on host (blocking port 80/443)${NC}"
echo "=================================================="
sudo systemctl stop nginx
sudo systemctl disable nginx
echo -e "${GREEN}✅ Nginx stopped${NC}"
echo ""

echo -e "${YELLOW}STEP 2: Stop existing Docker containers${NC}"
echo "=========================================="
cd ~/Business_talk
docker-compose down 2>/dev/null
docker-compose -f docker-compose.prod.yml down 2>/dev/null
echo -e "${GREEN}✅ Containers stopped${NC}"
echo ""

echo -e "${YELLOW}STEP 3: Check if ports are free${NC}"
echo "=================================="
echo "Checking port 80..."
sudo lsof -i :80 || echo "Port 80 is free ✅"
echo ""
echo "Checking port 443..."
sudo lsof -i :443 || echo "Port 443 is free ✅"
echo ""
echo "Checking port 5000..."
sudo lsof -i :5000 || echo "Port 5000 is free ✅"
echo ""

echo -e "${YELLOW}STEP 4: Start Docker containers${NC}"
echo "=================================="
docker-compose -f docker-compose.prod.yml up -d --build
echo ""

echo -e "${YELLOW}STEP 5: Wait for containers to start...${NC}"
echo "=========================================="
sleep 15
echo ""

echo -e "${YELLOW}STEP 6: Check container status${NC}"
echo "================================"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo -e "${YELLOW}STEP 7: Test services${NC}"
echo "======================"
echo ""
echo "Testing backend API..."
sleep 3
BACKEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)
if [ "$BACKEND_TEST" = "200" ]; then
    echo -e "${GREEN}✅ Backend is working! (HTTP $BACKEND_TEST)${NC}"
else
    echo -e "${RED}❌ Backend not responding (HTTP $BACKEND_TEST)${NC}"
fi
echo ""

echo "Testing frontend..."
FRONTEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)
if [ "$FRONTEND_TEST" = "200" ]; then
    echo -e "${GREEN}✅ Frontend is working! (HTTP $FRONTEND_TEST)${NC}"
else
    echo -e "${RED}❌ Frontend not responding (HTTP $FRONTEND_TEST)${NC}"
fi
echo ""

echo -e "${YELLOW}STEP 8: View container logs${NC}"
echo "============================"
echo ""
echo "Backend logs (last 5 lines):"
docker logs business-talk-backend --tail 5
echo ""
echo "Frontend logs (last 5 lines):"
docker logs business-talk-frontend --tail 5
echo ""

echo "=========================================="
echo -e "${GREEN}🎉 SETUP COMPLETE!${NC}"
echo "=========================================="
echo ""
echo "Your site is now accessible at:"
echo "  🌐 http://68.178.161.128"
echo "  🌐 http://businesstalkwithdeepakbhatt.com"
echo ""
echo "Container Status:"
docker ps --format "  {{.Names}}: {{.Status}}"
echo ""
echo "Useful Commands:"
echo "  View backend logs:  docker logs business-talk-backend -f"
echo "  View frontend logs: docker logs business-talk-frontend -f"
echo "  Restart all:        docker-compose -f docker-compose.prod.yml restart"
echo "  Stop all:           docker-compose -f docker-compose.prod.yml down"
echo ""
echo "Next Steps:"
echo "  1. Test your site in browser"
echo "  2. Set up SSL with Certbot (for HTTPS)"
echo "  3. Apply performance fixes (git pull origin dev)"
echo ""
