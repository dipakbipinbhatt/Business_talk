#!/bin/bash

# Business Talk - EC2 Quick Deployment Script
# This script automates the deployment process

set -e

echo "=========================================="
echo "Business Talk - EC2 Deployment"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Run: curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Run: sudo curl -L 'https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)' -o /usr/local/bin/docker-compose"
    echo "     sudo chmod +x /usr/local/bin/docker-compose"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Copying docker.env.example to .env..."
    cp docker.env.example .env
    echo ""
    echo "❗ IMPORTANT: Please edit .env file with your actual configuration:"
    echo "   - MongoDB password"
    echo "   - JWT secret"
    echo "   - Cloudinary credentials"
    echo "   - Your EC2 IP or domain"
    echo ""
    echo "Edit .env now? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        ${EDITOR:-nano} .env
    else
        echo "Please edit .env manually before running this script again."
        exit 1
    fi
fi

echo "✅ .env file found"
echo ""

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove old images (optional)
echo "Do you want to remove old Docker images? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "🗑️  Removing old images..."
    docker system prune -f
fi

# Build images
echo ""
echo "🔨 Building Docker images..."
docker-compose build --no-cache

# Start services
echo ""
echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

# Test backend
echo ""
echo "🧪 Testing backend API..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is not responding"
    echo "Check logs with: docker-compose logs backend"
fi

# Test frontend
echo ""
echo "🧪 Testing frontend..."
if curl -s http://localhost:80 > /dev/null; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not responding"
    echo "Check logs with: docker-compose logs frontend"
fi

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "📝 Useful Commands:"
echo "   View logs:        docker-compose logs -f"
echo "   Restart:          docker-compose restart"
echo "   Stop:             docker-compose down"
echo "   Update:           git pull && docker-compose build && docker-compose up -d"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://$(curl -s ifconfig.me)"
echo "   Backend:  http://$(curl -s ifconfig.me):5000"
echo ""
echo "📚 For more details, see EC2_DEPLOYMENT_GUIDE.md"
echo ""

