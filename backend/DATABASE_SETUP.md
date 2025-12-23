# MongoDB Atlas Cloud Database Setup

## Quick Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account
1. Go to https://cloud.mongodb.com
2. Sign up for free (or login)

### Step 2: Create Free Cluster
1. Click **"Build a Database"**
2. Select **M0 FREE** tier
3. Choose provider (AWS/GCP/Azure) and region closest to you
4. Click **"Create Cluster"**

### Step 3: Create Database User
1. Go to **Security > Database Access**
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Set username: `businesstalk`
5. Set password: `YourSecurePassword123!`
6. Click **"Add User"**

### Step 4: Whitelist IP Address
1. Go to **Security > Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - Or add specific IPs for production
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go to **Database > Connect**
2. Click **"Connect your application"**
3. Select **Driver: Node.js**, Version: **6.0 or later**
4. Copy the connection string

### Step 6: Update .env
Edit `backend/.env`:
```
MONGODB_URI=mongodb+srv://businesstalk:YourSecurePassword123!@cluster0.xxxxx.mongodb.net/business-talk?retryWrites=true&w=majority
```

### Step 7: Seed the Database
```bash
cd backend
npm run seed
```

### Step 8: Start the Server
```bash
cd backend
npm run dev
```

---

## Verify Connection

When you start the server, you should see:
```
✅ MongoDB Connected: cluster0-shard-xxx.mongodb.net
🚀 Server running on port 5000
```

If you see `⚠️ MongoDB not available. Running in demo mode` then check:
1. Your connection string is correct
2. Username and password are correct
3. IP is whitelisted
4. Cluster is deployed

---

## CRUD Operations

After connection, all operations work:
- **Create**: Add new podcasts via Admin Dashboard
- **Read**: View podcasts on frontend
- **Update**: Edit existing podcasts
- **Delete**: Remove podcasts

Admin Login: `admin@businesstalk.com` / `Admin@123`
