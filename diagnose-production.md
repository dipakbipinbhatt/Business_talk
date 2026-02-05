# 🔍 PRODUCTION DIAGNOSIS - Site Not Loading

## What I See in Screenshot
- ✗ Home page stuck loading (gray boxes)
- ✗ "0 Scheduled" upcoming episodes
- ✗ No podcast cards visible
- ✗ Site: businesstalkwithdeepakbhatt.com

## Possible Causes

### 1. Backend API Not Responding
**Symptoms**: Gray loading boxes, no data
**Check**: Is backend server running?

```bash
# SSH to your server
ssh user@your-server-ip

# Check if backend is running
pm2 status
# OR
docker ps

# Check backend logs
pm2 logs backend --lines 50
# OR
docker logs backend-container-name
```

### 2. MongoDB Connection Issue
**Symptoms**: API returns empty data
**Check**: MongoDB Atlas connection

```bash
# Check backend logs for MongoDB errors
pm2 logs backend | grep -i mongo
# OR
docker logs backend | grep -i mongo
```

Look for errors like:
- "MongoDB connection failed"
- "Authentication failed"
- "Network timeout"

### 3. CORS Issue
**Symptoms**: API blocked by browser
**Check**: Browser console (F12)

Look for errors like:
- "CORS policy blocked"
- "Access-Control-Allow-Origin"

### 4. SSL Certificate Issue
**Symptoms**: Mixed content warnings
**Check**: Browser console (F12)

Look for:
- "Mixed Content" warnings
- "Blocked loading mixed active content"

### 5. API Endpoint Wrong
**Symptoms**: 404 errors
**Check**: Network tab in DevTools

Look for:
- Failed API requests
- 404 or 500 status codes

## IMMEDIATE FIX STEPS

### Step 1: Check Backend Status
```bash
ssh user@your-server-ip
pm2 status
```

**Expected output:**
```
┌─────┬──────────┬─────────┬─────────┐
│ id  │ name     │ status  │ restart │
├─────┼──────────┼─────────┼─────────┤
│ 0   │ backend  │ online  │ 0       │
│ 1   │ frontend │ online  │ 0       │
└─────┴──────────┴─────────┴─────────┘
```

**If backend is stopped:**
```bash
pm2 restart backend
pm2 logs backend
```

### Step 2: Check Backend Logs
```bash
pm2 logs backend --lines 100
```

**Look for:**
- ✓ "Server running on http://localhost:5000"
- ✓ "MongoDB Connected"
- ✗ Any error messages

### Step 3: Test API Directly
```bash
# Test from server
curl http://localhost:5000/api/podcasts?limit=10

# Test from browser
# Open: https://businesstalkwithdeepakbhatt.com/api/podcasts?limit=10
```

**Expected**: JSON with podcast data
**If error**: Check backend logs

### Step 4: Check MongoDB Connection
```bash
# In backend logs, look for:
grep -i "mongodb" /path/to/backend/logs
```

**If MongoDB connection failed:**
1. Check MongoDB Atlas is running
2. Check IP whitelist includes your server IP
3. Check credentials are correct

### Step 5: Check Environment Variables
```bash
cd /path/to/backend
cat .env | grep -i mongo
```

**Should have:**
```
MONGODB_URI=mongodb+srv://username:password@cluster...
```

## QUICK FIX (Most Common Issues)

### Issue 1: Backend Crashed
```bash
pm2 restart backend
pm2 save
```

### Issue 2: MongoDB Connection Lost
```bash
# Restart backend to reconnect
pm2 restart backend

# Check logs
pm2 logs backend --lines 50
```

### Issue 3: Port Conflict
```bash
# Check if port 5000 is in use
netstat -tulpn | grep 5000

# If blocked, kill the process
kill -9 <PID>

# Restart backend
pm2 restart backend
```

### Issue 4: Out of Memory
```bash
# Check memory usage
free -h

# Restart backend
pm2 restart backend
```

## BROWSER DEBUGGING

### Open Browser Console (F12)
1. Go to: https://businesstalkwithdeepakbhatt.com
2. Press F12
3. Go to Console tab
4. Look for errors

**Common errors:**
- "Failed to fetch" → Backend not responding
- "CORS policy" → CORS configuration issue
- "Mixed Content" → HTTP/HTTPS mismatch
- "404 Not Found" → API endpoint wrong

### Check Network Tab
1. Press F12
2. Go to Network tab
3. Reload page
4. Look for failed requests (red)

**Check:**
- `/api/podcasts` - Should return 200 OK
- Response should have JSON data
- If 404/500 → Backend issue
- If timeout → Backend not responding

## DEPLOYMENT STATUS CHECK

### Check if latest code is deployed
```bash
cd /path/to/Business_talk
git log --oneline -1
```

**Should show:**
```
9de8e15 Fix: Match AdminCalendar navigation to Dashboard
```

**If not:**
```bash
git pull origin main
cd backend
npm install
pm2 restart backend
```

## ROLLBACK (If Needed)

### If new code broke something
```bash
cd /path/to/Business_talk
git log --oneline -5  # Find working commit
git checkout <commit-hash>
pm2 restart all
```

## CONTACT SUPPORT INFO

**What to provide:**
1. Backend logs: `pm2 logs backend --lines 100`
2. Browser console errors (screenshot)
3. Network tab (screenshot of failed requests)
4. Server status: `pm2 status`
5. MongoDB connection status

## MOST LIKELY ISSUE

Based on the screenshot showing "0 Scheduled" and gray boxes:

**Backend is not responding or MongoDB connection is down.**

**Quick fix:**
```bash
ssh user@your-server-ip
pm2 restart backend
pm2 logs backend
```

Look for:
- ✓ "Server running on http://localhost:5000"
- ✓ "MongoDB Connected"

If you see these, the site should start working!
