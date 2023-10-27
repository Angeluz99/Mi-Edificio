from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),  
    path('guest_index/', views.guest_index, name='guest_index'),
    path('maintenance_index/', views.maintenance_index, name='maintenance_index'),
    path('submit_ticket/', views.submit_ticket, name='submit_ticket'),
    path('get_user_tickets/', views.get_user_tickets, name='get_user_tickets'),
    path('get_guest_tickets/', views.get_guest_tickets, name='get_guest_tickets'),
    path('update_ticket/<int:ticket_id>/', views.update_ticket, name='update_ticket'),
    path('get_ticket_status/<int:ticket_id>/', views.get_ticket_status, name='get_ticket_status'),

]