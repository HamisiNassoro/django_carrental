# 🚗 Django Car Rental API with PostGIS

A comprehensive car rental platform built with Django REST Framework, featuring advanced location-based services powered by PostGIS.

## 🌟 Features

### Core Functionality
- **Car Management**: Create, update, delete, and list cars
- **User Authentication**: JWT-based authentication with Djoser
- **Booking System**: Complete booking workflow with status management
- **User Profiles**: Comprehensive user profiles with location tracking
- **Image Upload**: Multiple car photos support
- **Search & Filtering**: Advanced car search with multiple filters

### 🗺️ Location-Based Services (PostGIS)
- **Nearby Cars Discovery**: Find cars within specified radius
- **Advanced Location Search**: Search by coordinates with distance calculation
- **Real-time Location Updates**: Update car and user locations
- **Geospatial Queries**: Optimized spatial database queries
- **Distance Calculation**: Accurate distance calculations using PostGIS

### 🔧 Technical Features
- **PostGIS Integration**: Full geospatial database support
- **RESTful API**: Complete REST API with Django REST Framework
- **JWT Authentication**: Secure token-based authentication
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Static Files**: Production-ready static file serving with WhiteNoise
- **Security**: Production security settings and best practices

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- PostgreSQL with PostGIS extension
- Redis (optional, for background tasks)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd django_carrental
   ```

2. **Create virtual environment**
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up PostgreSQL with PostGIS**
   ```bash
   # Install PostgreSQL and PostGIS
   sudo apt-get install postgresql postgresql-contrib postgis postgresql-12-postgis-3
   
   # Create database
   sudo -u postgres psql
   CREATE DATABASE carrental_dev;
   CREATE EXTENSION postgis;
   \q
   ```

5. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

6. **Run migrations**
   ```bash
   python manage.py migrate
   ```

7. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

8. **Run development server**
   ```bash
   python manage.py runserver
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/users/` - User registration
- `POST /api/auth/jwt/create/` - Login (get JWT token)
- `POST /api/auth/jwt/refresh/` - Refresh JWT token

### Cars
- `GET /api/cars/` - List all cars
- `POST /api/cars/` - Create new car
- `GET /api/cars/{slug}/` - Get car details
- `PUT /api/cars/{slug}/` - Update car
- `DELETE /api/cars/{slug}/` - Delete car
- `GET /api/cars/nearby/` - Find nearby cars
- `GET /api/cars/advanced-search/` - Advanced car search
- `PATCH /api/cars/location/update/{slug}/` - Update car location

### Bookings
- `POST /api/bookings/` - Create booking
- `GET /api/bookings/me/` - My bookings
- `GET /api/bookings/owner/` - Owner bookings
- `GET /api/bookings/{id}/` - Booking details
- `POST /api/bookings/{id}/approve/` - Approve booking
- `POST /api/bookings/{id}/decline/` - Decline booking
- `POST /api/bookings/{id}/cancel/` - Cancel booking

### Users
- `GET /api/users/location/` - Get user location
- `PUT /api/users/location/update/` - Update user location
- `POST /api/users/location/set/` - Set user location
- `DELETE /api/users/location/clear/` - Clear user location

## 🗺️ Location-Based Features

### Nearby Cars Discovery
Find cars within a specified radius from your location:

```bash
GET /api/cars/nearby/?latitude=-1.2921&longitude=36.8219&radius=10
```

**Parameters:**
- `latitude`: Your latitude coordinate
- `longitude`: Your longitude coordinate  
- `radius`: Search radius in kilometers (default: 10)
- `car_type`: Filter by car type (optional)
- `min_price`: Minimum price filter (optional)
- `max_price`: Maximum price filter (optional)

### Advanced Search
Comprehensive car search with location support:

```bash
GET /api/cars/advanced-search/?search=nairobi&min_price=50&max_price=200&latitude=-1.2921&longitude=36.8219
```

**Parameters:**
- `search`: Text search in title, description, city
- `car_type`: Filter by car type
- `min_price`/`max_price`: Price range
- `min_seats`: Minimum number of seats
- `start_date`/`end_date`: Availability dates
- `latitude`/`longitude`: Location for distance calculation

### Location Updates
Update car or user locations:

```bash
# Update car location
PATCH /api/cars/location/update/{slug}/
{
    "latitude": -1.2921,
    "longitude": 36.8219,
    "current_location": "Nairobi CBD",
    "address": "Kenyatta Avenue, Nairobi"
}

