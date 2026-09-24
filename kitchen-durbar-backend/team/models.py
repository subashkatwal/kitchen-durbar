import uuid

from django.db import models


class TeamMember(models.Model):
    """A staff profile shown in the storefront's "Our team" section (homepage
    and About page). `photo` goes through the same Cloudinary/local STORAGES
    config as Product.image (see settings.py)."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=150, help_text='Job title shown under the name, e.g. "Kitchen Planner".')
    bio = models.TextField(blank=True, help_text='Optional one or two lines about their experience.')
    photo = models.ImageField(upload_to='team/', blank=True, null=True)
    # Lower first - controls the order members appear on the site.
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True, help_text='Uncheck to hide this member from the website.')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', 'created_at']

    def __str__(self):
        return f'{self.name} ({self.role})'
