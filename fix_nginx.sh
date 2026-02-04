#!/bin/bash
# Nginx Configuration Fixer for Business Talk
# Run this on your VPS as root

echo "Configuring Nginx..."

# Create the config file
cat > /etc/nginx/sites-available/business-talk << 'EOF'
server {
    listen 80;
    server_name businesstalkwithdeepakbhatt.com www.businesstalkwithdeepakbhatt.com;
    
    # Redirect HTTP to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name businesstalkwithdeepakbhatt.com www.businesstalkwithdeepakbhatt.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/businesstalkwithdeepakbhatt.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/businesstalkwithdeepakbhatt.com/privkey.pem;
    
    # Logs
    access_log /var/log/nginx/business-talk.access.log;
    error_log /var/log/nginx/business-talk.error.log;

    # Root directory
    root /var/www/business-talk/frontend;
    index index.html;

    # Frontend - SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        
        # Disable cache for index.html to ensure updates are seen
        location = /index.html {
            add_header Cache-Control "no-store, no-cache, must-revalidate";
        }
    }

    # Backend API - Proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/business-talk /etc/nginx/sites-enabled/

# Test configuration
echo "Testing configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "Configuration looks good. Restarting Nginx..."
    systemctl restart nginx
    echo "Done! QUIC error should be resolved."
else
    echo "Error in configuration. Please check the output above."
fi