# Update user location
PUT /api/users/location/update/
{
    "latitude": -1.2921,
    "longitude": 36.8219,
    "address": "My current address",
    "city": "Nairobi"
}
```

## 🚀 Deployment

### Render Deployment

This project is configured for easy deployment on Render with PostGIS support.

#### Files for Render:
- `render.yaml` - Render Blueprint configuration
- `requirements-render.txt` - Production dependencies
- `car_rental/settings/render.py` - Production settings
- `build.sh` - Build script
- `Procfile.render` - Process configuration
- `render.env.template` - Environment variables template

#### Deployment Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: Add PostGIS support and Render deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect GitHub repository
   - Use Blueprint option with `render.yaml`
   - Configure environment variables from `render.env.template`

3. **Database Setup**
   - Create PostgreSQL database on Render
   - Enable PostGIS extension
   - Run migrations: `python manage.py migrate`

#### Environment Variables:
```env
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-render-url.onrender.com
POSTGRES_DB=your-db-name
POSTGRES_USER=your-db-user
POSTGRES_PASSWORD=your-db-password
POSTGRES_HOST=your-db-host
POSTGRES_PORT=5432
```

## 🗄️ Database Schema

### PostGIS Integration
The project uses PostgreSQL with PostGIS extension for geospatial capabilities:

- **Car Model**: `PointField` for location storage
- **UserLocation Model**: `PointField` for user location tracking
- **Spatial Indexes**: Optimized for location-based queries
- **Distance Functions**: Native PostGIS distance calculations

### Key Models
- **Car**: Vehicle information with geospatial location
- **User**: Custom user model with authentication
- **UserLocation**: User location tracking with PostGIS
- **Booking**: Rental booking management
- **Profile**: Extended user profiles

## 🧪 Testing

### Sample Data
Create test data for development:

```bash
python manage.py populate_sample_data
```

### API Testing
Test the location-based endpoints:

```bash
# Test nearby cars
curl "http://localhost:8000/api/cars/nearby/?latitude=-1.2921&longitude=36.8219&radius=10"

# Test advanced search
curl "http://localhost:8000/api/cars/advanced-search/?min_price=50&max_price=200"

# Test location update
curl -X PATCH "http://localhost:8000/api/cars/location/update/test-car/" \
  -H "Content-Type: application/json" \
  -d '{"latitude": -1.2921, "longitude": 36.8219}'
```

## 🔧 Development

### Project Structure
```
django_carrental/
├── apps/
│   ├── cars/           # Car management
│   ├── users/          # User management
│   ├── bookings/       # Booking system
│   ├── profiles/       # User profiles
│   └── common/         # Shared utilities
├── car_rental/
│   ├── settings/       # Environment-specific settings
│   ├── urls.py         # Main URL configuration
│   └── wsgi.py         # WSGI configuration
├── requirements.txt    # Development dependencies
├── requirements-render.txt  # Production dependencies
└── render.yaml         # Render deployment config
```

### Settings
- `development.py` - Development settings with PostGIS
- `production.py` - Production settings
- `render.py` - Render-specific settings with PostGIS

## 📚 Dependencies

### Core
- Django 4.2+
- Django REST Framework
- PostgreSQL with PostGIS
- Django Countries
- Pillow (image handling)

### Authentication
- Djoser
- djangorestframework-simplejwt

### Geospatial
- PostGIS (PostgreSQL extension)
- django-geojson

### Production
- Gunicorn
- WhiteNoise
- python-decouple

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation
- Review the deployment guide in `RENDER_DEPLOYMENT.md`

---

**Built with ❤️ using Django, PostGIS, and modern web technologies**
