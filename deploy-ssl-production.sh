#!/bin/bash
# SSL Production Deployment Script
# Run this script on your VPS after SSH'ing in
# Uses centralized .env file from root directory

set -e  # Exit on any error

echo "=========================================="
echo "  SSL Production Deployment"
echo "  (Centralized .env Configuration)"
echo "=========================================="
echo ""

# Step 1: Prepare SSL Certificates
echo "[1/6] Preparing SSL certificates..."
cd ~/Business_talk/ssl

# Check if files exist
if [ ! -f "PrivateKey.pem" ]; then
    echo "❌ Error: PrivateKey.pem not found!"
    exit 1
fi

if [ ! -f "businesstalkwithdeepakbhatt.com-certificate.crt" ]; then
    echo "❌ Error: Certificate file not found!"
    exit 1
fi

if [ ! -f "gd_bundle-g2.crt" ]; then
    echo "❌ Error: Bundle file not found!"
    exit 1
fi

# Rename and combine certificates
echo "   - Renaming private key..."
mv PrivateKey.pem private.key 2>/dev/null || echo "   - Private key already renamed"

echo "   - Creating fullchain certificate..."
cat businesstalkwithdeepakbhatt.com-certificate.crt gd_bundle-g2.crt > fullchain.crt

echo "   - Setting permissions..."
chmod 600 private.key
chmod 644 fullchain.crt

echo "   ✅ SSL certificates prepared"
ls -lh private.key fullchain.crt
echo ""

# Step 2: Pull latest code
echo "[2/6] Pulling latest code from GitHub..."
cd ~/Business_talk
git pull origin main
echo "   ✅ Code updated"
echo ""

# Step 3: Verify .env file
echo "[3/6] Verifying environment configuration..."
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    exit 1
fi

echo "   Checking critical variables..."
if grep -q "VITE_API_URL=https://" .env; then
    echo "   ✅ VITE_API_URL configured for HTTPS"
else
    echo "   ⚠️  Warning: VITE_API_URL may not be using HTTPS"
fi

if grep -q "FRONTEND_URL=https://" .env; then
    echo "   ✅ FRONTEND_URL configured for HTTPS"
else
    echo "   ⚠️  Warning: FRONTEND_URL may not be using HTTPS"
fi

echo "   ✅ Environment file verified"
echo ""

# Step 4: Stop current containers
echo "[4/6] Stopping current containers..."
docker-compose -f docker-compose.prod.yml down
echo "   ✅ Containers stopped"
echo ""

# Step 5: Build and deploy
echo "[5/6] Building and deploying with SSL..."
echo "   This may take 2-5 minutes..."
docker-compose -f docker-compose.prod.yml up -d --build
echo "   ✅ Deployment complete"
echo ""

# Step 6: Verify deployment
echo "[6/6] Verifying deployment..."
sleep 10  # Wait for containers to fully start

echo ""
echo "Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "Checking container health..."
sleep 5

# Check if containers are running
if docker ps | grep -q "business-talk-frontend"; then
    echo "   ✅ Frontend container running"
else
    echo "   ❌ Frontend container not running!"
fi

if docker ps | grep -q "business-talk-backend"; then
    echo "   ✅ Backend container running"
else
    echo "   ❌ Backend container not running!"
fi

echo ""
echo "Frontend Logs (last 20 lines):"
docker logs --tail 20 business-talk-frontend
echo ""

echo "Backend Logs (last 20 lines):"
docker logs --tail 20 business-talk-backend
echo ""

echo "=========================================="
echo "  ✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Your site should now be live at:"
echo "  🌐 https://businesstalkwithdeepakbhatt.com"
echo ""
echo "Configuration:"
echo "  📁 Using centralized .env file"
echo "  🔒 SSL certificates mounted"
echo "  🐳 Docker containers running"
echo ""
echo "Next steps:"
echo "  1. Test HTTPS: curl -I https://businesstalkwithdeepakbhatt.com"
echo "  2. Check browser: Open site and verify green padlock"
echo "  3. Test admin: https://businesstalkwithdeepakbhatt.com/admin"
echo ""
echo "View live logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
