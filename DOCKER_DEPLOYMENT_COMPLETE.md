# 🐳 DOCKER DEPLOYMENT - Complete Guide

## Current Status

### ✅ Frontend Container
```
nginx/1.29.5 - Running successfully
Workers: 2 processes started
Ready for connections
```

### Backend Container
Need to check if it's running and connected to MongoDB.

## Quick Status Check

Run this command:
```bash
docker-compose ps
```

**Expected output:**
```
NAME                COMMAND                  SERVICE    STATUS
backend             "npm run dev"            backend    Up
frontend            "nginx -g 'daemon of…"   frontend   Up
```

## Full Deployment Steps

### Step 1: Stop All Containers
```bash
docker-compose down
```

### Step 2: Pull Latest Code
```bash
git pull origin main
```

### Step 3: Build with Optimizations
```bash
docker-compose build --no-cache
```

### Step 4: Start Containers
```bash
docker-compose up -d
```

### Step 5: Check Logs
```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend
```

## Verify Everything Works

### Test 1: Check Container Status
```bash
docker-compose ps
```

Both should show "Up" status.

### Test 2: Check Backend Logs
```bash
docker-compose logs backend | grep -E "Server running|MongoDB"
```

**Should see:**
```
✅ Server running on http://localhost:5000
✅ MongoDB Connected
```

### Test 3: Test Backend API
```bash
curl http://localhost:5000/api/podcasts?limit=1
```

Should return JSON with podcast data.

### Test 4: Test Frontend
```bash
curl -I http://localhost:5173
```

Should return:
```
HTTP/1.1 200 OK
```

### Test 5: Test in Browser
Open: http://localhost:5173

Should show:
- ✅ Home page with podcast cards
- ✅ No gray loading boxes
- ✅ Upcoming episodes count

## Docker Compose Configuration

Your `docker-compose.yml` should have:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./backend:/app
      - /app/node_modules
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=http://localhost:5000/api
    ports:
      - "5173:80"
    depends_on:
      - backend
    restart: unless-stopped
```

## Environment Variables

Create `.env` file in root:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/business-talk
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
```

## Performance Optimizations in Docker

### 1. Frontend Dockerfile
- ✅ Multi-stage build (smaller image)
- ✅ Nginx with gzip compression
- ✅ Static asset caching
- ✅ Health checks

### 2. Backend Dockerfile
- ✅ Node 18 Alpine (smaller image)
- ✅ Production dependencies only
- ✅ Compression middleware
- ✅ MongoDB indexes

### 3. Docker Compose
- ✅ Restart policies
- ✅ Volume mounts for development
- ✅ Network isolation
- ✅ Environment variables

## Troubleshooting

### Issue: Backend won't start
**Check logs:**
```bash
docker-compose logs backend
```

**Common causes:**
1. MongoDB connection failed
   - Check MONGODB_URI in .env
   - Check MongoDB Atlas IP whitelist
   
2. Port 5000 already in use
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /F /PID <PID>
   
   # Linux
   lsof -i :5000
   kill -9 <PID>
   ```

3. Missing environment variables
   - Check .env file exists
   - Check all required variables set

### Issue: Frontend shows 502 Bad Gateway
**Cause:** Backend not responding

**Fix:**
```bash
docker-compose restart backend
docker-compose logs backend
```

### Issue: Changes not reflected
**Cause:** Docker cache

**Fix:**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Issue: Out of disk space
**Check:**
```bash
docker system df
```

**Clean up:**
```bash
docker system prune -a
docker volume prune
```

### Issue: Slow performance
**Cause:** Not using optimizations

**Fix:**
1. Ensure compact mode is enabled in Calendar pages
2. Check compression is working:
   ```bash
   curl -H "Accept-Encoding: gzip" -I http://localhost:5000/api/podcasts?limit=1
   ```
   Should show: `Content-Encoding: gzip`

## Docker Commands Reference

### Start/Stop
```bash
docker-compose up -d          # Start in background
docker-compose down           # Stop all containers
docker-compose restart        # Restart all containers
docker-compose restart backend # Restart specific service
```

### Logs
```bash
docker-compose logs -f        # Follow all logs
docker-compose logs backend   # Backend logs only
docker-compose logs --tail=50 backend # Last 50 lines
```

### Status
```bash
docker-compose ps             # Container status
docker-compose top            # Running processes
docker stats                  # Resource usage
```

### Build
```bash
docker-compose build          # Build all images
docker-compose build --no-cache # Build without cache
docker-compose up -d --build  # Build and start
```

### Cleanup
```bash
docker-compose down -v        # Stop and remove volumes
docker system prune -a        # Remove all unused data
docker volume prune           # Remove unused volumes
```

## Production Deployment (Not Docker)

If you're deploying to production server (not Docker):

### Use PM2 Instead
```bash
# Backend
cd backend
npm install
pm2 start src/index.ts --name backend

# Frontend
cd frontend
npm run build
# Serve with nginx (use root nginx.conf)
```

### Why Not Docker in Production?
1. Your nginx.conf is configured for direct server deployment
2. SSL certificates are on the server, not in Docker
3. PM2 provides better process management
4. Easier to debug and monitor

## Summary

**Docker is great for:**
- ✅ Local development
- ✅ Testing
- ✅ Consistent environments

**Production server is better for:**
- ✅ SSL certificates
- ✅ Direct nginx configuration
- ✅ PM2 process management
- ✅ Better performance

**Current setup:**
- Docker: For local development (localhost:5173)
- Server: For production (businesstalkwithdeepakbhatt.com)

---
**Status**: ✅ Docker frontend running, check backend
**Next**: Run `check-docker-status.bat` to verify everything
