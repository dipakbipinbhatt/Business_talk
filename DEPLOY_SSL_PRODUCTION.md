# 🚀 SSL Production Deployment Guide

## ✅ Prerequisites Completed
- [x] SSL certificates uploaded to VPS
- [x] Docker configuration ready
- [x] Frontend environment updated to HTTPS
- [x] Changes committed and pushed to GitHub

---

## 📝 Commands to Run on VPS

### **Connect to your VPS:**
```bash
ssh deepak@68.178.161.128
```

---

### **Step 1: Prepare SSL Certificates**

```bash
# Navigate to Business_talk directory
cd ~/Business_talk

# Go to ssl folder
cd ssl

# Rename the private key
mv PrivateKey.pem private.key

# Create fullchain certificate (domain cert + bundle)
cat businesstalkwithdeepakbhatt.com-certificate.crt gd_bundle-g2.crt > fullchain.crt

# Set proper permissions
chmod 600 private.key
chmod 644 fullchain.crt

# Verify files
ls -la
```

**Expected output:**
- `private.key` (600 permissions)
- `fullchain.crt` (644 permissions)

---

### **Step 2: Pull Latest Code**

```bash
# Go back to project root
cd ~/Business_talk

# Pull latest changes from GitHub
git pull origin main
```

---

### **Step 3: Stop Current Containers**

```bash
# Stop all running containers
docker-compose -f docker-compose.prod.yml down
```

---

### **Step 4: Rebuild and Deploy with SSL**

```bash
# Build and start containers with SSL enabled
docker-compose -f docker-compose.prod.yml up -d --build

# This will:
# - Build fresh images
# - Mount SSL certificates from ./ssl to /etc/nginx/ssl
# - Start both backend and frontend with SSL
```

---

### **Step 5: Verify Deployment**

```bash
# Check if containers are running
docker ps

# Check frontend logs
docker logs business-talk-frontend

# Check backend logs
docker logs business-talk-backend

# Test SSL certificate
curl -I https://businesstalkwithdeepakbhatt.com
```

---

## 🔍 Troubleshooting

### **If Nginx fails to start:**

```bash
# Check nginx logs for SSL errors
docker logs business-talk-frontend

# Common issues:
# 1. Certificate files not found
# 2. Wrong permissions
# 3. Invalid certificate format
```

### **Verify SSL files are correct:**

```bash
cd ~/Business_talk/ssl

# Check private key
openssl rsa -in private.key -check

# Check certificate
openssl x509 -in fullchain.crt -text -noout

# Verify certificate matches private key
openssl x509 -noout -modulus -in fullchain.crt | openssl md5
openssl rsa -noout -modulus -in private.key | openssl md5
# These two should match!
```

### **If containers won't start:**

```bash
# Remove all containers and volumes
docker-compose -f docker-compose.prod.yml down -v

# Rebuild from scratch
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate
```

---

## 🌐 Testing Your Live Site

Once deployed, test these URLs:

1. **HTTPS (should work):**
   - https://businesstalkwithdeepakbhatt.com

2. **HTTP (should redirect to HTTPS):**
   - http://businesstalkwithdeepakbhatt.com

3. **IP Address (should redirect to domain):**
   - http://68.178.161.128

4. **Admin Panel:**
   - https://businesstalkwithdeepakbhatt.com/admin

---

## 📊 Expected Results

✅ **Green padlock** in browser  
✅ **Valid SSL certificate** from GoDaddy  
✅ **All API calls** working over HTTPS  
✅ **No mixed content warnings**  
✅ **Admin panel** accessible  

---

## 🎯 Quick Commands Reference

```bash
# View all containers
docker ps -a

# Restart frontend only
docker-compose -f docker-compose.prod.yml restart frontend

# Restart backend only
docker-compose -f docker-compose.prod.yml restart backend

# View real-time logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop everything
docker-compose -f docker-compose.prod.yml down

# Start everything
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔐 Security Checklist

- [x] SSL certificates properly installed
- [x] HTTPS enabled on port 443
- [x] HTTP redirects to HTTPS
- [x] IP address redirects to domain
- [x] Private key has restricted permissions (600)
- [x] Security headers enabled in Nginx
- [x] CORS properly configured for HTTPS

---

## 📞 Need Help?

If you encounter any issues:

1. Check container logs: `docker logs business-talk-frontend`
2. Verify SSL files exist: `ls -la ~/Business_talk/ssl/`
3. Test certificate validity: `openssl x509 -in ~/Business_talk/ssl/fullchain.crt -text -noout`
4. Check if ports are open: `sudo netstat -tlnp | grep -E '80|443'`

---

**Last Updated:** February 4, 2026  
**Status:** Ready for deployment 🚀
