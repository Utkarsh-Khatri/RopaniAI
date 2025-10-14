from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from .serializers import RegisterSerializer, LoginSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "message": "Registration successful.",
            "token": token.key,
            "email": user.email,
            "full_name": user.full_name
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        # ✅ Use username=email here
        user = authenticate(request, username=email, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "message": "Login successful.",
                "token": token.key,
                "email": user.email,
                "full_name": user.full_name
            }, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
