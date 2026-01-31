# Business Talk - Podcast & Blog Platform

A full-stack web application for managing and displaying podcast episodes and blog posts.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Dipak-bhatt
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configure environment variables**
```bash
# Backend: Create backend/.env
cp backend/.env.example backend/.env
# Add your MongoDB connection string and other credentials
```

4. **Run the application**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Admin Dashboard: http://localhost:5173/admin/dashboard

---

## 📁 Project Structure

```
Dipak-bhatt/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, upload, etc.
│   │   └── services/       # Email, external APIs
│   └── uploads/            # Temporary file uploads
│
├── frontend/               # React/Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API integration
│   │   ├── store/         # State management
│   │   └── styles/        # Global styles
│   └── public/            # Static assets
│
└── logo/                  # Brand assets
```

---

## 🎯 Features

### Public Website
- 🎙️ **Podcast Episodes** - Browse upcoming and past episodes
- 📝 **Blog Posts** - Read articles and insights
- 📅 **Calendar View** - See episodes by date
- 📧 **Contact Form** - Get in touch
- 🔍 **Search & Filter** - Find content easily
- 📱 **Responsive Design** - Works on all devices

### Admin Dashboard
- 📻 **Podcast Management** - Add, edit, delete episodes
- 📰 **Blog Management** - Create and manage blog posts
- 📥 **Inbox** - View contact form submissions
- 📊 **Analytics** - Track website performance
- ⚙️ **Settings** - Configure site settings
- 🗓️ **Calendar** - Manage episode schedule
- 📤 **Import** - Bulk import podcasts from JSON
- ℹ️ **About Us** - Edit about page content

---

## 🔐 Admin Access

**Default Admin Credentials:**
- Email: `admin@businesstalk.com`
- Password: Check your `.env` file or contact administrator

**Admin Features:**
- Full CRUD operations for podcasts and blogs
- Contact message management
- System health monitoring
- MongoDB Atlas cluster status
- Deployment management (Render integration)
- Episode loading configuration
- Google Analytics integration

---

## 📧 Contact Form & Inbox

### How It Works:
1. Users submit messages via the contact form
2. Messages are saved to MongoDB (`contactmessages` collection)
3. Admin can view all messages in the Inbox tab
4. Messages can be marked as read/archived or deleted
5. Unread count badge shows on Inbox tab

### Features:
- ✅ Real-time message storage
- ✅ Status tracking (unread/read/archived)
- ✅ Filter by status
- ✅ Statistics dashboard
- ✅ Email notifications (optional)

---

## 🖼️ Image Upload

### Specifications:
- **Max Resolution**: 1920x1920 pixels
- **Max File Size**: 10MB
- **Supported Formats**: JPEG, PNG, WebP
- **Compression**: Automatic (85% quality)
- **Storage**: Base64 in MongoDB

### Usage:
- Podcast thumbnails
- Guest headshots
- Blog featured images

---

## 🗄️ Database Schema

### Collections:
- `podcasts` - Podcast episodes
- `blogs` - Blog posts
- `contactmessages` - Contact form submissions
- `users` - Admin users
- `categories` - Content categories
- `aboutus` - About page content
- `sitesettings` - Site configuration

---

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Admin
ADMIN_EMAIL=admin@businesstalk.com
ADMIN_PASSWORD=your-password

# MongoDB Atlas API (optional)
MONGODB_ATLAS_PUBLIC_KEY=your-public-key
MONGODB_ATLAS_PRIVATE_KEY=your-private-key
MONGODB_ATLAS_PROJECT_ID=your-project-id

# Email (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Render (optional)
RENDER_API_KEY=your-render-api-key
```

### Frontend Environment Variables (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚢 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or for production
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment
See deployment guides:
- `EC2_DEPLOYMENT_GUIDE.md` - AWS EC2 deployment
- `DOCKER_README.md` - Docker deployment
- `RENDER_DEPLOY.md` - Render.com deployment

---

## 📚 API Documentation

### Public Endpoints
- `GET /api/podcasts` - Get all podcasts
- `GET /api/podcasts/:id` - Get single podcast
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/contact/submit` - Submit contact form

### Admin Endpoints (Requires Authentication)
- `POST /api/auth/login` - Admin login
- `POST /api/podcasts` - Create podcast
- `PUT /api/podcasts/:id` - Update podcast
- `DELETE /api/podcasts/:id` - Delete podcast
- `GET /api/contact/messages` - Get contact messages
- `GET /api/mongodb/clusters` - Get MongoDB cluster status

---

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev          # Start with hot reload
npm run build        # Build for production
npm start            # Run production build
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173 (frontend)
npx kill-port 5173

# Kill process on port 5000 (backend)
npx kill-port 5000
```

### MongoDB Connection Issues
- Check your MongoDB URI in `.env`
- Ensure IP whitelist includes your IP
- Verify database user credentials

### Image Upload Issues
- Check file size (max 10MB)
- Verify supported format (JPEG, PNG, WebP)
- Ensure uploads directory exists

---

## 📝 Recent Updates

### Latest Features (January 2026)
✅ Admin Inbox for contact form messages  
✅ Increased image upload size to 1920x1920px  
✅ Fixed admin panel shaking/animation issues  
✅ Enhanced contact page mailto functionality  
✅ Blog share functionality with social media  
✅ MongoDB Atlas cluster monitoring  
✅ Multi-guest podcast support  

---

## 📄 License

Private project - All rights reserved

---

## 👥 Support

For issues or questions:
- Email: hellomrbhatt@gmail.com
- Website: www.deepakbbhatt.com

---

## 🎉 Credits

Developed for Business Talk Podcast Platform
