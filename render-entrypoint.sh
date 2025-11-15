#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

echo "Waiting for database connection..."
until python manage.py shell -c "from django.db import connections; connections['default'].cursor()"; do
    echo "Database unavailable, retrying in 2s..."
    sleep 2
done

python manage.py shell -c "from django.db import connection; cursor = connection.cursor(); cursor.execute('CREATE EXTENSION IF NOT EXISTS postgis');"
python manage.py migrate --noinput
python manage.py collectstatic --noinput

python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@admin.com').exists():
    User.objects.create_superuser(
        email='admin@admin.com',
        username='admin',
        password='admin123',
        first_name='Admin',
        last_name='User'
    )
    print('Superuser created')
else:
    print('Superuser already exists')
"

exec gunicorn car_rental.wsgi:application --bind 0.0.0.0:${PORT:-8000}

