from django.core.management.base import BaseCommand
from apps.users.models import User


class Command(BaseCommand):
    help = 'Creates a test user for authentication testing'

    def handle(self, *args, **options):
        # Check if test user already exists
        if User.objects.filter(email='test@example.com').exists():
            self.stdout.write(
                self.style.WARNING('Test user already exists')
            )
            return

        # Create test user
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created test user: {user.email}'
            )
        )
        self.stdout.write(
            self.style.SUCCESS(
                'Login credentials: test@example.com / testpass123'
            )
        )