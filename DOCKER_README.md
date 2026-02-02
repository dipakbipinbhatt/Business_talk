# Docker Deployment - Quick Reference

## Quick Start

### 1. Prerequisites
- Docker and Docker Compose installed
- `.env` file configured

### 2. Deploy in One Command

```bash
# Make deployment script executable
chmod +x deploy-ec2.sh

# Run deployment
./deploy-ec2.sh
```

## Manual Deployment

### Development Mode
```bash
docker-compose up -d
```

### Production Mode
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Common Commands

```bash
# View all containers
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ Deletes data)
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build

# Scale a service (not applicable for this setup)
docker-compose up -d --scale backend=3
```

## Service Access

| Service  | Port | URL |
|----------|------|-----|
| Frontend | 80   | http://localhost |
| Backend  | 5000 | http://localhost:5000 |
| MongoDB  | 27017| localhost:27017 |

## Container Management

### Execute commands in containers
```bash
# Backend shell
docker exec -it business-talk-backend sh

# MongoDB shell
docker exec -it business-talk-mongodb mongosh -u admin -p yourpassword

# Check backend logs
docker logs business-talk-backend

# Follow logs in real-time
docker logs -f business-talk-backend
```

### Resource Monitoring
```bash
# View resource usage
docker stats

# View detailed container info
docker inspect business-talk-backend
```

## Data Management

### Backup MongoDB
```bash
# Create backup directory
mkdir -p backups

# Backup
docker exec business-talk-mongodb mongodump \
  -u admin -p yourpassword \
  --authenticationDatabase admin \
  --db business-talk \
  --gzip \
  --archive=/data/backup.gz

# Copy to host
docker cp business-talk-mongodb:/data/backup.gz ./backups/backup-$(date +%Y%m%d-%H%M%S).gz
```

### Restore MongoDB
```bash
# Copy backup to container
docker cp ./backups/backup.gz business-talk-mongodb:/data/restore.gz

# Restore
docker exec business-talk-mongodb mongorestore \
  -u admin -p yourpassword \
  --authenticationDatabase admin \
  --gzip \
  --archive=/data/restore.gz
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs [service-name]

# Check container status
docker ps -a

# Remove and recreate
docker-compose down
docker-compose up -d
```

### Port already in use
```bash
# Find process using port
sudo lsof -i :80
sudo lsof -i :5000

# Kill process
sudo kill -9 [PID]

# Or change port in docker-compose.yml
```

### Out of disk space
```bash
# Remove unused containers, networks, images
docker system prune -a

# Remove specific images
docker rmi [image-id]

# Remove volumes (⚠️ careful)
docker volume prune
```

### Database connection issues
```bash
# Check MongoDB logs
docker logs business-talk-mongodb

# Test MongoDB connection
docker exec business-talk-mongodb mongosh \
  -u admin -p yourpassword \
  --authenticationDatabase admin \
  --eval "db.adminCommand('ping')"

# Restart MongoDB
docker-compose restart mongodb
```

### Frontend not loading
```bash
# Check nginx logs
docker exec business-talk-frontend cat /var/log/nginx/error.log

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

## Environment Variables

Required variables in `.env`:
```env
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-password
MONGODB_URI=mongodb://admin:your-password@mongodb:27017/business-talk?authSource=admin
JWT_SECRET=your-jwt-secret-min-32-chars
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Security Best Practices

1. ✅ Never commit `.env` file
2. ✅ Use strong passwords (20+ characters)
3. ✅ Update Docker images regularly
4. ✅ Use production compose file in production
5. ✅ Enable firewall on host machine
6. ✅ Set up SSL/TLS for HTTPS
7. ✅ Regular backups
8. ✅ Monitor logs for suspicious activity

## Performance Optimization

### Resource Limits
Edit `docker-compose.prod.yml` to adjust:
```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 1G
```

### Log Rotation
Logs are automatically rotated with:
- Max size: 10MB per file
- Max files: 3

### Image Optimization
Images use:
- Multi-stage builds
- Alpine Linux (smaller size)
- Production-only dependencies

## Updating the Application

```bash
# Pull latest code
git pull origin main

# Rebuild with no cache
docker-compose build --no-cache

# Restart with new images
docker-compose up -d

# Verify
docker-compose ps
docker-compose logs -f
```

## Health Checks

All services have health checks:
- **MongoDB**: Pings database every 10s
- **Backend**: HTTP check on /api/health every 30s
- **Frontend**: HTTP check on / every 30s

View health status:
```bash
docker-compose ps
docker inspect business-talk-backend --format='{{json .State.Health}}'
```

## Network Configuration

All services communicate on `business-talk-network`:
- MongoDB: `mongodb:27017`
- Backend: `backend:5000`
- Frontend: `frontend:80`

## Architecture

```
┌─────────────┐
│   Client    │
└─────┬───────┘
      │ HTTP :80
      ▼
┌─────────────┐
│  Frontend   │
│   (Nginx)   │
└─────┬───────┘
      │ Proxy /api
      ▼
┌─────────────┐
│   Backend   │
│  (Node.js)  │
└─────┬───────┘
      │ MongoDB connection
      ▼
┌─────────────┐
│   MongoDB   │
│  (Database) │
└─────────────┘
```

## Support

- 📖 Full guide: See `EC2_DEPLOYMENT_GUIDE.md`
- 🐛 Issues: https://github.com/dipakbipinbhatt/Business_talk/issues
- 📧 Contact: [Your email]

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker](https://hub.docker.com/_/mongo)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

