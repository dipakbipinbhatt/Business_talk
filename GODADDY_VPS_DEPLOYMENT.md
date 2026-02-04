# GoDaddy VPS Deployment Guide - ADMIN PANEL FIX

## Problem Summary
**Issue**: Admin panel at `https://businesstalkwithdeepakbhatt.com/admin` shows `ERR_QUIC_PROTOCOL_ERROR`

**Root Cause**: Frontend doesn't know where the backend API is located on your VPS

**Solution**: Configure frontend to use the correct API URL for your GoDaddy VPS

---

## VPS Information
- **IP Address**: `68.178.161.128`
- **Domain**: `businesstalkwithdeepakbhatt.com`
- **Backend API**: Running on port 5000 (proxied through nginx)
- **Frontend**: Served through nginx

---

## Files Updated

### 1. Frontend Production Environment
**File**: `frontend/.env.production`
```bash
VITE_API_URL=https://businesstalkwithdeepakbhatt.com/api
```

### 2. Backend CORS Configuration
**File**: `backend/.env`
```bash
FRONTEND_URL=https://businesstalkwithdeepakbhatt.com
```

---

## Deployment Options

### ⭐ OPTION 1: Quick Deploy via Git Pull (RECOMMENDED)

This is the fastest method if Git is set up on your VPS.

**Step 1**: SSH into your VPS
```bash
ssh root@68.178.161.128
```

**Step 2**: Navigate to your app directory
```bash
cd /var/www/business-talk
```

**Step 3**: Pull latest changes
```bash
git pull origin main
```

**Step 4**: Rebuild frontend
```bash
cd frontend
npm install
npm run build
```

**Step 5**: Rebuild backend
```bash
cd ../backend
npm install
npm run build
```

**Step 6**: Restart backend service
```bash
pm2 restart business-talk-backend
# OR if using systemd:
# sudo systemctl restart business-talk-backend
# OR if running manually:
# npm run start
```

**Step 7**: Verify
```bash
curl http://localhost/api/health
```

---

### OPTION 2: Automated Deployment Script (Windows)

**Step 1**: Run the deployment script
```bash
deploy-to-vps.bat
```

This will:
- ✅ Build frontend locally
- ✅ Build backend locally
- ✅ Commit changes to Git
- ✅ Show deployment instructions

**Step 2**: Follow the on-screen instructions to complete deployment

---

### OPTION 3: Automated Deployment Script (Linux/Mac/Git Bash)

**Step 1**: Make script executable
```bash
chmod +x deploy-to-vps.sh
```

**Step 2**: Run the script
```bash
./deploy-to-vps.sh
```

This will:
- ✅ Build frontend locally
- ✅ Upload to VPS
- ✅ Deploy on VPS
- ✅ Restart services
- ✅ Verify deployment

---

### OPTION 4: Manual FTP/SFTP Upload

**Step 1**: Build locally (on Windows)
```bash
cd frontend
npm install
npm run build
cd ..

cd backend
npm install
npm run build
cd ..
```

**Step 2**: Connect to VPS via SFTP
- Use FileZilla, WinSCP, or similar
- Host: `68.178.161.128`
- Username: `root` (or your VPS username)
- Port: `22`

**Step 3**: Upload files
- Upload `frontend/dist/*` → `/var/www/business-talk/frontend/`
- Upload `backend/dist/*` → `/var/www/business-talk/backend/dist/`
- Upload `backend/.env` → `/var/www/business-talk/backend/.env`

**Step 4**: SSH and restart
```bash
ssh root@68.178.161.128
cd /var/www/business-talk/backend
npm install --production
pm2 restart business-talk-backend
```

---

## Nginx Configuration

Your VPS should have nginx configured to:
1. Serve frontend static files
2. Proxy `/api` requests to backend on port 5000

**Expected nginx config** (`/etc/nginx/sites-available/business-talk`):

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name businesstalkwithdeepakbhatt.com www.businesstalkwithdeepakbhatt.com;

    # SSL Configuration (if using SSL)
    ssl_certificate /etc/letsencrypt/live/businesstalkwithdeepakbhatt.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/businesstalkwithdeepakbhatt.com/privkey.pem;

    # Frontend - Serve static files
    root /var/www/business-talk/frontend;
    index index.html;

    # Frontend - SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API - Proxy to Node.js
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**To verify nginx config**:
```bash
ssh root@68.178.161.128
cat /etc/nginx/sites-available/business-talk
nginx -t  # Test configuration
sudo systemctl reload nginx  # Reload if needed
```

---

## Backend Service Management

### Using PM2 (Recommended)

**Check status**:
```bash
pm2 status
```

**Restart**:
```bash
pm2 restart business-talk-backend
```

