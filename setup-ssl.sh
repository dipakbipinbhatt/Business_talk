#!/bin/bash

# SSL Setup Script for Business Talk
# This script sets up Let's Encrypt SSL certificate using Certbot

echo "=== SSL Certificate Setup for Business Talk ==="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

DOMAIN="businesstalkwithdeepakbhatt.com"
EMAIL="dipakbipinbhatt@gmail.com"

echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo ""

# Install Certbot
echo "1. Installing Certbot..."
apt-get update
apt-get install -y certbot python3-certbot-nginx

# Stop containers temporarily
echo "2. Stopping containers..."
cd ~/Business_talk
docker-compose -f docker-compose.prod.yml down

# Get certificate
echo "3. Obtaining SSL certificate..."
certbot certonly --standalone \
    --preferred-challenges http \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

if [ $? -eq 0 ]; then
    echo "✅ SSL certificate obtained successfully!"
    
    # Create SSL directory in project
    mkdir -p ~/Business_talk/ssl
    
    # Copy certificates
    cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ~/Business_talk/ssl/
    cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ~/Business_talk/ssl/
    
    echo "✅ Certificates copied to ~/Business_talk/ssl/"
    
    # Set permissions
    chmod 644 ~/Business_talk/ssl/fullchain.pem
    chmod 600 ~/Business_talk/ssl/privkey.pem
    
    echo ""
    echo "4. Setting up auto-renewal..."
    
    # Create renewal hook
    cat > /etc/letsencrypt/renewal-hooks/deploy/restart-docker.sh << 'EOF'
#!/bin/bash
# Copy new certificates
cp /etc/letsencrypt/live/businesstalkwithdeepakbhatt.com/fullchain.pem /root/Business_talk/ssl/
cp /etc/letsencrypt/live/businesstalkwithdeepakbhatt.com/privkey.pem /root/Business_talk/ssl/
chmod 644 /root/Business_talk/ssl/fullchain.pem
chmod 600 /root/Business_talk/ssl/privkey.pem

# Restart containers
cd /root/Business_talk
docker-compose -f docker-compose.prod.yml restart frontend
EOF
    
    chmod +x /etc/letsencrypt/renewal-hooks/deploy/restart-docker.sh
    
    # Test renewal
    certbot renew --dry-run
    
    echo "✅ Auto-renewal configured!"
    echo ""
    echo "5. Restarting containers..."
    cd ~/Business_talk
    docker-compose -f docker-compose.prod.yml up -d
    
    echo ""
    echo "=== SSL Setup Complete! ==="
    echo ""
    echo "Your site is now available at:"
    echo "  https://$DOMAIN"
    echo "  https://www.$DOMAIN"
    echo ""
    echo "Certificates will auto-renew every 90 days."
    
else
    echo "❌ Failed to obtain SSL certificate"
    echo ""
    echo "Common issues:"
    echo "1. DNS not pointing to this server yet (wait 24-48 hours)"
    echo "2. Port 80 blocked by firewall"
    echo "3. Domain not accessible from internet"
    echo ""
    echo "Restarting containers without SSL..."
    cd ~/Business_talk
    docker-compose -f docker-compose.prod.yml up -d
    exit 1
fi
