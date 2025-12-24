# Frontend Setup Guide

## 🎯 Connect Frontend to Deployed Backend

### Step 1: Get Your Backend URL

Your backend is deployed on Render. The URL should look like:
```
https://business-talk-backend-XXXX.onrender.com
```

You can find it in your Render dashboard → your service → URL at the top.

### Step 2: Update Environment Variables

Open `.env.production` and replace the placeholder with your actual backend URL:

```env
VITE_API_URL=https://your-actual-backend-url.onrender.com/api
```

**Important**: Make sure to include `/api` at the end!

### Step 3: Test Locally (Optional)

Before deploying, you can test the production build locally:

```bash
# Build with production environment
npm run build

# Preview the build
npm run preview
```

Open `http://localhost:4173` and verify everything works.

### Step 4: Deploy Your Frontend

Choose one of these platforms:

#### Option A: Netlify (Easiest)

1. Go to [netlify.com](https://app.netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Add environment variable":
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api`
6. Click "Deploy site"

Your frontend will be live in 2-3 minutes!

#### Option B: Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api`
6. Click "Deploy"

#### Option C: Render Static Site

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
5. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api`
6. Create static site

## ✅ Verify Deployment

After deployment, test these pages:

1. **Home Page**: Should load without errors
2. **Podcasts**: Should show podcasts from backend
3. **Blog**: Should show blog posts from backend
4. **Admin Login**: 
   - Go to `/admin/login`
   - Login with your admin credentials
   - Should redirect to dashboard

## 🔧 Update Backend CORS

Don't forget to update your backend's `FRONTEND_URL` environment variable on Render:

1. Go to Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Update or add:
   ```
   FRONTEND_URL=https://your-frontend-url.netlify.app
   ```
5. Save changes (backend will redeploy)

## 🎉 You're Done!

Your full-stack Business Talk platform is now live!

- **Frontend**: `https://your-frontend-url.com`
- **Backend**: `https://your-backend-url.onrender.com`
- **Admin**: `https://your-frontend-url.com/admin/login`

## 📊 Next Steps

1. **Create content**: Login to admin and add podcasts and blogs
2. **Share**: Share your platform URL with your audience
3. **Monitor**: Check Render dashboard for backend logs
4. **Backup**: Regularly backup your MongoDB database

## ⚠️ Important Notes

- Backend on free Render tier spins down after inactivity (may take 30-60s to wake up)
- First request after inactivity will be slow
- Consider upgrading to paid tier for production use

## 🆘 Need Help?

If something doesn't work:

1. Check browser console for errors (F12)
2. Verify environment variables are set correctly
3. Test backend health endpoint: `https://your-backend.com/api/health`
4. Check Render backend logs for errors

