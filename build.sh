#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements-render.txt

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Create superuser if it doesn't exist
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@admin.com').exists():
    User.objects.create_superuser(
        email='admin@admin.com',
        username='admin',
        password='admin123'
    )
    print('Superuser created')
else:
    print('Superuser already exists')
"

