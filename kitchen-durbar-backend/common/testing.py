import io

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image


def make_image(name='test.png'):
    """A tiny real PNG - ImageField validates uploads with Pillow."""
    buf = io.BytesIO()
    Image.new('RGB', (4, 4), (200, 150, 50)).save(buf, format='PNG')
    return SimpleUploadedFile(name, buf.getvalue(), content_type='image/png')


def make_user(email='user@example.com', staff=False):
    return get_user_model().objects.create_user(
        email=email, full_name='Test User', password='secret123', is_staff=staff, is_verified=True
    )
