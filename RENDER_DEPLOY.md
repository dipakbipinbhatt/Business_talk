# Deploy Business Talk to Render

## Quick Deployment Guide

### Prerequisites
- GitHub account with repo pushed
- [MongoDB Atlas](https://cloud.mongodb.com) account (free tier works)
- [Render](https://render.com) account

---

## Step 1: Setup MongoDB Atlas

1. Create free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create database user (username + password)
3. Network Access → Add IP: `0.0.0.0/0` (allow all)
4. Get connection string (click Connect → Drivers):
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/business-talk
   ```

---

## Step 2: Deploy Backend (Web Service)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   | Setting | Value |
   |---------|-------|
   | Name | `business-talk-api` |
   | Root Directory | `backend` |
   | Runtime | Node |
   | Build Command | `npm install && npm run build` |
   | Start Command | `npm start` |

5. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | Your MongoDB connection string |
   | `JWT_SECRET` | `your-super-secret-jwt-key-change-this` |
   | `JWT_REFRESH_SECRET` | `your-refresh-secret-change-this` |
   | `JWT_EXPIRES_IN` | `15m` |
   | `JWT_REFRESH_EXPIRES_IN` | `7d` |
   | `NODE_ENV` | `production` |
   | `ADMIN_EMAIL` | `admin@businesstalk.com` |
   | `ADMIN_PASSWORD` | `Admin@123` (change this!) |
   | `FRONTEND_URL` | (add after frontend deploy) |

6. Click **Create Web Service**
7. Wait for deploy, note the URL: `https://business-talk-api.onrender.com`

---

## Step 3: Seed Database

1. Go to your backend service on Render
2. Click **Shell** tab
3. Run: `npm run seed`
4. Verify: `Created 10 sample podcasts` message

---

## Step 4: Deploy Frontend (Static Site)

1. Click **New** → **Static Site**
2. Connect same GitHub repo
3. Configure:
   | Setting | Value |
   |---------|-------|
   | Name | `business-talk` |
   | Root Directory | `frontend` |
   | Build Command | `npm install && npm run build` |
   | Publish Directory | `dist` |

4. Add **Environment Variable**:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://business-talk-api.onrender.com/api` |

5. Click **Create Static Site**

---

## Step 5: Update Backend CORS

1. Go back to backend Web Service → Environment
2. Add/Update: `FRONTEND_URL` = `https://business-talk.onrender.com`
3. Redeploy backend

---

## Verify Deployment

1. **Backend Health**: Visit `https://your-backend.onrender.com/api/health`
   - Should return: `{"status":"ok"}`

2. **Frontend**: Visit `https://your-frontend.onrender.com`
   - Home page should load with podcasts

3. **Admin Login**: Go to `/admin/login`
   - Email: `admin@businesstalk.com`
   - Password: Your ADMIN_PASSWORD

---

## Troubleshooting

### Podcasts not showing?
- Check backend is running (health endpoint)
- Verify `VITE_API_URL` is correct
- Run seed command again

### CORS errors?
- Ensure `FRONTEND_URL` is set correctly on backend
- Redeploy backend after changing

### Build fails?
- Check Render logs for specific errors
- Ensure all dependencies are in package.json

---

## URLs Summary

| Service | URL Pattern |
|---------|-------------|
| Backend | `https://business-talk-api.onrender.com` |
| Frontend | `https://business-talk.onrender.com` |
| API Health | `https://business-talk-api.onrender.com/api/health` |
| Admin | `https://business-talk.onrender.com/admin/login` |
