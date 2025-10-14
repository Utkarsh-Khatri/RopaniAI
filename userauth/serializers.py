from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['full_name', 'phone_number', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],  # email as username
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            phone_number=validated_data['phone_number'],
            password=validated_data['password']
        )
        return user
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
