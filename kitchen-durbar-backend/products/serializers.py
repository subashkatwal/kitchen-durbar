from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'icon', 'price', 'description', 'is_featured', 'created_at']
        read_only_fields = ['id', 'icon', 'created_at']
