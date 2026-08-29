from rest_framework import serializers

from .models import Advertisement


class AdvertisementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisement
        fields = [
            'id', 'title', 'image', 'link_url', 'position', 'is_active',
            'start_date', 'end_date', 'priority', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']
