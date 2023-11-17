from django.db import models
from django.utils import timezone

from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    user_type = models.CharField(max_length=20)
    def __str__(self):
        return f"{self.username} ({self.user_type})"    

class Ticket(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    apartment = models.PositiveIntegerField() 
    contact=models.CharField(max_length=12, default='Has not been provided')

    
    CATEGORY_CHOICES = (
    ('electricity', 'Electricity'),
    ('plumber', 'Plumber'),
    ('structures', 'Structures'),
    ('locksmith', 'Locksmith'),
    )
    category = models.CharField(
    max_length=20,
    choices=CATEGORY_CHOICES,
    default='electricity',
    )

    created_at = models.DateTimeField(default=timezone.now)  # Import timezone

    comments = models.TextField(default='No comments yet')  # Add the 'comments' field with a default value

    STATUS_CHOICES = (
    ('reported', 'Reported'),
    ('assigned', 'Assigned'),
    ('solved', 'Solved'),
    )
    status = models.CharField(
    max_length=20,
    choices=STATUS_CHOICES,
    default='reported',
    )

    picture = models.ImageField(upload_to='ticket_pictures/', blank=True, null=True)  # New field for pictures

    def __str__(self):
        return f"{self.user} on apartment {self.apartment}. {self.title}"

# superuser: angel password
