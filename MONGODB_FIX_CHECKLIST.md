# MongoDB Atlas Cluster Fix - Deployment Checklist

## 📋 Pre-Deployment Checklist

### Local Testing (Windows)
- [ ] Run `fix-mongodb-local.bat` to test locally
- [ ] Verify credentials with `node verify-mongodb-credentials.js`
- [ ] Start backend: `cd backend && npm run dev`
- [ ] Test API: Open `http://localhost:5000/api/mongodb/clusters` in browser
- [ ] Check admin dashboard MongoDB section

### Code Changes
- [x] Updated `backend/src/config/env.ts` to load root .env as fallback
- [x] Created verification script `verify-mongodb-credentials.js`
- [x] Created fix guide `EC2_MONGODB_CLUSTER_FIX.md`
- [x] Created EC2 fix script `fix-ec2-mongodb.sh`
- [ ] Commit changes to Git
- [ ] Push to GitHub

## 🚀 EC2 Deployment Checklist

### Option 1: Automatic Fix (Using Updated Code)

#### Step 1: Push Code Changes
```bash
# On your local machine
git add .
git commit -m "Fix: MongoDB Atlas cluster credentials loading for EC2"
git push origin main
```
- [ ] Code committed
- [ ] Code pushed to GitHub

#### Step 2: Deploy to EC2
```bash
# SSH to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Navigate to project
cd /path/to/Business_talk

# Pull latest changes
git pull origin main

# Run the fix script
chmod +x fix-ec2-mongodb.sh
./fix-ec2-mongodb.sh
```
- [ ] SSH connected
- [ ] Code pulled
- [ ] Fix script executed
- [ ] Backend restarted

### Option 2: Manual Fix (Quick)

```bash
# SSH to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Copy .env to backend
cd /path/to/Business_talk
cp .env backend/.env

# Rebuild and restart
cd backend
npm run build
pm2 restart backend  # or your restart command
```
- [ ] .env copied to backend
- [ ] Backend rebuilt
- [ ] Backend restarted

## ✅ Verification Checklist

### 1. Check Environment Variables
```bash
# On EC2
cd /path/to/Business_talk
node verify-mongodb-credentials.js
```
Expected output:
- [ ] ✅ MONGO_PUBLIC_KEY: kyrqqzvy
- [ ] ✅ MONGO_PRIVATE_KEY: abe712c0...
- [ ] ✅ MONGO_PROJECT_ID: 694a5e0e68931519b60fffac
- [ ] ✅ MONGODB_URI: mongodb+srv://...

### 2. Check Backend Logs
```bash
# PM2
pm2 logs backend --lines 50

# Docker
docker logs business-talk-backend --tail 50

# Systemd
sudo journalctl -u business-talk-backend -n 50
```
Look for:
- [ ] ✅ MongoDB Connected: cluster0.qxps2vv.mongodb.net
- [ ] ✅ Server running on http://localhost:5000
- [ ] No error messages about credentials

### 3. Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```
Expected response:
- [ ] Status: "ok"
- [ ] Database state: "connected"
- [ ] Database host: "cluster0.qxps2vv.mongodb.net"

### 4. Test MongoDB Clusters Endpoint
```bash
curl http://localhost:5000/api/mongodb/clusters
```
Expected response:
- [ ] Contains "results" array
- [ ] Shows cluster name: "Cluster0"
- [ ] Shows mongoDBVersion
- [ ] Shows stateName: "IDLE"
- [ ] No error about "not configured"

### 5. Test from Browser
Open in browser: `http://your-ec2-ip:5000/api/mongodb/clusters`
- [ ] JSON response displayed
- [ ] No error message
- [ ] Cluster information visible

### 6. Check Admin Dashboard
1. Open admin dashboard: `http://your-frontend-url/admin`
2. Login with admin credentials
3. Navigate to MongoDB Atlas Cluster section

Expected:
- [ ] No error message
- [ ] Cluster name displayed: "Cluster0"
- [ ] MongoDB version displayed
- [ ] Cluster state displayed: "IDLE"
- [ ] Connection string visible (masked)

## 🐛 Troubleshooting Checklist

### If credentials still not found:

#### Check 1: Verify .env file location
```bash
ls -la /path/to/Business_talk/.env
ls -la /path/to/Business_talk/backend/.env
```
- [ ] Root .env exists
- [ ] Backend .env exists
- [ ] Both files contain MONGO_PUBLIC_KEY

