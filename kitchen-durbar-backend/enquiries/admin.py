from django.contrib import admin

from .models import Enquiry


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ['name', 'company', 'phone', 'email', 'is_handled', 'created_at']
    list_filter = ['is_handled']
    search_fields = ['name', 'company', 'email', 'phone', 'message']
    list_editable = ['is_handled']
    readonly_fields = ['id', 'created_at']
