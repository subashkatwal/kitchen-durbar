from rest_framework import serializers

from .models import Project, SiteImage, Testimonial


class SiteImageSerializer(serializers.ModelSerializer):
    label = serializers.CharField(source='get_key_display', read_only=True)

    class Meta:
        model = SiteImage
        fields = ['id', 'key', 'label', 'image', 'alt_text', 'updated_at']
        read_only_fields = ['id', 'label', 'updated_at']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'title_ne', 'sector', 'sector_ne', 'image',
            'show_on_home', 'display_order', 'is_active', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'quote', 'quote_ne', 'source', 'source_ne', 'display_order', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']
