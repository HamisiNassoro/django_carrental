@echo off
echo 🚀 Django Car Rental Backend Deployment Script
echo ==============================================

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found!
    echo Please create a .env file with your environment variables.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
pip install -r requirements.txt

REM Run migrations
echo 🗄️ Running database migrations...
python manage.py migrate

REM Collect static files
echo 📁 Collecting static files...
python manage.py collectstatic --noinput

REM Create superuser if needed
echo 👤 Do you want to create a superuser? (y/n)
set /p create_superuser=
if /i "%create_superuser%"=="y" (
    python manage.py createsuperuser
)

echo ✅ Deployment setup complete!
echo.
echo 🌐 To deploy online:
echo 1. Push your code to GitHub
echo 2. Sign up at railway.app
echo 3. Connect your repository
echo 4. Add environment variables
echo 5. Deploy!
echo.
echo 📖 See DEPLOYMENT_GUIDE.md for detailed instructions
pause