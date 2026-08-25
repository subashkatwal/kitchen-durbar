import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = (
        'Create the superuser from DJANGO_SUPERUSER_* env vars, or - if it already '
        'exists - reset its password to match DJANGO_SUPERUSER_PASSWORD. Runs on every '
        'container start (see entrypoint.sh), so the env var is always the source of '
        "truth for the admin password: change it in Render's dashboard and redeploy "
        "to reset a forgotten one, instead of needing to go dig up a generated value."
    )

    def handle(self, *args, **options):
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
        full_name = os.environ.get('DJANGO_SUPERUSER_NAME', 'Admin')

        if not email or not password:
            self.stdout.write('DJANGO_SUPERUSER_EMAIL/PASSWORD not set - skipping superuser bootstrap.')
            return

        User = get_user_model()
        user = User.objects.filter(email__iexact=email).first()

        if user is None:
            User.objects.create_superuser(email=email, password=password, full_name=full_name)
            self.stdout.write(self.style.SUCCESS(f'Created superuser {email}.'))
            return

        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save(update_fields=['password', 'is_staff', 'is_superuser', 'is_active'])
        self.stdout.write(self.style.SUCCESS(f'Superuser {email} already existed - password reset to match DJANGO_SUPERUSER_PASSWORD.'))
