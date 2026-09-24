from rest_framework import serializers

from .models import TeamMember


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role', 'bio', 'photo', 'display_order', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']
