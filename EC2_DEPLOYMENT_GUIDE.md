# Business Talk - EC2 Deployment Guide with Docker

This guide will help you deploy the Business Talk application on AWS EC2 using Docker and Docker Compose.

## Prerequisites

- AWS EC2 instance (Ubuntu 22.04 LTS recommended)
- At least 2GB RAM, 2 vCPUs
- 20GB+ storage
- Security group allowing ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 5000 (Backend API)
- Domain name (optional, but recommended)

## Step 1: Connect to Your EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

## Step 2: Update System and Install Dependencies

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl git apt-transport-https ca-certificates software-properties-common
```

## Step 3: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add current user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Log out and back in for group changes to take effect
exit
```

Re-connect to your EC2 instance after logging out.

## Step 4: Clone Your Repository

```bash
# Clone the repository
git clone https://github.com/dipakbipinbhatt/Business_talk.git
cd Business_talk
```

## Step 5: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.docker.example .env

# Edit the environment file with your actual values
nano .env
```

Update the following values in `.env`:
- `MONGO_ROOT_PASSWORD`: Strong password for MongoDB
- `JWT_SECRET`: Random 32+ character string
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `VITE_API_URL`: Your EC2 public IP or domain (e.g., http://3.85.123.45/api)

## Step 6: Build and Start the Application

```bash
# Build Docker images
docker-compose build

# Start all services
docker-compose up -d

# Check if containers are running
docker-compose ps

# View logs
docker-compose logs -f
```

## Step 7: Verify Deployment

```bash
# Check backend health
curl http://localhost:5000/api/health

# Check frontend
curl http://localhost:80

# Check MongoDB
docker exec -it business-talk-mongodb mongosh -u admin -p your-password
```

## Step 8: Configure Domain and SSL (Optional but Recommended)

### Install Certbot for SSL

```bash
sudo apt install -y certbot python3-certbot-nginx

# Stop the frontend container temporarily
docker-compose stop frontend

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Create nginx SSL configuration
sudo nano /etc/nginx/sites-available/business-talk
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/business-talk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Start frontend container again
docker-compose start frontend
```

## Common Docker Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Restart a service
docker-compose restart [service-name]

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This deletes database data)
docker-compose down -v

# Rebuild a specific service
docker-compose build [service-name]

# Update and restart
git pull
docker-compose build
docker-compose up -d

# Access MongoDB shell
docker exec -it business-talk-mongodb mongosh -u admin -p your-password

# Access backend container shell
docker exec -it business-talk-backend sh

# View container resource usage
docker stats
```

## Backup and Restore

### Backup MongoDB

```bash
# Create backup
docker exec business-talk-mongodb mongodump \
  -u admin -p your-password \
  --authenticationDatabase admin \
  --db business-talk \
  --out /data/backup

# Copy backup to host
docker cp business-talk-mongodb:/data/backup ./mongodb-backup-$(date +%Y%m%d)
```

### Restore MongoDB

```bash
# Copy backup to container
docker cp ./mongodb-backup business-talk-mongodb:/data/restore

# Restore
docker exec business-talk-mongodb mongorestore \
  -u admin -p your-password \
  --authenticationDatabase admin \
  --db business-talk \
  /data/restore/business-talk
```

## Monitoring

### Set up log rotation

```bash
# Create log rotation config
sudo nano /etc/docker/daemon.json
```

Add:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

```bash
# Restart Docker
sudo systemctl restart docker
docker-compose up -d
```

## Troubleshooting

### Container won't start
```bash
docker-compose logs [service-name]
```

### Out of disk space
```bash
# Clean up unused Docker resources
docker system prune -a
```

### MongoDB connection issues
```bash
# Check if MongoDB is healthy
docker exec business-talk-mongodb mongosh --eval "db.runCommand({ping: 1})"
```

### Backend API not responding
```bash
# Check backend logs
docker-compose logs backend

# Check environment variables
docker exec business-talk-backend env
```

### Reset everything (CAREFUL - Deletes all data)
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d
```

## Security Best Practices

1. **Change default passwords** in `.env`
2. **Use strong JWT_SECRET** (32+ characters)
3. **Enable firewall**:
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```
4. **Regular updates**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   docker-compose pull
   docker-compose up -d
   ```
5. **Monitor logs** regularly
6. **Set up automated backups**

## Auto-start on System Boot

Docker containers are set to `restart: unless-stopped`, so they will automatically start when the EC2 instance reboots.

## Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose build
docker-compose up -d

# Check status
docker-compose ps
```

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- GitHub: https://github.com/dipakbipinbhatt/Business_talk
- Documentation: See README files in backend/ and frontend/ directories

---

**Deployment Checklist:**
- [ ] EC2 instance created and accessible
- [ ] Docker and Docker Compose installed
- [ ] Repository cloned
- [ ] `.env` file configured with actual values
- [ ] Containers built and running
- [ ] Backend API accessible (port 5000)
- [ ] Frontend accessible (port 80)
- [ ] Domain configured (optional)
- [ ] SSL certificate installed (optional)
- [ ] Firewall configured
- [ ] Backups scheduled

