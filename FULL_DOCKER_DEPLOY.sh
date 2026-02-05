#!/bin/bash
set -e

echo "=========================================="
echo "🚀 COMPLETE DOCKER DEPLOYMENT"
echo "=========================================="
echo "This will deploy your site with:"
echo "  - Docker containers (backend + frontend)"
echo "  - Nginx reverse proxy on host"
echo "  - SSL support"
echo "  - Performance optimizations"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd ~/Business_talk

echo -e "${YELLOW}STEP 1: Clean up existing setup${NC}"
echo "=================================="
echo "Stopping Docker containers..."
docker-compose down 2>/dev/null || true
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
docker stop $(docker ps -aq) 2>/dev/null || true
echo "Stopping nginx..."
sudo systemctl stop nginx 2>/dev/null || true
echo -e "${GREEN}✅ Cleanup complete${NC}"
echo ""

echo -e "${YELLOW}STEP 2: Build and start Docker containers${NC}"
echo "==========================================="
echo "Building containers (this may take a few minutes)..."
docker-compose -f docker-compose.prod.yml build --no-cache
echo ""
echo "Starting containers..."
docker-compose -f docker-compose.prod.yml up -d
echo -e "${GREEN}✅ Containers started${NC}"
echo ""

echo -e "${YELLOW}STEP 3: Wait for containers to be ready${NC}"
echo "=========================================="
echo "Waiting 30 seconds for services to initialize..."
for i in {30..1}; do
    printf "\r  %2d seconds remaining..." $i
    sleep 1
done
echo ""
echo -e "${GREEN}✅ Wait complete${NC}"
echo ""

echo -e "${YELLOW}STEP 4: Check container status${NC}"
echo "==============================="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Verify containers are running
BACKEND_RUNNING=$(docker ps --filter "name=backend" --format "{{.Names}}" | wc -l)
FRONTEND_RUNNING=$(docker ps --filter "name=frontend" --format "{{.Names}}" | wc -l)

if [ "$BACKEND_RUNNING" -eq 0 ]; then
    echo -e "${RED}❌ Backend container not running!${NC}"
    echo "Backend logs:"
    docker logs business-talk-backend --tail 30
    exit 1
fi

if [ "$FRONTEND_RUNNING" -eq 0 ]; then
    echo -e "${RED}❌ Frontend container not running!${NC}"
    echo "Frontend logs:"
    docker logs business-talk-frontend --tail 30
    exit 1
fi

echo -e "${GREEN}✅ Both containers running${NC}"
echo ""

echo -e "${YELLOW}STEP 5: Test containers locally${NC}"
echo "================================="
echo "Testing backend..."
sleep 5
BACKEND_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5000/api/health 2>/dev/null || echo "000")
if [ "$BACKEND_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Backend responding (HTTP $BACKEND_CODE)${NC}"
else
    echo -e "${RED}❌ Backend not responding (HTTP $BACKEND_CODE)${NC}"
    docker logs business-talk-backend --tail 20
    exit 1
fi

echo "Testing frontend..."
FRONTEND_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 2>/dev/null || echo "000")
if [ "$FRONTEND_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Frontend responding (HTTP $FRONTEND_CODE)${NC}"
else
    echo -e "${RED}❌ Frontend not responding (HTTP $FRONTEND_CODE)${NC}"
    docker logs business-talk-frontend --tail 20
    exit 1
fi
echo ""

echo -e "${YELLOW}STEP 6: Configure nginx${NC}"
echo "======================="
echo "Copying nginx configuration..."
sudo cp ~/Business_talk/nginx.conf /etc/nginx/sites-available/business-talk

echo "Enabling site..."
sudo ln -sf /etc/nginx/sites-available/business-talk /etc/nginx/sites-enabled/business-talk
sudo rm -f /etc/nginx/sites-enabled/default

echo "Testing nginx configuration..."
if sudo nginx -t; then
    echo -e "${GREEN}✅ Nginx configuration valid${NC}"
else
    echo -e "${RED}❌ Nginx configuration invalid${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}STEP 7: Start nginx${NC}"
echo "==================="
sudo systemctl enable nginx
sudo systemctl start nginx
if sudo systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx started successfully${NC}"
else
    echo -e "${RED}❌ Nginx failed to start${NC}"
    sudo systemctl status nginx
    exit 1
fi
echo ""

echo -e "${YELLOW}STEP 8: Configure firewall${NC}"
echo "==========================="
sudo ufw allow 22/tcp 2>/dev/null || true
sudo ufw allow 80/tcp 2>/dev/null || true
sudo ufw allow 443/tcp 2>/dev/null || true
echo -e "${GREEN}✅ Firewall configured${NC}"
echo ""

echo -e "${YELLOW}STEP 9: Final verification${NC}"
echo "==========================="
echo ""
echo "Services status:"
echo "----------------"
echo -n "Nginx: "
sudo systemctl is-active nginx
echo -n "Backend container: "
docker ps --filter "name=backend" --format "{{.Status}}" | grep -q "Up" && echo "Running" || echo "Stopped"
echo -n "Frontend container: "
docker ps --filter "name=frontend" --format "{{.Status}}" | grep -q "Up" && echo "Running" || echo "Stopped"
echo ""

echo "Testing external access..."
echo "--------------------------"
sleep 3
EXTERNAL_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://68.178.161.128 2>/dev/null || echo "000")
if [ "$EXTERNAL_CODE" = "200" ] || [ "$EXTERNAL_CODE" = "301" ] || [ "$EXTERNAL_CODE" = "302" ]; then
    echo -e "${GREEN}✅ Site accessible from external IP (HTTP $EXTERNAL_CODE)${NC}"
else
    echo -e "${YELLOW}⚠️  Site returned HTTP $EXTERNAL_CODE${NC}"
    echo "This might be normal if SSL redirect is configured"
fi
echo ""

echo "Container logs (last 5 lines):"
echo "------------------------------"
echo "Backend:"
docker logs business-talk-backend --tail 5
echo ""
echo "Frontend:"
docker logs business-talk-frontend --tail 5
echo ""

echo "=========================================="
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo "=========================================="
echo ""
echo "Your site is now running at:"
echo "  🌐 http://68.178.161.128"
echo "  🌐 http://businesstalkwithdeepakbhatt.com"
echo "  🔒 https://businesstalkwithdeepakbhatt.com (if SSL configured)"
echo ""
echo "Architecture:"
echo "  Internet → Nginx (host:80/443) → Docker Containers"
echo "    ├─ Frontend: localhost:3000"
echo "    └─ Backend:  localhost:5000"
echo ""
echo "Useful commands:"
echo "  View logs:       docker-compose -f docker-compose.prod.yml logs -f"
echo "  Restart:         docker-compose -f docker-compose.prod.yml restart"
echo "  Stop:            docker-compose -f docker-compose.prod.yml down"
echo "  Nginx logs:      sudo tail -f /var/log/nginx/error.log"
echo "  Nginx restart:   sudo systemctl restart nginx"
echo ""
echo "Next steps:"
echo "  1. Test site in browser"
echo "  2. If SSL not working, run: sudo certbot --nginx -d businesstalkwithdeepakbhatt.com"
echo "  3. Apply performance fixes: git pull origin dev && bash DEPLOY_DOCKER.sh"
echo ""
