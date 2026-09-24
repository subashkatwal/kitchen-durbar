from django.contrib import admin

from .models import TeamMember


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'display_order', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'role']
    list_editable = ['display_order', 'is_active']
    readonly_fields = ['id', 'created_at']
