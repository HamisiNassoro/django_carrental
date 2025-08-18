from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.users.models import User
from apps.cars.models import Car
from apps.bookings.models import Booking, BookingStatus
from apps.profiles.models import Profile
from django_countries import countries
import random
from datetime import date, timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates comprehensive sample data for testing the car rental system'

    def add_arguments(self, parser):
        parser.add_argument(
            '--users',
            type=int,
            default=10,
            help='Number of regular users to create (default: 10)'
        )
        parser.add_argument(
            '--cars',
            type=int,
            default=15,
            help='Number of cars to create (default: 15)'
        )
        parser.add_argument(
            '--bookings',
            type=int,
            default=25,
            help='Number of bookings to create (default: 25)'
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting sample data generation...'))
        
        # Create superuser if it doesn't exist
        self.create_superuser()
        
        # Create regular users
        users = self.create_users(options['users'])
        
        # Create cars
        cars = self.create_cars(options['cars'], users)
        
        # Create bookings
        self.create_bookings(options['bookings'], users, cars)
        
        self.stdout.write(self.style.SUCCESS('Sample data generation completed!'))
        self.display_credentials()

    def create_superuser(self):
        """Create a superuser for admin access"""
        if not User.objects.filter(is_superuser=True).exists():
            admin_user = User.objects.create_superuser(
                username='admin',
                email='admin@carrental.com',
                password='admin123',
                first_name='Admin',
                last_name='User'
            )
            self.stdout.write(
                self.style.SUCCESS(f'Created superuser: {admin_user.email}')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Superuser already exists')
            )

    def create_users(self, num_users):
        """Create regular users with profiles"""
        users = []
        first_names = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Emma', 'Alex', 'Maria']
        last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
        
        for i in range(num_users):
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            username = f"{first_name.lower()}{last_name.lower()}{i+1}"
            email = f"{username}@example.com"
            
            if not User.objects.filter(email=email).exists():
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password='password123',
                    first_name=first_name,
                    last_name=last_name,
                    is_active=True
                )
                
                # Create profile for the user
                Profile.objects.get_or_create(
                    user=user,
                    defaults={
                        'phone_number': f"+1{random.randint(1000000000, 9999999999)}",
                        'about_me': f"I'm {first_name}, a car enthusiast and frequent traveler.",
                        'country': random.choice(list(countries))[0],
                        'city': random.choice(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']),
                        'gender': random.choice(['M', 'F', 'O']),
                        'profile_photo': None
                    }
                )
                
                users.append(user)
                self.stdout.write(f'Created user: {user.email}')
        
        self.stdout.write(
            self.style.SUCCESS(f'Created {len(users)} users')
        )
        return users

    def create_cars(self, num_cars, users):
        """Create sample cars"""
        cars = []
        car_titles = [
            'Toyota Camry 2023', 'Honda Civic 2022', 'Ford Mustang 2023', 'BMW X5 2023',
            'Mercedes C-Class 2023', 'Audi A4 2023', 'Tesla Model 3 2023', 'Nissan Altima 2023',
            'Chevrolet Malibu 2023', 'Hyundai Sonata 2023', 'Kia K5 2023', 'Volkswagen Passat 2023',
            'Subaru Outback 2023', 'Mazda CX-5 2023', 'Lexus RX 2023'
        ]
        
        car_types = ['Sedan', 'Sports Utility Vehicle(SUV)', 'Hatchback', 'Luxury', 'Convertible', 'Van', 'Electric', 'Other']
        advert_types = ['For Sale', 'For Rent', 'Auction']
        countries = ['US', 'CA', 'UK', 'DE', 'FR', 'JP', 'AU']
        
        for i in range(num_cars):
            title = car_titles[i % len(car_titles)]
            owner = random.choice(users)
            
            car = Car.objects.create(
                user=owner,
                title=title,
                slug=f"{title.lower().replace(' ', '-')}-{i+1}",
                description=f"This is a beautiful {title} available for rent. Well maintained and ready for your journey.",
                country=random.choice(countries),
                city=random.choice(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']),
                car_type=random.choice(car_types),
                advert_type=random.choice(advert_types),
                price=random.randint(50, 200),
                car_number=f"ABC{random.randint(100, 999)}",
                total_seats=random.randint(2, 8),
                published_status=True
            )
            
            cars.append(car)
            self.stdout.write(f'Created car: {car.title}')
        
        self.stdout.write(
            self.style.SUCCESS(f'Created {len(cars)} cars')
        )
        return cars

    def create_bookings(self, num_bookings, users, cars):
        """Create sample bookings"""
        bookings = []
        statuses = [BookingStatus.PENDING, BookingStatus.APPROVED, BookingStatus.DECLINED, BookingStatus.CANCELLED]
        
        for i in range(num_bookings):
            car = random.choice(cars)
            renter = random.choice([u for u in users if u != car.user])  # Renter can't be car owner
            
            # Generate random dates
            start_date = date.today() + timedelta(days=random.randint(1, 30))
            end_date = start_date + timedelta(days=random.randint(1, 14))
            
            # Calculate total price
            num_days = (end_date - start_date).days + 1
            total_price = float(car.price) * num_days
            
            status = random.choice(statuses)
            
            booking = Booking.objects.create(
                car=car,
                renter=renter,
                start_date=start_date,
                end_date=end_date,
                total_price=total_price,
                status=status,
                notes=f"Sample booking #{i+1} for testing purposes."
            )
            
            bookings.append(booking)
            self.stdout.write(f'Created booking: {booking.car.title} -> {booking.renter.email}')
        
        self.stdout.write(
            self.style.SUCCESS(f'Created {len(bookings)} bookings')
        )
        return bookings

    def display_credentials(self):
        """Display login credentials for testing"""
        self.stdout.write('\n' + '='*50)
        self.stdout.write(self.style.SUCCESS('LOGIN CREDENTIALS FOR TESTING'))
        self.stdout.write('='*50)
        
        # Admin credentials
        self.stdout.write(self.style.SUCCESS('\n🔐 ADMIN USER:'))
        self.stdout.write('Email: admin@carrental.com')
        self.stdout.write('Password: admin123')
        self.stdout.write('URL: http://localhost:8000/admin/')
        
        # Sample regular user credentials
        regular_user = User.objects.filter(is_superuser=False).first()
        if regular_user:
            self.stdout.write(self.style.SUCCESS('\n👤 SAMPLE REGULAR USER:'))
            self.stdout.write(f'Email: {regular_user.email}')
            self.stdout.write('Password: password123')
            self.stdout.write('URL: http://localhost:8000/api/v1/auth/login/')
        
        self.stdout.write('\n' + '='*50)
        self.stdout.write(self.style.SUCCESS('Sample data includes:'))
        self.stdout.write('• Users with profiles')
        self.stdout.write('• Cars with different types and prices')
        self.stdout.write('• Bookings with various statuses')
        self.stdout.write('• All data accessible through Django admin')
        self.stdout.write('='*50)
