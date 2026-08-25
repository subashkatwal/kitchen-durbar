from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['id', 'product', 'product_name', 'price', 'quantity']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['id', 'user__email', 'user__full_name']
    list_editable = ['status']
    inlines = [OrderItemInline]
    readonly_fields = ['id', 'user', 'subtotal', 'shipping', 'total', 'created_at']
