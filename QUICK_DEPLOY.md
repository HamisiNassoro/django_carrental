# 🚀 Quick Deploy to Railway (5 Minutes)

## Step 1: Prepare Your Code
```bash
# Make sure all files are committed to Git
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Deploy to Railway
1. **Go to** [railway.app](https://railway.app)
2. **Sign up** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Click "Deploy"**

## Step 3: Add Environment Variables
In Railway dashboard, go to your project → Variables tab and add:

```env
SECRET_KEY=django-insecure-your-secret-key-here-change-this
ALLOWED_HOSTS=your-app-name.railway.app
DEBUG=False
POSTGRES_DB=railway
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_HOST=your-postgres-host
POSTGRES_PORT=5432
SIGNING_KEY=your-signing-key-here
```

## Step 4: Add Database
1. **In Railway dashboard, click "New"**
2. **Select "Database" → "PostgreSQL"**
3. **Connect it to your app**
4. **Copy the database variables to your app's environment variables**

## Step 5: Your API is Live! 🎉

Your Django backend will be available at:
**`https://your-app-name.railway.app`**

### Test Your API:
- **Health Check:** `https://your-app-name.railway.app/api/v1/auth/users/`
- **Admin Panel:** `https://your-app-name.railway.app/admin/`

## Step 6: Update Frontend
Update your React app's axios configuration:

```javascript
// client/src/utils/axios.js
const api = axios.create({
  baseURL: "https://your-app-name.railway.app/api", // Update this
  headers: {
    "Content-Type": "application/json",
  },
});
```

## 🎯 That's It!

Your Django backend is now online and accessible from anywhere in the world!

### Next Steps:
1. **Test the authentication endpoints**
2. **Deploy your React frontend** (Vercel, Netlify, etc.)
3. **Set up a custom domain** (optional)

### Need Help?
- Check the full `DEPLOYMENT_GUIDE.md` for detailed instructions
- Railway docs: [docs.railway.app](https://docs.railway.app)