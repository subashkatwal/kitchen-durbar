from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import OTP, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ['email']
    list_display = ['email', 'full_name', 'phone', 'is_staff', 'is_active', 'is_verified', 'date_joined']
    list_filter = ['is_staff', 'is_active', 'is_verified']
    search_fields = ['email', 'full_name', 'phone']
    readonly_fields = ['id', 'date_joined']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('full_name', 'phone')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('date_joined',)}),
        ('Identifier', {'fields': ('id',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'phone', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    """Read-only in the admin - codes are only ever created by the API, never hand-edited."""

    list_display = ['email', 'purpose', 'code', 'is_used', 'created_at', 'expires_at']
    list_filter = ['purpose', 'is_used']
    search_fields = ['email']
    readonly_fields = ['id', 'email', 'purpose', 'code', 'is_used', 'created_at', 'expires_at']

    def has_add_permission(self, request):
        return False
