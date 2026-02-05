#!/bin/bash

echo "=========================================="
echo "🚨 AUTOMATIC FIX SCRIPT"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "backend" ]; then
    echo -e "${RED}❌ Error: Not in Business_talk directory${NC}"
    echo "Please cd to your Business_talk directory first"
    exit 1
fi

echo -e "${GREEN}✅ In correct directory${NC}"
echo ""

# Step 2: Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Code updated${NC}"
else
    echo -e "${RED}❌ Git pull failed${NC}"
    exit 1
fi
echo ""

# Step 3: Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi
cd ..
echo ""

# Step 4: Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 not found, installing...${NC}"
    npm install -g pm2
fi

# Step 5: Stop old backend
echo "🛑 Stopping old backend..."
pm2 stop backend 2>/dev/null || echo "No backend process to stop"
pm2 delete backend 2>/dev/null || echo "No backend process to delete"
echo ""

# Step 6: Start backend
echo "🚀 Starting backend..."
cd backend
pm2 start src/index.ts --name backend --interpreter tsx
cd ..
echo ""

# Step 7: Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5
echo ""

# Step 8: Check backend status
echo "📊 Checking backend status..."
pm2 status
echo ""

# Step 9: Test backend API
echo "🧪 Testing backend API..."
RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:5000/api/podcasts?limit=1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Backend API is responding!${NC}"
else
    echo -e "${RED}❌ Backend API failed (HTTP $HTTP_CODE)${NC}"
    echo "Checking logs..."
    pm2 logs backend --lines 20 --nostream
    exit 1
fi
echo ""

# Step 10: Test with compact mode
echo "🧪 Testing compact mode..."
COMPACT_RESPONSE=$(curl -s -w "\nTime: %{time_total}s" "http://localhost:5000/api/podcasts?limit=0&compact=true" | tail -n1)
echo "$COMPACT_RESPONSE"
echo ""

# Step 11: Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save
echo ""

echo "=========================================="
echo -e "${GREEN}✅ FIX COMPLETE!${NC}"
echo "=========================================="
echo ""
echo "📋 Summary:"
echo "  ✅ Code updated from GitHub"
echo "  ✅ Dependencies installed"
echo "  ✅ Backend restarted"
echo "  ✅ API responding"
echo ""
echo "🌐 Next steps:"
echo "  1. Open: https://businesstalkwithdeepakbhatt.com"
echo "  2. Press Ctrl+Shift+R to refresh"
echo "  3. Site should load fast now!"
echo ""
echo "📊 Check logs: pm2 logs backend"
echo "📊 Check status: pm2 status"
echo "=========================================="
