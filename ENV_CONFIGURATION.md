# 🔧 Centralized Environment Configuration

## Overview

This project now uses a **single `.env` file** at the root directory for all environment variables. This simplifies configuration management and ensures consistency across frontend and backend services.

---

## 📁 File Structure

```
Business_talk/
├── .env                          # ✅ SINGLE SOURCE OF TRUTH
├── docker-compose.prod.yml       # Uses .env for all services
├── frontend/
│   ├── Dockerfile                # Accepts VITE_API_URL as build arg
│   └── .env.production           # ❌ NO LONGER NEEDED (can delete)
└── backend/
    └── Dockerfile                # Uses environment variables from .env
```

---

## 🎯 Key Changes

### 1. **Single `.env` File**
   - All configuration is now in the root `.env` file
   - No need for separate `frontend/.env.production`
   - Easier to manage and update

### 2. **Updated `docker-compose.prod.yml`**
   - Both services read from root `.env` file
   - Frontend receives `VITE_API_URL` as build argument
   - Backend receives all necessary environment variables
   - Added health checks for better reliability
   - Added service dependencies

### 3. **Updated Frontend Dockerfile**
   - Accepts `VITE_API_URL` as build argument
   - Sets it as environment variable during build
   - Vite uses it when building the production bundle

---

## 📝 Environment Variables

### Root `.env` File Contains:

```bash
# Deployment
DOMAIN=businesstalkwithdeepakbhatt.com
VPS_IP=68.178.161.128
NODE_ENV=production

# Frontend
VITE_API_URL=https://businesstalkwithdeepakbhatt.com/api

# Backend
PORT=5000
FRONTEND_URL=https://businesstalkwithdeepakbhatt.com

# Database
MONGODB_URI=mongodb+srv://...

# Authentication
JWT_SECRET=...
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=...
JWT_REFRESH_EXPIRES_IN=7d

# Admin
ADMIN_EMAIL=admin@businesstalk.com
ADMIN_PASSWORD=Admin@123
```

---

## 🚀 How It Works

### During Build:

1. **Docker Compose** reads `.env` file
2. **Frontend Build:**
   - `VITE_API_URL` is passed as build argument
   - Vite embeds it into the production bundle
   - Frontend knows where to call the API
3. **Backend Build:**
   - All environment variables are available
   - Backend configures itself accordingly

### During Runtime:

1. **Frontend Container:**
   - Serves static files built with correct API URL
   - Nginx handles SSL and routing
2. **Backend Container:**
   - Reads environment variables from `.env`
   - Connects to MongoDB
   - Handles API requests

---

## 🔄 Making Changes

### To Update Configuration:

1. **Edit the root `.env` file:**
   ```bash
   # Example: Change API URL
   VITE_API_URL=https://new-domain.com/api
   FRONTEND_URL=https://new-domain.com
   ```

2. **Commit and push:**
   ```bash
   git add .env
   git commit -m "update: environment configuration"
   git push
   ```

3. **Deploy on VPS:**
   ```bash
   cd ~/Business_talk
   git pull
   docker-compose -f docker-compose.prod.yml down
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

---

## ✅ Benefits

1. **Single Source of Truth**
   - All configuration in one place
   - No confusion about which file to edit

2. **Easier Deployment**
   - Just update one file
   - No need to sync multiple files

3. **Better Security**
   - Only one file to protect
   - Easier to manage secrets

4. **Simplified Workflow**
   - Less room for errors
   - Faster updates

---

## 🔍 Verification

### Check Environment Variables in Containers:

```bash
# Frontend
docker exec business-talk-frontend env | grep VITE

# Backend
docker exec business-talk-backend env | grep -E 'NODE_ENV|PORT|MONGODB'
```

### Check Build Arguments:

```bash
# View docker-compose config with resolved variables
docker-compose -f docker-compose.prod.yml config
```

---

## 🗑️ Cleanup (Optional)

You can now safely delete these files as they're no longer needed:

```bash
# These are replaced by root .env
rm frontend/.env.production
rm frontend/.env
rm backend/.env
```

**Note:** The root `.env` file handles everything now!

---

## 📋 Deployment Checklist

- [x] Root `.env` file configured with HTTPS URLs
- [x] `docker-compose.prod.yml` updated to use root `.env`
- [x] Frontend Dockerfile accepts `VITE_API_URL` build arg
- [x] Backend Dockerfile ready for production
- [x] SSL certificates prepared on VPS
- [ ] Deploy to production
- [ ] Verify HTTPS works
- [ ] Test all functionality

---

## 🆘 Troubleshooting

### Issue: Frontend can't connect to backend

**Solution:** Check that `VITE_API_URL` in `.env` is correct:
```bash
VITE_API_URL=https://businesstalkwithdeepakbhatt.com/api
```

### Issue: Backend can't connect to MongoDB

**Solution:** Verify `MONGODB_URI` in `.env` is correct and accessible

### Issue: Changes not reflected after rebuild

**Solution:** Force rebuild without cache:
```bash
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

---

**Last Updated:** February 4, 2026  
**Configuration:** Centralized .env file ✅
