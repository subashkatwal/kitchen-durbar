import logging
from email.utils import parseaddr

import requests
from django.conf import settings
from django.core.mail import send_mail

from .models import OTP

logger = logging.getLogger(__name__)

BREVO_SEND_URL = 'https://api.brevo.com/v3/smtp/email'


def _send_via_brevo(subject, message, recipient):
    """
    Sends through Brevo's HTTPS API instead of SMTP. Render's free plan
    blocks outbound SMTP ports (25/465/587), so on Render plain send_mail
    can never connect - an HTTPS call on port 443 is unaffected.
    """
    name, address = parseaddr(settings.DEFAULT_FROM_EMAIL)
    response = requests.post(
        BREVO_SEND_URL,
        headers={'api-key': settings.BREVO_API_KEY, 'accept': 'application/json'},
        json={
            'sender': {'name': name or 'Kitchen Durbar', 'email': address},
            'to': [{'email': recipient}],
            'subject': subject,
            'textContent': message,
        },
        timeout=settings.EMAIL_TIMEOUT,
    )
    response.raise_for_status()


def send_email(subject, message, recipient):
    """Brevo's HTTPS API when BREVO_API_KEY is set, otherwise EMAIL_BACKEND (SMTP/console)."""
    if getattr(settings, 'BREVO_API_KEY', ''):
        _send_via_brevo(subject, message, recipient)
    else:
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [recipient], fail_silently=False)


def send_otp_email(email, code, purpose):
    """
    Emails a one-time code. Returns True if it was sent, False if sending
    failed (logged) - callers decide whether that's fatal, so a mail outage
    can't turn into a 500 halfway through registration.

    With EMAIL_BACKEND left at its default (the console backend) and no
    BREVO_API_KEY, this just prints the email to the backend logs.
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
    try:
        send_email(subject, message, email)
    except Exception:  # noqa: BLE001 - logged; the caller reports it to the user
        logger.exception('Could not send %s OTP email to %s', purpose, email)
        return False
    return True
