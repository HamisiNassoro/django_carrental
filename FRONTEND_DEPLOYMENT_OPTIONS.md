# 🎨 Frontend Deployment Options

## Current Setup

- **Backend API**: Deployed on Render as `django-car-rental-api` (Docker service)
- **Frontend**: React app in `client/` directory - **NOT YET DEPLOYED**

## Option 1: Separate Services (Recommended) ✅

### How it works:
- **Backend**: `https://django-car-rental-api-bf1w.onrender.com` (already deployed)
- **Frontend**: `https://django-car-rental-frontend.onrender.com` (separate service)

### Advantages:
- ✅ Independent scaling
- ✅ Easier updates (frontend changes don't rebuild backend)
- ✅ Better separation of concerns
- ✅ Can use different deployment platforms (Vercel, Netlify, etc.)
- ✅ Smaller Docker images

### How to Deploy:

#### A. Using Render (Same Platform)

1. **Option A1: Add to render.yaml** (already added)
   - The `render.yaml` now includes a frontend service
   - Render will automatically deploy it when you push

2. **Option A2: Manual Static Site**
   - Go to Render Dashboard → "New +" → "Static Site"
   - Connect GitHub repo
   - Settings:
     - **Build Command**: `cd client && npm install && npm run build`
     - **Publish Directory**: `client/build`
   - Add environment variable:
     ```
     REACT_APP_API_URL=https://django-car-rental-api-bf1w.onrender.com
     ```

#### B. Using Vercel (Recommended for React)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. "New Project" → Import your repo
4. Settings:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Environment Variable:
   ```
   REACT_APP_API_URL=https://django-car-rental-api-bf1w.onrender.com
   ```

#### C. Using Netlify

1. Go to [netlify.com](https://netlify.com)
2. "New site from Git" → Select repo
3. Settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`
4. Environment Variable:
   ```
   REACT_APP_API_URL=https://django-car-rental-api-bf1w.onrender.com
   ```

### After Deployment:
- Frontend URL: `https://your-frontend-url.com`
- Backend URL: `https://django-car-rental-api-bf1w.onrender.com`
- Update CORS in `car_rental/settings/render.py` to allow frontend domain

---

## Option 2: Same Service (Serve Frontend from Django)

### How it works:
- Build React app and serve static files from Django
- Single URL: `https://django-car-rental-api-bf1w.onrender.com`
- Frontend at `/`, API at `/api/`

### Advantages:
- ✅ Single URL
- ✅ No CORS issues
- ✅ Simpler setup (one service)

### Disadvantages:
- ❌ Larger Docker image
- ❌ Slower builds (builds both frontend and backend)
- ❌ Less flexible

### How to Implement:

1. **Update Dockerfile.render** to build React app:
   ```dockerfile
   # ... existing backend setup ...
   
   # Build React app
   WORKDIR /app/client
   COPY client/package*.json ./
   RUN npm install
   COPY client/ ./
   RUN npm run build
   
   # Copy built files to Django static directory
   WORKDIR /app
   RUN cp -r client/build/* staticfiles/
   ```

2. **Update Django settings** to serve React app:
   ```python
   # In render.py
   STATICFILES_DIRS = [
       BASE_DIR / 'client' / 'build',
   ]
   ```

3. **Update URLs** to serve React for non-API routes:
   ```python
   from django.views.generic import TemplateView
   from django.conf import settings
   from django.conf.urls.static import static
   
   urlpatterns = [
       # API routes
       path('api/', ...),
       # Serve React app for all other routes
       path('', TemplateView.as_view(template_name='index.html')),
   ]
   ```

---

## 🎯 Recommendation

**Use Option 1 (Separate Services)** because:
1. Your current Render setup is optimized for backend only
2. Frontend deployment is simpler and faster
3. Better performance (CDN for static files)
4. Easier to update frontend without rebuilding backend
5. Can use specialized platforms (Vercel is excellent for React)

## 📝 Next Steps

1. **Choose Option 1** (recommended) or Option 2
2. **If Option 1**: Deploy frontend to Vercel/Netlify/Render Static Site
3. **Update CORS** in `car_rental/settings/render.py`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "https://your-frontend-url.vercel.app",
       # or
       "https://django-car-rental-frontend.onrender.com",
   ]
   ```
4. **Set environment variable** in frontend deployment:
   ```
   REACT_APP_API_URL=https://django-car-rental-api-bf1w.onrender.com
   ```

## 🔗 URLs After Deployment

- **Backend API**: `https://django-car-rental-api-bf1w.onrender.com`
- **Frontend**: `https://your-frontend-url.com` (separate service)
- **API Root**: `https://django-car-rental-api-bf1w.onrender.com/api/v1/`
- **Admin**: `https://django-car-rental-api-bf1w.onrender.com/admin/`

