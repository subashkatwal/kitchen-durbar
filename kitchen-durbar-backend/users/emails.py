from django.conf import settings
from django.core.mail import send_mail

from .models import OTP


def send_otp_email(email, code, purpose):
    """
    Emails a one-time code. With EMAIL_BACKEND left at its default (the
    console backend), this just prints the email to the backend logs instead
    of actually sending it - handy until real SMTP credentials are set in
    .env (see EMAIL_* placeholders there).
    """
    if purpose == OTP.Purpose.SIGNUP:
        subject = 'Verify your Kitchen Durbar account'
        intro = 'Welcome! Use the code below to verify your email and activate your account.'
    else:
        subject = 'Reset your Kitchen Durbar password'
        intro = 'Use the code below to reset your password.'

    minutes = getattr(settings, 'OTP_EXPIRY_MINUTES', 10)
    message = (
        f'{intro}\n\n'
        f'Your verification code is: {code}\n\n'
        f'This code expires in {minutes} minutes. '
        f"If you didn't request this, you can safely ignore this email."
    )
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=False)
