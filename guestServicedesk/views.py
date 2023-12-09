from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser, Ticket
from django.http import JsonResponse
from django.template.defaultfilters import date as date_filter


def submit_ticket(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        category = request.POST.get('category')
        apartment = request.POST.get('apartment')
        picture = request.FILES.get('picture') 
        contact = request.POST.get('contact')  # Retrieve the contact field
 # Get the uploaded picture file

        try:
            new_ticket = Ticket(
                title=title,
                description=description,
                category=category,
                apartment=apartment,
                user=request.user,
                contact=contact,
                picture=picture,  # Save the picture in the database
            )
            new_ticket.save()

            return JsonResponse({'success': True, 'message': 'Ticket submitted successfully'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Error: ' + str(e)})
    return HttpResponseBadRequest("Invalid request")


#displays all tickets created from the current loged user.
def get_user_tickets(request):
    if request.user.is_authenticated:
        user = request.user
        tickets = Ticket.objects.filter(user=user)
        ticket_data = []
        for ticket in tickets:
            ticket_data.append({
                'id': ticket.id,
                'title': ticket.title,
                'description': ticket.description,
                'category': ticket.category,
                'apartment' : ticket.apartment,
                'status': ticket.status,
                'comments' : ticket.comments,  
                'contact' : ticket.contact,
                'created_at': date_filter(ticket.created_at, "F j, Y, g:i a"),  # Format the date
                # Add more ticket details as needed
            })
        return JsonResponse({'success': True, 'tickets': ticket_data})
    return JsonResponse({'success': False, 'message': 'User not authenticated'})



def get_ticket_status(request, ticket_id):
    try:
        # Retrieve the ticket with the specified ID
        ticket = Ticket.objects.get(pk=ticket_id)
        
        # Get the status of the ticket
        status = ticket.get_status_display()
        
        return JsonResponse({'success': True, 'status': status})
    except Ticket.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Ticket not found'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Error: ' + str(e)})






# Shows all tickets on maintenanceindex
# Updated get_guest_tickets view to include apartment number filter
def get_guest_tickets(request):
    if request.user.is_authenticated:
        apartment_number = request.GET.get('apartmentNumber', None)
        category = request.GET.get('category', None)  # Add category parameter
        
        guest_tickets = Ticket.objects.select_related('user').all()
        
        if apartment_number is not None:
            guest_tickets = guest_tickets.filter(apartment=apartment_number)

        if category is not None:  # Filter by category
            guest_tickets = guest_tickets.filter(category=category)

        ticket_data = []
        for ticket in guest_tickets:
            ticket_data.append({
                'id': ticket.id,
                'apartment': ticket.apartment,
                'contact' : ticket.contact,       
                'title': ticket.title,
                'description': ticket.description,
                'category': ticket.get_category_display(),
                'comments': ticket.comments,
                'status': ticket.get_status_display(),
                'created_at': date_filter(ticket.created_at, "F j, Y, g:i a"),
                'username': ticket.user.username,
                'picture': request.build_absolute_uri(ticket.picture.url) if ticket.picture else '',
            })

        return JsonResponse({'success': True, 'guest_tickets': ticket_data})
    return JsonResponse({'success': False, 'message': 'User not authenticated'})



# to post status and comments 
def update_ticket(request, ticket_id):
    response_data = {'success': False, 'message': 'Invalid request'}

    if request.method == 'POST':
        status = request.POST.get('status')
        comments = request.POST.get('comments')

        try:
            # Retrieve the ticket
            ticket = Ticket.objects.get(pk=ticket_id)

            # Update the ticket with the new status and comments
            ticket.status = status
            ticket.comments = comments
            ticket.save()

            response_data = {'success': True, 'message': 'Ticket updated successfully'}
        except Ticket.DoesNotExist:
            response_data['message'] = 'Ticket not found'
        except Exception as e:
            response_data['message'] = 'Error: ' + str(e)

    return JsonResponse(response_data)

def delete_ticket(request, ticket_id):
    try:
        ticket = Ticket.objects.get(pk=ticket_id)
        ticket.delete()
        return JsonResponse({"success": True, "message": "Ticket deleted successfully"})
    except Ticket.DoesNotExist:
        return JsonResponse({"success": False, "message": "Ticket not found"})
    except Exception as e:
        return JsonResponse({"success": False, "message": f"Error: {str(e)}"})



# View for user registration
def register_view(request):
    if request.method == 'POST':
        # Retrieve user data from the registration form
        username = request.POST['username']
        password = request.POST['password']
        user_type = request.POST['user_type']
        
        # print(f"Registering user: {username}, Type: {user_type}")

        # Create a new user using the CustomUser model
        user = CustomUser.objects.create_user(username=username, password=password, user_type=user_type)
        
        # Log in the user. The login function takes the user's information and, after successful authentication, creates a session for that user. This session information is stored on the server.
        login(request, user)
        
        # Redirect to the login page after registration
        return redirect('login') 

    # Render the registration form template if it's a GET request
    return render(request, 'guestServicedesk/register.html')

# View for user login
def login_view(request):
    if request.method == 'POST':
        # Create an authentication form using the POST data
        form = AuthenticationForm(request, request.POST)
        
        # Check if the form data is valid
        if form.is_valid():
            user = form.get_user()
            # Log in the user
            login(request, user)
            
            # Redirect to the appropriate index page based on the user type
            if user.user_type == 'guest':
                return redirect('guest_index')
            elif user.user_type == 'maintenance':
                return redirect('maintenance_index')
    else:
        # Create an empty authentication form if it's not a POST request
        form = AuthenticationForm()

    # Render the login form template with the form
    return render(request, 'guestServicedesk/login.html', {'form': form})

# View for guest index (requires login)
@login_required
def guest_index(request):
    return render(request, 'guestServicedesk/guestindex.html')

# View for maintenance index (requires login)
@login_required
def maintenance_index(request):
    return render(request, 'guestServicedesk/maintenanceindex.html')
