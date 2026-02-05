#!/bin/bash
echo "=========================================="
echo "EMERGENCY FIX - SITE DOWN"
echo "=========================================="
echo ""

echo "Step 1: Check what's running..."
echo "--------------------------------"
docker ps -a
echo ""

echo "Step 2: Check if containers are stopped..."
echo "-------------------------------------------"
FRONTEND_STATUS=$(docker ps -a --filter "name=frontend" --format "{{.Status}}")
BACKEND_STATUS=$(docker ps -a --filter "name=backend" --format "{{.Status}}")

echo "Frontend: $FRONTEND_STATUS"
echo "Backend: $BACKEND_STATUS"
echo ""

echo "Step 3: Check if nginx is running on host..."
echo "---------------------------------------------"
sudo systemctl status nginx | grep Active
echo ""

echo "Step 4: Check what's listening on port 80..."
echo "---------------------------------------------"
sudo netstat -tlnp | grep :80 || sudo ss -tlnp | grep :80
echo ""

echo "Step 5: Check what's listening on port 443..."
echo "----------------------------------------------"
sudo netstat -tlnp | grep :443 || sudo ss -tlnp | grep :443
echo ""

echo "=========================================="
echo "DIAGNOSIS COMPLETE"
echo "=========================================="
echo ""
echo "Now running automatic fix..."
echo ""

# Stop everything
echo "Stopping all services..."
sudo systemctl stop nginx 2>/dev/null
docker-compose down 2>/dev/null

# Start nginx on host (for SSL)
echo "Starting nginx on host..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Check nginx status
echo ""
echo "Nginx status:"
sudo systemctl status nginx | grep Active

echo ""
echo "Testing site..."
curl -I http://localhost 2>&1 | head -5
curl -I https://localhost 2>&1 | head -5

echo ""
echo "=========================================="
echo "FIX COMPLETE"
echo "=========================================="
echo ""
echo "Now test your site: https://businesstalkwithdeepakbhatt.com"
echo ""
