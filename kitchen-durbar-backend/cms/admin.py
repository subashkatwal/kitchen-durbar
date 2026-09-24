from django.contrib import admin

from .models import Project, SiteImage, Testimonial


@admin.register(SiteImage)
class SiteImageAdmin(admin.ModelAdmin):
    list_display = ['key', 'alt_text', 'updated_at']
    readonly_fields = ['id', 'updated_at']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'sector', 'show_on_home', 'display_order', 'is_active', 'created_at']
    list_filter = ['is_active', 'show_on_home']
    search_fields = ['title', 'sector']
    list_editable = ['show_on_home', 'display_order', 'is_active']
    readonly_fields = ['id', 'created_at']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['source', 'display_order', 'is_active', 'created_at']
    list_filter = ['is_active']
    list_editable = ['display_order', 'is_active']
    readonly_fields = ['id', 'created_at']
