from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Property

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'phone_number', 'address']


class PropertySerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='owner.full_name', read_only=True)

    class Meta:
        model = Property
        fields = ['id', 'title', 'location', 'area', 'price', 'image', 'seller_name']
