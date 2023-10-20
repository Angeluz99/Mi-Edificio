from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),  
    path('guest_index/', views.guest_index, name='guest_index'),
    path('maintenance_index/', views.maintenance_index, name='maintenance_index'),
]