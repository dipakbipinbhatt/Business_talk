# Deploy MongoDB Cluster Fix to EC2 - Quick Guide

## 🚀 Deploy Now (5 Minutes)

### Step 1: Push Changes to GitHub
```bash
# On your local Windows machine (run in PowerShell or CMD)
git push origin main
```

### Step 2: SSH to Your EC2 Instance
```bash
# Replace with your actual EC2 details
ssh -i your-key.pem ubuntu@your-ec2-ip-address

# Example:
# ssh -i ~/keys/business-talk.pem ubuntu@3.85.123.45
```

### Step 3: Navigate to Project Directory
```bash
# Find your project directory (common locations)
cd ~/Business_talk
# OR
cd /var/www/Business_talk
# OR
cd /home/ubuntu/Business_talk
```

### Step 4: Pull Latest Changes
```bash
git pull origin main
```

### Step 5: Run the Fix Script
```bash
# Make script executable
chmod +x fix-ec2-mongodb.sh

# Run the fix
./fix-ec2-mongodb.sh
```

The script will automatically:
- ✅ Copy .env to backend directory
- ✅ Verify MongoDB credentials
- ✅ Rebuild the backend
- ✅ Restart your service (PM2/Docker/systemd)
- ✅ Test the API endpoint

### Step 6: Verify the Fix
```bash
# Test the API
curl http://localhost:5000/api/mongodb/clusters

# Should return JSON with cluster information
```

### Step 7: Check Admin Dashboard
1. Open your admin dashboard in browser
2. Navigate to MongoDB Atlas Cluster section
3. Should now show cluster information instead of error

## ✅ Success Indicators

You'll know it worked when you see:
- ✅ Script completes without errors
- ✅ API returns cluster data (not error message)
- ✅ Admin dashboard shows cluster name, version, state
- ✅ No errors in backend logs

## 🐛 If Something Goes Wrong

### Issue: Can't find project directory
```bash
# Search for it
find ~ -name "Business_talk" -type d 2>/dev/null
# OR
locate Business_talk
```

### Issue: Permission denied on script
```bash
# Fix permissions
chmod +x fix-ec2-mongodb.sh
```

### Issue: Git pull fails
```bash
# Check current branch
git branch

# Make sure you're on main
git checkout main

# Pull again
git pull origin main
```

### Issue: Script fails
```bash
# Run manual fix instead
cp .env backend/.env
cd backend
npm run build
pm2 restart backend  # or your restart command
```

### Issue: Still showing error after fix
```bash
# Check credentials are loaded
node verify-mongodb-credentials.js

# Check backend logs
pm2 logs backend --lines 50

# Completely restart backend
pm2 delete backend
pm2 start backend/dist/index.js --name backend
```

## 📞 Need More Help?

- **Detailed guide:** See `EC2_MONGODB_CLUSTER_FIX.md`
- **Checklist:** See `MONGODB_FIX_CHECKLIST.md`
- **Visual guide:** See `MONGODB_FIX_VISUAL_GUIDE.md`
- **All docs:** See `MONGODB_FIX_INDEX.md`

## 🔍 Quick Verification Commands

```bash
# Check if .env exists in backend
ls -la backend/.env

# Check if credentials are in the file
grep MONGO_PUBLIC_KEY backend/.env

# Check backend is running
pm2 list
# OR
docker ps
# OR
systemctl status business-talk-backend

# Test health endpoint
curl http://localhost:5000/api/health

# Test MongoDB clusters endpoint
curl http://localhost:5000/api/mongodb/clusters
```

## 📊 What You Should See

### Before Fix
```bash
$ curl http://localhost:5000/api/mongodb/clusters
{
  "message": "MongoDB Atlas credentials are not configured",
  "missing": {
    "publicKey": true,
    "privateKey": true,
    "projectId": true
  }
}
```

### After Fix
```bash
$ curl http://localhost:5000/api/mongodb/clusters
{
  "results": [
    {
      "name": "Cluster0",
      "mongoDBVersion": "8.0.3",
      "stateName": "IDLE",
      "connectionStrings": {...}
    }
  ],
  "totalCount": 1
}
```

## 🎯 Your MongoDB Atlas Credentials

These are already in your `backend/.env`:
```
MONGO_PUBLIC_KEY=kyrqqzvy
MONGO_PRIVATE_KEY=abe712c0-3510-4ff1-a14e-fd7ccf136b42
MONGO_PROJECT_ID=694a5e0e68931519b60fffac
```

## ⏱️ Timeline

- **Step 1-2:** 1 minute (push and SSH)
- **Step 3-4:** 30 seconds (navigate and pull)
- **Step 5:** 2-3 minutes (run fix script)
- **Step 6-7:** 30 seconds (verify)

**Total:** ~5 minutes

## 🎉 After Successful Deployment

Your admin dashboard will show:
```
✅ MongoDB Atlas Cluster
   Name: Cluster0
   Version: 8.0.3
   State: IDLE
   Region: AWS / US-EAST-1
   Tier: M0 (Free)
   Connection String: mongodb+srv://cluster0.qxps2vv.mongodb.net
```

---

**Created:** January 30, 2026
**Status:** Ready to Deploy
**Estimated Time:** 5 minutes
**Risk:** Low (backward compatible)

## 🚦 Ready to Deploy?

1. ✅ Changes committed locally
2. ⏳ Push to GitHub: `git push origin main`
3. ⏳ SSH to EC2 and run fix script
4. ⏳ Verify in admin dashboard

**Let's go!** 🚀
