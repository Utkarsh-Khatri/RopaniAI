from django.urls import path
from .views import ProfileView, ProfileUpdateView, MyPropertyListView

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile_update'),
    path('my-properties/', MyPropertyListView.as_view(), name='my_properties'),
]
