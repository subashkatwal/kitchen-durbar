import uuid

from django.db import models


class Enquiry(models.Model):
    """A quote request / contact message sent from the storefront's contact
    form (homepage and /contact). Staff triage them from Admin → Enquiries."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    company = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=30)
    email = models.EmailField()
    message = models.TextField(max_length=5000)
    is_handled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'enquiries'

    def __str__(self):
        return f'{self.name} <{self.email}>'
