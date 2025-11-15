# 🎨 Frontend Deployment Guide

The frontend React application is located in the `client/` directory and needs to be deployed separately from the backend API.

## 📍 Current Setup

- **Frontend Location**: `/client/` directory
- **Backend API**: Deployed on Render at `https://django-car-rental-api-bf1w.onrender.com`
- **Axios Base URL**: Currently set to `/api` (relative path)

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Free & Easy)

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy from GitHub**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Set **Root Directory** to `client`
   - Set **Build Command** to `npm run build`
   - Set **Output Directory** to `build`
   - Add environment variable:
     ```
     REACT_APP_API_URL=https://django-car-rental-api-bf1w.onrender.com
     ```

3. **Update axios.js** to use the environment variable:
   ```javascript
   const api = axios.create({
     baseURL: process.env.REACT_APP_API_URL || "/api",
     headers: {
       "Content-Type": "application/json",
     },
   });
   ```

### Option 2: Netlify (Free)

1. **Deploy from GitHub**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "New site from Git"
   - Select your repository
   - Configure build settings:
     - **Base directory**: `client`
     - **Build command**: `npm run build`
     - **Publish directory**: `client/build`
   - Add environment variable:
     ```
     REACT_APP_API_URL=https://django-car-rental-api-bf1w.onrender.com
     ```

### Option 3: Render (Same Platform as Backend)

1. **Create Static Site**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `django-car-rental-frontend`
     - **Build Command**: `cd client && npm install && npm run build`
     - **Publish Directory**: `client/build`
   - Add environment variable:
     ```
     REACT_APP_API_URL=https://django-car-rental-api-bf1w.onrender.com
     ```

## 🔧 Update Frontend Configuration

After deploying, update `client/src/utils/axios.js` to use the environment variable:

```javascript
import axios from "axios";

// Get API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || "/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ... rest of the code
```

## 🔐 CORS Configuration

Make sure your backend CORS settings allow your frontend domain. Update `car_rental/settings/render.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.vercel.app",  # Vercel
    "https://your-frontend-domain.netlify.app",  # Netlify
    "https://your-frontend-domain.onrender.com",  # Render
]
```

Or for development:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Local development
]
```

## 📝 Environment Variables

Create a `.env` file in the `client/` directory for local development:

```env
REACT_APP_API_URL=http://localhost:8000
```

For production, set the environment variable in your deployment platform:
```
REACT_APP_API_URL=https://django-car-rental-api-bf1w.onrender.com
```

## ✅ Testing

After deployment:

1. **Check Frontend URL**: Visit your deployed frontend URL
2. **Test API Connection**: Try logging in or fetching cars
3. **Check Browser Console**: Look for any CORS or API errors
4. **Verify API Calls**: Use browser DevTools Network tab to verify API requests

## 🎯 Quick Deploy Commands

### Vercel (from project root):
```bash
cd client
vercel
```

### Netlify (from project root):
```bash
cd client
netlify deploy --prod
```

## 📚 Additional Resources

- [Vercel Deployment Guide](https://vercel.com/docs)
- [Netlify Deployment Guide](https://docs.netlify.com)
- [Render Static Sites](https://render.com/docs/static-sites)

