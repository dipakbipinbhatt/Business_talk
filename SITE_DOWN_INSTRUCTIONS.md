# 🚨 SITE DOWN - EMERGENCY FIX INSTRUCTIONS

## Problem
Your site shows **"ERR_CONNECTION_REFUSED"** - this means:
- ❌ Nginx is not running OR
- ❌ Frontend files are missing OR
- ❌ Nginx config is broken

## Solution - Run This on Your Server

### Option 1: Quick Fix (Fastest - 2 minutes)
```bash
cd ~/Business_talk
bash QUICK_FIX.sh
```

### Option 2: Complete Fix (Thorough - 5 minutes)
```bash
cd ~/Business_talk
bash COMPLETE_SITE_FIX.sh
```

### Option 3: Manual Fix (Step by Step)

#### Step 1: Check what's wrong
```bash
# Check nginx
sudo systemctl status nginx

# Check backend
pm2 list

# Check frontend files
ls -la /var/www/business-talk/frontend/
```

#### Step 2: Fix nginx
```bash
# Test nginx config
sudo nginx -t

# If config is OK, restart nginx
sudo systemctl restart nginx

# If config has errors, copy correct config
sudo cp ~/Business_talk/nginx.conf /etc/nginx/sites-available/business-talk
sudo ln -sf /etc/nginx/sites-available/business-talk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 3: Fix frontend
```bash
cd ~/Business_talk/frontend
npm run build
sudo mkdir -p /var/www/business-talk/frontend
sudo cp -r dist/* /var/www/business-talk/frontend/
sudo chown -R www-data:www-data /var/www/business-talk/
```

#### Step 4: Fix backend
```bash
cd ~/Business_talk/backend
npm run build
pm2 restart backend || pm2 start dist/index.js --name backend
```

#### Step 5: Verify
```bash
# Check services
sudo systemctl status nginx
pm2 list

# Test locally
curl http://localhost
curl http://localhost:5000/api/health

# Test your domain
curl https://businesstalkwithdeepakbhatt.com
```

---

## Common Issues & Solutions

### Issue 1: Nginx not running
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Issue 2: Frontend files missing
```bash
cd ~/Business_talk/frontend
npm install
npm run build
sudo cp -r dist/* /var/www/business-talk/frontend/
```

### Issue 3: Backend not running
```bash
cd ~/Business_talk/backend
npm install
npm run build
pm2 start dist/index.js --name backend
pm2 save
```

### Issue 4: Port 80/443 already in use
```bash
# Check what's using the ports
sudo lsof -i :80
sudo lsof -i :443

# If Docker is using them, stop Docker
docker-compose down

# Restart nginx
sudo systemctl restart nginx
```

### Issue 5: SSL certificate issues
```bash
# Check certificates
sudo certbot certificates

# Renew if needed
sudo certbot renew

# Restart nginx
sudo systemctl restart nginx
```

### Issue 6: Firewall blocking
```bash
# Check firewall
sudo ufw status

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

---

## Your Production Setup

Based on your nginx.conf, your setup is:

```
Internet → Port 80/443 → Nginx (Host) → Backend (PM2 on port 5000)
                              ↓
                        Frontend files (/var/www/business-talk/frontend/)
```

**NOT using Docker for production!**

Your nginx config:
- Location: `/etc/nginx/sites-available/business-talk`
- Frontend files: `/var/www/business-talk/frontend/`
- Backend: PM2 running on port 5000
- SSL: Let's Encrypt certificates

---

## Quick Diagnosis Commands

```bash
# 1. Check if nginx is running
sudo systemctl status nginx

# 2. Check if backend is running
pm2 list

# 3. Check if frontend files exist
ls /var/www/business-talk/frontend/index.html

# 4. Check what's listening on ports
sudo netstat -tlnp | grep -E ':(80|443|5000)'

# 5. Test locally
curl http://localhost
curl http://localhost:5000/api/health

# 6. Check logs
sudo tail -50 /var/log/nginx/error.log
pm2 logs backend --lines 50
```

---

## After Site is Back Online

Once your site is working again, apply the performance fixes:

```bash
# 1. Pull latest code with performance optimizations
git pull origin dev

# 2. Install new dependencies (compression)
cd ~/Business_talk/backend
npm install

# 3. Rebuild backend
npm run build

# 4. Restart backend
pm2 restart backend

# 5. Rebuild and deploy frontend
cd ~/Business_talk/frontend
npm install
npm run build
sudo cp -r dist/* /var/www/business-talk/frontend/

# 6. Reload nginx
sudo systemctl reload nginx
```

This will apply the 180x performance improvement (36MB → 200KB).

---

## Prevention

To prevent this from happening again:

1. **Enable PM2 startup**:
   ```bash
   pm2 startup
   pm2 save
   ```

2. **Enable nginx auto-start**:
   ```bash
   sudo systemctl enable nginx
   ```

3. **Monitor services**:
   ```bash
   # Add to crontab
   */5 * * * * pm2 resurrect
   ```

4. **Set up monitoring**:
   ```bash
   pm2 install pm2-logrotate
   ```

---

## Emergency Contact Commands

If nothing works, these will definitely get your site back:

```bash
# Nuclear option - rebuild everything
cd ~/Business_talk
git pull origin dev
cd frontend && npm install && npm run build
sudo cp -r dist/* /var/www/business-talk/frontend/
cd ../backend && npm install && npm run build
pm2 delete all
pm2 start dist/index.js --name backend
pm2 save
sudo systemctl restart nginx
```

---

**Run `QUICK_FIX.sh` now to get your site back online!**
