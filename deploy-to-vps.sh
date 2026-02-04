#!/bin/bash

# Business Talk - GoDaddy VPS Deployment Script
# This script deploys the application to GoDaddy VPS at 68.178.161.128

set -e  # Exit on any error

echo "=========================================="
echo "Business Talk - VPS Deployment"
echo "=========================================="
echo ""

# Configuration
VPS_IP="68.178.161.128"
VPS_USER="root"  # Change this if you use a different user
DOMAIN="businesstalkwithdeepakbhatt.com"
APP_DIR="/var/www/business-talk"
BACKEND_PORT="5000"

echo "Target VPS: $VPS_IP"
echo "Domain: $DOMAIN"
echo "App Directory: $APP_DIR"
echo ""

# Step 1: Build Frontend Locally
echo "[1/6] Building frontend locally..."
cd frontend
npm install
npm run build
cd ..
echo "✓ Frontend built successfully"
echo ""

# Step 2: Create deployment package
echo "[2/6] Creating deployment package..."
tar -czf business-talk-deploy.tar.gz \
    frontend/dist \
    backend \
    --exclude=backend/node_modules \
    --exclude=backend/dist
echo "✓ Deployment package created"
echo ""

# Step 3: Upload to VPS
echo "[3/6] Uploading to VPS..."
scp business-talk-deploy.tar.gz $VPS_USER@$VPS_IP:/tmp/
echo "✓ Files uploaded"
echo ""

# Step 4: Deploy on VPS
echo "[4/6] Deploying on VPS..."
ssh $VPS_USER@$VPS_IP << 'ENDSSH'
set -e

# Extract files
cd /tmp
tar -xzf business-talk-deploy.tar.gz

# Create app directory if it doesn't exist
mkdir -p /var/www/business-talk

# Deploy frontend
echo "Deploying frontend..."
rm -rf /var/www/business-talk/frontend
mkdir -p /var/www/business-talk/frontend
cp -r frontend/dist/* /var/www/business-talk/frontend/

# Deploy backend
echo "Deploying backend..."
rm -rf /var/www/business-talk/backend
cp -r backend /var/www/business-talk/

# Install backend dependencies
cd /var/www/business-talk/backend
npm install --production

# Build backend
npm run build

# Restart backend service (using PM2)
if command -v pm2 &> /dev/null; then
    pm2 restart business-talk-backend || pm2 start dist/index.js --name business-talk-backend
else
    echo "Warning: PM2 not found. Please install PM2 or manually restart the backend."
fi

# Clean up
rm -f /tmp/business-talk-deploy.tar.gz

echo "✓ Deployment completed on VPS"
ENDSSH

echo "✓ VPS deployment completed"
echo ""

# Step 5: Verify deployment
echo "[5/6] Verifying deployment..."
sleep 3

# Check backend health
if curl -f http://$VPS_IP/api/health > /dev/null 2>&1; then
    echo "✓ Backend is healthy"
else
    echo "⚠ Warning: Backend health check failed"
fi

# Check frontend
if curl -f http://$VPS_IP > /dev/null 2>&1; then
    echo "✓ Frontend is accessible"
else
    echo "⚠ Warning: Frontend check failed"
fi

echo ""

# Step 6: Summary
echo "[6/6] Deployment Summary"
echo "=========================================="
echo "✓ Deployment completed successfully!"
echo ""
echo "URLs:"
echo "  - Frontend: https://$DOMAIN"
echo "  - Admin Panel: https://$DOMAIN/admin"
echo "  - Backend API: https://$DOMAIN/api"
echo "  - Health Check: https://$DOMAIN/api/health"
echo ""
echo "Admin Credentials:"
echo "  - Email: admin@businesstalk.com"
echo "  - Password: Admin@123"
echo ""
echo "=========================================="

# Clean up local deployment package
rm -f business-talk-deploy.tar.gz
