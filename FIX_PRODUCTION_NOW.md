# 🚨 FIX PRODUCTION SITE NOW

## Your Issue
Site showing gray boxes, "0 Scheduled", not loading podcasts.

## Root Cause
**Your production server backend is either:**
1. Not running
2. MongoDB connection failed
3. Not deployed with latest code

## IMMEDIATE FIX - 3 Steps

### Step 1: Test Your API
Open this URL in browser:
```
https://businesstalkwithdeepakbhatt.com/api/podcasts?limit=10
```

**If you see JSON data** → Backend is working, go to Step 3
**If you see error/timeout** → Backend is down, go to Step 2

### Step 2: Restart Backend (If API Not Working)

**SSH to your server:**
```bash
ssh user@your-server-ip
```

**Check backend status:**
```bash
pm2 status
```

**If backend is stopped or errored:**
```bash
pm2 restart backend
pm2 logs backend --lines 50
```

**Look for these lines in logs:**
```
✅ Server running on http://localhost:5000
✅ MongoDB Connected
```

**If you see these, backend is working!**

### Step 3: Deploy Optimized Code

**On your server:**
```bash
cd /path/to/Business_talk
git pull origin main
cd backend
npm install
pm2 restart backend
```

**Wait 10 seconds, then test:**
```
https://businesstalkwithdeepakbhatt.com/api/podcasts?limit=0&compact=true
```

Should return JSON with 363 podcasts.

## DIAGNOSTIC TOOL

Upload `test-production-api.html` to your server and open it in browser:
```
https://businesstalkwithdeepakbhatt.com/test-production-api.html
```

Click "Run All Tests" to diagnose the issue.

## Common Issues & Fixes

### Issue 1: Backend Not Running
**Symptoms**: API returns timeout or connection refused
**Fix**:
```bash
pm2 restart backend
pm2 save
```

### Issue 2: MongoDB Connection Failed
**Symptoms**: API returns empty data or 500 error
**Fix**:
```bash
# Check MongoDB Atlas:
# 1. Is cluster running?
# 2. Is server IP whitelisted?
# 3. Are credentials correct?

# Restart backend to reconnect:
pm2 restart backend
```

### Issue 3: Port Conflict
**Symptoms**: Backend won't start, "EADDRINUSE" error
**Fix**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>

# Restart backend
pm2 restart backend
```

### Issue 4: Out of Memory
**Symptoms**: Backend crashes randomly
**Fix**:
```bash
# Check memory
free -h

# Increase PM2 memory limit
pm2 delete backend
pm2 start backend/src/index.ts --name backend --max-memory-restart 500M
pm2 save
```

### Issue 5: SSL Certificate Issue
**Symptoms**: Mixed content warnings in browser
**Fix**: Ensure all API calls use HTTPS, not HTTP

## VERIFY IT'S FIXED

### Test 1: API Responds
```bash
curl https://businesstalkwithdeepakbhatt.com/api/podcasts?limit=10
```

Should return JSON with podcast data.

### Test 2: Home Page Loads
Open: https://businesstalkwithdeepakbhatt.com

Should show:
- ✅ Upcoming podcast cards (not gray boxes)
- ✅ "X Scheduled" (not "0 Scheduled")
- ✅ Previous episodes section

### Test 3: Admin Calendar Loads
Open: https://businesstalkwithdeepakbhatt.com/admin/calendar

Should show:
- ✅ All 363 podcasts
- ✅ Episodes in calendar grid
- ✅ Console log: "📅 Admin Calendar loaded 363 podcasts"

## STILL NOT WORKING?

### Get Backend Logs
```bash
pm2 logs backend --lines 100 > backend-logs.txt
```

Send me `backend-logs.txt` to diagnose.

### Check Browser Console
1. Press F12
2. Go to Console tab
3. Look for errors
4. Screenshot and send

### Check Network Tab
1. Press F12
2. Go to Network tab
3. Reload page
4. Look for failed requests (red)
5. Screenshot and send

## EMERGENCY ROLLBACK

If new code broke something:
```bash
cd /path/to/Business_talk
git log --oneline -5
git checkout <previous-working-commit>
pm2 restart all
```

## MOST LIKELY FIX

**90% of the time, this fixes it:**
```bash
ssh user@your-server-ip
pm2 restart backend
pm2 logs backend
```

Look for:
```
✅ Server running on http://localhost:5000
✅ MongoDB Connected
```

If you see these, your site should work!

---

**Need help?** Send me:
1. Output of: `pm2 status`
2. Output of: `pm2 logs backend --lines 50`
3. Screenshot of browser console errors
