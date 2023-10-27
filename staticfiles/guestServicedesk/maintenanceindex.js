// Function to load and display all guest tickets in maintenanceindex.html
function loadGuestTickets() {
    const allUsersTicketsContainer = document.getElementById("allusersTickets");
    const ticketForm = document.getElementById("ticketForm");
    const formTitle = document.getElementById("formTitle");
    const statusInput = document.getElementById("status");
    const commentsInput = document.getElementById("comments");
    const updateButton = document.getElementById("updateButton");

    // Make an AJAX request to the server to get all guest tickets
    fetch('/get_guest_tickets/')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const guestTickets = data.guest_tickets;

                // Clear any previous content in the container
                allUsersTicketsContainer.innerHTML = '';

                // Loop through the guest tickets and add them to the container
                guestTickets.forEach(ticket => {
                    const ticketDiv = document.createElement("div");
                    ticketDiv.innerHTML = `
                        <p>ID: ${ticket.id}</p>
                        <p>Created At: ${ticket.created_at}</p>
                        <p>Apartment: ${ticket.apartment}</p>
                        <p>Title: ${ticket.title}</p>
                        <p>Description: ${ticket.description}</p>
                        <img src="${ticket.picture}" alt="Ticket Picture" />  <!-- Display the picture -->

                        <p>Category: ${ticket.category}</p>
                        <p>Comments: ${ticket.comments}</p>
                        <p>Status: ${ticket.status}</p>

                        <button class="viewTicketButton" data-id="${ticket.id}">Update Ticket</button>
                    `;
                    allUsersTicketsContainer.appendChild(ticketDiv);
                });

                // Add event listeners for "View Ticket" buttons
                const viewTicketButtons = document.querySelectorAll(".viewTicketButton");
                viewTicketButtons.forEach(button => {
                    button.addEventListener("click", () => {
                        const ticketID = button.getAttribute("data-id");

                        // Show the form and populate it with ticket data
                        ticketForm.style.display = "block";
                        formTitle.innerText = `View Ticket ID: ${ticketID}`;
                        statusInput.value = ''; // Clear status input
                        commentsInput.value = ''; // Clear comments input
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


// Function to submit the update for a specific ticket
document.getElementById("updateButton").addEventListener("click", () => {
    const ticketID = document.getElementById("updateButton").getAttribute("data-id");
    const status = document.getElementById("status").value;
    const comments = document.getElementById("comments").value;

    const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

    fetch(`/update_ticket/${ticketID}/`, {
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
            console.log('comments and status updated')
            
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
