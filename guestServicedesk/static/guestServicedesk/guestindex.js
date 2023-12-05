const openButton = document.getElementById("openTicketFormButton");
const ticketForm = document.getElementById("ticketForm");
const submitButton = document.getElementById("submitTicket");
const cancelButton = document.getElementById("cancelTicket");
const userTicketsContainer = document.getElementById("userTickets"); // Moved this outside the function
const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

/// Function to load and display the user's tickets, including titles and descriptions
function loadUserTickets() {
    const userTicketsContainer = document.getElementById("userTickets");

    // Make an AJAX request to the server to get user-specific tickets
    fetch('/get_user_tickets/') // Adjust the URL if necessary
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.success) {
                const tickets = data.tickets; // Assuming the response contains user-specific tickets

                // Clear any previous content in the container
                userTicketsContainer.innerHTML = '';

                // Loop through the tickets and add them to the container
                tickets.forEach(ticket => {
                    const ticketDiv = document.createElement("div");
                    console.log(ticket.id)

                    ticketDiv.innerHTML = `
                    <div id="ticket-guest" class=" container bg-info border rounded  border-light m-5 text-light">
                        <div class="row bg-dark" >
                            <p class=" col-6 " ><i class="bi bi-ticket-detailed"></i> Ticket ${ticket.id}</p>
                            <p class="col-6 text-light d-flex justify-content-end"><i class="bi bi-door-closed"></i>Apartment ${ticket.apartment}</p>
                        </div>
                        <div class="row d-flex justify-conten-between " >
                            <h3 class="col-8 "> <p id="issue"> Issue:</p>${ticket.title}</h3>
                            <h4 class="col-4 "><p id="category" >Category:</p> ${ticket.category}</h4>
                        </div>
                        <div class="row text-center " >
                            <h5 class="col-12"><p id="description">Description: </p>${ticket.description}</h5>
                        </div>
                        <div class="row bg-primary" >
                            <h4 class=" col-6 text-light"> <p id="status">Status: </p> ${ticket.status}</h4>
                        </div>
                        <div class="row text-center bg-primary" >
                            <h5 class=" col-12"><p id="comments">Staff comments:</p> ${ticket.comments}</h5>
                        </div>
                        <div class="row  d-flex justify-content-between " >
                            <p class=" col-6 text-light">Created at ${ticket.created_at}</p>
                            <a href="#" id="delete-button" class=" col-3 delete-ticket  btn btn-dark" data-ticket-id="${ticket.id}">Delete</a>
                        </div>
                    </div>
                    `;
                    userTicketsContainer.appendChild(ticketDiv);
                });
            } else {
                // Handle errors
                console.error(data.message);
            }
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
}


// Function to fetch and display status for a specific ticket
function displayTicketStatus(ticketID) {
    // Make an AJAX request to the server to get status for the specified ticket
    fetch(`/get_ticket_status/?ticket_id=${ticketID}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const status = data.status; // Assuming the response contains status
                // Display the status in a popup or modal
                alert(`Status for Ticket ID ${ticketID}:\n${status}`);
            } else {
                // Handle errors
                console.error(data.message);
            }
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
}

// Function to open the form as a pop-up
openButton.addEventListener("click", () => {
    ticketForm.style.display = "block";
});

// Function to close the pop-up
cancelButton.addEventListener("click", () => {
    ticketForm.style.display = "none";
});

// Handler to Submit a New ticket
submitButton.addEventListener("click", () => {
    // Retrieve data from the form fields
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const apartment = document.getElementById("apartmentNumber").value;
    const contact = document.getElementById("contact").value;

    const pictureInput = document.getElementById("picture"); // Get the file input element
    const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

    // Check if a file was selected
    if (pictureInput.files.length === 0) {
        alert("Please select a picture to upload.");
        return; // Do not submit the form without a picture
    }

    // Create a FormData object and append all form fields
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('apartment', apartment);
    formData.append('picture', pictureInput.files[0]); // Append the selected file
    formData.append("contact", contact); // Include the contact field

    // Send the form data to the server
    fetch('/submit_ticket/', { // URL points to 'views.submit_ticket'
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // The ticket was successfully submitted
            console.log(data.message);

            // You can close the form here if needed
            ticketForm.style.display = "none";

            // Call loadUserTickets to update the ticket list
            loadUserTickets();
        } else {
            // Handle errors
            console.error(data.message);
        }
    })
    .catch(error => {
        // Handle any errors, e.g., display an error message
        console.error(error);
    });
});


function submitNotification(){
    function ReactTest() {

        return (
          <div >
      
                <h1>Ticket submitted. Thanks!</h1> 
      
          </div>
        );
      }
      
      ReactDOM.render(<ReactTest />, document.getElementById('submittedNotification'));
      
      setTimeout(() => {
          ReactDOM.unmountComponentAtNode(document.getElementById('submittedNotification'));
        }, 4000); 
}
// Delete ticket
// Attach an event listener to the parent container using event delegation
userTicketsContainer.addEventListener('click', (event) => {
    const target = event.target;

    // Check if the clicked element has the class 'delete-ticket'
    if (target.classList.contains('delete-ticket')) {
        event.preventDefault(); // Prevent the link from navigating

        const ticketID = target.getAttribute('data-ticket-id');

        // Make an AJAX request to delete the ticket
        fetch(`/delete_ticket/${ticketID}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken, // Ensure you have csrfToken defined
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Ticket deleted successfully, update the ticket list
                loadUserTickets();
            } else {
                // Handle errors
                console.error(data.message);
            }
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
    }
});




// Call the function when the page loads
loadUserTickets(); // Now called when the page loads

