
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import CustomUser 


def register_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user_type = request.POST['user_type']
        user = CustomUser.objects.create_user(username=username, password=password, user_type=user_type)
        login(request, user)
        return redirect('login')  # Redirect to the login page after registration

    return render(request, 'guestServicedesk/register.html')

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            if user.user_type == 'guest':
                return redirect('guest_index')
            elif user.user_type == 'maintenance':
                return redirect('maintenance_index')
    else:
        form = AuthenticationForm()

    return render(request, 'guestServicedesk/login.html', {'form': form})

@login_required
def guest_index(request):
    return render(request, 'guestServicedesk/guestindex.html')

@login_required
def maintenance_index(request):
    return render(request, 'guestServicedesk/maintenanceindex.html')