# MongoDB Atlas Cluster Monitoring - EC2 Fix Guide

## Problem
The MongoDB Atlas cluster monitoring dashboard shows:
```
Error: MongoDB Atlas credentials are not configured
```

## Root Cause
Your backend application loads environment variables from `backend/.env`, but on EC2 your `.env` file is in the root directory. The backend cannot access the MongoDB Atlas API credentials.

## Solution Options

### ✅ Option 1: Copy .env to Backend Directory (Recommended for EC2)

On your EC2 instance:

```bash
# Navigate to your project root
cd /path/to/Business_talk

# Copy root .env to backend directory
cp .env backend/.env

# Or create a symlink (alternative)
ln -s /path/to/Business_talk/.env /path/to/Business_talk/backend/.env

# Restart your backend service
# If using PM2:
pm2 restart backend

# If using Docker:
docker-compose restart backend

# If using systemd:
sudo systemctl restart business-talk-backend
```

### ✅ Option 2: Update Backend to Load Root .env

Modify `backend/src/config/env.ts`:

```typescript
import dotenv from 'dotenv';
import path from 'path';

// Load from root directory if backend/.env doesn't exist
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Fallback to current directory
dotenv.config();
```

Then rebuild and restart:
```bash
cd backend
npm run build
pm2 restart backend  # or your restart command
```

### ✅ Option 3: Set Environment Variables Directly (Most Secure)

Instead of using .env files, set environment variables directly on EC2:

#### Using PM2 Ecosystem File:

Create `ecosystem.config.js` in your project root:

```javascript
module.exports = {
  apps: [{
    name: 'business-talk-backend',
    script: './backend/dist/index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      MONGODB_URI: 'mongodb+srv://dipakbipinbhatt_db_user:dipakbhatt@cluster0.qxps2vv.mongodb.net/business-talk?retryWrites=true&w=majority',
      JWT_SECRET: 'bt-production-secret-key-change-me-2024',
      JWT_REFRESH_SECRET: 'bt-refresh-production-secret-change-me-2024',
      JWT_EXPIRES_IN: '15m',
      JWT_REFRESH_EXPIRES_IN: '7d',
      FRONTEND_URL: 'https://your-frontend-url.com',
      ADMIN_EMAIL: 'admin@businesstalk.com',
      ADMIN_PASSWORD: 'Admin@123',
      MONGO_PUBLIC_KEY: 'kyrqqzvy',
      MONGO_PRIVATE_KEY: 'abe712c0-3510-4ff1-a14e-fd7ccf136b42',
      MONGO_PROJECT_ID: '694a5e0e68931519b60fffac'
    }
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
```

#### Using Systemd Service:

Edit your systemd service file:
```bash
sudo nano /etc/systemd/system/business-talk-backend.service
```

Add environment variables:
```ini
[Unit]
Description=Business Talk Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/path/to/Business_talk/backend
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
Environment="NODE_ENV=production"
Environment="PORT=5000"
Environment="MONGODB_URI=mongodb+srv://dipakbipinbhatt_db_user:dipakbhatt@cluster0.qxps2vv.mongodb.net/business-talk?retryWrites=true&w=majority"
Environment="MONGO_PUBLIC_KEY=kyrqqzvy"
Environment="MONGO_PRIVATE_KEY=abe712c0-3510-4ff1-a14e-fd7ccf136b42"
Environment="MONGO_PROJECT_ID=694a5e0e68931519b60fffac"
Environment="JWT_SECRET=bt-production-secret-key-change-me-2024"
Environment="JWT_REFRESH_SECRET=bt-refresh-production-secret-change-me-2024"
Environment="FRONTEND_URL=https://your-frontend-url.com"
Environment="ADMIN_EMAIL=admin@businesstalk.com"
Environment="ADMIN_PASSWORD=Admin@123"

[Install]
WantedBy=multi-user.target
```

Reload and restart:
```bash
sudo systemctl daemon-reload
sudo systemctl restart business-talk-backend
```

#### Using Docker Compose:

