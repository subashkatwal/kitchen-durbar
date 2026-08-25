import uuid

from django.db import models


class Product(models.Model):
    class Category(models.TextChoices):
        BURNER = 'Burner', 'Burner'
        TABLE = 'Table', 'Table'
        RACK = 'Rack', 'Rack'
        SINK = 'Sink', 'Sink'
        SHOWCASE = 'Showcase', 'Showcase'
        CHILLER = 'Chiller', 'Chiller'
        FRYER = 'Fryer', 'Fryer'
        SHELVES = 'Shelves', 'Shelves'
        CHIMNEY = 'Chimney', 'Chimney'
        OTHERS = 'Others', 'Others'

    ICON_BY_CATEGORY = {
        Category.BURNER: 'burner',
        Category.TABLE: 'table',
        Category.RACK: 'rack',
        Category.SINK: 'sink',
        Category.SHOWCASE: 'showcase',
        Category.CHILLER: 'chiller',
        Category.FRYER: 'fryer',
        Category.SHELVES: 'shelves',
        Category.CHIMNEY: 'chimney',
        Category.OTHERS: 'others',
    }

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=Category.choices)
    icon = models.CharField(max_length=20, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.icon:
            self.icon = self.ICON_BY_CATEGORY.get(self.category, 'others')
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
