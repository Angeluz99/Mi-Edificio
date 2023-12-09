DESCRIPTION:
This app allows guests and tenants to report maintenance issues in their apartments. The reports in ticket format are shown in an independent page for staff users which allow them to review, comment and update the tickets to inform guest users the follow-up of their report.

DISTINCTIVENESS and COMPLEXITY: 
This app is distinctive to the previous projects, due to his practical application, which allow 2 different type of users to be part of the resolution of a problem. This is the first time in the course when there are 2 different user interfaces. 

It is also distinctive in terms of technologies used, since it required the use of almost all the resources we learned in the lectures. The app includes 2 languages, Python and JavaScript; 2 frameworks Django and Bootstrap; the library ReactJS, as well as the essentials for layout, HTML and CSS.

Focused on complexity, it is also the first project where tests were applied. The developing included to program 3 different tests. Two in order to ensure the correct registration, log in and redirection of both type of users, and a test to ensure the correct ticket flow process. The tests are performed using the library Selenium and ChromeDriver. Those will be run in the demo video.

Also, in order to reduce the code files extension, most of the app is styled using bootstrap, which required a clear comprehension of Bootstrap layout. Icons and components were also used to improve the design. In the CSS work, media queries were used to adjust positioning and sizing of the fixed form elements for mobile devices. 

Since the app allows guest users to upload images to illustrate the problem, it was needed to find, install and configure a Python library that works in Django context, it was Pillow the best option to process picture files.

To finalize, it was also the first project where using Git was imperative, due to the complexity of building an app from scratch and handling different methods that achieve the same functionality.

DIRECTORY:
The app guestServiceDesk inside the Capstone project includes the next relevant code directories:
guestServiceDesk/
models.py: 
Defines the data models for the Django application in the guest service desk project. 

CustomUser (extends AbstractUser): with the added field user_type: CharField, representing the type of user ('guest' or 'maintenance').

Ticket:
Description: TextField for a detailed description of the ticket.
User: Representing the user associated with the ticket.
Apartment: PositiveIntegerField for the apartment number associated with the ticket.
Contact: CharField with a maximum length of 12 characters for the contact information.
Category: CharField with choices for different ticket categories (e.g., 'electricity', 'plumber').
Created_at: DateTimeField representing the date and time the ticket was created, with a default value of the current timezone.
Comments: TextField for additional comments on the ticket, with a default value of 'No comments yet'.
Status: CharField with choices for different ticket statuses (e.g., 'reported', 'assigned', 'solved').
Picture: ImageField for uploading pictures associated with the ticket, stored in the 'ticket_pictures/' directory.

The __str__ method returns a string representation of the ticket, including the associated user, apartment number, and title.


urls.py: 
Defines the URL patterns for routing HTTP requests and API calls to the appropriate views in the guest service desk application.

views.py:
These functions collectively implement the logic for user authentication, ticket submission, retrieval, and management within the Django application. They interact with the database models to create, update, and retrieve data, and they also handle user authentication and session management.

submit_ticket(request):
Handles the submission of a new ticket.
Retrieves ticket information from the POST request, including title, description, category, apartment, contact, and picture.
Creates a new Ticket object and saves it to the database.
Returns a JsonResponse indicating the success or failure of the operation.

get_user_tickets(request):
Retrieves all tickets associated with the currently logged-in user.
Formats the ticket data and returns it as a JsonResponse.

get_ticket_status(request, ticket_id):
Retrieves the status of a specific ticket identified by the ticket_id.
Returns the ticket status as a JsonResponse.

get_guest_tickets(request):
Retrieves tickets for display in the guest index.
Supports optional filtering by apartment number and category.
Formats ticket data and returns it as a JsonResponse.

update_ticket(request, ticket_id):
Handles the update of a ticket's status and comments.
Retrieves new status and comments from the POST request.
Updates the ticket in the database and returns a JsonResponse indicating success or failure.

delete_ticket(request, ticket_id):
Deletes a ticket with the specified ticket_id.
Returns a JsonResponse indicating success or failure.

register_view(request):
Handles user registration.
Retrieves username, password, and user type from the registration form.
Creates a new CustomUser object and logs in the user.
Redirects to the login page after successful registration.

login_view(request):
Handles user login.
Uses Django's built-in AuthenticationForm to authenticate the user.
Logs in the user and redirects them to the appropriate index page based on their user type.

guest_index(request):
Renders the guest index page as requires the user to be logged in as a guest.

maintenance_index(request):
Renders the maintenance index page, it requires the user to be logged in as maintenance.

tests.py:
Each test case focuses on a specific functionality of the web application, covering user registration, login, ticket creation, and ticket visibility for maintenance users. These tests use Selenium WebDriver for browser automation to interact with the web pages and assert that the expected behavior is achieved.

GuestRegisterLogSeleniumTest: It navigates to the registration page, fills in the form, submits it, and then logs in with the registered credentials. The test asserts the successful login by checking the current URL, ensuring a seamless guest user registration and login flow.

MaintenanceRegisterLogSeleniumTest: Similar to the GuestRegisterLogSeleniumTest, this test focuses on the registration and login functionality, but for a maintenance user. It interacts with the registration form, submits it, and verifies the successful login by checking the current URL. The test ensures that maintenance users can register and log in without issues.

