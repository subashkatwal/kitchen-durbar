from django.contrib import admin

from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'created_at']
    list_filter = ['category']
    search_fields = ['name', 'description']
    list_editable = ['price']
    readonly_fields = ['id', 'icon', 'created_at']
