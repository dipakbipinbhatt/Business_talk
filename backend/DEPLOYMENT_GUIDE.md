# Backend Deployment Guide

This guide will help you deploy the Business Talk Backend API to various cloud platforms.

## 🚀 Quick Deployment Options

### Option 1: Render (Recommended - Free Tier Available)

1. **Create Account**: Go to [render.com](https://render.com) and sign up

2. **New Web Service**: Click "New +" → "Web Service"

3. **Connect Repository**: Connect your GitHub account and select `bussiness_talk_backend`

4. **Configure Service**:
   - **Name**: `business-talk-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

5. **Environment Variables**: Add these in Render dashboard:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   FRONTEND_URL=https://your-frontend-url.com
   ADMIN_EMAIL=admin@businesstalk.com
   ADMIN_PASSWORD=YourSecurePassword123!
   ```

6. **Deploy**: Click "Create Web Service"

7. **Your API will be available at**: `https://business-talk-backend.onrender.com`

---

### Option 2: Railway

1. **Create Account**: Go to [railway.app](https://railway.app)

2. **New Project**: Click "New Project" → "Deploy from GitHub repo"

3. **Select Repository**: Choose `bussiness_talk_backend`

4. **Add MongoDB**: Railway can provision MongoDB for you, or use MongoDB Atlas

5. **Environment Variables**: Add all variables from `.env.example`

6. **Settings**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

7. **Deploy**: Railway will auto-deploy

---

### Option 3: Heroku

1. **Install Heroku CLI**:
   ```bash
   # On Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   
   # On macOS
   brew tap heroku/brew && brew install heroku
   
   # On Linux
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create Heroku App**:
   ```bash
   cd backend
   heroku create business-talk-backend
   ```

4. **Add MongoDB**: 
   - Use MongoDB Atlas (recommended)
   - Or add Heroku MongoDB addon:
   ```bash
   heroku addons:create mongolab:sandbox
   ```

5. **Set Environment Variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_secret_here
   heroku config:set JWT_REFRESH_SECRET=your_refresh_secret_here
   heroku config:set FRONTEND_URL=https://your-frontend.com
   heroku config:set ADMIN_EMAIL=admin@businesstalk.com
   heroku config:set ADMIN_PASSWORD=YourSecurePassword123!
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   ```

6. **Deploy**:
   ```bash
   git push heroku main
   ```

7. **Open App**:
   ```bash
   heroku open
   ```

---

### Option 4: DigitalOcean App Platform

1. **Create Account**: Go to [digitalocean.com](https://www.digitalocean.com/)

2. **Create App**: Apps → Create App → GitHub

3. **Select Repository**: `bussiness_talk_backend`

4. **Configure**:
   - Type: Web Service
   - HTTP Port: 5000
   - Build Command: `npm install && npm run build`
   - Run Command: `npm start`

5. **Environment Variables**: Add all from `.env.example`

6. **Deploy**: Click "Create Resources"

---

## 🗄️ MongoDB Setup (Required for all platforms)

### Using MongoDB Atlas (Recommended)

1. **Create Account**: Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create Cluster**:
   - Choose FREE tier (M0)
   - Select region closest to your deployment
   - Create cluster

3. **Database Access**:
   - Add Database User
   - Choose password authentication
   - Save username and password

4. **Network Access**:
   - Add IP Address
   - Click "Allow Access from Anywhere" (for cloud deployments)
   - Or add your deployment platform's IP addresses

5. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `business-talk`

   Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/business-talk?retryWrites=true&w=majority`

6. **Use this as your `MONGODB_URI` environment variable**

---

## 🔐 Security Checklist

Before deploying to production, ensure:

- [ ] Change default admin password
- [ ] Use strong, random JWT secrets (32+ characters)
- [ ] Set up MongoDB Atlas with proper authentication
- [ ] Configure MongoDB Network Access properly
- [ ] Set FRONTEND_URL to your actual frontend domain
- [ ] Enable HTTPS (most platforms do this automatically)
- [ ] Review and update CORS settings
- [ ] Set NODE_ENV to "production"

### Generate Strong Secrets

Use these commands to generate secure random strings:

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Or use an online generator (ensure it's secure)
# https://randomkeygen.com/
```

---

## 📝 Post-Deployment Steps

1. **Verify Deployment**:
   ```bash
   curl https://your-backend-url.com/api/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Seed Database** (if needed):
   - Most platforms allow running one-time scripts
   - Or temporarily add the seed command to start script
   - Or connect via SSH and run `npm run seed`

3. **Update Frontend**:
   - Update your frontend's API base URL to point to the deployed backend
   - Update CORS settings if needed

4. **Test All Endpoints**:
   - Test authentication
   - Test file uploads
   - Test CRUD operations
   - Verify admin access

---

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (requires >= 18.0.0)
- Ensure all dependencies are in `dependencies`, not `devDependencies`
- Check build logs for specific errors

### Database Connection Fails
- Verify MongoDB URI is correct
- Check MongoDB Atlas network access settings
- Ensure database user has proper permissions

### CORS Errors
- Verify FRONTEND_URL environment variable
- Check CORS configuration in `src/index.ts`
- Ensure frontend is using HTTPS if backend is

### File Uploads Not Working
- Some platforms have ephemeral file systems
- Consider using cloud storage (AWS S3, Cloudinary, etc.)
- Or use MongoDB GridFS for file storage

### Port Issues
- Most platforms set `PORT` environment variable automatically
- Ensure your app uses `process.env.PORT`
- Default is 5000 if not set

---

## 📊 Monitoring & Logs

### View Logs

**Render**: Dashboard → Logs tab

**Railway**: Project → Deployments → Logs

**Heroku**: 
```bash
heroku logs --tail
```

**DigitalOcean**: App → Runtime Logs

### Health Check Endpoint

Use this endpoint for monitoring:
```
GET /api/health
```

Set up monitoring with:
- UptimeRobot
- Pingdom
- Built-in platform monitoring

---

## 🔄 Continuous Deployment

Most platforms support automatic deployment:

1. **Enable Auto-Deploy**: In your platform's dashboard
2. **Push to GitHub**: Any push to `main` branch will trigger deployment
3. **Review Deployment**: Check logs and test endpoints

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Heroku Documentation](https://devcenter.heroku.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [DigitalOcean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)

---

## 💡 Tips

1. **Free Tier Limitations**:
   - Render: Spins down after inactivity (cold starts)
   - Railway: $5/month credit, then paid
   - Heroku: No longer offers free tier
   - DigitalOcean: Starts at $5/month

2. **Cold Starts**: If using free tier, consider:
   - Using a ping service to keep it warm
   - Accepting initial slow response
   - Upgrading to paid tier for production

3. **Scaling**: Start with free/basic tier, upgrade as needed

4. **Backups**: Always backup your MongoDB database regularly

---

Need help? Check the main README.md or open an issue on GitHub!

