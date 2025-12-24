# Business Talk Frontend

React + TypeScript + Vite frontend for the Business Talk Podcast Platform.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.production
   ```

2. Update `.env.production` with your deployed backend URL:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

### Development

Run the development server (uses proxy to localhost:5000):

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable components
│   │   ├── layout/      # Layout components (Navbar, Footer, etc.)
│   │   └── podcast/     # Podcast-specific components
│   ├── pages/           # Page components
│   │   ├── Admin/       # Admin dashboard pages
│   │   ├── Home.tsx
│   │   ├── Blog.tsx
│   │   ├── Podcasts.tsx
│   │   └── ...
│   ├── services/        # API services
│   │   └── api.ts       # API client and endpoints
│   ├── store/           # Zustand state management
│   │   └── useStore.ts
│   ├── styles/          # Global styles
│   │   └── index.css
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/
│   └── _redirects       # Netlify/Vercel redirects
├── .env.example         # Environment variables template
├── .env.development     # Development environment
├── .env.production      # Production environment
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json
```

## 🌐 Deployment

### Option 1: Netlify (Recommended)

1. **Connect Repository**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

3. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

4. **Deploy**: Netlify will auto-deploy on push to main

### Option 2: Vercel

1. **Import Project**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Project**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

4. **Deploy**: Click "Deploy"

### Option 3: GitHub Pages

1. **Update `vite.config.ts`**:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   });
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   cd dist
   git init
   git add -A
   git commit -m "Deploy"
   git push -f https://github.com/username/repo.git main:gh-pages
   ```

### Option 4: Render Static Site

1. **Create Static Site**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure**:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

3. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

## 🔧 Configuration

### API Connection

The frontend connects to the backend API using the `VITE_API_URL` environment variable:

- **Development**: Uses Vite proxy (configured in `vite.config.ts`) to `http://localhost:5000`
- **Production**: Uses the URL set in `.env.production`

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-backend.onrender.com/api` |

## 🎨 Features

- **Home Page**: Landing page with hero section and featured content
- **Podcasts**: Browse upcoming and past podcast episodes
- **Blog**: Read articles and blog posts
- **About Us**: Information about the platform
- **Contact**: Contact form
- **Admin Dashboard**: 
  - Login/Authentication
  - Manage podcasts (CRUD)
  - Manage blogs (CRUD)
  - Analytics and stats

## 🔐 Admin Access

Default admin credentials (change in backend `.env`):
- Email: `admin@businesstalk.com`
- Password: Set in backend `ADMIN_PASSWORD`

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Routing

## 📦 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
```

## 🐛 Troubleshooting

### CORS Errors

If you see CORS errors:
1. Ensure backend `FRONTEND_URL` env variable includes your frontend URL
2. Check backend CORS configuration in `backend/src/index.ts`

### API Connection Issues

1. Verify `VITE_API_URL` is set correctly
2. Check backend is running and accessible
3. Test backend health endpoint: `https://your-backend.com/api/health`

### Build Fails

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check Node.js version (must be >= 18.0.0)

## 📝 License

MIT License

## 👤 Author

Business Talk Team

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

