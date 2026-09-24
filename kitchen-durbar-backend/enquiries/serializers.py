from rest_framework import serializers

from .models import Enquiry


class EnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry
        fields = ['id', 'name', 'company', 'phone', 'email', 'message', 'is_handled', 'created_at']
        read_only_fields = ['id', 'is_handled', 'created_at']

    def validate(self, attrs):
        for field in ('name', 'company', 'phone', 'message'):
            if field in attrs:
                attrs[field] = attrs[field].strip()
        for field in ('name', 'phone', 'message'):
            if field in attrs and not attrs[field]:
                raise serializers.ValidationError({field: 'This field may not be blank.'})
        return attrs


class EnquiryAdminUpdateSerializer(serializers.ModelSerializer):
    """Admin-only: the only thing staff change on an enquiry is its handled flag."""

    class Meta:
        model = Enquiry
        fields = ['is_handled']
