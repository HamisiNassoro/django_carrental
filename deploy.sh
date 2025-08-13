#!/bin/bash

echo "🚀 Django Car Rental Backend Deployment Script"
echo "=============================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file with your environment variables."
    exit 1
fi

# Generate secret key if not set
if ! grep -q "SECRET_KEY" .env; then
    echo "🔑 Generating SECRET_KEY..."
    SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(50))")
    echo "SECRET_KEY=$SECRET_KEY" >> .env
    echo "✅ SECRET_KEY generated and added to .env"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Run migrations
echo "🗄️ Running database migrations..."
python manage.py migrate

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# Create superuser if needed
echo "👤 Do you want to create a superuser? (y/n)"
read -r create_superuser
if [ "$create_superuser" = "y" ]; then
    python manage.py createsuperuser
fi

echo "✅ Deployment setup complete!"
echo ""
echo "🌐 To deploy online:"
echo "1. Push your code to GitHub"
echo "2. Sign up at railway.app"
echo "3. Connect your repository"
echo "4. Add environment variables"
echo "5. Deploy!"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"