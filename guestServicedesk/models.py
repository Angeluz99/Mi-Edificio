from django.db import models

from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    user_type = models.CharField(max_length=20)
    

class Ticket(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)