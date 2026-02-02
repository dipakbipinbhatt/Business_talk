#!/bin/bash
# Quick Fix Script for MongoDB Atlas Cluster Issue on EC2
# Run this on your EC2 instance

set -e  # Exit on error

echo ""
echo "🔧 MongoDB Atlas Cluster Fix for EC2"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get project directory (assuming script is in project root)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "📁 Project directory: $PROJECT_DIR"
echo ""

# Step 1: Check if root .env exists
echo "Step 1: Checking for .env file..."
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo -e "${RED}❌ Error: .env file not found in project root${NC}"
    echo "   Please create .env file with MongoDB credentials"
    exit 1
fi
echo -e "${GREEN}✅ Found .env in project root${NC}"
echo ""

# Step 2: Check if backend directory exists
echo "Step 2: Checking backend directory..."
if [ ! -d "$PROJECT_DIR/backend" ]; then
    echo -e "${RED}❌ Error: backend directory not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend directory exists${NC}"
echo ""

# Step 3: Backup existing backend/.env if it exists
echo "Step 3: Backing up existing backend/.env (if exists)..."
if [ -f "$PROJECT_DIR/backend/.env" ]; then
    BACKUP_FILE="$PROJECT_DIR/backend/.env.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$PROJECT_DIR/backend/.env" "$BACKUP_FILE"
    echo -e "${GREEN}✅ Backed up to: $BACKUP_FILE${NC}"
else
    echo -e "${YELLOW}⚠️  No existing backend/.env to backup${NC}"
fi
echo ""

# Step 4: Copy .env to backend
echo "Step 4: Copying .env to backend directory..."
cp "$PROJECT_DIR/.env" "$PROJECT_DIR/backend/.env"
echo -e "${GREEN}✅ Copied .env to backend/.env${NC}"
echo ""

# Step 5: Verify MongoDB credentials
echo "Step 5: Verifying MongoDB credentials..."
if grep -q "MONGO_PUBLIC_KEY" "$PROJECT_DIR/backend/.env"; then
    echo -e "${GREEN}  ✓ MONGO_PUBLIC_KEY found${NC}"
else
    echo -e "${RED}  ✗ MONGO_PUBLIC_KEY missing${NC}"
fi

if grep -q "MONGO_PRIVATE_KEY" "$PROJECT_DIR/backend/.env"; then
    echo -e "${GREEN}  ✓ MONGO_PRIVATE_KEY found${NC}"
else
    echo -e "${RED}  ✗ MONGO_PRIVATE_KEY missing${NC}"
fi

if grep -q "MONGO_PROJECT_ID" "$PROJECT_DIR/backend/.env"; then
    echo -e "${GREEN}  ✓ MONGO_PROJECT_ID found${NC}"
else
    echo -e "${RED}  ✗ MONGO_PROJECT_ID missing${NC}"
fi
echo ""

# Step 6: Rebuild backend
echo "Step 6: Rebuilding backend..."
cd "$PROJECT_DIR/backend"

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found in backend${NC}"
    exit 1
fi

echo "   Running npm install..."
npm install --silent

echo "   Running npm run build..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend built successfully${NC}"
else
    echo -e "${RED}❌ Backend build failed${NC}"
    exit 1
fi
echo ""

# Step 7: Detect and restart service
echo "Step 7: Restarting backend service..."

# Check for PM2
if command -v pm2 &> /dev/null; then
    echo "   Detected PM2..."
    pm2 restart backend 2>/dev/null || pm2 start dist/index.js --name backend
    echo -e "${GREEN}✅ Restarted with PM2${NC}"
    echo ""
    echo "📊 PM2 Status:"
    pm2 list
    
# Check for Docker Compose
elif command -v docker-compose &> /dev/null && [ -f "$PROJECT_DIR/docker-compose.yml" ]; then
    echo "   Detected Docker Compose..."
    cd "$PROJECT_DIR"
    docker-compose restart backend
    echo -e "${GREEN}✅ Restarted with Docker Compose${NC}"
    echo ""
    echo "📊 Docker Status:"
    docker-compose ps
    
# Check for systemd service
elif systemctl is-active --quiet business-talk-backend 2>/dev/null; then
    echo "   Detected systemd service..."
    sudo systemctl restart business-talk-backend
    echo -e "${GREEN}✅ Restarted with systemd${NC}"
    echo ""
    echo "📊 Service Status:"
    sudo systemctl status business-talk-backend --no-pager
    
else
    echo -e "${YELLOW}⚠️  Could not detect service manager${NC}"
    echo "   Please restart your backend manually:"
    echo "   - PM2: pm2 restart backend"
    echo "   - Docker: docker-compose restart backend"
    echo "   - systemd: sudo systemctl restart business-talk-backend"
    echo "   - Manual: cd backend && node dist/index.js"
fi
echo ""

# Step 8: Test the API
echo "Step 8: Testing MongoDB Atlas API..."
sleep 3  # Wait for service to start

echo "   Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:5000/api/health)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend is responding${NC}"
else
    echo -e "${RED}❌ Backend is not responding${NC}"
    echo "   Check logs for errors"
fi

echo ""
echo "   Testing MongoDB clusters endpoint..."
CLUSTERS_RESPONSE=$(curl -s http://localhost:5000/api/mongodb/clusters)

if echo "$CLUSTERS_RESPONSE" | grep -q "results"; then
    echo -e "${GREEN}✅ MongoDB Atlas API is working!${NC}"
    echo ""
    echo "📊 Cluster Information:"
    echo "$CLUSTERS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CLUSTERS_RESPONSE"
elif echo "$CLUSTERS_RESPONSE" | grep -q "not configured"; then
    echo -e "${RED}❌ Still showing 'not configured' error${NC}"
    echo "   Response: $CLUSTERS_RESPONSE"
    echo ""
    echo "   Troubleshooting steps:"
    echo "   1. Check backend logs: pm2 logs backend"
    echo "   2. Verify .env file: cat backend/.env | grep MONGO"
    echo "   3. Restart backend completely: pm2 delete backend && pm2 start backend/dist/index.js"
else
    echo -e "${YELLOW}⚠️  Unexpected response${NC}"
    echo "   Response: $CLUSTERS_RESPONSE"
fi
echo ""

# Final summary
echo "===================================="
echo "✅ Fix Complete!"
echo "===================================="
echo ""
echo "Next steps:"
echo "1. Open your admin dashboard"
echo "2. Navigate to MongoDB Atlas Cluster section"
echo "3. You should see cluster information"
echo ""
echo "If you still see errors:"
echo "- Check logs: pm2 logs backend (or docker logs business-talk-backend)"
echo "- Run verification: node verify-mongodb-credentials.js"
echo "- See detailed guide: EC2_MONGODB_CLUSTER_FIX.md"
echo ""
