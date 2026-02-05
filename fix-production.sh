#!/bin/bash

echo "🚨 EMERGENCY FIX - Production Site Not Loading"
echo "=============================================="
echo ""

# Check if backend is running
echo "📊 Checking backend status..."
pm2 status | grep backend

if [ $? -eq 0 ]; then
    echo "✅ Backend process found"
else
    echo "❌ Backend process not found!"
    echo "   Starting backend..."
    cd backend
    pm2 start src/index.ts --name backend
    cd ..
fi

echo ""
echo "🔄 Restarting backend..."
pm2 restart backend

echo ""
echo "⏳ Waiting for backend to start..."
sleep 5

echo ""
echo "📋 Checking backend logs..."
pm2 logs backend --lines 20 --nostream

echo ""
echo "🧪 Testing API..."
curl -s http://localhost:5000/api/podcasts?limit=1 | head -c 100

echo ""
echo ""
echo "=============================================="
echo "✅ Fix attempt complete!"
echo ""
echo "🔍 Next steps:"
echo "1. Check if you see 'Server running' and 'MongoDB Connected' above"
echo "2. Test your site: https://businesstalkwithdeepakbhatt.com"
echo "3. If still not working, check: pm2 logs backend"
echo "=============================================="
