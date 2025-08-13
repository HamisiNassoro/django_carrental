# Django Backend Deployment Guide

This guide will help you deploy your Django car rental backend online using different platforms.

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended - Free & Easy)

**Steps:**
1. **Sign up** at [railway.app](https://railway.app)
2. **Connect your GitHub repository**
3. **Add environment variables** in Railway dashboard:
   ```
   SECRET_KEY=your-secret-key-here
   ALLOWED_HOSTS=your-app-name.railway.app
   POSTGRES_DB=railway
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your-password
   POSTGRES_HOST=your-postgres-host
   POSTGRES_PORT=5432
   ```
4. **Deploy** - Railway will automatically detect the Dockerfile and deploy

**Your API will be available at:** `https://your-app-name.railway.app`

### Option 2: Render (Free Tier Available)

**Steps:**
1. **Sign up** at [render.com](https://render.com)
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Build Command:** `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - **Start Command:** `gunicorn car_rental.wsgi:application --bind 0.0.0.0:$PORT`
5. **Add environment variables** in Render dashboard
6. **Deploy**

### Option 3: Heroku (Paid)

**Steps:**
1. **Install Heroku CLI**
2. **Create Procfile:**
   ```
   web: gunicorn car_rental.wsgi:application --bind 0.0.0.0:$PORT
   ```
3. **Deploy:**
   ```bash
   heroku create your-app-name
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set ALLOWED_HOSTS=your-app-name.herokuapp.com
   git push heroku main
   ```

## 🔧 Environment Variables Setup

Create a `.env` file for local development or set these in your deployment platform:

```env
# Django Settings
SECRET_KEY=your-very-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,your-app-name.railway.app

# Database Settings
POSTGRES_DB=your_db_name
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_HOST=your_db_host
POSTGRES_PORT=5432

# Email Settings (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# JWT Settings
SIGNING_KEY=your-signing-key-here

# Redis Settings (Optional)
REDIS_URL=redis://localhost:6379/0
```

## 📁 Files Added for Deployment

1. **`Dockerfile`** - Production Docker configuration
2. **`railway.json`** - Railway deployment configuration
3. **`car_rental/settings/production.py`** - Production settings
4. **Updated `requirements.txt`** - Added gunicorn

## 🔍 Testing Your Deployed API

Once deployed, test these endpoints:

- **Health Check:** `GET https://your-domain.com/api/v1/auth/users/`
- **Register:** `POST https://your-domain.com/api/v1/auth/users/`
- **Login:** `POST https://your-domain.com/api/v1/auth/jwt/create/`

## 🔄 Update Frontend Configuration

After deployment, update your frontend axios configuration:

```javascript
// client/src/utils/axios.js
const api = axios.create({
  baseURL: "https://your-deployed-domain.com/api", // Update this
  headers: {
    "Content-Type": "application/json",
  },
});
```

## 🛠️ Local Development with Production Settings

To test production settings locally:

```bash
# Set environment variables
export DJANGO_SETTINGS_MODULE=car_rental.settings.production
export SECRET_KEY=your-secret-key
export ALLOWED_HOSTS=localhost,127.0.0.1

# Run with production settings
python manage.py runserver
```

## 🚨 Security Checklist

- [ ] Set `DEBUG=False` in production
- [ ] Use strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Use environment variables for sensitive data
- [ ] Set up proper database backups

## 📊 Monitoring

- **Railway:** Built-in monitoring and logs
- **Render:** Built-in monitoring dashboard
- **Heroku:** Use Heroku add-ons for monitoring

## 🔧 Troubleshooting

### Common Issues:

1. **Static files not loading:**
   ```bash
   python manage.py collectstatic --noinput
   ```

2. **Database migrations:**
   ```bash
   python manage.py migrate
   ```

3. **CORS errors:**
   - Update `CORS_ALLOWED_ORIGINS` in production settings
   - Add your frontend domain to the list

4. **Port issues:**
   - Use `$PORT` environment variable in production
   - Don't hardcode port numbers

## 📞 Support

- **Railway:** [docs.railway.app](https://docs.railway.app)
- **Render:** [render.com/docs](https://render.com/docs)
- **Heroku:** [devcenter.heroku.com](https://devcenter.heroku.com)

## 🎯 Recommended: Railway Deployment

Railway is recommended because:
- ✅ **Free tier available**
- ✅ **Automatic HTTPS**
- ✅ **Easy database setup**
- ✅ **GitHub integration**
- ✅ **Built-in monitoring**
- ✅ **Automatic deployments**

**Your API will be live in minutes!** 🚀