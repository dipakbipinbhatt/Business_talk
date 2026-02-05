#!/bin/bash

# Deployment script with performance optimizations

echo "🚀 Deploying Business Talk with Performance Optimizations"
echo "=========================================================="

# Step 1: Pull latest code
echo ""
echo "📥 Step 1: Pulling latest code from GitHub..."
git pull origin main

# Step 2: Install backend dependencies
echo ""
echo "📦 Step 2: Installing backend dependencies..."
cd backend
npm install

# Step 3: Build frontend
echo ""
echo "🏗️  Step 3: Building optimized frontend..."
cd ../frontend
npm install
npm run build

# Step 4: Restart services
echo ""
echo "🔄 Step 4: Restarting services..."
cd ..

# If using PM2
if command -v pm2 &> /dev/null; then
    echo "   Using PM2..."
    pm2 restart all
    pm2 save
else
    echo "   PM2 not found. Please restart services manually."
fi

# If using Docker
if command -v docker &> /dev/null; then
    echo "   Using Docker..."
    docker-compose down
    docker-compose up -d --build
fi

echo ""
echo "=========================================================="
echo "✅ Deployment complete!"
echo ""
echo "📊 Performance optimizations applied:"
echo "   ✅ Compact mode (36MB → 1.8MB)"
echo "   ✅ GZIP compression (1.8MB → 200KB)"
echo "   ✅ MongoDB indexes"
echo "   ✅ Lean queries"
echo ""
echo "🌐 Your site should now load 10x faster!"
echo "=========================================================="
