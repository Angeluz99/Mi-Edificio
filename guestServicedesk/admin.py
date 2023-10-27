from django.contrib import admin

# Register your models here.
from .models import CustomUser, Ticket

admin.site.register(CustomUser)
admin.site.register(Ticket)
