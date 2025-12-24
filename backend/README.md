# Business Talk Backend API

Backend API for the Business Talk Podcast Platform - A comprehensive platform for managing podcasts, blogs, and content.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with refresh tokens
- **Podcast Management**: Create, read, update, and delete podcast episodes
- **Blog Management**: Full CRUD operations for blog posts
- **File Upload**: Support for audio and image uploads
- **Security**: Helmet, rate limiting, and CORS protection
- **MongoDB Database**: Mongoose ODM for data modeling

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/dipakbipinbhatt/bussiness_talk_backend.git
cd bussiness_talk_backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and configure your environment variables (see `.env.example`):
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
   - Set your MongoDB URI
   - Configure JWT secrets (use strong, random strings)
   - Set your frontend URL for CORS
   - Configure admin credentials

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:5000` with hot reload enabled.

### Production Mode
```bash
# Build the TypeScript code
npm run build

# Start the server
npm start
```

### Seeding Data
To seed the database with initial data (admin user and sample content):
```bash
npm run seed
```

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user (protected)

### Podcasts
- `GET /api/podcasts` - Get all podcasts (with pagination)
- `GET /api/podcasts/:id` - Get single podcast
- `POST /api/podcasts` - Create podcast (protected, admin only)
- `PUT /api/podcasts/:id` - Update podcast (protected, admin only)
- `DELETE /api/podcasts/:id` - Delete podcast (protected, admin only)

### Blogs
- `GET /api/blogs` - Get all blogs (with pagination)
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog (protected, admin only)
- `PUT /api/blogs/:id` - Update blog (protected, admin only)
- `DELETE /api/blogs/:id` - Delete blog (protected, admin only)

## 🔒 Security Features

- **Helmet**: Sets various HTTP headers for security
- **Rate Limiting**: Prevents brute force attacks (100 requests per 15 minutes)
- **CORS**: Configured for specific frontend origins
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (DB, environment)
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware (auth, upload)
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── index.ts         # Application entry point
│   └── seed.ts          # Database seeding script
├── uploads/             # Uploaded files directory
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore file
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── DATABASE_SETUP.md   # Database setup instructions
```

## 🌐 Deployment

### Render / Railway / Heroku

1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables in the platform dashboard
4. Configure build command: `npm run build`
5. Configure start command: `npm start`
6. Set Node version to >= 18.0.0

### Environment Variables for Production

Make sure to set all environment variables from `.env.example` in your deployment platform:
- Use a strong, random string for JWT secrets
- Use MongoDB Atlas for production database
- Set FRONTEND_URL to your deployed frontend URL
- Change admin credentials from defaults

## 📝 License

MIT License - see LICENSE file for details

## 👤 Author

Business Talk Team

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For support, email admin@businesstalk.com

