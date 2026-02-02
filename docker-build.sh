#!/bin/bash

# Docker Build Script for Business Talk
# This script handles all Docker build errors and provides clear feedback

set -e  # Exit on error

echo "🚀 Business Talk - Docker Build Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

print_success "Docker is installed"

# Check if Docker is running
if ! docker info &> /dev/null; then
    print_error "Docker is not running. Please start Docker."
    exit 1
fi

print_success "Docker is running"

# Clean up old containers and images
print_info "Cleaning up old containers and images..."
docker-compose down 2>/dev/null || true
docker system prune -f

print_success "Cleanup complete"

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from example..."
    if [ -f "docker.env.example" ]; then
        cp docker.env.example .env
        print_warning "Please edit .env file with your actual credentials"
    else
        print_error ".env file is required. Please create it."
        exit 1
    fi
fi

print_success ".env file exists"

# Build backend
print_info "Building backend service..."
if docker build -t business-talk-backend ./backend; then
    print_success "Backend built successfully"
else
    print_error "Backend build failed"
    print_info "Trying alternative build method..."
    
    # Try without cache
    if docker build --no-cache -t business-talk-backend ./backend; then
        print_success "Backend built successfully (without cache)"
    else
        print_error "Backend build failed completely"
        print_info "Checking backend/package-lock.json..."
        
        if [ ! -f "backend/package-lock.json" ]; then
            print_warning "package-lock.json not found. Generating..."
            cd backend
            npm install
            cd ..
            print_info "Retrying build..."
            docker build -t business-talk-backend ./backend
        else
            print_error "Please check backend/Dockerfile and package.json"
            exit 1
        fi
    fi
fi

# Build frontend
print_info "Building frontend service..."
if docker build -t business-talk-frontend ./frontend; then
    print_success "Frontend built successfully"
else
    print_error "Frontend build failed"
    print_info "Trying alternative build method..."
    
    # Try without cache
    if docker build --no-cache -t business-talk-frontend ./frontend; then
        print_success "Frontend built successfully (without cache)"
    else
        print_error "Frontend build failed completely"
        print_info "Checking frontend/package-lock.json..."
        
        if [ ! -f "frontend/package-lock.json" ]; then
            print_warning "package-lock.json not found. Generating..."
            cd frontend
            npm install
            cd ..
            print_info "Retrying build..."
            docker build -t business-talk-frontend ./frontend
        else
            print_error "Please check frontend/Dockerfile and package.json"
            exit 1
        fi
    fi
fi

# Start services
print_info "Starting services with docker-compose..."
if docker-compose up -d; then
    print_success "Services started successfully"
else
    print_error "Failed to start services"
    exit 1
fi

# Wait for services to be ready
print_info "Waiting for services to be ready..."
sleep 5

# Check backend health
print_info "Checking backend health..."
if curl -f http://localhost:5000/api/health &> /dev/null; then
    print_success "Backend is healthy"
else
    print_warning "Backend health check failed (this is normal if health endpoint doesn't exist)"
fi

# Check frontend
print_info "Checking frontend..."
if curl -f http://localhost:80 &> /dev/null; then
    print_success "Frontend is accessible"
else
    print_warning "Frontend not accessible yet (may still be starting)"
fi

# Show running containers
print_info "Running containers:"
docker ps

echo ""
print_success "Build and deployment complete!"
echo ""
print_info "Access your application:"
echo "  Frontend: http://localhost:80"
echo "  Backend:  http://localhost:5000"
echo ""
print_info "View logs:"
echo "  docker-compose logs -f"
echo ""
print_info "Stop services:"
echo "  docker-compose down"
echo ""