If using Docker, update `docker-compose.yml`:

```yaml
services:
  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGODB_URI=mongodb+srv://dipakbipinbhatt_db_user:dipakbhatt@cluster0.qxps2vv.mongodb.net/business-talk?retryWrites=true&w=majority
      - MONGO_PUBLIC_KEY=kyrqqzvy
      - MONGO_PRIVATE_KEY=abe712c0-3510-4ff1-a14e-fd7ccf136b42
      - MONGO_PROJECT_ID=694a5e0e68931519b60fffac
      - JWT_SECRET=bt-production-secret-key-change-me-2024
      - JWT_REFRESH_SECRET=bt-refresh-production-secret-change-me-2024
      - FRONTEND_URL=https://your-frontend-url.com
```

Restart:
```bash
docker-compose down
docker-compose up -d
```

## Verification Steps

### 1. Check Environment Variables are Loaded

SSH into your EC2 instance and check:

```bash
# If using PM2
pm2 env 0  # Shows environment variables for first app

# If using Docker
docker exec business-talk-backend env | grep MONGO

# If using systemd
sudo systemctl show business-talk-backend | grep Environment
```

### 2. Check Backend Logs

```bash
# PM2
pm2 logs backend

# Docker
docker logs business-talk-backend

# Systemd
sudo journalctl -u business-talk-backend -f
```

Look for these log messages:
```
[MongoDB Controller] Checking credentials...
[MongoDB Controller] Public Key present: true
[MongoDB Controller] Private Key present: true
[MongoDB Controller] Project ID: 694a5e0e68931519b60fffac
```

### 3. Test the API Endpoint

```bash
# From EC2 instance
curl http://localhost:5000/api/mongodb/clusters

# From your local machine (replace with your EC2 IP)
curl http://your-ec2-ip:5000/api/mongodb/clusters
```

Expected response:
```json
{
  "results": [
    {
      "name": "Cluster0",
      "mongoDBVersion": "8.0.3",
      "stateName": "IDLE"
    }
  ]
}
```

### 4. Check Frontend Dashboard

1. Open your admin dashboard
2. Navigate to MongoDB Atlas Cluster section
3. Should now show cluster information instead of error

## Troubleshooting

### Issue: Still showing "credentials not configured"

**Check 1: Verify .env file location**
```bash
# On EC2
ls -la /path/to/Business_talk/backend/.env
cat /path/to/Business_talk/backend/.env | grep MONGO_PUBLIC_KEY
```

**Check 2: Verify environment variables in running process**
```bash
# Find the Node.js process
ps aux | grep node

# Check environment (replace PID with actual process ID)
cat /proc/PID/environ | tr '\0' '\n' | grep MONGO
```

**Check 3: Restart the backend completely**
```bash
# Kill all node processes (careful!)
pkill -f node

# Restart your service
pm2 start ecosystem.config.js
# OR
docker-compose up -d
# OR
sudo systemctl start business-talk-backend
```

### Issue: "Failed to fetch clusters" error

**Possible causes:**

1. **Wrong API credentials** - Verify in MongoDB Atlas:
   - Go to: https://cloud.mongodb.com
   - Project Settings → Access Manager → API Keys
   - Check if `kyrqqzvy` key exists and has "Project Read Only" or higher permissions

2. **Wrong Project ID** - Verify:
   - Go to: https://cloud.mongodb.com
   - Project Settings → General
   - Copy the Project ID and compare with `694a5e0e68931519b60fffac`

3. **API Key expired or deleted** - Create new API key:
   ```bash
   # Update your .env with new credentials
   MONGO_PUBLIC_KEY=new_public_key
   MONGO_PRIVATE_KEY=new_private_key
   MONGO_PROJECT_ID=your_project_id
   ```

4. **Network/Firewall blocking MongoDB Atlas API**:
   ```bash
   # Test connectivity from EC2
   curl -v https://cloud.mongodb.com/api/atlas/v1.0/
   ```

### Issue: Backend not reading .env file

**Solution: Add debug logging**

