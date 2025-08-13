# Authentication System

This car rental application now includes a complete authentication system with login and registration functionality.

## Features Added

### Backend (Django)
- **User Model**: Custom user model with email as the primary login field
- **Authentication**: JWT-based authentication using Djoser and Simple JWT
- **Registration**: User registration with email, username, first name, last name, and password
- **Login**: Email-based login with JWT token generation
- **CORS**: Configured to allow frontend communication

### Frontend (React)
- **Login Component**: Complete login form with email and password
- **Register Component**: Registration form with all required fields
- **Authentication State Management**: Redux slice for managing auth state
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Header Integration**: Dynamic header showing login/register buttons or user info
- **Navigation**: Links between login and register pages

## API Endpoints

### Authentication Endpoints (via Djoser)
- `POST /api/v1/auth/users/` - User registration
- `POST /api/v1/auth/jwt/create/` - User login (get JWT token)
- `GET /api/v1/auth/users/me/` - Get current user info
- `POST /api/v1/auth/jwt/refresh/` - Refresh JWT token
- `POST /api/v1/auth/jwt/verify/` - Verify JWT token

## Usage

### Registration
1. Navigate to `/register`
2. Fill in all required fields:
   - Username
   - First Name
   - Last Name
   - Email
   - Password
   - Confirm Password
3. Submit the form
4. Upon successful registration, you'll be redirected to the home page

### Login
1. Navigate to `/login`
2. Enter your email and password
3. Submit the form
4. Upon successful login, you'll be redirected to the home page

### Logout
1. Click the "Logout" button in the header (only visible when logged in)
2. You'll be logged out and redirected to the home page

## Configuration

### Environment Variables
Make sure your `.env` file includes:
```
SECRET_KEY=your-secret-key
SIGNING_KEY=your-signing-key
DEBUG=True
ALLOWED_HOSTS=localhost 127.0.0.1
```

### CORS Settings
The backend is configured to allow requests from:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

## Security Features

- JWT tokens with configurable expiration
- Password validation
- CORS protection
- Automatic token refresh
- Secure password storage (hashed)

## File Structure

```
client/src/
├── components/
│   ├── Login.jsx          # Login component
│   ├── Register.jsx       # Register component (new)
│   └── Header.jsx         # Updated with auth UI
├── features/auth/
│   ├── authSlice.js       # Redux auth state management
│   └── authService.js     # API service for auth
└── utils/
    └── axios.js           # Axios configuration with auth

apps/users/
├── models.py              # Custom user model
└── serializers.py         # User serializers for API

car_rental/
├── urls.py               # Main URL configuration
└── settings/base.py      # Django settings with auth config
```

## Testing

To test the authentication system:

1. Start the backend: `docker-compose up api`
2. Start the frontend: `docker-compose up client`
3. Navigate to `http://localhost:3000`
4. Try registering a new user
5. Try logging in with the registered user
6. Check that the header shows the user's name when logged in
7. Try logging out

## Notes

- The authentication system uses email as the primary login field
- JWT tokens are stored in localStorage
- The system automatically handles token expiration and redirects to login
- All authentication state is managed through Redux
- The UI is responsive and user-friendly with proper error handling