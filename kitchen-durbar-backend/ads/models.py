import uuid

from django.db import models
from django.utils import timezone


class Advertisement(models.Model):
    """An admin-managed ad. `position` picks where on the storefront it runs
    (see Position); several ads in the same banner placement rotate/sit side
    by side in `priority` order. `image` goes through the same Cloudinary/local
    STORAGES config as Product.image (see settings.py) - nothing ad-specific
    needed there."""

    class Position(models.TextChoices):
        HOME_TOP = 'home_top', 'Homepage - below the hero'
        HOME_BOTTOM = 'home_bottom', 'Homepage - above the contact section'
        PRODUCTS = 'products', 'Products page - above the catalogue'
        POPUP = 'popup', 'Popup - once per visit'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200, help_text='Short promotional message shown on the ad card.')
    # Deliberately not upload_to='ads/' - that path segment gets the image
    # blocked client-side by ad-blocker extensions (ERR_BLOCKED_BY_CLIENT),
    # since generic filter lists block any URL containing "/ads".
    image = models.ImageField(upload_to='promotions/')
    link_url = models.URLField(blank=True)
    position = models.CharField(max_length=20, choices=Position.choices, default=Position.HOME_TOP)
    is_active = models.BooleanField(default=True)
    # Optional scheduling window - blank start/end means "no bound" on that side.
    start_date = models.DateTimeField(null=True, blank=True, help_text='Leave blank to start showing immediately.')
    end_date = models.DateTimeField(null=True, blank=True, help_text='Leave blank to never expire.')
    # Lower first - display order within a placement, and which ad the popup picks.
    priority = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['priority', '-created_at']

    def __str__(self):
        return self.title

    def is_live(self) -> bool:
        """Active AND within its scheduling window, if any. Staff still see
        non-live ads in the admin panel (see AdvertisementViewSet.get_queryset)
        so a scheduled-but-not-yet-live ad can still be edited/previewed."""
        if not self.is_active:
            return False
        now = timezone.now()
        if self.start_date and now < self.start_date:
            return False
        if self.end_date and now > self.end_date:
            return False
        return True
