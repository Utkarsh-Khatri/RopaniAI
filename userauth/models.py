from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20, unique=True)

    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # keep username internally required

    def __str__(self):
        return self.email
