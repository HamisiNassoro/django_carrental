#!/usr/bin/env bash

# Render Deployment Script for Django Car Rental API
echo "🚀 Starting Render deployment process..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Please run 'git init' first."
    exit 1
fi

# Check if files exist
required_files=("render.yaml" "requirements-render.txt" "build.sh" "car_rental/settings/render.py")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Required file missing: $file"
        exit 1
    fi
done

echo "✅ All required files present"

# Make build script executable
chmod +x build.sh
echo "✅ Build script made executable"

# Check if changes are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes detected. Committing them..."
    git add .
    git commit -m "feat: add Render deployment configuration

- Add render.yaml for multi-service deployment
- Add requirements-render.txt for production dependencies
- Add build.sh for deployment build process
- Add render.py settings for Render environment
- Add comprehensive deployment documentation"
    echo "✅ Changes committed"
else
    echo "✅ No uncommitted changes"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main
echo "✅ Pushed to GitHub"

echo ""
echo "🎉 Ready for Render deployment!"
echo ""
echo "Next steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' → 'Blueprint'"
echo "3. Connect your GitHub repository"
echo "4. Render will automatically detect render.yaml and deploy"
echo ""
echo "Or manually:"
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Use these settings:"
echo "   - Build Command: ./build.sh"
echo "   - Start Command: gunicorn car_rental.wsgi:application --bind 0.0.0.0:\$PORT"
echo "   - Environment: Python"
echo ""
echo "📚 See RENDER_DEPLOYMENT.md for detailed instructions"