**View logs**:
```bash
pm2 logs business-talk-backend
```

**Start on boot**:
```bash
pm2 startup
pm2 save
```

### Using systemd

**Check status**:
```bash
sudo systemctl status business-talk-backend
```

**Restart**:
```bash
sudo systemctl restart business-talk-backend
```

**View logs**:
```bash
sudo journalctl -u business-talk-backend -f
```

---

## Verification Steps

After deployment, verify everything works:

### 1. Check Backend Health
```bash
curl https://businesstalkwithdeepakbhatt.com/api/health
```
**Expected**: `{"status":"ok","timestamp":"...","database":{...}}`

### 2. Check Frontend
```bash
curl https://businesstalkwithdeepakbhatt.com
```
**Expected**: HTML content of your homepage

### 3. Test Admin Panel
**Browser**: Visit `https://businesstalkwithdeepakbhatt.com/admin`
**Expected**: Login page (not an error)

### 4. Test Login
- **Email**: `admin@businesstalk.com`
- **Password**: `Admin@123`
- **Expected**: Successfully log in to dashboard

---

## Troubleshooting

### Issue: Admin panel still shows error

**Solution 1**: Clear browser cache
```
Press Ctrl+Shift+Delete
Clear cached images and files
Hard reload: Ctrl+F5
```

**Solution 2**: Check browser console (F12)
- Look for API errors
- Verify API URL is `https://businesstalkwithdeepakbhatt.com/api`

**Solution 3**: Verify backend is running
```bash
ssh root@68.178.161.128
pm2 status
curl http://localhost:5000/api/health
```

### Issue: CORS errors in browser console

**Solution**: Verify backend `.env` has correct FRONTEND_URL
```bash
ssh root@68.178.161.128
cat /var/www/business-talk/backend/.env | grep FRONTEND_URL
```
Should show: `FRONTEND_URL=https://businesstalkwithdeepakbhatt.com`

If not, update it and restart:
```bash
nano /var/www/business-talk/backend/.env
pm2 restart business-talk-backend
```

### Issue: 502 Bad Gateway

**Cause**: Backend is not running

**Solution**:
```bash
ssh root@68.178.161.128
cd /var/www/business-talk/backend
pm2 restart business-talk-backend
# OR
pm2 start dist/index.js --name business-talk-backend
```

### Issue: Frontend shows old version

**Cause**: Browser cache or nginx cache

**Solution**:
```bash
# Clear nginx cache (if configured)
ssh root@68.178.161.128
sudo rm -rf /var/cache/nginx/*
sudo systemctl reload nginx

# Clear browser cache
Ctrl+Shift+Delete in browser
```

---

## Quick Commands Reference

### Deploy from Windows
```bash
deploy-to-vps.bat
```

### Deploy from Linux/Mac/Git Bash
```bash
./deploy-to-vps.sh
```

### Manual Deploy on VPS
```bash
ssh root@68.178.161.128
cd /var/www/business-talk
git pull
cd frontend && npm install && npm run build && cd ..
cd backend && npm install && npm run build && cd ..
pm2 restart business-talk-backend
```

### Check Logs
```bash
ssh root@68.178.161.128
pm2 logs business-talk-backend
tail -f /var/log/nginx/error.log
```

### Restart Everything
```bash
ssh root@68.178.161.128
pm2 restart business-talk-backend
sudo systemctl reload nginx
```

---

## SSL Certificate (If Not Already Configured)

If your site doesn't have SSL (https), set it up:

```bash
ssh root@68.178.161.128

# Install certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d businesstalkwithdeepakbhatt.com -d www.businesstalkwithdeepakbhatt.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Support Checklist

Before asking for help, verify:

- [ ] Backend is running: `pm2 status`
- [ ] Backend health check works: `curl http://localhost:5000/api/health`
- [ ] Nginx is running: `sudo systemctl status nginx`
- [ ] Nginx config is correct: `nginx -t`
- [ ] Frontend files are deployed: `ls /var/www/business-talk/frontend/`
- [ ] Backend files are deployed: `ls /var/www/business-talk/backend/dist/`
- [ ] Environment variables are set: `cat /var/www/business-talk/backend/.env`
- [ ] Browser cache is cleared
- [ ] Checked browser console for errors (F12)

---

## Summary

**What was fixed**:
1. ✅ Created `frontend/.env.production` with VPS API URL
2. ✅ Updated `backend/.env` with production domain
3. ✅ Created deployment scripts for easy updates
4. ✅ Documented complete deployment process

**Next step**: 
Choose one of the deployment options above and deploy the fix!

**Estimated time**: 5-10 minutes

**Result**: Admin panel will be accessible at `https://businesstalkwithdeepakbhatt.com/admin`