TickeFlowSeleniumTest: This test covers the entire flow of logging in as a guest, creating a ticket, logging out, logging back in as maintenance, and verifying the visibility of the ticket in the maintenance index. Finally, it logs back in as the guest to delete the ticket. This test ensures a smooth end-to-end process for creating and managing tickets in the application.


static/
guestindex.js:
loadUserTickets function: It fetches and displays user-specific tickets from the server.
It makes an AJAX request to the server endpoint /get_user_tickets/.
If the request is successful, it dynamically creates HTML elements for each ticket and appends them to userTicketsContainer.

displayTicketStatus Function: It fetches and displays the status of a specific ticket using an AJAX request. It shows a simple alert with the status and handles errors if the request fails.

submitNotification Function: It creates a React component (using ReactDOM) to display a notification indicating that a ticket has been successfully submitted.
It renders the component and automatically removes it after 4 seconds.

Event listeners to handle interactions with the ticket form.
Clicking on the "Open Form" button displays the form.
Clicking on the "Cancel" button hides the form.
Clicking on the "Submit" button triggers the submission process, including form data validation and sending the data to the server.

Delete Ticket Event Listener: It uses event delegation to check if the clicked element has the class 'delete-ticket'.
If a delete button is clicked, it prevents the default link behavior, gets the associated ticket ID, and makes an AJAX request to delete the ticket.
It updates the ticket list if the deletion is successful.

At the end, it calls the loadUserTickets function when the page loads to initially load and display user-specific tickets.
	

maintenanceindex.js:
loadGuestTickets Function: it fetches and displays tickets submitted by guests for maintenance staff.
It makes an AJAX request to the server endpoint /get_guest_tickets/. If the request is successful, it dynamically creates HTML elements for each guest ticket and appends them to allUsersTicketsContainer.
It adds event listeners to "View Ticket" buttons, allowing staff to view and update individual tickets and handles errors if the request fails.

Event Listeners for Closing Form and Updating Ticket: The first event listener closes the ticket update form when the "Cancel" button is clicked.
The second event listener handles the update of a specific ticket. It sends a POST request to /update_ticket/ with the updated status and comments.

submitNotification Function: creates a React component (using ReactDOM) to display a notification indicating that a ticket has been successfully updated.
It renders the component and automatically removes it after 3 seconds.

Search Button Event Listener: This event listener handles the search functionality based on apartment number and category.
It constructs a URL with query parameters for the search criteria and makes an AJAX request to get filtered tickets. Then updates the displayed tickets based on the search results.

reArrangeHandler Function: Toggles the CSS class d-flex on the container with the ID allusersTickets. It is related to flexbox styling, toggling the flex-column-reverse to a non-flex display.

Finally it calls the loadGuestTickets function when the page loads to initially load and display guest tickets.

style.css
It styles the page, mostly used for getting the Google fonts trough and improve the responsiveness with media queries.

templates/guestServiceDesk/

layout.html: It extends its head to all the other templates. Contains the scripts and links needed to use React and bootstrap, as well as the stylesheet to our CSS file.

register.html: The form includes fields for creating a username, password, and selecting a user type (either "Guest" or "Maintenance"). The form is submitted using the POST method and includes a CSRF token for security. Additionally, there is a link to the login page for users who already have an account. Overall, the HTML template provides a clean and visually appealing interface for user registration in the guest service desk application.

login.html:Users are prompted to input their username and password, with corresponding fields marked as required. The form utilizes the POST method and includes a CSRF token for security. Upon submission, the form triggers the login process. A "Login" button initiates the action, and a hyperlink below directs users to the registration page if they do not have an account.

guestindex.html: It features a welcoming header displaying the user's username, an image logo, and navigation buttons for creating tickets and logging out. The main content includes a hidden ticket creation form that becomes visible on button click. The form captures ticket details such as title, description, category, contact number, apartment, and an optional picture upload. The user's submitted tickets are dynamically displayed below, each in a well-structured format containing essential information. 
The template incorporates JavaScript functionalities for populating apartment numbers and enabling smooth scrolling to the top.

maintenanceindex.html: Renders a header displaying a welcome message with the staff member's username, a logo image, and navigation options to toggle timeline order and log out. The main content includes a search section allowing staff to filter tickets by apartment number and category, along with a notification area for displaying updates. The ticket display area dynamically lists all tickets, presenting essential details such as apartment, category, and ticket status. 
Maintenance users can also update the status and add comments using a hidden form that becomes visible on button click. 
The template concludes with a script section for populating apartment numbers and scrolling to the top.


HOW TO RUN THE APP:
git clone https://github.com/Angeluz99/Capstone.git
cd Capstone
pip install -r requirements.txt

When the dependent packages are installed, you can run this command to run your server.
python manage.py runserver

Run those following commands to migrate database.
python manage.py makemigrations
python manage.py migrate


FINALLY, I WANT TO THANK THE CS50 TEAM FOR GIVING US THE OPPORTUNITY TO BECOME WEB DEVELOPERS.