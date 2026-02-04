#!/bin/bash
# Quick fix to start the frontend container
# The backend is already running, we just need to start the frontend

echo "=========================================="
echo "  Starting Frontend Container"
echo "=========================================="
echo ""

echo "Current container status:"
docker ps
echo ""

echo "Starting frontend container..."
docker-compose -f docker-compose.prod.yml up -d frontend

echo ""
echo "Waiting for frontend to start..."
sleep 5

echo ""
echo "Current container status:"
docker ps
echo ""

echo "Checking frontend logs..."
docker logs business-talk-frontend

echo ""
echo "=========================================="
echo "  Done!"
echo "=========================================="
echo ""
echo "Both containers should now be running."
echo "Check your site: https://businesstalkwithdeepakbhatt.com"
