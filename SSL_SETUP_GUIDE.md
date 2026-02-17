# SSL Setup Guide for Business Talk

## Current Status
✅ Site working on IP: http://68.178.161.128/
❌ Domain not working: https://businesstalkwithdeepakbhatt.com/

## Problem
Your domain DNS is not pointing to your server IP address.

## Solution - Step by Step

### Step 1: Update DNS Records (Do this FIRST)

Go to your domain registrar (GoDaddy, Namecheap, etc.) and add these DNS records:

```
Type: A
Name: @
Value: 68.178.161.128
TTL: 3600 (or Auto)

Type: A  
Name: www
Value: 68.178.161.128
TTL: 3600 (or Auto)
```

**Wait 1-24 hours for DNS to propagate** (usually takes 1-2 hours)

### Step 2: Verify DNS is Working

On your server, run:
```bash
# Check if domain resolves to your IP
nslookup businesstalkwithdeepakbhatt.com

# Should show: 68.178.161.128
```

Or from your computer:
```bash
ping businesstalkwithdeepakbhatt.com
```

### Step 3: Setup SSL Certificate

Once DNS is working, run this on your server:

```bash
# Make script executable
chmod +x ~/Business_talk/setup-ssl.sh

# Run as root
sudo ~/Business_talk/setup-ssl.sh
```

This will:
1. Install Certbot
2. Get free SSL certificate from Let's Encrypt
3. Configure auto-renewal
4. Update nginx to use HTTPS

### Step 4: Update Nginx Config for SSL

After SSL is obtained, update the nginx config:

```bash
cd ~/Business_talk

# Backup current config
cp frontend/nginx.conf frontend/nginx.conf.backup

# Use SSL config
cp frontend/nginx-ssl.conf frontend/nginx.conf

# Rebuild frontend
docker-compose -f docker-compose.prod.yml up -d --build frontend
```

### Step 5: Verify HTTPS is Working

```bash
# Test HTTPS
curl -I https://businesstalkwithdeepakbhatt.com

# Should return HTTP/2 200
```

## Alternative: Manual SSL Setup

If the script doesn't work, do it manually:

```bash
# 1. Stop containers
cd ~/Business_talk
docker-compose -f docker-compose.prod.yml down

# 2. Install Certbot
sudo apt-get update
sudo apt-get install -y certbot

# 3. Get certificate
sudo certbot certonly --standalone \
    --preferred-challenges http \
    --email dipakbipinbhatt@gmail.com \
    --agree-tos \
    -d businesstalkwithdeepakbhatt.com \
    -d www.businesstalkwithdeepakbhatt.com

# 4. Copy certificates
sudo mkdir -p ~/Business_talk/ssl
sudo cp /etc/letsencrypt/live/businesstalkwithdeepakbhatt.com/fullchain.pem ~/Business_talk/ssl/
sudo cp /etc/letsencrypt/live/businesstalkwithdeepakbhatt.com/privkey.pem ~/Business_talk/ssl/
sudo chmod 644 ~/Business_talk/ssl/fullchain.pem
sudo chmod 600 ~/Business_talk/ssl/privkey.pem

# 5. Update nginx config
cd ~/Business_talk
cp frontend/nginx-ssl.conf frontend/nginx.conf

# 6. Restart with SSL
docker-compose -f docker-compose.prod.yml up -d --build
```

## Troubleshooting

### DNS Not Propagating
```bash
# Check current DNS
dig businesstalkwithdeepakbhatt.com +short

# If it doesn't show 68.178.161.128, wait longer or check DNS settings
```

### Certbot Fails
Common reasons:
1. DNS not pointing to server yet
2. Port 80 blocked by firewall
3. Another service using port 80

```bash
# Check firewall
sudo ufw status

# Allow ports if needed
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Certificate Renewal
Certificates auto-renew. To test:
```bash
sudo certbot renew --dry-run
```

## Final Checklist

- [ ] DNS A records added for @ and www
- [ ] DNS propagated (can ping domain)
- [ ] SSL certificate obtained
- [ ] Nginx config updated to use SSL
- [ ] Containers rebuilt and running
- [ ] Site accessible via HTTPS
- [ ] HTTP redirects to HTTPS
- [ ] Auto-renewal configured

## Support

If you need help:
1. Check DNS: `nslookup businesstalkwithdeepakbhatt.com`
2. Check containers: `docker-compose -f docker-compose.prod.yml ps`
3. Check logs: `docker-compose -f docker-compose.prod.yml logs -f`
4. Check nginx: `docker exec business-talk-frontend nginx -t`
