import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create a superuser from DJANGO_SUPERUSER_* env vars if one does not already exist.'

    def handle(self, *args, **options):
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
        full_name = os.environ.get('DJANGO_SUPERUSER_NAME', 'Admin')

        if not email or not password:
            self.stdout.write('DJANGO_SUPERUSER_EMAIL/PASSWORD not set - skipping superuser bootstrap.')
            return

        User = get_user_model()
        if User.objects.filter(email__iexact=email).exists():
            self.stdout.write(f'Superuser {email} already exists - skipping.')
            return

        User.objects.create_superuser(email=email, password=password, full_name=full_name)
        self.stdout.write(self.style.SUCCESS(f'Created superuser {email}.'))
