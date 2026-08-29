from django.contrib import admin

from .models import Advertisement


@admin.register(Advertisement)
class AdvertisementAdmin(admin.ModelAdmin):
    list_display = ['title', 'position', 'is_active', 'priority', 'start_date', 'end_date', 'created_at']
    list_filter = ['position', 'is_active']
    search_fields = ['title']
    list_editable = ['position', 'is_active', 'priority']
    readonly_fields = ['id', 'created_at']
    fields = [
        'title', 'image', 'link_url', 'position', 'is_active',
        'start_date', 'end_date', 'priority', 'id', 'created_at',
    ]
