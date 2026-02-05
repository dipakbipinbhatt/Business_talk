#!/bin/bash
echo "=========================================="
echo "🧪 TESTING YOUR SITE"
echo "=========================================="
echo ""

echo "1. Testing localhost..."
echo "-----------------------"
curl -I http://localhost 2>&1 | head -10
echo ""

echo "2. Testing server IP (68.178.161.128)..."
echo "-----------------------------------------"
curl -I http://68.178.161.128 2>&1 | head -10
echo ""

echo "3. Testing domain..."
echo "--------------------"
curl -I http://businesstalkwithdeepakbhatt.com 2>&1 | head -10
echo ""

echo "4. Testing backend API..."
echo "-------------------------"
curl http://localhost:5000/api/health 2>&1 | head -10
echo ""

echo "5. Container status..."
echo "----------------------"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "6. Ports listening..."
echo "---------------------"
sudo netstat -tlnp | grep -E ':(80|443|5000)' || sudo ss -tlnp | grep -E ':(80|443|5000)'
echo ""

echo "=========================================="
echo "TEST COMPLETE"
echo "=========================================="
echo ""
