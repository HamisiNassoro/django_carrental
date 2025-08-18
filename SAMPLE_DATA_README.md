# 🚗 Car Rental System - Sample Data Guide

This guide explains how to use the sample data for testing the Django admin interface and the car rental system.

## 📊 Sample Data Overview

The system now contains:
- **15 Users** (including admin users)
- **8 Cars** with different types and prices
- **12 Bookings** with various statuses

## 🔐 Login Credentials

### Admin Users (Django Admin Access)
```
Email: admin@test.com
Password: admin123

Email: admin@carrental.com  
Password: admin123
```

### Regular Users (API Access)
```
Email: john@test.com
Password: password123

Email: jane@test.com
Password: password123

Email: mike@test.com
Password: password123

Email: johnsmith@example.com
Password: password123

Email: janesmith@example.com
Password: password123

Email: mikebrown@example.com
Password: password123
```

## 🌐 Access URLs

### Django Admin Interface
- **Main Admin**: http://localhost:8000/admin/
- **Bookings Admin**: http://localhost:8000/admin/bookings/booking/
- **Cars Admin**: http://localhost:8000/admin/cars/car/
- **Users Admin**: http://localhost:8000/admin/users/user/

### API Endpoints
- **API Base**: http://localhost:8000/api/
- **Auth Login**: http://localhost:8000/api/v1/auth/login/
- **Bookings API**: http://localhost:8000/api/bookings/
- **Cars API**: http://localhost:8000/api/cars/

### Frontend
- **React App**: http://localhost:3000

## 🛠️ Management Commands

### Create Quick Test Users
```bash
docker-compose exec api python manage.py create_test_users
```

### Create Comprehensive Sample Data
```bash
# Create 10 users, 15 cars, 25 bookings (default)
docker-compose exec api python manage.py create_sample_data

# Create custom amounts
docker-compose exec api python manage.py create_sample_data --users 5 --cars 8 --bookings 12
```

### Reset Database (if needed)
```bash
docker-compose exec api python manage.py flush
docker-compose exec api python manage.py migrate
```

## 📋 What You Can Test

### 1. Django Admin Interface
- **Login** with admin credentials
- **Browse Users** - View all created users and their profiles
- **Browse Cars** - See different car types, prices, and details
- **Browse Bookings** - View booking statuses, dates, and relationships
- **Create/Edit/Delete** records
- **Filter and Search** through data

### 2. Booking Management
- **View all bookings** with status, dates, and pricing
- **Filter by status** (Pending, Approved, Declined, Cancelled)
- **Search by car title or renter name**
- **Edit booking details** and status
- **Create new bookings** manually

### 3. User Management
- **View user profiles** with contact information
- **Manage user permissions** and roles
- **Create new users** with different access levels

### 4. Car Management
- **Browse car inventory** with different types
- **View car details** including pricing and availability
- **Manage car listings** and status

## 🔍 Sample Data Features

### Cars Include:
- Different car types (Sedan, SUV, Hatchback, Luxury, etc.)
- Various price ranges ($50-$200)
- Different locations (US cities)
- Multiple advert types (For Sale, For Rent, Auction)

### Bookings Include:
- Various statuses (Pending, Approved, Declined, Cancelled)
- Different date ranges (future dates)
- Calculated pricing based on car price and duration
- Relationships between cars, renters, and owners

### Users Include:
- Regular users with profiles
- Admin users with different permission levels
- Complete profile information (phone, location, bio)

## 🚀 Getting Started

1. **Start the system**:
   ```bash
   docker-compose up
   ```

2. **Access admin interface**:
   - Go to http://localhost:8000/admin/
   - Login with admin credentials

3. **Explore the data**:
   - Navigate through different admin sections
   - Test filtering and search functionality
   - Create, edit, and delete records

4. **Test the API**:
   - Use regular user credentials to test API endpoints
   - Test booking creation and management

## 📝 Notes

- All sample data is created with realistic but fictional information
- Passwords are simple for testing purposes (change in production)
- Data includes relationships between models for comprehensive testing
- The system automatically calculates booking prices based on car rates and duration

## 🆘 Troubleshooting

If you encounter issues:
1. **Check container status**: `docker-compose ps`
2. **View logs**: `docker-compose logs api`
3. **Restart containers**: `docker-compose restart`
4. **Recreate sample data**: Run the management commands again

---

**Happy Testing! 🎉**


