# 🚀 Docker Deployment Guide

## Quick Start

Run this ONE command on your server:

```bash
cd ~/Business_talk && bash FULL_DOCKER_DEPLOY.sh
```

This will:
1. ✅ Stop old containers and nginx
2. ✅ Build fresh Docker containers
3. ✅ Start containers (backend on 5000, frontend on 3000)
4. ✅ Configure nginx as reverse proxy
5. ✅ Start nginx
6. ✅ Configure firewall
7. ✅ Test everything

---

## Architecture

```
Internet (Port 80/443)
    ↓
Nginx (Host) - Reverse Proxy
    ├─→ Frontend Container (localhost:3000)
    └─→ Backend Container (localhost:5000) → MongoDB Atlas
```

---

## Files Changed

### 1. docker-compose.prod.yml
- Backend: Binds to `127.0.0.1:5000` (localhost only)
- Frontend: Binds to `127.0.0.1:3000` (localhost only)
- Healthchecks enabled
- Resource limits set

### 2. nginx.conf
- Proxies port 80/443 to Docker containers
- SSL support with Let's Encrypt
- GZIP compression enabled
- Security headers added

### 3. .env
- `VITE_API_URL=/api` (nginx will proxy)
- All other settings unchanged

---

## Manual Deployment Steps

If script doesn't work, run manually:

### Step 1: Stop everything
```bash
cd ~/Business_talk
docker-compose -f docker-compose.prod.yml down
sudo systemctl stop nginx
```

### Step 2: Start Docker containers
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### Step 3: Wait and verify
```bash
sleep 30
docker ps
curl http://127.0.0.1:5000/api/health
curl http://127.0.0.1:3000
```

### Step 4: Configure nginx
```bash
sudo cp nginx.conf /etc/nginx/sites-available/business-talk
sudo ln -sf /etc/nginx/sites-available/business-talk /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
```

### Step 5: Start nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 6: Configure firewall
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Step 7: Test
```bash
curl http://68.178.161.128
curl http://businesstalkwithdeepakbhatt.com
```

---

## Troubleshooting

### Issue 1: Containers not starting

**Check logs:**
```bash
docker logs business-talk-backend --tail 50
docker logs business-talk-frontend --tail 50
```

**Rebuild:**
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### Issue 2: Site not accessible

**Check nginx:**
```bash
sudo systemctl status nginx
sudo nginx -t
sudo tail -50 /var/log/nginx/error.log
```

**Check if containers are accessible:**
```bash
curl http://127.0.0.1:3000
curl http://127.0.0.1:5000/api/health
```

**Check firewall:**
```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Issue 3: Backend not connecting to frontend

**Check .env file:**
```bash
cat .env | grep VITE_API_URL
# Should show: VITE_API_URL=/api
```

**Rebuild frontend:**
```bash
docker-compose -f docker-compose.prod.yml up -d --build frontend
```

### Issue 4: SSL not working

**Install certbot:**
```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
```

**Get SSL certificate:**
```bash
sudo certbot --nginx -d businesstalkwithdeepakbhatt.com -d www.businesstalkwithdeepakbhatt.com
```

**Auto-renew:**
```bash
sudo certbot renew --dry-run
```

---

## Useful Commands

### View logs
```bash
# All logs
docker-compose -f docker-compose.prod.yml logs -f

# Backend only
docker logs business-talk-backend -f

# Frontend only
docker logs business-talk-frontend -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Restart services
```bash
# Restart all containers
docker-compose -f docker-compose.prod.yml restart

# Restart specific container
docker restart business-talk-backend
docker restart business-talk-frontend

# Restart nginx
sudo systemctl restart nginx
```

### Stop services
```bash
# Stop containers
docker-compose -f docker-compose.prod.yml down

# Stop nginx
sudo systemctl stop nginx
```

### Check status
```bash
# Container status
docker ps

# Nginx status
sudo systemctl status nginx

# Check ports
sudo netstat -tlnp | grep -E ':(80|443|3000|5000)'
```

---

## Performance Optimizations Applied

1. ✅ **GZIP Compression** - Nginx compresses responses
2. ✅ **Compact Mode** - Calendar pages exclude large images
3. ✅ **Database Indexes** - Fast sorting queries
4. ✅ **Resource Limits** - Prevents memory issues
5. ✅ **Healthchecks** - Auto-restart if unhealthy

---

## Security Features

1. ✅ **SSL/TLS** - HTTPS encryption
2. ✅ **Security Headers** - XSS, clickjacking protection
3. ✅ **Firewall** - Only ports 80/443 exposed
4. ✅ **Localhost Binding** - Containers not directly accessible
5. ✅ **Nginx Proxy** - Single entry point

---

## Monitoring

### Check if site is up
```bash
curl -I http://businesstalkwithdeepakbhatt.com
```

### Check backend health
```bash
curl http://127.0.0.1:5000/api/health
```

### Check container health
```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### Check nginx status
```bash
sudo systemctl status nginx
```

---

## Backup & Recovery

### Backup
```bash
# Backup uploads
tar -czf uploads-backup.tar.gz backend/uploads/

# Backup .env
cp .env .env.backup
```

### Recovery
```bash
# Restore uploads
tar -xzf uploads-backup.tar.gz

# Restore .env
cp .env.backup .env

# Redeploy
bash FULL_DOCKER_DEPLOY.sh
```

---

## Update Deployment

When you have new code:

```bash
cd ~/Business_talk
git pull origin dev
bash FULL_DOCKER_DEPLOY.sh
```

---

## Complete Cleanup

If you need to start fresh:

```bash
# Stop everything
docker-compose -f docker-compose.prod.yml down
sudo systemctl stop nginx

# Remove containers
docker rm -f $(docker ps -aq)

# Remove images
docker rmi business_talk_backend business_talk_frontend

# Remove volumes
docker volume prune -f

# Redeploy
bash FULL_DOCKER_DEPLOY.sh
```

---

## Support

If issues persist:

1. Check logs: `docker-compose -f docker-compose.prod.yml logs`
2. Check nginx: `sudo tail -50 /var/log/nginx/error.log`
3. Test locally: `curl http://127.0.0.1:3000`
4. Check firewall: `sudo ufw status`
5. Verify DNS: `ping businesstalkwithdeepakbhatt.com`

---

**Your site will be live at: https://businesstalkwithdeepakbhatt.com** 🎉
