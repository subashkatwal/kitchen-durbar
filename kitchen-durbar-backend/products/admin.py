from django.contrib import admin

from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'is_featured', 'created_at']
    list_filter = ['category', 'is_featured']
    search_fields = ['name', 'description']
    list_editable = ['price', 'is_featured']
    readonly_fields = ['id', 'icon', 'created_at']
    fields = ['name', 'category', 'price', 'description', 'image', 'is_featured', 'id', 'icon', 'created_at']
