from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.users.models import User
from apps.profiles.models import Profile

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates quick test users for immediate testing'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Creating test users...'))
        
        # Test users data
        test_users = [
            {
                'username': 'testadmin',
                'email': 'admin@test.com',
                'password': 'admin123',
                'first_name': 'Test',
                'last_name': 'Admin',
                'is_superuser': True,
                'is_staff': True
            },
            {
                'username': 'johnsmith',
                'email': 'john@test.com',
                'password': 'password123',
                'first_name': 'John',
                'last_name': 'Smith',
                'is_superuser': False,
                'is_staff': False
            },
            {
                'username': 'janesmith',
                'email': 'jane@test.com',
                'password': 'password123',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'is_superuser': False,
                'is_staff': False
            },
            {
                'username': 'mikebrown',
                'email': 'mike@test.com',
                'password': 'password123',
                'first_name': 'Mike',
                'last_name': 'Brown',
                'is_superuser': False,
                'is_staff': False
            }
        ]
        
        created_users = []
        
        for user_data in test_users:
            if not User.objects.filter(email=user_data['email']).exists():
                if user_data.get('is_superuser'):
                    user = User.objects.create_superuser(
                        username=user_data['username'],
                        email=user_data['email'],
                        password=user_data['password'],
                        first_name=user_data['first_name'],
                        last_name=user_data['last_name']
                    )
                else:
                    user = User.objects.create_user(
                        username=user_data['username'],
                        email=user_data['email'],
                        password=user_data['password'],
                        first_name=user_data['first_name'],
                        last_name=user_data['last_name'],
                        is_staff=user_data.get('is_staff', False)
                    )
                
                # Create basic profile
                Profile.objects.get_or_create(
                    user=user,
                    defaults={
                        'phone_number': '+1234567890',
                        'about_me': f"I'm {user_data['first_name']}, a test user for the car rental system.",
                        'country': 'US',
                        'city': 'New York',
                        'gender': 'M'
                    }
                )
                
                created_users.append(user)
                self.stdout.write(
                    self.style.SUCCESS(f'Created user: {user.email}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'User {user_data["email"]} already exists')
                )
        
        if created_users:
            self.stdout.write('\n' + '='*50)
            self.stdout.write(self.style.SUCCESS('TEST USER CREDENTIALS'))
            self.stdout.write('='*50)
            
            for user in created_users:
                if user.is_superuser:
                    self.stdout.write(f'\n🔐 ADMIN: {user.email} / admin123')
                else:
                    self.stdout.write(f'\n👤 USER: {user.email} / password123')
            
            self.stdout.write('\n' + '='*50)
            self.stdout.write('Admin URL: http://localhost:8000/admin/')
            self.stdout.write('API Login: http://localhost:8000/api/v1/auth/login/')
            self.stdout.write('='*50)
        else:
            self.stdout.write(
                self.style.WARNING('No new users were created')
            )
