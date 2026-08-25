import random
import uuid
from datetime import timedelta

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user, authenticated by email. is_staff doubles as the 'admin' role."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    # Whether the email has been confirmed via OTP (signup verification) - or
    # was already confirmed by a trusted third party (Google Sign-In).
    is_verified = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        ordering = ['-date_joined']

    def __str__(self):
        return self.email

    @property
    def role(self):
        return 'admin' if self.is_staff else 'user'


def generate_otp_code():
    return f'{random.randint(0, 999999):06d}'


def default_otp_expiry():
    from django.conf import settings

    minutes = getattr(settings, 'OTP_EXPIRY_MINUTES', 10)
    return timezone.now() + timedelta(minutes=minutes)


class OTP(models.Model):
    """
    A one-time code emailed to `email`, used for two purposes:
    - signup: confirms the address after registration
    - reset: authorizes setting a new password (forgot password)

    Not tied to a User FK because a signup OTP is issued for an account that
    already exists by then anyway, and keeping it keyed by email lets the same
    request/verify endpoints serve both flows uniformly.
    """

    class Purpose(models.TextChoices):
        SIGNUP = 'signup', 'Signup verification'
        RESET = 'reset', 'Password reset'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField()
    purpose = models.CharField(max_length=10, choices=Purpose.choices)
    code = models.CharField(max_length=6, default=generate_otp_code)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=default_otp_expiry)

    class Meta:
        ordering = ['-created_at']

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at

    def __str__(self):
        return f'{self.email} ({self.purpose})'
