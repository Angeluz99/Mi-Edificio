// Define viewTicketButtons globally
const viewTicketButtons = [];
const statusInput = document.getElementById("status");
const commentsInput = document.getElementById("comments");
// Function to load and display all guest tickets in maintenanceindex.html
function loadGuestTickets() {
    const allUsersTicketsContainer = document.getElementById("allusersTickets");
    const ticketForm = document.getElementById("ticketForm");
    const formTitle = document.getElementById("formTitle");

    const updateButton = document.getElementById("updateButton");
    const ticketImage = document.getElementById("ticketImage");

    // Make an AJAX request to the server to get all tickets of all guests for maintenance index
    fetch('/get_guest_tickets/')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("consolelog(data)", data);
                const guestTickets = data.guest_tickets;

                // Clear any previous content in the container
                allUsersTicketsContainer.innerHTML = '';

                // Loop through the guest tickets and add them to the container
                guestTickets.forEach(ticket => {
                    const ticketDiv = document.createElement("div");
                    ticketDiv.innerHTML = `
                    <div class=" col-6 bg-info text-center border rounded  border-success m-3 d-flex flex-column align-self-start">

                        <h6 class="text-light" ><i class="bi bi-door-closed"></i> ${ticket.apartment}. Ticket ${ticket.id}. </h6>
                        <h5><i class="bi bi-person-rolodex"></i> By ${ticket.username} at ${ticket.created_at}</h5>
                        <p><i class="bi bi-telephone-inbound-fill"></i> ${ticket.contact}</p>
                        <h5 class="text-light"> <strong>${ticket.title}</strong>. ${ticket.description}</h5>                       
                        <p><i class="bi bi-tools"></i> ${ticket.category}</p>
                        <h6>Comments: ${ticket.comments}</h6>
                        <h5 class="text-light">Status: ${ticket.status}</h5>

                        <button class="viewTicketButton btn btn-secondary" data-id="${ticket.id}">See picture and update ticket</button>
                    </div>
                    `;
                    allUsersTicketsContainer.appendChild(ticketDiv);
                });

                // Add event listeners for "View Ticket" buttons
                viewTicketButtons.length = 0; // Clear the array before populating
                document.querySelectorAll(".viewTicketButton").forEach(button => {
                    viewTicketButtons.push(button);
                    button.addEventListener("click", () => {
                        const ticketID = button.getAttribute("data-id");

                        // Show the form and populate it with ticket data
                        ticketForm.style.display = "block";
                        ticketForm.style.position = "fixed";

                        formTitle.innerText = `Ticket ${ticketID}`;

                        // Find the selected ticket in the guestTickets array
                        const selectedTicket = guestTickets.find(ticket => String(ticket.id) === ticketID);

                        if (selectedTicket) {
                            // Populate the image container with the ticket's image
                            if (selectedTicket.picture) {
                                ticketImage.src = selectedTicket.picture;
                                ticketImage.style.display = "block"; // Show the image container
                            } else {
                                ticketImage.style.display = "none"; // Hide the image container
                            }

                            // Populate comments and status inputs
                            statusInput.value = selectedTicket.status;
                            commentsInput.value = selectedTicket.comments;
                            console.log(selectedTicket.status);
                        } else {
                            // Handle the case where the selected ticket is not found
                            console.error("Selected ticket not found");
                            // Clear the image container, comments, and status inputs
                            ticketImage.src = '';
                            ticketImage.style.display = "none"; // Hide the image container
                            statusInput.value = '';
                            commentsInput.value = '';
                        }

                        updateButton.setAttribute("data-id", ticketID); // Set the ticket ID for the "Update" button
                    });
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

// Call the function to load all guest tickets when the page loads
loadGuestTickets();

// Function to close the form
document.getElementById("cancelTicket").addEventListener("click", () => {
    document.getElementById("ticketForm").style.display = "none";
});

// Function to submit the update for a specific ticket in maintenance
document.getElementById("updateButton").addEventListener("click", () => {
    const ticketID = document.getElementById("updateButton").getAttribute("data-id");
    const status = document.getElementById("status").value;
    const comments = document.getElementById("comments").value;

    const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

    fetch(`/update_ticket/${ticketID}/?status=${status}&comments=${comments}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `status=${status}&comments=${comments}`,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Handle success, maybe update the UI
            console.log('comments and status updated');

            // For example, close the update form
            document.getElementById("ticketForm").style.display = "none";
            // You may also want to update the ticket information on the page
            loadGuestTickets();
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

function submitNotification() {
    function ReactTest() {
        return (
          <div >
                <h1>Ticket updated!</h1> 
          </div>
        );
      }
      ReactDOM.render(<ReactTest />, document.getElementById('submittedNotification'));
      setTimeout(() => {
          ReactDOM.unmountComponentAtNode(document.getElementById('submittedNotification'));
        }, 3000); 
}

// Search handle the Apartment number and Category search
document.getElementById("searchButton").addEventListener("click", () => {
    const apartmentNumber = document.getElementById("apartmentNumber").value;
    const category = document.getElementById("categorySearch").value;  // Get the selected category

    let url = '/get_guest_tickets/?'; // Initialize the URL

    if (apartmentNumber) {
        url += `apartmentNumber=${apartmentNumber}&`; // Include apartment number in the URL if it's selected
    }

    if (category) {
        url += `category=${category}&`; // Include category in the URL if it's selected
    }

    // Remove the trailing '&' from the URL if no filters are selected
    if (url.endsWith('&')) {
        url = url.slice(0, -1);
    }
    // Make an AJAX request to filter tickets by apartment number
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const guestTickets = data.guest_tickets;
                const allUsersTicketsContainer = document.getElementById("allusersTickets");

                // Clear any previous content in the container
                allUsersTicketsContainer.innerHTML = '';

                // Loop through the filtered guest tickets and add them to the container
                guestTickets.forEach(ticket => {
                    const ticketDiv = document.createElement("div");
                    ticketDiv.innerHTML = `
                    <div class=" col-6 bg-info text-center rounded border border-success m-3 d-flex flex-column align-self-start">

                        <h6 class="text-light" ><i class="bi bi-door-closed"></i> ${ticket.apartment}. Ticket ${ticket.id}. </h6>
                        <h5><i class="bi bi-person-rolodex"></i> By ${ticket.username} at ${ticket.created_at}</h5>
                        <p><i class="bi bi-telephone-inbound-fill"></i> ${ticket.contact}</p>
                        <h5 class="text-light"> <strong>${ticket.title}</strong>. ${ticket.description}</h5>                       
                        <p><i class="bi bi-tools"></i> ${ticket.category}</p>
                        <h6>Comments: ${ticket.comments}</h6>
                        <h5 class="text-light">Status: ${ticket.status}</h5>

                        <button class="viewTicketButton btn btn-secondary" data-id="${ticket.id}">See picture and update ticket</button>
                    </div>
                    `;
                    allUsersTicketsContainer.appendChild(ticketDiv);
                });

                // Add event listeners for "View Ticket" buttons
                viewTicketButtons.length = 0; // Clear the array before populating
                document.querySelectorAll(".viewTicketButton").forEach(button => {
                    viewTicketButtons.push(button);
                    button.addEventListener("click", () => {
                        const ticketID = button.getAttribute("data-id");

                        // Show the form and populate it with ticket data
                        ticketForm.style.display = "block";
                        formTitle.innerText = `Ticket ${ticketID}`;

                        // Find the selected ticket in the guestTickets array
                        const selectedTicket = guestTickets.find(ticket => String(ticket.id) === ticketID);

                        if (selectedTicket) {
                            // Populate the image container with the ticket's image
                            if (selectedTicket.picture) {
                                ticketImage.src = selectedTicket.picture;
                                ticketImage.style.display = "block"; // Show the image container
                            } else {
                                ticketImage.style.display = "none"; // Hide the image container
                            }

                            // Populate comments and status inputs
                            statusInput.value = selectedTicket.status;
                            commentsInput.value = selectedTicket.comments;
                        } else {
                            // Handle the case where the selected ticket is not found
                            console.error("Selected ticket not found");
                            // Clear the image container, comments, and status inputs
                            ticketImage.src = '';
                            ticketImage.style.display = "none"; // Hide the image container
                            statusInput.value = '';
                            commentsInput.value = '';
                        }

                        updateButton.setAttribute("data-id", ticketID); // Set the ticket ID for the "Update" button
                    });
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
});

function reArrangeHandler() {
    document.querySelector("#allusersTickets").classList.toggle("d-flex");
}