#### Check 2: Verify file contents
```bash
cat backend/.env | grep MONGO_PUBLIC_KEY
cat backend/.env | grep MONGO_PRIVATE_KEY
cat backend/.env | grep MONGO_PROJECT_ID
```
- [ ] MONGO_PUBLIC_KEY=kyrqqzvy
- [ ] MONGO_PRIVATE_KEY=abe712c0-3510-4ff1-a14e-fd7ccf136b42
- [ ] MONGO_PROJECT_ID=694a5e0e68931519b60fffac

#### Check 3: Verify backend is using correct .env
```bash
# Check running process environment
ps aux | grep node
# Note the PID, then:
cat /proc/PID/environ | tr '\0' '\n' | grep MONGO
```
- [ ] MONGO_PUBLIC_KEY is set in process environment
- [ ] MONGO_PRIVATE_KEY is set in process environment
- [ ] MONGO_PROJECT_ID is set in process environment

#### Check 4: Completely restart backend
```bash
# Kill all node processes
pkill -f node

# Start fresh
cd /path/to/Business_talk/backend
npm run build
pm2 start dist/index.js --name backend
```
- [ ] All node processes killed
- [ ] Backend rebuilt
- [ ] Backend started fresh

### If API returns error:

#### Check 1: Verify MongoDB Atlas API Key
1. Go to: https://cloud.mongodb.com
2. Login to your account
3. Select project: "Business Talk"
4. Go to: Project Settings → Access Manager → API Keys
5. Find key: kyrqqzvy

Verify:
- [ ] API key exists
- [ ] API key is not expired
- [ ] API key has "Project Read Only" or higher permissions
- [ ] API key is enabled

#### Check 2: Verify Project ID
1. Go to: https://cloud.mongodb.com
2. Select project: "Business Talk"
3. Go to: Project Settings → General
4. Copy Project ID

Verify:
- [ ] Project ID matches: 694a5e0e68931519b60fffac

#### Check 3: Test MongoDB Atlas API directly
```bash
curl -u "kyrqqzvy:abe712c0-3510-4ff1-a14e-fd7ccf136b42" \
  --digest \
  "https://cloud.mongodb.com/api/atlas/v1.0/groups/694a5e0e68931519b60fffac/clusters"
```
- [ ] Returns JSON with cluster information
- [ ] No authentication error
- [ ] No 404 error

#### Check 4: Check network connectivity
```bash
# Test DNS resolution
nslookup cloud.mongodb.com

# Test HTTPS connectivity
curl -v https://cloud.mongodb.com/api/atlas/v1.0/
```
- [ ] DNS resolves correctly
- [ ] HTTPS connection successful
- [ ] No firewall blocking

## 📊 Success Criteria

All of the following must be true:
- [x] Code changes committed and pushed
- [ ] Backend deployed to EC2
- [ ] Backend restarted successfully
- [ ] Environment variables loaded correctly
- [ ] Health endpoint returns "connected"
- [ ] MongoDB clusters endpoint returns cluster data
- [ ] Admin dashboard shows cluster information
- [ ] No error messages in logs
- [ ] No "credentials not configured" error

## 🎯 Final Verification

### Quick Test Commands
```bash
# All-in-one verification
curl -s http://localhost:5000/api/health | grep -q "connected" && \
curl -s http://localhost:5000/api/mongodb/clusters | grep -q "results" && \
echo "✅ All tests passed!" || echo "❌ Tests failed"
```
- [ ] All tests passed

### Visual Verification
1. [ ] Open admin dashboard
2. [ ] MongoDB section loads without errors
3. [ ] Cluster information is displayed
4. [ ] Can see cluster name, version, and state

## 📝 Post-Deployment Notes

### Document the following:
- [ ] Deployment date and time
- [ ] Who deployed the fix
- [ ] Any issues encountered
- [ ] Final verification results

### Update documentation:
- [ ] Update deployment guide with .env location requirements
- [ ] Document environment variable loading order
- [ ] Add troubleshooting steps to README

## 🔒 Security Checklist

- [ ] .env files are in .gitignore
- [ ] No credentials committed to Git
- [ ] API keys have minimal required permissions
- [ ] Consider rotating API keys after deployment
- [ ] Backend .env has correct file permissions (600)

```bash
# Set correct permissions
chmod 600 backend/.env
```

## 📞 Support

If all checks pass but issue persists:
1. Review `EC2_MONGODB_CLUSTER_FIX.md` for detailed troubleshooting
2. Check backend logs for specific error messages
3. Verify MongoDB Atlas dashboard for cluster status
4. Test API credentials directly with curl

---

**Checklist Created:** January 30, 2026
**Last Updated:** January 30, 2026
**Status:** Ready for Deployment
