import uuid

from django.db import models


class SiteImage(models.Model):
    """
    One admin-replaceable photo slot on the storefront (page heroes, the
    homepage category tiles, ...). The frontend ships a default for every
    slot and uses the uploaded image instead whenever one exists here - so
    deleting a row simply reverts that slot to its default.
    """

    class Slot(models.TextChoices):
        HOME_HERO = 'home_hero', 'Home - hero'
        HOME_APPROACH = 'home_approach', 'Home - "Our approach"'
        ABOUT_HERO = 'about_hero', 'About - hero'
        ABOUT_PARTNER = 'about_partner', 'About - "A complete partner"'
        ABOUT_TEAM = 'about_team', 'About - team photo'
        SOLUTIONS_HERO = 'solutions_hero', 'Solutions - hero'
        PRODUCTS_HERO = 'products_hero', 'Products - hero'
        PROJECTS_HERO = 'projects_hero', 'Projects - hero'
        SERVICES_HERO = 'services_hero', 'Services - hero'
        CONTACT_HERO = 'contact_hero', 'Contact - hero'
        AUTH_PANEL = 'auth_panel', 'Login / register side panel'
        CATEGORY_BURNER = 'category_burner', 'Category tile - Burner'
        CATEGORY_TABLE = 'category_table', 'Category tile - Table'
        CATEGORY_RACK = 'category_rack', 'Category tile - Rack'
        CATEGORY_SINK = 'category_sink', 'Category tile - Sink'
        CATEGORY_SHOWCASE = 'category_showcase', 'Category tile - Showcase'
        CATEGORY_CHILLER = 'category_chiller', 'Category tile - Chiller'
        CATEGORY_FRYER = 'category_fryer', 'Category tile - Fryer'
        CATEGORY_SHELVES = 'category_shelves', 'Category tile - Shelves'
        CATEGORY_CHIMNEY = 'category_chimney', 'Category tile - Chimney'
        CATEGORY_OTHERS = 'category_others', 'Category tile - Others'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    key = models.CharField(max_length=40, choices=Slot.choices, unique=True)
    image = models.ImageField(upload_to='site/')
    alt_text = models.CharField(max_length=200, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['key']

    def __str__(self):
        return self.get_key_display()


class Project(models.Model):
    """A completed kitchen shown on /projects and the homepage's "Selected
    projects" grid. *_ne fields are optional Nepali translations - the
    frontend falls back to the English value when they're blank."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    title_ne = models.CharField(max_length=200, blank=True)
    sector = models.CharField(max_length=100, help_text='Short label, e.g. "Hotel", "Bakery", "Restaurant".')
    sector_ne = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='projects/')
    show_on_home = models.BooleanField(default=True, help_text='Include in the homepage "Selected projects" grid (first 4).')
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return self.title


class Testimonial(models.Model):
    """A client quote for the homepage "Client perspective" carousel."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quote = models.TextField(max_length=600)
    quote_ne = models.TextField(max_length=600, blank=True)
    source = models.CharField(max_length=200, help_text='Attribution, e.g. "Hotel client · Kathmandu".')
    source_ne = models.CharField(max_length=200, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return self.source