Edit `backend/src/config/env.ts`:

```typescript
import dotenv from 'dotenv';
import path from 'path';

console.log('🔍 Current directory:', __dirname);
console.log('🔍 Loading .env from:', path.resolve(__dirname, '../../.env'));

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // Fallback

console.log('🔍 MONGO_PUBLIC_KEY loaded:', !!process.env.MONGO_PUBLIC_KEY);
console.log('🔍 MONGO_PRIVATE_KEY loaded:', !!process.env.MONGO_PRIVATE_KEY);
console.log('🔍 MONGO_PROJECT_ID loaded:', process.env.MONGO_PROJECT_ID);
```

Rebuild and check logs:
```bash
cd backend
npm run build
pm2 restart backend
pm2 logs
```

## Quick Fix Script

Create this script on your EC2 instance:

```bash
#!/bin/bash
# fix-mongodb-cluster.sh

echo "🔧 Fixing MongoDB Atlas Cluster Monitoring..."

# Navigate to project
cd /path/to/Business_talk

# Backup existing backend .env if it exists
if [ -f backend/.env ]; then
    echo "📦 Backing up existing backend/.env"
    cp backend/.env backend/.env.backup
fi

# Copy root .env to backend
echo "📋 Copying .env to backend directory"
cp .env backend/.env

# Verify MongoDB credentials are present
echo "✅ Verifying credentials..."
grep -q "MONGO_PUBLIC_KEY" backend/.env && echo "  ✓ MONGO_PUBLIC_KEY found" || echo "  ✗ MONGO_PUBLIC_KEY missing"
grep -q "MONGO_PRIVATE_KEY" backend/.env && echo "  ✓ MONGO_PRIVATE_KEY found" || echo "  ✗ MONGO_PRIVATE_KEY missing"
grep -q "MONGO_PROJECT_ID" backend/.env && echo "  ✓ MONGO_PROJECT_ID found" || echo "  ✗ MONGO_PROJECT_ID missing"

# Restart backend
echo "🔄 Restarting backend..."
cd backend
npm run build

# Detect and restart service
if command -v pm2 &> /dev/null; then
    echo "  Using PM2..."
    pm2 restart backend
elif command -v docker-compose &> /dev/null; then
    echo "  Using Docker Compose..."
    cd ..
    docker-compose restart backend
elif systemctl is-active --quiet business-talk-backend; then
    echo "  Using systemd..."
    sudo systemctl restart business-talk-backend
else
    echo "  ⚠️  Could not detect service manager. Please restart manually."
fi

echo "✅ Done! Check your dashboard in 10 seconds."
```

Make it executable and run:
```bash
chmod +x fix-mongodb-cluster.sh
./fix-mongodb-cluster.sh
```

## Security Recommendations

1. **Never commit .env files to Git**
   ```bash
   # Verify .env is in .gitignore
   grep -q "^\.env$" .gitignore || echo ".env" >> .gitignore
   ```

2. **Use environment-specific .env files**
   - Development: `backend/.env.development`
   - Production: `backend/.env.production`

3. **Rotate API keys regularly**
   - MongoDB Atlas → Project Settings → API Keys
   - Create new key, update .env, delete old key

4. **Use AWS Secrets Manager (Advanced)**
   ```bash
   # Store secrets in AWS
   aws secretsmanager create-secret \
     --name business-talk/mongodb-atlas \
     --secret-string '{"publicKey":"kyrqqzvy","privateKey":"abe712c0-3510-4ff1-a14e-fd7ccf136b42"}'
   ```

## Summary

**Quickest Fix (Recommended):**
```bash
# On EC2
cd /path/to/Business_talk
cp .env backend/.env
cd backend
npm run build
pm2 restart backend  # or your restart command
```

**Verify:**
```bash
curl http://localhost:5000/api/mongodb/clusters
```

**Expected Result:** JSON response with cluster information

---

**Last Updated:** January 30, 2026
**Status:** Ready to Deploy
**Estimated Fix Time:** 2-5 minutes
